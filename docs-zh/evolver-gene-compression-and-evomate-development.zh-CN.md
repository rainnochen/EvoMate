> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# Evolver Gene 压缩规则与 EvoMate 开发方案

记录时间：2026-04-25 20:34:20

本文基于本地 `evolver-main` 的 GEP 相关代码与测试，整理 Gene 的具体压缩规则，并说明 EvoMate 如何基于这套机制继续开发。

## 1. 核心结论

在 Evolver 中，`Gene` 不是普通摘要，也不是完整 Skill 文档。

它更像一种“可执行策略基因”：

```text
多次执行经验 / Skill 文档 / Capsule 证据
        ↓ 压缩
一个可检索、可选择、可执行、可验证的 Gene
```

Gene 的压缩目标不是保留所有过程细节，而是保留对未来 Agent 最有用的控制信息：

- 什么时候触发。
- 需要满足什么前置条件。
- 应该怎么做。
- 不能碰什么。
- 怎么验证。
- 这个策略来自什么证据。

因此，Evolver 的 Gene 压缩可以理解为：

```text
经验压缩成策略接口，执行过程压缩成 Capsule 证据，长期演化压缩成 Gene 库。
```

## 2. Evolver 中的三类资产

### 2.1 Gene

Gene 是可复用的策略基因。

典型字段：

```json
{
  "type": "Gene",
  "id": "gene_gep_repair_from_errors",
  "category": "repair",
  "signals_match": ["error", "exception", "failed", "unstable"],
  "preconditions": ["signals contains error-related indicators"],
  "strategy": [
    "Extract structured signals from logs and user instructions",
    "Select an existing Gene by signals match",
    "Estimate blast radius before editing",
    "Apply smallest reversible patch",
    "Validate using declared validation steps"
  ],
  "constraints": {
    "max_files": 12,
    "forbidden_paths": [".git", "node_modules"]
  },
  "validation": ["node scripts/validate-suite.js"]
}
```

### 2.2 Capsule

Capsule 是某次 Gene / Skill 被真实执行后的经验证据。

它记录：

- 触发信号。
- 执行摘要。
- 执行结果。
- 置信度。
- blast radius。
- 环境指纹。
- validation trace。

Capsule 的意义是：

```text
Gene 是策略，Capsule 是这条策略真的跑过的证据。
```

### 2.3 EvolutionEvent

EvolutionEvent 是演化过程日志。

它记录系统在某一轮演化中的信号、结果、使用过的 Gene、父事件等，用来支持后续选择、学习和压缩。

## 3. Gene 的两条压缩路径

### 3.1 正向压缩：Capsule Stream -> Gene

这是 `skillDistiller.js` 的职责。

逻辑是：

```text
多条成功 Capsule
        ↓
发现高频模式、策略漂移、覆盖缺口
        ↓
合成一个新的 distilled Gene
```

触发条件：

- `SKILL_DISTILLER` 不能被设为 `false`。
- 成功 Capsule 数量必须达到阈值。
- 默认最小成功 Capsule 数为 `10`。
- 默认 distillation 间隔为 `24` 小时。
- 成功 Capsule 需要 `outcome.status = success`，且分数达到成功阈值。
- 如果数据 hash 没变化，会跳过，避免重复压缩。

分析规则：

- 高频模式：同一 Gene 下成功 Capsule 数量达到 `5` 以上。
- 策略漂移：同一 Gene 的 Capsule 摘要相似度低于约 `0.6`，说明同一个 Gene 可能已经被用出了不同策略。
- 覆盖缺口：EvolutionEvent 中反复出现但没有被现有 Gene 覆盖的信号，会成为新 Gene 候选。

输出结果：

- 新 Gene 的 id 通常以 `gene_distilled_` 开头。
- 新 Gene 被写回 `genes.json`。
- distiller state 会记录 `last_distillation_at`、`last_data_hash`、`distillation_count`。

### 3.2 反向压缩：Skill.md + Execution Trace -> Gene + Capsule

这是 `skill2gep.js` 的职责。

逻辑是：

