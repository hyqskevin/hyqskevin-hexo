---
title: Multi-Agent 架构 7 种模式（上）
date: 2026-09-02 00:00:00
description: 主流 Multi-Agent 架构 7 种模式详解：Leader-Worker-Verifier / P2P Mesh / Supervisor / Handoffs / Role-Based / Conversation / SOP-Driven。每种模式的核心思想 + 代表产品 + 优缺点 + 适用场景。
series:
  name: multi-agent-architecture
  index: 1
  total: 2
categories:
  - notes
tags:
  - Multi-Agent
  - 架构
  - AI Agent
  - 对比
  - 选型
---

最近做 Multi-Agent 架构对比研究，主流 7 种模式——**没有银弹**，每种都解决不同问题。本篇（上）讲 7 种模式详解；下篇讲主流框架对比与选型决策。

## 一、7 种模式速览

| 模式 | 核心思想 | 代表 |
|---|---|---|
| **Leader-Worker-Verifier** | 领导派工 + 工人执行 + 验证者审查 | MiniMax Mavis Code |
| **P2P Mesh** | 节点对节点 mailbox 通信 | Anthropic Claude Code Agent Teams |
| **Supervisor** | 中心监督者调度 | Anthropic Subagents / LangGraph |
| **Handoffs** | 显式控制权移交 | OpenAI Agents SDK |
| **Role-Based** | 角色 / 目标 / 背景人物设定 | CrewAI |
| **Conversation** | 多 Agent 对话轮次 | Microsoft AutoGen |
| **SOP-Driven** | 标准作业流程编码 | DeepWisdom MetaGPT |

## 二、7 种模式详解

### 2.1 Leader-Worker-Verifier（LWV）

```text
        Leader（派工）
           ↓
       Worker（执行）
           ↓
      Verifier（审查）
           ↓
    通过 / 返工（重做）
```

**代表**：MiniMax Mavis Code
**思想**：三权分立——领导决定做什么，工人执行，验证者审查。
**优点**：
- 状态清晰（每步交接明确）
- 抗错误（双重检查）
- 适合复杂任务（多步验证）

**缺点**：
- 延迟高（3 步串行）
- 通信开销大
- 简单任务过度设计

**适用**：代码生成、文档撰写、复杂分析

### 2.2 P2P Mesh（点对点网络）

```text
       Agent A
        ↕ mailbox
   Agent B  ↔  Agent C
        ↕ mailbox
       Agent D
```

**代表**：Anthropic Claude Code Agent Teams
**思想**：每个 Agent 是独立节点，消息通过 mailbox 通信。

**优点**：
- 高度自治（无中心故障）
- 灵活拓扑（任意连接）
- 易扩展（加新 Agent 不影响老 Agent）

**缺点**：
- 调试难（消息流分散）
- 协调难（无中心调度）
- 死锁风险（循环等待）

**适用**：研究、探索、多角度分析

### 2.3 Supervisor（中心监督式）

```text
        Supervisor（中心）
         ↙  ↓  ↘
    Worker1  Worker2  Worker3
    （各执行子任务）
```

**代表**：Anthropic Subagents / LangGraph Supervisor
**思想**：Supervisor 接收任务 → 拆解 → 分派 → Workers 执行 → 汇总。

**优点**：
- 中心化调度（清晰）
- 容易监控（看 Supervisor 日志）
- 错误处理（Supervisor 决定重试）

**缺点**：
- Supervisor 是瓶颈
- 单点故障
- 不适合纯分布式场景

**适用**：项目编排、长任务分解、复杂 workflow

### 2.4 Handoffs（控制权移交）

```text
    Agent A（负责 X）
       ↓ 移交
    Agent B（负责 Y，X 的下游）
       ↓ 移交
    Agent C（负责 Z）
```

**代表**：OpenAI Agents SDK
**思想**：每个 Agent 显式把控制权"交"给下一个 Agent。

**优点**：
- 流程清晰（明确交接点）
- 易于追踪（每步签名）
- 适合流水线任务

**缺点**：
- 上下文丢失（每次重置）
- 灵活性差（必须按预设流程）
- 错误恢复弱

**适用**：客服流程、订单处理、固定 pipeline

### 2.5 Role-Based（角色扮演）

