> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 产品需求文档 PRD

## 1. 项目基础信息

项目名称：EvoMate

项目类型：Hackathon MVP / Agent Evolution Sandbox

所属赛道建议：红药丸：Build For Future

项目一句话介绍：

EvoMate 是一个基于 EvoMap / Evolver 思想的 Agent 数字遗传实验室，让两个智能体通过 DNA 融合生成新的后代 Agent，并以可视化方式展示性格、记忆、技能和知识的继承、重组、突变与表达过程。

## 2. 项目背景

当前主流 Agent 构建方式仍然以人工配置为主，包括 Prompt 编写、Tool 拼装、Workflow 编排和 Memory 管理。这种方式存在几个问题：

- 能力组合高度依赖人工经验，试错成本高。
- Agent 的形成过程不可视、不可解释。
- 多 Agent 协作通常停留在通信层，缺少跨代进化与能力重组机制。
- 很难探索一个更适合特定任务的 Agent 是否可以通过演化产生。

EvoMate 希望提出一种新的 Agent 构建与理解方式：

将 Agent 的核心能力抽象为可遗传的数字 DNA，通过繁育、融合、突变和场景表达，探索下一代智能体的生成机制。

## 3. 项目愿景

EvoMate 不只是一个有趣的 Agent 配对 Demo，而是一个面向未来的实验平台：

- 把 Agent 从配置体变成生命体。
- 把 Prompt Engineering 升级为 Genome Engineering。
- 把 Agent-to-Agent 从通信推进到跨代演化。
- 把复杂能力形成过程转化为人类可观测、可理解的可视化体验。

长期来看，EvoMate 的愿景是：

让企业未来不必手动组装最优 Agent，而是通过繁育、筛选和演化，得到更适合业务目标的数字智能体。

## 4. Hackathon 阶段目标

在 48 小时内完成一个可演示的 MVP，形成完整闭环：

- 展示两个父代 Agent 的 DNA 档案。
- 支持配对与繁育触发。
- 完成一次基因融合动画。
- 生成一个子代 Agent。
- 输出继承与突变报告。
- 在一个轻量任务场景中展示子代与父代的差异。

## 5. 目标用户

核心用户：

- Hackathon 评委。
- AI Agent 开发者。
- 对多 Agent 系统、进化机制、游戏化 AI 有兴趣的技术用户。

潜在未来用户：

- 企业 Agent 平台设计者。
- AI 产品经理。
- 研究型开发者。
- 教育与科普场景中的 AI 可视化平台使用者。

## 6. 核心概念定义

EvoMate 将 Agent 的数字 DNA 拆解为四层。

### 6.1 Soul 灵魂层

用于描述 Agent 的个性、行为倾向和表达风格。

示例：

- 理性
- 冷静
- 温柔
- 叛逆
- 探索
- 幽默

### 6.2 Skills 技能层

用于描述 Agent 的能力边界和可调用能力。

示例：

- 编码
- 检索
- 规划
- 总结
- 辩论
- 创意生成
- 工具调用

### 6.3 Memory 记忆层

用于描述 Agent 的长期经验和行为印记。

示例：

- 成功经验摘要
- 失败经验摘要
- 偏好积累
- 历史高光行为片段

### 6.4 Wiki / Knowledge 知识层

用于描述 Agent 的知识包或专业领域。

示例：

- AI 知识包
- Coding 知识包
- 创业 / 产品知识包
- 活动策划知识包

## 7. 产品流程

### Step 1：Agent 档案展示

用户进入实验室，查看候选 Agent 的 DNA 档案，包括 Soul、Skills、Memory、Knowledge。

### Step 2：兼容性匹配

系统展示两个 Agent 的匹配度，包括性格契合度、技能互补度、知识多样性和变异潜力。

### Step 3：基因融合

用户点击 Breed，进入 DNA Fusion Chamber。系统执行遗传、重组和突变。

### Step 4：子代生成

系统生成新的 Child Agent，并输出基因检测报告。

### Step 5：Arena 展示

将父代与子代放入一个轻量任务场景中，展示子代的表达差异和新能力组合。

## 8. MVP 必须完成

- 预设 4 个父代 Agent。
- 选择两个 Agent 配对。
- 展示匹配分数。
- 执行一次繁育动画。
- 生成 1 个 Child Agent。
- 展示 Child 的继承和突变结果。
- 跑通 1 个 Arena 对比场景。
- 完成可用于路演的稳定 Demo。

## 9. 明确不做

- 不做复杂自治 Agent 框架。
- 不做真实多轮自我进化闭环。
- 不做复杂 Memory 基建。
- 不做大规模知识库系统。
- 不做开放式多人交互。
