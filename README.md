# EvoMate 🧬

> **Agent Skill Breeding Engine** — 让 Agent 的能力可以被继承、重组和持续进化。

[English](#english-overview) | [中文文档](#中文文档)

---

## English Overview

**EvoMate** is an Agent Skill Breeding Engine. It takes two parent agents, extracts their structured genetic "DNA" (called `agentGene`), and produces a stronger child agent through a deterministic, traceable pipeline.

Unlike asking an LLM to "merge two agent prompts", EvoMate makes the process **engineered, auditable, and reproducible**. Every capability inheritance, every conflict resolution, every mutation is recorded and scored.

### Core Pipeline

```text
Parse → Compatibility Check → Role-aligned Crossover → Mutation Repair → Evaluate → Record
```

### What Gets Produced

Every evolution run outputs:
- `child.md` — The final agent document
- `child.gene.json` — Structured genetic data
- `child.lineage.json` — Inheritance trace (who gave what)
- `child.eval.json` — Quality & fitness score
- `child.mutations.json` — Repair log

### Quick Start

```bash
# Install dependencies
npm install

# Run the evolution pipeline on two parent agents
node agent-evomate/src/pipeline/evolve.js

# Batch breed from OpenClaw skills ecosystem
node scripts/skills-batch-showcase.mjs --limit 4 --pair-limit 3
```

---

## 中文文档

EvoMate 是一个 **Agent 技能育种引擎**。

它解决的问题是：当你想把两个 Agent 的能力合并时，直接让大模型融合两份文档是"黑盒生成"——失败了不知道为什么，成功了也没办法稳定复现。

EvoMate 把这个过程拆开，变成可追溯的工程系统。

### 核心判断

> Agent.md 是给人看的成品，`agentGene` 才是给系统重组的遗传核心。

### 工作原理

```text
1. 解析 (Parse)       — 把两个父代 Agent 文档解析为结构化基因 agentGene
2. 兼容检查 (Check)   — 检测父代意图、工作流兼容性
3. 角色重组 (Crossover)— 按 discover/analyze/plan/validate 等角色对齐择优继承
4. 变异修补 (Mutation) — 修复重组后的逻辑断层和工具冲突
5. 双重评估 (Evaluate) — 静态评估 + 任务模拟评估，计算 fitness 分数
6. 血缘记录 (Record)   — 保存完整的进化档案
```

### agentGene 协议 (9 个基因位点)

| 位点 | 说明 | 重组策略 |
|---|---|---|
| `identity_gene` | 身份与核心意图 | 重新总结 |
| `trigger_gene` | 触发条件与输入要求 | 合并去重 |
| `workflow_gene` | 工作流步骤序列 | 角色对齐择优 |
| `decision_gene` | 执行决策规则 | 保守合并 |
| `tool_gene` | 工具权限边界 | 取交集（只收紧）|
| `output_gene` | 输出格式约束 | 选更明确的 |
| `validation_gene` | 自检准则 | 合并去重 |
| `safety_gene` | 安全约束 | 取并集（宁多勿少）|
| `style_gene` | 风格语气 | 轻量归一 |

---

## 目录结构

```text
evolver-hackathon/
├── agent-evomate/          # 核心育种引擎库
│   ├── src/
│   │   ├── parser/         # Agent → agentGene 解析器
│   │   ├── gene/           # agentGene Schema 定义
│   │   ├── crossover/      # 重组引擎 (Role-aligned)
│   │   ├── mutation/       # 变异与修补算子
│   │   ├── evaluate/       # 静态评估 + 任务评估
│   │   ├── lineage/        # 血缘记录
│   │   ├── render/         # 基因 → Agent 文档渲染
│   │   ├── store/          # 产出物存储
│   │   └── pipeline/       # evolve.js 主流水线入口
│   ├── agents/             # 示例父代 Agent 文档
│   ├── docs/               # 模块设计文档
│   └── outputs/            # 每次进化的产出物
│
├── scripts/
│   └── skills-batch-showcase.mjs   # 批量扫描技能并自动配对繁育
│
├── skill/
│   └── SKILL.md            # EvoMate 作为 OpenClaw Skill 的定义
│
├── test-demo/              # 快速体验用的预置 Demo
│   ├── agents/             # 示例父代
│   ├── skills/             # 示例子代技能
│   └── outputs/            # Demo 运行输出
│
├── docs-zh/                # 中文技术文档集合
├── docs/                   # 英文技术文档
└── 开发日志/               # 开发过程记录
```

---

## 快速开始

### 运行单次进化

```bash
cd evolver-hackathon
npm install
node agent-evomate/src/pipeline/evolve.js
```

输出写入 `agent-evomate/outputs/` 下对应的子目录。

### 批量技能繁育 (接入 OpenClaw 生态)

扫描 OpenClaw 技能库中的所有 `SKILL.md`，自动两两配对运行繁育流水线：

```bash
node scripts/skills-batch-showcase.mjs --limit 4 --pair-limit 3
```

结果写入：

```text
outputs/skill-showcase-batch/<timestamp>/
├── manifest.json     # 所有运行记录
├── report.md         # Showcase 排名报告
└── children/         # 每个子代的产出文档
```

---

## 文档索引

### 核心设计文档
- [agentGene 系统设计方案](./agent-evomate/docs/方案.md) — 完整的基因协议与重组算法设计
- [模块架构说明 (design.md)](./agent-evomate/docs/design.md) — 模块入口与运行说明

### 中文文档集 (docs-zh/)
- [项目总览](./docs-zh/project-overview.zh-CN.md)
- [当前完整项目说明书](./docs-zh/project-handbook-current.zh-CN.md)
- [当前主 PRD (v0.5)](./docs-zh/prd-current.zh-CN.md)
- [技术架构说明](./docs-zh/architecture.zh-CN.md)
- [Genome Schema 设计](./docs-zh/genome-schema.zh-CN.md)
- [OpenClaw × EvoMate 集成 PRD](./docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
- [批量技能 Showcase 说明](./docs-zh/skills-batch-showcase.zh-CN.md)
- [使用说明书](./docs-zh/user-manual.zh-CN.md)
- [全部中文文档索引](./docs-zh/README.zh-CN.md)



---

## 技术要求

- Node.js 18+
- 无需数据库，无需外部 API

---

## License

MIT
