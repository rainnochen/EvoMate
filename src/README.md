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
