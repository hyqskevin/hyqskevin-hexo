---
title: Agent 基础讲解（上）：概念 + 工具
date: 2026-09-02 00:00:00
description: Agent 基础讲解上篇：Agent 是什么（与 Model 区别）、感知 - 决策 - 行动 - 反馈循环、Prompt / Tool / Skill 三层用法、MCP 协议详解（架构 + 价值 + 生态）、5 类 Prompt 模板、3 个 Tool 实战示例、4 条 Skill 设计原则。
series:
  name: agent-basics
  index: 1
  total: 3
categories:
  - notes
tags:
  - Agent
  - 基础
  - 教程
  - Prompt
  - Tool
  - Skill
  - MCP
---

Agent 基础讲解（上）：**Agent 是什么**（vs Model）+ **Prompt / Tool / Skill 三层** + **MCP 协议详解**。本篇是给 AI 工程师 / 产品经理的入门课。

## 一、Agent 是什么

### 1.1 一句话定义

```text
Agent = "以大模型为核心，能调用工具、持续完成任务的系统"
```

**核心要素**：
- 大模型（推理 + 决策）
- 工具调用（行动）
- 持续性（多步任务，不是单次）

### 1.2 Agent ≠ Model

```text
Model：
  - 输入 prompt → 输出文本
  - 一次调用 = 一次响应
  - 不能调用外部 API
  - 不能持续多步

Agent：
  - 多次调用 Model
  - 主动调用工具
  - 自主决策下一步
  - 持续到任务完成
```

**关键差异**：Agent 包含 Model，但**Model 不是 Agent**。Agent = Model + 工具 + 记忆 + 规划。

### 1.3 Agent 4 步循环

```text
感知（Perception）
  ↓ 收到输入（用户消息 / 工具结果 / 环境状态）

决策（Decision）
  ↓ Model 推理："下一步做什么？"

行动（Action）
  ↓ 调工具（API / 文件 / 命令）

反馈（Feedback）
  ↓ 工具结果 / 环境变化

→ 循环直到任务完成
```

**核心**：**循环 + 反馈**——Agent 不是"想完就执行"，而是"边做边调整"。

## 二、Prompt / Tool / Skill 三层

### 2.1 Prompt（指挥语言）

```text
System Prompt：模型身份 + 行为准则
  → 写"你是谁 + 边界"
  → 例："你是客服助手，只回答订单问题"

User Prompt：当前任务输入
  → 写"做什么 + 上下文"
  → 例："查询订单 12345 的状态"

Few-shot Prompt：示例演示
  → 写"格式 + 风格"
  → 例：3 个问答样例
```

**5 类常用 Prompt 模板**：

```text
1. 角色设定：你是 [角色]，负责 [职责]
2. 任务描述：请 [做什么]，要求 [输出格式]
3. 上下文：[相关背景信息]
4. 限制：不要 [禁忌]
5. 输出：返回 [具体格式]
```

### 2.2 Tool（Agent 的手）

```text
Tool 类型：
  - API（外部服务调用）
  - 代码解释器（运行 Python / JS）
  - 文件系统（读 / 写文件）
  - 搜索（web / 数据库）
  - 数据库（SQL / NoSQL）
```

**3 个 Tool 实战示例**：

```python
# 1. 天气查询
{
  "name": "get_weather",
  "description": "查询指定城市的天气",
  "parameters": {
    "city": {"type": "string"}
  }
}

# 2. 数据库查询
{
  "name": "query_db",
  "description": "执行 SQL 查询",
  "parameters": {
    "sql": {"type": "string"}
  }
}

# 3. 发送邮件
{
  "name": "send_email",
  "description": "发送邮件",
  "parameters": {
    "to": {"type": "string"},
    "subject": {"type": "string"},
    "body": {"type": "string"}
  }
}
```

**Tool = 被动调用**（Model 决定何时用）

### 2.3 Skill（Agent 的套路）

```text
Skill = 一组 Tool + 一组 Prompt + 决策规则
  - 可复用方法
  - 主动编排多个 Tool
  - 有"经验"（不只是流程）

例：「差旅规划 Skill」
  - 工具：航班搜索、酒店搜索、日历工具
  - Prompt：分析用户需求 → 推荐 3 个方案
  - 规则：总价 < ¥5000 / 偏好早班机
```

**4 条 Skill 设计原则**：

```text
1. 单一职责：每个 Skill 解决一个具体场景
2. 可观察：每个步骤都有明确输出
3. 可回退：失败有 fallback 路径
4. 可组合：Skill 之间能嵌套调用
```

## 三、MCP（Model Context Protocol）详解

### 3.1 MCP 是什么

```text
MCP = Anthropic 提出的标准协议
  - 让 Agent 标准化连接外部数据源和工具
  - 解决"每个 Agent 重复实现工具接口"的问题
```

### 3.2 MCP 架构

```text
Host（Agent 框架）
  → Client（SDK 库）
  → Server（暴露资源 / 工具）
    - 文件系统
    - 数据库
    - API
    - 业务系统
```

**通信协议**：JSON-RPC 2.0 over stdio / SSE / Streamable HTTP

### 3.3 MCP vs 传统工具调用

| 维度 | MCP | 传统工具调用 |
|---|---|---|
| 标准化 | ✅ 统一协议 | ❌ 每个 Agent 自己定义 |
| 跨框架 | ✅ 任何支持 MCP 的 Agent | ❌ 锁定单一框架 |
| 复用 | ✅ Server 写一次，所有 Agent 用 | ❌ 每个 Agent 重写 |
| 发现 | ✅ 自动列可用 tools / resources | ❌ 手动注册 |
| 安全 | ✅ 内置权限控制 | ❌ 自己实现 |

