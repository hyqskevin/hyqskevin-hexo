---
title: ReAct 框架说明汇总
date: 2026-10-18 00:00:00
description: 汇总 ReAct 推理-行动交替范式的核心定义、与 CoT 的差异、Agent Loop 控制流的最小实现、DSPy ReAct 模块、多工具场景下的成本与准确率数据，以及与 Scaffolding、Harness、Sub-agent 等概念的关联。
categories:
  - AI
tags:
  - ReAct
  - Agent
  - CoT
  - DSPy
  - LLM
  - 多工具
  - 推理范式
---

## 一、ReAct 核心定义

**ReAct（Reasoning + Acting）** 是当前主流 Agent 采用的推理-行动交替模式：模型先**推理**下一步该做什么，再**执行**工具调用拿到结果，再根据结果继续**推理**，如此循环直至任务完成。

### 1.1 ReAct 与 CoT 的差异

CoT（Chain-of-Thought）只做纯推理、输出文本答案；ReAct 则把推理与行动交替进行，输出工具调用和最终答案。

| 维度 | CoT | ReAct |
|------|-----|-------|
| 核心 | 只推理不行动 | 推理与行动交替 |
| 输出 | 纯文本答案 | 工具调用 + 最终答案 |
| 适用 | 数学、逻辑推理 | 需要外部工具的多步骤任务 |
| 循环 | 无 | 有（直到任务完成） |

## 二、Agent Loop 控制流

```
感知 → 决策 → 行动 → 反馈
  ↑                    ↓
  └────── 循环 ────────┘
```

### 2.1 最小实现（约 20 行）

下面是从《你不知道的 Agent：原理、架构与工程实践》中抽出的最小循环实现，展示了 ReAct 在消息层面的最简形态：

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

无论是支持子 Agent、上下文压缩，还是加载 Skills，主循环基本没有变化——这就是 ReAct 范式工程化后的稳定性所在。

## 三、DSPy ReAct 实现

DSPy 通过声明式 Signature 描述输入输出字段，再用 `dspy.ReAct` 包装工具列表，模型会在签名驱动下自动决定调用哪个工具、何时停止：

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

这个例子非常贴合 ReAct 的本质：模型先思考需要哪些信息，再依次调用工具，最后汇总成答案。

## 四、ReAct + 多工具成本数据

| 配置 | Token | 成本 | 准确率 | 提升 |
|------|-------|------|--------|------|
| ReAct + many tools | 6.8K | $0.038 | 79% | 基准 |
| 优化后 | - | +$0.016 | +8pt | 成本 +42% |

数据来源为多 Agent 架构技术报告。可见 ReAct 在多工具场景下准确率有明显优势，但每一步推理都要付出额外的 token 代价，成本与效果之间的权衡需要按业务场景具体评估。

## 五、相关概念

| 概念 | 说明 | 与 ReAct 的关系 |
|------|------|----------------|
| CoT | Chain-of-Thought，纯推理 | ReAct = CoT + Action |
| Scaffolding | 思考脚手架（提示词结构） | 给 ReAct 提供推理框架 |
| Harness | 执行骨架（工具执行、反馈路由） | ReAct 的"怎么跑" |
| Tool Use | 工具调用能力 | ReAct 的"行动"部分 |
| Sub-agent | 子代理 | 可嵌套 ReAct 循环 |

把这五个概念串起来看：CoT 提供了"如何思考"的能力，Scaffolding 把这种能力组织成结构化提示，Harness 负责执行与反馈，Tool Use 是落地动作，Sub-agent 则把整个 ReAct 循环封装为可复用的单元。

## 六、关键引用

> ReAct（Reasoning + Acting）是主流 Agent 采用的推理-行动交替模式：模型先推理下一步做什么，再执行工具调用，再根据结果继续推理，如此循环直到任务完成。
> ——《Agent 基础讲解》

> Agent Loop 的核心实现逻辑抽象后其实不到 20 行代码……从最小实现一路扩展到支持子 Agent、上下文压缩和 Skills 加载，主循环基本没有变化。
> —— 阿里《你不知道的 Agent：原理、架构与工程实践》

## 模型版本说明

本文涉及的模型名为源稿保留信息（`claude-opus-4-6` 等）。

⚠️ 实际使用的模型与版本以发布时对应的服务方提供为准；不同厂商、不同时段的命名与可用性可能发生变化，请以官方文档为最终依据。

## 七、总结

围绕 ReAct 的内容在知识库中分散在多份资料里，但没有一篇专门深入讲解 ReAct 原始论文（Yao et al., 2022）或与其他 Agent 架构（Reflexion、LATS 等）系统对比的文档。现有内容按用途可归为四类：

1. **概念定义**：课程讲义对 ReAct 范式的标准化阐释。
2. **代码实现**：阿里文章里的 20 行最小循环、DSPy Skill 里的 `dspy.ReAct` 示例。
3. **成本数据**：Multi-Agent 架构报告里 ReAct + 多工具的准确率与单价。
4. **考试题目**：知识工坊问卷中针对 ReAct 范式的判断与简答。

目前相对缺失的部分包括：ReAct 原论文的逐段解读、ReAct 与 Reflexion / LATS 等进阶 Agent 架构的横向对比，以及 ReAct 在交易、研究等具体业务场景下的落地案例。后续可按需补充。