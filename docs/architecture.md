> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)

---

# Architecture

## Design Goal

Build a stable hackathon demo that already has a clean path toward real EvoMap and `evolver` integration.

## Runtime Layers

### 1. Web App

Location: `apps/web/`

Responsibilities:

- page-level state
- parent selection
- fusion chamber transitions
- child report rendering
- arena comparison rendering

### 2. Mock Data

Location: `data/mock/`

Responsibilities:

- preset parent genomes
- arena prompt
- deterministic demo copy
- future fixture source for tests

### 3. Core Logic

Location: `src/core/`

Responsibilities:

- compatibility scoring
- genome fusion
- mutation injection
- arena expression synthesis

### 4. Future Evolver Integration

Future location: `src/integrations/evolver/`

Responsibilities:

- read GEP genes and capsules from `evolver-main`
- map GEP assets into EvoMate genome layers
- export child genome as a candidate evolution asset
- connect to EvoMap A2A flows

## Data Flow

```text
Preset Agent Genomes
  -> parent selection
  -> compatibility engine
  -> fusion engine
  -> child genome
  -> genetic report
  -> arena engine
  -> parent / child expression comparison
```

## MVP Engineering Choices

- static app, no build step
- native ES modules
- deterministic rules with light seeded variation
- no external API dependency during live demo
- all data lives in local JSON fixtures

## Extension Points

- `src/core/compatibility-engine.js`: replace rule scores with embedding-based or eval-based matching.
- `src/core/fusion-engine.js`: replace deterministic fusion with `evolver` GEP asset generation.
- `src/core/arena-engine.js`: replace template outputs with live agent execution.
- `data/mock/agents.json`: add more parent agents and family-tree fixtures.

