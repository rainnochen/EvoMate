# EvoMate 中文文档索引

这个目录是 EvoMate 的中文文档包，用于 hackathon 开发、路演准备和后续迭代交接。

## 文档清单

- [项目总览](./project-overview.zh-CN.md)
- [当前主 PRD](./prd-current.zh-CN.md)
- [PRD v0.3](./prd-v0.3.zh-CN.md)
- [PRD v0.2](./prd-v0.2.zh-CN.md)
- [PRD v0.1](./prd-v0.1.zh-CN.md)
- [早期产品需求文档 PRD](./prd.zh-CN.md)
- [当前完整项目说明书](./project-handbook-current.zh-CN.md)
- [Evolution Protocol](./evolution-protocol.zh-CN.md)
- [Genome Schema](./genome-schema.zh-CN.md)
- [Arena Evaluation](./arena-evaluation.zh-CN.md)
- [Demo Script v0.3](./demo-script-v0.3.zh-CN.md)
- [技术架构说明](./architecture.zh-CN.md)
- [MVP 开发计划](./mvp-plan.zh-CN.md)
- [路演 Demo 脚本](./demo-script.zh-CN.md)
- [源码层说明](./source-layer.zh-CN.md)
- [使用说明书](./user-manual.zh-CN.md)
- [开发日志](./development-log.zh-CN.md)
- [与 evolver-main 主项目对比及优化建议](./evolver-main-comparison.zh-CN.md)
- [Evolver Gene 压缩规则与 EvoMate 开发方案](./evolver-gene-compression-and-evomate-development.zh-CN.md)
- [后续开发 PRD](./next-development-prd.zh-CN.md)
- [OpenClaw × EvoMate 架构梳理与融合 PRD](./openclaw-evomate-integration-prd.zh-CN.md)
- [EvoMate Gene Layer 开发版本 V1](./evolver-gene-layer-development-v1.zh-CN.md)
- [EvoMate 产品说明书 v0.1 实现说明](./evomate-product-spec-v0.1-implementation.zh-CN.md)
- [长期开发日志目录](../开发日志/README.zh-CN.md)
- [分布式开发机制](../分布式开发机制.zh-CN.md)

## 当前项目定位

EvoMate 是一个面向红药丸赛道的 Agent 数字遗传实验室。

它让两个父代 Agent 通过数字 DNA 融合生成一个子代 Agent，并用可视化方式展示 Soul、Skills、Memory、Wiki、Gene 五层基因的继承、重组、突变和任务表达。

## 当前开发状态

当前已经完成一个零依赖静态 MVP 框架：

- 4 个预设父代 Agent
- 双亲选择
- 匹配度计算
- DNA Fusion Chamber 交互
- 子代 Agent 生成
- 继承与突变报告
- Strategy Gene 继承、重组与 fitness test 展示
- Arena 选择、亲本基线、Child Fitness 和 Evolution Delta 展示
- Arena 输出对比

本地启动：

```bash
npm run dev
```

访问：

```text
http://127.0.0.1:3030
```
