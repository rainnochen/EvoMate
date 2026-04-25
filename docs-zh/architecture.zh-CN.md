# EvoMate 技术架构说明

## 架构目标

当前架构目标不是一次性做成完整平台，而是在 hackathon 时间内搭出一个稳定、可演示、可继续扩展的 Agent 进化沙盒。

核心原则：

- 演示稳定优先。
- 逻辑模块边界清楚。
- 视觉表现足够直接。
- 后续可以接入 `evolver-main` 的真实能力。

## 当前运行层级

### 1. Web App 展示层

路径：`apps/web/`

职责：

- 页面结构。
- 父代 Agent 选择。
- 匹配度面板渲染。
- Fusion Chamber 状态切换。
- Child Report 展示。
- Arena 对比展示。

关键文件：

- `apps/web/index.html`
- `apps/web/styles.css`
- `apps/web/app.js`

### 2. Mock Data 数据层

路径：`data/mock/`

职责：

- 预设父代 Agent。
- 定义 Arena 任务。
- 存放演示所需的结构化 genome 数据。

关键文件：

- `data/mock/agents.json`

### 3. Core Logic 核心逻辑层

路径：`src/core/`

职责：

- 计算父代兼容性。
- 执行数字 DNA 融合。
- 注入突变。
- 生成 Arena 对比输出。

关键文件：

- `src/core/compatibility-engine.js`
- `src/core/fusion-engine.js`
- `src/core/arena-engine.js`

### 4. Future Integration 未来集成层

未来路径：`src/integrations/evolver/`

计划职责：

- 读取 `evolver-main` 中的 GEP genes / capsules。
- 将 Evolver 资产映射为 EvoMate 的 Soul、Skills、Memory、Wiki 四层 genome。
- 将 EvoMate 生成的 Child Genome 导出为候选进化资产。
- 接入 EvoMap / A2A 通信与验证机制。

## 当前数据流

```text
预设父代 Agent
  -> 用户选择双亲
  -> Compatibility Engine
  -> Fusion Engine
  -> Child Genome
  -> Genetic Report
  -> Arena Engine
  -> 父代 / 子代表达对比
```

## 当前工程选择

- 使用静态 Web App。
- 不引入前端框架。
- 不需要构建工具。
- 不依赖外部 API。
- 使用原生 ES Modules。
- 用规则算法模拟遗传与突变。

## 为什么这样设计

Hackathon 现场最怕两个问题：

- 网络不稳定。
- 复杂构建链路出错。

因此当前版本优先保证：

- 打开就能演示。
- 数据可控。
- 逻辑可解释。
- 后续迁移空间足够。

## 后续可扩展方向

- 将 `agents.json` 替换为真实 Evolver 资产。
- 将规则兼容性评分替换为评估模型或 embedding 匹配。
- 将 template Arena 输出替换为真实 Agent 执行。
- 增加多代繁育与家谱视图。
- 增加 replay / evaluation / selection loop。
