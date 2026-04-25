> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# 开发日志：2026-04-25 真实在线联机与技能执行重构

## 1. 本轮目标
将 EvoMate 从单机沙盒升级为真实的多人在线配对（Matchmaking）引擎。同时，参考 `evolver-main` 的机制，引入技能执行环节，让“父代匹配”不仅看静态基因，还要看动态的指令执行表现。

## 2. 实际完成

### 后端架构重构
- 引入了 `express` 和 `socket.io` 依赖。
- 移除了原有的 `scripts/dev-server.js`，新建了 `scripts/server.js`。
- 在服务端实现了连接池管理、匹配队列 (`waitingClients`) 以及完整的配对广播逻辑。

### 核心引擎升级
- 新增 `src/core/skill-engine.js`：这是一个基于 Agent 模板的离线 Mock 生成器，能根据 Agent 的不同人设（Archetype/Traits）为用户的 Skill Instruction 伪造出极具个性的输出结果和耗时。
- 升级 `src/core/compatibility-engine.js`：除了静态基因雷达对比，新增了 `executionSynergy`（执行协同度）计算逻辑。如果两者的执行用时、输出长度表现出差异和互补，会额外获得最多 20 分的融合加成。

### 前端 UI 流向重写
- **Agent Selection**：从“选两个”变成“选一个”，确立“我的 Agent”概念。
- **Skill Test UI**：增加了聊天框/文本框区域，用户可以直接给自己的 Agent 派发任务，并看到带有时长动画的执行结果。
- **Lobby UI**：侧边栏变成了大厅视图，展示当前的配对状态。
- **Opponent Reveal**：配对成功后，会揭晓对方的 Agent 和技能执行结果，再顺滑切入原有的 Fusion 流程。

## 3. 验证结果
- 本地同时打开两个浏览器窗口。
- 窗口 A 选 Atlas，输入 "Write a logging script"；窗口 B 选 Muse，输入 "Write a marketing tweet"。
- A 和 B 均点击 "Find Match"。
- 服务端成功撮合，A 和 B 的界面同时触发 Fusion 动画，并生成具备双亲特征的唯一的 Child，竞技场结算正常完成。

## 4. 下一步建议
- 前端的“等待动画”可以做得更有科技感（如雷达扫描效果）。
- 后端大厅目前是暴力的 `queue.shift()`，后续可以改成根据 Compatibility 阈值来寻找最优配偶。
- 当前 `skill-engine` 仍然是 Mock，后续如果在有外网的展示环境中，可将其直接对接真正的 LLM 接口，或集成 `openclaw` 的本地 CLI。

---

## 补充：2026-04-25 OpenClaw Gateway 真实接入适配层

### 技术分析（来自 openclaw-main 源码扫描）

**Wire Protocol**:
- Gateway 默认监听 `ws://127.0.0.1:18789`
- 握手流程：`connect.challenge` event → 客户端发送 `connect` req（含 token）→ `hello-ok` 响应
- Protocol Version: `7`

**关键方法（server-methods-list.ts）**：`agents.list`, `agent.identity.get`, `skills.status`, `sessions.list`, `sessions.send`
**关键事件**：`session.message`（Agent 回复事件，用于获取真实 LLM 输出）

### 新增文件
- `src/adapters/openclaw-gateway/openclaw-gateway-client.js`：底层 WS 握手与请求封装
- `src/adapters/openclaw-gateway/openclaw-genome-extractor.js`：从 Gateway 提取 Genome 数据
- `src/adapters/openclaw-gateway/openclaw-skill-executor.js`：真实技能执行，含 Mock 降级
- `scripts/openclaw-gateway-test.js`：一行命令快速连通性测试

### 降级策略
所有 Gateway 调用都有 try/catch，Gateway 断线时自动回退到 skill-engine.js 的 Mock 模式，保证 Demo 永远不崩溃。

### 验证命令
```bash
# 设置环境变量
export OPENCLAW_GATEWAY_TOKEN=your-token-here

# 测试 Gateway 连通性
npm run test:gateway
```
