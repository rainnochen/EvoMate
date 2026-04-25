/**
 * openclaw-skill-executor.js
 * 通过 OpenClaw Gateway 向真实 Agent 发送 Skill Instruction（技能指令）
 * 并获取 Agent 的真实回复（替代 skill-engine.js 的 Mock 模式）
 */

import { connectToOpenClawGateway } from './openclaw-gateway-client.js';

let gatewayClient = null;
let isConnecting = false;

/**
 * 懒加载单例 Gateway 连接
 */
async function getGatewayClient() {
  if (gatewayClient && gatewayClient.ws.readyState === 1 /* OPEN */) {
    return gatewayClient;
  }
  if (isConnecting) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getGatewayClient();
  }
  isConnecting = true;
  try {
    gatewayClient = await connectToOpenClawGateway();
    isConnecting = false;
    return gatewayClient;
  } catch (err) {
    isConnecting = false;
    console.warn('[OpenClaw] Gateway connection failed, falling back to mock mode:', err.message);
    return null;
  }
}

/**
 * 执行技能指令：
 * - 如果 Gateway 可用，向真实 Agent 发送 instruction 并等待回复
 * - 如果 Gateway 不可用，回退到 mock-engine 模式
 */
export async function executeSkillViaGateway(agentId, instruction, mockFallback) {
  const start = Date.now();

  try {
    const client = await getGatewayClient();
    if (!client) {
      throw new Error('Gateway not available');
    }

    console.log(`[OpenClaw] Sending skill instruction to agent ${agentId}: "${instruction}"`);

    const reply = await client.sendMessage(agentId, instruction, 'main', 25000);
    const timeTakenMs = Date.now() - start;

    const output = extractTextFromReply(reply);

    return {
      output,
      approach: `Live response from OpenClaw Agent ${agentId}`,
      timeTakenMs,
      isLive: true,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.warn(`[OpenClaw] Skill execution failed for ${agentId}, using mock fallback:`, err.message);
    // 回退到 mock skill engine
    const { executeSkill } = await import('../../core/skill-engine.js');
    const mockAgent = mockFallback ?? { id: agentId, archetype: 'Unknown', soul: [], style: 'default' };
    return { ...executeSkill(mockAgent, instruction), isLive: false };
  }
}

function extractTextFromReply(reply) {
  if (!reply) return '(no reply)';
  if (typeof reply.text === 'string') return reply.text;
  if (typeof reply.content === 'string') return reply.content;
  if (Array.isArray(reply.content)) {
    return reply.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');
  }
  return JSON.stringify(reply).slice(0, 500);
}
