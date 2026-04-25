> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 当前完整项目说明书

版本：2026-04-25

## 1. 项目概览

EvoMate 是一个 Agent Genome Lab，用于演示两个 Parent Agent 如何通过 Genome Fusion、Gene Recombination、Mutation 和 Arena Evaluation 生成 Child Agent，并通过 Fitness Delta 判断子代是否完成进化。

当前项目是 Hackathon MVP，优先级是：

- 能稳定本地运行。
- 能完整讲清楚产品闭环。
- 能展示 Agent 遗传、变异、评估的未来感。
- 能为后续接入 Evolver / OpenClaw / 真实 Agent Runtime 留出架构接口。

一句话：

> EvoMate makes agents reproduce, mutate, and prove they evolved.

## 2. 当前产品闭环

当前 Demo 主链路：

```text
Select Arena
→ Select Parent A / Parent B
→ Evaluate Parent A
→ Evaluate Parent B
→ Calculate Parent Baseline
→ Compatibility Scoring
→ Genome Fusion
→ Strategy Gene Recombination
→ Mutation
→ Generate 3 Child Candidates
→ Evaluate Child Candidates in Same Arena
→ Select Best Child
→ Compare Child vs Parent Baseline
→ Export Child Genome JSON
→ Show Evolution Delta
```

核心判断：

```text
进化成功 = Child Fitness Score - Parent Baseline > 0
```

当前状态规则：

- `Regression`：Delta <= -5
- `Neutral`：-5 < Delta < 3
- `Improved`：3 <= Delta < 10
- `Breakthrough`：Delta >= 10

## 3. 技术栈与运行方式

当前是零依赖静态 Web App：

- HTML
- CSS
- 原生 JavaScript ES Modules
- Node.js 本地静态服务器
- Mock JSON 数据
- 无构建工具
- 无外部 API 依赖

启动：

```bash
npm run dev
```

访问：

```text
http://127.0.0.1:3030
```

检查：

```bash
npm run check
```

## 4. 目录结构

```text
evolver-hackathon/
├── apps/web/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── data/mock/
│   └── agents.json
├── src/
│   ├── core/
│   │   ├── compatibility-engine.js
│   │   ├── fusion-engine.js
│   │   ├── gene-fusion-engine.js
│   │   ├── evaluation-engine.js
│   │   └── arena-engine.js
│   └── integrations/
│       └── evolver/
│           └── asset-to-genome.js
├── docs-zh/
├── docs/
├── lightning-pitch/
├── 开发日志/
├── scripts/
│   └── dev-server.js
├── module-manifest.json
└── package.json
```

## 5. 架构分层

### 5.1 Web App 展示层

路径：

```text
apps/web/
```

职责：

- 页面结构。
- Arena Selector。
- Parent Agent Card。
- Compatibility Panel。
- Parent Baseline Panel。
- Fusion Chamber。
- Child Report。
- Fitness Dashboard。
- Evolution Delta Card。
- Arena Comparison。

关键文件：

- `apps/web/index.html`：页面骨架与 DOM 插槽。
- `apps/web/styles.css`：视觉系统、布局、动画、响应式。
- `apps/web/app.js`：前端状态管理、数据加载、核心引擎调用、渲染编排。

### 5.2 Mock Data 数据层

路径：

```text
data/mock/agents.json
```

职责：

- 定义 Arena。
- 定义 Parent Agents。
- 存放 Soul / Skills / Memory / Knowledge / Radar / Strategy Genes。
- 为零依赖 Demo 提供可控数据源。

当前包含：

- 4 个 Arena。
- 4 个 Parent Agent。
- 每个 Agent 具备 1 个 Strategy Gene。

### 5.3 Core Logic 核心逻辑层

路径：

```text
src/core/
```

职责：

- 兼容性评分。
- Genome Fusion。
- Strategy Gene Fusion。
- Arena Evaluation。
- Parent / Child 对比输出。

新增核心前置模块：

```text
src/core/genome-engine.js
```

职责：

- 将 raw agent data 构造成正式 `AgentGenome`。
- 输出 `Chromosome / Locus` 持久结构。
- 为 Evaluation Engine 和 Fusion Engine 提供统一协议输入。

核心模块：

