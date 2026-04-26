# parent_a Hybrid

## Description
Child from parent_a + parent_b Mutated and hardened for child-level reliability.

## Intent
skill_cloud

## When to use
- Manages Cloud Run services, jobs, and worker pools. Use when you need to deploy applications responding to HTTP requests (services), run event-triggered or scheduled tasks (jobs), or handle always-on pull-based background processing (worker pools).
- Generates security-focused guidance for Google Cloud workloads based on the design principles and recommendations in the Google Cloud Well-Architected Framework (WAF). Use this skill to evaluate a workload, identify security requirements, and provide actionable recommendations for IAM, network security, data protection, and operational security.

## Avoid
- task is unrelated

## Required inputs
- context

## Workflow
1. Discover relevant files, symbols, and execution entry points
2. # Cloud Run Basics Cloud Run is a fully managed application platform for running your code, function, or container on top of Google's highly scalable infrastructure.
3. Propose 2-3 implementation options with tradeoffs and recommendation
4. Define verification checks and rollback safeguards before execution
5. Report final plan with risks, assumptions, and next steps

## Decision rules
- when prefer safe defaults, apply_policy
- if repo is large, prefer_search_before_full_read
- if git worktree is dirty, avoid_destructive_commands

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
- options
- risks
- validation

## Validation
- must include verification steps

## Checks
- include risks

## Safety constraints
- do not run destructive commands
- state assumptions explicitly

## Anti patterns
- skip repo discovery

## Style
verbosity: low; interaction: direct
