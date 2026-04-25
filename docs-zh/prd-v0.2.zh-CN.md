> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 产品 PRD v0.2

版本：v0.2

日期：2026-04-25

状态：当前主 PRD，由当前代码、已有产品文档、开发日志和 Demo 实现逆向整理。

## 1. 产品基础信息

产品名称：

```text
EvoMate
```

副标题：

```text
Agent Genome Lab：让 AI Agent 通过基因融合、变异和评估完成进化。
```

一句话介绍：

> EvoMate 是一个 Agent Genome Lab。它将两个 Parent Agent 的能力编码为可遗传 Genome，通过融合与变异生成 Child Agent，并在同一 Arena 中比较子代与亲本基线，用 Fitness Delta 判断进化是否成功。

所属赛道：

```text
红药丸：Build For Future
```

项目类型：

```text
Hackathon MVP / Agent Evolution Sandbox / Agent Genome Protocol Prototype
```

## 2. 产品背景

当前 Agent 的能力通常散落在：

- system prompt
- tools
- memory
- skill docs
- safety rules
- interaction logs
- evaluation traces

这些资产大多不可遗传、不可组合、不可审计，也很难在同一标准下判断某次能力组合是否真的变强。

Evolver / EvoMap 的核心启发是：Agent 运行经验可以被压缩成 Gene、Capsule、EvolutionEvent，并通过 GEP 协议形成可审计的进化资产。

EvoMate 在此基础上做横向扩展：

```text
从单个 Agent 自我进化
扩展到两个 Agent 通过遗传、变异和评估产生子代 Agent。
```

## 3. 核心问题

EvoMate 试图回答三个问题：

### 3.1 Agent 的能力能否被遗传

把 Agent 的可复用能力抽象为 Genome，包括：

- cognitive
- tool
- memory
- personality
- safety
- strategy gene

### 3.2 Agent 的后代能否产生差异

通过 Genome Fusion、Strategy Gene Recombination 和 Mutation，让 Child Agent 不只是 Parent 的复制品，而是产生新的能力组合。

### 3.3 如何判断进化是否成功

通过 Arena Evaluation，在同一任务环境下比较 Parent 和 Child 表现。

核心判断：

```text
Evolution Success = Child Fitness Score > Parent Baseline
```

## 4. 产品目标

### 4.1 Hackathon MVP 目标

让用户在 2 到 3 分钟内看到完整闭环：

1. 选择 Arena。
2. 选择 Parent A / Parent B。
3. 查看 Parent Baseline。
4. 点击 Breed / Fuse。
5. 查看 Genome Fusion 和 Mutation。
6. 查看 Child Genome。
7. 查看 Child Fitness。
8. 查看 Evolution Delta。
9. 判断本次进化是否成功。

### 4.2 Demo 目标

评委应在 30 秒内理解：

- EvoMate 不是 Prompt Mixer。
- EvoMate 不是 AI 宠物游戏。
- EvoMate 是 Agent Genome + Evolution Evaluation 的实验系统。

评委应在 3 分钟内看到：

- 父代 Agent Genome。
- 子代 Agent 诞生。
- 子代相比父代基线更强或更弱的可解释结果。

### 4.3 产品长期目标

让企业未来不必手动组装最优 Agent，而是通过：

- breeding
- mutation
- arena evaluation
- selection
- lineage tracking

得到更适合业务目标的数字智能体。

## 5. 目标用户

### 5.1 当前用户

- Hackathon 评委。
- AI Agent 开发者。
- 对 Agent evolution、Agent infra、A2A、GEP 有兴趣的技术用户。
- 现场潜在队友和合作方。

### 5.2 未来用户

- 企业 Agent 平台建设者。
- AI 产品经理。
- Agent runtime / infra 团队。
- 研究型开发者。
- AI 教育与可视化平台。

## 6. 产品定位

EvoMate 不是：