| 模块 | 文件 | 职责 |
|---|---|---|
| Genome Engine | `genome-engine.js` | 构建正式 AgentGenome / Chromosome / Locus，并提供 locus strength |
| Compatibility Engine | `compatibility-engine.js` | 计算父代 personality、skill、knowledge、mutation 匹配度 |
| Fusion Engine | `fusion-engine.js` | 合并 Soul、Skills、Memory、Knowledge、Radar，并注入 Mutation |
| Gene Fusion Engine | `gene-fusion-engine.js` | 继承、重组、压缩 Strategy Gene，并生成 Gene Report |
| Evaluation Engine | `evaluation-engine.js` | 构建 Chromosome/Locus，评估 Fitness，计算 Evolution Delta |
| Evolution Service | `evolution-service.js` | 编排 Evolution Run，生成候选子代，选择最佳子代，生成 Export Payload |
| Arena Engine | `arena-engine.js` | 生成 Parent/Child 在 Arena 中的对比表达文案 |

### 5.4 Integration 未来集成层

路径：

```text
src/integrations/
```

当前已实现：

- `src/integrations/evolver/asset-to-genome.js`

职责：

- 将 Evolver Gene / Capsule asset 适配为 EvoMate 的 Agent Genome Gene 数据。

未来规划：

- 接入 `evolver-main/assets/gep/genes.json`。
- 接入 OpenClaw runtime。
- 将 Child Genome 导出为真实 Agent Runtime 配置。
- 执行真实 benchmark / sandbox evaluation。

### 5.5 文档与项目记忆层

路径：

```text
docs-zh/
开发日志/
开发日志/skills/evomate-context-keeper/
```

职责：

- 维护主 PRD。
- 维护项目说明书。
- 记录每次开发迭代。
- 维护历史上下文与项目记忆。
- 支持新队友快速 onboarding。

## 6. 当前数据模型

### 6.1 Arena

```json
{
  "id": "build_arena",
  "name": "Build Arena",
  "subtitle": "从想法到 prototype 的执行能力",
  "task": "Turn an Agent evolution idea into a reliable hackathon MVP plan and testable prototype.",
  "requiredLoci": [
    "cognitive.planning_depth",
    "tool.tool_registry",
    "tool.tool_routing_policy",
    "personality.persistence",
    "safety.review_policy"
  ]
}
```

### 6.2 Agent Genome

当前 `AgentGenome` 是 MVP 结构：

```json
{
  "id": "atlas",
  "name": "Atlas",
  "archetype": "Systems Cartographer",
  "rarity": "Foundational",
  "avatar": "AT",
  "soul": [],
  "skills": [],
  "memory": [],
  "knowledge": [],
  "radar": {},
  "style": "precise, structured, evidence-first",
  "genes": []
}
```

当前 P0 升级后，Child Agent 会带有正式 `child.genome`，结构由：

```text
schemas/agent-genome.schema.json
```

约束。

### 6.3 Strategy Gene

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

### 6.4 Chromosome / Locus

当前由 `evaluation-engine.js` 根据 Agent 数据动态推导。

五条染色体：

- `cognitive`
- `tool`
- `memory`
- `personality`
- `safety`

典型 Locus：

- `cognitive.reasoning_strategy`
- `tool.tool_routing_policy`
- `memory.memory_compression`
- `personality.creativity`
- `safety.review_policy`

## 7. 核心算法说明

### 7.1 Compatibility Scoring

输入：

- Parent A
- Parent B

输出：

- `personality`
- `skill`
- `knowledge`
- `mutation`
- `total`
- `explanation`

用途：

- 展示两个父代是否适合融合。
- 为 Gene Fusion 的 mutation 判断提供上下文。

### 7.2 Genome Fusion

输入：

- Parent A
- Parent B
- Compatibility Result
- Arena

输出：

- Child Agent
- Inheritance Log
- Fusion Log
- Mutation Log

当前融合规则：

- 先用 `buildAgentGenome()` 构建 Parent A / Parent B 的正式染色体结构。
- 按 chromosome 和 locus 遍历 inheritance。
- 对每个 locus 计算 arena-aware weight。
- Safety chromosome 默认更严格一方优先。
- 再从 child genome 派生 Soul / Skills / Memory / Knowledge / Radar。
- Gene 层委托给 Gene Fusion Engine。

当前 inheritance reason 会写入：

- `fusionPlan.inheritance_plan`
- `inheritanceLog`
- `fusionLog`

### 7.3 Gene Fusion

输入：

- Parent A genes
- Parent B genes
- Compatibility Result

输出：

- Child Strategy Gene
- Gene Report
- Fitness Tests
- Gene Fusion Log

当前规则：

- 选择父母 strongest Gene。
- 合并 `signals_match`。
- 合并 `strategy`。
- 合并 `constraints`。
- 合并并过滤 `validation`。
- 合并 `avoid`。
- 根据 mutation 分数标记 `Stable Gene Recombination` 或 `Strategy Mutation`。

