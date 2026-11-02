---
title: Agent 协作三大框架对比
date: 2026-10-16 00:00:00
description: 从单 Agent 瓶颈出发，对比 AutoGen、CrewAI、LangGraph 三大主流 Multi-Agent 框架的设计哲学、通信模式与共识机制，并归纳实际落地中常见的失败模式与工程对策。
categories:
  - 技术
tags:
  - Multi-Agent
  - AutoGen
  - CrewAI
  - LangGraph
  - LLM
  - AI Agent
---

## ⚠️ 模型版本说明

本文示例代码默认基于 GPT-4o / Claude 3.5 等主流模型，以发布时的最新可用版本为准。

---

## 一、为什么需要 Multi-Agent？

在聊框架之前，先搞清楚「为什么」。单 Agent 在真实任务里很快会遇到瓶颈：

- **上下文窗口有限**：100K context 装不下所有信息
- **工具太多**：20+ 工具同时丢给 LLM 选择，错误率飙升
- **任务复杂**：「研究 + 写作 + 设计」一句话根本说不清
- **专精度低**：让同一个 LLM 同时当医生和律师，结果可想而知

Multi-Agent 的解法很朴素：**把任务拆开**。

- **任务分解** —— 每个 Agent 专注一个细分问题
- **上下文隔离** —— 每个 Agent 维护自己的 context
- **工具专业化** —— 每个 Agent 持有自己专属的工具集
- **能力组合** —— 多个「弱」Agent 协作逼近「强」能力

形式化一点，任务分配可以这样描述：

$$T = \sum_{i=1}^{N} T_i \cdot \mathbb{1}[A_i \text{ assigned to } T_i]$$

其中 $T$ 是总任务，$T_i$ 是第 $i$ 个子任务，$A_i$ 是第 $i$ 个 Agent，$\mathbb{1}$ 是指示函数。约束有三条：1 个 Agent 可处理多个 $T_i$，但 1 个 $T_i$ 必须有专属 Agent，且 Agent 之间可以通信。

