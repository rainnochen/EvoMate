# EvoMate 中文闪电路演 PPT 图片 Prompts

用途：把下面每个 prompt 单独喂给 ChatGPT Image / GPT Image 2，生成一张 16:9 PPT 图片。建议先统一生成 8 张，最后再挑 5-6 张用于现场闪电路演。

## 使用建议

如果图片模型生成中文文字不够稳定，有两个方案：

- 方案 A：保留 prompt 中的中文文字，让模型直接生成完整 PPT 页。
- 方案 B：把 prompt 里的“请准确渲染中文文字”改成“不要生成任何文字，保留大面积留白”，然后在 PPT / Keynote / Canva 里手动加中文。

推荐 PPT 字体方向：

- 标题：思源黑体 Heavy / 阿里巴巴普惠体 Heavy / HarmonyOS Sans Bold。
- 正文：思源黑体 / 阿里巴巴普惠体 / HarmonyOS Sans。
- 风格：黑色、深青色、琥珀金、少量红药丸红。

## Prompt 1：封面页

```text
请生成一张 16:9 中文闪电路演 PPT 封面图，主题是 AI Agent 数字遗传实验室。

画面内容：
深黑和深青色的未来实验室背景，中央是一条由数据节点组成的发光 DNA 双螺旋，左右两侧有两个抽象 AI Agent 光影轮廓，中央 DNA 正在融合成一个新的 child agent。整体要像严肃的 AI 基础设施项目，不要像游戏、宠物、动漫。

请准确渲染以下中文文字：
主标题：EvoMate
副标题：Agent 数字遗传实验室
标语：Prompt Engineering is becoming Genome Engineering
角标：红药丸赛道｜Build For Future

视觉风格：
cinematic sci-fi laboratory, premium hackathon pitch deck, dark black and deep teal background, cyan and amber bioluminescent data strands, subtle red pill accent, glassmorphism HUD, high contrast, elegant typography, clean layout, no logo, no watermark.
```

## Prompt 2：痛点页

```text
请生成一张 16:9 中文 PPT 图片，主题是“今天的 Agent 仍然主要靠手工配置”。

画面内容：
左侧是一个疲惫的开发者面对复杂的 prompt、tools、workflow、memory 配置面板，屏幕上有很多线缆和模块，显得复杂且不可解释。右侧留出干净文字区。整体氛围要偏工程真实，不要夸张卡通。

请准确渲染以下中文文字：
标题：今天的 Agent，还是手工拼装出来的
要点 1：Prompt 靠经验反复试
要点 2：Tools 和 Workflow 手动组合
要点 3：Memory 形成过程不可见
要点 4：很难知道“能力为什么这样形成”

视觉风格：
serious AI engineering, dark interface, complex agent configuration panels, glowing cables, subtle frustration, premium pitch deck, black and deep teal, cyan interface highlights, amber warning accents, clean Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 3：核心洞察页

```text
请生成一张 16:9 中文 PPT 图片，主题是“从配置 Agent 到演化 Agent”。

画面内容：
画面左侧是机械拼装式的 Agent，由 prompt、tools、memory 模块拼成；画面右侧是有机生长式的数字 DNA，正在演化成一个 Agent。中间有一个从左到右的转变箭头。视觉上表达从 manual configuration 到 digital evolution。

请准确渲染以下中文文字：
标题：下一代 Agent，不一定是调出来的
大字核心句：而是演化出来的
左侧标签：Configured Agent
右侧标签：Evolved Agent
底部小字：从 Prompt Engineering 到 Genome Engineering

视觉风格：
futuristic transformation diagram, configured machine modules turning into living digital genome, serious sci-fi, premium product strategy slide, dark teal and black, cyan and amber glow, subtle red accent, elegant Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 4：产品方案页

```text
请生成一张 16:9 中文 PPT 产品方案图，主题是 EvoMate 如何工作。

画面内容：
用四个清晰模块展示 Agent DNA：Soul、Skills、Memory、Knowledge。两个父代 Agent 的四层 DNA 在中间融合，生成一个 child agent。画面要像高端 SaaS / AI infra 产品界面，不要像生物课本。

请准确渲染以下中文文字：
标题：EvoMate：把 Agent 抽象成可遗传的数字 DNA
模块 1：Soul｜性格与行为倾向
模块 2：Skills｜能力与工具边界
模块 3：Memory｜经验与行为印记
模块 4：Knowledge｜知识包与专业领域
中间按钮文字：Breed
结果文字：Child Agent

视觉风格：
premium AI product UI, agent genome cards, four-layer digital DNA system, glassmorphism panels, holographic diagram, black and deep teal background, cyan and amber highlights, clean Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 5：Demo 流程页

```text
请生成一张 16:9 中文 PPT 流程图，主题是 EvoMate 的 5 步 Demo 闭环。

画面内容：
从左到右展示 5 个阶段，每个阶段有一个未来感图标和简洁画面：Agent 档案、兼容性匹配、DNA 融合、子代报告、Arena 对比。整体像评委一眼能看懂的产品流程页。

请准确渲染以下中文文字：
标题：2 分钟看懂 Demo 闭环
步骤 1：选择父代 Agent
步骤 2：计算匹配度
步骤 3：DNA Fusion
步骤 4：生成 Child Agent
步骤 5：Arena 对比表达差异
底部小字：继承｜重组｜突变｜评估

