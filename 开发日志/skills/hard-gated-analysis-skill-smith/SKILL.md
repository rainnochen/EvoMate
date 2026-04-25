---
name: hard-gated-analysis-skill-smith
description: Build a domain-specific analysis skill from books, documents, research workflows, or parent skills. Use when the user wants a concrete child skill for analysis work that includes trigger precision, staged workflow, hard quality gates, contradiction handling, audit trail, and test prompts.
---

# Hard Gated Analysis Skill Smith

Use this skill when the user wants to turn source materials into a concrete analysis-oriented child skill.

This is not for general summarization and not for broad skill brainstorming. This skill is specifically for creating analysis skills that another agent can actually run in real tasks.

## Goal

Produce a child skill that can analyze a target domain with:

- clear trigger conditions
- ordered stages
- explicit hard gates
- contradiction-first reasoning
- auditable evidence use
- boundary-aware outputs

## Lineage

This skill is a second-generation child skill.

It inherits:

- from `cangjie-skill`: structured distillation, atomic method extraction, boundary definition, and testable triggers
- from `UZI-Skill`: stage ordering, hard-stop quality gates, evidence discipline, conflict surfacing, and analyst-owned judgment
- from `evidence-skill-forge`: inheritance mapping, conflict resolution, mutation logic, and evolution trace

## When To Use

Use this skill when the user asks to:

- create a domain analysis skill from source material
- convert a research workflow into an executable skill
- fuse multiple parent skills into one analysis skill
- build a stricter skill for diagnosis, evaluation, review, or decision support
- create a reusable expert-analysis workflow instead of a one-off answer

## Required Inputs

Before building the child skill, confirm or infer:

1. the target analysis domain
2. the source materials or parent skills
3. the intended output type
4. the key failure modes to prevent
5. the boundary of what the skill should not do

If the source material is missing and the task depends on it, stop and ask for it.

## Output Contract

The default output should include:

1. child skill name
2. target analysis job
3. inherited genes
4. dropped genes
5. hard gates
6. workflow stages
7. output format
8. boundary rules
9. evolution trace
10. test prompts

## Workflow

### Stage 0: Define the analysis job

State the real job in one sentence.

Examples:

- evaluate whether a content-account idea can spread and monetize
- analyze a company with evidence and contradiction handling
- assess whether a strategy is executable or only attractive in theory

If the job cannot be stated clearly, do not build the skill yet.

### Stage 1: Extract usable parent genes

For each parent or source, extract only the genes that change behavior:

- trigger logic
- stage logic
- evidence logic
- judgment logic
- output logic
- failure-prevention logic

Do not inherit decorative wording.

### Stage 2: Define the operating spine

Every child analysis skill must define:

1. what triggers it
2. what inputs are required
3. what sequence it follows
4. what blocks progression
5. what final artifact it produces

If one of these is missing, the skill is incomplete.

### Stage 3: Install hard gates

Hard gates are mandatory for analysis skills.

At minimum, define gates for:

- missing input
- unsupported scope
- insufficient evidence
- contradictory evidence
- generic output without decision value

When contradiction exists, the skill must surface it instead of smoothing it away.

### Stage 4: Write the analysis child skill

The generated child `SKILL.md` must contain:

- role
- goal
- when to use
- required inputs
- workflow
- hard gates
- output format
- writing rules
- tone

Keep it operational. Every section should change what the agent does.

### Stage 5: Explain the evolution

Always document the evolution in this order:

1. inherited gene
2. parent source
3. reason for inheritance
4. mutation applied
5. capability gained

Also state what was dropped and why.

### Stage 6: Stress-test the child skill

Produce at least 8 test prompts:

- 3 should trigger the skill
- 3 should not trigger it
- 2 should be boundary or ambiguity tests

If the skill triggers on everything, it is weak.
If it never triggers without exact wording, it is too brittle.

## Hard Gates

Stop and revise if any of these are true:

1. the child skill cannot say what decision it helps make
2. the workflow has no ordered stages
3. there is no explicit stop condition for bad inputs
4. evidence is mentioned but not tied to action
5. contradiction is possible but no handling rule exists
6. the final output is descriptive but not decision-useful
7. the child skill is less precise than its parents

## Writing Rules

- Prefer action rules over explanation.
- Prefer sharp triggers over broad labels.
- Convert principles into executable checks.
- Surface tradeoffs directly.
- Do not let the agent hide uncertainty behind polished prose.

## Default Response Pattern

When using this skill, respond in this order:

1. define the target analysis job
2. identify parent genes
3. state inheritance and mutation choices
4. output the child skill
5. show the evolution trace
6. show the test prompts

## Tone

Be direct, structured, and unsentimental.
This skill designs analysis operators, not inspirational documents.
