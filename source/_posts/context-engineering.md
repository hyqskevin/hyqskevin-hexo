---
title: Context Engineering 上下文工程
date: 2026-10-16 00:00:00
description: Context Engineering 是 2024 年由 Anthropic 提出的 Agent 系统设计核心学科。本文梳理从 Prompt Engineering 进化到 Context Engineering 的脉络,详解 Lost in the Middle 现象与 Write / Select / Compress / Isolate 四大策略,并结合 Manus AI、Cursor、Claude Code 等工业实践,聊清楚为什么上下文工程是 Agent 时代的必修课。
categories:
  - 大模型
  - Agent
tags:
  - Context Engineering
  - Prompt Engineering
  - Lost in the Middle
  - Manus AI
  - Claude Code
---

## 一、Context Engineering 的提出与演进

### 1.1 时间坐标:从 Prompt 到 Context

2024 年之前,行业主流做法是 Prompt Engineering:把精心调过的提示词一次性塞给 LLM,期待它给出好结果。这种方式在单轮对话场景下够用,但一旦进入 Agent 时代——任务多轮、工具频繁调用、上下文不断累积——传统 Prompt Engineering 就捉襟见肘了。

从 2024 年中开始,Anthropic 工程师 Lance Martin 率先提出 "Context Engineering" 这一术语,随后在 2024 年 9 月的《Building Effective Agents with LLMs》博客里被正式确立为 Agent 系统设计的关键学科。

```
2024-06  Anthropic 工程师 Lance Martin 提出 "Context Engineering"
2024-09  Anthropic 博客《Building Effective Agents with LLMs》
2024-10  LangChain 跟进 "Context Engineering" 概念
2024-12  Manus AI 凭 Context Engineering 爆火
2025-02  DeepResearch 全面采用 Context Engineering
2025-06  Anthropic 发布 "Effective Context Engineering for AI Agents"
2025-08  Cursor / Claude Code 全面实践 Context Engineering
```

短短一年多,Context Engineering 从一个工程术语,演变成所有 Agent 框架的标配。

### 1.2 核心定义:Anthropic 怎么说

Anthropic 给出的官方表述是:

> "Context Engineering is the discipline of designing and managing the information that flows into an LLM's context window during inference."

翻译过来:上下文工程是**设计和管理在推理过程中流入 LLM 上下文窗口的信息**的学科。它不再是写好一句话提示词,而是把"喂给模型的全部信息"当作一个工程系统来对待。

用一句更直白的话说:**Prompt Engineering 关心"怎么问",Context Engineering 关心"喂什么"**。

### 1.3 上下文的 4 大来源

Anthropic 在论文里把 Context 拆解为四个来源,用一个公式表达:

$$C_{\text{total}} = C_{\text{system}} + C_{\text{tools}} + C_{\text{docs}} + C_{\text{history}}$$

| 符号 | 含义 | 典型 token 量 |
|------|------|---------------|
| $C_{\text{system}}$ | system prompt | 1-2K |
| $C_{\text{tools}}$ | 工具定义 | 1-5K |
| $C_{\text{docs}}$ | RAG 检索结果 | 5-50K |
| $C_{\text{history}}$ | 对话历史 | 10-100K |
| $C_{\text{total}}$ | 总上下文 | < 200K |

Context Engineering 要解决的核心问题就是:**让每个 token 的信息密度最大化,把重要信息放在模型最关注的位置,避免"Lost in the Middle"现象**。

---

## 二、Lost in the Middle:被忽略的中间地带

### 2.1 Liu 2023 的经典实验

Liu 等人在 2023 年发表的 *Lost in the Middle* 论文揭示了一个反直觉的现象:LLM 对超长上下文中**开头和结尾**的信息最敏感,而**中间位置**的信息几乎被忽略。

```
给 LLM 50 段文档
其中关键信息分别位于:
  - 位置 A:开头
  - 位置 B:中间
  - 位置 C:结尾

测试 LLM 在不同位置提取关键信息的准确率
```

实验结果如下:

| 关键信息位置 | 准确率 |
|------------|--------|
| 开头 | 70% |
| **中间** | **40%** ❌ |
| 结尾 | 70% |

中间位置的准确率骤降到 40%,这意味着当你以为把关键证据塞进 RAG 结果里就行时,其实有一半概率模型根本"看不见"。