- 普通 Agent Builder。
- Prompt Mixer。
- 工作流编排器。
- AI 宠物繁殖游戏。

EvoMate 是：

```text
一个 Agent 遗传、变异、评估和选择的进化实验系统。
```

核心产物不是 prompt，而是：

```text
Child Agent Genome
```

该 Genome 应该可以：

- 展示。
- 评估。
- 导出。
- 进入 lineage。
- 未来接入真实 Agent Runtime。

## 7. 产品核心概念

### 7.1 Agent Genome

Agent Genome 是对 Agent 可遗传能力的结构化表达。

当前包含：

- Soul / Personality。
- Skills。
- Memory fragments。
- Knowledge capsules。
- Strategy Genes。
- Radar traits。
- Chromosome / Locus 推导视图。

### 7.2 Chromosome

Chromosome 是 Agent Genome 的高层结构。

当前五条 Chromosome：

- Cognitive Chromosome。
- Tool Chromosome。
- Memory Chromosome。
- Personality Chromosome。
- Safety Chromosome。

### 7.3 Locus

Locus 是染色体内部可被评估、继承、突变的最小位置。

示例：

- `cognitive.reasoning_strategy`
- `tool.tool_routing_policy`
- `memory.memory_compression`
- `personality.creativity`
- `safety.review_policy`

### 7.4 Strategy Gene

Strategy Gene 是受 Evolver 启发的压缩策略基因。

它包含：

- trigger signals
- preconditions
- strategy steps
- constraints
- validation commands
- avoid patterns
- evidence

### 7.5 Arena

Arena 是评估环境。

每个 Arena 定义：

- 任务描述。
- required loci。
- 选择压力。
- 评分上下文。

### 7.6 Fitness Delta

Fitness Delta 是判断进化成功的核心指标：

```text
Fitness Delta = Child Score - Parent Baseline
```

## 8. 当前用户流程

### 8.1 主流程

```text
Select Arena
    ↓
Select Parent A
    ↓
Select Parent B
    ↓
Evaluate Parent A
    ↓
Evaluate Parent B
    ↓
Calculate Parent Baseline
    ↓
Calculate Compatibility
    ↓
Breed / Fuse
    ↓
Genome Fusion
    ↓
Gene Recombination
    ↓
Mutation
    ↓
Generate Child Genome
    ↓
Evaluate Child in Same Arena
    ↓
Show Evolution Delta
```

### 8.2 Demo 默认路径

默认：

- Arena：`Build Arena`
- Parent A：`Atlas`
- Parent B：`Muse`
- Child：`Astra`

默认验证结果：

```json
{
  "arena": "build_arena",
  "parentA": 79,
  "parentB": 68,
  "child": 80,
  "delta_vs_average": 6,
  "status": "Improved"
}
```

## 9. 功能需求

### 9.1 Arena Selector

用户故事：

> 作为用户，我希望先选择评估场景，因为不同 Arena 会影响哪些 Locus 更重要。

当前 Arena：

- Research Arena。
- Build Arena。
- Safety Arena。
- Balanced Arena。

验收标准：

- 页面展示 4 个 Arena。
- 用户可点击切换 Arena。
- 切换 Arena 后，Parent Baseline 重新计算。
- 切换 Arena 后，已生成 Child 清空，避免旧结果误导。

### 9.2 Parent Agent Selection

用户故事：

> 作为用户，我希望从多个 Parent Agent 中选择两个用于繁育。

当前 Parent Agent：

- Atlas。
- Muse。
- Nomad。
- Lumen。

验收标准：

- 页面展示每个 Agent 的身份、traits、radar、skills、strategy gene、chromosome strip、memory。
- 用户点击候选 Agent 后替换 Parent B。
- Parent A / Parent B 标识清晰。

### 9.3 Compatibility Panel

用户故事：

> 作为用户，我希望知道两个 Parent 是否适合融合。

展示指标：

- Personality。
- Skill Mix。
- Knowledge。
- Mutation。
- Match Score。
- Explanation。

