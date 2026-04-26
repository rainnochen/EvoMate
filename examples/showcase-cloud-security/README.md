# Cloud Security Showcase

This example is the current public showcase for EvoMate.

It demonstrates a child skill produced from two public Google Skills:

- Parent A: `cloud-run-basics`
- Parent B: `google-cloud-waf-security`
- Showcase child name: `Secure Cloud Run Architecture Reviewer`

## Why this example matters

The goal is to show that EvoMate can work with real public skills, not only hand-written demo parents.

In the public-skill experiment, EvoMate pulled skills from:

- `openai/skills`
- `google/skills`
- `anthropics/skills`

It extracted `73` real `SKILL.md` files, grouped them, and ran the EvoMate pipeline:

```text
parse -> compatibility -> crossover -> mutation repair -> evaluation -> lineage
```

This pair was selected because it is a natural `cloud x security` case:

- `cloud-run-basics` contributes Cloud Run deployment and runtime context.
- `google-cloud-waf-security` contributes Google Cloud security assessment guidance.
- The generated child becomes a stronger cloud architecture review skill with explicit evaluation and lineage records.

## Artifacts

- [child-agent.md](./child-agent.md)
- [child-gene.json](./child-gene.json)
- [child-lineage.json](./child-lineage.json)
- [child-eval.json](./child-eval.json)
- [child-mutations.json](./child-mutations.json)

## Result

- Compatibility score: `0.35`
- Static gate: `pass`
- Fitness: `0.925`
- Mutation repairs: `6`

The current task evaluation is intentionally lightweight. Treat this example as a reproducible showcase of the pipeline and artifact contract, not as a final benchmark claim.
