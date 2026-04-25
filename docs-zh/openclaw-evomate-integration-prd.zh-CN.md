# OpenClaw × EvoMate 架构梳理与融合 PRD

## 1. 文档目的

本文档用于把本地 `openclaw-main` 的核心代码实现逻辑、系统架构和 EvoMate 的 Agent 数字遗传产品方向进行对齐，形成 hackathon 后续开发可直接使用的产品与技术 PRD。

结论先行：

EvoMate 最适合基于 OpenClaw 发展成一个“Agent Genome Lab / 多智能体遗传实验室”。OpenClaw 提供真实的 Agent 运行时、Gateway、多 Agent 隔离、Skills、Sessions、Memory、Channels、Nodes、Canvas/A2UI 和 Sandbox；EvoMate 则把这些底层运行资产抽象为可视化的 Agent DNA，并提供繁育、突变、评估和家谱化的产品体验。

## 2. OpenClaw 整体定位

OpenClaw 不是单一聊天机器人，而是一个 local-first 的多通道 AI Gateway。

它的核心定位可以拆成五句话：

- 一个长期运行的本地 Gateway，负责连接所有消息入口、客户端、设备节点和 Agent 运行时。
- 一个多 Agent 宿主系统，每个 Agent 有独立 workspace、状态目录、会话、技能和配置。
- 一个插件化能力平台，通过 extensions、plugin runtime、provider runtime、skills 扩展模型、通道、工具和媒体能力。
- 一个多通道消息路由系统，把 WhatsApp、Telegram、Slack、Discord、iMessage、Web、Cron、Webhook 等入口统一路由给 Agent。
- 一个面向真实设备和本地环境的执行层，通过 Node、Canvas、A2UI、Sandbox、browser、voice、media 等能力让 Agent 接触真实世界。

对 EvoMate 来说，OpenClaw 最有价值的地方不是“又一个 Agent 框架”，而是它已经把 Agent 的“生命体征”沉淀成了可读取、可组合、可隔离、可运行的结构。

## 3. 代码仓库结构总览

本地 `openclaw-main` 的主要目录职责如下：

| 目录 | 作用 | 对 EvoMate 的价值 |
| --- | --- | --- |
| `src/gateway` | Gateway 服务、WebSocket 协议、HTTP 服务、请求分发、事件广播 | EvoMate 可作为 Gateway 控制台或实验室入口 |
| `src/agents` | Agent runtime、workspace、sandbox、skills、tools、CLI runner | 父代/子代 Agent 的真实运行基础 |
| `src/channels` | 多消息通道注册、插件通道、传输层 | 可以把渠道行为转成 Agent 的社交/沟通基因 |
| `src/plugins` | 插件运行时、能力注入、插件合约 | EvoMate 可做成 OpenClaw 插件 |
| `src/plugin-sdk` 与 `packages/plugin-sdk` | 插件 SDK、公有运行时类型、provider 接口 | 后续开发 OpenClaw 原生 EvoMate plugin 的入口 |
| `src/sessions` | 会话 ID、生命周期、transcript 事件、发送策略 | Memory DNA 和 Arena 对比的来源 |
| `src/memory` 与 `packages/memory-host-sdk` | Memory 引擎、QMD、embedding、storage、query runtime | Agent 记忆层和遗传摘要来源 |
| `src/tasks` | detached task、taskflow、任务注册、状态 | 可以支持多轮进化实验和批量评估 |
| `src/cron` | 定时任务、isolated agent 执行 | 可用于持续进化、每日繁育、自动筛选 |
| `src/node-host` | 设备节点宿主能力 | 让 Agent 拥有“感官基因” |
| `src/canvas-host` | Canvas 和 A2UI 宿主 | 适合 EvoMate 可视化 Fusion Chamber |
| `src/security` | 审计、沙箱、危险工具检测、通道安全 | 繁育实验的安全边界 |
| `src/routing` 与 `src/bindings` | 消息路由、Agent 绑定规则 | 决定哪个 Agent 在哪个渠道/用户/群组表达 |
| `src/cli` 与 `src/commands` | CLI 命令、daemon、gateway、agent、sessions、skills 等 | MVP 可先通过 CLI/本地读取接入 |
| `src/tui` 与 `src/web` | 终端 UI、Web 控制面能力 | 可复用控制台体验 |
| `extensions` | 官方插件集合，覆盖 channel/provider/tool/memory/voice/search 等 | Skills 与 Tools DNA 的天然来源 |
| `skills` | 内置 AgentSkills 目录，每个技能有 `SKILL.md` | Skills 基因库 |
| `apps` | Android、iOS、macOS、shared 应用 | Node/设备端能力和演示入口 |
| `docs` | 架构、协议、概念、安装、插件、通道文档 | 本文梳理的主要依据 |

