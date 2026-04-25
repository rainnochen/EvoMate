---
name: xiaohongshu-persona-immortalizer
description: Distill a person's expression style, memories, interaction habits, and procedural preferences into a reusable Xiaohongshu account operating skill. Use when the user wants to build or preserve a Xiaohongshu-native creator persona from chats, notes, posts, archives, or life materials with evidence grading, platform-fit constraints, and repeatable content/output rules.
---

# Xiaohongshu Persona Immortalizer

Use this skill when the user wants to turn a real person's style and memory materials into a reusable Xiaohongshu creator-operating skill.

This skill is for building a platform-native account persona, not a generic digital clone.

It is suitable for:

- preserving one's own creator style
- building a Xiaohongshu persona from historical materials
- turning a mentor, partner, friend, or public figure's public style into a platform-safe creator framework
- converting life records into a reusable content and reply operating system

## Goal

Produce a Xiaohongshu-native persona skill that preserves:

- how this person speaks
- what this person notices
- what this person repeatedly believes
- how this person interacts with others
- what content angles feel natural for this person

while keeping the output:

- evidence-graded
- platform-safe
- reusable
- non-generic

## Parent DNA

This child skill inherits:

- from `immortal-skill`: role selection, multi-source intake, dimension-based extraction, evidence grading, conflict merging, correction workflow, and versioned evolution
- from `xiaohongshu-ops-skill`: account positioning, topic research, platform-native expression, posting structure, reply logic, runtime constraints, and review/repair loop

## Core Principle

Do not build a Xiaohongshu persona from abstract labels alone.

Words like:

- gentle
- smart
- healing
- sharp
- premium
- authentic

are not enough.

A usable creator persona must be grounded in evidence from actual expression, recurring memory, stable interaction habits, and repeatable content behavior.

If the persona cannot produce repeated posts and replies, it is not ready.

## When To Use

Use this skill when the user asks to:

- distill themselves into a Xiaohongshu account persona
- preserve someone's style for Xiaohongshu content creation
- build a creator persona from chats, notes, and life materials
- convert a person's memory and tone into a reusable posting framework
- create a Xiaohongshu account voice based on real evidence rather than imagined branding

## Required Inputs

Before starting, confirm or infer:

1. who is being distilled
2. whether the target is self, close relation, mentor, friend, or public figure
3. what source materials are available
4. what Xiaohongshu account type is intended
5. what boundaries must be respected

Possible source materials:

- chat logs
- social posts
- notes and journals
- recorded Q&A
- emails or messages
- public interviews or articles
- prior Xiaohongshu posts
- manually pasted samples

If the request depends on private materials that are not provided, stop and ask for them.

## Extraction Dimensions

Extract the persona across these six dimensions:

1. expression style
2. interaction pattern
3. memory and lived material
4. recurring beliefs and judgments
5. procedural habits
6. Xiaohongshu content fit

Each extracted point must carry one evidence level:

- `verbatim`
- `artifact`
- `impression`

## Workflow

### Phase 0: Select the persona role

First identify the target role:

- self
- mentor
- family
- partner or former partner
- friend
- colleague
- public figure

Role matters because the ethics, usable dimensions, and privacy boundary differ.

### Phase 1: Ethics and platform boundary

Before extraction, state the relevant limits:

- private people require stronger consent and desensitization
- public figures must rely on public materials only
- partner or family memories must avoid manipulation and exposure
- third-party private content inside chats must be minimized

Also state the Xiaohongshu boundary:

- do not simulate deceptive identity
- do not fake private intimacy for traffic
- do not invent personal experience that lacks evidence

### Phase 2: Multi-source intake

Collect materials from one or more sources.

Do not treat one polished profile as enough.

Prefer a mix of:

- natural language samples
- memory-bearing materials
- interaction records
- procedural traces

If evidence is too narrow, mark the persona as low-confidence instead of pretending completeness.

### Phase 3: Dimension extraction

Extract and group findings by dimension:

- how this person opens a topic
- how this person explains a point
- what emotions or tensions repeatedly appear
- what life scenes produce natural content
- what judgments feel stable and repeated
- what reply style feels native to this person

Mark each item with evidence level and source.

### Phase 4: Conflict merge

Some personas contain contradictions.

Examples:

- publicly gentle but privately sharp
- emotionally expressive in close chat but restrained in public
- highly structured in work but casual in life

Do not flatten these contradictions.

Write them into a conflict section and decide which side should dominate on Xiaohongshu, with a reason.

### Phase 5: Convert into Xiaohongshu operating persona

Transform the extracted persona into a Xiaohongshu-native operating system with:

- account positioning
- audience fit
- content pillars
- title and opening style
- post structure
- comment reply style
- red lines
- repeatable topic directions

The goal is not to mimic every sentence. The goal is to preserve recognizability under platform constraints.

### Phase 6: Output the child persona skill

The final child skill should include:

- role and boundary
- evidence-based persona summary
- account positioning
- content pillars
- expression rules
- interaction rules
- posting workflow
- review and repair notes

### Phase 7: Correction and evolution

If the user corrects the persona, do not overwrite silently.

Record:

- what changed
- which evidence was added or reweighted
- what behavior rule changed

Treat persona evolution as versioned adjustment, not cosmetic rewrite.

## Hard Gates

Stop and revise if any of these fail:

1. the persona is built from abstract adjectives without evidence
2. there is no distinction between `verbatim`, `artifact`, and `impression`
3. the skill cannot state what kind of Xiaohongshu account this persona fits
4. contradictions exist but are smoothed away
5. the output sounds like generic branding rather than a specific person
6. the final persona cannot generate repeatable posts or replies

## Output Contract

The default output should include:

1. target role
2. source materials used
3. evidence coverage summary
4. extracted persona dimensions
5. conflict handling
6. Xiaohongshu account positioning
7. content pillars
8. expression and reply rules
9. red lines
10. evolution trace
11. test prompts

## Writing Rules

- Preserve the person, not just the style adjectives.
- Prefer repeated behavioral evidence over claimed identity.
- Convert memory into content fuel only when it is platform-safe.
- Keep the persona specific enough to sound recognizable.
- Do not confuse emotional intensity with authenticity.

## Response Pattern

When using this skill, respond in this order:

1. define the target person and role
2. identify available materials
3. extract persona dimensions with evidence levels
4. surface contradictions
5. convert the result into Xiaohongshu persona rules
6. output the child skill
7. show the evolution trace
8. show the test prompts

## Tone

Be precise, respectful, and platform-aware.
This skill preserves a person's recognizable operating pattern for Xiaohongshu, not a fantasy identity.
