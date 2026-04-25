> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 开发日志索引

这个目录用于记录 `evolver-hackathon` 的开发过程、阶段决策、文件变化、验证结果和后续行动项。

当前项目处于 Hackathon MVP 冲刺阶段，日志需要服务两个目标：

- 让新加入队友快速理解项目从哪里来、现在有什么、下一步做什么。
- 让路演和复盘时能够讲清楚 48 小时内的进化过程。

## 当前文件

- [项目文件总览](./项目文件总览.zh-CN.md)
- [2026-04-24 至 2026-04-25：项目初始化与路演资产沉淀](./2026-04-24-01-至-2026-04-25-项目初始化与路演资产沉淀.zh-CN.md)
- [2026-04-25：分布式开发机制与模块协议](./2026-04-25-02-分布式开发机制与模块协议.zh-CN.md)
- [2026-04-25：社媒招募长图与队友文案](./2026-04-25-03-社媒招募长图与队友文案.zh-CN.md)
- [2026-04-25：Evolver Gene 压缩规则分析](./2026-04-25-04-evolver-gene-压缩规则分析.zh-CN.md)
- [2026-04-25：Gene Layer V1 开发迭代](./2026-04-25-05-gene-layer-v1-开发迭代.zh-CN.md)
- [2026-04-25：上下文维护 Skill 分支](./2026-04-25-06-上下文维护-skill-分支.zh-CN.md)
- [2026-04-25：产品说明书 v0.1 开发迭代](./2026-04-25-07-产品说明书-v0.1-开发迭代.zh-CN.md)
- [2026-04-25：PRD 版本命名整理](./2026-04-25-08-prd-版本命名整理.zh-CN.md)
- [2026-04-25：完整项目说明书与逆向 PRD](./2026-04-25-09-完整项目说明书与逆向prd.zh-CN.md)
- [2026-04-25：Agent Evolution Protocol v0.3 迭代](./2026-04-25-10-agent-evolution-protocol-v0.3-迭代.zh-CN.md)
- [2026-04-25：P0 染色体协议版本迭代](./2026-04-25-11-p0-染色体协议版本迭代.zh-CN.md)
- [2026-04-25：在线多人联机与技能执行重构](./2026-04-25-12-online-multiplayer-skill-execution.zh-CN.md)
- [2026-04-25：OpenClaw Gateway 接入与 Room Code 匹配系统](./2026-04-25-13-openclaw-gateway接入与room-code匹配系统.zh-CN.md) ← **最新**
- [开发日志规则](./开发日志规则.zh-CN.md)

## 项目记忆 Skill 分支

- [EvoMate Context Keeper Skill](./skills/evomate-context-keeper/SKILL.md)
- [历史上下文重点](./skills/evomate-context-keeper/references/history-context.zh-CN.md)
- [上下文更新模板](./skills/evomate-context-keeper/references/context-update-template.zh-CN.md)

## 快速判断项目状态

当前 `evolver-hackathon` 已经具备一个可运行、可讲述、可继续扩展的 EvoMate MVP 骨架：

- 有静态前端 Demo。
- 有 Agent Genome mock 数据。
- 有 compatibility、fusion、gene-fusion、evaluation、arena 五个核心逻辑模块。
- 有中英文 PRD、架构、Demo、使用说明、后续规划文档。
- 当前主 PRD 版本为 `docs-zh/prd-v0.5-openclaw-skill-room-code.zh-CN.md`（最新，已实现待验收）。
- 当前完整项目说明书为 `docs-zh/project-handbook-current.zh-CN.md`。
- 有 OpenClaw × EvoMate 融合 PRD（`docs-zh/openclaw-evomate-integration-prd.zh-CN.md`）。
- 有闪电路演材料和两套已生成 Pitch 图片。
- **v0.5 新增**：Room Code 匹配系统、OpenClaw Gateway WebSocket Client、EvoMate Skill（`skill/SKILL.md`）已完成开发。

## 维护原则

每次较完整的开发迭代结束后，都应该在本目录新增一篇日志，而不是覆盖旧日志。

如果只是修错别字或补一张图片，也可以合并进当天日志的“增量记录”部分。