## 4. 启动链路实现逻辑

OpenClaw 的入口从 `openclaw.mjs` 开始。

启动逻辑可以理解为：

1. 检查 Node.js 版本，要求 `>= 22.12`。
2. 启用 Node compile cache，降低后续启动成本。
3. 对根命令 help 做快速路径优化，避免加载完整 CLI。
4. 优先加载 `dist/entry.js`，如果不存在则尝试 `dist/entry.mjs`。
5. 如果源码树未构建，直接提示需要先构建。

`src/entry.ts` 是真正的 CLI 入口层，主要负责：

- 设置 process title 和运行标记。
- 过滤或格式化 warning。
- 标准化环境变量和 Windows argv。
- 解析 container/profile 参数，并应用 profile 环境。
- 处理 `--no-color`、version、help 等快速路径。
- 根据配置决定是否 respawn 到容器或 profile 环境。
- 最后加载 `./cli/run-main.js`，进入实际命令分发。

这说明 OpenClaw 的工程设计不是“脚本集合”，而是一个有 CLI、daemon、profile、container、gateway 生命周期意识的长期运行系统。

## 5. Gateway 架构与协议

OpenClaw 的中心是 Gateway。

Gateway 默认监听本机 `127.0.0.1:18789`，通过 WebSocket 连接不同角色：

- `operator`：控制面客户端，例如 macOS app、CLI、Web UI、自动化脚本。
- `node`：设备节点，例如手机、桌面节点、语音节点、摄像头节点。

Gateway 的核心职责：

- 维护唯一长期运行服务实例。
- 统一管理 Agent runtime、Channel runtime、Plugin runtime、Node runtime。
- 接收控制面请求并做权限校验。
- 广播 agent、chat、presence、health、heartbeat、cron 等事件。
- 对外提供 Canvas/A2UI 静态资源与 HTTP 能力。
- 管理设备配对、shared secret、signed challenge、角色与 scope。

Gateway wire protocol 的基本帧结构：

```json
{ "type": "req", "id": "1", "method": "method.name", "params": {} }
```

```json
{ "type": "res", "id": "1", "ok": true, "payload": {} }
```

```json
{ "type": "event", "event": "chat.message", "payload": {}, "seq": 12 }
```

协议层的一个关键点是：事件默认不 replay。因此 EvoMate 如果要用实时事件驱动可视化，需要自行保存实验快照或从 OpenClaw session store 读取历史。

## 6. Gateway 请求分发逻辑

`src/gateway/server.impl.ts` 是 Gateway 启动编排核心。

它把大量子系统组装起来：

- config 加载与 runtime config。
- plugin runtime。
- channel manager。
- model catalog。
- cron runtime。
- node session runtime。
- canvas host。
- pairing。
- auth。
- health。
- tailscale。
- control UI。
- startup sidecars。

`src/gateway/server-methods.ts` 是请求分发表。

它聚合大量 handler family，例如：

- connect / health / logs。
- channels / chat / send。
- commands / tools / skills。
- cron / tasks。
- devices / nodes / node-pending。
- models / config / wizard。
- sessions / agent / agents。
- web / tts / talk / voicewake。
- system / update / diagnostics / doctor。

请求处理流程大致是：

1. 收到 WebSocket request。
2. 根据 role 和 scope 做权限校验。
3. 对 startup 中不可用的方法做保护。
4. 对控制面写请求做 rate limit。
5. 注入 plugin runtime request scope。
6. 分发到对应 handler。
7. 返回 response 或抛出结构化错误。

对 EvoMate 来说，这意味着后续如果做成 OpenClaw 原生实验室，最好不要绕过 Gateway，而是把“读取 genome、创建 child agent、运行 arena、保存 lineage”设计为 Gateway 方法或插件方法。

