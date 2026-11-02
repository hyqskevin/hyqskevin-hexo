---
title: ReAct 框架说明汇总
date: 2026-09-05 00:00:00
description: ReAct（Reasoning + Acting）框架汇总：核心定义、ReAct vs CoT 对比、Agent Loop 20 行 TypeScript 最小实现、DSPy ReAct 代码、Token/成本/准确率实测、5 类相关概念、3 个变体、5 条何时用 ReAct 决策树。
categories:
  - notes
tags:
  - ReAct
  - Agent
  - 推理
  - DSPy
  - Multi-Agent
---

ReAct（Reasoning + Acting）是目前主流 Agent 采用的推理-行动交替模式。这篇是 Obsidian 全文搜索后的资料汇总：核心定义、最小实现、DSPy 代码、成本数据、变体对比，配上「什么时候该用 ReAct」的决策树。

## 一、ReAct 核心定义

> 模型先**推理**下一步做什么，再**执行**工具调用，再根据结果继续**推理**，如此循环直到任务完成。

**关键词**：推理 + 行动 + 循环。每次循环 = 一次「思考 + 一次工具调用」。

## 二、ReAct vs CoT（Chain-of-Thought）

| 维度 | CoT | ReAct |
|------|-----|-------|
| 核心 | 只推理不行动 | 推理和行动交替 |
| 输出 | 纯文本答案 | 工具调用 + 最终答案 |
| 适用 | 数学/逻辑推理 | 需要外部工具的多步骤任务 |
| 循环 | 无 | 有（直到任务完成） |

**简单判断**：能纯推理解决 → CoT；要查数据/调 API/写文件 → ReAct。

## 三、Agent Loop 控制流（ReAct 的运行时）

```
感知 → 决策 → 行动 → 反馈
  ↑                    ↓
  └────── 循环 ────────┘
```

### 3.1 最小实现（约 20 行 TypeScript）

```typescript
const messages: MessageParam[] = [{ role: "user", content: userInput }];
while (true) {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 8096,
    tools: toolDefinitions,
    messages,
  });
  if (response.stop_reason === "tool_use") {
    const toolResults = await Promise.all(
      response.content
        .filter((b) => b.type === "tool_use")
        .map(async (b) => ({
          type: "tool_result" as const,
          tool_use_id: b.id,
          content: await executeTool(b.name, b.input),
        }))
    );
    messages.push({ role: "assistant", content: response.content });
    messages.push({ role: "user", content: toolResults });
  } else {
    return response.content.find((b) => b.type === "text")?.text ?? "";
  }
}
```

**实现要点**：
1. `while (true)` 循环
2. 每次迭代调一次 LLM
3. `stop_reason === "tool_use"` → 执行工具 → 把 tool_use + tool_result 追加到 messages
4. 否则退出循环，返回最终文本

**来源**：阿里《你不知道的 Agent：原理、架构与工程实践》

## 四、DSPy ReAct 实现（Python）

```python
from dspy.predict import ReAct

# Define tools
def search_wikipedia(query: str) -> str:
    """Search Wikipedia for information."""
    return search_results

def calculate(expression: str) -> float:
    """Evaluate a mathematical expression."""
    return eval(expression)

# Create ReAct agent
class ResearchQA(dspy.Signature):
    """Answer questions using available tools."""
    question = dspy.InputField()
    answer = dspy.OutputField()

react = ReAct(ResearchQA, tools=[search_wikipedia, calculate])

# Agent decides which tools to use
result = react(question="How old was Einstein when he published special relativity?")
# Internally:
# 1. Thinks: "Need birth year and publication year"
# 2. Acts: search_wikipedia("Albert Einstein")
# 3. Acts: search_wikipedia("Special relativity 1905")
# 4. Acts: calculate("1905 - 1879")
# 5. Returns: "26 years old"
```

**DSPy 优势**：自动优化 prompt，无需手写「请按以下步骤…」指令。

## 五、ReAct + 多工具成本数据

| 配置 | Token | 成本 | 准确率 | 备注 |
|------|-------|------|--------|------|
| ReAct + many tools | 6.8K | $0.038 | 79% | 基准 |
| 优化后 | - | +$0.016 | +8pt | 成本 +42% |

**解读**：ReAct 准确率提升是拿成本换的（每 8pt 准确率 ≈ 0.002 USD/次）。工具越多，token 越长，**需要按场景平衡成本与准确率**。

**来源**：Multi-Agent 架构报告

## 六、相关概念对照

| 概念 | 说明 | 与 ReAct 关系 |
|------|------|--------------|
| **CoT** | Chain-of-Thought，纯推理 | ReAct = CoT + Action |
| **Scaffolding** | 思考脚手架（提示词结构） | 给 ReAct 提供推理框架 |
| **Harness** | 执行骨架（工具执行、反馈路由） | ReAct 的"怎么跑" |
| **Tool Use** | 工具调用能力 | ReAct 的"行动"部分 |
| **Sub-agent** | 子代理 | 可嵌套 ReAct 循环 |

## 七、3 个 ReAct 变体

| 变体 | 核心差异 | 适用场景 |
|------|----------|----------|
| **Reflexion** | 加 self-reflection，每步检查上一轮结果 | 长任务、需要纠错的场景 |
| **LATS** | (Language Agent Tree Search) 树搜索，多分支 ReAct | 探索性强、需要多方案对比 |
| **Self-Ask** | 让 LLM 主动生成子问题 | 多跳问答（multi-hop QA）|

> **Yao et al., 2022** 原始 ReAct 论文里也有简单 Reflexion 变体。社区主流是 Reflexion + LATS。

## 八、什么时候该用 ReAct（决策树）

```
你的任务需要外部信息吗？
  │
  ├─ 不需要 → CoT（纯推理）
  │
  └─ 需要 → 单步能拿到吗？
       │
       ├─ 能 → Function Calling（单次工具调用，无需循环）
       │
       └─ 不能 → 多步骤且依赖前一步结果？
            │
            ├─ 否 → DAG 工作流（多工具并行）
            │
            └─ 是 → ✅ ReAct
                 │
                 └─ 还要纠错？→ 加 Reflexion
                 │
                 └─ 还要探索多方案？→ 加 LATS
```

**3 条使用红线**：
- ❌ 不要给 LLM 一堆无关工具（token 暴涨、准确率反降）
- ❌ 不要让 ReAct 循环超过 10 步（成本失控 + 容易卡死）
- ❌ 不要在 prompt 里写"请按以下步骤…"（DSPy 自动优化比你手写好）

## 九、关键引用

> "ReAct（Reasoning + Acting）是主流 Agent 采用的推理-行动交替模式：模型先推理下一步做什么，再执行工具调用，再根据结果继续推理，如此循环直到任务完成。"
> ——《Agent 基础讲解》

> "Agent Loop 的核心实现逻辑抽象后其实不到 20 行代码...从最小实现一路扩展到支持子 Agent、上下文压缩和 Skills 加载，主循环基本没有变化。"
> —— 阿里《你不知道的 Agent》

## 十、参考资料

- [ReAct 原始论文 (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- [DSPy 官方文档 - ReAct](https://dspy-docs.vercel.app/api/modules/ReAct)
- [阿里《你不知道的 Agent》](https://developer.aliyun.com/article/...)
- 源稿：`4-doc/20260629-ReAct 框架说明汇总.md`

---

*汇总于 2026-09-05；源稿整理于 2026-06-26*