安全约束：

- 只允许 `node`、`npm`、`npx` 开头的 validation。
- 拦截 `node -e`、`node --eval`、`node -p`、`rm -rf` 等危险命令。

### 7.4 Arena Evaluation

输入：

- Agent Genome
- Arena

输出：

- Overall Fitness
- Task Success
- Safety
- Novelty
- Stability
- Highlighted Loci

评分公式：

```text
Overall Fitness =
0.40 * Task Success
+ 0.25 * Safety
+ 0.20 * Novelty
+ 0.15 * Stability
```

Evolution Delta：

```text
Parent Baseline = (Parent A Score + Parent B Score) / 2
Evolution Delta = Child Score - Parent Baseline
```

## 8. 前端状态流

当前 `apps/web/app.js` 管理一个轻量 state：

```js
const state = {
  agents: [],
  arenas: [],
  selectedArenaId: 'build_arena',
  selectedIds: ['atlas', 'muse'],
  compatibility: null,
  parentEvaluation: null,
  evolutionComparison: null,
  fusionResult: null,
  arenaTask: ''
};
```

主要渲染函数：

- `renderArenaSelector()`
- `renderAgents()`
- `renderCompatibility()`
- `renderParentEvaluation()`
- `renderFusionIdle()`
- `renderFusionResult()`
- `renderChildReport()`
- `renderArena()`
- `renderAll()`

主要交互：

- 选择 Arena。
- 选择 Parent Agent。
- 点击 Breed。
- 等待 Fusion 动画。
- 展示 Child 和 Delta。

## 9. 当前 Demo 验收路径

1. 启动 `npm run dev`。
2. 打开 `http://127.0.0.1:3030`。
3. 选择 `Build Arena`。
4. 默认选择 Atlas + Muse。
5. 查看 Parent Baseline。
6. 点击 `Breed Selected Agents`。
7. 查看 Fusion Chamber。
8. 查看 Child Report。
9. 查看 3 个 Child Candidates 和自动选择结果。
10. 查看 Arena Evaluation。
11. 确认 Evolution Delta 显示为正向结果。
12. 复制 Export Child Genome JSON。

默认语义验证结果：

```json
{
  "arena": "build_arena",
  "parentA": 79,
  "parentB": 68,
  "selected": "Astra-Build-03",
  "selected_score": 85,
  "result": {
    "delta_vs_average": 11,
    "delta_vs_best_parent": 6,
    "status": "Breakthrough"
  }
}
```

## 10. 分布式开发模块

当前 `module-manifest.json` 定义了分布式开发模块：

| 模块 | 名称 | 主要路径 |
|---|---|---|
| A | Product Narrative and Pitch | `docs-zh/`、`lightning-pitch/`、`README.md`、`开发日志/` |
| B | Frontend Experience and Motion | `apps/web/index.html`、`apps/web/styles.css` |
| C | Frontend Orchestration | `apps/web/app.js` |
| D | Genome Core Logic | `src/core/` |
| E | Genome Data and Content | `data/mock/agents.json`、`module-manifest.json` |
| F | OpenClaw and Evolver Adapter | `src/integrations/`、相关 PRD |
| G | QA, Release, and Integration | `scripts/`、`package.json`、`README.md`、`开发日志/` |

## 11. 已知边界

- 当前评估是规则算法，不是真实 benchmark。
- 当前已抽出 `AgentGenome / Chromosome / Locus` schema，但 `Arena / EvaluationResult / EvolutionRun` schema 还未抽出。
- Fusion 已按 chromosome / locus 选择继承，但 Arena weight 仍是轻量版本，不是完整概率抽样。
- Child Genome 还不能导出为可运行 Agent。
- Evolver Adapter 还没有接真实 `evolver-main` 数据流。
- OpenClaw 仍停留在 PRD / integration 设计层。

## 12. 下一步开发建议

P0：

- 稳定 `AgentGenome`、`Arena`、`EvaluationResult` JSON schema。
- 继续强化 `Export Child Genome JSON`，增加下载文件能力。
- 让 Fusion Engine 根据 Arena required loci 调整继承概率。
- 增强 Mutation Timeline 可视化。

P1：

- 支持多 Child Candidate。
- 支持 Mutation Intensity Slider。
- 支持真实 Evolver Gene asset 导入。
- 增加 Dependency Graph。

P2：

- 接入 OpenClaw runtime。
- 接入真实 benchmark。
- 支持多代谱系和种群筛选。
- 支持去中心化 Agent breeding protocol。