## 7. Agent Runtime 实现逻辑

OpenClaw 的 Agent 是一个可运行实体，不只是 prompt。

一个 Agent 通常包含：

- workspace。
- agentDir。
- session store。
- bootstrap files。
- skills 配置。
- tools 配置。
- auth profile。
- model/provider 配置。
- memory 配置。
- sandbox 配置。

关键 bootstrap 文件包括：

- `AGENTS.md`：主行为说明与工作方式。
- `SOUL.md`：人格、身份、语气和长期倾向。
- `TOOLS.md`：可用工具和工具使用策略。
- `BOOTSTRAP.md`：启动上下文。
- `IDENTITY.md`：身份设定。
- `USER.md`：用户偏好与个人上下文。

EvoMate 可以直接把这些文件映射为 DNA：

| EvoMate DNA 层 | OpenClaw 来源 |
| --- | --- |
| Soul | `SOUL.md`、`IDENTITY.md`、system prompt、assistant identity |
| Skills | `skills/*/SKILL.md`、agent skills allowlist、tools config |
| Memory | sessions JSONL、memory QMD、active memory、summary |
| Wiki / Knowledge | memory-wiki、docs、workspace knowledge、project files |
| Behavior | routing bindings、send policy、reply style、channel traces |
| Senses | node caps、camera、screen、location、voice、media understanding |
| Safety | sandbox policy、tool policy、scope、dangerous tools audit |

这正好支撑 EvoMate 的产品叙事：Agent 的 DNA 不再是虚构 UI，而是 OpenClaw 运行时资产的可视化投影。

## 8. Session 与 Memory 架构

OpenClaw 的 session 设计非常适合 EvoMate 的 Memory DNA。

Session 逻辑要点：

- DM 默认共享 session。
- 群组、room、cron、webhook 等来源可隔离 session。
- 可通过配置改变 DM scope。
- session metadata 存在 `sessions.json`。
- transcript 通常以 JSONL 形式保存。
- session lifecycle 和 transcript event 有独立工具层。

Memory 逻辑要点：

- 支持 memory-core、memory-wiki、memory-lancedb 等扩展。
- `packages/memory-host-sdk` 提供 foundation、embedding、QMD、storage、query runtime。
- Multi-agent 场景下可以跨 Agent 搜索指定 collection。
- Active memory 可作为长期偏好和重要事件的沉淀。

EvoMate 可以从 session 和 memory 中抽取：

- 成功经验。
- 失败经验。
- 高频任务类型。
- 行为偏好。
- 用户互动风格。
- 高光片段。
- 长期知识覆盖。

MVP 不需要直接读所有真实数据，可以先用适配器接口模拟；后续接入 OpenClaw 时再实现真实 extractor。

## 9. Multi-Agent 与 Routing 架构

OpenClaw 支持在同一个 Gateway 中运行多个隔离 Agent。

Multi-agent 的核心模型：

- 每个 Agent 有自己的 workspace。
- 每个 Agent 有自己的 state dir。
- 每个 Agent 有自己的 session store。
- 每个 Agent 可以有不同 auth profile、model registry、skills、tools。
- Gateway 通过 bindings 把不同消息来源路由到不同 Agent。

Routing binding 的优先级大致包括：

- peer。
- parentPeer。
- guild + roles。
- guild。
- team。
- accountId。
- channel fallback。
- default agent。

这对 EvoMate 极其关键。

EvoMate 的“父代 Agent”和“子代 Agent”可以不是 UI 假数据，而是 OpenClaw 中真实存在的多个 Agent。繁育动作可以生成一个新的 OpenClaw Agent workspace，再通过绑定或测试 Arena 让它在特定场景中表达。

## 10. Channel 与 Plugin 架构

OpenClaw 的 channel 层本质是“外部世界入口”。

官方 extensions 中包含大量 channel/plugin/provider：

- 通道类：WhatsApp、Telegram、Slack、Discord、Feishu、Matrix、Signal、iMessage、Wechat、QQBot、Line、Zalo、Twitch 等。
- 模型/Provider 类：OpenAI、Anthropic、DeepSeek、Qwen、Z.ai、Minimax、Moonshot、Google、OpenRouter、Ollama、LMStudio、VLLM 等。
- 搜索与内容类：Brave、Exa、Perplexity、Tavily、Firecrawl、DuckDuckGo、Searxng 等。
- 媒体类：Deepgram、ElevenLabs、Runway、Fal、Comfy、video/music/image generation。
- Memory 类：memory-core、memory-lancedb、memory-wiki、active-memory。
- 工具类：browser、diffs、llm-task、lobster、skill-workshop、voice-call、webhooks。