验收标准：

- 选择父代后实时更新。
- 指标条清晰展示。
- 总分可用于路演解释。

### 9.4 Parent Baseline Evaluation

用户故事：

> 作为用户，我希望看到 Parent 在当前 Arena 下的分数，从而有可比较的基线。

展示内容：

- Parent A Score。
- Parent B Score。
- Average Baseline。
- Best Parent。

验收标准：

- Arena 或 Parent 改变后重新计算。
- Baseline 公式清晰。

### 9.5 Fusion Chamber

用户故事：

> 作为用户，我希望看到两个 Agent Genome 进入融合过程，并理解发生了什么继承、重组和突变。

展示内容：

- DNA / Gene 动画。
- Fusion State。
- Event Log。
- Arena pressure。
- Inheritance Log。
- Gene Fusion Log。
- Mutation Log。

验收标准：

- 点击 Breed 后有动态反馈。
- 约 1.4 秒后生成 Child。
- Log 能解释生成过程。

### 9.6 Child Report

用户故事：

> 作为用户，我希望看到 Child Agent 的结构化 Genome 和本次突变结果。

展示内容：

- Child name。
- Child archetype。
- Soul。
- Skills。
- Memory。
- Wiki。
- Gene。
- Child Fitness。
- Fitness Metrics。
- Gene Report。
- Fitness Tests。
- Mutation Notice。

验收标准：

- Child 生成后自动渲染。
- 能看出子代不是随机生成。
- 能看出 inherited gene 和 mutation。

### 9.7 Arena Evaluation

用户故事：

> 作为用户，我希望看到 Child 是否在同一 Arena 下超过父代基线。

展示内容：

- Parent Baseline。
- Child Fitness。
- Evolution Delta。
- Status。
- Parent A / Parent B / Child 输出对比。

验收标准：

- Child 生成后显示 Delta。
- Delta 状态使用 `Regression / Neutral / Improved / Breakthrough`。
- 默认 Demo 应得到 `Improved`。

## 10. 评分规则

### 10.1 Fitness Metrics

```text
Overall Fitness =
0.40 * Task Success
+ 0.25 * Safety
+ 0.20 * Novelty
+ 0.15 * Stability
```

指标定义：

| 指标 | 含义 |
|---|---|
| Task Success | 当前 Arena required loci 的覆盖程度 |
| Safety | 安全染色体与工具风险策略 |
| Novelty | 是否产生有价值的新组合、突变或 hybrid gene |
| Stability | required loci 是否完整、mutation 是否过度 |

### 10.2 Baseline

```text
Parent Baseline = (Parent A Score + Parent B Score) / 2
Best Parent Score = max(Parent A Score, Parent B Score)
```

### 10.3 Evolution Status

| Delta | 状态 |
|---|---|
| <= -5 | Regression |
| -5 ~ 3 | Neutral |
| 3 ~ 10 | Improved |
| >= 10 | Breakthrough |

## 11. 数据需求

### 11.1 Arena

必须字段：

- `id`
- `name`
- `subtitle`
- `task`
- `requiredLoci`

### 11.2 Agent

必须字段：

- `id`
- `name`
- `archetype`
- `rarity`
- `avatar`
- `soul`
- `skills`
- `memory`
- `knowledge`
- `radar`
- `style`
- `genes`

### 11.3 Gene

必须字段：

- `type`
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

## 12. 非功能需求

### 12.1 稳定性

- 必须本地可运行。
- 不依赖外网。
- 不依赖外部模型 API。
- 不需要构建链路。

### 12.2 可解释性

- 每个分数都应能解释来源。
- 每次 fusion 都应有日志。
- 每个 Child 都应有 Gene Report。

### 12.3 可演示性

- 默认路径必须稳定。
- 页面应在桌面与移动端可阅读。
- 关键结果必须一眼可见：Baseline、Child Score、Delta。

