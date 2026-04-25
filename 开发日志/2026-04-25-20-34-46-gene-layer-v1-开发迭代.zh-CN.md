> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# 2026-04-25 20:34:20：Gene Layer V1 开发迭代

## 本次目标

基于前一轮《Evolver Gene 压缩规则与 EvoMate 开发方案》，把 EvoMate 从概念方案推进到一个可运行的新开发版本。

核心目标：

- 让 EvoMate 的 Agent Genome 从四层升级为五层。
- 将 Evolver 的 Gene 压缩思想落成 MVP 代码。
- 让子代 Agent 不只是继承人格和技能，也继承可测试的策略协议。
- 保留 hackathon Demo 的稳定性，不引入复杂依赖。

## 主要开发内容

### 1. 新增 Gene Fusion Engine

新增文件：

```text
src/core/gene-fusion-engine.js
```

实现内容：

- 选择父代 strongest Gene。
- 合并 `signals_match`。
- 合并 `strategy`。
- 合并 `constraints`。
- 继承并过滤安全 validation。
- 生成子代 `gene_child_*_strategy_dna`。
- 输出 `geneReport`、`fitnessTests`、`geneFusionLog`。

这一步让 EvoMate 的“遗传”从视觉叙事推进到了协议层。

### 2. 接入 Fusion Engine

修改文件：

```text
src/core/fusion-engine.js
```

改动：

- 在 `fuseGenomes()` 中调用 `fuseStrategyGenes()`。
- 子代新增 `genes`、`inheritedGenes`、`geneReport`、`fitnessTests`。
- Fusion Log 新增 Gene 继承、信号压缩、fitness test 和 mutation 状态。

### 3. 新增 Evolver Adapter

新增文件：

```text
src/integrations/evolver/asset-to-genome.js
```

用途：

- 为后续接入 `evolver-main/assets/gep/genes.json` 留出 adapter 入口。
- 将 Evolver Gene / Capsule 结构映射到 EvoMate `AgentGenome.genes`。

当前状态是最小可用版本，还没有接真实数据流。

### 4. 父代 Agent 数据升级

修改文件：

```text
data/mock/agents.json
```

新增 4 个父代 Strategy Gene：

- Atlas：`gene_gep_repair_from_errors`
- Muse：`gene_pitch_story_compression`
- Nomad：`gene_weak_signal_discovery`
- Lumen：`gene_clarify_before_action`

每个 Gene 都包含 signal、strategy、constraints、validation、avoid 和 evidence。

### 5. 前端体验升级

修改文件：

```text
apps/web/index.html
apps/web/app.js
apps/web/styles.css
```

新增展示：

- Lab Entrance 增加 `Gene` 作为第五层 Genome。
- 父代卡片展示 Strategy Genes。
- Child Report 增加 Gene 区块。
- Child Report 增加 Gene Report 指标。
- Arena 输出展示父代与子代 Gene 信息。

## 验证结果

已更新 `package.json` 的 `npm run check`，纳入新增文件：

```text
src/core/gene-fusion-engine.js
src/integrations/evolver/asset-to-genome.js
```

验证命令：

```bash
npm run check
```

验证状态：

```text
已通过。
```

补充验证：

```bash
node -e "const fs=require('fs'); for (const f of ['data/mock/agents.json','module-manifest.json','package.json']) JSON.parse(fs.readFileSync(f,'utf8')); console.log('json ok')"
```

结果：

```text
json ok
```

同时用 Node 直接调用 `calculateCompatibility()` 和 `fuseGenomes()` 验证 Atlas + Muse 可以生成子代 `Astra`，并生成 `gene_child_atlas_muse_strategy_dna` 与 `npm run check` fitness test。

本地 Demo 服务验证：

```bash
npm run dev
curl -I http://127.0.0.1:3030
```

结果：

```text
HTTP/1.1 200 OK
```

备注：在默认沙箱内启动本地监听端口时遇到 `EPERM: operation not permitted 127.0.0.1:3030`，已通过用户授权的开发服务器命令重新启动并完成 smoke test。

## 设计取舍

### 为什么先做规则系统

Hackathon 当前最重要的是稳定演示和讲清楚概念，所以本次没有引入复杂模型调用或外部依赖。

Gene Fusion 先用规则实现，可以做到：

- 行为稳定。
- 易解释。
- 易调试。
- 适合路演讲述。

### 为什么 validation 只展示不执行

浏览器 Demo 不适合直接执行命令。

因此本版本把 `validation` 作为 Agent Gene 的协议字段和 fitness test 展示，让评委理解“子代携带可验证行动协议”。

后续可以由 Node 后端或 sandbox runner 真正执行。

## 后续行动

- 把真实 Evolver Gene asset 接入 `asset-to-genome.js`。
- 增加 Gene schema 校验。
- 在 Fusion Chamber 中加入 Gene 粒子动画。
- 在 Arena 中加入 fitness test pass / fail 状态。
- 设计 Gene 显隐性、突变率和多代谱系。

## 当前一句话总结

EvoMate 现在不再只是 Agent 数字遗传实验室的视觉 Demo，而是开始具备“可遗传策略协议”的核心骨架。