Plugin runtime 暴露给插件的能力包括：

- config。
- agent。
- subagent。
- nodes。
- system。
- media。
- webSearch。
- channel。
- events。
- logging。
- state。
- tasks / taskFlow。
- tts。
- mediaUnderstanding。
- modelAuth。
- image / video / music generation。

这说明 EvoMate 可以有两条落地路径：

- 轻量路径：独立 Web MVP，通过静态数据模拟 OpenClaw genome。
- 原生路径：做成 OpenClaw plugin，读取 Gateway runtime，生成/运行真实 Agent。

Hackathon 阶段建议先做轻量路径，但文档和架构上明确原生路径，这样会更有未来感和可信度。

## 11. Skills 架构

OpenClaw 兼容 AgentSkills 目录结构，每个 skill 通常包含 `SKILL.md`。

技能加载优先级大致是：

1. workspace skills。
2. project agent skills。
3. personal skills。
4. managed/local skills。
5. bundled skills。
6. extraDirs。

OpenClaw 还支持：

- per-agent skill allowlist。
- plugin bundled skills。
- Skill Workshop。
- ClawHub skill registry。
- skill metadata 安全扫描。

EvoMate 可以把 Skills DNA 做得非常扎实：

- 显性技能：agent allowlist 中直接启用的技能。
- 隐性技能：workspace 中存在但未启用的技能。
- 稀有技能：来自 plugin 或个人 skill 的低频能力。
- 融合技能：两个父代技能组合后产生的新命名能力。
- 技能风险：需要高权限、外部网络、文件系统、浏览器或设备访问的技能。

## 12. Node、Canvas 与 A2UI 架构

OpenClaw 的 Node 机制允许设备作为 Gateway 的外围感官和执行器。

Node 可以声明：

- caps。
- commands。
- permissions。
- role。

常见能力包括：

- camera。
- screen。
- location。
- voice。
- audio。
- canvas。
- media understanding。

Canvas/A2UI 由 Gateway HTTP 服务托管，适合承载动态 UI。

EvoMate 的 Fusion Chamber 可以升级为：

- Gateway Canvas 中的 Agent DNA 实验室。
- A2UI 驱动的交互式基因报告。
- 使用 Node caps 生成“感官基因”。
- 把手机、语音、屏幕、位置等能力也纳入遗传维度。

这会让 EvoMate 从“漂亮 Demo”变成“OpenClaw 原生的多模态 Agent 进化界面”。

## 13. Sandbox 与安全架构

OpenClaw 对工具执行提供 sandbox 体系。

Sandbox 的基本思路：

- Gateway 仍运行在 host。
- Agent tools 可以在隔离环境执行。
- 模式包括 `off`、`non-main`、`all`。
- scope 包括 `agent`、`session`、`shared`。
- backend 可以是 Docker、SSH、OpenShell 等。
- elevated exec 可以绕过 sandbox，但需要显式策略。

EvoMate 中的“繁育”和“突变”如果会生成新技能、新工具或新 Agent 配置，必须有安全边界。

建议定义：

- Safe Mutation：只改变 prompt、traits、skill allowlist。
- Controlled Mutation：允许新增低风险 skill。
- Dangerous Mutation：涉及外部执行、凭据、系统命令、设备控制，需要人工审批。

这个安全设计能强化 EvoMate 的未来感：数字生命可以突变，但必须被隔离、观察和审计。

## 14. OpenClaw 与 Evolver 的现有关联

本地 `evolver-main` 的中文说明中提到：

`evolver` 输出的 `sessions_spawn(...)` 指令可以由 OpenClaw 宿主解释和执行；如果脱离 OpenClaw，CLI 只会打印普通文本。

这给 EvoMate 一个很好的三层叙事：

- Evolver：提供进化任务、GEP、mutation、diagnosis、reflection 等演化思想。
- OpenClaw：提供真实 Agent runtime、session spawning、multi-agent gateway 和工具执行环境。
- EvoMate：提供面向人的可视化繁育实验室，把底层演化过程变成可理解、可路演、可操作的产品。

