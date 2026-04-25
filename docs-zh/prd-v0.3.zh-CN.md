> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 产品 PRD v0.3

版本：v0.3

日期：2026-04-25

状态：当前主 PRD。基于 Agent Evolution Protocol 产品方案和本次代码迭代整理。

## 1. 产品定义

EvoMate 是一个 Agent Evolution Protocol。

它会在特定任务 Arena 中评估父代 Agent，把它们的能力压缩成可遗传基因，再通过融合与变异生成多个子代候选，并用 Evolution Delta 验证子代是否真的进化成功。

一句话：

> EvoMate breeds better agents for the task.

中文短句：

> EvoMate 让 Agent 不只是被创建，而是被进化出来。

## 2. 产品核心闭环

```text
选择 Parent Agents
→ 选择 Arena / Task
→ Parent Baseline Evaluation
→ Genome Compression
→ Compatibility Check
→ Fusion
→ Mutation
→ Child Candidate Generation
→ Child Evaluation
→ Evolution Delta
→ 保存 / 分享 / 导出 / 继续进化
```

当前 MVP 已实现：

- 选择 Parent Agents。
- 选择 Arena。
- Parent Baseline Evaluation。
- 正式 AgentGenome / Chromosome / Locus schema。
- Compatibility Check。
- Fusion。
- Mutation。
- 3 Child Candidates。
- Child Evaluation。
- Evolution Delta。
- Export Child Genome JSON。

## 3. 两层系统设计

EvoMate 拆成两个互相咬合的系统。

### 3.1 产品层

回答：

```text
人类用户怎样理解、操作、控制、信任这个进化过程？
```

体验模块：

- Agent Discovery。
- Compatibility View。
- Fusion Chamber。
- Child Report。
- Save / Share / Export。

### 3.2 Agent 服务层

回答：

```text
Agent 如何根据协议自动完成匹配、评估、融合、变异和循环优化？
```

服务模块：

- Agent Match Service。
- Parent Evaluation Service。
- Genome Compression Service。
- Compatibility Service。
- Fusion Engine。
- Mutation Engine。
- Child Agent Generator。
- Child Evaluation Service。
- Evolution Loop Controller。
- Result Delivery。

## 4. 产品层需求

### 4.1 Agent Discovery

P0：

- 用户可以手动选择两个 Parent Agent。
- 每个 Agent Card 展示 strength、weakness、Genome、Strategy Gene、Chromosome strip。

P1：

- 通过 command 选择，例如 `/evolve build me a product demo agent`。
- 根据目标任务自动匹配 Parent。
- 接 GitHub / Local Agent Library / Open Source Agent Index。

当前实现：

- 已支持手动选择。
- 未实现 command 和自动匹配。

### 4.2 Compatibility View

展示四类信息：

- Complementarity。
- Overlap。
- Conflict。
- Fusion Risk。

当前实现：

- 已展示 Personality、Skill Mix、Knowledge、Mutation 和总分。

后续：

- 增加 conflict loci。
- 增加 fusion risk 解释。

### 4.3 Fusion Chamber

目标：

让用户看到进化正在发生，而不是看到一个普通 loading。

建议四阶段：

1. Genome Extraction。
2. Gene Compression。
3. Cross-over Fusion。
4. Mutation Injection。

当前实现：

- 已有 Fusion Chamber 动画。
- 已有 event log。
- 已显示 Arena pressure、Gene fusion、candidate generation。

后续：

- 将四阶段明确做成 timeline。
- 增加 locus 流动和 mutation 节点闪烁。

### 4.4 Child Report

应展示：

- Identity。
- Genome Map。
- Inherited Traits。
- Mutations。
- Evaluation。
- Export。

当前实现：

- 已展示 Child identity。
- 已展示 Soul / Skills / Memory / Wiki / Gene。
- 已展示 Child Fitness。
- 已展示 Gene Report。
- 已展示 3 candidates selected result。
- 已展示 Export Child Genome JSON。

### 4.5 Save / Share / Export

P0 导出格式：

- Child Genome JSON。
- Runtime Config mock。
- Share Card。

当前实现：

- 已在 Export Payload 中生成三者。
- 前端可复制 JSON。

后续：

- 增加下载文件。
- 增加图片 Share Card。
- 增加 OpenClaw Runtime Config 映射。

## 5. Agent 服务层需求

### 5.1 Agent Match Service

输入：

- arena_id。
- task。
- required_loci。
- agent registry。

输出：

- candidate_pairs。
- match_score。
- reason。

P1 公式：

```text
Pair Match Score =
0.35 * Required Loci Coverage
+ 0.25 * Complementarity
+ 0.20 * Safety Compatibility
+ 0.10 * Tool Compatibility
+ 0.10 * Historical Performance
```

当前状态：

- 未实现自动匹配。

### 5.2 Parent Evaluation Service

当前已实现：

