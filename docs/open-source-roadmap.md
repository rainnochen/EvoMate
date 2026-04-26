# EvoMate Open Source Roadmap

This roadmap keeps the open source project focused on the core engine rather than hackathon-only materials.

## Repository scope

The public repository should contain:

- Core EvoMate engine code.
- A small set of parent skill examples.
- One or two curated showcase outputs.
- Benchmark and batch-running scripts.
- Technical documentation that helps contributors understand the protocol.

The public repository should not contain:

- Pitch decks and investor materials.
- Raw cloned third-party skill repositories.
- Large generated run folders.
- Local experiments, screenshots, or one-off presentation assets.
- Internal logs and private product notes.

## Current open source boundary

Keep in this repository:

- `agent-evomate/src/`
- `agent-evomate/agents/`
- `agent-evomate/docs/`
- `scripts/skills-batch-showcase.mjs`
- `skill/SKILL.md`
- `examples/showcase-cloud-security/`
- `docs/`

Keep outside this repository:

- `evomate-pitch/`
- `EvoMate-内部文档/`
- `evomate-evolation-test/public-skill-repos/`
- `evomate-evolation-test/runs/`
- `evomate-evolation-test/targeted-runs/`

## P0 cleanup

- Keep generated outputs ignored by default.
- Preserve one curated showcase under `examples/`.
- Make `npm run evolve` work from the repository root.
- Make `npm run check` validate the current code paths only.
- Keep the README short enough for a new user to run the first example in minutes.

## P1 engine hardening

- Add schema validation for `agentGene`.
- Add explicit artifact version fields.
- Improve child naming and rendering so child outputs read like product-grade skills.
- Strengthen task evaluation beyond keyword matching.
- Add deterministic fixtures for compatibility, crossover, mutation, and scoring.

## P2 benchmark layer

- Convert public skill breeding into a reproducible benchmark command.
- Maintain a small manifest of public skill sources instead of committing cloned repos.
- Add a stable leaderboard format.
- Add at least two curated showcases:
  - `cloud x security`
  - `build x review` or `data x review`

## P3 ecosystem integration

- Export child skills in OpenClaw-compatible `SKILL.md` format.
- Add an adapter for EvoMap / GEP-style assets.
- Support importing external skills from a manifest.
- Add a lightweight UI for viewing parents, child genes, lineage, and evaluation.
