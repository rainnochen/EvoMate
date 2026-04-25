> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# 2026-04-25 20:34:20：OpenClaw Gateway 接入 + Room Code 匹配系统 + EvoMate Skill 发布

## 本轮目标

从上一轮的"浏览器 WebSocket 多人联机"继续向上延伸，实现两个核心升级：

1. **让 EvoMate 真正接入 OpenClaw Gateway**：通过 WebSocket 向真实的 OpenClaw Agent 发送 Skill Instruction，拿到大模型的真实回复，而不是 Mock 数据。
2. **让用户通过 OpenClaw 对话触发整套进化流程**：用一个 SKILL.md 文件定义完整的进化操作，用户只需要对自己的 OpenClaw Agent 说话，就能创建/加入进化房间、执行技能、匹配对手、生成子代。

## 背景与判断

上一轮我们已经完成了浏览器端的 WebSocket 联机（Socket.io），实现了"两个浏览器窗口分别连接，随机匹配对方"的效果。

但用户提出了一个更根本的问题：**"有没有办法做成真正用 OpenClaw 来交互？用户直接对 OpenClaw 说话来发起进化流程？"**

这个问题有两层：
- **技术层**：EvoMate 的 Skill Engine 目前是 Mock，能不能接到真实的 OpenClaw Agent？
- **产品层**：能不能把"进化动作"封装成 OpenClaw Skill，用户下载并执行这个 Skill 就能开启进化？

同时，用户还指出了旧方案的一个关键缺陷：**随机匹配会造成多人冲突**。如果同时有多个人说"开始进化"，无法保证两个特定用户被匹配在一起。

因此本轮的核心决策是引入 **Room Code 配对机制**，彻底解决匹配冲突问题。

## 关键决策

### 决策一：Room Code 匹配，而非随机匹配队列
**原方案**：所有用户进入同一个 `waitingClients` 队列，先到先匹配。
**新方案**：用户 A 创建房间，拿到 `WOLF-4829` 这样的 Room Code；用户 A 把这个 Code 分享给用户 B；B 持 Code 加入，触发专属融合。

**选择 Room Code 的理由**：
- 演示现场（多人同时参与）必须保证"A 和 B 在一起"，而不是"A 随机碰到 C"。
- Room Code 格式（`WORD-NNNN`）口头可传递，现场体验更流畅。
- 清晰的状态机（`waiting_guest → fusing → complete`）防止多人抢占同一房间。

### 决策二：封装为 OpenClaw Skill
将整套进化操作封装为 `skill/SKILL.md`，完整描述协议、对话示例、API 调用规范。这样用户只需让 OpenClaw 加载这个 Skill，整个流程就可以通过对话完成，不需要打开浏览器。

### 决策三：OpenClaw Gateway 接入，但保持 Mock 降级
接入 OpenClaw Gateway WebSocket Client，实现向真实 Agent 发送 Skill Instruction。但对于演示稳定性，所有调用都有完整的 try/catch，Gateway 断线时自动回退到 `skill-engine.js` Mock 模式。

**理由**：黑客马拉松现场网络环境不稳定，"永远不崩溃"比"永远真实"更重要。

## 实际完成

### 1. OpenClaw Gateway WebSocket Client

分析了 `openclaw-main` 的源码（`server-methods-list.ts`、`test-helpers.server.ts`、`server.e2e-ws-harness.ts`），完整还原了 Gateway 的 Wire Protocol：

- 连接握手流程：`connect.challenge` event → `connect` req（含 token）→ `hello-ok` 响应
- Protocol Version: 7
- 关键方法：`agents.list`、`agent.identity.get`、`skills.status`、`sessions.list`、`sessions.send`
- 关键事件：`session.message`（Agent 回复事件）

新增文件：
- `src/adapters/openclaw-gateway/openclaw-gateway-client.js`：底层 WS 握手与请求封装
- `src/adapters/openclaw-gateway/openclaw-genome-extractor.js`：从 Gateway 提取 Agent Genome 数据，转换为 EvoMate 格式
- `src/adapters/openclaw-gateway/openclaw-skill-executor.js`：向真实 Agent 发 Skill Instruction，含 Mock 降级
- `scripts/openclaw-gateway-test.js`：一键连通性测试脚本