```text
一个本地 Skill 文档
+ 一次真实执行记录
        ↓
抽取 signals / strategy / avoid / validation / preconditions
        ↓
生成 Gene
        ↓
如果执行证据足够，再生成 Capsule
```

抽取规则：

- 从 frontmatter 和 `when to use`、`trigger`、`scenario` 等段落抽取 `signals_match`。
- signal 必须是 3-40 字符、包含英文字母、去重、最多 8 个。
- 从 `workflow`、`strategy`、`steps`、`procedure`、`quick start`、`how to` 等段落抽取策略步骤。
- strategy 每条必须 5-300 字符，最多 10 条。
- 如果 strategy 少于 3 条，会补 3 条保守默认策略。
- 从 `avoid`、`pitfall`、`anti-pattern`、`do not`、`forbidden` 等段落抽取 `avoid`，最多 5 条。
- 从 `validation`、`test`、`verify`、`check` 等段落中的代码块抽取验证命令，最多 5 条。
- 从 `precondition`、`requirement`、`prerequisite` 抽取前置条件，最多 4 条。

验证命令规则：

- 只允许 `node`、`npm`、`npx` 开头的命令。
- `node -e`、`node --eval`、`node -p` 会被剔除。
- `rm -rf`、`echo $(whoami)` 等不安全命令会被剔除。
- 如果非 strict 模式下没有可用验证命令，会回退到 `node --version`。
- strict 模式下没有合法验证命令，则拒绝生成 Gene。

Gene 生成规则：

- `id` 使用 `gene_s2g_` 前缀，然后经过后续验证可能被规范化。
- `summary` 来自 Skill 描述或第一条 strategy，最多 200 字符。
- `category` 通过信号和描述推断：
  - 包含 error / fail / repair / rollback / bug / fix / guard -> `repair`
  - 包含 feature / add / implement / new capability / innovate -> `innovate`
  - 其他默认 -> `optimize`
- `constraints.max_files` 默认不超过 `DISTILLED_MAX_FILES`，当前为 `12`。
- `constraints.forbidden_paths` 必须包含 `.git` 和 `node_modules`。
- `_source.quality_heuristics` 会记录抽取质量，例如 strategy 数量、avoid 数量、validation 是否 fallback、signals 数量等。

Capsule 生成规则：

- Capsule 只能来自真实 execution trace。
- 如果 `status=success` 但 trace 为空，则拒绝。
- 如果 `status=success` 但 blast radius 为 0 文件且 0 行，则拒绝。
- 如果 trace 中没有 exit code，则拒绝。
- Gene.validation 中的每条命令都必须能在 execution trace 中找到。
- 如果 validation 覆盖不完整，就降级为 Gene-only，不生成 Capsule。
- score 会被限制在 `0..1`。
- 如果没有 score，成功默认 `0.8`，失败默认 `0.2`。
- execution trace 中的 `stdout_tail` 最多保留 300 字符。

## 4. Gene 的标准质量规则

Evolver 的 distillation prompt 对 Gene 有非常明确的质量要求。

### 4.1 ID

- 必须以 `gene_distilled_` 开头。
- 后缀用 3-6 个 kebab-case 词描述核心能力。
- 不能包含时间戳、随机数、UUID、工具名。

推荐：

```text
gene_distilled_retry-with-exponential-backoff
```

不推荐：

```text
gene_distilled_cursor-1773331925711
gene_distilled_1234567890
```

### 4.2 Summary

- 必须是 30-200 字符的人类可读句子。
- 描述这个 Gene 提供什么能力，以及为什么有用。
- 要像 marketplace listing。
- 不能写成“Distilled from capsules”这种无信息摘要。

### 4.3 Signals

- 必须是通用、可复用、可搜索的触发词。
- 使用 lowercase_snake_case。
- 推荐 3-7 个。
- 表达问题域和解决方案。
- 不能包含时间戳、session id、工具名、随机后缀。

### 4.4 Strategy

- 5-10 条。
- 每条都是可执行动作。
- 最好是祈使句，并以动词开头。
- 不能只是“fix it”“improve reliability”这种泛泛表达。
- 必要时包含代码示例或参数。

