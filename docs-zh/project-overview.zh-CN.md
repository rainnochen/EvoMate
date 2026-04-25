> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 项目总览

## 项目名称

EvoMate

## 项目类型

Hackathon MVP / Agent Evolution Sandbox

## 所属赛道建议

红药丸：Build For Future

## 一句话介绍

EvoMate 是一个基于 EvoMap / Evolver 思想的 Agent 数字遗传实验室，让两个智能体通过 DNA 融合生成新的后代 Agent，并可视化展示性格、记忆、技能和知识的继承、重组、突变与表达过程。

## 核心关键词

- Agent
- Evolution
- Breeding
- Genome
- Mutation
- A2A
- 可视化
- 数字遗传学

## 为什么适合红药丸赛道

EvoMate 不是在解决一个传统 SaaS 痛点，而是在探索未来 Agent 的生成方式。

它提出的问题是：

如果未来的 Agent 不只是人工配置出来的，而是可以被繁育、筛选和演化出来的，会发生什么？

这个问题符合红药丸赛道对未来趋势、技术想象力和 Agent 基础设施方向的要求。

## 当前 MVP 闭环

1. 用户进入实验室。
2. 用户查看 4 个候选父代 Agent。
3. 用户选择两个 Agent 进行配对。
4. 系统计算兼容性，包括性格契合、技能互补、知识多样性和突变潜力。
5. 用户点击 Breed，进入 DNA Fusion Chamber。
6. 系统生成子代 Agent。
7. 系统展示继承日志、融合技能、突变日志和子代基因报告。
8. Arena 展示父代与子代在同一任务中的表达差异。

## 当前技术形态

当前项目为零依赖静态 Web MVP。

这样做的原因：

- hackathon 现场更稳定
- 不依赖外部 API
- 不需要构建链路
- 方便快速迭代 UI 和交互
- 后续可以逐步接入 `evolver-main` 的真实 GEP / mutation / memory 能力

## 与 evolver-main 的关系

`evolver-main` 是底层进化引擎，负责 GEP、资产、记忆、突变、A2A、验证和自进化流程。

`evolver-hackathon / EvoMate` 是面向评委和用户的体验层，负责把抽象的进化过程变成可看、可点、可讲的产品 Demo。

后续最好的方向是：

把 EvoMate 做成 Evolver 的可视化实验前台，让 `evolver-main` 提供真实遗传资产和评估能力。