因此 EvoMate 不需要把自己定位成替代 OpenClaw 或 Evolver，而是一个“Agent Evolution UX Layer”。

## 15. 可结合点总览

| OpenClaw 能力 | EvoMate 结合方式 | MVP 优先级 |
| --- | --- | --- |
| Multi-agent | 父代/子代都是真实 Agent profile | P0 设计，P1 实现 |
| Bootstrap files | 映射为 Soul / Identity / Tools DNA | P0 |
| Skills | 映射为 Skills DNA 与融合技能 | P0 |
| Sessions JSONL | 抽取 Memory Highlights | P1 |
| Memory QMD/wiki | 抽取 Knowledge Capsules | P1 |
| Gateway WS | EvoMate 作为控制面客户端 | P1 |
| Plugin runtime | EvoMate 做成 OpenClaw plugin | P2 |
| Canvas/A2UI | 承载 Fusion Chamber 可视化 | P1/P2 |
| Nodes | 感官基因：camera/screen/location/voice | P2 |
| Sandbox | 突变安全隔离和审批 | P1 |
| TaskFlow/Cron | 自动化多轮繁育和评估 | P2 |
| Routing bindings | 子代 Agent 发布到指定渠道测试 | P2 |
| Provider/model registry | 模型偏好成为 Genome 的一部分 | P1 |
| Evolver session spawn | 让繁育触发真实子会话/子 Agent | P1 |

## 16. 产品方向：EvoMate for OpenClaw

### 16.1 产品一句话

EvoMate for OpenClaw 是一个运行在 OpenClaw Gateway 之上的 Agent Genome Lab，用可视化方式读取、繁育、突变和评估多个真实 OpenClaw Agent。

### 16.2 核心价值

- 让 Agent 的 prompt、skills、memory、tools、sessions 从“隐藏配置”变成“可观察 DNA”。
- 让多 Agent 不只是并行协作，而是可以跨代重组和演化。
- 让开发者通过 breeding 和 arena 快速探索更适合任务的 Agent 配置。
- 让评委看到一个真正把 Agent 基础设施和未来产品体验结合起来的 demo。

### 16.3 目标用户

- Hackathon 评委。
- Agent 框架开发者。
- OpenClaw 用户和插件开发者。
- 研究 Agent evolution、A2A、多智能体协作的技术用户。
- 未来企业 Agent 平台负责人。

## 17. MVP 产品范围

### P0：Hackathon 可演示版本

P0 仍以当前 EvoMate 静态 MVP 为基础，但架构表达升级为 OpenClaw genome adapter。

必须完成：

- 展示 4 个 OpenClaw 风格父代 Agent。
- 每个 Agent 显示 Soul、Skills、Memory、Knowledge、Tools、Channels。
- 匹配度中加入 OpenClaw 维度：skill complement、memory diversity、tool risk、channel style。
- 点击 Breed 后生成 Child Agent genome。
- Child Report 显示来自 OpenClaw 的来源映射。
- Arena 展示父代与子代的任务输出对比。
- PRD 与路演文案明确“未来可接入 OpenClaw Gateway 实时读取真实 Agent”。

### P1：OpenClaw 真实数据接入

P1 目标是从 OpenClaw 本地文件和 Gateway 中读取真实资产。

功能包括：

- 读取 OpenClaw agents 配置。
- 读取 agent workspace 的 `AGENTS.md`、`SOUL.md`、`TOOLS.md`、`IDENTITY.md`。
- 读取 skills allowlist 和 `SKILL.md` 摘要。
- 读取 session metadata 和最近 transcript。
- 读取 memory/wiki 摘要。
- 根据 genome 生成新的 child agent workspace 草稿。
- 使用 sandbox 配置限制 child agent 的初次执行。

### P2：OpenClaw 原生插件

P2 目标是把 EvoMate 变成 OpenClaw plugin。

功能包括：

- 注册 EvoMate Gateway method。
- 提供 EvoMate Canvas/A2UI 页面。
- 通过 plugin runtime 读取 agent、skills、memory、tasks。
- 通过 taskFlow 批量运行 Arena。
- 支持 family tree 和多代繁育。
- 支持通过 Gateway 将 child agent 绑定到测试 channel。
- 支持危险突变审批。

