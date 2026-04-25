# EvoMate 源码层说明

## 当前源码目录

路径：`src/`

当前主要模块：

- `src/core/compatibility-engine.js`
- `src/core/fusion-engine.js`
- `src/core/arena-engine.js`

## compatibility-engine.js

功能：

- 计算两个父代 Agent 的兼容性。

输入：

- Parent A genome
- Parent B genome

输出：

- 总分
- 性格契合度
- 技能互补度
- 知识多样性
- 突变潜力
- 解释文案

当前算法：

- 使用 trait tension 表判断性格冲突。
- 使用技能去重数量和 overlap 判断互补程度。
- 使用知识 capsule 去重数量判断知识多样性。
- 使用 radar 差异判断突变潜力。

## fusion-engine.js

功能：

- 生成子代 Agent。

输入：

- Parent A genome
- Parent B genome
- compatibility result

输出：

- Child genome
- inheritance log
- mutation log
- fusion log

当前算法：

- 从父母各继承高权重 Soul traits。
- 合并父母前几项 skills。
- 判断是否触发 fusion skill。
- 抽取双方 memory 第一条作为记忆碎片。
- 继承父母前两项 knowledge capsule。
- 根据父母 id 和技能数选择确定性 mutation。

## arena-engine.js

功能：

- 生成 Arena 对比输出。

输入：

- Arena task
- Parent A
- Parent B
- Child

输出：

- 三个角色的输出文本。
- 每个输出的 notes。

当前算法：

- 使用模板文案。
- 通过 dominant traits 和 strongest skills 补充表达说明。

## 未来源码目录建议

建议新增：

- `src/integrations/evolver/`
- `src/integrations/a2a/`
- `src/family-tree/`
- `src/evaluators/`
- `src/genome-schema/`

## 未来重构重点

- 将 genome schema 独立成标准模块。
- 将 mock data 与 runtime generated data 分离。
- 将 Arena 输出从模板升级为真实 Agent 执行。
- 将 mutation 从确定性选择升级为可配置策略。
- 将 child genome 导出为可被 evolver-main 消费的 GEP asset。
