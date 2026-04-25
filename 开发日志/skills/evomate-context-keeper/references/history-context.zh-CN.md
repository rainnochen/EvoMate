# EvoMate 历史上下文重点

更新时间：2026-04-25

## 1. 项目身份

EvoMate 是一个面向 Hackathon 红药丸赛道的 Agent 数字遗传实验室。

项目一句话：

> EvoMate 是一个基于 EvoMap / Evolver 思路的 Agent 数字遗传实验室，把 Agent 的 personality、skills、memory、knowledge 和 strategy gene 抽象成可遗传 DNA，让两个 Agent 通过融合生成新的子代 Agent，并可视化展示继承、重组、突变与能力表达。

需要避免的误解：

- 不是 AI 宠物配对游戏。
- 不是普通 Agent Workflow 工具。
- 不是只做 Prompt 拼装。

真正要讲的是：

- Agent 从“配置体”变成“生命体”。
- Prompt Engineering 升级为 Genome Engineering。
- Agent-to-Agent 从通信推进到跨代演化。
- 企业未来可能通过繁育、筛选、验证得到更适合业务目标的 Agent。

## 2. Hackathon 策略

赛道建议：

```text
红药丸：Build For Future
```

原因：

- 主题更未来感，容易和评委的 Agent / infra / self-evolution 关键词对齐。
- EvoMate 的核心不是短期市场工具，而是探索未来 Agent 生成机制。
- 项目可演示、可解释、也有长期平台想象力。

Demo 目标：

- 30 秒内让评委理解核心价值。
- 2 到 3 分钟内看到父代 Agent、融合过程、子代报告和 Arena 对比。
- 让评委感到“新、讲得清、延展性强”。

## 3. 产品主线

核心流程：

1. 展示父代 Agent DNA 档案。
2. 计算 Compatibility。
3. 点击 Breed 进入 Fusion Chamber。
4. 生成 Child Agent。
5. 输出继承、突变与 Gene 报告。
6. 在 Arena 中对比父代与子代表达。

当前 Genome 五层：

- `Soul`：个性、行为倾向、表达风格。
- `Skills`：能力边界和可调用能力。
- `Memory`：长期经验摘要和行为印记。
- `Wiki / Knowledge`：知识包或专业领域。
- `Gene`：压缩策略基因，包括 signals、strategy、constraints、validation、avoid、evidence。

## 4. 当前实现状态

项目目录：

```text
evolver-hackathon/
```

当前是零依赖静态 MVP。

关键代码：

- `apps/web/index.html`
- `apps/web/styles.css`
- `apps/web/app.js`
- `data/mock/agents.json`
- `src/core/compatibility-engine.js`
- `src/core/fusion-engine.js`
- `src/core/gene-fusion-engine.js`
- `src/core/arena-engine.js`
- `src/integrations/evolver/asset-to-genome.js`

当前能力：

- 4 个预设父代 Agent。
- 4 个预设 Arena：Research / Build / Safety / Balanced。
- 支持选择两个父代。
- 支持选择 Arena。
- 支持匹配度计算。
- 支持 Parent A / Parent B 同 Arena Fitness 评估。
- 支持 Parent Baseline 和 Best Parent Score。
- 支持 DNA / Gene Fusion Chamber。
- 支持子代 Agent 生成。
- 支持 Child Report。
- 支持 Strategy Gene 继承、重组、突变状态和 fitness test 展示。
- 支持 Child Fitness Dashboard。
- 支持一次 Breed 内部生成 3 个 Child Candidates。
- 支持自动选择最佳 Child。
- 支持 Export Child Genome JSON、Runtime Config mock 和 Share Card data。
- 支持 Evolution Delta 和 Regression / Neutral / Improved / Breakthrough 状态判断。
- 支持 Arena 父代 / 子代表达对比。

验证状态：

- `npm run check` 已通过。
- JSON 解析验证已通过。
- 本地服务 smoke test 已返回 `HTTP/1.1 200 OK`。

## 5. Evolver 相关上下文

已经分析过 `evolver-main` 中 Gene 压缩规则。

关键认知：

- Gene 是从运行经验、失败案例和策略中压缩出来的结构化行动协议。
- Gene 不是完整记忆，而是可复用策略。
- Gene 通常包含触发信号、前置条件、行动策略、约束、验证命令、反模式和证据。
- EvoMate 应该把 Evolver Gene 作为第五层 Genome，而不是只把它当文档素材。

