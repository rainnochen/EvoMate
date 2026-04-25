> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)

---

# MVP Plan

## Must Ship

- 4 preset parent agents
- selectable parent pairing
- genome profile cards
- compatibility score
- animated fusion chamber
- child agent generation
- inheritance and mutation report
- one arena comparison task

## Page Flow

1. Lab Entrance
2. Match Room
3. Fusion Chamber
4. Child Report
5. Arena

## Core Logic

### Compatibility Engine

Inputs:

- parent A genome
- parent B genome

Outputs:

- personality compatibility
- skill complementarity
- knowledge diversity
- mutation potential
- total score
- explanation

MVP method:

- rule-based score, no complex algorithm

### Fusion Engine

Inputs:

- parent A genome
- parent B genome

Outputs:

- child genome
- inheritance log
- mutation log
- rarity label

MVP method:

- merge skill pools
- inherit selected soul traits
- carry summarized memory fragments
- select knowledge capsules
- inject one deterministic mutation based on parent pairing

### Arena Engine

Inputs:

- task prompt
- parent A
- parent B
- child

Outputs:

- three generated pitch samples
- evaluator notes

MVP method:

- controlled templates based on genome traits and skills

## Demo Quality Bar

The demo should make three things obvious:

- the child inherits visible parts from both parents
- mutation is understandable and useful
- the arena output feels different from both parents