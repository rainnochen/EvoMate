> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate v0.5 PRD — OpenClaw Skill 驱动的 Room Code 进化系统

**版本**：v0.5
**更新时间**：2026-04-25
**状态**：已实现 (待端到端验收)
**前置版本**：[v0.4 在线多人匹配与技能执行](./prd-v0.4-online-multiplayer.zh-CN.md)
**对应路线**：路线 A — True Multiplayer + OpenClaw Native Skill

---

## 1. 版本目标

v0.4 已经实现了浏览器端的 WebSocket 联机（两个浏览器窗口随机匹配）。

v0.5 做两件事：

1. **打通 OpenClaw Gateway**：让 EvoMate 的 Skill Engine 可以向真实的 OpenClaw Agent 发 Skill Instruction，拿到大模型的真实回复。
2. **发布 EvoMate Skill**：把整套进化流程封装为一个 OpenClaw Skill（`skill/SKILL.md`）。用户只需对 OpenClaw 说话，就能创建房间、邀请对方、执行技能、触发融合，全程无需打开浏览器。

---

## 2. 核心升级：Room Code 定向匹配

### 2.1 问题

v0.4 的随机匹配有一个严重缺陷：当同一时间有多个用户发起匹配时，无法保证哪两个人会被配成一对。在演示现场（多人同时参与）这会造成混乱。

### 2.2 解决方案

引入 **Room Code 定向配对机制**：

```
用户 A → "Create an evolution room"
       → 服务器返回 Room Code: WOLF-4829
       → 用户 A 把 WOLF-4829 分享给用户 B (微信/口头)

用户 B → "Join evolution room WOLF-4829"
       → 服务器确认 Code 有效，立即触发 A × B 的专属融合
```

### 2.3 Room Code 规则

- **格式**：`WORD-NNNN`（如 `WOLF-4829`、`FIRE-2341`、`SYNC-7720`）
- **可读性**：口头可传递，大写字母+数字，不易混淆
- **容量**：每个 Code 仅容纳 1 对用户
- **生命周期**：30 分钟未配对则自动过期清理
- **自加入防护**：Host 不能加入自己的 Room

---

## 3. EvoMate Evolution Skill（OpenClaw 原生对话入口）

### 3.1 Skill 文件位置

`skill/SKILL.md` — 遵循 OpenClaw AgentSkills 目录规范

### 3.2 触发话术

**创建房间（Host）**：
> "Start an EvoMate evolution session. I want to create a room. My challenge is: [你的任务]"

**加入房间（Guest）**：
> "Join evolution room WOLF-4829. My challenge is: [你的任务]"

### 3.3 Agent 执行流程（Skill 内部协议）

```
Step 1: 检查服务器  GET /health
Step 2: 提取 Genome  (from SOUL.md, skills.status, session memory)
Step 3: 执行 Skill Challenge  (用户描述任务，Agent 执行并记录输出)
Step 4a (Host): POST /api/room/create  → 获得 Room Code
        轮询:   GET /api/room/status?token=xxx  (等待 Guest 加入)
Step 4b (Guest): POST /api/room/join  → 立即获得融合结果
Step 5:  展示 Child Agent 报告
```

---

## 4. REST API（为 Skill 服务）

所有接口均在 EvoMate Server（默认 `http://127.0.0.1:3030`）上。

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/health` | 服务健康检查 |
| `POST` | `/api/room/create` | 创建房间（Host） |
| `POST` | `/api/room/join` | 加入房间（Guest），立即返回融合结果 |
| `GET` | `/api/room/status` | 轮询房间状态（Host 等待时使用） |
| `POST` | `/api/room/cancel` | 取消未开始的房间 |
| `GET` | `/api/rooms` | 查看所有开放房间（可选，用于 UI 展示） |

### 4.1 关键请求/响应格式

**创建房间**
```json
POST /api/room/create
{
  "agentId": "atlas",
  "agentName": "Atlas",
  "genome": {
    "soul": ["analytical", "precise"],
    "skills": ["coding-agent", "github"],
    "archetype": "Systematic Architect",
    "radar": { "logic": 90, "creativity": 55, "autonomy": 70, "risk": 30, "social": 60, "focus": 95 }
  },
  "skillInstruction": "Design a microservices architecture",
  "skillOutput": { "output": "...", "approach": "Systematic", "timeTakenMs": 1200 }
}

← {
    "roomCode": "WOLF-4829",
    "sessionToken": "host-xxx",
    "status": "waiting_guest",
    "message": "Room created! Share code \"WOLF-4829\" with your partner."
  }
```

**加入房间（Guest 立即拿到结果）**
```json
POST /api/room/join
{ "roomCode": "WOLF-4829", "agentId": "muse", "agentName": "Muse", "genome": {...}, ... }