### 12.4 可扩展性

- 未来可接入真实 Evolver Gene。
- 未来可接入 OpenClaw Runtime。
- 未来可导出 Child Genome。

## 13. 当前实现状态

已实现：

- Arena Selector。
- Parent Selection。
- Compatibility Score。
- Parent Baseline。
- Genome Fusion。
- Strategy Gene Fusion。
- Mutation。
- Child Report。
- Child Fitness。
- Evolution Delta。
- Arena Comparison。
- PRD 版本指针。
- 开发日志与项目记忆 Skill。

未实现：

- 真实 Evolver asset 导入。
- 真实 OpenClaw runtime。
- 多 Child Candidate。
- Export Child Genome JSON。
- Mutation Intensity Slider。
- Dependency Graph。
- 真实 benchmark 执行。
- Agent lineage graph。

## 14. 成功标准

### 14.1 产品成功标准

用户 1 分钟内能理解：

- 两个 Agent 可以融合生成 Child。
- Child 不是随机生成。
- Child 必须在同一 Arena 中被评估。
- Evolution Delta 决定进化是否成功。

### 14.2 Demo 成功标准

现场能完整展示：

1. 选择 Arena。
2. 选择 Parent。
3. 看到 Parent Baseline。
4. 点击 Breed。
5. 看到 Fusion 和 Mutation。
6. 看到 Child Genome。
7. 看到 Child Fitness。
8. 看到 Evolution Delta。

### 14.3 技术成功标准

当前 MVP 至少支持：

- 4 个 Parent Agent。
- 4 个 Arena。
- 5 条 Chromosome。
- 19 个 Locus。
- 4 个 Fitness Metrics。
- 3 类基础 Mutation。
- Strategy Gene Recombination。

## 15. 路演表达

中文 Pitch：

> EvoMate 是一个 Agent Genome Lab。我们把 Agent 的能力拆成认知、工具、记忆、性格、安全和策略基因。两个 Parent Agent 可以通过 Genome Fusion 和 Mutation 生成 Child Agent。Child 生成后不会直接上线，而是在同一个 Arena 中和亲本进行自比较评估。只有当 Child 的 Fitness Delta 超过 Parent Baseline，我们才认为这次进化成功。

英文 Pitch：

> EvoMate is an Agent Genome Lab. It represents agents as structured genomes, lets two parent agents reproduce through genome fusion and mutation, then evaluates the child in the same arena against its parent baseline. Evolution is only considered successful when the child achieves a positive fitness delta.

## 16. 后续 Roadmap

### P0：当前 Demo 补强

- 增加 Export Child Genome JSON。
- 抽出正式 JSON schema。
- 让 Arena required loci 影响 fusion inheritance probability。
- 增强 Mutation Timeline。

### P1：真实资产接入

- 接入 Evolver Gene / Capsule。
- 支持 Gene Compression Mock Flow。
- 支持多 Child Candidate。
- 支持 Dependency Graph。

### P2：真实进化平台

- 接入 OpenClaw Runtime。
- 接入真实 benchmark。
- 支持 lineage graph。
- 支持长期种群筛选。
- 支持去中心化 Agent breeding protocol。

## 17. 风险与边界

- 当前 Fitness 是规则评分，不是真实任务执行结果。
- 当前 Gene 是 mock 数据，不是真实 Evolver 输出。
- 当前 Child 不能直接部署成真实 Agent。
- 当前安全策略只是结构化表达，不是 runtime enforcement。
- 当前 Demo 仍然是单机静态页面，不是多人系统。

## 18. 当前版本结论

EvoMate v0.2 已经具备一个清晰、可演示、可解释的 Agent Evolution MVP：

```text
Parent Genome + Arena Pressure
→ Fusion + Mutation
→ Child Genome
→ Same-Arena Evaluation
→ Fitness Delta
```

它已经从“Agent 配对展示”升级为“Agent 进化评估系统”的雏形。