## 18. 核心用户故事

- 作为 Agent 开发者，我想查看每个 OpenClaw Agent 的 Genome Profile，这样我能理解它的性格、技能、记忆和工具来源。
- 作为 hackathon 评委，我想在 30 秒内看懂两个 Agent 如何繁育出一个子代，这样我能感受到项目的新颖性。
- 作为 OpenClaw 用户，我想从已有 Agent 中选择两个父代生成一个 child agent 草稿，这样我可以快速探索新配置。
- 作为安全负责人，我想看到突变带来的工具和权限变化，这样我能判断 child agent 是否可以运行。
- 作为研究型开发者，我想比较父代和子代在同一 Arena 任务中的输出，这样我可以评估遗传是否真的改变行为。

## 19. 功能需求

### 19.1 OpenClaw Genome Profile

输入：

- Agent 基础信息。
- Bootstrap files。
- Skills 配置。
- Tools 配置。
- Session 摘要。
- Memory/wiki 摘要。
- Channel bindings。
- Node caps。
- Sandbox policy。

输出：

- Soul traits。
- Skills tags。
- Memory highlights。
- Knowledge capsules。
- Tool genome。
- Channel expression。
- Risk profile。
- Radar chart。
- Genome rarity。

### 19.2 Compatibility Engine 2.0

指标：

- Personality Compatibility。
- Skill Complementarity。
- Knowledge Diversity。
- Memory Diversity。
- Tool Safety Distance。
- Channel Expression Match。
- Mutation Potential。

示例解释：

```text
Atlas 与 Muse 的人格冲突中等，但技能互补性强；Atlas 提供规划与调试基因，Muse 提供叙事与创意表达基因。两者工具风险距离较低，适合生成一个面向路演与产品策略的 child agent。
```

### 19.3 Fusion Engine 2.0

融合逻辑：

- 从父代 `SOUL.md` 中抽取人格 trait。
- 从父代 skills allowlist 中抽取显性技能。
- 从 transcript summary 中抽取 memory fragments。
- 从 memory/wiki 中抽取 knowledge capsules。
- 从 tools config 中合并低风险工具。
- 对冲突 trait 做重写。
- 对技能组合生成 fused skill。
- 对少量 trait/skill/visual/risk 标签注入 mutation。

输出：

- Child genome。
- Inheritance log。
- Mutation log。
- Risk diff。
- Suggested bootstrap files。

### 19.4 Child Agent Draft Generator

P1/P2 阶段新增。

生成内容：

- `AGENTS.md` 草稿。
- `SOUL.md` 草稿。
- `TOOLS.md` 草稿。
- `IDENTITY.md` 草稿。
- skills allowlist。
- sandbox policy。
- initial arena prompt。

注意：

P1 阶段只生成草稿，不自动写入真实 OpenClaw agent 目录，避免误操作；P2 阶段可通过审批后写入。

### 19.5 Arena Evaluation

Arena 任务类型：

- Pitch Arena：生成 30 秒项目路演。
- Debug Arena：定位一段错误代码的问题。
- Planning Arena：拆解 48 小时开发计划。
- Research Arena：整理某技术路线优缺点。
- Channel Arena：模拟在 Slack/Telegram 群组中的回答风格。

Arena 输出：

- Parent A response。
- Parent B response。
- Child response。
- 表达差异说明。
- 胜出原因。
- 遗传证据链。

### 19.6 Lineage Tree

后续增强。

展示：

- 父代。
- 子代。
- 多代 lineage。
- 每一代 mutation。
- 每一代 arena score。
- 每一代风险变化。

## 20. 数据模型建议

### 20.1 GenomeProfile

