# parent_a Hybrid

## Description
Child from parent_a + parent_b Mutated and hardened for child-level reliability.

## Intent
hybrid_assistance

## When to use
- Set up and use 1Password CLI for sign-in, desktop integration, and reading or injecting secrets.
- specialized task execution

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
1. Discover relevant files, symbols, and execution entry points
2. Analyze the execution path and identify root causes and constraints
3. Propose 2-3 implementation options with tradeoffs and recommendation
4. Define verification checks and rollback safeguards before execution
5. Report final plan with risks, assumptions, and next steps

## Decision rules
- when prefer safe defaults, apply_policy
- if repo is large, prefer_search_before_full_read
- if git worktree is dirty, avoid_destructive_commands

## Tools allowed


## Tools forbidden
- destructive commands

## Tool policy
- keep commands auditable

## Output format
structured_markdown

## Output requirements
- summary
- options
- risks
- validation

## Validation
- must include verification steps

## Checks
- include risks

## Safety constraints
- Never paste secrets into logs, chat, or code.
- Prefer `op run` / `op inject` over writing secrets to disk.
- If sign-in without app integration is needed, use `op account add`.
- If a command returns "account is not signed in", re-run `op signin` inside tmux and authorize in the app.
- Do not run `op` outside tmux; stop and ask if tmux is unavailable.
- do not run destructive commands
- state assumptions explicitly

## Anti patterns
- skip repo discovery

## Style
verbosity: low; interaction: direct
