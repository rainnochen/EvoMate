> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate Genome Schema

版本：v0.1

日期：2026-04-25

## 1. 设计目标

EvoMate Genome Schema 用来描述一个 Agent 中哪些能力可以被遗传、比较、融合、变异和评估。

设计原则：

- 不遗传完整原始日志。
- 不把 prompt 当作唯一资产。
- 把复杂能力压缩为可追踪 Gene。
- 每个 Gene 都应能映射到 Chromosome / Locus。

## 2. AgentGenome

```json
{
  "id": "atlas",
  "name": "Atlas",
  "version": "0.1.0",
  "source": "mock",
  "chromosomes": {
    "cognitive": [],
    "tool": [],
    "memory": [],
    "knowledge": [],
    "style": [],
    "safety": []
  },
  "genes": [],
  "metadata": {
    "created_at": "2026-04-25"
  }
}
```

当前 P0 染色体协议版本中，`AgentGenome` 由 `data/mock/agents.json` 的轻量字段通过：

```text
src/core/genome-engine.js
```

动态构建，并在 Child 生成时持久化到：

```text
child.genome
```

正式 JSON schema 文件：

```text
schemas/agent-genome.schema.json
schemas/chromosome.schema.json
schemas/locus.schema.json
```

## 3. Chromosome

建议标准染色体：

| Chromosome | 作用 |
|---|---|
| `cognitive` | 推理、规划、反思、系统提示 |
| `tool` | 工具注册、工具偏好、路由策略、风险策略 |
| `memory` | 记忆结构、检索、压缩策略 |
| `knowledge` | 领域知识、知识胶囊 |
| `style` | 表达风格、叙事、语气 |
| `safety` | 守护边界、review policy、禁止行为 |

当前前端展示的五条：

- Cognitive。
- Tool。
- Memory。
- Personality。
- Safety。

## 4. Locus

Locus 是可独立继承、交换、突变和评估的最小位置。

```json
{
  "locus_id": "planning_strategy",
  "path": "cognitive.planning_strategy",
  "gene_id": "planning_strategy.v1",
  "strength": 0.86,
  "heritability": 0.9,
  "mutation_sensitivity": 0.3,
  "safety_risk": 0.1,
  "source_parent": "atlas",
  "status": "active"
}
```

## 5. Gene

Gene 是可遗传能力单元。

```json
{
  "gene_id": "planning_strategy.v1",
  "locus": "planning_strategy",
  "chromosome": "cognitive",
  "value": "Milestone-based structured planning",
  "strength": 0.86,
  "heritability": 0.9,
  "mutation_sensitivity": 0.3,
  "safety_risk": 0.1,
  "source_agent": "atlas",
  "source_trace": ["system_prompt", "examples", "evaluation_logs"]
}
```

当前正式 P0 版本 Strategy Gene 结构：

```json
{
  "type": "Gene",
  "id": "gene_gep_repair_from_errors",
  "summary": "Compress failure signals into a cautious repair workflow with validation gates.",
  "category": "repair",
  "signals_match": [],
  "preconditions": [],
  "strategy": [],
  "constraints": {
    "max_files": 5,
    "forbidden_paths": [".git", "node_modules"]
  },
  "validation": ["npm run check"],
  "avoid": [],
  "evidence": {
    "confidence": 0.88,
    "capsules": 4
  }
}
```

## 6. Mutation

```json
{
  "mutation_id": "mutation_demo_oriented_reasoning",
  "type": "bridging",
  "target_loci": [
    "planning_strategy",
    "product_narrative"
  ],
  "before": "Separate build planning and storytelling.",
  "after": "Transforms build milestones into demo-ready narrative.",
  "intensity": 0.35,
  "risk": 0.12
}
```

当前 MVP 中，Candidate Profile 会生成：

- `Strengthening Mutation`
- `Bridging Mutation`
- `Risk-reducing Mutation`

## 7. Inheritance Trace

```json
{
  "locus": "planning_strategy",
  "selected_parent": "atlas",
  "reason": "Higher arena-weighted planning score.",
  "parent_a_strength": 0.86,
  "parent_b_strength": 0.52,
  "arena_weight": 0.9
}
```

当前 MVP 中，继承 trace 主要体现在：

- `inheritanceLog`
- `fusionLog`
- `geneFusionLog`
- `exportPayload.selected_child.genome`

## 8. Export Payload

当前导出结构：

```json
{
  "schema_version": "evomate-evolution-run-v0.1",
  "run_id": "evo_run_build_arena_atlas_muse",
  "arena": {},
  "parents": [],
  "parent_baseline": {},
  "selected_child": {
    "id": "atlas-muse-child-build_arena-02",
    "genome": {},
    "evaluation": {},
    "evolution_result": {}
  },
  "candidates": [],
  "runtime_config": {},
  "share_card": {}
}
```

## 9. 当前落地状态

已落地：

- `schemas/agent-genome.schema.json`
- `schemas/chromosome.schema.json`
- `schemas/locus.schema.json`
- `src/core/genome-engine.js`
- `src/core/fusion-engine.js` 已按 chromosome / locus 做 inheritance selection

仍待补充：

- `arena.schema.json`
- `evaluation-result.schema.json`
- `evolution-run.schema.json`
- schema validation script
