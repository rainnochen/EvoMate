# parent_a Hybrid

## Description
Child from parent_a + parent_b Mutated and hardened for child-level reliability.

## Intent
hybrid_assistance

## When to use
- Set up and use 1Password CLI for sign-in, desktop integration, and reading or injecting secrets.
- Route plain-language requests for Pi, Claude Code, Cursor, Copilot, OpenClaw ACP, OpenCode, Gemini CLI, Qwen, Kiro, Kimi, iFlow, Factory Droid, Kilocode, or explicit ACP harness work into either OpenClaw ACP runtime sessions or direct acpx-driven sessions ("telephone game" flow). For coding-agent thread requests, read this skill first, then use only `sessions_spawn` for thread creation. Codex chat binding defaults to the native Codex app-server plugin unless ACP is explicit or background spawn needs ACP.

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
1. Discover relevant files, symbols, and execution entry points
2. # ACP Harness Router When user intent is "run this in Pi/Claude Code/Cursor/Copilot/OpenClaw/OpenCode/Gemini/Qwen/Kiro/Kimi/iFlow/Droid/Kilocode (ACP harness)", do not use subagent runtime or PTY scraping.
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
