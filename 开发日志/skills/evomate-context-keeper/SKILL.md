---

## name: evomate-context-keeper
description: Use this skill when working on the EvoMate hackathon project and needing to recover, summarize, update, or preserve project context from prior conversations, development logs, PRDs, pitch materials, Evolver/OpenClaw research, or implementation changes. This skill keeps the project memory coherent across fast hackathon iterations.

# EvoMate Context Keeper

## Purpose

Use this skill to keep EvoMate's project memory alive across conversations and development sessions.

The goal is not to archive everything. The goal is to preserve the decisions, narrative, architecture, and implementation state that future contributors need in order to continue quickly.

## When To Use

Use this skill when the user asks to:

- summarize historical conversation context
- write or update development logs
- recover what has already been decided
- onboard a new teammate
- compare the current implementation with prior PRD direction
- maintain project memory during hackathon development
- decide what should go into `开发日志/`

## Required First Step

Before writing new context, inspect the current project state:

```bash
find . -maxdepth 3 -type f | sort
```

Then read only the relevant files, usually:

- `README.md`
- `docs-zh/README.zh-CN.md`
- `开发日志/README.zh-CN.md`
- latest files in `开发日志/`
- `docs-zh/evolver-gene-compression-and-evomate-development.zh-CN.md`
- `docs-zh/evolver-gene-layer-development-v1.zh-CN.md`
- `docs-zh/openclaw-evomate-integration-prd.zh-CN.md`

If the user explicitly asks for historical context, also read:

- `references/history-context.zh-CN.md`

## Context Summary Rules

When summarizing context, organize it into these blocks:

1. Project identity
2. Hackathon strategy
3. Product narrative
4. Architecture state
5. Current implementation state
6. Key docs and assets
7. Open decisions
8. Next development moves

Keep the summary action-oriented. Prefer:

```text
We already decided X, implemented Y, next should do Z.
```

Avoid:

```text
Long chronological transcript-style recap.
```

## Development Log Rules

When adding a development log:

- Place it under `开发日志/`.
- Use Chinese Markdown.
- Use a date prefix: `YYYY-MM-DD-主题.zh-CN.md`.
- Update `开发日志/README.zh-CN.md`.
- Record what changed, why, files touched, validation result, and next action.
- If the change affects product direction, also update the relevant `docs-zh/` file.

Recommended log structure:

```markdown
# YYYY-MM-DD：主题

## 本次目标

## 背景上下文

## 主要变化

## 涉及文件

## 验证结果

## 风险与边界

## 下一步
```

## Context Branch Rules

This skill maintains a context branch under:

```text
开发日志/skills/evomate-context-keeper/
```

Use this branch for durable project memory:

- `SKILL.md`: workflow and operating rules.
- `references/history-context.zh-CN.md`: condensed historical context.
- `references/context-update-template.zh-CN.md`: template for future updates.

When the project direction changes materially, update `history-context.zh-CN.md`.

When only code changes, prefer writing a normal dated development log instead of modifying the historical context.

## EvoMate Memory Anchors

Always preserve these core anchors unless the user explicitly changes direction:

- EvoMate is an Agent digital genetics lab for the Red Pill / Build For Future track.
- The product narrative is not "AI pet breeding"; it is Agent evolution, protocol inheritance, and future Agent creation.
- Core genome layers are now `Soul / Skills / Memory / Wiki / Gene`.
- The current MVP is a zero-dependency static demo under `apps/web/`.
- The current logic modules are compatibility, fusion, gene-fusion, and arena.
- Evolver contributes the Gene compression concept.
- OpenClaw contributes future runtime, tool, memory, and local agent infrastructure inspiration.
- Development logs are part of the product story because the hackathon award includes evolution over 48 hours.

## Output Style

Write in concise Chinese by default.

Use clear headings and short bullets. The user is moving quickly in a hackathon setting, so prioritize clarity and momentum over exhaustive documentation.