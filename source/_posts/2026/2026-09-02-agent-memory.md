---
title: Agent 记忆系统论文速读
date: 2026-09-02 00:00:00
description: Agent 记忆系统 3 篇核心论文速读：MemGPT（LLM 当 OS / 虚拟内存管理上下文）、Generative Agents（斯坦福小镇 / 记忆流 + 反思 + 规划）、Reflexion（语言反馈代替 RL 奖励）。记忆分层 + 工程启示。
categories:
  - notes
tags:
  - Agent
  - 记忆系统
  - MemGPT
  - 论文速读
  - Reflexion
---

Agent 记忆系统 3 篇核心论文速读：**MemGPT**（LLM 当 OS / 虚拟内存管理上下文）、**Generative Agents**（斯坦福小镇 / 记忆流 + 反思 + 规划）、**Reflexion**（语言反馈代替 RL 奖励）。

## 一、3 篇论文速览

| 论文 | 年份 | 核心贡献 |
|---|---|---|
| **MemGPT** | 2023 | 把 LLM 上下文窗口当虚拟内存管理 |
| **Generative Agents** | 2023 | 记忆流 + 反思 + 规划 = 人类行为模拟 |
| **Reflexion** | 2023 | 语言反馈（而非 RL 奖励）驱动 Agent 自我改进 |

## 二、MemGPT（2023）

