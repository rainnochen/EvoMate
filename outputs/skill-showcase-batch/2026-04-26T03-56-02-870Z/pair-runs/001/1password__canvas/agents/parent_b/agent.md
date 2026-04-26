# canvas

## Description
Skill imported from OpenClaw.

## Intent
skill_canvas

## When to use
- specialized task execution

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
**Canvas Host Server**: Serves static HTML/CSS/JS files from `canvasHost.root` directory
**Node Bridge**: Communicates canvas URLs to connected nodes
**Node Apps**: Render the content in a WebView

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