```text
src/core/evaluation-engine.js
```

输出：

- overall_score。
- taskSuccess。
- safety。
- novelty。
- stability。
- highlighted_loci。

### 5.3 Genome Compression Service

目标：

把 Agent 的复杂行为压缩成可比较、可继承、可融合、可变异、可评估的标准 Gene。

当前实现：

- 使用 mock compressed genes。
- 已有 Evolver adapter stub。
- 已有正式 `genome-engine` 将 raw agent data 转为 `AgentGenome`。

后续：

- 接真实 Evolver Gene / Capsule。

### 5.4 Fusion Engine

当前已实现：

- Soul / Skills / Memory / Knowledge 融合。
- Strategy Gene Fusion。
- Chromosome / Locus 级 inheritance selection。
- Arena pressure 日志。
- Child 持久化正式 `child.genome`。

P0 下一步：

```text
Inheritance Weight =
Parent Locus Strength
* Arena Locus Importance
* Heritability
* Safety Compatibility
```

### 5.5 Mutation Engine

当前已实现 3 个候选 mutation profile：

- Strengthening Mutation。
- Bridging Mutation。
- Risk-reducing Mutation。

### 5.6 Child Agent Generator

当前输出：

- Child Genome。
- Export Payload。
- Runtime Config mock。
- Share Card data。

后续：

- 生成可运行 Agent Blueprint。
- 生成 OpenClaw Runtime Config。

### 5.7 Child Evaluation Service

当前已实现：

- 同 Arena 评估 Child。
- Delta vs Average。
- Delta vs Best Parent。
- Evolution Status。

### 5.8 Evolution Loop Controller

当前最小实现：

```text
One-click Breed
→ generate 3 candidates internally
→ evaluate all
→ select best child
→ show/export selected child
```

后续完整版本：

```json
{
  "max_generations": 5,
  "candidates_per_generation": 3,
  "stop_condition": {
    "min_delta": 3,
    "must_exceed_best_parent": true,
    "safety_threshold": 80,
    "stability_threshold": 70
  }
}
```

## 6. Protocol Objects

核心对象：

- AgentGenome。
- Arena。
- EvaluationResult。
- FusionPlan。
- MutationPlan。
- ChildGenome。
- EvolutionRun。
- ExportPayload。

详情见：

- `docs-zh/evolution-protocol.zh-CN.md`
- `docs-zh/genome-schema.zh-CN.md`
- `docs-zh/arena-evaluation.zh-CN.md`

## 7. 当前功能验收

Demo 必须能完成：

1. 打开 EvoMate。
2. 选择 Build Arena。
3. 默认 Atlas × Muse。
4. 查看 Compatibility Score。
5. 查看 Parent Baseline。
6. 点击 Breed。
7. Fusion Chamber 展示 candidate generation。
8. 生成 3 Child Candidates。
9. 系统选择 Best Child。
10. 展示 Child Report。
11. 展示 Evolution Delta。
12. 展示 Export Child Genome JSON。

## 8. P0 / P1 / P2

### P0

- AgentGenome JSON schema。
- Arena JSON schema。
- EvaluationResult JSON schema。
- Arena-aware Fusion Engine。
- Mutation Timeline。
- Child Report。
- Export Child Genome JSON。
- Evolution Delta 正向展示。

当前 P0 已完成：

- AgentGenome / Chromosome / Locus schema。
- Child Report。
- Export Child Genome JSON。
- Evolution Delta。
- 3 Candidate selection。

仍需完成：

- Arena / EvaluationResult / EvolutionRun schema 文件。
- Arena-aware inheritance probability。
- Mutation Timeline 视觉强化。

### P1

- 多 Child Candidate 可交互选择。
- Mutation Intensity Slider。
- Auto Match Parent Agents。
- Share Card 图片。
- Dependency Graph。
- Local Agent Library。

### P2

- 接 Evolver Gene asset。
- 接 OpenClaw runtime。
- 接 GitHub open-source Agent protocol。
- 接真实 benchmark。
- 支持多代谱系。
- 支持 population selection。
- 支持 decentralized breeding protocol。

## 9. 最关键产品判断

EvoMate 不能被讲成“两个 Agent 混合一下”。

真正价值是：

```text
面向具体任务，让 Agent 通过评估驱动的进化流程，自动生成更适合该任务的新 Agent。
```

核心闭环必须始终强调：

```text
Task → Evaluation → Genome → Fusion → Mutation → Re-evaluation → Delta
```

## 10. 当前版本结论

EvoMate v0.3 已从 Agent Genome Demo 进一步升级为 Agent Evolution Protocol MVP：

- 有 Arena。
- 有 Parent Baseline。
- 有 Gene Fusion。
- 有多 Candidate。
- 有 Best Child Selection。
- 有 Evolution Delta。
- 有 Export Payload。

它已经具备“可实现、可演示、可扩展”的产品骨架。
