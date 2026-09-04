---
title: Agent 基础讲解（中）：上下文与记忆
date: 2026-09-02 00:00:00
description: Agent 基础讲解中篇：上下文工程 5 层结构 + 3 种压缩策略、4 种记忆类型（工作 / 程序 / 情景 / 语义）、Context Rot 解决、ChatGPT / OpenClaw 记忆整合实战、5 条避坑。
series:
  name: agent-basics
  index: 2
  total: 3
categories:
  - notes
tags:
  - Agent
  - 上下文
  - 记忆
  - Context Engineering
  - 教程
---

（上）讲概念 + 工具。本篇（中）讲**上下文 + 记忆**——这是 Agent 时代最核心的两个工程问题。

## 一、Context Rot：最常见的失效模式

Agent 跑 10-20 轮后**性能下降**——不是因为模型变笨，而是**上下文被噪声稀释**。

```text
LLM attention 预算固定 128K
  → 长对话 = 旧信息占用大量 attention
  → 关键信息被"挤到角落"
  → 模型"看不见"关键信息

典型症状：
  - 早期指令被"遗忘"
  - 工具结果互相混淆
  - 重复犯错（已纠正的问题又来）
  - 输出格式跑偏
```

**解法**：上下文工程——5 层结构 + 3 种压缩策略。

## 二、5 层上下文结构

```text
1. 常驻层（system prompt + 核心指令）
   → 始终存在，永远不压缩
   → 占 1-5K tokens

2. 按需加载层（Skills / Tools 描述）
   → 描述符常驻（100 words/skill）
   → 完整内容触发加载
   → 占 1-10K tokens（动态）

3. 运行时注入层（当前任务上下文）
   → 用户消息 + 工具结果
   → 占 1-50K tokens

4. 记忆层（MEMORY.md / 向量库）
   → 跨 session 持久
   → 通过 RAG 检索再注入
   → 检索结果 0.5-2K tokens

5. 系统层（工具定义 / Skills 元数据）
   → Tools 描述符
   → Skills 列表
   → 占 1-3K tokens
```

## 三、3 种压缩策略

### 3.1 滑动窗口（简单）

```python
def truncate_context(messages, max_tokens=4000):
    """保留最近 max_tokens 的消息"""
    result = []
    total = 0
    for msg in reversed(messages):
        msg_tokens = len(msg.content) // 4  # 粗略估算
        if total + msg_tokens > max_tokens:
            break
        result.insert(0, msg)
        total += msg_tokens
    return result
```

**优点**：简单
**缺点**：丢失关键历史信息

### 3.2 LLM 摘要（智能）

```python
def summarize_history(messages, llm):
    """用 LLM 总结旧消息"""
    text = "\n".join([m.content for m in messages[:-5]])
    prompt = f"总结以下对话历史，保留关键决策和事实（200 字内）：\n\n{text}"
    summary = llm.complete(prompt)
    return summary
```

**优点**：保留语义
**缺点**：token 成本 + 摘要误差

### 3.3 工具结果替换（实用）

```python
def replace_tool_results(messages, max_size=500):
    """把大工具输出换成摘要引用"""
    for msg in messages:
        if msg.role == "tool" and len(msg.content) > max_size:
            msg.content = f"[完整结果已省略，长度 {len(msg.content)}，需要时调用 ID 重新获取]"
    return messages
```

**优点**：保留工具 ID
**缺点**：模型可能忘了 ID

## 四、Prompt Caching（关键优化）

```text
LLM API 的 prompt caching 规则：
  - 按 prefix 匹配（开头必须完全一致）
  - 缓存命中 → 价格 -90%，速度 -10 倍

实战：
  1. system prompt 放在最前面（不变的部分）
  2. 长上下文放在 system 后（多轮复用）
  3. 用户消息放最后（每次变）
  
效果：
  - 1000 tokens 缓存命中 → $0.0001（vs $0.001 全价）
  - 100 万次长对话 → 省 90% 成本
```

**关键**：把"常驻内容"放 prefix，把"每次变的内容"放 suffix。

## 五、4 种记忆类型

### 5.1 工作记忆（Working Memory）

```text
范围：当前任务
存储：context（内存）
例子：对话历史 + 当前工具结果
生命周期：session 结束清空
```

### 5.2 程序性记忆（Procedural Memory）

```text
范围：跨任务可复用
存储：Skills / Prompts / Templates
例子："查订单 skill" → "差旅规划 skill"
生命周期：永久
更新方式：人类或 LLM 评估后更新
```

### 5.3 情景记忆（Episodic Memory）

```text
范围：具体事件
存储：JSONL（追加写）
例子："昨天 14:23 用户问了订单问题 → 解决了"
生命周期：永久 + 时间戳
用途：复盘 / 个性化
```

### 5.4 语义记忆（Semantic Memory）

```text
范围：知识
存储：向量库 + 文档
例子：用户偏好 / 项目背景
生命周期：永久
检索：按语义相似度
```

## 六、ChatGPT 4 层记忆 vs OpenClaw 混合检索

### 6.1 ChatGPT 4 层

```text
1. Session Metadata（会话元信息）
2. User Memory（用户偏好）
3. Conversation Summary（对话摘要）
4. Current Session（当前会话）
```

**优点**：自动 / 缺点：用户不可控

### 6.2 OpenClaw 混合检索

```text
70% 向量检索 + 30% 关键词检索
  → 向量：语义相似
  → 关键词：精确匹配
  → 混合：互补

实战：
  - 用户问"上次那个产品怎么样" → 关键词"产品"命中 + 向量找相似话题
  - 召回率 +20% vs 纯向量
```

## 七、记忆整合流程

```python
def on_task_success(task, result):
    """任务成功 → 提取经验 → 追加到记忆"""
    summary = llm.complete(f"从这次任务提取可复用的经验（50字内）：{task}")
    memory_file.append({
        "date": today(),
        "task": task.name,
        "result_summary": summary
    })

def on_task_failure(task, error):
    """任务失败 → 保留原始记录（可回退）"""
    failure_file.append({
        "date": today(),
        "task": task.name,
        "error": str(error),
        "context": task.context_snapshot
    })
    # 不立即更新 MEMORY.md（避免污染）
```

## 八、3 条实战建议

### 8.1 别"事后补"记忆

```text
❌ 等 Agent 出错 → 修
✅ 开始 Agent → 设计记忆系统（基础设施）
```

记忆系统是 Agent 的"数据层"——**和数据库一样重要**。

### 8.2 记忆系统要"分层"

```text
工作记忆：context（自动）
情景记忆：JSONL（追加）
语义记忆：向量库（按需）
程序性记忆：Skills（人工 + LLM 评估）

不要全存一个地方：
  - 高频用 → 内存
  - 长期用 → 文件
  - 检索用 → 向量
```

### 8.3 监控记忆质量

```text
每 30 天 review：
  - MEMORY.md 是否过时
  - 失败案例是否被记住
  - 成功经验是否被复用

KPI：
  - 任务成功率（首次）
  - 任务成功率（带历史）
  - 知识复用率（被多次引用的条目）
```

## 九、本文 + 后续

- （上）概念 + 工具（已写）
- （中）上下文 + 记忆（本文）
- （下）架构 + 部署 + 实战

---

> **Agent 基础（中）核心**：**5 层上下文 + 3 种压缩 + 4 种记忆**。**Context Rot 是工程问题，不是模型问题**——**好的上下文设计 = 100K tokens 跑得像 10K**。**Prompt Caching 一定要用**（省 90% 成本 + 10 倍速度）。**记忆系统是基础设施**，不是事后补的 feature。