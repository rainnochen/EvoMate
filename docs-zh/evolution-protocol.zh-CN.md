> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate Evolution Protocol

版本：v0.1

日期：2026-04-25 20:34:20

## 1. 协议定位

EvoMate Evolution Protocol 定义一套 Agent 如何被选择、评估、压缩、融合、变异、再评估和导出的标准流程。

核心闭环：

```text
Task / Arena
→ Parent Matching
→ Parent Baseline Evaluation
→ Genome Compression
→ Compatibility Check
→ Fusion Plan
→ Mutation Plan
→ Child Candidates
→ Child Evaluation
→ Evolution Delta
→ Export / Share / Continue Evolution
```

## 2. Protocol Objects

核心对象：

- `AgentGenome`
- `Arena`
- `EvaluationResult`
- `FusionPlan`
- `MutationPlan`
- `ChildGenome`
- `EvolutionRun`
- `ExportPayload`

## 3. EvolutionRun

`EvolutionRun` 是一次完整进化运行。

```json
{
  "run_id": "evo_run_build_arena_atlas_muse",
  "arena_id": "build_arena",
  "parents": ["atlas", "muse"],
  "parent_baseline": {
    "average_parent_score": 74,
    "best_parent_score": 79
  },
  "children": [
    {
      "id": "atlas-muse-child-build_arena-02",
      "score": 83,
      "delta_vs_average": 9,
      "delta_vs_best_parent": 4,
      "status": "Improved"
    }
  ],
  "selected_child_id": "atlas-muse-child-build_arena-02"
}
```

## 4. 服务流程

### 4.1 Agent Match Service

输入：

- Arena。
- User goal。
- Required loci。
- Agent registry。

输出：

- Candidate parent pairs。
- Match score。
- 推荐理由。

当前 MVP 状态：

- 仍以手动 Parent Selection 为主。
- 兼容性评分由 `compatibility-engine.js` 计算。

后续升级：

```text
Pair Match Score =
0.35 * Required Loci Coverage
+ 0.25 * Complementarity
+ 0.20 * Safety Compatibility
+ 0.10 * Tool Compatibility
+ 0.10 * Historical Performance
```

### 4.2 Parent Evaluation Service

输入：

- Parent Agent。
- Arena。

输出：

- Overall Fitness。
- Task Success。
- Safety。
- Novelty。
- Stability。

当前实现：

```text
src/core/evaluation-engine.js
```

### 4.3 Genome Compression Service

目标不是总结，而是把复杂 Agent 能力压缩成：

- 可比较。
- 可继承。
- 可融合。
- 可变异。
- 可评估。

当前 MVP 状态：

- 使用 mock Strategy Gene。
- 通过 `src/integrations/evolver/asset-to-genome.js` 预留 Evolver adapter。

### 4.4 Fusion Engine

目标：

- 根据 Arena pressure 和 compatibility 将 Parent Genome 重组为 Child Genome。

当前实现：

```text
src/core/fusion-engine.js
src/core/gene-fusion-engine.js
```

当前能力：

- Soul / Skills / Memory / Knowledge 融合。
- Strategy Gene 重组。
- Mutation 注入。
- Arena pressure 写入 Fusion Log。

后续升级：

```text
Inheritance Weight =
Parent Locus Strength
* Arena Locus Importance
* Heritability
* Safety Compatibility
```

### 4.5 Mutation Engine

Mutation 是可控扰动，不是随机炫技。

当前 MVP 支持三类候选画像：

- Strengthening Mutation。
- Bridging Mutation。
- Risk-reducing Mutation。

后续完整 Mutation 类型：

- `strengthening`
- `bridging`
- `risk_reducing`
- `trait_drift`
- `gene_amplification`
- `gene_suppression`
- `hybrid_gene_birth`

### 4.6 Child Candidate Selection

当前已实现：

```text
One-click Breed
→ Generate 3 candidates internally
→ Evaluate all candidates
→ Select best child
→ Show selected child
```

选择规则：

1. 优先选择 Overall Fitness 更高的候选。
2. 分数相同则选择 Safety 更高的候选。

### 4.7 Export Service

当前已实现：

- Child Genome JSON。
- Runtime Config mock。
- Share Card 数据。

导出目标：

- 让 Child Genome 成为可交付资产。
- 为 OpenClaw / LangGraph / CrewAI / AutoGen 等 runtime 预留映射空间。

## 5. 当前实现与协议差距

已实现：

- Parent Baseline。
- Compatibility。
- Fusion。
- Strategy Gene Recombination。
- 3 Child Candidates。
- Best Child Selection。
- Evolution Delta。
- Export Payload。

未实现：

- 自动 Agent Match。
- 真实 Genome Compression。
- Arena-aware inheritance probability。
- 多代 Evolution Loop。
- 真实 runtime agent generation。

## 6. 下一步

优先级：

1. 把协议对象落成 JSON Schema。
2. 让 Arena required loci 真正影响 fusion inheritance。
3. 支持多代 Evolution Loop Controller。
4. 接入真实 Evolver Gene asset。
5. 导出 OpenClaw Runtime Config。
