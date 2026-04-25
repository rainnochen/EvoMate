# EvoMate v0.4 在线多人匹配与技能执行 PRD

**更新时间**：2026-04-25
**状态**：已立项 (开发中)
**对应路线**：路线 A (True Multiplayer)

## 1. 背景与目标

为了在黑客马拉松路演中制造最大震撼力，我们将 EvoMate 从离线单机沙盒升级为**真实的多人在线基因配对系统**。这使得现场评委或观众可以各自拿着手机/电脑，用自己的 OpenClaw Agent 下指令，然后匹配、融合，亲眼见证跨代演化。

同时，参考 `evolver-main/SKILL.md`，我们引入了**技能前置执行（Skill Pre-test）**机制：Agent 只有先执行一次用户的指令（展示自身特性）才能参与匹配。

## 2. 核心用户体验路径 (User Journey)

### 步骤一：单人准备阶段 (Preparation)
1. 用户打开网页，通过 WebSockets 连接至 EvoMate 实验室服务器。
2. 用户从基因库中选择**自己**的父代 Agent（例如：用户 A 选了 Atlas）。
3. 界面出现一个对话框，用户输入一条 **Skill Instruction（技能指令）**（如：“写一段清理数据的脚本”）。
4. Agent 返回技能执行的结果，展示其特定的 Archetype 风格（如：Atlas 给出结构严谨的、带防御性验证的代码）。

### 步骤二：进入匹配大厅 (Matchmaking)
1. 用户点击“寻找匹配 (Find Partner)”按钮。
2. 界面显示“正在扫描全局基因库...”，进入寻找其他在线用户的等待状态。

### 步骤三：跨服匹配与融合 (Cross-Server Fusion)
1. 服务端找到另一个正在等待的真实用户（例如用户 B，带着 Muse Agent）。
2. 服务端调用 `compatibility-engine`，**结合双方的基因与刚刚各自输出的技能结果**，计算兼容度。
3. 双方界面同时提示“找到匹配！”并展示对方的 Agent 和技能执行结果。
4. 双方自动进入 Fusion Chamber，观看 DNA 融合动画。

### 步骤四：竞技场结算 (Arena Evaluation)
1. 融合完成后，服务端生成唯一的 Child Agent。
2. 双方界面同时展示新诞生的 Child Report 以及 Arena 的能力对比（Fitness Delta）。

## 3. 技术架构变更 (Architecture Shift)

### 3.1 后端服务 (Node.js + Express + Socket.io)
- 负责维护用户的连接池和匹配队列。
- 负责调用核心引擎（`compatibility-engine`, `fusion-engine`, `arena-engine`）并广播结果。
- 负责提供 LLM（大模型）代理或高质量的 Mock Engine 来执行 Skill Instruction。

### 3.2 客户端通信协议 (WebSockets)
关键事件（Event Schema）：
- `CLIENT_JOIN`: 用户进入准备阶段。
- `SKILL_EXECUTE`: 请求后端执行技能，返回 `SKILL_OUTPUT`。
- `REQUEST_MATCH`: 加入匹配队列。
- `MATCH_FOUND`: 后端广播配对成功，携带双方的 Agent 数据和计算好的兼容性。
- `FUSION_COMPLETE`: 后端广播新生 Child 数据和 Arena 表现。

### 3.3 核心算法升级
- `compatibility-engine.js` 需要升级，不再仅仅对比静态基因组，还需要评估**双方给出的 Skill Output 的差异度和互补性**。

## 4. 降级方案 (Fallback Plan)
考虑到黑客马拉松现场可能出现的恶劣网络环境，必须保留降级能力：
如果大模型 API 超时或报错，后端 `skill-engine` 必须能够使用本地的兜底生成器（Mock Generator）生成带有特定角色语气的回答，以保证 Demo 不被中断。