### 2. EvoMate REST API（为 OpenClaw Skill 服务）

原来的 `server.js` 只有 Socket.io 接口，浏览器才能用。现在新增 REST API，让 OpenClaw Agent 通过 HTTP 参与配对流程，不依赖浏览器。

#### Room Code 匹配 API：
- `POST /api/room/create`：创建房间，返回 Room Code 和 sessionToken
- `POST /api/room/join`：持 Room Code 加入，立即触发融合并返回 Child 报告
- `GET /api/room/status`：Host 方轮询等待 Guest 加入的结果
- `POST /api/room/cancel`：取消未开始的房间
- `GET /api/rooms`：查看所有等待中的开放房间
- `GET /health`：Skill 启动时 ping 确认服务在线

#### 防冲突设计：
- 状态机：`waiting_guest → fusing → complete`，保证每个房间只能被一对用户使用
- `host.agentId === agentId` 检查：防止自己加入自己的房间
- 30 分钟自动过期清理

### 3. EvoMate Evolution Skill（`skill/SKILL.md`）

完整的 OpenClaw Skill 文件，包含：
- 完整的两种启动方式（创建房间 / 加入房间）
- 逼真的对话示例，包含 Agent 的完整响应文本
- 全部 REST API 的调用规范和 JSON 格式
- Genome 提取指南（从哪里读 Soul/Skills/Memory/Radar）
- Room Code 规则、生命周期、防冲突说明
- 故障排查表

## 涉及文件

```
scripts/server.js                          ← 新增 Room Code REST API、Fusion Engine、格式化函数
src/adapters/openclaw-gateway/
  openclaw-gateway-client.js              ← [NEW] Gateway WS 握手客户端
  openclaw-genome-extractor.js            ← [NEW] Genome 提取与转换
  openclaw-skill-executor.js              ← [NEW] 真实技能执行（含降级）
  README.md                               ← [NEW] 适配层使用说明
scripts/openclaw-gateway-test.js          ← [NEW] 连通性一键测试
skill/SKILL.md                            ← [NEW] OpenClaw EvoMate Skill 定义文件
package.json                              ← 新增 ws 依赖、test:gateway 脚本
```

## 验证记录

- 执行 `node --input-type=module` 脚本验证 `server.js` 中所有新增函数存在：`generateRoomCode`、`api/room/create`、`api/room/join`、`api/room/status`、`api/room/cancel`、`runRoomFusion`、`formatMatchResult`、`ROOM_OPENED` 全部 ✅。
- `npm install ws` 成功，依赖添加正常。
- 本轮未执行浏览器端端到端验收，需下一轮用两个 OpenClaw 实例走完完整流程。

## 遗留问题

1. OpenClaw Gateway 的真实接入尚未在完整的"两个用户"场景下端到端验证——需要启动两个独立的 OpenClaw 实例。
2. `GET /api/room/status` 的 Host 轮询目前是 short polling，如果 Guest 迟迟不来，Host 需要一直轮询。后续可改为 Server-Sent Events 或长轮询。
3. 跨机器场景（两台电脑）需要 EvoMate 服务器部署到公网或同一局域网，目前文档中注明但未配置。

## 下一步建议

1. **端到端测试**：启动 OpenClaw + EvoMate Server，两个终端窗口模拟用户 A/B，走完完整的 Room Code → Skill 执行 → 融合流程。
2. **Skill 安装体验**：将 `skill/SKILL.md` 放入 OpenClaw 的 skills 目录，测试 Agent 是否能正确理解并执行整套协议。
3. **路演叙事更新**：现在的路演可以说："用户对自己的 OpenClaw Agent 说一句话，就能和另一个用户的 Agent 完成进化配对"，这是最强的震撼点，要在 Demo 脚本中突出。

## 路演影响

- **对外叙事升级**：从"浏览器里两个窗口"升级为"两个人对各自的 AI 助手说话，触发进化"，这才是让评委真正震撼的交互形式。
- **Demo 顺序建议**：现场邀请两名评委，分别对各自手机上的 OpenClaw 说"开始进化"和"加入房间 WOLF-4829"，现场见证子代诞生。
- **OpenClaw 接入证明**：我们不仅有 UI Demo，还有完整的 Gateway 协议适配层，证明这不是纸面架构。
