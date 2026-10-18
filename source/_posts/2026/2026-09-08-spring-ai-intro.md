---
title: Spring AI 入门实战
date: 2026-09-08 00:00:00
description: 梳理 Spring AI 与 Spring AI Alibaba 生态的优质 GitHub 仓库、核心 API 及快速上手示例，并汇总 B 站、知乎、小红书上的课程与学习路径，帮 Java 开发者快速入门 AI 应用开发。
categories: [notes]
tags: [Spring AI, Java, AI Agent, RAG, MCP, 实战教程]
---

> 本文调研数据来自 GitHub 公开仓库与 B 站/知乎/小红书公开内容，调研日期 2026-08-28。仓库数据按 stars 倒序整理，课程热度随时间变化，请以发布时为准。

![Spring AI 生态概览](https://hyqskevin.github.io/pic/notes/spring-ai-overview.png)

## 一、仓库概览

Java 圈的 AI 开发生态目前主要围绕两个核心展开：**Spring 官方框架** 与 **阿里增强版**。下表按 GitHub stars 倒序，列出最值得关注的 15 个仓库，覆盖框架、运行时、示例与工具链。

| 仓库 | ⭐ | 定位 |
|---|---|---|
| [alibaba/spring-ai-alibaba](https://github.com/alibaba/spring-ai-alibaba) | 10737 | Spring AI 阿里增强版，国内生产首选 Agent 框架 |
| [spring-projects/spring-ai](https://github.com/spring-projects/spring-ai) | 9369 | Spring 官方 AI 应用开发框架 |
| [Atmosphere/atmosphere](https://github.com/Atmosphere/atmosphere) | 3796 | JVM 上 AI Agent 实时运行时 |
| [modelcontextprotocol/java-sdk](https://github.com/modelcontextprotocol/java-sdk) | 3671 | MCP 官方 Java SDK（Spring AI MCP 构建于此） |
| [spring-ai-alibaba/examples](https://github.com/spring-ai-alibaba/examples) | 2865 | 官方示例大全，HelloWorld 到 Graph 多智能体 |
| [liyupi/yu-ai-agent](https://github.com/liyupi/yu-ai-agent) | 2631 | 最受欢迎的 Spring AI 实战教程 |
| [spring-ai-alibaba/DataAgent](https://github.com/spring-ai-alibaba/DataAgent) | 2576 | 企业级智能数据分析 Agent |
| [langgraph4j/langgraph4j](https://github.com/langgraph4j/langgraph4j) | 1950 | LangGraph 的 Java 实现 |
| [spring-ai-alibaba/Lynxe](https://github.com/spring-ai-alibaba/Lynxe) | 1079 | Java 版 Manus 多智能体协作 |
| [agents-flex/agents-flex](https://github.com/agents-flex/agents-flex) | 1042 | 轻量级 Java AI Agent 框架 |

还有社区维护的 [awesome-spring-ai](https://github.com/spring-ai-community/awesome-spring-ai)、[ThomasVitale/llm-apps-java-spring-ai](https://github.com/ThomasVitale/llm-apps-java-spring-ai)、[spring-ai-agent-utils](https://github.com/spring-ai-community/spring-ai-agent-utils)、[AssistantAgent](https://github.com/spring-ai-alibaba/AssistantAgent) 与 [dive-into-spring-ai](https://github.com/qifan777/dive-into-spring-ai) 等值得收藏。

### 1.1 两大框架怎么选

- **要 Spring 官方框架** → `spring-projects/spring-ai`（9.3k⭐），Spring-friendly API，统一接入 OpenAI/Anthropic/Bedrock/Ollama/DeepSeek 等，支持 Chat/Embedding/Image/Audio、Tool Calling、RAG、MCP。
- **要国内生产级 Agent** → `alibaba/spring-ai-alibaba`（10.7k⭐），在 Spring AI 之上提供 Agent Framework（Sequential/Parallel/Routing/Loop Agent）+ Graph 图式工作流 + Admin 可视化平台，支持 DashScope/DeepSeek/多模态/Voice Agent/A2A。

> 小提示：Spring AI 当前 2.x 配 Spring Boot 4，1.1.x 配 Spring Boot 3.5。选型时务必对齐 Boot 版本，避免 starter 冲突。

## 二、核心 API 与快速上手

Spring AI 的设计目标是用「一套抽象」屏蔽不同模型厂商的差异。最小可运行的聊天示例，从加依赖到发起第一次对话只需几步。

### 2.1 引入依赖

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-model-openai</artifactId>
    <version>1.1.0</version>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-starter-mcp-client</artifactId>
    <version>1.1.0</version>
</dependency>
```

配置 API Key 与模型（生产环境建议放环境变量，勿写死在仓库）：

```yaml
spring:
  ai:
    openai:
      api-key: ${YOUR_API_KEY}
      chat:
        options:
          model: gpt-4o
```

### 2.2 发起第一次对话

```java
@RestController
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/chat")
    public String chat(@RequestParam String msg) {
        return chatClient.prompt()
                .user(msg)
                .call()
                .content();
    }
}
```

### 2.3 工具调用与 RAG

Tool Calling 让模型能调用你的 Java 方法（如查数据库、调用天气接口）；RAG 则把私有知识灌入向量库再做检索增强。两者都是生产落地的关键能力：

```java
@Bean
public ToolCallbackProvider tools(CalendarService calendar) {
    return MethodToolCallbackProvider.builder()
            .toolObjects(calendar)
            .build();
}
```

官方示例仓库 `spring-ai-alibaba/examples` 提供 30+ 可运行模块（helloworld / dashscope-chat / deepseek-chat / mcp / rag / tool-calling / graph / multimodal / voice-agent），每个模块独立 Maven 子工程，并附 `.env.example`。运行前填入对应环境变量即可：

```bash
cp .env.example .env
# 编辑 .env，填入 AI_DASHSCOPE_API_KEY 等
export AI_DASHSCOPE_API_KEY=<YOUR_API_KEY>
./mvnw -pl helloworld spring-boot:run
```

## 三、课程路径与学习资源

公开平台的课程质量参差，下面按「平台 + 热度」筛选值得跟的路线。

### 3.1 B 站（免费视频为主）

| 课程 | UP 主 | 热度 |
|---|---|---|
| SpringAI+DeepSeek 大模型应用开发实战 | 黑马程序员 | 960864 |
| SpringAI Alibaba 实战（RAG、SAA、MCP） | 尚硅谷 | 819361 |
| Java AI Agent + Spring AI Alibaba Agent Framework | 图灵官方 | 132401 |
| Spring AI 2.0 Agent 手写 Claude Code 代码生成助手 | 图灵学院诸葛 | 7002 |

黑马与尚硅谷的两套是热度最高的入门首选；图灵系课程更偏 Agent/Graph 工程化，适合进阶。

### 3.2 知乎（长文深读）

- [推荐一个基于 Spring Boot 4.0 + Java 21 + Spring AI 2.0 的大模型项目](https://zhuanlan.zhihu.com/p/2001430705301890269)（JavaGuide）
- [告别传统 Text-to-SQL：DataAgent 深度解析](https://zhuanlan.zhihu.com/p/2002440465732100952)（阿里巴巴中间件）
- [用 Spring AI Alibaba 把 MultiAgent 实现从 5 天压到 5 小时](https://zhuanlan.zhihu.com/p/2010654369599734941)（千问云）
- [Spring AI-01-快速入门](https://zhuanlan.zhihu.com/p/2039453005368529742)（小顾同学）

适合在掌握基础后做 MCP / RAG / Agent 模式专题深读。

### 3.3 小红书（项目模板参考）

多为「几分钟上手」短笔记与架构图模板，适合快速找 demo 与避坑点，例如《5 分钟上手 SpringAI》《Spring AI 2.0 接 Milvus 做混合检索：RAG》。注意区分官方文档与二手搬运，避免抄到过时 API。

## 四、实战建议

### 4.1 推荐学习路径

1. **入门**：黑马/尚硅谷免费视频，先吃透 Spring AI 基础 + ChatClient。
2. **进阶**：知乎专栏长文，深读 MCP / RAG / Agent 模式。
3. **实战**：用 `spring-ai-alibaba/examples` 跑通完整 demo，再改造成自己的业务。
4. **避坑**：关注评论区与版本说明，框架迭代快，老教程的 starter 坐标可能已变。

### 4.2 落地要点

- **版本对齐**：Spring AI 与 Spring Boot 强绑定，升级前先查官方兼容性矩阵。
- **密钥管理**：API Key 一律走环境变量或配置中心，禁止提交到代码仓库。
- **从 RAG 起步**：企业内部知识问答是最常见的第一个可落地场景，比直接上复杂 Agent 更稳。
- **善用 Graph**：多步、需要状态流转的业务（如数据分析、审批流）用 Spring AI Alibaba Graph 表达更清晰。

## 模型版本说明

⚠️ 本文涉及的模型名称（如 gpt-4o、DeepSeek、DashScope 系列、Mistral、Ollama 本地模型等）仅作示例，**具体模型版本与可用性请以发布时各厂商官方文档为准**。Spring AI 对各模型的适配也在持续更新，starter 坐标与配置项可能随版本变化。
