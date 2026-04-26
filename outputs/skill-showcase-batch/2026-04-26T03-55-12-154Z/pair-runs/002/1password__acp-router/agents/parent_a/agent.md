# 1password

## Description
Set up and use 1Password CLI for sign-in, desktop integration, and reading or injecting secrets.

## Intent
skill_1password

## When to use
- Set up and use 1Password CLI for sign-in, desktop integration, and reading or injecting secrets.

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
Check OS + shell.
Verify CLI present: `op --version`.
Confirm desktop app integration is enabled (per get-started) and the app is unlocked.
REQUIRED: create a fresh tmux session for all `op` commands (no direct `op` calls outside tmux).
Sign in / authorize inside tmux: `op signin` (expect app prompt).
Verify access inside tmux: `op whoami` (must succeed before any secret read).
If multiple accounts: use `--account` or `OP_ACCOUNT`.

## Decision rules
- prefer safe defaults

## Tools allowed
- local-binary

## Tools forbidden
- destructive commands

## Tool policy
- keep commands auditable

## Output format
structured_markdown

## Output requirements
- summary

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

## Anti patterns
- skip repo discovery

## Style
concise and direct
