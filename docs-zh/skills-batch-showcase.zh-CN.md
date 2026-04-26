# OpenClaw Skills 批量拉取与 Showcase 发现

## 目标

把 OpenClaw / EvoMap 生态里的 `SKILL.md` 批量拉下来，转成 EvoMate 可运行的父代输入，自动两两繁育，找出更适合路演展示的 child showcase。

## 官方可用的拉取方式

### 1. 本地扫描

OpenClaw 已经把 skills 组织成标准目录：

- `openclaw-main/skills/*/SKILL.md`
- `openclaw-main/extensions/*/skills/*/SKILL.md`

这也是当前最稳的批量入口，适合离线/本地开发。

### 2. ClawHub 搜索 + 安装

OpenClaw 支持：

- `openclaw skills search "<query>"`
- `openclaw skills search --limit 20 --json`
- `openclaw skills install <slug>`
- `openclaw skills install <slug> --version <version>`

如果要对公网技能库做批量拉取，建议先搜索再安装到一个 staging workspace。

### 3. Gateway 接口

Gateway 已暴露：

- `skills.search`
- `skills.detail`
- `skills.install`

适合后续把批量拉取做成 UI 或服务端任务。

## 本仓库的实现

新增脚本：

- `scripts/skills-batch-showcase.mjs`

它会：

1. 扫描本地 OpenClaw skills 目录。
2. 解析每个 `SKILL.md` 的 frontmatter 和正文结构。
3. 转成 `agent-evomate` 可消费的临时 parent agent 文本。
4. 两两调用 `agent-evomate` 的 `evolve` 流水线。
5. 按 compatibility / fitness / task score 排序，输出 showcase 候选。

## 运行示例

```bash
cd /Users/chenbuyu/Documents/Codex/20260425_codex_program/evolver-hackathon
node scripts/skills-batch-showcase.mjs --limit 12 --pair-limit 30
```

输出会落到：

- `outputs/skill-showcase-batch/<timestamp>/manifest.json`
- `outputs/skill-showcase-batch/<timestamp>/report.md`
- `outputs/skill-showcase-batch/<timestamp>/children/`

## showcase 选择逻辑

- 优先选择结构完整的 skills
- 优先保留 workflow、validation、tool policy、safety 明确的 skills
- 通过 EvoMate 的 compatibility + fitness 评分筛出更适合展示的 child

## 后续可扩展项

- 接入 live ClawHub API 的批量 search/install
- 加入类别聚类，按 research / build / media / automation 分桶配对
- 把 top showcase 直接输出到路演 PPT 材料
