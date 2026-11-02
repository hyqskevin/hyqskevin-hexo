---
title: Multi-Agent 框架对比与选型
date: 2026-09-02 00:00:00
description: 主流 Multi-Agent 框架横向对比（LangGraph / CrewAI / AutoGen / MetaGPT / OpenAI Agents SDK / Claude Code Agent Teams / MiniMax Mavis）+ 选型决策树 + 5 类场景推荐 + 部署成本对比 + 3 个真实案例。
series:
  name: multi-agent-architecture
  index: 2
  total: 2
categories:
  - notes
tags:
  - Multi-Agent
  - LangGraph
  - CrewAI
  - AutoGen
  - MetaGPT
  - 选型
---

（上）篇讲了 7 种 Multi-Agent 架构模式。本篇（下）讲**主流框架对比 + 选型决策**——光懂模式不够，要落地就要选具体框架。

## 一、7 个主流框架对比

| 框架 | 厂商 | 模式 | 语言 | 部署难度 | 学习曲线 |
|---|---|---|---|---|---|
| **LangGraph** | LangChain | Supervisor / Graph | Python | 中 | 中 |
| **CrewAI** | CrewAI Inc. | Role-Based | Python | 低 | 低 |
| **AutoGen** | Microsoft | Conversation | Python | 中 | 中 |
| **MetaGPT** | DeepWisdom | SOP-Driven | Python | 高 | 中高 |
| **OpenAI Agents SDK** | OpenAI | Handoffs | Python | 低 | 低 |
| **Claude Code Agent Teams** | Anthropic | P2P Mesh | Python | 低 | 低 |
| **MiniMax Mavis** | MiniMax | LWV | Python | 中 | 中 |

## 二、7 框架详解

### 2.1 LangGraph

```python
from langgraph.graph import StateGraph

# 定义状态
class AgentState(TypedDict):
    messages: list
    next_agent: str

# 定义节点
def supervisor(state):
    # 决定下一个 agent
    state["next_agent"] = "researcher"
    return state

def researcher(state):
    # 做研究
    return {"messages": state["messages"] + ["research result"]}

# 构建图
graph = StateGraph(AgentState)
graph.add_node("supervisor", supervisor)
graph.add_node("researcher", researcher)
graph.add_edge("supervisor", "researcher")
graph.add_edge("researcher", "supervisor")
app = graph.compile()
```

**特点**：
- 完整 Graph API（StateGraph）
- 灵活组合 7 种模式
- 与 LangChain 生态集成

**适用**：复杂 workflow + 需要可观测

### 2.2 CrewAI

```python
from crewai import Agent, Task, Crew

researcher = Agent(
    role="市场研究员",
    goal="收集 AI 行业最新动态",
    backstory="10 年科技媒体经验"
)

writer = Agent(
    role="内容写手",
    goal="把研究写成文章",
    backstory="擅长把复杂概念讲清楚"
)

research_task = Task(
    description="研究 2026 AI 编程工具",
    agent=researcher,
    expected_output="结构化研究报告"
)

write_task = Task(
    description="把研究报告写成博客文章",
    agent=writer,
    expected_output="2000 字博客"
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    verbose=True
)

result = crew.kickoff()
```

**特点**：
- 角色定义自然语言化
- 学习曲线低
- 适合内容创作 / 调研

### 2.3 AutoGen

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent("assistant", llm_config=...)
user_proxy = UserProxyAgent("user", code_execution_config={"work_dir": "."})

user_proxy.initiate_chat(
    assistant,
    message="分析这个数据集"
)
```

**特点**：
- 对话驱动（GroupChat 模式）
- 支持代码执行
- 微软背景，企业友好

### 2.4 MetaGPT

```python
from metagpt.roles import ProductManager, Architect, Engineer
from metagpt.team import Team

team = Team()
team.hire([ProductManager(), Architect(), Engineer()])
team.run_project("开发一个 AI 笔记 App")
```

**特点**：
- 完整 SOP（产品 / 架构 / 工程 / QA）
- 模拟真实软件公司
- 适合软件工程

### 2.5 OpenAI Agents SDK

```python
from agents import Agent, Runner

agent = Agent(
    name="assistant",
    instructions="You are a helpful assistant",
    tools=[get_weather, search_web]
)

