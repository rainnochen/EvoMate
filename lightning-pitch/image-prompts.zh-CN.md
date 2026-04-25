> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# EvoMate 演示图片生成 Prompts

这些 prompts 用于生成闪电路演、招募队友、Demo 背景和视觉概念图。建议喂给 ChatGPT Image / GPT Image 2 时，一次生成一张，保持风格一致。

## 通用视觉风格

建议统一风格：

```text
cinematic sci-fi laboratory, agent digital genetics, black and deep teal background, amber and cyan bioluminescent data strands, elegant glassmorphism interface, premium hackathon demo poster, sharp typography space reserved, no visible brand logos, no text artifacts, high contrast, dramatic lighting, 16:9
```

## Prompt 1：主视觉海报

```text
Create a cinematic 16:9 hero poster for a hackathon project called "EvoMate". The scene is a futuristic digital genetics laboratory where two abstract AI agents are represented as glowing humanoid silhouettes on the left and right, each connected to floating DNA-like data strands. In the center, their data genomes merge into a newborn child agent made of light. Visual mood: future agent evolution, not cute pets, not cartoon. Use deep black, dark teal, amber, cyan, subtle red pill motif, glassmorphism HUD panels, elegant premium sci-fi design. Leave clean empty space at the top for title and slogan. No random text, no logos, no watermark.
```

## Prompt 2：Agent Genome Card

```text
Design a premium UI concept image for an "Agent Genome Profile" card. The card shows an AI agent as an abstract luminous avatar, surrounded by four genome layers: Soul, Skills, Memory, Knowledge. Include visual elements like radar chart, trait chips, skill nodes, memory fragments, and knowledge capsules. Style: futuristic product interface, dark teal and black background, amber and cyan highlights, glass panels, high readability, hackathon demo quality. The image should look like a serious AI infrastructure product, not a game. 16:9 composition, no fake unreadable paragraphs, no logos.
```

## Prompt 3：DNA Fusion Chamber

```text
Create a dramatic sci-fi visualization of a "DNA Fusion Chamber" for AI agents. Two streams of glowing digital DNA enter from left and right, carrying small labeled-like particles representing personality, skills, memory, tools, and knowledge, but do not render actual readable text. The streams collide in a transparent reactor core, creating a bright child genome spiral. Include subtle mutation sparks, particle trails, holographic interface rings, and a sense of controlled scientific experimentation. Color palette: black, deep teal, cyan, amber, tiny red accents. Cinematic lighting, 16:9, no logos, no watermark.
```

## Prompt 4：Child Agent Reveal

```text
Create a cinematic reveal image for a newly generated child AI agent in a digital genetics lab. The child agent appears as a luminous abstract figure emerging from a vertical genome spiral, surrounded by inheritance lines from two parent agents in the background. The image should feel like "Genome Stabilized" and "new agent born", but serious and technical, not cute or fantasy. Include holographic panels, subtle risk scan indicators, data particles, and premium sci-fi interface design. Dark background, cyan and amber glow, 16:9, no fake text, no logos.
```

## Prompt 5：Arena 对比三栏图

```text
Create a 16:9 product demo screen showing an "Agent Arena Evaluation" comparison. Three vertical glass panels stand side by side: Parent Agent A, Parent Agent B, and Child Agent. Parent A has a structured analytical visual style, Parent B has a creative storytelling visual style, and Child combines both into a balanced evolved style. Use abstract UI blocks instead of readable text. Add subtle score meters, genome trace lines, and evaluation badges. Visual language: serious AI infrastructure, futuristic hackathon demo, dark teal, black, amber, cyan, high contrast, no logos, no watermark.
```

## Prompt 6：OpenClaw × EvoMate 架构图

```text
Create a futuristic architecture diagram concept for "OpenClaw x EvoMate". At the bottom, show an abstract local AI Gateway hub connected to channels, skills, memory, sessions, tools, nodes, and sandbox modules. Above it, show EvoMate as a Genome Lab layer that reads these runtime assets and transforms them into Agent DNA. At the top, show parent agents producing a child agent through evolution and arena evaluation. Use clean diagrammatic composition, premium sci-fi UI style, dark background, cyan and amber lines, clear hierarchy, minimal readable labels only if clean. 16:9, no logos, no watermark.
```

## Prompt 7：招募队友海报

```text
Create a hackathon teammate recruitment poster for an AI project named "EvoMate". Visual: a futuristic team gathered around a holographic AI genome reactor, with glowing DNA strands and agent cards floating in the air. Mood: energetic, ambitious, collaborative, late-night hackathon build sprint. Style: premium cinematic sci-fi, dark teal and black, cyan and amber highlights, subtle red pill motif, not cartoon, not corporate stock photo. Leave clean empty space for adding recruitment text later. 4:5 vertical poster, no random text, no logos, no watermark.
```

## Prompt 8：红药丸赛道概念图

```text
Create a symbolic sci-fi image for a "Build For Future" AI hackathon track. A red pill floats above a digital matrix grid, transforming into glowing AI genome strands and agent silhouettes. The feeling should be philosophical, future-oriented, and technically serious. Dark cinematic background, teal matrix-like depth, amber and cyan data lights, one elegant red accent. Leave space for title text. 16:9, no logos, no random text, no watermark.
```

## Prompt 9：移动端预览图

```text
Create a polished mobile app mockup for an AI Agent Genome Lab called EvoMate. Show two parent agent cards stacked on a phone screen, a compatibility score ring, and a glowing Breed button leading to a DNA fusion chamber. Style: high-end sci-fi product UI, dark background, glassmorphism cards, cyan and amber highlights, excellent spacing, readable interface shapes without fake text. Place the phone in a cinematic lab environment with subtle holographic DNA strands. 16:9, no logos, no watermark.
```

## Prompt 10：极简技术感封面

```text
Create a minimalist premium cover image for a technical pitch deck about Agent Genome Engineering. Visualize a single glowing DNA helix made of small interface nodes, with four subtle layers represented by different particles: soul, skills, memory, knowledge, but do not render text. Background is matte black with deep teal gradient, precise cyan and amber highlights, elegant negative space, serious future infrastructure feeling. 16:9, no logos, no watermark, no random text.
```

## 生成建议

- 如果图片要放到路演首页，优先用 Prompt 1 或 Prompt 10。
- 如果图片要解释产品机制，优先用 Prompt 2、Prompt 3、Prompt 5。
- 如果图片要招募队友，优先用 Prompt 7。
- 如果要强调 OpenClaw 架构可信度，优先用 Prompt 6。
- 如果现场红药丸氛围很强，优先用 Prompt 8。

## 统一负面提示词

可以追加：

```text
Avoid cute pet game aesthetics, avoid anime style, avoid childish cartoon, avoid messy unreadable text, avoid random logos, avoid generic chatbot icons, avoid purple-white SaaS template, avoid cheap neon cyberpunk clutter.
```

