---
title: MCP 协议业务应用
date: 2026-09-02 00:00:00
description: MCP 协议在行内 / 银行业的应用展望：6 分钟演讲稿（业务视角）+ MCP 核心概念 + 银行业的 4 个落地场景 + 听众问答 + 5 条落地建议。
categories:
  - notes
tags:
  - MCP
  - Agent
  - 银行业务
  - 演讲
  - 协议
---

最近做了一次 6 分钟 MCP（Model Context Protocol）演讲比赛稿——业务视角（特别是银行业务流程）。这篇是演讲稿完整内容 + 听众提问 + 落地建议。

## 一、演讲稿（6 分钟版）

### 第一页（30 秒）：开篇

> 各位评委领导同事，大家好。今天讲 MCP 协议——以及它如何让智能体更懂业务。

智能体这两年发展很快，应用层出不穷。我们都希望智能体**打破信息孤岛、串联各业务系统**，但现实是：**每对接一个系统就要付出人力成本**。智能体功能越庞大，要对接的系统越多，关系越复杂。

**MCP 协议**就是为这个痛点而生的标准化协议。

### 第二页（1 分钟）：什么是 MCP

```text
MCP = Model Context Protocol（模型上下文协议）

核心定位：
  - 给智能体看的标准化协议
  - 让智能体能看懂业务
  - 能调用接口
  - 能组合功能

类比：
  像 USB 接口 —— 有了 MCP，每个智能体就有了统一的
  业务说明书和系统规范
```

### 第三页（1 分钟）：为什么需要 MCP

```text
传统集成：
  智能体 A → 系统 X（写一套 API 适配）
  智能体 A → 系统 Y（又写一套）
  智能体 B → 系统 X（再写一套）
  → 10 个智能体 × 5 个系统 = 50 个适配

MCP 模式：
  系统 X 暴露 MCP Server（写一次）
  系统 Y 暴露 MCP Server（写一次）
  任何支持 MCP 的智能体自动能调
  → 10 × 5 = 15 个实现，复用
```

### 第四页（1.5 分钟）：MCP 三大原语

| 原语 | 作用 | 银行业务例子 |
|---|---|---|
| **Resources** | 只读数据 | 客户基本信息 / 交易明细 / 利率表 |
| **Tools** | 可执行操作 | 转账 / 贷款计算 / 风险评估 |
| **Prompts** | 预制模板 | "信用卡申请引导" 流程 |

```text
场景：智能体客户经理
  Resources：拉客户画像 + 交易历史
  Tools：算贷款额度 + 生成报告
  Prompts：套用"理财推荐"模板
  → 一次对话完成 3 件事
```

### 第五页（1.5 分钟）：MCP 在银行业的 4 个落地场景

| 场景 | MCP 价值 |
|---|---|
| 客户经理助手 | 自动拉取客户画像 + 算额度 + 推荐产品 |
| 风控报告生成 | 调多个数据源（征信 / 内部数据）+ 生成报告 |
| 客服智能体 | 接入核心系统（账户 / 交易 / 客服） |
| 内部知识库 | 银行内部规章 + 产品手册 + 案例 |

### 第六页（30 秒）：结尾

> MCP 不是万能药——它解决**标准化问题**，不解决**业务理解问题**。智能体能调用接口 ≠ 智能体能做业务。要让 AI 真正帮上忙，业务部门 + IT 部门 + AI 团队需要一起**重新设计工作流**。

## 二、听众问答

### Q1：MCP 和传统 API 有什么区别？

A：API 是"如何调用"，MCP 是"如何暴露给 AI"。

| 维度 | API | MCP |
|---|---|---|
| 目标用户 | 开发者 | AI Agent |
| 接口规范 | OpenAPI / REST | JSON-RPC 2.0 |
| 鉴权 | OAuth / API Key | OAuth / API Key |
| 上下文 | 手动管理 | 自动管理（Resources） |
| 流式 | 复杂 | 原生支持（Streaming） |

**MCP 优势**：AI Agent 不用写适配代码，自动发现 + 调用系统的能力。

### Q2：MCP 安全吗？

A：MCP 本身**不解决安全**，它解决"标准化"。安全靠：

```text
- 鉴权：每个 MCP Server 独立 OAuth scope
- 沙箱：Agent 不能任意调用 Tools，需要权限
- 审计：所有 Tool 调用都记录
- 数据脱敏：Resources 返回前过滤敏感字段
```

银行业应用：**MCP Server 部署在银行内网**，不暴露公网，AI Agent 通过 VPN 访问。

### Q3：MCP 和 Function Calling 区别？

A：Function Calling 是单次请求里描述函数，**MCP 是持续的协议连接**。

