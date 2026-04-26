# EvoMate

> Agent Skill Breeding Engine: make skills inheritable, recombinable, and traceable.

EvoMate turns two parent agent or skill documents into a structured child skill through an auditable pipeline:

```text
Parse -> Compatibility Check -> Role-aligned Crossover -> Mutation Repair -> Evaluate -> Record
```

Unlike asking an LLM to merge two prompts, EvoMate treats reusable agent capability as a structured `agentGene`. Each run records what was inherited, what was repaired, how the child was evaluated, and where the final artifacts were written.

## Why this exists

Agent ecosystems are producing more skills, workflows, tools, and operating patterns. The hard part is no longer only creating more agents. The harder question is:

```text
Where do better skills come from?
```

EvoMate explores the upstream supply layer for agent ecosystems:

- parse parent skills into structured genes
- recombine workflow, decision, tool, output, validation, safety, and style loci
- repair broken crossover results
- evaluate child quality
- record lineage so evolution is inspectable

## Install

```bash
npm install
```

Requirements:

- Node.js 18+
- No database
- No external API required for the core pipeline

## Quick Start

Run the default parent pair:

```bash
npm run evolve
```

The run writes generated artifacts to `agent-evomate/outputs/`.

Run the structural check:

```bash
npm run check
```

Run a small batch showcase against a local skills folder layout:

```bash
npm run skills:showcase -- --limit 4 --pair-limit 3
```

By default, generated batch outputs are written under `outputs/skill-showcase-batch/` and are ignored by Git.

## What Gets Produced

Each evolution run can produce:

- `child-agent.md`: rendered child skill or agent document
- `child-gene.json`: structured `agentGene` output
- `child-lineage.json`: inheritance and crossover trace
- `child-eval.json`: static and task evaluation result
- `child-mutations.json`: mutation repair log

## agentGene

The current `agentGene` model uses nine major loci:

| Locus | Meaning | Default strategy |
|---|---|---|
| `identity_gene` | identity and intent | summarize into child identity |
| `trigger_gene` | when to use the skill | merge and deduplicate |
| `workflow_gene` | execution steps | role-aligned crossover |
| `decision_gene` | decision rules | conservative merge |
| `tool_gene` | tool boundaries | restrict by safer policy |
| `output_gene` | output contract | prefer clearer structure |
| `validation_gene` | checks and quality gates | merge and deduplicate |
| `safety_gene` | safety constraints | union, stricter wins |
| `style_gene` | tone and interaction style | normalize lightly |

## Repository Layout

```text
EvoMate/
├── agent-evomate/
│   ├── src/
│   │   ├── parser/       # agent/skill markdown -> agentGene
│   │   ├── gene/         # schema, normalization, compatibility
│   │   ├── crossover/    # role-aligned crossover engine
│   │   ├── mutation/     # repair operators
│   │   ├── evaluate/     # static and task evaluation
│   │   ├── lineage/      # lineage record builder
│   │   ├── render/       # child gene -> markdown
│   │   ├── store/        # artifact writing
│   │   └── pipeline/     # evolve.js entrypoint
│   ├── agents/           # minimal parent examples
│   └── docs/             # engine design notes
├── scripts/
│   └── skills-batch-showcase.mjs
├── examples/
│   └── showcase-cloud-security/
├── skill/
│   └── SKILL.md
└── docs/
    └── open-source-roadmap.md
```

## Showcase

The curated showcase is:

```text
cloud-run-basics x google-cloud-waf-security
```

It demonstrates a child skill produced from public cloud and security skills.

See:

- [Cloud Security Showcase](./examples/showcase-cloud-security/README.md)
- [Open Source Roadmap](./docs/open-source-roadmap.md)

## Public Skill Experiments

The large public-skill experiment is intentionally kept outside the main repository. The recommended pattern is:

1. keep raw cloned third-party repositories outside this repo
2. run the batch pipeline locally
3. copy only curated showcase artifacts into `examples/`

This keeps the open source project small while still preserving evidence that the pipeline works on real skills.

## Development Notes

Useful commands:

```bash
npm run evolve
npm run skills:showcase -- --limit 4 --pair-limit 3
npm run check
```

Generated outputs are ignored by default:

- `outputs/`
- `agent-evomate/outputs/`
- `test-demo/outputs/`

## License

MIT
