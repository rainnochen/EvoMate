> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate Demo Script v0.3

日期：2026-04-25 20:34:20

## 1. 一句话开场

EvoMate 是一个 Agent 进化协议。它会在特定任务 Arena 中评估父代 Agent，把它们的能力压缩成可遗传基因，再通过融合与变异生成子代 Agent，并用 Evolution Delta 验证子代是否真的进化成功。

更短版本：

> EvoMate breeds better agents for the task.

## 2. 30 秒版本

现有 Agent 通常是被手工 prompt 出来的，但未来的 Agent 应该可以被进化出来。

EvoMate 把 Agent 表示为 Genome，先在 Arena 中评估两个 Parent Agent，得到 Parent Baseline，然后压缩它们的能力、融合基因、注入变异，生成多个 Child Candidates。系统会在同一个 Arena 中重新评估这些子代，自动选择 Fitness Delta 最好的 Child，并导出 Child Genome JSON。

## 3. 2 分钟 Demo 路径

### Step 1：选择 Arena

口播：

> 我们不是随机混合 Agent，而是先选择一个任务环境。这里选择 Build Arena，目标是生成更适合 Hackathon Demo 构建的 Agent。

操作：

- 选择 `Build Arena`。

### Step 2：选择 Parent Agents

口播：

> Atlas 擅长结构化规划和工具执行，Muse 擅长产品叙事和创意表达。它们不是相似，而是互补。

操作：

- 保持默认 `Atlas × Muse`。

### Step 3：查看 Parent Baseline

口播：

> 进化必须有基线。系统会先评估两个 Parent，计算平均基线和最佳父代分数。

展示：

- Parent A Score。
- Parent B Score。
- Average Baseline。
- Best Parent。

### Step 4：点击 Breed

口播：

> 点击 Breed 后，系统会抽取 Genome，压缩 Strategy Gene，执行 Cross-over Fusion，并注入面向 Build Arena 的变异。

操作：

- 点击 `Breed Selected Agents`。

### Step 5：展示 Fusion Chamber

口播：

> 这里可以看到 Arena pressure、Gene fusion 和 mutation log。它不是简单拼接，而是带评估目标的进化过程。

### Step 6：展示 3 个 Child Candidates

口播：

> MVP 里我们先做最小进化循环：一次 Breed 内部生成 3 个子代候选，分别做 strengthening、bridging 和 risk-reducing mutation，然后只展示最优子代。

展示：

- Candidate A。
- Candidate B。
- Candidate C。
- Selected Child。

### Step 7：展示 Child Report

口播：

> Child Report 展示它继承了什么、发生了什么 mutation、Strategy Gene 如何变化，以及四个 fitness metrics。

展示：

- Soul。
- Skills。
- Memory。
- Wiki。
- Gene。
- Child Fitness。

### Step 8：展示 Evolution Delta

口播：

> 最后，我们在同一个 Arena 中评估 Child。如果 Child 超过 Parent Baseline，我们才认为进化成功。

展示：

- Parent Baseline。
- Child Fitness。
- Delta vs Average。
- Delta vs Best Parent。
- Status。

### Step 9：导出 Child Genome JSON

口播：

> 子代不是只能看，它可以被导出成结构化 Genome。未来这个 JSON 可以进入 OpenClaw、LangGraph、CrewAI 或其他 Agent Runtime。

操作：

- 展示 Export Child Genome JSON。

## 4. 最关键表达

不要说：

> 我们把两个 Agent 混合起来。

要说：

> 我们用 Arena 评估驱动 Agent 的遗传、变异和筛选。

不要说：

> Child 看起来更酷。

要说：

> Child 在同一 Arena 下超过了 Parent Baseline。

## 5. 结尾

> 今天它是一个 Hackathon MVP，明天它可以成为 Agent Evolution Infrastructure：让企业不再手工拼 Agent，而是基于目标任务持续繁育、评估、筛选和导出更好的 Agent。
