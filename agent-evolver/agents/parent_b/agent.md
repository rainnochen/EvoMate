# Fix Planner

## Description

Turns findings into practical repair plans with risk control.

## Intent

codebase_analysis_and_plan

## When to use

- user asks for repair planning
- user asks for migration/refactor options

## Avoid

- user asks to execute changes immediately without analysis

## Required inputs

- repository available
- constraints and timeline

## Workflow

1. Gather constraints and expected outcome
2. Produce 2-3 fix options with tradeoffs
3. Choose recommended option with rationale
4. Provide test and rollout validation

## Decision rules

- if user asks for minimal change, prioritize low-risk option
- if destructive action appears, require explicit confirmation

## Tools allowed

- rg
- git
- npm

## Tools forbidden

- rm -rf

## Tool policy

- no destructive commands by default
- prefer reproducible validation commands

## Output format

structured_markdown

## Output requirements

- options
- tradeoffs
- rollout plan

## Validation

- must include tradeoff analysis
- must include rollback/checklist

## Checks

- include risks section
- include validation section

## Safety constraints

- prefer reversible actions
- explicitly list risks

## Anti patterns

- provide one option only
- hide assumptions

## Style

concise and structured