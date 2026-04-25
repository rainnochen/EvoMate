---
name: evidence-skill-forge
description: Distill source materials, workflows, or domain playbooks into an auditable, hard-gated, reusable skill. Use when the user wants to turn books, docs, existing skills, research workflows, or expert methods into a child skill with verification, decision gates, test prompts, and explicit evolution traces.
---

# Evidence Skill Forge

Use this skill when the user wants to generate a new skill from one or more parent skills, books, workflows, or domain documents.

The goal is not summarization. The goal is to produce a child skill that is:

- executable
- auditable
- bounded
- testable
- evolvable

## Parent DNA

This skill inherits two core genes:

- From `cangjie-skill`: methodology distillation, atomic skill extraction, audit trail, candidate versus rejected branches, boundary awareness, and testable triggers.
- From `UZI-Skill`: hard gates, ordered workflow, progress reporting, contradiction-first judgment, evidence discipline, and analyst responsibility instead of template dumping.

## When To Use

Use this skill when the user asks to:

- generate a child skill from multiple parent skills
- fuse two methodologies into one reusable skill
- turn a research workflow into a deployable skill
- rewrite a vague skill into a hard-gated and testable one
- preserve evolution history while creating a new skill

## Core Principle

Do not average parent skills together.

A child skill is not a blend. It is a selective inheritance result.

For each parent, explicitly decide:

- what gene to inherit
- what gene to drop
- what conflict must be resolved
- what new adaptation is needed for the child context

If you cannot explain those four points, the child skill is not ready.

## Output Structure

The default output should contain:

1. child skill name
2. parent genes inherited
3. dropped parent genes
4. conflict resolution logic
5. child skill `SKILL.md`
6. evolution trace
7. test prompts

## Workflow

### Stage 0: Read the parents as systems

Read the parent skills or source materials fully enough to identify:

- trigger logic
- role definition
- workflow stages
- hard constraints
- output contract
- validation method

Do not focus on wording first. Focus on operating logic.

### Stage 1: Extract parent genes

For each parent, extract these six genes:

1. trigger gene
2. workflow gene
3. validation gene
4. output gene
5. tone gene
6. boundary gene

Write them as short operational statements, not summaries.

Example:

- bad: "This parent is rigorous"
- good: "This parent blocks later stages until prior artifacts exist"

### Stage 2: Resolve inheritance conflicts

Parent skills will usually conflict on:

- freedom versus control
- breadth versus depth
- exploration versus gatekeeping
- reusable abstraction versus domain specificity

You must resolve these conflicts explicitly.

Use this format:

- conflict
- chosen side
- reason
- consequence

Never hide the tradeoff.

### Stage 3: Define the child mutation

The child must introduce at least one new adaptation that neither parent alone provides.

Good mutations:

- better trigger precision
- clearer stop conditions
- a lighter output contract
- stronger auditability
- reusable evaluation prompts
- better parent-to-child evolution trace

Bad mutations:

- renamed sections without new capability
- longer wording with no operational change

### Stage 4: Write the child skill

The child `SKILL.md` must include:

- a precise `name`
- a trigger-rich `description`
- goal
- when to use
- workflow
- hard gates
- output structure
- validation rules
- tone

Keep it concise. Add detail only when it changes behavior.

### Stage 5: Build the evolution trace

Always explain the evolution as:

1. parent A gene
2. parent B gene
3. conflict
4. mutation
5. child capability gained

This is mandatory when the user asks for the thinking or evolution process.

### Stage 6: Produce test prompts

Create at least 6 test prompts:

- 2 should trigger the child skill
- 2 should not trigger it
- 2 should be ambiguous boundary tests

If the child skill has no boundary tests, it is under-specified.

## Hard Gates

Stop and fix the skill if any of these fail:

1. The child skill cannot state what it inherited from each parent.
2. The child skill has no explicit conflict-resolution logic.
3. The `description` does not clearly say when it should trigger.
4. The workflow has no stop conditions or quality gates.
5. The output format cannot be validated by another agent or future pass.
6. The child skill is broader than both parents but less precise than either parent.

## Writing Rules

- Be operational, not literary.
- Prefer short assertions over abstract praise.
- Surface contradictions instead of smoothing them out.
- Do not present inherited weaknesses as strengths.
- If evidence is incomplete, say which inheritance decisions are inferred.

## Response Pattern

When generating a child skill, use this order:

1. identify the parent genes
2. state inheritance decisions
3. state conflicts
4. state the mutation
5. output the child skill
6. output the evolution trace
7. output test prompts

## Tone

Be direct and engineering-oriented.
Treat skill design as system design.
The child skill should feel like a stronger organism, not a merged document.
