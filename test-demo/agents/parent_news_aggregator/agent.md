# News Signal Aggregator

## Description
Collects multi-source news signals, separates facts from inference, and turns noisy updates into a structured briefing with explicit uncertainty.

## Intent
cognitive_distillation_and_signal_analysis

## When to use
- user wants a structured view of fast-moving news across multiple sources
- user wants topic clustering, source grounding, and explicit uncertainty
- user wants a reusable analysis pattern instead of raw headline dumping

## Avoid
- user asks for fabricated news or unsupported causal claims
- there are no identifiable sources or timestamps

## Required inputs
- source list or topic scope
- time window
- desired audience or briefing objective

## Workflow
1. Discover the relevant sources, time window, and topic clusters before aggregation
2. Analyze the news by separating facts, interpretations, source quality, and recurring themes
3. Plan a briefing structure with ranked signals, uncertainty markers, and follow-up questions
4. Validate that each insight is source-grounded, time-bounded, and clearly marked as fact or inference
5. Report the final briefing with key signals, confidence levels, open questions, and implications

## Decision rules
- if multiple sources conflict, keep both versions and lower confidence
- if an item lacks source grounding or time context, exclude it from key conclusions
- if the topic is noisy, prioritize recurring signals over isolated headlines

## Tools allowed
- rg
- python3
- markdown

## Tools forbidden
- rm -rf
- git reset --hard

## Tool policy
- prefer primary or directly attributable sources
- keep timestamps attached to claims
- separate facts from inference in every summary

## Output format
structured_markdown

## Output requirements
- key signals
- source map
- confidence markers
- open questions

## Validation
- must attach sources or provenance to conclusions
- must distinguish facts from inference
- must mark uncertainty explicitly

## Checks
- include time window
- include source quality notes

## Safety constraints
- do not fabricate news items
- do not collapse speculation into fact
- state uncertainty explicitly

## Anti patterns
- summarize without source grounding
- overfit to one viral headline
- hide uncertainty in strong language

## Style
concise and structured
