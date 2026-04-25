# EvoMate 与 evolver-main 主项目对比及优化建议

## 1. 两个项目的关系

`evolver-main` 是底层进化引擎。

它关注：

- GEP 协议。
- 进化资产。
- 记忆沉淀。
- 突变策略。
- A2A 通信。
- 代理运行时集成。
- 验证、审查和 solidify。

`evolver-hackathon / EvoMate` 是面向用户和评委的实验室前台。

它关注：

- 可视化。
- 父代选择。
- 数字 DNA 展示。
- 繁育体验。
- 子代报告。
- Arena 表达。

最佳组合方式：

让 `evolver-main` 负责真实进化能力，让 EvoMate 负责把进化过程产品化、可视化、游戏化。

## 2. evolver-main 中可复用的能力

### 2.1 GEP assets

相关路径：

- `assets/gep/genes.json`
- `assets/gep/capsules.json`
- `assets/gep/events.jsonl`
- `src/gep/assets.js`
- `src/gep/assetStore.js`

可用于 EvoMate：

- 将 Gene 映射为 Skills 或 Strategy DNA。
- 将 Capsule 映射为 Knowledge / Wiki DNA。
- 将 EvolutionEvent 映射为 Memory DNA。

### 2.2 Personality

相关路径：

- `src/gep/personality.js`

可用于 EvoMate：

- 将 Evolver 的 personality state 转换为 Soul 层。
- 支持 personality mutation。
- 支持基于历史表现的性格权重调整。

注意：

- 当前部分文件是混淆后的源码，可读性和二次开发成本较高。
- 如果要深度复用，建议抽出稳定 JSON schema 或增加可读 wrapper。

### 2.3 Mutation

相关路径：

- `src/gep/mutation.js`

可用于 EvoMate：

- 替换当前规则制 mutation。
- 支持 mutation category、risk level、target、expected effect。
- 支持把突变解释成可视化事件。

### 2.4 Memory Graph / Narrative Memory

相关路径：

- `src/gep/memoryGraph.js`
- `src/gep/memoryGraphAdapter.js`
- `src/gep/narrativeMemory.js`
- `src/gep/learningSignals.js`

可用于 EvoMate：

- 将父代历史经验转化为 Memory fragments。
- 将成功和失败经验作为可遗传记忆。
- 为 Child Report 提供更可信的记忆来源。

### 2.5 Candidate Evaluation

相关路径：

- `src/gep/candidateEval.js`
- `src/gep/candidates.js`
- `src/gep/validator/`
- `src/gep/validationReport.js`

可用于 EvoMate：

- 将 Arena 从模板展示升级为真实评估。
- 对 Child Agent 和 Parent Agent 做 task score 对比。
- 为“子代是否更优”提供证据。

### 2.6 A2A / Proxy / Mailbox

相关路径：

- `src/gep/a2a.js`
- `src/gep/a2aProtocol.js`
- `src/gep/mailboxTransport.js`
- `src/proxy/`

可用于 EvoMate：

- 支持父代 Agent 通过 A2A 交换基因资产。
- 支持 Child genome 发布到 EvoMap。
- 支持多 Agent 跨节点繁育。

### 2.7 Skill Distillation / Skill Publisher

相关路径：

- `src/gep/skillDistiller.js`
- `src/gep/skillPublisher.js`
- `src/gep/skill2gep.js`

可用于 EvoMate：

- 将现有 skill 转换为可遗传 genome 片段。
- 将 Child 的新能力发布为 Evolver 可复用资产。

## 3. evolver-main 可优化和迭代的方向

### 3.1 提供稳定的 Genome Schema

当前 Evolver 已经有 Gene、Capsule、Event 等概念，但对 EvoMate 这类上层产品而言，还缺一个更适合可视化和繁育的统一 genome schema。

建议新增：

```text
src/gep/genomeSchema.js
```

字段建议：

- soul
- skills
- memory
- knowledge
- strategy
- risk
- provenance
- fitness

### 3.2 增加 Asset -> Genome Adapter

建议新增：

```text
src/gep/genomeAdapter.js
```

用途：

- Gene -> Skill / Strategy DNA
- Capsule -> Knowledge DNA
- EvolutionEvent -> Memory DNA
- PersonalityState -> Soul DNA

这样 EvoMate 不需要直接理解 Evolver 内部资产格式。

### 3.3 增加 Breeding / Crossover 模块

建议新增：

```text
src/gep/breeding.js
```

用途：

- 双亲选择。
- trait inheritance。
- skill crossover。
- memory compression transfer。
- mutation injection。
- child genome generation。

这会让 EvoMate 的核心概念回流到 Evolver 主项目，成为真正的 Agent 跨代演化能力。

### 3.4 增加 Visual Trace Export

当前 Evolver 更偏 CLI 和协议输出，对可视化产品不够友好。

建议新增：

```text
src/gep/visualTrace.js
```

输出格式：

- step
- label
- source parent
- target child
- asset id
- confidence
- animation hint

用途：

- Fusion Chamber 可直接消费。
- Demo 和调试都更直观。

### 3.5 增加 Arena Evaluation API

建议把候选评估能力包装成更稳定的 API：

```text
src/gep/arenaEval.js
```

输入：

- parent agents
- child agent
- task
- eval rubric

输出：

- scores
- comparison
- evidence
- recommendation

### 3.6 降低部分核心模块的二次开发成本

观察到 `personality.js`、`mutation.js`、`candidateEval.js` 等文件存在混淆形态。

这对 npm 发布或源码保护是合理的，但对 hackathon 期间二次开发不友好。

建议：

- 保留混淆产物用于发布。
- 在开发分支保留可读源码。
- 为外部产品提供稳定 adapter API。
- 避免上层产品直接依赖混淆模块内部细节。

### 3.7 增加 Web Playground

Evolver 当前是强 CLI / runtime 工具，但可视化体验不足。

EvoMate 可以演化为：

```text
Evolver Web Playground
```

功能：

- 查看 Gene / Capsule。
- 查看记忆图谱。
- 查看突变历史。
- 模拟 breeding。
- 运行 Arena eval。

## 4. 对 EvoMate 的集成建议

短期：

- 保持 EvoMate 独立静态 Demo。
- 用 mock data 保证现场演示稳定。
- 文案中说明它未来接入 Evolver 真实资产。

中期：

- 写 `src/integrations/evolver/asset-to-genome.js`。
- 从 `evolver-main/assets/gep` 读取 assets。
- 将 genes / capsules 显示成父代 genome。

长期：

- 将 EvoMate 变成 Evolver 的可视化前台。
- 支持真实 Agent breeding。
- 支持 Child genome 反向发布为 GEP asset。
- 支持多代 lineage 和 selection。

## 5. 推荐迭代优先级

P0：

- Genome Schema。
- Asset -> Genome Adapter。
- Visual Trace Export。

P1：

- Breeding / Crossover 模块。
- Arena Evaluation API。
- Child Genome Export。

P2：

- Web Playground。
- A2A 跨节点繁育。
- 多代家谱和排行榜。
