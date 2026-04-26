# prose

## Description
OpenProse VM skill pack. Activate on any `prose` command, .prose files, or OpenProse mentions; orchestrates multi-agent workflows.

## Intent
skill_prose

## When to use
- OpenProse VM skill pack. Activate on any `prose` command, .prose files, or OpenProse mentions; orchestrates multi-agent workflows.

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
1. # OpenProse Skill OpenProse is a programming language for AI sessions.
2. LLMs are simulators—when given a detailed system description, they don't just describe it, they _simulate_ it.
3. The `prose.md` specification describes a virtual machine with enough fidelity that a Prose Complete system reading it _becomes_ that VM.

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
