> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate MVP 开发计划

## MVP 目标

在 hackathon 时间内完成一个能讲清楚、能跑通、能被记住的 Agent 数字遗传 Demo。

## 必须交付

- 4 个预设父代 Agent。
- 可选择两个父代进行配对。
- 展示 Agent Genome Profile。
- 展示 Compatibility Score。
- 触发 DNA Fusion Chamber 动画。
- 生成子代 Agent。
- 展示继承报告和突变报告。
- 在 Arena 中对比父代和子代输出。

## 页面结构

### Page 1：Lab Entrance

目的：

- 建立数字遗传实验室的世界观。
- 让用户快速进入实验流程。

当前实现：

- 首页首屏展示 EvoMate 名称。
- 展示赛道、模式和 genome 层级。

### Page 2：Match Room

目的：

- 展示父代 Agent。
- 支持用户选择两个父代。
- 展示匹配度结果。

当前实现：

- 4 张 Agent 卡片。
- 默认选择 Atlas + Muse。
- 点击候选 Agent 可替换 Parent B。

### Page 3：Fusion Chamber

目的：

- 可视化 DNA 融合过程。
- 展示继承、重组、突变和稳定状态。

当前实现：

- DNA Chamber 动画。
- Breed 后显示融合日志。
- 1.4 秒后生成 Child。

### Page 4：Child Report

目的：

- 展示子代身份。
- 展示 Soul、Skills、Memory、Wiki 的继承和突变结果。

当前实现：

- 子代名称。
- 子代稀有度。
- 突变类型和突变说明。
- 四层 genome 报告。

### Page 5：Arena

目的：

- 证明子代不是换皮，而是有新的表达能力。

当前实现：

- 统一任务：为 AI Hackathon 项目生成 30 秒路演介绍。
- 展示 Parent A、Parent B、Child 三段输出。

## 当前核心算法

### Compatibility Engine

输入：

- Parent A genome
- Parent B genome

输出：

- Personality Compatibility
- Skill Complementarity
- Knowledge Diversity
- Mutation Potential
- Total Score
- Explanation

当前方法：

- 规则评分。
- 根据 trait tension、skill overlap、knowledge unique count、radar gap 计算。

### Fusion Engine

输入：

- Parent A genome
- Parent B genome
- Compatibility result

输出：

- Child genome
- Inheritance log
- Fusion log
- Mutation log

当前方法：

- 父母各继承高权重 Soul traits。
- 合并技能池。
- 触发融合技能。
- 抽取记忆摘要。
- 继承知识 capsule。
- 注入一次确定性 mutation。

### Arena Engine

输入：

- Arena task
- Parent A
- Parent B
- Child

输出：

- 三个 Agent 的任务表达。
- 每个表达的说明 notes。

当前方法：

- 模板生成。
- 根据 Agent 的 traits 和 skills 填充表达倾向。

## Hackathon 优先级

P0：

- 演示闭环稳定。
- 样式完成度足够。
- 文案能解释产品价值。

P1：

- Fusion 动画更惊艳。
- Child Reveal 更有仪式感。
- Arena 输出更有差异。

P2：

- 增加多代繁育。
- 增加家谱视图。
- 增加稀有突变系统。
