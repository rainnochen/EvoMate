# EvoMate Arena Evaluation

版本：v0.1

日期：2026-04-25

## 1. 评估原则

EvoMate 使用 Self-comparison Evaluation：

```text
Parent A → Arena → Parent A Score
Parent B → Arena → Parent B Score
Child → Same Arena → Child Score
Child Score - Parent Baseline = Evolution Delta
```

只有在同一 Arena 下比较，进化结果才有意义。

## 2. Arena

Arena 是任务选择压力。

```json
{
  "id": "build_arena",
  "name": "Build Arena",
  "description": "Evaluates whether an agent can turn a product idea into a demo-ready build plan.",
  "required_loci": {
    "planning_strategy": 0.9,
    "tool_orchestration": 0.85,
    "product_reasoning": 0.8,
    "stability": 0.75,
    "novelty": 0.6
  },
  "scoring_weights": {
    "task_success": 0.4,
    "safety": 0.25,
    "novelty": 0.2,
    "stability": 0.15
  }
}
```

当前 MVP Arena 使用：

- `id`
- `name`
- `subtitle`
- `task`
- `requiredLoci`

## 3. 当前 4 个 Arena

| Arena | 评估重点 |
|---|---|
| Research Arena | 信息整理、研究综合、来源验证 |
| Build Arena | 规划、工具使用、原型执行、稳定交付 |
| Safety Arena | 守护边界、review policy、风险控制 |
| Balanced Arena | 任务能力、安全、新颖性、稳定性综合 |

## 4. Fitness Metrics

```text
Overall Fitness =
0.40 * Task Success
+ 0.25 * Safety
+ 0.20 * Novelty
+ 0.15 * Stability
```

指标说明：

| 指标 | 含义 |
|---|---|
| Task Success | 当前 Arena required loci 的覆盖程度 |
| Safety | 安全染色体、review policy、工具风险 |
| Novelty | 是否产生有价值的新组合或变异 |
| Stability | required loci 是否完整，mutation 是否过度 |

## 5. Baseline

```text
Parent Baseline = (Parent A Score + Parent B Score) / 2
Best Parent Score = max(Parent A Score, Parent B Score)
```

必须同时展示：

- Delta vs Average。
- Delta vs Best Parent。

原因：

- 超过平均值说明融合有效。
- 超过最佳 Parent 才更有说服力。

## 6. Evolution Delta

```text
Evolution Delta = Child Score - Parent Baseline
```

状态规则：

| Delta | 状态 |
|---|---|
| <= -5 | Regression |
| -5 ~ 3 | Neutral |
| 3 ~ 10 | Improved |
| >= 10 | Breakthrough |

## 7. 当前默认结果

默认 Demo：

- Arena：Build Arena。
- Parent A：Atlas。
- Parent B：Muse。
- Candidate count：3。
- Selected child：best candidate。

当前语义验证结果：

```json
{
  "candidate_count": 3,
  "selected": "Astra-Build-03",
  "selected_score": 85,
  "delta": 11,
  "status": "Breakthrough"
}
```

验证原则：

- Child 超过 Parent Average。
- 最好超过 Best Parent。
- 状态至少为 `Improved`。

## 8. 后续升级

P0：

- 将 Arena required loci 从数组升级为带权重对象。
- 让 Fusion Engine 真正读取 Arena weight。
- 导出 EvaluationResult JSON。

P1：

- 引入真实 benchmark。
- 引入 LLM-as-judge 或 rule+eval 混合评估。
- 增加评估解释报告。

P2：

- 支持跨代 fitness curve。
- 支持 population selection。
- 支持长期 benchmark history。