### 3.4 MCP 价值

```text
之前：每个 Agent 框架（LangChain / AutoGen / Claude）都要自己实现工具接口
  - LangChain 调 GitHub API
  - AutoGen 调 GitHub API
  - Claude Code 调 GitHub API
  → 三套实现

之后：Agent 框架 + MCP
  - GitHub 官方写 1 个 MCP server
  - 任何 Agent 框架自动能用
  → 一套实现，全局复用
```

### 3.5 MCP 生态现状（2026）

```text
MCP Server（已知 20+）：
  - 官方：@modelcontextprotocol/server-*（GitHub / GitLab / Google Drive / Slack / Postgres / Filesystem / Brave Search / Puppeteer）
  - 社区：数百个开源 server

MCP Client（主流 Agent 都已支持）：
  - Claude Code
  - Cursor
  - Windsurf
  - Continue.dev
  - Cline
  - OpenClaw

不支持 MCP 的（2026 H2）：
  - LangChain（计划中）
  - LlamaIndex（部分）
```

## 四、3 个 Tool 实战示例（完整代码）

### 4.1 天气查询

```python
# weather_tool.py
import requests

def get_weather(city: str) -> dict:
    """查询指定城市天气"""
    api_key = "your_key"
    url = f"https://api.weather.com/v1/current?key={api_key}&city={city}"
    resp = requests.get(url, timeout=5)
    return resp.json()

# 注册到 Agent
{
  "name": "get_weather",
  "fn": get_weather,
  "description": "查询指定城市的当前天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {"type": "string", "description": "城市名"}
    },
    "required": ["city"]
  }
}
```

### 4.2 数据库查询

```python
# db_tool.py
import sqlite3

def query_db(sql: str) -> list:
    """执行 SQL 查询（只读账号）"""
    if any(kw in sql.upper() for kw in ["DROP", "DELETE", "UPDATE", "INSERT"]):
        return {"error": "只读模式"}
    conn = sqlite3.connect("app.db")
    cur = conn.execute(sql)
    return cur.fetchall()
```

### 4.3 发送邮件

```python
# email_tool.py
import smtplib
from email.mime.text import MIMEText

def send_email(to: str, subject: str, body: str) -> str:
    """发送邮件"""
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["To"] = to
    msg["From"] = "bot@myapp.com"

    with smtplib.SMTP_SSL("smtp.myapp.com", 465) as server:
        server.login("bot@myapp.com", os.getenv("SMTP_PASS"))
        server.send_message(msg)
    return f"Sent to {to}"
```

## 五、3 个 Skill 实战示例

### 5.1 差旅规划 Skill

```yaml
name: travel_planning
description: 为用户规划出差行程
tools:
  - search_flight
  - search_hotel
  - get_calendar
  - book_travel
prompt: |
  分析用户出差需求：
  1. 出发地 + 目的地 + 日期
  2. 预算
  3. 偏好（早班机 / 靠窗 / 连锁酒店）
  
  推荐 3 个行程方案，列出：
  - 总价
  - 行程时间
  - 关键风险（如转机时间）
rules:
  - 总价不超预算 + 10%
  - 转机时间 ≥ 90 分钟
  - 优先选择常旅客户喜欢的品牌
```

### 5.2 数据分析 Skill

```yaml
name: data_analysis
description: 自动分析 CSV / Excel 数据
tools:
  - read_file
  - run_python  # 在沙箱里
  - save_chart
prompt: |
  1. 读取文件（前 100 行预览）
  2. 询问用户分析目标
  3. 用 Python（Pandas）分析
  4. 输出可视化图表
  5. 总结 3 个关键发现
```

### 5.3 客户支持 Skill

```yaml
name: customer_support
description: 处理客户咨询
tools:
  - search_kb
  - read_ticket
  - reply_ticket
prompt: |
  1. 读 ticket 内容
  2. 查知识库
  3. 草拟回复
  4. 等人工审核
  5. 标记状态
rules:
  - 涉及退款必须人工
  - 涉及法律必须人工
  - 简单问答直接回复
```

## 六、3 个核心 takeaway

### 6.1 Agent 是"循环 + 反馈"

不是"想一次做一次"，而是"边做边调整"——**这是 Agent 跟普通 LLM 应用的最大区别**。

### 6.2 Prompt / Tool / Skill 三层

- Prompt：给模型的指令
- Tool：模型能调的能力
- Skill：组合 Tool + Prompt 的 SOP

**3 者结合 = 一个能干活、能学、能积累经验的 Agent**。

### 6.3 MCP 是未来

1 个 GitHub MCP server = 所有 Agent 能用 GitHub。
1 套实现 = 全局复用。

**5 年后回看，MCP 可能是 Agent 时代最重要的协议之一**。

## 七、本文 + 后续

- （上）基础概念 + 工具（本文）
- （中）上下文 + 记忆
- （下）架构 + 部署 + 实战项目

---

> **Agent 基础的核心**：**Model + Tool + Memory + Loop = Agent**。**MCP 是 Agent 时代最重要的协议**——**一次写、全部 Agent 用**。**未来 3 年是 Agent 落地期**——**会写 Skill + 用 MCP = 核心竞争力**。