- 论文：[2310.08560](https://arxiv.org/abs/2310.08560) | UC Berkeley
- 代码：[letta-ai/letta](https://github.com/letta-ai/letta)

### 2.1 核心洞察

**LLM 上下文窗口 = 操作系统的 RAM**

```text
操作系统：
  - RAM 有限 → 用硬盘做虚拟内存
  - Page fault → 从硬盘加载到 RAM

MemGPT：
  - Context 有限 → 用外部存储做"虚拟上下文"
  - Context 满了 → 把不重要的信息"换出"到外部存储
  - 需要时 → 再"换入"
```

### 2.2 两层记忆

```text
Main Context（RAM，有限）：
  - System instructions
  - Working context（当前任务相关）
  - FIFO message queue

External Context（硬盘，无限）：
  - Recall storage（对话历史）
  - Archival storage（长期知识）
```

### 2.3 Agent 自主管理

```python
# MemGPT 关键：LLM 自己决定何时"换入换出"
def memgpt_loop(llm, tools):
    while True:
        # LLM 输出可能是：
        # 1. 回复用户
        # 2. 调用工具
        # 3. 更新 working context（换出旧信息）
        # 4. 搜索 external context（换入重要信息）

        response = llm.generate(current_context)

        if response.type == "message":
            return response.content
        elif response.type == "tool_call":
            result = execute(response.tool, response.args)
            append_to_context(result)
        elif response.type == "context_edit":
            update_working_context(response.changes)
        elif response.type == "archival_search":
            results = search_external(response.query)
            append_to_context(results)
```

### 2.4 启示

- **Agent 自己管理上下文**，不是外部框架硬编码
- **"换出"策略**至关重要（什么该丢？）
- **搜索是"换入"的主要方式**

## 三、Generative Agents（2023）

- 论文：[2304.03442](https://arxiv.org/abs/2304.03442) | Stanford
- 作者：Joon Sung Park 等

### 3.1 核心贡献

**25 个 AI Agent 在虚拟小镇里"生活"**——它们有记忆、会反思、会规划，表现出**类人行为**（如组织派对、传播信息）。

### 3.2 记忆架构 3 组件

```text
1. Memory Stream（记忆流）
   - 所有观察/行为按时间戳存储
   - 不做筛选，全量记录
   - 用自然语言描述

2. Retrieval（检索）
   - 相关性（embedding 相似度）
   - 时近性（recency，越近权重越高）
   - 重要性（importance，LLM 评分 1-10）
   → 综合 = score = relevance × recency × importance

3. Reflection（反思）
   - 定期总结记忆流
   - 生成"高层次洞察"
   - 例：从"Klaus 喜欢音乐"+"Klaus 在练吉他"→ 反思"Klaus 对音乐有热情"
```

### 3.3 规划（Planning）

```text
日常规划：
  - Agent 每天早上生成当日计划
  - 按小时分解
  - 执行时根据观察动态调整

例：
  "Isabella 早上 8 点起床"
  → "8-9 点吃早餐"
  → "9-12 点在咖啡店工作"
  → "12-13 点吃午饭"
  → ...
```

### 3.4 启示

- **记忆流**：不要筛选，全量存
- **检索权重**：相关性 × 时近性 × 重要性
- **反思**：定期从具体记忆→抽象洞察
- **规划**：Agent 应该"有日程"

## 四、Reflexion（2023）

- 论文：[2303.11366](https://arxiv.org/abs/2303.11366) | Northeastern
- 作者：Noah Shinn 等

### 4.1 核心洞察

```text
传统 RL：
  Agent 做错 → reward signal（数字）→ 更新权重
  → 需要大量训练样本

Reflexion：
  Agent 做错 → 语言反馈（"你漏了边界条件"）→ 下次改进
  → 不需要更新权重，只需要在 context 里加反馈
  → 少量样本即可改进
```

### 4.2 架构

```python
def reflexion_loop(agent, task, max_retries=3):
    memory = []

    for attempt in range(max_retries):
        # 1. Agent 执行任务（带历史反馈）
        result = agent.execute(task, feedback=memory)

        # 2. 评估结果
        if result.success:
            return result

        # 3. 生成语言反馈（自我反思）
        feedback = agent.reflect(
            task=task,
            attempt=result,
            previous_feedback=memory
        )
        memory.append(feedback)

    return None  # 超过重试次数
```

### 4.3 语言反馈示例

```text
Attempt 1：
  "写一个二分查找函数"
  → Agent 输出代码 → 测试失败（没处理空数组）

Reflexion：
  "上次代码在空数组时返回 None，应该返回 -1。另外没有处理 left > right 的边界条件。"

Attempt 2：
  → Agent 修复代码 → 测试通过
```

### 4.4 启示

- **语言反馈比 RL 奖励**信息密度高 100×
- **不需要重训练**——只需要改 context
- **自我反思**（"我为什么错了"）比外部反馈更有效

## 五、3 篇对比

| 维度 | MemGPT | Generative Agents | Reflexion |
|---|---|---|---|
| 解决什么 | 上下文不够 | 社交行为模拟 | 任务自我改进 |
| 记忆类型 | 虚拟内存（两层） | 记忆流 + 反思 | 语言反馈 |
| 管理 | LLM 自主 | 算法定义 | LLM 反思 |
| 适用 | 长对话 Agent | 多 Agent 社交 | 编程 / 推理 Agent |

## 六、5 条工程启示

### 6.1 上下文管理 = Agent OS

```text
MemGPT 的洞察：
  Agent 需要"操作系统"来管理上下文
  - 什么信息在 context 里？
  - 什么信息在外部存储？
  - 何时换入换出？

实现：Letta（原 MemGPT）已开源可直接用
```

### 6.2 记忆流 > 分类记忆

```text
Generative Agents 洞察：
  不要试图把记忆分为"工作/长期/语义"
  而是统一"记忆流"（全量存），按需检索

检索权重 = relevance × recency × importance
  - 三个维度互不替代
```

### 6.3 反思是记忆的"升华"

```text
原始记忆 = 碎片（"Klaus 喜欢音乐"、"Klaus 在练吉他"）
反思记忆 = 洞察（"Klaus 对音乐有热情"）

反思频率：每 N 条记忆触发一次反思
  - N = 50-100（视记忆密度）
```

### 6.4 语言反馈 = 零成本自我改进

```text
传统：RLHF（需要人工标注）→ 成本高
Reflexion：LLM 自己反思 → 成本 ≈ 1 次 LLM 调用

实战：Agent 每次失败后加一条"反思"到 context
  → 下次尝试时自动避免同类错误
```

### 6.5 3 层记忆架构（实战推荐）

```python
class AgentMemory:
    def __init__(self):
        self.working = []       # 工作记忆（当前 context）
        self.episodic = []       # 情景记忆（全量 JSONL）
        self.semantic = {}       # 语义记忆（向量库）

    def recall(self, query, k=5):
        """混合检索：向量 70% + 关键词 30%"""
        vec_results = vector_db.search(query, k=k)
        kw_results = keyword_search(query, k=k//2)
        return merge(vec_results, kw_results)

    def reflect(self):
        """定期反思 → 生成洞察 → 更新 semantic"""
        recent = self.episodic[-50:]
        insights = llm.summarize(recent)
        self.semantic[insights.key] = insights
```

## 七、3 个开源项目

- [letta-ai/letta](https://github.com/letta-ai/letta) — MemGPT 演进
- [joonspk-research/generative_agents](https://github.com/joonspk-research/generative_agents) — 斯坦福小镇
- [noahshinn/reflexion](https://github.com/noahshinn/reflexion) — Reflexion

---

> **Agent 记忆系统核心**：**MemGPT 教你管上下文，Generative Agents 教你存记忆，Reflexion 教你自我改进**。三篇合在一起 = **完整的 Agent 记忆架构**：虚拟内存（短期）+ 记忆流（长期）+ 反思（改进）。**记忆系统是基础设施，从 Day 1 就要设计**。