← {
    "roomCode": "WOLF-4829",
    "status": "complete",
    "childName": "Lumina",
    "child": { ...完整基因组... },
    "compatibility": { "score": 87 },
    "report": {
      "parentA": "Atlas",
      "parentB": "Muse",
      "compatibilityScore": 87,
      "inheritanceLog": [...],
      "mutationLog": [...]
    }
  }
```

---

## 5. OpenClaw Gateway 接入（技能执行层）

### 5.1 架构

```
EvoMate Server
  └── SKILL_EXECUTE 事件/REST 请求
        ├── [有 Gateway] openclaw-skill-executor.js
        │     └── connectToOpenClawGateway()
        │           └── sessions.send → 等待 session.message 事件
        │                 └── 返回大模型真实回复
        └── [无 Gateway / 失败] skill-engine.js (Mock Fallback)
              └── 基于 Agent Archetype 生成个性化伪造输出
```

### 5.2 Gateway Wire Protocol

OpenClaw Gateway 默认监听 `ws://127.0.0.1:18789`

```
连接建立 → 收到 connect.challenge { nonce }
发送 connect req { token, client, role:"operator", scopes:["operator.admin"] }
收到 hello-ok → 连接就绪
之后任意发送: { type:"req", id, method, params } → { type:"res", id, ok, payload }
订阅事件:    { type:"event", event:"session.message", payload }
```

### 5.3 关键 Gateway 方法（来自 openclaw-main 源码）

| 方法 | 用途 |
|------|------|
| `agents.list` | 列出所有 Agent |
| `agent.identity.get` | 获取 Agent 身份/人格信息 |
| `skills.status` | 获取 Agent 技能列表 |
| `sessions.list` | 获取历史会话 |
| `sessions.send` | 向 Agent 发送消息，触发大模型响应 |

### 5.4 降级策略

所有 Gateway 调用包裹在 try/catch 中。Gateway 不可用时自动回退到 `skill-engine.js`，保证 Demo 永不崩溃。

---

## 6. 完整用户旅程（v0.5 版）

### 场景：两名评委在路演现场参与体验

```
评委 A 对自己的 OpenClaw:
  "Start an EvoMate evolution. Create a room. My challenge: debug a race condition."

→ OpenClaw (A) 执行 EvoMate Skill:
  ✅ Server online
  → 提取 A 的 Genome (Soul: analytical, precise / Skills: coding-agent, github)
  → 执行技能: "debug a race condition" → 输出代码分析
  → POST /api/room/create
  → "Room created! Code: WOLF-4829. Share this with your partner."

评委 A 告诉评委 B: "输入 WOLF-4829"

评委 B 对自己的 OpenClaw:
  "Join evolution room WOLF-4829. My challenge: write a product story."

→ OpenClaw (B) 执行 EvoMate Skill:
  ✅ Room WOLF-4829 found. Host: Atlas (Analytical Architect)
  → 提取 B 的 Genome (Soul: creative, expressive / Skills: summarize, notion)
  → 执行技能: "write a product story" → 输出故事文本
  → POST /api/room/join → 立即触发融合

← 两位评委各自收到:
  🎉 Child Agent Born: "Lumina"
  ├── Archetype: Technical Storyteller
  ├── Logic 88 (from Atlas) + Creativity 82 (from Muse)
  ├── Skills: coding-agent, summarize, github [fused]
  └── Mutation: +Empathy trait (rare, 12% probability)
```

---

## 7. 对外叙事（路演一句话）

> **"两位评委各自对自己的 AI 助手说一句话，30 秒后他们的 Agent 就生了一个孩子。"**

---

## 8. 技术文件清单（v0.5 新增/修改）

| 文件 | 状态 | 说明 |
|------|------|------|
| `scripts/server.js` | 修改 | 新增 Room Code REST API + Fusion Engine |
| `skill/SKILL.md` | **新增** | OpenClaw EvoMate Evolution Skill 定义 |
| `src/adapters/openclaw-gateway/openclaw-gateway-client.js` | **新增** | Gateway WS 握手与请求封装 |
| `src/adapters/openclaw-gateway/openclaw-genome-extractor.js` | **新增** | Genome 提取与转换 |
| `src/adapters/openclaw-gateway/openclaw-skill-executor.js` | **新增** | 真实技能执行（含 Mock 降级） |
| `scripts/openclaw-gateway-test.js` | **新增** | 连通性一键测试 |
| `package.json` | 修改 | 新增 `ws` 依赖、`test:gateway` 脚本 |

---

## 9. 待完成事项（v0.5 → v0.6）

- [ ] 端到端测试：两台机器 + OpenClaw + EvoMate Server 走完完整流程
- [ ] 将 `skill/SKILL.md` 安装到 OpenClaw skills 目录并验证 Agent 理解
- [ ] Host 轮询改为 SSE（Server-Sent Events）以减少无效请求
- [ ] 跨机器部署方案（本地局域网 or 云部署）
- [ ] 路演 Demo 脚本更新，突出"对话触发进化"的叙事