已落地：

- `src/core/gene-fusion-engine.js`
- `src/integrations/evolver/asset-to-genome.js`
- 父代 mock Agent 的 `genes` 字段。
- Child Report 和 Arena 的 Gene 展示。

后续要做：

- 接入真实 `evolver-main/assets/gep/genes.json`。
- 增加 Gene schema validator。
- 增加 Gene compatibility score。
- 增加 Gene 显隐性和多代谱系。

## 6. OpenClaw 相关上下文

OpenClaw 被定位为未来运行时和基础设施参考。

可结合点：

- Agent 接入层。
- Tool / Skill / Memory / Session 抽象。
- 本地运行时和 sandbox 能力。
- 子代 Agent 产出后的标准化测试流程。
- 可视化平台和多 Agent 运行编排。

当前已经沉淀：

```text
docs-zh/openclaw-evomate-integration-prd.zh-CN.md
```

后续方向：

- 将 OpenClaw 运行资产映射为 Agent Genome。
- 将 EvoMate 子代 Agent 接入 OpenClaw runtime。
- 用 OpenClaw 的工具、记忆、会话结构丰富 EvoMate 的 Arena Evaluation。

## 7. 已沉淀文档与资产

中文文档入口：

```text
docs-zh/README.zh-CN.md
```

重要文档：

- `docs-zh/project-handbook-current.zh-CN.md`
- `docs-zh/prd-current.zh-CN.md`
- `docs-zh/prd-v0.3.zh-CN.md`
- `docs-zh/prd-v0.2.zh-CN.md`
- `docs-zh/prd-v0.1.zh-CN.md`
- `docs-zh/evolution-protocol.zh-CN.md`
- `docs-zh/genome-schema.zh-CN.md`
- `docs-zh/arena-evaluation.zh-CN.md`
- `docs-zh/demo-script-v0.3.zh-CN.md`
- `docs-zh/prd.zh-CN.md`
- `docs-zh/architecture.zh-CN.md`
- `docs-zh/evolver-gene-compression-and-evomate-development.zh-CN.md`
- `docs-zh/evolver-gene-layer-development-v1.zh-CN.md`
- `docs-zh/openclaw-evomate-integration-prd.zh-CN.md`
- `分布式开发机制.zh-CN.md`
- `module-manifest.json`

开发日志入口：

```text
开发日志/README.zh-CN.md
```

已经有：

- 项目文件总览。
- 项目初始化与路演资产沉淀。
- 分布式开发机制与模块协议。
- 社媒招募长图与队友文案。
- Evolver Gene 压缩规则分析。
- Gene Layer V1 开发迭代。
- 开发日志规则。

路演资产：

- `lightning-pitch/`
- 可爱小龙虾版 pitch 图片相关文件夹。
- 社媒招募长图相关文件夹。

## 8. 分布式开发机制

已经建立模块拆分：

- 产品叙事与 Pitch。
- 前端体验与动效。
- 前端编排。
- Genome Core Logic。
- Genome Data and Content。
- OpenClaw and Evolver Adapter。
- QA / Release / Integration。

机器可读协议：

```text
module-manifest.json
```

开发原则：

- 不同队友按模块拥有路径。
- 改动前说明范围。
- 使用共享数据协议组装。
- 每次完整迭代写中文开发日志。

## 9. 当前最重要的下一步

建议优先级：

1. 将 `AgentGenome`、`Chromosome`、`Locus`、`ArenaEvaluationResult` 抽成稳定 JSON schema 文件。
2. 让 Fusion Engine 根据 Arena required loci 影响继承概率。
3. 强化 Fusion Chamber 的 Gene / Chromosome 四阶段可视化。
4. 把 Export 从复制 JSON 升级为下载文件和 OpenClaw Runtime Config。
5. 接入真实 Evolver Gene asset，哪怕只接一两个样例。
6. 准备 v0.3 Demo 口播，把“3 candidates → best child → export genome”讲清楚。

## 10. 当前项目金句

可用于路演：

> EvoMate 的关键不是让两个 Agent 生一个名字更酷的新 Agent，而是让它们把压缩后的行为策略也遗传下去。

> 我们把 Agent 的经验压缩成 Gene，让下一代 Agent 继承的不只是人格和技能，而是一套可测试的行动协议。

> 今天它是一个 Hackathon Sandbox，明天它可能是企业生成任务专属 Agent 的进化协议。

