---
title: 2025 Agent 演进全景
date: 2026-10-16 00:00:00
description: 梳理 2025-2026 年 Agent 范式演进、Context Engineering、A2A/MCP 双协议格局、Multi-Agent 协作与 Prompt Injection 安全防御，对照主流 Agent 平台能力并展望 Agent Marketplace、端侧化与多模态趋势。
categories:
  - AI 工程
tags:
  - Agent
  - A2A
  - MCP
  - Context Engineering
  - Multi-Agent
  - Prompt Injection
  - LLM
---

## 一、时间坐标

回顾 2024 年下半年到 2026 年初，Agent 领域几乎每两个月就有一个关键节点冒头：

```text
2024-09  Anthropic《Building Effective Agents》 ⭐
2024-10  LangChain LangGraph 1.0
2024-11  Anthropic MCP Spec
2024-12  Manus AI 爆火（Context Engineering 实践）
2025-02  OpenAI DeepResearch 发布
2025-04  Google A2A 协议
2025-05  LangGraph + A2A 集成
2025-08  Claude 4 Opus（更安全）
2025-09  OpenAI o3（推理 + Agent）
2025-12  AI Agent Marketplace 商业化
2026-Q1 预计 Agent 互联网雏形
```

两年时间，Agent 从「LLM + 几个工具」演化为「协议 + 多智能体 + 工程方法论」的完整栈。

---

## 二、Agent 范式演进

### 2.1 能力栈公式

把 Agent 拆开看，本质是这五件事的叠加：

```text
Agent = LLM + Memory + Planning + Tools + Context Engineering
```

关键洞察不是公式本身，而是 **Context Engineering** 这一项——它把 Agent 从「写好 prompt 就完事」拉到了系统工程的层面。

### 2.2 Agent 三大时代

| 时代 | 特征 | 代表 |
|------|------|------|
| Agent 1.0（2023-2024） | Function Calling + ReAct | AutoGen, LangGraph |
| Agent 2.0（2024-2025） | Context Engineering + MCP | Manus, Cursor, Claude Code |
| Agent 3.0（2025+） | Multi-Agent 协作 + A2A | Google A2A, OpenAI Swarm |

> 三大时代的真正分水岭是「能不能持续管理上下文」，而不是模型本身变大。

---

## 三、四大新范式整合

### 3.1 Context Engineering（上下文工程）

Anthropic 2024-09 的核心主张可以归纳为：

```text
旧的思路：
  1. 写好 prompt
  2. 一次性塞给 LLM
  3. 期待好结果

新的思路：
  1. 系统化设计 context
  2. 4 大来源：system / tools / docs / history
  3. Agent loop 中持续管理
  4. 动态优化
```

需要警惕的是 **Lost in the Middle** 现象——LLM 对中间段注意力最弱，关键信息必须放在首尾。

四大策略对应四种工程动作：

| 策略 | 实施 |
|------|------|
| Write | 主动写入信息到 context |
| Select | 检索 + Rerank + 摘要 |
| Compress | 摘要 + 截断 + 表格化 |
| Isolate | 多 Agent 分工隔离 |

详见配套讲稿 `<vault>/37-Agent-MCP/02-Context-Engineering.md`。

### 3.2 A2A 协议（Agent 协作）

Google 在 2025-04 发布的 A2A 与 Anthropic 的 MCP 形成天然互补：

```text
MCP（Anthropic）管：Agent → Tool
A2A（Google）   管：Agent → Agent
```

横向打通靠 A2A，纵向调用工具靠 MCP，两者共同构成 Agent 时代的双协议底座。

核心组件：

- **Agent Card**：代理名片（类似 OAuth 的发现机制）
- **JSON-RPC 2.0**：标准化通信协议
- **SSE 流式**：实时进度推送
- **任务生命周期**：状态机管理

与现有框架的关系很清晰：

| 范围 | 工具 |
|------|------|
| 跨框架 Agent 通信 | **A2A** |
| 单框架 Agent 内部 | LangGraph / AutoGen |
| Agent 与工具 | MCP |

详见配套讲稿 `<vault>/37-Agent-MCP/03-A2A-协议.md`。

### 3.3 Multi-Agent 协作深入

三大主流框架各有适用场景：

| 框架 | 抽象 | 适用 |
|------|------|------|
| AutoGen | 对话回合 | 复杂多 Agent 协作 |
| CrewAI | 角色 + 任务 | 简单工作流 |
| LangGraph | 图 + 状态 | 复杂状态管理 |

通信模式上，主流方案收敛到 5 种：

- Sequential（顺序）
- Hierarchical（分层）
- Group Chat（群聊）
- Handoff（移交）
- Debate（辩论）

共识机制则根据任务复杂度选用：投票 / 加权 / LLM Judge。详见配套讲稿 `<vault>/37-Agent-MCP/04-Multi-Agent-协作.md`。

### 3.4 Prompt Injection 安全

OWASP 2025 把 Prompt Injection 列为 LLM Top 1 风险。常见攻击类型有 6 种：

- Prompt Override（指令覆盖）
- Role Play（角色扮演）
- Context Stuffing（上下文填充）
- Payload Splitting（载荷分割）
- Indirect Injection（间接注入）
- Tool Injection（工具注入）

其中「间接注入」最危险——攻击载荷藏在文档、网页、邮件里，Agent 读取后就被劫持。

