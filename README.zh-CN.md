# EvoMate

EvoMate 是专为黑客马拉松（Red Pill / Build For Future 赛道）设计的一个 **AI Agent 数字基因实验室**。

它允许两个“父代” Agent 通过基因组（Genome）的遗传、重组和突变，繁育出一个“子代” Agent，并在同一个竞技场（Arena）中评估子代与父代的能力差异（Fitness Delta）。

## 核心演示流程 (MVP Loop)

1. **浏览** 父代 Agent 的“基因组”配置。
2. 在匹配室中 **选择** 两个父代 Agent。
3. **检查** 它们的兼容性和突变潜力。
4. **触发** DNA 融合（Fusion）。
5. **揭晓** 诞生的子代 Agent 及其基因报告。
6. 在竞技场任务中 **对比** 评估父代和子代的表现。

## 项目结构

- `apps/web/`：静态 MVP 演示应用前端。
- `data/mock/`：预设的 Agent 数据、任务和文本。
- `src/core/`：核心算法框架（包含兼容性引擎、融合引擎和竞技场评估引擎）。
- `docs/`：英文设计文档、架构图和演示脚本。
- `docs-zh/`：中文产品文档、OpenClaw 集成计划。
- `lightning-pitch/`：闪电路演脚本、提示词和视觉资产。
- `开发日志/`：中文开发日志。
- `scripts/`：本地开发服务器。
- `分布式开发机制.zh-CN.md`：多人并行开发的契约和规范。
- `module-manifest.json`：机器可读的模块描述。

## 本地启动

```bash
npm run dev
```

然后在浏览器中打开：
http://127.0.0.1:3030

## 验证项目状态

```bash
npm run check
```

注：当前应用有意设计为**零依赖**架构，以保证在黑客马拉松现场演示时的绝对稳定性。