result = Runner.run_sync(agent, "What's the weather in Tokyo?")
```

**特点**：
- OpenAI 官方
- Handoffs 模式
- 适合 GPT 系列

### 2.6 Claude Code Agent Teams

```python
# claude_code/agent_teams.yaml
teams:
  - name: research-team
    agents:
      - name: web-searcher
        model: claude-sonnet-4
      - name: analyzer
        model: claude-sonnet-4
    mailbox: redis
```

**特点**：
- Anthropic 官方
- P2P Mailbox 通信
- 适合探索 / 多角度分析

### 2.7 MiniMax Mavis

```python
# Mavis 内部格式
# 三权分立：Leader 派工 + Worker 执行 + Verifier 审查
```

**特点**：
- LWV 模式
- 强一致性
- 国内可用

## 三、5 维度对比

| 维度 | LangGraph | CrewAI | AutoGen | MetaGPT | Agents SDK |
|---|---|---|---|---|---|
| 协议模式 | 任意图 | Role | 对话 | SOP | Handoffs |
| 学习曲线 | 中高 | 低 | 中 | 中高 | 低 |
| 文档质量 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 社区活跃 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 调试工具 | LangSmith | CrewAI Studio | AutoGen Studio | MetaGPT Web | OpenAI Dashboard |
| 商用支持 | LangChain | CrewAI Inc. | Microsoft | DeepWisdom | OpenAI |

## 四、5 类场景推荐

| 场景 | 推荐 | 理由 |
|---|---|---|
| **代码项目** | MetaGPT | 完整 SOP 模拟软件公司 |
| **内容创作** | CrewAI | 角色定义自然语言化 |
| **研究分析** | Claude Code Agent Teams | P2P 多角度 |
| **客服流程** | OpenAI Agents SDK | Handoffs 适合流水线 |
| **通用探索** | LangGraph | 灵活 + LangChain 生态 |

## 五、3 条选型原则

### 5.1 用现有 LLM 配套

- 用 GPT 系列 → OpenAI Agents SDK
- 用 Claude → Claude Code Agent Teams
- 用国内模型（Qwen / GLM / Hy4）→ LangGraph / CrewAI

### 5.2 团队熟悉度优先

- Python 熟 → 全部可选
- TypeScript 熟 → 仅 LangGraph（TS 版）
- 不熟 Python → 仅 OpenAI Agents SDK

### 5.3 任务匹配

- 长任务（多步）→ MetaGPT / LangGraph
- 短任务（单步）→ CrewAI
- 探索任务 → Claude Code Agent Teams

## 六、3 个真实案例

### 6.1 内容生成

```text
项目：每天产出 5 篇 AI 行业新闻摘要
选型：CrewAI（Role-Based）
团队：研究员 + 编辑 + 审校
流程：研究 → 写作 → 审校
成本：3 LLM 角色 × 5 篇 / 天 = 15 次 API 调用
```

### 6.2 自动化办公

```text
项目：周报自动生成
选型：LangGraph（Supervisor + Worker）
流程：
  supervisor 接收周报需求
    → 数据收集 worker 拉数据
    → 模板填充 worker 套模板
    → 审核 worker 检查
    → supervisor 输出
```

### 6.3 软件工程

```text
项目：自动重构 legacy 代码
选型：MetaGPT（SOP-Driven）
团队：架构师 + 开发 + 测试
流程：
  架构师 读代码 → 写架构方案
  开发 实施方案
  测试 写测试
  QA 验收
```

## 七、3 条避坑

1. **不要为了"高级"选复杂框架**——5 个 Agent 的项目用 Handoffs 比 LangGraph 简单
2. **不要忽视调试工具**——LangSmith / CrewAI Studio 是救命稻草
3. **不要每个项目都从 0 搭**——选熟悉的框架，积累复用

## 八、3 条未来趋势

1. **MCP + Agent 框架融合**——MCP 工具调用 = 通用 Agent 协议
2. **统一上下文窗口**——128K → 1M context 让复杂 multi-agent 不再受限制
3. **Auto-eval 成熟**——SWE-bench / HumanEval 自动评估 Agent 质量

## 九、本文 + 上篇

- （上）7 种模式详解（已写）
- （下）主流框架对比 + 选型（本文）

---

> **Multi-Agent 架构选型核心**：**先选模式，再选框架**。模式错了，再多框架也救不了；模式对了，框架只是工具。**LangGraph / CrewAI / AutoGen / MetaGPT 都能跑通，关键看你的任务**。**3 个 Agent 足够就别上 5 个**，**单进程足够就别上分布式**。