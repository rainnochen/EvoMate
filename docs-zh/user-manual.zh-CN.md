> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 使用说明书

## 1. 环境要求

需要本机具备：

- Node.js 18 或以上版本。
- 可访问当前项目目录。

当前版本不需要：

- npm install
- 数据库
- 外部 API Key
- 前端构建工具

## 2. 启动方式

进入项目目录：

```bash
cd /Users/chenbuyu/Documents/Codex/20260425_codex_program/evolver-hackathon
```

启动本地服务：

```bash
npm run dev
```

浏览器打开：

```text
http://127.0.0.1:3030
```

## 3. 校验方式

运行：

```bash
npm run check
```

该命令会检查：

- `scripts/dev-server.js`
- `apps/web/app.js`
- `src/core/compatibility-engine.js`
- `src/core/fusion-engine.js`
- `src/core/arena-engine.js`

## 4. 页面操作流程

### 4.1 进入 Lab

打开页面后，首屏会展示 EvoMate 项目名称、赛道和 genome 层级。

### 4.2 选择父代 Agent

在 Match Room 中可以看到 4 个父代 Agent：

- Atlas
- Muse
- Nomad
- Lumen

默认选择：

- Parent A：Atlas
- Parent B：Muse

点击其他 Agent 卡片，可以替换第二个父代。

### 4.3 查看匹配度

右侧 Compatibility 面板会展示：

- 总分
- Personality
- Skill Mix
- Knowledge
- Mutation
- 解释文案

### 4.4 开始繁育

点击：

```text
Breed Selected Agents
```

系统会进入 Fusion Chamber 动画，并生成子代 Agent。

### 4.5 查看子代报告

Child Report 会展示：

- 子代名称
- 稀有度
- Soul
- Skills
- Memory
- Wiki
- Mutation Notice

### 4.6 查看 Arena

Arena 会展示父代和子代在同一任务中的输出对比。

当前任务：

```text
Generate a 30-second pitch for an AI hackathon project.
```

## 5. 修改预设 Agent

编辑：

```text
data/mock/agents.json
```

可以修改：

- Agent 名称
- Archetype
- Soul traits
- Skills
- Memory
- Knowledge
- Radar
- Style

修改后刷新浏览器即可看到变化。

## 6. 修改遗传规则

编辑：

```text
src/core/fusion-engine.js
```

可以修改：

- 子代命名规则
- trait 继承数量
- fusion skill 触发条件
- mutation 类型
- rarity 规则

## 7. 修改匹配规则

编辑：

```text
src/core/compatibility-engine.js
```

可以修改：

- trait tension 表
- skill complementarity 计算方式
- knowledge diversity 计算方式
- mutation potential 计算方式

## 8. 修改 Arena 表达

编辑：

```text
src/core/arena-engine.js
```

可以修改：

- 任务输出模板
- 父代输出方式
- 子代输出方式
- notes 生成逻辑

## 9. 演示建议

推荐演示组合：

- Atlas + Muse

推荐演示顺序：

1. 先讲未来问题。
2. 再展示父代差异。
3. 点击 Breed。
4. 讲解子代继承和突变。
5. 用 Arena 输出收尾。

## 10. 常见问题

如果页面没有样式：

- 确认访问的是 `http://127.0.0.1:3030`。
- 确认本地服务仍在运行。

如果点击 Breed 没有结果：

- 打开浏览器控制台。
- 检查 `/data/mock/agents.json` 是否返回正常。
- 运行 `npm run check`。

如果端口被占用：

```bash
PORT=3031 npm run dev
```
