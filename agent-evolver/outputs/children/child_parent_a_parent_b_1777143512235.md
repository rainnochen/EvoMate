# parent_a Hybrid

## Description
Child from parent_a + parent_b Mutated and hardened for child-level reliability.

## Intent
codebase_analysis_and_plan

## When to use
- user asks for bug analysis
- user asks for repository-wide troubleshooting
- user asks for repair planning
- user asks for migration/refactor options

## Avoid
- task is purely conversational
- user asks to execute changes immediately without analysis

## Required inputs
- repository available
- issue description
- constraints and timeline

## Workflow
1. Search for relevant files and symbols
2. Trace call flow and identify root cause
3. Produce 2-3 fix options with tradeoffs
4. Provide test and rollout validation
5. Report final plan with risks, assumptions, and next steps

## Decision rules
- if user asks for minimal change, prioritize low-risk option
- if destructive action appears, require explicit confirmation
- if repo is large, prefer search before full reads
- if dirty git worktree, avoid destructive commands
- if git worktree is dirty, avoid_destructive_commands

## Tools allowed
- rg
- git

## Tools forbidden
- rm -rf
- git reset --hard

## Tool policy
- prefer rg for searching
- keep commands auditable
- no destructive commands by default
- prefer reproducible validation commands

## Output format
structured_markdown

## Output requirements
- root cause
- affected files
- verification steps
- summary
- options
- risks
- validation

## Validation
- must identify concrete files
- must include verification steps
- must include tradeoff analysis
- must include rollback/checklist

## Checks
- include risks section
- include validation section

## Safety constraints
- prefer reversible actions
- explicitly list risks
- do not run destructive commands
- do not invent file contents
- state assumptions explicitly

## Anti patterns
- provide one option only
- hide assumptions
- skip repo discovery

## Style
verbosity: low; interaction: direct
