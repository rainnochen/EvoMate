> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 产品说明书 v0.1 实现说明

日期：2026-04-25 20:34:20

## 1. 本次迭代目标

基于《EvoMate 产品说明书 v0.1》，把当前 MVP 从“Agent 配对生成 Child”升级为：

```text
Parent Genome → Arena Evaluation → Genome Fusion → Mutation → Child Evaluation → Evolution Delta
```

本次重点不是重做全部工程架构，而是在现有零依赖静态 Demo 中跑通 v0.1 的核心产品判断：

> 进化成功 = 子代在同一 Arena 中相对亲本基线产生正向 Fitness Delta。

## 2. 已落地能力

### 2.1 Arena Selector

新增 4 个 Arena：

- `Research Arena`：研究与信息整理能力。
- `Build Arena`：从想法到 prototype 的执行能力。
- `Safety Arena`：风险任务下的稳定与边界。
- `Balanced Arena`：任务能力、安全性、新颖性与稳定性综合评估。

每个 Arena 定义：

- `id`
- `name`
- `subtitle`
- `task`
- `requiredLoci`

### 2.2 Agent Genome 五条染色体

当前前端已将 Agent 映射为五条 Chromosome：

- `Cognitive`
- `Tool`
- `Memory`
- `Personality`
- `Safety`

每条 Chromosome 下有多个 Locus，并根据 Agent 的 radar、skills、memory、knowledge、genes 计算强度。

### 2.3 Parent Baseline

选择 Arena 和两个 Parent Agent 后，系统会评估：

- Parent A Score
- Parent B Score
- Average Parent Baseline
- Best Parent Score

当前 baseline 计算：

```text
Parent Baseline = (Parent A Score + Parent B Score) / 2
```

### 2.4 Fitness Score

新增 MVP 评分公式：

```text
Overall Fitness =
0.40 * Task Success
+ 0.25 * Safety
+ 0.20 * Novelty
+ 0.15 * Stability
```

当前输出指标：

- `taskSuccess`
- `safety`
- `novelty`
- `stability`
- `overall_score`

### 2.5 Evolution Delta

Child 生成后，系统在同一 Arena 下评估 Child，并计算：

```text
Evolution Delta = Child Score - Parent Baseline
```

状态规则：

- `<= -5`：Regression
- `-5 ~ 3`：Neutral
- `3 ~ 10`：Improved
- `>= 10`：Breakthrough

### 2.6 Arena 条件化融合

Fusion Engine 现在支持传入 Arena。

当前已经在 Fusion Log 中展示：

```text
Arena pressure applied: Build Arena.
```

这为后续实现真正的 Arena 条件化继承概率打下接口基础。

## 3. 新增与修改文件

### 新增

```text
src/core/evaluation-engine.js
docs-zh/evomate-product-spec-v0.1-implementation.zh-CN.md
开发日志/2026-04-25-产品说明书-v0.1-开发迭代.zh-CN.md
```

### 修改

```text
apps/web/index.html
apps/web/app.js
apps/web/styles.css
data/mock/agents.json
src/core/fusion-engine.js
package.json
src/README.md
module-manifest.json
docs-zh/README.zh-CN.md
开发日志/README.zh-CN.md
开发日志/skills/evomate-context-keeper/references/history-context.zh-CN.md
```

## 4. 当前演示路径

1. 打开 EvoMate。
2. 选择一个 Arena，例如 `Build Arena`。
3. 选择 Parent A 和 Parent B。
4. 查看 Parent A Score、Parent B Score 和 Baseline。
5. 点击 `Breed Selected Agents`。
6. 查看 Fusion Chamber 中的 Arena pressure、Gene fusion 和 Mutation log。
7. 查看 Child Report 中的 Child Fitness 与四项指标。
8. 查看 Arena Evaluation 中的 Parent Baseline、Child Fitness、Evolution Delta 和状态。

## 5. 和 v0.1 产品说明书的对应关系

| 产品说明书模块 | 当前实现状态 |
|---|---|
| Select Arena | 已实现 |
| Evaluate Parent A / B | 已实现 |
| Calculate Parent Baseline | 已实现 |
| Extract / Load Parent Genomes | 已用 mock genome 实现 |
| Genome Fusion | 已实现 |
| Mutation | 已实现基础版 |
| Generate Child Genome | 已实现 |
| Evaluate Child in Same Arena | 已实现 |
| Compare Child vs Parent Baseline | 已实现 |
| Evolution Result | 已实现 |
| 真实 Evolver 接入 | 未实现 |
| 多 Child Candidate | 未实现 |
| Export Child Genome JSON | 未实现 |
| 真实 benchmark 执行 | 未实现 |

## 6. 当前边界

- Fitness 评分是 MVP 规则算法，不是真实 benchmark。
- Chromosome / Locus 是从现有 Agent mock 数据推导，不是完整持久化 schema。
- Fusion 目前只记录 Arena pressure，尚未真正按 `inherit_probability = heritability * parent_fitness * task_relevance * compatibility` 进行概率采样。
- Child Agent 还没有导出为可运行 runtime 配置。

## 7. 下一步建议

优先做三件事：

1. 把 `AgentGenome` 和 `ArenaEvaluationResult` 写成稳定 JSON schema。
2. 让 Fusion Engine 根据 Arena required loci 调整继承概率。
3. 增加 `Export Child Genome JSON`，把 Demo 从展示推进到可交付资产。