```ts
type GenomeProfile = {
  id: string;
  name: string;
  archetype: string;
  source: "mock" | "openclaw-agent" | "openclaw-session" | "generated";
  openclaw?: {
    agentId?: string;
    workspace?: string;
    agentDir?: string;
    modelProfile?: string;
    channelBindings?: string[];
  };
  soul: {
    traits: string[];
    tone: string;
    riskAppetite: "low" | "medium" | "high";
  };
  skills: Array<{
    id: string;
    name: string;
    source: "allowlist" | "workspace" | "plugin" | "fused" | "mutation";
    risk: "low" | "medium" | "high";
  }>;
  memory: {
    highlights: string[];
    sources: string[];
  };
  knowledge: {
    capsules: string[];
    sources: string[];
  };
  tools: {
    enabled: string[];
    dangerous: string[];
    sandboxMode?: string;
  };
  expression: {
    channels: string[];
    styleTags: string[];
  };
  metrics: {
    planning: number;
    creativity: number;
    reliability: number;
    autonomy: number;
    empathy: number;
    toolUse: number;
  };
};
```

### 20.2 BreedingResult

```ts
type BreedingResult = {
  parentA: string;
  parentB: string;
  child: GenomeProfile;
  inheritanceLog: string[];
  mutationLog: string[];
  riskDiff: {
    addedTools: string[];
    removedTools: string[];
    riskLevel: "low" | "medium" | "high";
    requiresApproval: boolean;
  };
  suggestedFiles?: {
    "AGENTS.md": string;
    "SOUL.md": string;
    "TOOLS.md": string;
    "IDENTITY.md": string;
  };
};
```

## 21. 技术实现路径

### 21.1 当前 MVP 路径

保持现有 EvoMate 零依赖静态 demo。

新增：

- 在 mock agent 数据中补充 OpenClaw 字段。
- 在 UI 中加入 OpenClaw genome 来源标签。
- 在 Compatibility Engine 中加入 tool/channel/sandbox 维度。
- 在 Child Report 中展示 suggested bootstrap files 摘要。

### 21.2 OpenClaw Local Adapter 路径

新增一个本地 adapter 层：

```text
src/adapters/openclaw/
```

建议模块：

- `discover-openclaw.js`：发现本地 OpenClaw repo 或配置目录。
- `read-agent-profile.js`：读取 agent 配置和 workspace 文件。
- `read-skills.js`：读取 skills 和 `SKILL.md` 摘要。
- `read-sessions.js`：读取 session metadata 和 transcript 摘要。
- `build-genome-profile.js`：组合成 EvoMate GenomeProfile。
- `generate-child-draft.js`：生成 child agent 草稿。

### 21.3 Gateway Client 路径

新增一个 Gateway WebSocket client：

```text
src/adapters/openclaw-gateway/
```

职责：

- 连接 `ws://127.0.0.1:18789`。
- 发送 authenticated operator connect frame。
- 调用 agent/agents/sessions/skills 相关方法。
- 订阅 chat/session/agent 事件。
- 将实时事件转成 EvoMate UI 状态。

注意：

Gateway 鉴权需要遵守 OpenClaw shared secret、pairing 和 operator scopes，hackathon 阶段不建议硬接生产凭据。

### 21.4 Plugin 路径

后续可在 OpenClaw `extensions/evomate` 中实现。

插件职责：

- 注册 EvoMate manifest。
- 暴露 Gateway method，例如 `evomate.genome.list`、`evomate.breed.preview`、`evomate.child.createDraft`、`evomate.arena.run`。
- 注册 Canvas/A2UI 页面。
- 复用 plugin runtime 的 agent、skills、memory、taskFlow、nodes、logging、state。
- 对危险突变走 approval。

## 22. Demo 叙事升级

原版 EvoMate 叙事：

```text
两个 Agent 的数字 DNA 融合，生成新的子代 Agent。
```

升级为 OpenClaw 叙事：

```text
OpenClaw 已经让 Agent 具备真实的 workspace、skills、memory、sessions、tools 和 channels。EvoMate 把这些真实运行资产转译成可观察的 Genome，并让开发者通过繁育、突变和 Arena 筛选下一代 Agent。
```

30 秒路演话术：

```text
今天的 Agent 大多还是靠人手工调 prompt、装工具、调 workflow。OpenClaw 让 Agent 拥有了真实的运行身体：会话、技能、记忆、通道、设备和沙箱。EvoMate 做的事情，是把这些身体结构变成数字 DNA。我们选择两个 OpenClaw Agent 作为父代，系统会分析它们的 Soul、Skills、Memory、Knowledge 和 Tools，完成一次可视化繁育，生成一个子代 Agent，并在 Arena 中对比它和父母的表达差异。我们想证明，未来 Agent 的优化不一定来自手工调参，也可能来自可观察、可筛选、可审计的数字演化。
```