![Lost in the Middle 现象示意](https://hyqskevin.github.io/pic/agent/lost-in-the-middle.png)

这个现象的根因与 Transformer 的注意力机制有关:首尾的 token 在 attention 计算时会反复被 query 引用,容易获得稳定的注意力权重;而中段的 token 容易被"上下文稀释",最终在 softmax 时被压平。

### 2.2 信息密度函数

为了量化 Context Engineering 的目标,可以定义单位 token 的有用信息密度:

$$\rho_{\text{info}} = \frac{I_{\text{useful}}(C)}{L_{\text{tokens}}(C)}$$

其中 $I_{\text{useful}}(C)$ 是 context $C$ 中对当前任务有用的信息量,$L_{\text{tokens}}(C)$ 是其 token 长度。Context Engineering 的目标就是**最大化 $\rho_{\text{info}}$**——同样的 token 预算,装下更多"对当前决策有用"的信息。

### 2.3 应对策略

针对 Lost in the Middle,工程师们总结出三条应对策略:

- **关键信息放在开头或结尾**,避免丢进中间
- **重新排序 RAG 检索结果**——把最相关的放首尾,最不相关的放中段
- **用显式标记强调**——比如 `<important>...</important>`,把模型的注意力锚定到关键内容

这三条本质上都在"操纵模型的注意力分布",是 Context Engineering 最朴素也最有效的技巧。

---

## 三、四大策略:Write / Select / Compress / Isolate

Context Engineering 的全部实操,可以归纳为四类动作:**写入、选择、压缩、隔离**。

### 3.1 Write Context(写入)

主动把工具结果、用户偏好、中间结论**写回** context,让模型在后续轮次仍然能看到这些信息。最简单的实现是把工具调用结果追加到 messages 列表:

```python
# 工具结果保存到 context
messages.append({
    "role": "tool",
    "content": json.dumps(tool_result)
})
```

写入时的关键设计:

- 工具结果**结构化存储**(JSON 而非纯文本)
- 重要信息**加标注**(`<important>...</important>`)
- 避免**冗余信息**(同一信息不重复出现)

写入是 Context Engineering 的"地基":如果连关键信息都没写进去,后面的选择和压缩都无从谈起。

### 3.2 Select Context(选择)

从海量候选中筛出最相关的内容塞进上下文。RAG 是典型的 Select 场景,通常分为三层:

| 层级 | 工具 | 目标 |
|------|------|------|
| 粗排 | 向量检索(BM25 / Embedding) | 高召回 |
| 精排 | Reranker(bge-reranker) | 高精度 |
| 摘要 | LLM 压缩 | 保留关键

执行流程是:**任务分类 → 决定需要哪些信息 → 检索过滤 → 摘要压缩 → 去重去噪**。

Select 的难点在于"刚刚好":选少了模型缺信息,选多了触发 Lost in the Middle。实际工程里通常配合 rerank 分数做阈值截断,而不是固定 top-K。

### 3.3 Compress Context(压缩)

当 context 接近上限,必须主动压缩。一个常见的实现:

```python
def compress_context(messages):
    if count_tokens(messages) > MAX_TOKENS:
        # 用 LLM 摘要早期消息
        old_messages = messages[:-5]  # 保留最近 5 轮
        summary = llm(f"摘要以下对话:\n{old_messages}")
        return [summary_message] + messages[-5:]
    return messages
```

压缩策略:

- **早期消息摘要**——保留关键信息
- **工具结果截断**——只保留关键字段
- **结构化转文本**——JSON → 表格
- **删除冗余**——相同信息不重复

注意压缩是有损操作,要做的事后检查:压缩后的 summary 是否仍包含模型继续推理所需的关键事实(如用户偏好、已完成步骤、中间结论)。

### 3.4 Isolate Context(隔离)

通过多 Agent 分工,把不同任务的 context 隔离在各自的子 Agent 里,避免互相污染:

```python
def orchestrator_agent(task):
    # 调度
    sub_result_1 = research_agent.do(task.part1)
    sub_result_2 = code_agent.do(task.part2)
    
    # 隔离:子 Agent 的 context 不污染主 Agent
    return combine(sub_result_1, sub_result_2)
```

这种方式让每个 Agent 专注自己任务,减少 context 互相干扰,也更容易调试和并行化。

隔离的本质是**用架构复杂度换 context 清晰度**:每个子 Agent 只看自己那一小段 context,自然不容易"被中间地带干扰"。

---

## 四、工业实践:Manus AI、Cursor、Claude Code

### 4.1 Manus AI 的爆火

2024 年 12 月,Manus AI 横空出世并迅速拿到数亿融资,背后正是 Context Engineering 的极致实践:

| 策略 | 实施方式 |
|------|---------|
| 任务分解 | 复杂任务 → 多步子任务 |
| 虚拟环境 | 沙箱执行代码(隔离) |
| 工具路由 | LLM 决定调用哪个工具 |
| Memory Bank | 关键信息结构化存储 |
| Context Compaction | 长任务定期压缩 |

Manus 给行业留下的最重要的 insight 是:**Context Engineering 不是"提示技巧"——是 Agent 系统设计的核心工程问题**。它第一次让大众看到,当 context 被当作"系统资源"认真管理时,Agent 能爆发出怎样的能力。

### 4.2 Cursor 的 @ 引用与多 Workspace

Cursor 1.0+ 的实现路径:

```
1. @ 符号引用文件 / 代码块
2. 自动 RAG 当前项目代码
3. 工具调用:grep / read / edit / run
4. 长对话定期压缩
5. 多 Tab / 多 Workspace
```

通过 @ 引用,用户主动把指定文件注入上下文(Write);自动 RAG 是 Select;长对话压缩是 Compress;多 Workspace 是 Isolate——四种策略一个不少。

### 4.3 Claude Code 的工程化落地

Claude Code 把 Context Engineering 工程化做得更彻底:

- 每次对话独立 context
- 工具调用结果保存为结构化 JSON
- 长任务通过 `/clear` 重置 context
- 子任务通过 Agent 工具分发,context 互相隔离

特别值得一提的是 `/clear`:它把"重置 context"做成了一个用户可显式触发的动作。这反映出 Claude Code 的设计哲学——**context 不是越多越好,而是越精准越好**。

---

## 五、公式汇总与关键洞察

### 5.1 三个核心公式

**公式 · 上下文窗口利用率**

$$\eta_{\text{context}} = \frac{\text{有用 tokens}}{\text{总 tokens}}$$

目标:$\eta_{\text{context}} > 0.7$,即 70% 以上的 token 都是有用的。

**公式 · 工具结果压缩**

$$C_{\text{compressed}} = f_{\text{compress}}(C_{\text{raw}}, \text{ratio})$$

典型压缩率:

- 原始 JSON → 文本表格:5-10x 压缩
- 长文档 → 关键句:10-50x 压缩
- 对话历史 → 摘要:5-20x 压缩

**公式 · Rerank 位置优化**

$$C_{\text{ordered}} = \text{Reorder}(C_{\text{retrieved}})$$

排序策略:

```
[Most Relevant] [Highly Relevant] [Less Relevant] [Less] ...
   ↑               ↑                                ↑
位置 1          位置 2                       位置 N

问题:模型关注位置 1 和位置 N,忽略中间
解法:让最相关的放位置 1,最次相关的放位置 N/2
```

### 5.2 关键洞察

1. **Context Engineering = Agent 时代的新学科**(2024 提出),正在替代 Prompt Engineering 成为新的工程重心
2. **Lost in the Middle**——LLM 关注首尾、忽略中间,这是物理层面的注意力限制
3. **Anthropic 2024-09 是 Context Engineering 的奠基论文**,后续所有实践都受其影响
4. **Manus AI / Cursor / Claude Code** 都在深度实践,工业界已达成共识
5. **未来所有 Agent 框架都会引入 Context Engineering 标准**——它会和"system prompt"一样,成为 Agent 开发的基础设施

### 5.3 必读论文与延伸思考

核心 3 篇:

1. **Anthropic 2024-09《Building Effective Agents with LLMs》** ⭐⭐⭐
2. **Anthropic 2025-06《Effective Context Engineering for AI Agents》**
3. **Liu et al. 2023《Lost in the Middle》** ⭐⭐

延伸思考题:

- Q1. Context Engineering 与 Prompt Engineering 的本质区别是什么?
- Q2. 为什么 LLM 会"丢失中间信息"?
- Q3. 200K context window 是不是越多越好?
- Q4. 如何压缩 context 但不损失关键信息?
- Q5. Multi-Agent 怎么避免 context 互相污染?

---

## 模型版本说明

⚠️ **以发布时为准**:本文涉及的模型名称、token 上限、工具版本均按 2024-2025 年公开资料整理。Claude、Cursor、Manus 等产品更新频繁,具体能力可能随版本变化,请以发布时官方文档为准。