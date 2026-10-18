---
title: A2A：Agent 协作协议
date: 2026-10-16 00:00:00
description: Google 2025 推出的 A2A 协议是 Agent 间通信的跨框架标准，与 Anthropic MCP 形成"工具层+Agent 层"双协议格局。本文系统讲解 A2A 与 MCP 的差异、协议格式、跨框架协作场景与落地挑战，附完整 Python 示例。
categories:
  - 大模型基础
tags:
  - A2A
  - Agent
  - MCP
  - Google
  - 多智能体
  - LLM
  - 协议标准
---

![封面](https://hyqskevin.github.io/pic/a2a-protocol/cover.png)

> **关键论文**：Google 2025-04《A2A: A New Protocol for Agent Collaboration》
> **配套讲稿**：Agent-MCP 模块

## ⚠️ 模型版本说明

本文示例代码默认基于 DeepSeek-V3、GPT-4o、Claude 3.5 等主流模型；文中涉及的端点、合作伙伴数量、版本号均以发布时（2025-04）官方公布为准，后续 A2A 1.0 / v0.3 草案可能微调，请以最新规范文档为准。

---

## 一、为什么需要 A2A 协议

2024-11 Anthropic 发布 MCP 协议之后，「Agent ↔ 工具」的单向调用有了标准答案。但半年之内，业界撞上了第二道墙：不同框架（LangGraph、AutoGen、CrewAI）、不同公司、不同语言写的 Agent 之间，怎么对话？

你当然可以走 HTTP 自己封一个，可是这就回到了 1990 年代的混乱状态：每个团队一套私有协议、每家公司一套鉴权方案、没有标准的能力描述、没有可观测的任务状态。Google 显然看到了这个问题，于是 2025-04 联合 50+ 头部企业推出了 **A2A 协议（Agent-to-Agent）**——一个基于 JSON-RPC 2.0 + SSE 的开放协议，让 Agent 之间能互相发现、协商能力、协同完成任务。

### 1.1 时间坐标

```
2024-11  Anthropic 发布 MCP（工具协议）
2025-01  Google 提出 A2A 草案
2025-04-09  Google 正式发布 A2A 协议 + 50+ 合作伙伴
2025-05  LangGraph / CrewAI / AutoGen 集成 A2A
2025-08  A2A 1.0 稳定版（v0.3 草案）
2026-Q1  预计 A2A 成为跨框架 Agent 协作标准
```

### 1.2 一句话定义

**A2A 是一个基于 JSON-RPC 2.0 + SSE 的开放协议，让不同框架、不同语言、不同云厂商的 Agent 能够互相发现、协商能力、协同完成任务。** 它的目标不是替代 MCP，而是和 MCP 形成互补：MCP 管工具调用，A2A 管 Agent 协作。

---

## 二、A2A 核心概念

### 2.1 A2A vs MCP

两套协议解决的问题完全不同，但互为补充，缺一不可：

```
MCP（Anthropic 2024-11）
  解决：LLM ↔ 工具
        Agent → Tool
        单向：Agent 调用工具

A2A（Google 2025-04）
  解决：Agent ↔ Agent
        Agent → Agent
        双向：跨框架 Agent 协作
```

一个现实的例子：你想让一个 LangGraph 写的「主 Agent」去调用一个用 Python 写的「研究 Agent」、再用 Claude 跑的「写稿 Agent」生成文章。在这个工作流里：

- 主 Agent → 研究 Agent → 写稿 Agent：这是 **A2A**（Agent 之间的对话）
- 研究 Agent 调用 arxiv API：这是 **MCP**（Agent 调用工具）

用一张表把生态位对齐：

| 协议 | 类比 | 解决 |
|------|------|------|
| MCP | USB-C | Agent 与工具连接 |
| A2A | HTTP / gRPC | Agent 与 Agent 通信 |
| LangGraph | React | 单 Agent 状态管理 |
| OpenAPI | OpenAPI | RESTful 服务调用 |

可以看到，A2A 的位置正好是 HTTP/gRPC 在分布式系统中的位置——它是「Agent 互联网」的传输层标准。

### 2.2 A2A 核心设计原则

A2A 协议设计上有五条核心原则，每一条都对应真实工程中的痛点：

1. **Agent Discovery（发现）**——A2A 客户端能动态发现 A2A server。类似 DNS，不写死 endpoint。
2. **Capability Negotiation（能力协商）**——Agent 互相知道对方能做什么，避免「能不能行」靠猜。
3. **Task Lifecycle（任务生命周期）**——任务状态可追踪、可恢复，长任务不怕断。
4. **Streaming（流式）**——基于 SSE 的实时进度推送，避免客户端轮询。
5. **Multi-modal（多模态）**——支持 text / image / file 等 parts，不再局限于纯文本。

---

## 三、A2A 协议格式详解

### 3.1 Agent Card（代理名片）

Agent Card 是 A2A 的「身份卡」，类似 OAuth 的 metadata 文档，也类似 OpenAPI 的 service description：

```json
{
  "name": "ResearchAgent",
  "version": "1.0.0",
  "description": "研究专家，可执行深度搜索",
  "capabilities": [
    "web_search",
    "arxiv_search",
    "summarize"
  ],
  "endpoint": "https://research-agent.example.com/a2a",
  "auth": {
    "type": "oauth2",
    "scopes": ["research.read"]
  }
}
```

**典型流程**：

- 客户端先 `GET /.well-known/a2a-agent.json` 拉取 Agent Card（标准 well-known 路径）
- 根据 `capabilities` 判断该 Agent 能不能用（能力匹配）
- 通过 `auth` 字段完成 OAuth 2.0 授权
- 调用对应 capability 发起任务

这种「先看名片，再对话」的模式和现实世界非常像：你要找律师，先看他名片上写不写「公司法」，再看收费区间，再打电话。

### 3.2 A2A 消息格式（JSON-RPC 2.0）

A2A 复用了成熟的 JSON-RPC 2.0 协议，每个请求有唯一 `task_id`，方便后续关联：

```json
{
  "jsonrpc": "2.0",
  "method": "tasks/send",
  "params": {
    "task": {
      "id": "task-uuid-1234",
      "message": {
        "role": "user",
        "parts": [
          {
            "type": "text",
            "content": "请研究 DeepSeek-V3 的技术架构"
          }
        ]
      }
    }
  }
}
```

**关键设计点**：

- 标准化远程调用，复用现有 JSON-RPC 生态（库、调试工具、文档）
- `parts` 数组天然支持多模态（text / image / file），未来加 audio / video 也不用改协议
- `task_id` 是 UUID，用于关联后续所有状态事件和结果

### 3.3 任务生命周期

A2A 任务有 6 个标准状态机，覆盖从提交到终止的完整生命周期：

$$T_{\text{lifecycle}} = \text{submitted} \to \text{working} \to \text{input-required} \to \text{completed/failed}$$

| 状态 | 含义 |
|------|------|
| `submitted` | 任务已提交，等待 Agent 接单 |
| `working` | Agent 处理中，可能伴随 artifact 流式输出 |
| `input-required` | 需要用户输入，常见于交互式 Agent |
| `completed` | 任务成功完成 |
| `failed` | 任务失败，可附带 error code |
| `canceled` | 任务被取消 |

这种显式状态机的好处是：客户端可以精确知道任务走到哪一步，断线重连后可以从 `working` 继续，而不是从头再来。

### 3.4 流式通信（SSE）

长任务（比如论文综述、代码生成）用 SSE 推送进度，避免客户端轮询：

```
A2A Server → A2A Client:

  HTTP/1.1 200 OK
  Content-Type: text/event-stream

  event: task.status
  data: {"task_id": "task-uuid", "status": "working"}

  event: task.artifact
  data: {"type": "text", "content": "正在搜索..."}

  event: task.status
  data: {"task_id": "task-uuid", "status": "completed"}
```

**SSE 的优势**：

- 实时推送进度，客户端零轮询，省电省带宽
- 适合小时级的长任务（论文综述、代码生成、数据分析）
- 基于 HTTP，复用现有基础设施（反向代理、CDN、WAF 都支持）
- 比 WebSocket 简单，单向即可，不需要双向协议握手

---

## 四、跨框架协作场景

### 4.1 研究 + 写作流水线

主 Agent 用 LangGraph 编排，对外调度两个不同公司的 A2A server：

```python
from a2a import A2AClient

# 1. 发现研究 Agent
research_agent = A2AClient.discover("https://research-agent.com")

# 2. 调用研究能力
research_result = await research_agent.call(
    capability="deep_research",
    topic="DeepSeek-V3 架构"
)

# 3. 发现写作 Agent
writing_agent = A2AClient.discover("https://writing-agent.com")

# 4. 调用写作能力
article = await writing_agent.call(
    capability="write_article",
    input=research_result,
    style="莫兰迪"
)
```

**值得注意**：

- 两个 Agent 可以用不同的语言、不同的框架实现（甚至跨云厂商）
- 主 Agent 不需要知道 ResearchAgent 是 Python 还是 Go
- 失败重试、负载均衡都由 A2A SDK 处理

### 4.2 代码审查 + 自动修复

```python
# Bug 检测 Agent（团队 A 实现）
bug_report = await bug_detector.call(
    capability="detect_bugs",
    code=my_code
)

# 自动修复 Agent（团队 B 实现）
fix = await code_fixer.call(
    capability="fix_bugs",
    bugs=bug_report
)
```

**重点是**：两个 Agent 可以用不同语言、不同框架实现，只要遵守 A2A 协议即可互相调用。这给企业带来了巨大的灵活性——可以让最擅长的团队做最擅长的事，不必为了「统一技术栈」而妥协。

---

## 五、A2A 与主流框架对比

### 5.1 维度对比

| 维度 | A2A | LangGraph | AutoGen |
|------|-----|-----------|--------|
| **范围** | 跨框架 Agent | 单 Agent 状态机 | 多 Agent 对话 |
| **协议** | JSON-RPC + SSE | Python 代码 | Python 代码 |
| **异构支持** | 跨语言 / 跨平台 | Python 为主 | Python 为主 |
| **任务粒度** | 完整任务 | 节点 + 边 | 对话回合 |
| **状态管理** | 任务状态 + 历史 | 图状态 | 对话历史 |
| **适用范围** | 跨公司 / 跨云 | 单一应用 | 实验 / 教学 |

### 5.2 互补关系

三者在生态中是分层关系，不互斥，可以同时存在：

```
A2A 负责：跨框架 Agent 通信
  ↓
  LangGraph / AutoGen 负责：单框架 Agent 内部逻辑
    ↓
    MCP 负责：Agent 调用工具
```

一个典型的企业级 Agent 应用很可能同时用到三层：内部用 LangGraph 编排状态，通过 A2A 与外部 Agent 协作，通过 MCP 调用底层工具。这三层不是竞争关系，而是「协议栈」一样的分工——每一层解决自己的问题，互不替代。

---

## 六、实际应用案例

### 6.1 企业 AI 助手

```
用户: "帮我分析 Q3 销售数据"
    ↓
Orchestrator Agent (LangGraph)
    ↓
  ├─ 调用 A2A → 数据查询 Agent (Python)
  │           返回 Q3 SQL 结果
  │
  ├─ 调用 A2A → 数据可视化 Agent (另一公司)
  │           返回图表
  │
  └─ 调用 A2A → 报告写作 Agent (Anthropic Claude)
              返回完整报告
```

这个流程里的亮点是**异构**：

- 数据查询 Agent 是公司内部 Python 团队写的，跑在私有云
- 数据可视化 Agent 是第三方 SaaS
- 报告写作 Agent 是 Anthropic Claude

三个 Agent 完全异构，但通过 A2A 协议无缝协作，这就是协议标准化带来的红利。

### 6.2 研究 + 工程协作

```
研究 Agent (A2A Server)
  - 能力：arxiv_search, paper_summarize
  - 框架：AutoGen

代码 Agent (A2A Server)
  - 能力：github_search, code_implement
  - 框架：LangGraph

主 Agent (A2A Client)
  - 框架：自定义
  - 任务：复现论文算法
  - 流程：先研究后实现
```

这个架构特别适合学术复现、工业研发类场景。研究 Agent 负责读论文，代码 Agent 负责实现，主 Agent 负责串起来——三个 Agent 各司其职，由 A2A 协议保证通信清晰、可追溯。

---

## 七、关键挑战

### 7.1 安全与认证

跨公司的 Agent 协作，安全是首要问题。认证信息在 A2A 中通常这样传递：

```python
# A2A 认证
auth = {
    "type": "oauth2",
    "client_id": "<YOUR_CLIENT_ID>",
    "client_secret": "<YOUR_CLIENT_SECRET>",
    "scopes": ["research.read"]
}
```

**主要威胁**：

- **Agent Card 伪造**——恶意方伪造知名 Agent 卡片，诱导客户端调用
- **任务参数注入**——任务消息中嵌入恶意指令，劫持下游 Agent
- **结果篡改**——中间人攻击篡改任务结果
- **拒绝服务攻击**——恶意调用消耗 Agent 资源

**应对策略**：

- OAuth 2.0 + scope 细粒度授权，限制每个 Agent 能做什么
- 任务签名验证（HMAC / 数字签名），确保任务来源可信
- 结果审计日志（谁在什么时候调了什么），出事后能溯源
- 速率限制与配额管理，防止被滥用

### 7.2 任务编排

复杂任务需要多 Agent 并行 / 串行协作，单靠 A2A 协议本身还不够：

```
任务: "产品发布的市场分析"
  ↓
  Orchestrator Agent
    ↓
    ├─ 竞品分析 Agent
    ├─ 用户调研 Agent
    ├─ 营销文案 Agent
    └─ 数据可视化 Agent
```

**核心难点**：

- **任务依赖管理**——并行 / 串行 / DAG 编排，谁先谁后、谁等谁
- **失败重试**——单个 Agent 挂了不能拖垮全流程，需要局部降级
- **上下文共享**——A2A 任务之间如何传递上下文、避免重复输入
- **结果合并**——多个 Agent 的输出格式可能不同，需要归一化

### 7.3 调试与可观测性

跨框架调用一旦出问题，定位极难——你面对的是「黑盒 + 黑盒 + 黑盒」的串联：

```
A2A Task Trace:
  - task-uuid-1234 submitted → research-agent (2.3s)
  - task-uuid-5678 submitted → writing-agent (4.5s)
  - 依赖关系 + 性能监控
```

**关键工具链**：

- **OpenTelemetry**——trace 标准化，把所有 Agent 调用串成一个 trace
- **LangSmith**——LangGraph 框架的可观测平台
- **Helicone**——LLM 调用的成本与性能监控
- **自建 dashboard**——业务指标可视化（成功率、平均耗时、token 消耗）

可观测性是 A2A 落地的「最后一公里」，没有它，跨 Agent 调用出问题就只能靠猜。

---

## 八、必读论文

### 8.1 核心 2 篇

1. **Google 2025-04《A2A Protocol Spec》⭐⭐⭐**——官方规范，必读
2. **Google 2025-04《A2A: A New Protocol for Agent Collaboration》**——设计哲学

### 8.2 进阶 2 篇

3. **Anthropic 2024-11《MCP Spec》⭐⭐⭐**——理解 A2A 的对照面
4. **LangChain 2024-10《LangGraph + A2A Integration》**——落地实践

### 8.3 对比 1 篇

5. **Microsoft 2024《AutoGen: Enabling Next-Gen LLM Applications》**——Multi-Agent 范式对照

---

## 九、关键洞察与讨论

### 9.1 关键洞察

1. **A2A 是 Agent 时代的"HTTP"**——跨框架通信标准，让异构 Agent 互联互通
2. **与 MCP 互补**——MCP 管工具调用，A2A 管 Agent 协作，缺一不可
3. **Google + Anthropic 双标准**——A2A vs MCP，未来存在融合的可能
4. **2025 是 Agent 协作元年**——50+ 头部企业加入，生态正在快速形成
5. **跨框架协作成为 Agent 规模化关键**——单 Agent 能力有限，多 Agent 协作才能解决真实业务问题

### 9.2 经典讨论题

- **Q1.** A2A vs MCP 哪个更重要？短期内谁更可能成为事实标准？
- **Q2.** A2A 与 LangGraph / AutoGen 的关系？是替代还是共存？
- **Q3.** 跨公司 Agent 协作需要什么安全机制？签名、授权、审计？
- **Q4.** A2A 会成为 W3C / IETF 级别的国际标准吗？
- **Q5.** 多 Agent 任务编排的难点？DAG 引擎、状态机还是 LLM 决策？

---

> **2025-04 关键节点**：Google 发布 A2A 协议，与 Anthropic MCP 形成"工具层 + Agent 层"的双协议格局。Agent 互联网正在形成。