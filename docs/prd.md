> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate PRD

## Product Basics

Project name: `EvoMate`

Project type: `Hackathon MVP / Agent Evolution Sandbox`

Recommended track: `Red Pill / Build For Future`

One-line intro:

EvoMate is an EvoMap-based Agent digital genetics lab where two agents fuse DNA to generate a child agent, visualizing inheritance, recombination, mutation, and expression across personality, memory, skills, and knowledge.

## Background

Most agents are still assembled by manually writing prompts, wiring tools, arranging workflows, and managing memory. This creates four problems:

- capability composition depends heavily on individual experience
- the formation process of an agent is hard to observe or explain
- multi-agent systems usually stop at communication and lack cross-generation evolution
- it is hard to explore whether a better task-specific agent can emerge through evolution

EvoMate proposes a different mental model: treat an agent's core capability as inheritable digital DNA.

## Vision

EvoMate is not only a playful breeding demo. It is a future-facing experiment platform for agent evolution.

The long-term vision is that companies do not manually assemble the best agent. They breed, evaluate, and select agents that fit business goals.

## Hackathon Goal

In 48 hours, complete a stable demo loop:

- show two parent genome profiles
- support parent selection and breed triggering
- show compatibility and mutation potential
- run a fusion animation
- generate one child agent
- output an inheritance and mutation report
- compare parent and child expression in a lightweight arena

## Core Genome Layers

### Soul

Personality, behavior tendency, and expression style.

Examples:

- rational
- calm
- rebellious
- warm
- exploratory
- humorous

### Skills

Agent capability boundaries and callable strengths.

Examples:

- coding
- retrieval
- planning
- summarization
- debate
- creative generation
- tool use

### Memory

Long-term experiences and behavioral imprints.

Examples:

- success summaries
- failure summaries
- preferences
- highlight behavior fragments

### Knowledge

Knowledge packs or domain capsules.

Examples:

- AI systems
- coding
- startup and product
- event planning

## MVP Pages

### Lab Entrance

Purpose:

- establish the lab world
- let users enter the experiment quickly

### Match Room

Purpose:

- browse two parent cards
- compare radar charts, traits, skills, memory, and knowledge
- show compatibility metrics

### Fusion Chamber

Purpose:

- visualize genome flow
- show inheritance, recombination, mutation, and stabilization stages

### Child Report

Purpose:

- reveal child agent
- show inherited traits, skills, memory fragments, knowledge capsules, mutation notices, and rarity

### Arena

Purpose:

- compare parent and child outputs on one task
- prove the child is more than a visual reskin

## Explicit Non-goals

- no complex autonomous agent framework
- no large-scale memory infrastructure
- no full knowledge-base product
- no open multiplayer interaction
- no production-grade breeding algorithm