### 4.5 Preconditions

- 必须是具体、可验证条件。
- 不写空泛条件。

### 4.6 Constraints

- `constraints.max_files <= 12`。
- `constraints.forbidden_paths` 至少包含 `.git` 和 `node_modules`。

### 4.7 Validation

- 只能使用 `node`、`npm`、`npx`。
- 必须是真正能验证 Gene 是否生效的命令。
- 不应只写 `node -v` 这种无意义验证。

## 5. Gene 的选择与执行规则

Evolver 不是随机拿 Gene，而是先做匹配和选择。

核心依据：

- `signals_match` 与当前 signals 的匹配。
- 语义相似度。
- memory advice。
- 是否被 banned。
- 是否有 preferredGeneId。
- 是否是 inplace Gene。
- 是否冲突。

特殊规则：

- `execution_mode = inplace` 的 Gene 可以进入 In-Place 模式。
- In-Place 模式限制更小：最多 5 个文件、100 行。
- Multi-Gene Chunk 可以选择多个非冲突 Gene。
- 同类冲突 Gene 不应该一起被选中。
- 如果找不到匹配信号，返回空。

## 6. Gene 的学习更新规则

在 `solidify` 阶段，Gene 会根据结果被更新。

成功时：

- 结构化成功信号会写回 `signals_match`。
- 例如 `problem:performance`、`area:orchestration` 会加入匹配信号。
- `action:optimize` 不会被加入，因为它更像行为，不是问题或场景。
- 会记录 `learning_history`。

失败时：

- 不扩展 `signals_match`。
- 失败经验被记录为 `anti_patterns`。
- soft failure 例如 validation 失败是 retryable。
- destructive constraint failure 是 hard failure，不可 retry。

这说明 Evolver 对 Gene 的学习策略很保守：

```text
成功才扩大适用范围，失败只沉淀反模式，不污染触发条件。
```

## 7. 对 EvoMate 的产品含义

EvoMate 目前把 Agent Genome 拆成：

- Soul
- Skills
- Memory
- Knowledge

基于 Evolver 的 Gene 机制，EvoMate 应该新增一个更底层的层：

```text
Gene Layer / Strategy DNA
```

它不是展示性格，而是展示 Agent 真正可遗传的“策略能力”。

映射关系：

| Evolver 字段 | EvoMate Genome 层 | 含义 |
| --- | --- | --- |
| `category` | Archetype / Skill Type | repair、optimize、innovate |
| `summary` | Skill Summary | 这个策略基因的能力说明 |
| `signals_match` | Trigger Receptors | 什么时候会触发 |
| `preconditions` | Activation Conditions | 触发前置条件 |
| `strategy` | Strategy DNA | 可执行策略步骤 |
| `constraints` | Safety Gene | 可改范围和禁区 |
| `validation` | Fitness Test | 子代是否有效的测试 |
| `avoid` | Recessive Risk / Anti-pattern | 不应继承或需要压制的风险 |
| `Capsule.confidence` | Memory Strength | 某条经验的可信度 |
| `Capsule.blast_radius` | Risk Profile | 执行影响范围 |
| `asset_id` | Provenance | 内容寻址和溯源 |

## 8. EvoMate 的开发方向

### 8.1 第一阶段：读取 Evolver Gene

新增：

```text
src/integrations/evolver/asset-to-genome.js
```

功能：

- 读取 `evolver-main/assets/gep/genes.json`。
- 读取 `evolver-main/assets/gep/capsules.json`。
- 读取 `evolver-main/assets/gep/events.jsonl`。
- 输出 EvoMate 可用的 `AgentGenome[]`。

建议输出：

```js
{
  id: "evolver-repair-lineage",
  name: "Repair Lineage",
  archetype: "Compressed Strategy Agent",
  genes: [/* Evolver Gene[] */],
  capsules: [/* supporting Capsule[] */],
  soul: [],
  skills: [],
  memory: [],
  knowledge: [],
  radar: {}
}
```

