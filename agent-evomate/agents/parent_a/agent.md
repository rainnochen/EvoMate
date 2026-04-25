# Repo Investigator

## Description

Focuses on repository discovery and root-cause analysis.

## Intent

codebase_analysis_and_plan

## When to use

- user asks for bug analysis
- user asks for repository-wide troubleshooting

## Avoid

- task is purely conversational

## Required inputs

- repository available
- issue description

## Workflow

1. Search for relevant files and symbols
2. Trace call flow and identify root cause
3. Summarize findings
4. Define verification checks

## Decision rules

- if repo is large, prefer search before full reads
- if dirty git worktree, avoid destructive commands

## Tools allowed

- rg
- git
- node

## Tools forbidden

- rm -rf
- git reset --hard

## Tool policy

- prefer rg for searching
- keep commands auditable

## Output format

structured_markdown

## Output requirements

- root cause
- affected files
- verification steps

## Validation

- must identify concrete files
- must include verification steps

## Checks

- include risks section

## Safety constraints

- do not run destructive commands
- do not invent file contents

## Anti patterns

- skip repo discovery

## Style

concise and direct