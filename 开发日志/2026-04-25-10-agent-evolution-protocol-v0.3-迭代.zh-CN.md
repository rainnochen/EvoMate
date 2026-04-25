> 🧬 **[EvoMate](https://github.com/rainnochen/EvoMate/blob/main/README.md)** — *Agent Digital Genetics Lab*
> [🏠 主页 / Home](https://github.com/rainnochen/EvoMate/blob/main/README.md) | [📖 最新 PRD](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/prd-current.zh-CN.md) | [🏗 架构文档](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/architecture.zh-CN.md) | [📝 开发日志](https://github.com/rainnochen/EvoMate/tree/main/开发日志) | [🤖 OpenClaw 接入](https://github.com/rainnochen/EvoMate/blob/main/docs-zh/openclaw-evomate-integration-prd.zh-CN.md)
---

# 2026-04-25 20:34:20：Agent Evolution Protocol v0.3 迭代

## 本次目标

根据最新产品方案，把 EvoMate 从“同 Arena 评估的 Agent Genome Demo”继续推进为“Agent Evolution Protocol MVP”。

本次重点：

- 生成多个 Child Candidates。
- 自动选择最佳子代。
- 导出 Child Genome JSON。
- 沉淀 Evolution Protocol、Genome Schema、Arena Evaluation 和 Demo Script。
- 将主 PRD 升级到 v0.3。

## 代码变化

新增：

```text
src/core/evolution-service.js
```

职责：

- 编排一次 Evolution Run。
- 内部生成 3 个 Child Candidates。
- 分别执行 Strengthening / Bridging / Risk-reducing mutation profile。
- 评估所有候选。
- 按 Overall Fitness 和 Safety 选择最佳 Child。
- 生成 Export Payload。

修改：

```text
apps/web/app.js
apps/web/styles.css
package.json
src/README.md
module-manifest.json
```

前端新增：

- Candidate selection panel。
- Export Child Genome JSON。
- Copy JSON button。
- Share Card data 展示。

## 文档变化

新增：

```text
docs-zh/evolution-protocol.zh-CN.md
docs-zh/genome-schema.zh-CN.md
docs-zh/arena-evaluation.zh-CN.md
docs-zh/demo-script-v0.3.zh-CN.md
docs-zh/prd-v0.3.zh-CN.md
```

更新：

```text
docs-zh/prd-current.zh-CN.md
docs-zh/README.zh-CN.md
docs-zh/project-handbook-current.zh-CN.md
开发日志/README.zh-CN.md
开发日志/skills/evomate-context-keeper/references/history-context.zh-CN.md
```

## 产品变化

旧闭环：

```text
Parent → Fusion → Child → Evaluation → Delta
```

新闭环：

```text
Parent → Fusion → 3 Child Candidates → Evaluate All → Select Best → Export Genome → Delta
```

这让 EvoMate 更像一个进化协议，而不是一次性混合器。

## 验证计划

本次收尾需要执行：

```bash
npm run check
```

以及语义验证：

```text
Atlas × Muse × Build Arena
→ 生成 3 candidates
→ selected child 存在
→ export payload 存在
→ evolution delta 为正向
```

## 验证结果

语法检查：

```bash
npm run check
```

结果：

```text
已通过。
```

JSON 解析：

```text
json ok
```

语义验证：

```json
{
  "candidate_count": 3,
  "selected": "Astra-Build-03",
  "selected_score": 85,
  "delta": 11,
  "status": "Breakthrough",
  "export_schema": "evomate-evolution-run-v0.1"
}
```

本地 Demo smoke test：

```bash
npm run dev
curl -I http://127.0.0.1:3030
```

结果：

```text
HTTP/1.1 200 OK
```

备注：

直接用 Node `--input-type=module` 进行语义验证时仍会出现 `MODULE_TYPELESS_PACKAGE_JSON` 提示，这是当前项目混用浏览器 ES Module 和 CommonJS dev server 的已知提示，不影响 `npm run check` 或本地 Demo。

## 下一步

- 增加 JSON schema 文件。
- 让 Arena required loci 真正影响 inheritance probability。
- 增加 Fusion Chamber 四阶段 timeline。
- 将 Copy JSON 升级为 Download JSON。
- 接入真实 Evolver Gene asset。
