---
title: Spring AI 仓库 Top15
date: 2026-10-18 00:00:00
description: 按 GitHub stars 倒序盘点 Spring AI 生态 15 个核心仓库，涵盖 Spring 官方框架、阿里 spring-ai-alibaba 增强版、Atmosphere JVM 运行时、MCP/A2A 官方协议 SDK、企业级 DataAgent/Lynxe/AssistantAgent 与多套实战教程，给 Java 开发者一份从入门选型到生产落地可执行的完整地图，配套 README 摘要与技术标签便于检索。
categories: [notes]
tags: [Spring AI, GitHub, 仓库盘点, AI Agent, MCP, Java]
---

> 本文调研数据来自 GitHub 公开仓库，调研日期 2026-08-28。仓库按 stars 倒序整理，stars 数与活跃度随时变化，请以发布时为准。

Java 圈的 AI 开发生态目前主要围绕两个核心展开：**Spring 官方框架** 与 **阿里 spring-ai-alibaba 增强版**。本文按 stars 倒序盘点其中最值得关注的 15 个仓库，覆盖框架底座、运行时协议、垂直场景 Agent、多智能体工作流与实战教程，配 README 摘要便于快速判断是否值得收藏。

![Spring AI 仓库 Top15](https://hyqskevin.github.io/pic/notes/spring-ai-repos-overview.png)

## 一、调研概览

### 1.1 数据来源与排序

- **数据源**：GitHub API，按 stars 倒序拉取，截取前 15 名。
- **筛选原则**：与 Spring AI 直接相关（官方框架、阿里增强、协议 SDK、运行时、示例、教程、社区工具）。
- **更新频率**：stars 数为调研时（2026-08-28）快照，不代表当前真实热度。

### 1.2 仓库类型分布

按职责把 15 个仓库分成五类：

| 类别 | 数量 | 代表仓库 |
|---|---|---|
| 框架底座 | 2 | spring-projects/spring-ai、agents-flex/agents-flex |
| 运行时与协议 | 2 | Atmosphere/atmosphere、modelcontextprotocol/java-sdk |
| 企业级 Agent | 4 | spring-ai-alibaba (含 DataAgent/Lynxe/AssistantAgent) + liyupi/yu-ai-agent |
| 多智能体工作流 | 1 | langgraph4j/langgraph4j |
| 示例与教程 | 4 | spring-ai-alibaba/examples、ThomasVitale/llm-apps-java-spring-ai、qifan777/dive-into-spring-ai、awesome-spring-ai |
| 工具增强 | 2 | spring-ai-community/spring-ai-agent-utils、agents-flex/agents-flex |

> 小提示：spring-ai-alibaba 拆出了 DataAgent / Lynxe / AssistantAgent 三个独立仓库，下文会逐条说明。

## 二、框架底座

### 2.1 alibaba/spring-ai-alibaba

- ⭐ **10737** | 💻 Java | 📅 更新于 2026-08
- **标签**：alibaba, agent, graph, workflow, java, china
- **定位**：Agentic AI Framework for Java Developers —— Spring AI 的阿里增强版，国内生产首选

**README 摘要**：基于 Spring AI 的生产级 Agent 框架，组合三件套：

- **Agent Framework**：SequentialAgent / ParallelAgent / RoutingAgent / LoopAgent 编排能力，配合 Context Engineering 与 Human-in-the-Loop。
- **Graph**：图式工作流运行时，支持持久化、流式、嵌套图。
- **Admin 可视化平台**：链路追踪、Prompt 工程、Evaluation、MCP 管理，集成 Dify。

模型层支持 DashScope、DeepSeek、多模态、Voice Agent、A2A，官网 `java2ai.com`。

### 2.2 spring-projects/spring-ai

- ⭐ **9369** | 💻 Java | 📅 更新于 2026-08
- **标签**：official, framework, ai, spring, mcp, rag
- **定位**：An Application Framework for AI Engineering —— Spring 官方推出的 AI 应用开发框架

**README 摘要**：Spring-friendly API 与抽象，统一多模型（OpenAI / Anthropic / Bedrock / Ollama / DeepSeek 等）接入，覆盖 Chat / Embedding / Image / Audio / Structured Output 四类基础能力；内置 25+ 向量库适配，原生支持 Tool Calling、RAG、Prompt Templating、MCP。

- 当前 **2.x** 配 **Spring Boot 4**。
- 当前 **1.1.x** 配 **Spring Boot 3.5**。

### 2.3 agents-flex/agents-flex

- ⭐ **1042** | 💻 Java | 📅 更新于 2026-08
- **标签**：agent-framework, lightweight, java
- **定位**：对标 Spring AI 的轻量级 Java AI Agent 框架

**README 摘要**：定位为 Spring AI 的"轻量对应物"，支持多种模型接入与 Agent 构建，启动成本低、依赖小，适合不希望引入 Spring 全家桶的项目。

## 三、运行时与协议底座

### 3.1 Atmosphere/atmosphere

- ⭐ **3796** | 💻 Java | 📅 更新于 2026-08
- **标签**：agent-runtime, websocket, sse, mcp, a2a
- **定位**：JVM 上的 AI Agent 实时运行时，`@Agent` 注解即完整 Deep Agent

**README 摘要**：

- **12 个运行时适配器**：覆盖 Spring AI / LangChain4j / Anthropic 等。
- **一个 `@Agent` 类即获得**：memory + plan + virtual filesystem + sub-agent delegation。
- **统一 broadcaster**：WebSocket / SSE / long-polling / gRPC。
- **可暴露为**：MCP / A2A / AG-UI / Slack / Discord。
- 提供 Durable session、replay buffer、HITL approval、plan-and-verify governance。

### 3.2 modelcontextprotocol/java-sdk

- ⭐ **3671** | 💻 Java | 📅 更新于 2026-08
- **标签**：mcp, sdk, official
- **定位**：MCP 官方 Java SDK（Spring AI MCP 即构建于此之上）

**README 摘要**：Model Context Protocol 官方 Java SDK，提供同步 / 异步两种通信模式，Client 与 Server 两端完整实现。Spring AI MCP 在此之上封装 spring-boot-starter、annotation-based method handling 与 OAuth 2.0 / API Key 安全模块，可配合 Spring Initializr 一键起项目。

## 四、企业级垂直 Agent

### 4.1 spring-ai-alibaba/examples

- ⭐ **2865** | 💻 Java | 📅 更新于 2026-08
- **标签**：examples, tutorial, mcp, rag, graph
- **定位**：Spring AI & Spring AI Alibaba 官方示例大全，从 HelloWorld 到 Graph 多智能体

**README 摘要**：覆盖 30+ 可运行模块 —— `helloworld` / `dashscope-chat` / `deepseek-chat` / `openai-image` / `mcp` / `rag` / `tool-calling` / `mem0` / `graph` / `multiagent-patterns` / `multimodal` / `voice-agent` 等。每个模块独立 Maven 子工程，附带 `.env.example` 与 README。中文环境配置文档详细列出 `AI_DASHSCOPE_API_KEY` 等常见环境变量。

### 4.2 liyupi/yu-ai-agent

- ⭐ **2631** | 💻 Java | 📅 更新于 2026-08
- **标签**：tutorial, react, mcp, bilibili, china
- **定位**：AI 恋爱大师 + 超级智能体 YuManus，国内最受欢迎 Spring AI 实战教程

**README 摘要**：基于 Spring Boot 3 + Java 21 + Spring AI 构建。

- **AI 恋爱大师应用**：多轮对话 / RAG / 工具调用 / MCP（如地图约会规划）。
- **YuManus 超级智能体**：ReAct 模式自主规划，支持网页搜索、PDF 生成。
- **配套资源**：B 站视频（BV1UoLezKEbm）+ 文字教程 + 简历写法 + 面试题解，编程导航出品。

### 4.3 spring-ai-alibaba/DataAgent

- ⭐ **2576** | 💻 Java | 📅 更新于 2026-08
- **标签**：data-analysis, text-to-sql, python-sandbox, mcp, enterprise
- **定位**：基于 Spring AI Alibaba Graph 的企业级智能数据分析 Agent

**README 摘要**：

- **Text-to-SQL** + **Python 深度分析** + **ECharts 智能报告** + **MCP Server** + **RAG 增强**。
- 基于 **StateGraph** 多轮对话意图理解。
- **Python 沙箱**执行 PEP 723 动态依赖，自动清理与失败重试。
- 兼容 OpenAI 接口规范模型，可挂任意向量库。
- 可作为 MCP 服务器接入 Claude Desktop。

### 4.4 spring-ai-alibaba/Lynxe

- ⭐ **1079** | 💻 Java | 📅 更新于 2026-08
- **标签**：manus, multi-agent, mcp, enterprise
- **定位**：Java 版 Manus，阿里内部高确定性 Prompt 编程工作室

**README 摘要**：纯 Java 多智能体协作实现。

- **Func-Agent 模式**：精确控制每步执行（高确定性）。
- 原生 MCP 集成，HTTP 服务调用接口便于 Java 二次开发。
- 原名 **JManus**，用于处理探索型任务：从海量数据中精准取数写入数据库、分析日志并发告警等。
- 提供 **Use Cases 库**（Lynxe-public-prompts）做提示工程复用。

### 4.5 spring-ai-alibaba/AssistantAgent

- ⭐ **507** | 💻 Java | 📅 更新于 2026-08
- **标签**：code-as-action, graalvm, skills, customer-service
- **定位**：Code-as-Action 企业级智能助理框架（GraalVM 沙箱）

**README 摘要**：

- 采用 **Code-as-Action** 范式，AI 生成代码并在 **GraalVM Polyglot 沙箱**内安全执行。
- **Evaluation Graph**：多层意图识别 + 动态 Prompt Builder。
- 统一经验系统：**COMMON / REACT / TOOL** 三层 Skills 模型双向转换。
- 多渠道交付：钉钉 / 飞书 / 企微 Webhook。
- 落地场景：智能客服、运维助手。

## 五、多智能体工作流

### 5.1 langgraph4j/langgraph4j

- ⭐ **1950** | 💻 Java | 📅 更新于 2026-08
- **标签**：langgraph, langchain4j, multi-agent, workflow, java
- **定位**：LangGraph 的 Java 实现，专为 langchain4j 与 Spring AI 设计

**README 摘要**：LangGraph for Java 端口，用于构建**有状态多智能体应用**。可与 langchain4j 或 Spring AI 配合，灵感来自 LangChain AI 项目。

- 当前 **1.8.x stable** 配 Java 17+。
- **1.8-SNAPSHOT** 活跃开发中。
- 提供 Maven Central 与快照仓库。

## 六、示例与教程

### 6.1 ThomasVitale/llm-apps-java-spring-ai

- ⭐ **777** | 💻 Java | 📅 更新于 2026-08
- **标签**：examples, ollama, rag, multi-model
- **定位**：Java 25 + Spring AI 全场景示例集合（Ollama / Mistral / OpenAI）

**README 摘要**：覆盖 **Chatbot / RAG 问答 / 语义搜索 / 结构化数据抽取 / 文本分类** 5 大场景，使用 Mistral AI、Ollama、OpenAI、Multiple Providers 等多种模型；Embedding 部分同样多家实现。要求 **Java 25 + Podman / Docker**。维护者 Thomas Vitale 是 Spring AI 团队核心贡献者。

### 6.2 qifan777/dive-into-spring-ai

- ⭐ **423** | 💻 Java | 📅 更新于 2026-08
- **标签**：tutorial, rag, graph-rag, bilibili, china
- **定位**：《动手学 SpringAI》教程源码，含 B 站全套视频

**README 摘要**：包含 **SSE 流 / Agent 智能体 / FunctionCall / Embedding / VectorDatabase / RAG / Graph RAG / 历史消息 / 图片生成 / 图片理解** 等 16+ 知识点。运行环境：

```text
Java 17+
Node 18+
MySQL 8
Redis-Stack（带向量查询）
Neo4j 5+
```

B 站视频 BV14y411q7RN，配套起凡 AI 中转站赠送 25 刀额度。

## 七、社区资源与工具增强

### 7.1 spring-ai-community/awesome-spring-ai

- ⭐ **834** | 📄 Markdown | 📅 更新于 2026-08
- **标签**：awesome, resource-list, tutorial, mcp
- **定位**：Spring AI 资源汇总 Awesome 列表（社区维护）

**README 摘要**：精选 Spring AI 学习资源 / 工具 / 教程 / 项目清单，包含：

- 官方文档、Spring AI Blogs、书籍、Medium、Udemy 课程、YouTube、Podcasts、Workshops。
- 非英文资源、UI 客户端、CLI 应用。
- MCP 服务器与领域特定 MCP 实现。
- 社区推荐关注人物与基准测试。

### 7.2 spring-ai-community/spring-ai-agent-utils

- ⭐ **604** | 💻 Java | 📅 更新于 2026-08
- **标签**：claude-code, agent, skills, a2a
- **定位**：把 Claude Code 风格工具与 Agent Skills 移植到 Spring AI

**README 摘要**：把 Claude Code 的 `FileOperation` / `Shell` / `WebFetch` / `TodoWrite` 等工具逆向实现为 Spring AI ToolCall。

- 支持**子代理 SPI**、**A2A 协议子代理实现**、**BOM 版本管理**。
- `examples/` 目录含 `code-agent-demo` / `skills-demo` / `subagent-demo` / `subagent-a2a-demo` / `todo-demo` / `memory-tools-demo` 等 **7 个可直接跑的 Demo**。

## 八、选型决策

把上面 15 个仓库按"用得上"的频次做成一张决策表：

- **要 Spring 官方框架** → [spring-projects/spring-ai](https://github.com/spring-projects/spring-ai)（9.3k⭐），最稳的入门选择。
- **要国内生产级 Agent** → [alibaba/spring-ai-alibaba](https://github.com/alibaba/spring-ai-alibaba)（10.7k⭐），stars 最高且文档中文友好。
- **要可运行 RAG / MCP / Graph 示例** → [spring-ai-alibaba/examples](https://github.com/spring-ai-alibaba/examples)（2.8k⭐），30+ 模块即取即跑。
- **要 B 站手把手教程** → [liyupi/yu-ai-agent](https://github.com/liyupi/yu-ai-agent)（2.6k⭐）或 [qifan777/dive-into-spring-ai](https://github.com/qifan777/dive-into-spring-ai)（0.4k⭐）。
- **要 JVM 实时运行时 + Agent 协议** → [Atmosphere/atmosphere](https://github.com/Atmosphere/atmosphere)（3.8k⭐），WebSocket / SSE / MCP / A2A 一站式。
- **要 MCP / A2A 协议参考实现** → [modelcontextprotocol/java-sdk](https://github.com/modelcontextprotocol/java-sdk)（3.7k⭐），所有 Spring AI MCP 都构建于此。
- **要企业级数据分析 Agent** → [spring-ai-alibaba/DataAgent](https://github.com/spring-ai-alibaba/DataAgent)（2.6k⭐），Text-to-SQL + Python 沙箱。
- **要高确定多智能体协作** → [spring-ai-alibaba/Lynxe](https://github.com/spring-ai-alibaba/Lynxe)（1.1k⭐），Func-Agent 模式。
- **要 Code-as-Action 客服 / 运维助理** → [spring-ai-alibaba/AssistantAgent](https://github.com/spring-ai-alibaba/AssistantAgent)（0.5k⭐），GraalVM 沙箱。
- **要 LangGraph 多智能体工作流** → [langgraph4j/langgraph4j](https://github.com/langgraph4j/langgraph4j)（2.0k⭐）。
- **要轻量、不绑 Spring 全家桶** → [agents-flex/agents-flex](https://github.com/agents-flex/agents-flex)（1.0k⭐）。
- **要 Java 25 + 多模型示例** → [ThomasVitale/llm-apps-java-spring-ai](https://github.com/ThomasVitale/llm-apps-java-spring-ai)（0.8k⭐）。
- **要 Claude Code 风格工具集** → [spring-ai-community/spring-ai-agent-utils](https://github.com/spring-ai-community/spring-ai-agent-utils)（0.6k⭐）。
- **要资源汇总 / Awesome 列表** → [spring-ai-community/awesome-spring-ai](https://github.com/spring-ai-community/awesome-spring-ai)（0.8k⭐）。

## 模型版本说明

⚠️ **以发布时为准**：本文涉及的 Spring AI 版本号（1.1.x / 2.x）、Spring Boot 版本号（3.5 / 4）、Java 版本要求（17 / 21 / 25）以及各仓库 stars 数均为 2026-08-28 调研时的快照。后续版本可能演进（如 Spring Boot 4 GA、Spring AI 2.x 稳定版特性扩展），落地前请以官方仓库最新 README 与 release notes 为准。

> 安全提醒：本文示例代码里的所有 API Key、Token、连接字符串均为占位符（`<YOUR_API_KEY>` / `<YOUR_TOKEN>`），生产环境务必放到环境变量或密钥管理服务，不要写进仓库。