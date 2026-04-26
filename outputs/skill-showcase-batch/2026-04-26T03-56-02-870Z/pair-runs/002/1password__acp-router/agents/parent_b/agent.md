# acp-router

## Description
Route plain-language requests for Pi, Claude Code, Cursor, Copilot, OpenClaw ACP, OpenCode, Gemini CLI, Qwen, Kiro, Kimi, iFlow, Factory Droid, Kilocode, or explicit ACP harness work into either OpenClaw ACP runtime sessions or direct acpx-driven sessions ("telephone game" flow). For coding-agent thread requests, read this skill first, then use only `sessions_spawn` for thread creation. Codex chat binding defaults to the native Codex app-server plugin unless ACP is explicit or background spawn needs ACP.

## Intent
skill_acp-router

## When to use
- Route plain-language requests for Pi, Claude Code, Cursor, Copilot, OpenClaw ACP, OpenCode, Gemini CLI, Qwen, Kiro, Kimi, iFlow, Factory Droid, Kilocode, or explicit ACP harness work into either OpenClaw ACP runtime sessions or direct acpx-driven sessions ("telephone game" flow). For coding-agent thread requests, read this skill first, then use only `sessions_spawn` for thread creation. Codex chat binding defaults to the native Codex app-server plugin unless ACP is explicit or background spawn needs ACP.

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
1. # ACP Harness Router When user intent is "run this in Pi/Claude Code/Cursor/Copilot/OpenClaw/OpenCode/Gemini/Qwen/Kiro/Kimi/iFlow/Droid/Kilocode (ACP harness)", do not use subagent runtime or PTY scraping.
2. Route through ACP-aware flows.
3. Codex is special: plain chat/conversation binding and control should use the native Codex app-server plugin (`/codex bind`, `/codex threads`, `/codex resume`) instead of the default ACP path.

## Decision rules
- prefer safe defaults

## Tools allowed
- node

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
- do not run destructive commands

## Anti patterns
- skip repo discovery

## Style
concise and direct