![单 Agent vs Multi-Agent 协作模式](https://hyqskevin.github.io/pic/agent/multi-agent-patterns.png)

### 1.1 时间坐标

Multi-Agent 的发展节奏，从 2023 年起明显加速：

```
2017  Actor-Critic 范式（早期 Multi-Agent RL）
2023-06  BabyAGI（Yohei Nakajima）
2023-10  Microsoft AutoGen v0.1
2023-12  LangChain 发布 LangGraph
2024-01  CrewAI v0.1
2024-05  AutoGen v0.4（重大重构）
2024-08  LangGraph 1.0
2024-11  OpenAI Swarm（极简 handoff）
2025-02  Google A2A 协议（跨框架协作）
2025-08  LangGraph + A2A 集成
```

2025 年被业内视为 Multi-Agent 商业化元年。

---

## 二、三大主流框架对比

AutoGen、CrewAI、LangGraph 是当前最常被拿来比较的三个框架。它们的设计哲学完全不同。

### 2.1 AutoGen：对话驱动

AutoGen 来自微软（2024），核心抽象是「**对话回合**」。每个 Agent 是一个对话参与者，GroupChat 把它们组织到一起轮流发言。

```python
from autogen import AssistantAgent, UserProxyAgent, GroupChat

# 1. 定义 Agent
researcher = AssistantAgent(
    name="Researcher",
    system_message="你是一个研究专家，擅长搜索和总结信息"
)

writer = AssistantAgent(
    name="Writer",
    system_message="你是一个写作专家，擅长把研究结果写成文章"
)

critic = AssistantAgent(
    name="Critic",
    system_message="你是一个评论家，擅长发现文章的问题"
)

# 2. 定义 GroupChat
groupchat = GroupChat(
    agents=[researcher, writer, critic],
    messages=[],
    max_round=10
)

# 3. 启动对话
manager = GroupChatManager(groupchat=groupchat)
manager.initiate_chat(
    message="请研究并写一篇关于 DeepSeek-V3 的文章"
)
```

**优势**：微软出品工业级稳定；角色定义灵活；支持人类参与（UserProxyAgent）；天然支持异步。

**劣势**：学习曲线陡；调试复杂；可视化能力弱，只能看日志。

### 2.2 CrewAI：角色 + 任务 + 流程

CrewAI 的设计追求直观，上手几乎没有门槛。三个核心概念：**Role**（角色）、**Goal**（目标）、**Backstory**（背景故事）。

```python
from crewai import Agent, Task, Crew, Process

# 1. 定义 Agent
researcher = Agent(
    role="研究员",
    goal="找到最权威的资料",
    backstory="你是一个有 10 年经验的研究员"
)

writer = Agent(
    role="作家",
    goal="写出引人入胜的文章",
    backstory="你是一个一个畅销书作家"
)

# 2. 定义 Task
research_task = Task(
    description="研究 DeepSeek-V3 的技术架构",
    expected_output="一份技术报告",
    agent=researcher
)

write_task = Task(
    description="基于研究写一篇 2000 字文章",
    expected_output="一篇中文文章",
    agent=writer
)

# 3. 定义 Crew（流程）
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential  # 顺序执行
)

# 4. 启动
result = crew.kickoff()
```

**优势**：概念简单（Role / Goal / Backstory 三件套）；易学易用；流程清晰可追溯。

**劣势**：灵活度低；不适合复杂状态管理；遇到分支/循环就力不从心。

### 2.3 LangGraph：图状态机

LangGraph 由 LangChain 在 2024 年推出，把 Multi-Agent 抽象成一张「**带状态的图**」。每个节点是一个 Agent，边是状态转移。

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

# 1. 定义 State
class State(TypedDict):
    research: str
    article: str
    next: str

# 2. 定义节点
def researcher_node(state):
    research = llm("研究 DeepSeek-V3")
    return {"research": research, "next": "writer"}

def writer_node(state):
    article = llm(f"基于研究写文章：{state['research']}")
    return {"article": article, "next": END}

def router(state):
    if state.get("next") == "writer":
        return "writer"
    return END

# 3. 定义图
workflow = StateGraph(State)
workflow.add_node("researcher", researcher_node)
workflow.add_node("writer", writer_node)
workflow.add_edge("researcher", "writer")
workflow.add_conditional_edges("writer", router)

# 4. 编译
app = workflow.compile()

# 5. 运行
result = app.invoke({"research": "", "article": ""})
```

**优势**：极其灵活（任意 DAG 结构）；原生支持 Mermaid 可视化；状态管理强；LangChain 生态带来工业级可观测性。

**劣势**：概念门槛高；学习曲线陡；状态设计需要经验。

### 2.4 一张表对比

| 维度 | AutoGen | CrewAI | LangGraph |
|------|---------|--------|-----------|
| 抽象 | 对话回合 | 角色 + 任务 | 图 + 状态 |
| 灵活度 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 易用性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 状态管理 | 对话历史 | 任务输出 | 完整图状态 |
| 可视化 | 日志 | 简单 | Mermaid 图 |
| 工业级 | 微软 | 创业公司 | LangChain |
| 适用 | 研究 / 复杂对话 | 简单工作流 | 复杂状态管理 |

![三大框架思维导图](https://hyqskevin.github.io/pic/agent/agent-frameworks.png)

**选型建议**：入门做研究类项目选 CrewAI；需要复杂对话交互选 AutoGen；需要精细状态控制和长流程编排选 LangGraph。

---

## 三、五种通信模式

Multi-Agent 的本质是「多个 Agent 协作」，协作的方式——也就是通信拓扑——决定了系统的能力上限。

### 3.1 顺序（Sequential）

```
A → B → C
```

任务按顺序执行，每一步依赖上一步。**适用场景**：依赖关系强的流水线，比如「研究 → 写稿 → 校对」。

### 3.2 分层（Hierarchical）

```
       ┌─→ Worker 1
       │
Manager ─┼─→ Worker 2
       │
       └─→ Worker 3
```

主 Agent 调度，子 Agent 并行执行。**适用场景**：任务可并行、需要统一协调的批处理。

### 3.3 群聊（Group Chat）

```
   A ↔ B
   ↑   ↕
   C   D
   ↕   ↕
   E
```

所有 Agent 互相可见，自行决定下一个发言者。**适用场景**：开放讨论、需要多视角碰撞的问题。AutoGen 的 GroupChat 默认就是这种模式。

### 3.4 移交（Handoff）

```
A → B
B → C
B → D   (A 不能直接联系 D)
```

OpenAI Swarm（2024）推崇的范式：Agent 间直接交接控制权，而不是通过调度器转发。**适用场景**：明确的责任链，如「客服 → 售后 → 技术支持」。

### 3.5 辩论（Debate）

```
Pro Agent  ⟷  Con Agent
     ↓
   Judge
```

多个 Agent 持不同观点对辩，最终由 Judge 仲裁。**适用场景**：需要对抗性校验的问题，比如代码审查、风险评估。

---

## 四、共识机制

三个 Agent 对同一问题给出不同答案时，听谁的？这是 Multi-Agent 的核心难题之一。

### 4.1 投票共识

多数票获胜：

$$A_{\text{final}} = \arg\max_{a} \sum_{i=1}^{N} \mathbb{1}[A_i = a]$$

适合分类题、选择题；缺点是无法处理开放式问题，也丢掉了个体差异。

### 4.2 加权共识

按 Agent 可靠性或专业度加权：

$$A_{\text{final}} = \arg\max_{a} \sum_{i=1}^{N} w_i \cdot \mathbb{1}[A_i = a]$$

每个 Agent 配一个权重 $w_i$，专业度越高权重越大。难点在于权重怎么定——一般通过历史任务表现自动更新。

### 4.3 LLM Judge 共识

直接让一个更强的 LLM 当裁判，评估每个答案的合理性：

```python
def consensus(answers):
    prompt = f"""
    以下是 {len(answers)} 个 Agent 的不同答案：
    {answers}

    请评估哪个最合理，并给出理由。
    """
    return llm(prompt)
```

这种方法的优势在于能理解语义、处理开放式问题，并能给出 reasoning 解释为什么 A 比 B 好。代价是多一次 LLM 调用，时延和成本都会增加。

---

## 五、典型失败模式

Multi-Agent 系统在生产环境最容易踩的三个坑，都是单 Agent 时代不存在的。

### 5.1 无限循环

```
A: "我需要 B 的输入"
B: "我需要 A 的输入"
A: "我需要 B 的输入"
... 无限循环
```

两个互相依赖的 Agent 互踢皮球，对话越长越长，最终撞到 context 上限。

**对策**：
- 设置 `max_round` 硬上限
- 监控对话历史长度，异常时强制终止
- 引入「裁判 Agent」打破僵局

### 5.2 Context 爆炸

```
A 的 context 越来越大
传给 B 时超过 100K
LLM 性能下降
```

每个 Agent 都把上游完整结果塞进自己的 context，几轮下来就爆掉。

**对策**：
- 任务间只传摘要而不是原文
- 定期压缩长 context
- 关键信息显式提取，丢弃噪声

### 5.3 角色混乱

```
Writer 突然开始研究
Researcher 突然开始写作
```

LLM 没有强边界感，可能在对话中被其他 Agent「带跑偏」。

**对策**：
- system prompt 中显式禁止越界
- 工具调用白名单（每个 Agent 只能用自己注册的工具）
- 行为日志监控，发现越界立即熔断

---

## 六、工业实践案例

### 6.1 自动化软件工程

用 AutoGen 实现 SWE-Bench 风格的修复 Agent：

```python
agents = [
    RepositoryAnalyst("分析代码库结构"),
    IssueResolver("根据 issue 写修复"),
    TestRunner("运行测试验证"),
    CodeReviewer("代码审查")
]

manager = GroupChat(agents)
manager.initiate_chat("修复 GitHub Issue #1234")
```

在 SWE-Bench 基准上，这种多 Agent 协作结构能把 13.86% 的 baseline 推到更高水平。

### 6.2 自动化研究

用 CrewAI 做深度研究流程：

```python
crew = Crew(
    agents=[
        arxiv_researcher("查论文"),
        web_researcher("查网页"),
        data_analyst("分析数据"),
        report_writer("写报告")
    ],
    tasks=[
        search_arxiv,
        search_web,
        analyze,
        write_report
    ],
    process=Process.hierarchical
)
```

按 hierarchical 流程自动产出研究简报，适合「研究助理」类场景。

### 6.3 多模态内容生成

用 LangGraph 编排文案 + 设计 + 审核：

```python
workflow = StateGraph(ContentState)
workflow.add_node("copywriter", write_copy)
workflow.add_node("designer", design_image)
workflow.add_node("editor", review_content)

# 循环：编辑不满意 → 返工
workflow.add_conditional_edges(
    "editor",
    lambda s: "designer" if s["needs_revision"] else END
)
```

LangGraph 的图结构天然支持「编辑不满意 → 返工」这种循环回退，比 CrewAI 的纯顺序流更适合带迭代的场景。

---

## 七、关键洞察

1. **Multi-Agent 不是"多 LLM 调用"**——本质是**角色分工 + 通信 + 共识**三件套
2. **三大框架定位不同**——AutoGen 走对话、CrewAI 走角色、LangGraph 走图，没有绝对的好坏
3. **共识机制三档**——投票 / 加权 / LLM Judge，按任务复杂度选
4. **失败模式必防**——循环、爆炸、混乱是三大经典坑
5. **A2A 协议**——2025 年开始让跨框架协作成为可能，多框架混用不再是问题

> **2024-2025 关键节点**：AutoGen / CrewAI / LangGraph 三足鼎立；A2A 协议打破框架壁垒；2025 是 Multi-Agent 走向工业化的元年。

---

## 八、必读资料

- Microsoft 2024《AutoGen》⭐⭐⭐
- CrewAI 2024《Multi-Agent Collaboration Patterns》
- LangChain 2024《LangGraph Docs》
- OpenAI 2024《Swarm》
- Google 2024《A2A Protocol》
- Microsoft 2024《Magentic-One: A Generalist Multi-Agent System》

---

## 九、延伸思考

- Q1. 什么场景适合 Multi-Agent？
- Q2. AutoGen / CrewAI / LangGraph 怎么选？
- Q3. 怎么避免无限循环？
- Q4. Multi-Agent 之间怎么分享 context？
- Q5. 跨框架 Agent 怎么协作（A2A）？
