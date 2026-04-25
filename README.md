# EvoMate

EvoMate is an Agent digital genetics lab for the hackathon red-pill track.

It lets two parent agents breed a child agent through genome inheritance, recombination, mutation, and same-arena fitness evaluation.

## One-line pitch

EvoMate is an EvoMap-based Agent digital genetics sandbox where two agents fuse their DNA to create a child agent, then evaluates whether the child beats the parent baseline through a positive fitness delta.

## Track

Recommended track: `Red Pill / Build For Future`

Why this direction:

- it is more original than another agent workflow app
- it extends A2A from communication into cross-generation evolution
- it makes abstract agent capability formation visible
- it can still become a future enterprise agent optimization method

## MVP loop

1. Browse parent agent genome profiles.
2. Select two parents in the match room.
3. Inspect compatibility and mutation potential.
4. Trigger DNA fusion.
5. Reveal the child agent and genetic report.
6. Compare parent and child expression in an arena task.

## Project structure

- `apps/web/`: static MVP demo app.
- `data/mock/`: preset agents, arena task, and language for demo.
- `src/core/`: framework-level MVP logic for compatibility, fusion, Gene recombination, and arena output.
- `docs/`: PRD, architecture, MVP plan, and demo script.
- `docs-zh/`: Chinese product, architecture, OpenClaw integration, and development documents.
- `lightning-pitch/`: lightning pitch scripts, prompts, and generated visual assets.
- `开发日志/`: Chinese development logs and iteration rules.
- `scripts/`: local server and future automation helpers.
- `分布式开发机制.zh-CN.md`: distributed development rules, module ownership, and assembly contracts.
- `module-manifest.json`: machine-readable module and contract manifest.

## Quick start

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3030
```

## Verify

```bash
npm run check
```

The current app is intentionally zero-dependency so the hackathon demo remains stable even without network access.
