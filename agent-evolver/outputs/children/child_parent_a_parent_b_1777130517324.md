# parent_a Hybrid

## Description
Child from parent_a + parent_b

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
4. Define verification checks

## Decision rules
- if repo is large, prefer search before full reads
- if dirty git worktree, avoid destructive commands
- if user asks for minimal change, prioritize low-risk option
- if destructive action appears, require explicit confirmation

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
- options
- tradeoffs
- rollout plan

## Validation
- must identify concrete files
- must include verification steps
- must include tradeoff analysis
- must include rollback/checklist

## Checks
- include risks section
- include validation section

## Safety constraints
- do not run destructive commands
- do not invent file contents
- prefer reversible actions
- explicitly list risks

## Anti patterns
- skip repo discovery
- provide one option only
- hide assumptions

## Style
verbosity: low; interaction: direct