防御要做 5 层叠加，而不是任何单点：

```text
L1 输入过滤（60%）
L2 System Prompt 加固（80%）
L3 输出验证（90%）
L4 沙箱（99%）
L5 人工审核（99.9%）
```

每一层挡住的都是不同威胁面，叠加后才接近可用。详见配套讲稿 `<vault>/37-Agent-MCP/05-Prompt-Injection.md`。

---

## 四、2025 SOTA Agent 平台

把这一年真正跑出生产力的平台摆在一起对照：

### 4.1 OpenAI Operator

```text
能力：Computer Use 2.0
  - 浏览器操作
  - 文件处理
  - 多步任务

限制：
  - 需 Pro 订阅（$200/月）
  - 慢（每步 5-10s）
  - 容易卡住
```

### 4.2 Claude 4 Opus

```text
能力：
  - 200K context
  - Computer Use（改进版）
  - Tool Use（最强）

新特性：
  - 思考模式（Extended Thinking）
  - 减少越狱成功率
  - 更好的代码生成
```

### 4.3 Google Gemini 2.5 Pro

```text
能力：
  - 1M-2M context
  - 原生多模态
  - 深度研究（DeepResearch）

优势：
  - 长 context
  - 多模态原生
  - 价格便宜
```

### 4.4 Manus AI

```text
能力：
  - 自主任务执行
  - Context Engineering 标杆
  - 沙箱执行

融资：数亿美元（2024-12）
估值：数十亿美元
```

### 4.5 DeepSeek-V3 + R1（开源 SOTA）

```text
能力：
  - 671B MoE（37B 激活）
  - 推理能力追平 o1
  - 完全开源
  - 14.8T tokens 训练

意义：开源 Agent 时代的开端
```

五个平台分别卡位：Operator 占 Computer Use、Claude 4 占 Tool Use、Gemini 2.5 Pro 占长 context 与多模态、Manus 占工程实践、DeepSeek 占开源底座。

---

## 五、2025-2026 未来趋势

### 5.1 Agent Marketplace

Agent Store 已经不只是 GPT Store 那种「自定义 prompt 集合」，而是 Agent 经济的基础设施：

```text
想象：
  - Agent 商店：用户购买专业 Agent
  - Agent 支付：Agent 之间互相支付
  - Agent 经济：GDP 的一部分
```

OpenAI GPT Store 2024-01 上线后已有 100 万+ 自定义 GPT，2025 升级为「Agent Marketplace」只是时间问题。

### 5.2 Agent 互联网

互联网的主体将从「人 ↔ 网页」切换到「Agent ↔ Agent / 服务 / 数据」：

```text
传统互联网：人 ↔ 网页
Agent 互联网：Agent ↔ Agent
              Agent ↔ 服务
              Agent ↔ 数据
```

支撑这套体系的关键协议：

- MCP（工具）
- A2A（Agent）
- OpenAPI（服务）
- SQL（数据）

### 5.3 端侧 Agent

LLM 量化与 Apple Silicon / 高通芯片让本地 Agent 成为现实：

```text
未来：
  - iPhone / Android 直接跑 LLM Agent
  - Apple Silicon 4B / 8B 模型
  - 完全本地化
  - 隐私保护
```

### 5.4 多模态 Agent

未来 Agent 必然是全模态的：

```text
看（Vision）
听（Audio）
读（Web / Doc）
操作（Computer Use）
思考（Reasoning）
输出（生成）

= 全模态 Agent
```

四个趋势彼此交织：Marketplace 给商业化铺路、Agent 互联网给协议打底、端侧化解决隐私与延迟、多模态决定能落地的场景边界。

---

## 六、关键洞察

把全文压成六条 takeaway：

1. **Context Engineering 是 Agent 时代的新学科**——不是 prompt 技巧，而是系统级工程问题，Anthropic / Manus / Cursor 都在深度实践。
2. **A2A + MCP = Agent 时代双协议**——A2A 负责横向（Agent ↔ Agent），MCP 负责纵向（Agent ↔ Tool），未来可能融合。
3. **Multi-Agent 协作 = 复杂任务的关键**——三大框架 AutoGen / CrewAI / LangGraph，5 大通信模式 + 共识机制。
4. **Prompt Injection 是 LLM #1 安全风险**——间接注入最危险，需要 5 层防御叠加，红队测试必做。
5. **2025 是 Agent 商业化元年**——OpenAI Operator、Claude 4 Opus、Gemini 2.5 Pro、Manus AI 同时跑通。
6. **未来 3 大趋势**——Agent Marketplace、Agent 互联网、端侧 Agent，2026 起开始交叉验证。

把这六条串起来：Agent 正在从「demo 玩具」走向「协议 + 工程 + 商业」的完整栈。

---

## 模型版本说明

本文涉及的模型与平台版本号均为撰写时（2025 年底）的快照：

- Claude 4 Opus（Anthropic，2025-08）
- Gemini 2.5 Pro（Google，2025）
- OpenAI o3 / Operator（2025）
- DeepSeek-V3 / R1（2024-2025）
- LangGraph 1.0（2024-10）

⚠️ **以发布时为准**——模型能力、价格、上下文长度、API 形态在 6 个月内可能多次迭代，落地前请以官方最新文档为准。