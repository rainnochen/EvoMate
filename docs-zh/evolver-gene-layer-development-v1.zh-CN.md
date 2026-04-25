> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate Gene Layer 开发版本 V1

日期：2026-04-25

## 1. 版本定位

本版本把 EvoMate 从四层 Genome：

```text
Soul / Skills / Memory / Wiki
```

升级为五层 Genome：

```text
Soul / Skills / Memory / Wiki / Gene
```

这里的 `Gene` 不是外观标签，而是来自 Evolver 思路的“压缩策略基因”：它把过往行为经验、触发信号、执行策略、约束和验证命令压缩成一个可继承、可重组、可测试的结构。

## 2. 为什么要加 Gene 层

原本的 EvoMate 已经可以展示父代 Agent 的 personality、skills、memory 和 knowledge，并生成子代 Agent。

但如果只停留在这四层，Demo 容易被理解成“换皮 Agent 卡牌”。

加入 Gene 层后，EvoMate 可以讲清楚一个更硬核的观点：

> Agent 的进化不只是人格与技能组合，而是可执行策略协议的继承、重组和验证。

这会让项目更贴近红药丸赛道的 `Build For Future`：

- 从 Prompt Engineering 走向 Genome Engineering。
- 从 Agent 配置走向 Agent 进化协议。
- 从好看的配对动画走向可验证的子代能力表达。

## 3. 当前实现内容

### 3.1 父代 Agent 增加 Strategy Gene

文件：

```text
data/mock/agents.json
```

每个父代 Agent 新增 `genes` 字段。

当前 4 个预设 Gene：

- `gene_gep_repair_from_errors`：失败修复型 Gene，对应 Atlas。
- `gene_pitch_story_compression`：路演叙事压缩型 Gene，对应 Muse。
- `gene_weak_signal_discovery`：弱信号探索型 Gene，对应 Nomad。
- `gene_clarify_before_action`：行动前澄清型 Gene，对应 Lumen。

每个 Gene 包含：

- `id`
- `summary`
- `category`
- `signals_match`
- `preconditions`
- `strategy`
- `constraints`
- `validation`
- `avoid`
- `evidence`

### 3.2 新增 Gene Fusion Engine

文件：

```text
src/core/gene-fusion-engine.js
```

职责：

- 从父代中选择 strongest Gene。
- 合并触发信号 `signals_match`。
- 合并执行策略 `strategy`。
- 合并约束 `constraints`。
- 过滤并继承安全的 `validation` 命令。
- 根据 mutation 分数生成稳定重组或策略突变。
- 输出子代 `child.genes`、`geneReport`、`fitnessTests` 和 `geneFusionLog`。

当前安全边界：

- 只允许 `node`、`npm`、`npx` 开头的 validation。
- 拦截 `node -e`、`node --eval`、`node -p`、`rm -rf` 等高风险命令。
- `constraints.max_files` 使用父代中更严格的上限。
- `forbidden_paths` 使用父代并集。

### 3.3 Fusion Engine 接入 Gene 层

文件：

```text
src/core/fusion-engine.js
```

新增行为：

- `fuseGenomes()` 内部调用 `fuseStrategyGenes()`。
- 子代对象新增：
  - `genes`
  - `inheritedGenes`
  - `geneReport`
  - `fitnessTests`
- Fusion Chamber 的日志新增 Gene 继承、信号压缩、fitness test 和 mutation 状态。

### 3.4 新增 Evolver Adapter

文件：

```text
src/integrations/evolver/asset-to-genome.js
```

职责：

- 将 Evolver 资产中的 Gene / Capsule 结构适配为 EvoMate 的 `AgentGenome.genes`。
- 为后续接入 `evolver-main/assets/gep/genes.json` 留出稳定入口。

当前是最小可用 adapter，后续可以继续扩展为：

- 读取真实 Evolver Gene asset。
- 从 Learning Capsule 生成 Gene。
- 将多个 Gene 映射到不同 Agent 或同一 Agent 的多基因池。

### 3.5 前端展示升级

文件：

```text
apps/web/index.html
apps/web/app.js
apps/web/styles.css
```

新增展示：

- Lab Entrance 显示第五层 `Gene`。
- 父代 Agent 卡片展示 `Strategy Genes`。
- Child Report 增加 `Gene` 区块。
- Child Report 增加 `Dominant Gene / Signals / Strategy Steps / Mutation` 指标。
- Child Report 增加 `Fitness Tests`。
- Arena 输出中展示父代和子代的 Gene 信息。

## 4. 当前 MVP 演示方式

推荐演示路径：

1. 选择 Atlas + Muse。
2. 说明 Atlas 带有“失败修复型 Gene”，Muse 带有“叙事压缩型 Gene”。
3. 点击 Breed。
4. 在 Fusion Chamber 中强调：系统不仅融合 Soul / Skills / Memory / Wiki，也融合 Strategy Gene。
5. 在 Child Report 中展示子代的新 Gene、信号数量、策略步数、fitness tests。
6. 在 Arena 中说明子代不是换皮，而是携带一套可验证的行动协议。

推荐口播：

> EvoMate 的关键不是让两个 Agent 生一个名字更酷的新 Agent，而是让它们把压缩后的行为策略也遗传下去。我们把 Evolver 里的 Gene 思路接进 EvoMate，让子代同时继承触发信号、行动策略、约束和验证命令。这样 Agent 进化就不只是人格混合，而是可测试的协议重组。

## 5. 后续迭代建议

### 5.1 算法方向

- 加入 Gene compatibility score。
- 支持多 Gene 池选择，而不是只取 strongest Gene。
- 给 Gene 增加 dominant / recessive 显隐性。
- 增加 rare mutation，例如产生新的 validation strategy。

### 5.2 工程方向

- 接入真实 `evolver-main/assets/gep/genes.json`。
- 增加 Gene schema validator。
- 增加 `npm run check:gene`。
- 将 FusionResult 写成稳定 JSON schema。

### 5.3 Demo 方向

- Fusion Chamber 中增加 Gene 粒子流。
- Child Report 中把 Gene 展示为可视化芯片。
- Arena 中展示“通过 / 未通过 fitness test”的状态。
- 增加 Gene lineage 小图，展示父代 Gene 如何变成子代 Gene。

## 6. 当前边界

- 目前 Gene 数据是 mock，不是真实 Evolver 运行产物。
- 当前 Gene Fusion 是规则系统，不是模型生成。
- 当前 validation 只作为展示和协议字段，不会在浏览器内执行。
- 当前 Evolver Adapter 已创建，但还没有接入真实文件加载流程。

## 7. 验收标准

本版本完成后，项目应该满足：

- 页面仍然可以正常启动。
- 4 个父代 Agent 都能展示 Strategy Gene。
- 点击 Breed 后，子代能生成 Gene Report。
- Fusion Log 能看到 Gene 继承与 fitness test。
- Arena 能展示子代携带 Gene 协议。
- `npm run check` 能通过语法检查。