## 23. 评审亮点

- 技术深度：不是纯前端特效，而是对接 OpenClaw 的真实 Agent runtime 思路。
- 未来感：把 Agent-to-Agent 从通信推进到跨代繁育。
- 可解释性：把隐藏的 prompt/tools/memory/session 变成可观察 genome。
- 可扩展性：从静态 demo 可自然升级为 OpenClaw plugin。
- 安全意识：把 mutation 和 sandbox/approval 结合，避免“野生数字生命”失控。
- 商业潜力：企业未来可通过繁育和评估得到更适合业务目标的 Agent 配置。

## 24. 后续开发任务拆解

### 24.1 48 小时内可做

- 为 mock agents 增加 OpenClaw metadata。
- 在 Agent Profile 中展示 bootstrap/source 标签。
- 增加 Tool Genome 与 Sandbox Badge。
- Compatibility Engine 增加 OpenClaw 评分维度。
- Child Report 增加 OpenClaw Agent Draft 区块。
- Arena 输出增加“遗传证据链”。

### 24.2 Hackathon 后一周

- 实现 `src/adapters/openclaw` local reader。
- 支持读取 `SOUL.md`、`AGENTS.md`、`TOOLS.md`。
- 支持读取本地 `skills` 清单。
- 支持从 session JSONL 抽取 memory highlights。
- 支持导出 child agent draft。

### 24.3 Hackathon 后一个月

- 实现 Gateway WebSocket client。
- 实现 OpenClaw plugin 原型。
- 实现 Canvas/A2UI Fusion Chamber。
- 实现真实 Arena 调用。
- 实现 lineage tree。
- 实现 mutation approval 与 sandbox policy。

## 25. 风险与约束

| 风险 | 描述 | 处理方式 |
| --- | --- | --- |
| OpenClaw 代码量大 | 短期内完整接入成本高 | Hackathon 先做 mock + adapter 设计 |
| Gateway 鉴权复杂 | shared secret、pairing、scope 不应草率绕过 | P1 只读本地文件，P2 再接 Gateway |
| 真实 Memory 数据敏感 | session transcript 可能包含隐私 | 默认摘要化、脱敏、用户确认 |
| 自动生成 Agent 有安全风险 | child agent 可能继承危险工具 | 引入 sandbox badge、risk diff、approval |
| Demo 视觉与真实逻辑难兼顾 | 48 小时内不能做太深 | 视觉闭环优先，真实接入路线写清楚 |

## 26. 验收标准

Hackathon 版本验收：

- 评委能在 30 秒内理解 OpenClaw 与 EvoMate 的关系。
- 页面能展示 OpenClaw 风格的 Genome Profile。
- Breed 流程能输出 child genome、inheritance log、mutation log、risk diff。
- Arena 能解释子代比父代多了什么能力或表达差异。
- 文档能说明后续如何从静态 MVP 升级为 OpenClaw plugin。

P1 版本验收：

- 能读取至少 2 个真实 OpenClaw Agent 的 bootstrap 文件。
- 能读取至少 5 个真实 skills 并映射为 Skills DNA。
- 能从 session transcript 生成 memory highlights。
- 能生成 child agent draft 文件。

P2 版本验收：

- EvoMate 作为 OpenClaw plugin 可被加载。
- EvoMate 页面可通过 Gateway/Canvas 访问。
- 可通过 Gateway 方法完成 genome list、breed preview、arena run。
- 危险突变必须触发 approval 或被 sandbox 拦截。

## 27. 建议落地优先级

短期最值得做的是“让当前 EvoMate 看起来像真的接在 OpenClaw 上”：

1. 在 UI 中加入 OpenClaw Genome Source 区块。
2. 在 mock 数据中加入 workspace、bootstrap、skills、tools、channels、sandbox 字段。
3. 在 Fusion Report 中输出 child agent draft 摘要。
4. 在 Demo 话术中明确 OpenClaw 是 Agent runtime，EvoMate 是 evolution UX layer。

这样可以在 hackathon 中同时拿到三个感知：

- 新：Agent 数字遗传实验室。
- 真：底层能接 OpenClaw 的真实 Agent 结构。
- 可扩：后续能做插件、真实繁育、多代评估和安全审计。

