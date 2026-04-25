> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate Source Layer

This directory contains the framework-level logic behind the MVP.

## Current modules

- `core/compatibility-engine.js`: scores parent pairing.
- `core/genome-engine.js`: builds formal AgentGenome / Chromosome / Locus structures from raw agent data.
- `core/fusion-engine.js`: creates a child genome and genetic report.
- `core/gene-fusion-engine.js`: recombines compressed Strategy Genes and attaches fitness tests.
- `core/evaluation-engine.js`: evaluates parent and child genomes in the same arena and computes fitness metrics.
- `core/evolution-service.js`: orchestrates one Evolution Run, generates child candidates, selects the best child, and builds export payloads.
- `core/arena-engine.js`: generates controlled arena comparison outputs.
- `integrations/evolver/asset-to-genome.js`: adapts Evolver Gene assets into EvoMate genome bundles.
- `../schemas/`: formal JSON schema files for AgentGenome / Chromosome / Locus.

## Future modules

- `integrations/a2a/`: route parent and child agents through A2A experiments.
- `family-tree/`: store multi-generation lineage and selection history.
- `evaluators/`: evaluate child expression against task objectives.