```text
    "你是资深财务分析师"
    "你的目标是分析这份财报"
    "你的背景是 10 年四大经验"

       ↓ LLM 按 role 生成

    财务报告 + 风险评估
```

**代表**：CrewAI
**思想**：用自然语言定义角色，LLM 自动扮演。

**优点**：
- 简单直观（人话描述）
- 灵活（任意角色组合）
- 易调试（看 prompt 就懂）

**缺点**：
- 角色边界模糊（LLM 可能"越界"）
- 协同性弱（各演各的）
- 输出风格难统一

**适用**：内容创作、研究分析、咨询场景

### 2.6 Conversation（对话驱动）

```text
    Agent A
       ↓ 发言
    Agent B
       ↓ 反驳 / 补充
    Agent C
       ↓ 总结
```

**代表**：Microsoft AutoGen
**思想**：多 Agent 通过"对话"协同，每个 Agent 是发言者。

**优点**：
- 思想碰撞（多角度）
- 自然涌现（不必预设流程）
- 适合复杂讨论

**缺点**：
- 不可预测（每次结果可能不同）
- 难以控制（对话可能跑偏）
- 成本高（多轮对话 token 多）

**适用**：辩论、调研、头脑风暴

### 2.7 SOP-Driven（流程编码）

```text
    写 spec → 拆任务 → 派 worker → 验收 → 输出
       ↓
    全部写死成代码（"标准作业流程"）
       ↓
    LLM 按 SOP 一步步执行
```

**代表**：DeepWisdom MetaGPT
**思想**：把人类团队的"标准作业流程"编码成 Agent 行为。

**优点**：
- 流程标准化（可复现）
- 易于审计（每步有定义）
- 适合复杂工程

**缺点**：
- 前期投入大（要写 SOP）
- 灵活性差（流程改 = 改代码）
- 创新性弱

**适用**：软件工程、文档生成、规范化任务

## 三、7 模式对比

| 模式 | 协调方式 | 中心化 | 灵活性 | 复杂度 | 适合 |
|---|---|---|---|---|---|
| LWV | 三权分立 | 中 | 中 | 高 | 复杂任务 |
| P2P Mesh | 消息 mailbox | 无 | 高 | 中 | 探索 / 研究 |
| Supervisor | 中心调度 | 高 | 中 | 中 | 项目编排 |
| Handoffs | 显式移交 | 中 | 低 | 低 | 流水线 |
| Role-Based | 角色 prompt | 低 | 高 | 低 | 内容 / 创作 |
| Conversation | 对话 | 低 | 高 | 中 | 讨论 / 调研 |
| SOP-Driven | 流程编码 | 高 | 低 | 高 | 工程化 |

## 四、5 个选型问题

选哪种模式前问自己 5 个问题：

```text
1. 任务是固定流程还是探索性？
   固定 → Handoffs / SOP
   探索 → P2P / Conversation

2. 角色分工明确吗？
   明确 → LWV / Role-Based
   模糊 → P2P / Conversation

3. 需要强一致性吗？
   强 → LWV / SOP
   弱 → P2P / Role

4. Agent 数量是？
   2-3 个 → Supervisor / LWV
   5+ 个 → P2P / SOP
   10+ 个 → Handoffs（流水线分工）

5. 失败可恢复吗？
   不可 → Handoffs / SOP（每步可重启）
   可 → P2P / Role
```

## 五、3 个常见组合

实际项目**很少用单一模式**，多组合：

```text
Supervisor（项目级） + LWV（任务级） + Role-Based（专家级）
  → 80% 项目的标准组合

SOP（流程级） + Role-Based（执行级） + Conversation（评审级）
  → 复杂项目的标准组合

Handoffs（顶层流程） + Role-Based（每步执行）
  → 流水线项目的标准组合
```

## 六、本文 + 下篇

- （上）7 种模式详解（本文）
- （下）主流框架对比（LangGraph / CrewAI / AutoGen / MetaGPT / OpenAI Agents SDK）+ 选型决策

---

> **7 种模式不是"哪个最好"，是"哪个最适合你的场景"**。LWV 适合复杂任务、P2P 适合探索、Supervisor 适合项目、Handoffs 适合流水线、Role 适合内容、Conversation 适合讨论、SOP 适合工程化。**没有银弹，组合拳才是常态**。