### 8.2 第二阶段：把 Gene 展示为 DNA 卡片

新增 UI：

```text
Gene Compression Card
```

展示字段：

- Gene ID。
- Category。
- Summary。
- Trigger Signals。
- Strategy Steps。
- Constraints。
- Validation。
- Confidence Evidence。
- Provenance。

视觉上可以叫：

```text
Compressed Strategy Gene
```

这能让评委理解：

```text
我们不是随便捏一个 Agent，而是从真实执行经验中压缩出可遗传能力。
```

### 8.3 第三阶段：Gene Fusion Engine

当前 EvoMate 的 fusion 主要融合 Soul、Skills、Memory、Knowledge。

下一步应该新增：

```text
Gene Fusion Engine
```

规则建议：

- 父代高 confidence Gene 优先继承。
- 同 category Gene 可以竞争，保留匹配当前 Arena 的最高适配者。
- `signals_match` 合并并去重，但总数限制在 8 个以内。
- `strategy` 选择父母中最可执行的 5-10 条。
- `constraints` 取更保守值，例如 `max_files` 取较小值，`forbidden_paths` 取并集。
- `validation` 合并后只保留安全命令。
- `avoid` 和 `anti_patterns` 必须继承，不能被轻易丢掉。
- mutation 可以新增一个 signal 或 strategy step，但必须标记为 unvalidated。

### 8.4 第四阶段：Child Gene Report

Child Agent 报告中新增：

- Inherited Genes。
- Recombined Signals。
- Mutated Strategy Step。
- Safety Constraints。
- Fitness Tests。
- Evidence Capsules。

推荐文案：

```text
这个子代 Agent 继承了父代 A 的 repair gene 和父代 B 的 narrative framing gene，并突变出一个 cross-domain evaluation signal。当前突变尚未验证，需要进入 Arena。
```

### 8.5 第五阶段：Arena 变成真实 Fitness Test

Arena 不只是展示三段文案，而应该逐渐变成：

```text
Child Gene 是否通过 validation / benchmark / judge task 的测试场。
```

MVP 可先做静态：

- 展示父代 validation。
- 展示子代继承后的 validation。
- 给出 Fitness Score。

后续再做真实执行：

- 调用 OpenClaw Agent。
- 运行标准任务。
- 记录 Capsule。
- 把成功 Capsule 写回 Evolver。

## 9. EvoMate 的最小开发任务拆分

### P0：文档和展示

- 在 PRD 中新增 `Gene Layer`。
- 在页面中新增 Gene 卡片 mock。
- 解释 Gene = compressed strategy DNA。

### P1：读取真实 Evolver Gene

- 写 `src/integrations/evolver/asset-to-genome.js`。
- 把 `genes.json` 转成 EvoMate `AgentGenome`。
- 在前端提供 “Use Evolver Genes” 开关。

### P2：Gene Fusion

- 写 `src/core/gene-fusion-engine.js`。
- 支持 signal 合并、strategy 重组、constraint 取保守、validation 合并。
- Child Report 展示 Gene 继承来源。

### P3：Fitness Arena

- 用 `validation` 概念替代纯模板 Arena。
- 给 Child Agent 一个 `fitnessScore`。
- 未来把成功结果写成 Capsule。

### P4：反向发布

- 把 EvoMate 生成的 Child Gene 导出为 Evolver 可消费的 Gene。
- 如果 Arena 成功，再导出 Capsule。
- 形成闭环：

```text
Evolver Gene -> EvoMate Breeding -> Child Gene -> Arena -> Capsule -> Evolver
```

## 10. 一句话产品叙事升级

原表达：

```text
EvoMate 让两个 Agent 通过 DNA 融合生成子代 Agent。
```

升级后：

```text
EvoMate 基于 Evolver 的 Gene 压缩机制，把 Agent 的成功经验压缩成可遗传的策略基因，再通过繁育、重组、突变和 Arena 验证，生成下一代 Agent。
```

更短的路演版：

```text
Evolver 把经验压缩成 Gene，EvoMate 让 Gene 发生遗传和进化。
```

