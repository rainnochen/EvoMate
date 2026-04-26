# 2026-04-26 OpenClaw Skills 批量拉取与 Showcase 搜索

## 本次目标

把 OpenClaw / EvoMap 生态里的 `SKILL.md` 批量拉下来，自动转成 EvoMate 的 parent 输入，两两运行 `agent-evomate` 的繁育流水线，寻找新的 showcase 组合。

## 我们确认到的 OpenClaw 能力

- `openclaw skills search`
- `openclaw skills detail`
- `openclaw skills install`
- Gateway 侧 `skills.search`
- Gateway 侧 `skills.detail`
- Gateway 侧 `skills.install`
- 本地 skills 目录：
  - `openclaw-main/skills/*/SKILL.md`
  - `openclaw-main/extensions/*/skills/*/SKILL.md`

## 本次实现

新增脚本：

- `scripts/skills-batch-showcase.mjs`

能力包括：

1. 扫描 OpenClaw skills 目录。
2. 解析 `SKILL.md` 的 frontmatter 和正文结构。
3. 生成临时 parent agent markdown。
4. 调用 `agent-evomate` 的繁育链路。
5. 对兼容 / 不兼容的 pair 都能跑：
   - 兼容时走原生 `evolve`
   - 不兼容时走探索式 crossover + repair + eval
6. 汇总出 showcase ranking report。

同时补了说明文档：

- `docs-zh/skills-batch-showcase.zh-CN.md`

## 验证结果

小样本验证成功：

```bash
node scripts/skills-batch-showcase.mjs --limit 4 --pair-limit 3
```

结果写入：

- `outputs/skill-showcase-batch/<timestamp>/manifest.json`
- `outputs/skill-showcase-batch/<timestamp>/report.md`
- `outputs/skill-showcase-batch/<timestamp>/children/`

发现的本地 skills 数量：

- `66`

样例结果里已经能跑出多个 child showcase 候选。

## 后续建议

- 接 `--mode clawhub`，直接从 ClawHub search/install 批量拉技能
- 给 skills 加分类聚类，分成 research / build / media / automation / ops
- 把 top showcase 自动转成路演 demo case