视觉风格：
clean horizontal product flow, futuristic icons, AI lab interface, dark premium pitch deck, cyan and amber step lines, subtle DNA particles, high readability, elegant Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 6：高光演示页 DNA Fusion Chamber

```text
请生成一张 16:9 中文 PPT 高光演示页，主题是 DNA Fusion Chamber。

画面内容：
中央是透明的数字基因融合舱，两条发光的数据 DNA 从左右进入，粒子标签代表 personality、skills、memory、knowledge、tools，但不要生成杂乱小字。中间出现 mutation sparks，最后凝聚成一个新的 child genome。画面要极具冲击力，适合闪电路演时让人记住。

请准确渲染以下中文文字：
标题：DNA Fusion Chamber
副标题：让 Agent 的能力形成过程可视化
三段关键词：继承｜重组｜突变
状态文字：Genome Stabilized

视觉风格：
dramatic cinematic sci-fi, digital genetics reactor, glowing DNA data streams, particle trails, mutation alert sparks, dark teal laboratory, cyan amber and tiny red accents, premium hackathon demo slide, strong visual impact, 16:9, no logo, no watermark.
```

## Prompt 7：Arena 对比页

```text
请生成一张 16:9 中文 PPT 图片，主题是 Arena Evaluation，展示父代和子代在同一个任务中的表现差异。

画面内容：
三栏对比界面。左栏 Parent A 更理性结构化，中栏 Parent B 更创意叙事化，右栏 Child Agent 结合两者优势。每栏用抽象 UI 内容块，不要生成大段难读文字。右栏要视觉上最亮，表示子代综合能力更强。

请准确渲染以下中文文字：
标题：Arena：证明子代不只是换皮
任务：为 AI Hackathon 项目生成 30 秒路演介绍
左栏：Parent A｜结构强
中栏：Parent B｜表达强
右栏：Child Agent｜结构 + 表达
底部结论：子代继承父母优势，并产生新的表达组合

视觉风格：
premium AI evaluation dashboard, three-column comparison, glass panels, score meters, genome trace lines, serious AI infrastructure product, black and deep teal, cyan and amber highlights, clean Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 8：OpenClaw / Evolver 可信架构页

```text
请生成一张 16:9 中文 PPT 架构图，主题是 EvoMate 可以接入真实 Agent 基础设施。

画面内容：
底层是 OpenClaw Gateway，连接 sessions、skills、memory、tools、channels、nodes、sandbox。左侧是 Evolver / EvoMap，提供 evolution、mutation、reflection。上层是 EvoMate Genome Lab，把底层运行资产转译成 Agent DNA，并通过 Breed 和 Arena 生成子代 Agent。整体要像可信的技术架构图，而不是营销海报。

请准确渲染以下中文文字：
标题：不是概念动画，而是 Agent Genome Layer
底层：OpenClaw Runtime
左侧：Evolver / EvoMap
上层：EvoMate Genome Lab
输出：Child Agent + Arena Evaluation
底部小字：Skills｜Memory｜Tools｜Sessions｜Sandbox

视觉风格：
futuristic technical architecture diagram, clean layered system design, local AI gateway hub, genome lab layer, arrows and modules, dark background, cyan amber lines, high readability, premium engineering pitch slide, Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 9：招募队友页

```text
请生成一张 16:9 中文 PPT 招募队友页，主题是今晚一起冲 EvoMate Demo。

画面内容：
未来黑客松现场，几位年轻开发者和设计师围在一个全息 DNA Agent 实验台旁，屏幕上有 Agent card、fusion chamber、arena comparison。氛围要兴奋、专注、协作，不要像普通企业会议，不要过度卡通。

请准确渲染以下中文文字：
标题：我们正在招募队友
副标题：一起做一个评委一眼记住的 Agent Evolution Demo
角色 1：前端动效
角色 2：Agent 逻辑
角色 3：视觉设计
角色 4：产品路演
底部召唤：今晚一起把 Agent 生长出来

视觉风格：
energetic hackathon team, holographic AI genome reactor, collaborative builders, cinematic sci-fi, dark teal and black, cyan and amber highlights, subtle red pill accent, premium recruitment slide, clean Chinese typography, 16:9, no logo, no watermark.
```

## Prompt 10：结尾页

```text
请生成一张 16:9 中文 PPT 结尾页，主题是 EvoMate 的未来愿景。

画面内容：
一条发光的数字 DNA 伸向远处，逐渐变成多个不同能力的 Agent 星座。背景像未来网络和矩阵空间，但要克制、优雅、严肃。画面中央留出大标题空间。

请准确渲染以下中文文字：
主标题：未来的 Agent，不只会协作
副标题：它们也会演化
标语：From Agent-to-Agent to Agent Evolution
项目名：EvoMate

视觉风格：
minimal cinematic sci-fi ending slide, digital DNA becoming constellation of AI agents, elegant dark matrix space, black and deep teal gradient, cyan amber glow, one subtle red pill accent, premium pitch deck, clean Chinese typography, 16:9, no logo, no watermark.
```

## 最推荐的 5 页闪电版

如果现场只能讲 60-90 秒，建议只用这 5 页：

1. 封面页。
2. 痛点页。
3. 核心洞察页。
4. DNA Fusion Chamber。
5. 招募队友页。

## 最推荐的 8 页完整版

如果有 2-3 分钟，建议使用：

1. 封面页。
2. 痛点页。
3. 核心洞察页。
4. 产品方案页。
5. Demo 流程页。
6. DNA Fusion Chamber。
7. Arena 对比页。
8. 招募队友页。

