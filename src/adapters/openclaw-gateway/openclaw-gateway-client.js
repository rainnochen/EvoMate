/**
 * openclaw-gateway-client.js
 * EvoMate → OpenClaw Gateway WebSocket Client
 *
 * 协议说明（来自 openclaw-main 源码分析）：
 * 1. 连接 ws://127.0.0.1:18789
 * 2. 等待服务端发来 { type:"event", event:"connect.challenge", payload:{nonce:string} }
 * 3. 发送 connect 请求（携带 token 鉴权）
 * 4. 等待 { type:"res", ok:true, payload:{type:"hello-ok"} } 响应
 * 5. 此后可任意发送 method req，订阅 event
 */

import { WebSocket } from 'ws';

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';

// Protocol version from openclaw-main/src/gateway/protocol/
const PROTOCOL_VERSION = 7;

let _reqIdCounter = 1;
function nextReqId() {
  return `evomate-${_reqIdCounter++}`;
}

/**
 * 连接到 OpenClaw Gateway，完成握手，返回一个可用的 client 对象
 */
export async function connectToOpenClawGateway() {
  const ws = new WebSocket(GATEWAY_URL);

  await new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });

  console.log(`[OpenClaw Gateway] Connected to ${GATEWAY_URL}`);

  // 监听所有消息，以便异步等待特定 response 或 event
  const pendingRequests = new Map();
  const eventListeners = [];

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === 'res' && msg.id) {
      const handler = pendingRequests.get(msg.id);
      if (handler) {
        pendingRequests.delete(msg.id);
        handler(msg);
      }
    }

    if (msg.type === 'event') {
      for (const listener of eventListeners) {
        listener(msg);
      }
    }
  });

  // 工具函数：等待特定 event
  function waitForEvent(eventName, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for event: ${eventName}`)), timeoutMs);
      const handler = (msg) => {
        if (msg.event === eventName) {
          clearTimeout(timer);
          eventListeners.splice(eventListeners.indexOf(handler), 1);
          resolve(msg);
        }
      };
      eventListeners.push(handler);
    });
  }

  // 工具函数：发送请求并等待对应 response
  function sendRequest(method, params = {}, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const id = nextReqId();
      const timer = setTimeout(() => {
        pendingRequests.delete(id);
        reject(new Error(`Timeout for method: ${method}`));
      }, timeoutMs);
      pendingRequests.set(id, (res) => {
        clearTimeout(timer);
        if (res.ok) {
          resolve(res.payload);
        } else {
          reject(new Error(`[${method}] failed: ${res.error?.message ?? JSON.stringify(res.error)}`));
        }
      });
      ws.send(JSON.stringify({ type: 'req', id, method, params }));
    });
  }

  // Step 1: 等待 connect.challenge（获取 nonce，用于 device signature，但我们先用 token 模式）
  // 对于 token 认证模式，无需处理 nonce，直接发送 connect + token 即可
  const challengePromise = waitForEvent('connect.challenge', 5000);
  const challenge = await challengePromise.catch(() => null);
  const nonce = challenge?.payload?.nonce;

  console.log(`[OpenClaw Gateway] Received connect.challenge, nonce: ${nonce ?? '(none)'}`);

  // Step 2: 发送 connect 请求（Token 鉴权模式）
  const connectId = nextReqId();
  const connectResponse = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('connect timeout')), 10000);
    pendingRequests.set(connectId, (res) => {
      clearTimeout(timer);
      resolve(res);
    });
    ws.send(JSON.stringify({
      type: 'req',
      id: connectId,
      method: 'connect',
      params: {
        minProtocol: PROTOCOL_VERSION,
        maxProtocol: PROTOCOL_VERSION,
        client: {
          id: 'evomate',
          version: '0.4.0',
          platform: 'node',
          mode: 'operator',
        },
        role: 'operator',
        scopes: ['operator.admin'],
        caps: [],
        commands: [],
        auth: GATEWAY_TOKEN ? { token: GATEWAY_TOKEN } : undefined,
      },
    }));
  });

  if (!connectResponse.ok) {
    ws.close();
    throw new Error(`[OpenClaw Gateway] Connect failed: ${JSON.stringify(connectResponse.error)}`);
  }

  console.log(`[OpenClaw Gateway] Connected as operator. hello-ok received.`);

  // 返回高层 API
  const client = {
    ws,

    /**
     * 获取所有 Agent 列表（等价于 openclaw agents list）
     * 返回数组，每个元素为 { id, name, ... }
     */
    async listAgents() {
      const payload = await sendRequest('agents.list', {});
      return payload?.agents ?? [];
    },

    /**
     * 获取某个 Agent 的 Identity（含 prompt / soul / SOUL.md 摘要）
     */
    async getAgentIdentity(agentId) {
      const payload = await sendRequest('agent.identity.get', { agentId });
      return payload;
    },

    /**
     * 获取某个 Agent 的 Skills 状态（技能列表，含启用状态）
     */
    async getAgentSkills(agentId) {
      const payload = await sendRequest('skills.status', { agentId });
      return payload;
    },

    /**
     * 获取某个 Agent 的 Session 列表（历史对话）
     */
    async listSessions(agentId) {
      const payload = await sendRequest('sessions.list', { agentId });
      return payload?.sessions ?? [];
    },

    /**
     * 向某个 Agent 发送一条消息，并等待回复
     * 利用 sessions.send 方法，然后监听 session.message 事件
     */
    async sendMessage(agentId, message, sessionKey = 'main', timeoutMs = 30000) {
      // 订阅 session.message 事件，等待 Agent 回复
      const replyPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          eventListeners.splice(eventListeners.indexOf(handler), 1);
          reject(new Error('Agent reply timeout'));
        }, timeoutMs);
        const handler = (msg) => {
          if (
            msg.event === 'session.message' &&
            msg.payload?.role === 'assistant' &&
            msg.payload?.agentId === agentId
          ) {
            clearTimeout(timer);
            eventListeners.splice(eventListeners.indexOf(handler), 1);
            resolve(msg.payload);
          }
        };
        eventListeners.push(handler);
      });

      // 发送消息
      await sendRequest('sessions.send', {
        agentId,
        sessionKey,
        message,
      });

      const reply = await replyPromise;
      return reply;
    },

    /**
     * 读取 Agent 的 Genome 摘要（合并 identity + skills + sessions）
     * 这是 EvoMate 用来提取父代 Genome 的核心方法
     */
    async extractGenome(agentId) {
      const [identity, skills, sessions] = await Promise.all([
        this.getAgentIdentity(agentId).catch(() => null),
        this.getAgentSkills(agentId).catch(() => null),
        this.listSessions(agentId).catch(() => []),
      ]);

      return {
        agentId,
        source: 'openclaw-gateway',
        identity,
        skills: skills?.installed ?? [],
        recentSessionCount: sessions.length,
        extractedAt: new Date().toISOString(),
      };
    },

    /** 订阅事件 */
    onEvent(handler) {
      eventListeners.push(handler);
      return () => eventListeners.splice(eventListeners.indexOf(handler), 1);
    },

    /** 断开连接 */
    close() {
      ws.close();
    },
  };

  return client;
}
