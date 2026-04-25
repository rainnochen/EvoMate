# OpenClaw Gateway Adapter

## 模块说明

本目录是 EvoMate 与 OpenClaw Gateway 之间的通信适配层。

| 文件 | 职责 |
|------|------|
| `openclaw-gateway-client.js` | 底层 WebSocket 客户端，负责连接握手、发送请求、接收事件 |
| `openclaw-genome-extractor.js` | 从 Gateway 和本地文件提取 Agent Genome 数据 |
| `openclaw-skill-executor.js` | 向真实 Agent 发送 Skill Instruction，支持 Mock 降级 |

## 快速开始

### 1. 启动 OpenClaw Gateway

在 `openclaw-main` 目录下：
```bash
# 确保已安装和构建
node openclaw.mjs gateway
```

### 2. 设置环境变量

```bash
export OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
export OPENCLAW_GATEWAY_TOKEN=your-token-here
```

> Gateway Token 可以在 OpenClaw 的配置文件 `~/.openclaw/openclaw.json` 中查看，或者通过 `openclaw gateway status` 命令获取。

### 3. 启动 EvoMate Server

```bash
npm run dev
```

EvoMate 服务器启动时会自动尝试连接到 OpenClaw Gateway。如果连接成功，你的 Agent 就会使用真实的大模型回复。如果连接失败（Gateway 未运行），会自动降级到 Mock 模式，保证 Demo 正常运行。

## Wire Protocol（来自 openclaw-main 源码）

```json
// 请求格式
{ "type": "req", "id": "evomate-1", "method": "agents.list", "params": {} }

// 成功响应格式
{ "type": "res", "id": "evomate-1", "ok": true, "payload": {...} }

// 事件格式
{ "type": "event", "event": "session.message", "payload": {...}, "seq": 42 }
```

## 认证

支持两种认证模式：
- **Token 模式**（推荐）：通过 `OPENCLAW_GATEWAY_TOKEN` 环境变量传入
- **无认证模式**（本地测试）：Gateway 以 `auth: { mode: "none" }` 启动

## 关键 Gateway 方法

| 方法 | 用途 |
|------|------|
| `connect` | 握手，必须最先调用 |
| `agents.list` | 列出所有 Agent |
| `agent.identity.get` | 获取 Agent 的身份/人格信息 |
| `skills.status` | 获取 Agent 的技能状态 |
| `sessions.list` | 获取 Agent 的历史会话 |
| `sessions.send` | 向 Agent 发送一条消息 |

## 降级策略

EvoMate 的设计保证了"Gateway 断线不崩溃"：
1. 所有 Gateway 调用都包裹在 `try/catch` 中
2. 如果 Gateway 不可用，自动回退到 `src/core/skill-engine.js` 的 Mock 模式
3. Mock 模式根据 Agent 的 Archetype/Soul 生成带有个性的伪造输出