```text
Function Calling：
  - 单次 prompt + tools 列表 → LLM 选工具 → 一次调用
  - 工具实现需要 LLM 框架支持

MCP：
  - 持续连接：stdio / SSE / Streamable HTTP
  - 工具可以独立部署 + 更新
  - 跨 Agent / 跨语言通用
```

MCP 是**协议层**创新，Function Calling 是**调用层**约定。

### Q4：MCP 怎么跟 LangChain / AutoGen 集成？

A：MCP 是**协议**，不是框架。所有主流 Agent 框架都支持 MCP。

```python
# LangChain 用 MCP
from langchain_mcp import MCPToolkit
toolkit = MCPToolkit(transport="stdio", command="python server.py")
tools = toolkit.get_tools()

# AutoGen 用 MCP
from autogen_ext_mcp import McpWorkbench
workbench = McpWorkbench(server_params=...)
```

### Q5：MCP 实施成本？

A：**MCP Server 写一次，所有 Agent 复用**。

```text
传统集成：N × M（每个 Agent × 每个系统都要写）
MCP 集成：N + M（每个 Agent + 每个系统都写一次）
```

**例子**：10 个 Agent + 5 个系统

- 传统：50 个适配
- MCP：15 个实现（10 + 5）

**长期 ROI 极高**。

### Q6：MCP 替代 RPA 吗？

A：**不替代，是升级**。

- RPA：按脚本执行，机械重复
- MCP：让 AI Agent 调用，**智能判断**

MCP 适合"需要判断"的场景（"该不该给客户办信用卡？"），RPA 适合"无需判断"的场景（"批量处理报表"）。

## 三、5 条落地建议

### 3.1 先选 1 个高频场景试点

不要一次铺开。选**最高频 + 最痛**的场景做 MVP：

| 场景 | 频次 | 痛度 |
|---|---|---|
| 客户经理助手 | 极高 | 高 |
| 风控报告生成 | 中 | 高 |
| 客服智能体 | 极高 | 中 |
| 内部知识库 | 高 | 中 |

**推荐先做"客户经理助手"**——频次高 + 痛度明显 + 闭环快。

### 3.2 IT + 业务 + AI 三方共建

```text
IT 部门：
  - 写 MCP Server（暴露系统能力）
  - 部署 + 监控
业务部门：
  - 提需求 + 评估效果
  - 反馈改进
AI 团队：
  - 选 Agent 框架
  - 调优 Prompt
```

**任何一方单独做都失败**。

### 3.3 从内部数据开始

不要一上来接核心交易系统。从**内部知识库**开始：

- 银行内部规章
- 产品手册
- 操作指南

**风险低**（无交易风险），**价值高**（员工日常查询节省时间）。

### 3.4 重视 Prompt 工程

MCP 暴露"能力"，**AI 怎么用这些能力**靠 Prompt。

```python
# 错误 Prompt
"给我看下客户的信用卡额度"

# 正确 Prompt
"""
你是客户经理助手。请按以下步骤：
1. 调 customer_info 工具获取客户画像
2. 调 credit_limit 工具获取信用卡额度
3. 调 product_recommend 工具推荐 3 个产品
4. 输出格式：表格 + 简短分析
"""
```

### 3.5 评估 ROI 严格

每个 MCP 集成要有**可量化指标**：

| 场景 | 评估指标 |
|---|---|
| 客户经理助手 | 客户经理每天节省 1 小时（n=10 验证） |
| 风控报告 | 报告生成时间从 30 分钟 → 5 分钟 |
| 客服 | 客户问题一次解决率（不需转人工） |
| 知识库 | 员工查询问题节省时间（抽样统计） |

**6 个月内不达预期 → 换方向**，不要"再坚持一下"。

## 四、4 条避坑

1. **不要一上来接核心交易系统**——从内部知识库等"低风险"场景起步
2. **不要追求"全行 Agent"**——单点突破再扩展
3. **不要忽视 Prompt 工程**——MCP 是基础，Prompt 是上层
4. **不要短期看不到效果就放弃**——AI 改造需要 6-12 月

## 五、3 个相关项目

- [modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification) — MCP 官方规范
- [anthropics/mcp](https://github.com/anthropics/mcp) — Anthropic 维护
- [langchain-ai/langchain-mcp](https://github.com/langchain-ai/langchain-mcp) — LangChain 集成

## 六、本文 + 后续

- 演讲稿（已写）
- MCP 技术实现详解（已写）
- 银行业落地 3 步法（待续）

---

> **核心结论**：MCP 不是银行业的"AI 万灵药"，**它是"让 AI 能用上银行业务系统"的标准**。解决了"接口标准化"，剩下的是"Prompt 调优 + 工作流重设计 + 团队协同"。MCP 是起点，不是终点。