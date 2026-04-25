---
name: xiaohongshu-playbook-distiller
description: Distill Xiaohongshu operating experience, account cases, workflows, and source materials into reusable, executable child skills. Use when the user wants to turn Xiaohongshu know-how into auditable skills with clear triggers, platform-fit boundaries, reusable SOPs, and test prompts.
---

# Xiaohongshu Playbook Distiller

Use this skill when the user wants to convert Xiaohongshu operating knowledge into reusable skills rather than one-off notes or scattered advice.

This skill is for turning:

- account case studies
- operating SOPs
- posting workflows
- topic-selection methods
- reply systems
- review frameworks
- platform observations

into executable child skills.

## Goal

Turn Xiaohongshu know-how into child skills that are:

- triggerable
- platform-native
- reusable
- auditable
- boundary-aware

## Parent DNA

This child skill inherits:

- from `cangjie-skill`: methodology distillation, candidate extraction, validation before formalization, explicit trigger design, and audit trail
- from `xiaohongshu-ops-skill`: platform-native workflow, account-positioning logic, topic research, posting execution, review and repair loop, browser/runtime constraints, and knowledge-base reuse

## Core Principle

Do not turn every Xiaohongshu tactic into a skill.

Only distill patterns that are:

- repeatable across multiple posts or tasks
- specific enough to trigger reliably
- useful beyond one account snapshot
- compatible with Xiaohongshu platform behavior

If it is only a clever sentence or one lucky爆文 pattern, do not package it as a child skill.

## When To Use

Use this skill when the user asks to:

- turn a Xiaohongshu workflow into a skill
- extract reusable operating methods from account examples
- distill a posting or reply SOP into a child skill
- convert Xiaohongshu research notes into executable skills
- split a broad Xiaohongshu ops system into smaller reusable skills

## Required Inputs

Before starting, confirm or infer:

1. the source material
2. the target account type or operating context
3. the repeated task to be turned into a skill
4. the success criteria
5. the platform or tool constraints

Valid source materials can include:

- existing Xiaohongshu skill files
- account analysis notes
- operation logs
- posting SOPs
- example notebooks
- observed post URLs with extracted patterns

If the skill depends on source material and none is available, stop and ask for it.

## Output Structure

The default output should include:

1. proposed child skill list or single child skill
2. inherited genes
3. rejected candidate patterns
4. trigger definition
5. workflow
6. boundary rules
7. output format
8. evolution trace
9. test prompts

## Workflow

### Stage 0: Read the source as an operating system

Do not begin by rewriting wording.

First identify:

- what task repeats
- what inputs it needs
- what action sequence it follows
- what evidence decides success
- what platform constraint affects execution

Focus on operating logic, not expression.

### Stage 1: Extract candidate skill units

Break the source into candidate units such as:

- account positioning
- account diagnosis
- topic ideation
- benchmark analysis
- viral-copy imitation
- publishing preflight
- comment reply operation
- review and repair
- knowledge-base deposition

Each candidate must be small enough to trigger clearly.

### Stage 1.5: Validate candidate units

A candidate becomes a real child skill only if it passes all three checks:

- repeatability: can this be used across multiple Xiaohongshu tasks
- trigger clarity: can a user request clearly activate it
- platform fit: does it depend on Xiaohongshu-native behavior instead of generic content advice

Rejected candidates should be listed with reasons.

### Stage 2: Build the child skill

For each validated unit, write a child `SKILL.md` with:

- clear trigger description
- required inputs
- ordered workflow
- platform constraints
- output contract
- failure handling
- boundary rules

Prefer one skill per repeated task.

Do not pack unrelated tasks into one child skill just because they live in the same operating system.

### Stage 3: Encode Xiaohongshu-native constraints

Every child skill should explicitly state:

- whether it requires Xiaohongshu browsing or posting context
- whether it depends on account positioning
- whether it needs runtime/browser constraints
- whether it writes back into a knowledge base
- what risk boundaries apply

If these constraints are omitted, the child skill becomes generic and weak.

### Stage 4: Write the evolution trace

Explain the evolution in this order:

1. source pattern
2. inherited gene from `cangjie-skill`
3. inherited gene from `xiaohongshu-ops-skill`
4. mutation introduced for Xiaohongshu reuse
5. child capability gained

This is mandatory when the user asks for the thinking or evolution process.

### Stage 5: Produce test prompts

Create at least 6 prompts:

- 2 that should trigger the child skill
- 2 that should not trigger it
- 2 boundary or ambiguity tests

If the child skill cannot be separated from adjacent Xiaohongshu tasks, refine the trigger and rewrite it.

## Hard Gates

Stop and revise if any of these fail:

1. the child skill cannot state its repeated task in one sentence
2. the trigger is too broad to distinguish from general Xiaohongshu ops
3. the workflow has no Xiaohongshu-native platform constraint
4. the child skill contains multiple unrelated tasks
5. the output is not reusable in future operations
6. rejected candidate patterns are hidden instead of recorded

## Writing Rules

- Distill behavior, not slogans.
- Prefer operational triggers over topic labels.
- Preserve platform-specific constraints.
- Keep one child skill tightly scoped.
- Do not confuse a content idea with a reusable operating method.

## Response Pattern

When using this skill, respond in this order:

1. identify the repeated Xiaohongshu task
2. extract candidate skill units
3. show what is inherited and what is rejected
4. output the child skill
5. show the evolution trace
6. show the test prompts

## Tone

Be practical and platform-aware.
Treat Xiaohongshu as a constrained operating environment, not a generic content channel.
The goal is to create skills that can repeatedly produce useful Xiaohongshu actions.
