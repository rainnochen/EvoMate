# EvoMate 后续开发 PRD

## 1. 文档目标

本文档用于指导 EvoMate 在 hackathon MVP 之后的下一阶段开发。

目标是将当前的静态演示沙盒升级为一个能够接入 Evolver 真实资产、支持多代 Agent 繁育、可评估子代能力的 Agent Evolution Lab。

## 2. 下一阶段产品目标

### 2.1 从 Demo 到 Lab

当前 EvoMate 是一个可演示的概念 Demo。

下一阶段要变成一个可操作的实验室：

- 可以导入真实 Agent 资产。
- 可以配置繁育规则。
- 可以保存子代。
- 可以追踪家谱。
- 可以运行 Arena 评估。

### 2.2 从 Mock Genome 到 Real Genome

当前 genome 来自 `data/mock/agents.json`。

下一阶段要支持：

- 从 `evolver-main/assets/gep/genes.json` 导入 Skills / Strategy。
- 从 `evolver-main/assets/gep/capsules.json` 导入 Wiki / Knowledge。
- 从 `evolver-main/assets/gep/events.jsonl` 导入 Memory。
- 从 personality state 导入 Soul。

### 2.3 从模板 Arena 到真实 Evaluation

当前 Arena 输出是模板。

下一阶段要支持：

- 调用真实 Agent。
- 使用任务 rubrics。
- 对父代和子代进行评分。
- 输出可解释比较报告。

## 3. 用户故事

### User Story 1：导入真实父代 Agent

作为 Agent 开发者，我希望能从 Evolver 本地资产中导入两个 Agent 的 genome，以便进行真实繁育实验。

验收标准：

- 可以读取本地 GEP assets。
- 可以生成 Soul、Skills、Memory、Wiki 四层 genome。
- 页面能展示导入后的 Agent Profile。

### User Story 2：配置繁育策略

作为研究型开发者，我希望能选择繁育策略，以便比较不同策略对子代能力的影响。

验收标准：

- 支持 balanced。
- 支持 innovation-first。
- 支持 safety-first。
- 支持 skill-complementarity-first。

### User Story 3：保存子代 Agent

作为用户，我希望保存生成的 Child Agent，以便后续继续评估或作为新一代父代。

验收标准：

- Child genome 可以被保存为 JSON。
- 保存结果包含 parent ids、inheritance log、mutation log、timestamp。
- 子代可以再次出现在候选父代列表中。

### User Story 4：查看家谱

作为评委或用户，我希望看到 Agent 的跨代关系，以便理解能力如何继承和变化。

验收标准：

- 展示 parent -> child 关系。
- 展示 mutation 标记。
- 支持至少两代 lineage。

### User Story 5：运行 Arena 评估

作为 Agent 平台开发者，我希望看到子代是否真的比父代更适合任务。

验收标准：

- Arena 支持至少 3 个任务。
- 每个任务有评分 rubric。
- 输出父代和子代得分。
- 输出解释性评估报告。

## 4. 功能需求

### 4.1 Genome Importer

优先级：P0

功能：

- 导入 Evolver GEP assets。
- 将 assets 转换为 EvoMate genome。
- 支持 mock / real 两种数据源切换。

建议路径：

```text
src/integrations/evolver/asset-to-genome.js
```

### 4.2 Genome Schema

优先级：P0

功能：

- 定义统一 genome 数据结构。
- 提供 validate / normalize 方法。
- 降低 UI 与 Evolver 资产格式之间的耦合。

建议路径：

```text
src/genome-schema/
```

### 4.3 Breeding Strategy Panel

优先级：P1

功能：

- 用户可以选择繁育策略。
- UI 展示策略对兼容性和 mutation 的影响。

策略：

- Balanced
- Innovation First
- Safety First
- Skill Complementarity First

### 4.4 Family Tree

优先级：P1

功能：

- 展示父代和子代关系。
- 支持多代继承。
- 标记 mutation 节点。

### 4.5 Arena Evaluation

优先级：P1

功能：

- 支持多任务。
- 支持评分标准。
- 支持结果比较。
- 支持导出报告。

### 4.6 Child Genome Export

优先级：P1

功能：

- 将 Child genome 导出为 JSON。
- 后续可转换为 GEP asset。
- 支持复制和下载。

## 5. 技术需求

### 5.1 保持 Demo 稳定

即使真实 Evolver 集成失败，也必须能回退到 mock 数据。

### 5.2 建立 Adapter 边界

EvoMate 不应直接依赖 `evolver-main` 的内部实现细节。

建议通过 adapter 暴露：

- readAssets
- assetToGenome
- genomeToAsset
- runArenaEval

### 5.3 支持本地优先

Hackathon 和早期产品都应优先支持本地运行。

需要避免：

- 必须登录。
- 必须联网。
- 必须配置复杂环境变量。

## 6. 数据结构草案

```json
{
  "id": "agent-id",
  "name": "Agent Name",
  "archetype": "Hybrid Evolution Agent",
  "soul": [
    { "trait": "rational", "weight": 92, "source": "parent-a" }
  ],
  "skills": [
    { "name": "planning", "source": "parent-a", "confidence": 0.9 }
  ],
  "memory": [
    { "summary": "Recovered a failing pipeline.", "source": "event-id" }
  ],
  "knowledge": [
    { "title": "GEP protocols", "source": "capsule-id" }
  ],
  "lineage": {
    "parents": ["parent-a", "parent-b"],
    "generation": 1
  },
  "mutation": [
    {
      "type": "Skill Mutation",
      "description": "New bridge-building skill emerged."
    }
  ]
}
```

## 7. 里程碑

### Milestone 1：真实资产读取

目标：

- 可以从 `evolver-main/assets/gep` 读取 genes、capsules、events。
- 可以映射成 EvoMate genome。

### Milestone 2：子代持久化

目标：

- Child genome 可以保存。
- 子代可以作为下一轮父代。

### Milestone 3：Arena 评估

目标：

- Arena 输出从模板升级为评分评估。
- 支持导出对比报告。

### Milestone 4：家谱与多代演化

目标：

- 展示 lineage。
- 支持多轮 breeding。
- 展示 mutation 历史。

## 8. 风险与缓解

风险：真实 Evolver 资产格式复杂。

缓解：

- 先做 adapter，不直接改 UI。
- 先支持只读导入。

风险：Arena 评估不稳定。

缓解：

- 保留模板 fallback。
- 将评估逻辑与展示层解耦。

风险：概念过于抽象。

缓解：

- 强化可视化。
- 用 Arena 结果证明子代差异。
- 路演时用 Atlas + Muse + Astra 的故事讲清楚。

## 9. 成功指标

短期：

- Demo 可稳定运行。
- 评委能在 30 秒内理解。
- 2 分钟内完成一次 breeding。

中期：

- 能导入真实 Evolver assets。
- 能保存 child genome。
- 能运行至少 3 个 Arena 任务。

长期：

- 支持多代 Agent evolution。
- 支持 A2A 跨节点繁育。
- 支持 child genome 发布为 GEP asset。
