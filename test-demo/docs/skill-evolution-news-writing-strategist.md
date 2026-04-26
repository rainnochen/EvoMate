# Skill Evolution: news-writing-strategist

## Parent Skills

- `writing-assistant`: 提供从模糊想法到选题、框架、内容的写作路径。
- `news-aggregator-skill`: 提供多源新闻聚合、事实与推断分离、时间与来源锚定。

## Why These Parents Fit

这两个 parent 的连接点不是“都能输出文字”，而是都在解决同一个断层：

- `news-aggregator-skill` 能告诉你发生了什么、哪些信号更重要
- `writing-assistant` 能告诉你怎么把一个想法写清楚、写成结构化内容

但单独使用时，中间仍有空档：

- 只做聚合，容易停在“信息很多，但不知道怎么写”
- 只做写作，容易停在“结构不错，但材料不够扎实”

因此 child 的目标不是并列组合，而是把 `signal selection -> angle choice -> structure design` 串成一条链路。

## Mapping Into agent-evolver Parents

- `parent_writing_assistant/agent.md` 被编码成 `discover -> analyze -> plan -> validate -> report`，核心基因是“先判断清晰度，再决定是否先挖掘再框架”。
- `parent_news_aggregator/agent.md` 保留多源聚合、事实与推断分离、来源和时间锚点、冲突保留这些关键约束。

## Actual Evolution Outcome

这版 `agent-evolver` 的 crossover 更偏角色竞争式继承，而不是平均混合：

- `discover / analyze` 更容易由“写作诊断”一侧接管
- `plan / validate / report` 更容易被“新闻聚合”一侧的结构化约束拉走

所以这次 child 最自然的进化方向不是“新闻写手”，而是：

`先筛信号，再选角度，再压结构的新闻写作策略 skill`

## What Actually Mutated

真正有价值的突变点是蒸馏对象发生了变化：

- Parent A 的对象是 `idea clarity`
- Parent B 的对象是 `news signal quality`
- Child 的对象变成了 `which signal is worth writing and how to frame it`

这意味着 child 不只是写，也不只是看新闻，而是在“能不能写、该怎么写、写到什么边界”为核心做判断。

## Limits

- 如果输入只有空泛观点而没有具体新闻材料，child 会退化成普通写作辅助
- 如果输入只有新闻列表而没有受众和写作目标，child 会退化成普通新闻整理
- 当前 mutation engine 仍会注入少量工程模板规则，最终对外发布版需要人工压一层语言
