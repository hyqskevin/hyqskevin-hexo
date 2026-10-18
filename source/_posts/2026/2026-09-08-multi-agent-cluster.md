---
title: 多智能体集群编排框架调研
date: 2026-09-08 00:00:00
description: 调研主流多智能体（Agent）集群编排框架，梳理固定角色、动态分发、层级编排三种模式，对比 swarms、agency-swarm、OpenAI/swarm 等九款框架的能力、适用场景与选型建议。
categories:
  - notes
tags:
  - 多智能体
  - Agent
  - 编排框架
  - 集群
  - 技术选型
---

大模型集群正从单一推理走向多智能体协同：研究员负责分析、执行者负责落地、审核员负责质量把控。本文调研当前主流的多 Agent 集群编排框架，涵盖固定角色协作、动态任务分发、层级编排三种模式。

## 一、背景

大模型集群从单一推理向多智能体协同演进。如今的 AI 系统不再依赖单个模型完成全部任务，而是通过多个专业 Agent 分工协作——研究员负责分析，执行者负责落地，审核员负责质量把控。

本报告调研当前主流的多智能体（Agent）集群编排框架，涵盖固定角色协作、动态任务分发、层级编排三种模式。

## 二、核心概念

### 2.1 三种编排模式

| 模式 | 描述 | 适用场景 |
|------|------|---------|
| **固定角色（Fixed Role）** | Agent 有固定角色（研究员/执行者/审核员），顺序协作 | 流程固定的流水线任务 |
| **动态分发（Dynamic）** | 根据任务需求和 Agent 当前负载动态分配 | 资源调度、突发任务 |
| **层级编排（Hierarchical）** | 上级 Agent 规划任务，分发给下级 Agent 执行 | 复杂任务拆解、多阶段协作 |

### 2.2 集群架构要素

```text
                    ┌─────────────────────────────────────┐
                    │          Meta Orchestrator           │
                    │  (层级分发 + 动态路由 + 状态机)       │
                    └──────────────────┬──────────────────┘
                                       │
    ┌──────────────────────────────────┼──────────────────────────────────┐
    │                                  │                                  │
    │  ┌──────────────▼──────────────┐ │  ┌──────────────▼──────────────┐  │
    │  │     Fixed Role Pool        │ │  │    Dynamic Pool             │  │
    │  └───────────────────────────┘ │  └───────────────────────────┘  │
    │                                  │                                  │
    └──────────────────────────────────┼──────────────────────────────────┘
                                       │
              ┌─────────────────────────┼─────────────────────────┐
              │                         │                         │
    ┌─────────▼─────────┐    ┌─────────▼─────────┐    ┌─────────▼─────────┐
    │    Shared Memory   │    │   Message Bus     │    │   Tool Registry  │
    │  (向量DB + 状态)    │    │  (Agent间通信)    │    │  (共享工具池)     │
    └───────────────────┘    └───────────────────┘    └───────────────────┘
```

## 三、主流框架调研

### 3.1 swarms

**GitHub**: [kyegomez/swarms](https://github.com/kyegomez/swarms)
**Stars**: 活跃
**语言**: Python
**定位**: 企业级生产就绪的多 Agent 编排框架

**特点**：
- 支持固定角色、动态分发、层级编排三种模式
- 多模型支持（OpenAI、Anthropic、开源模型）
- 内置任务队列和状态管理
- 支持分布式部署
- 丰富的 Agent 间通信机制

**适用场景**：企业级生产环境，需要高并发多 Agent 协作

### 3.2 agency-swarm

**GitHub**: [VRSEN/agency-swarm](https://github.com/VRSEN/agency-swarm)
**Stars**: 活跃
**语言**: Python
**定位**: 可靠的多 Agent 编排框架

**特点**：
- 强调 Agent 间的可靠通信
- 结构化 Agent 角色定义
- 内置工具共享机制
- 支持多模型后端

**适用场景**：需要高可靠性的多 Agent 协作系统

### 3.3 microsoft/agent-framework

**GitHub**: [microsoft/agent-framework](https://github.com/microsoft/agent-framework)
**Stars**: 新兴
**语言**: Python + .NET
**定位**: 微软出品的企业级 Agent 框架

**特点**：
- 微软官方支持
- 支持 Python 和 .NET 双后端
- 企业级安全和管理
- 与 Azure 服务深度集成

**适用场景**：微软技术栈的企业用户

### 3.4 OpenAI/swarm

**GitHub**: [openai/swarm](https://github.com/openai/swarm)
**语言**: Python
**定位**: 教育用途的轻量多 Agent 编排框架

**特点**：
- 极其轻量，学习曲线低
- 适合原型验证
- OpenAI 官方出品（教育导向，非生产级）

**适用场景**：快速原型、教育学习

### 3.5 Shannon

**GitHub**: [Kocoro-lab/Shannon](https://github.com/Kocoro-lab/Shannon)
**语言**: Python
**定位**: 生产导向的多 Agent 编排框架

**特点**：
- 专注生产环境稳定性
- 模块化设计
- 支持多种部署模式

**适用场景**：需要稳定生产环境的中型项目

### 3.6 hermes-agent-cluster

**GitHub**: [HughesCuit/hermes-agent-cluster](https://github.com/HughesCuit/hermes-agent-cluster)
**语言**: Python
**定位**: 分布式集群扩展，专为多节点设计

**特点**：
- 分布式多节点任务协调
- 能力感知调度（capability-aware scheduling）
- 容错恢复机制
- OpenTelemetry + Prometheus 监控

**适用场景**：需要真正分布式集群的企业用户

### 3.7 caxton

**GitHub**: [jwilger/caxton](https://github.com/jwilger/caxton)
**语言**: Python + WebAssembly
**定位**: 高级分布式 Agent 协调

**特点**：
- FIPA 标准兼容（传统多 Agent 系统标准）
- 多节点集群支持
- Agent 编译为 WebAssembly（高性能）
- 跨语言 Agent 协作

**适用场景**：需要与传统多 Agent 系统兼容的高端场景

### 3.8 mentis

**GitHub**: [foreveryh/mentis](https://github.com/foreveryh/mentis)
**语言**: Python
**定位**: 基于 LangGraph 的多 Agent 编排

**特点**：
- 基于 LangGraph（强大的状态机工作流库）
- 图结构的任务编排
- 灵活的状态管理

**适用场景**：需要复杂状态机工作流的场景

### 3.9 swarms-rs

**GitHub**: [The-Swarm-Corporation/swarms-rs](https://github.com/The-Swarm-Corporation/swarms-rs)
**语言**: Rust
**定位**: 高性能 Rust 版 swarms

**特点**：
- Rust 实现，性能极高
- 内存安全
- 适合对性能敏感的生产环境

**适用场景**：高性能生产环境，Rust 技术栈团队

## 四、框架对比

| 框架 | 语言 | 分布式 | 层级编排 | 动态调度 | 生产级 | 上手难度 |
|------|------|--------|---------|---------|--------|---------|
| swarms | Python | ✅ | ✅ | ✅ | ✅ | 中 |
| agency-swarm | Python | ❌ | ✅ | ❌ | ✅ | 低 |
| microsoft/agent-framework | Python/.NET | ✅ | ✅ | ✅ | ✅ | 中 |
| OpenAI/swarm | Python | ❌ | ❌ | ❌ | ❌ | 低 |
| Shannon | Python | ✅ | ✅ | ✅ | ✅ | 中 |
| hermes-agent-cluster | Python | ✅ | ✅ | ✅ | ✅ | 中 |
| caxton | Python/WASM | ✅ | ✅ | ✅ | ✅ | 高 |
| mentis | Python | ❌ | ✅ | ✅ | ❌ | 中 |
| swarms-rs | Rust | ✅ | ✅ | ✅ | ✅ | 高 |

## 五、关键技术组件

### 5.1 Agent 注册与发现

```python
class AgentRegistry:
    """中心化 Agent 注册表，支持动态路由"""
    def register(self, agent_id: str, capability: AgentCapability):
        ...

    def find_best_agent(self, specialty: str) -> AgentCapability:
        """负载最低优先 + 能力匹配"""
        ...
```

### 5.2 共享内存（向量数据库）

| 组件 | 用途 |
|------|------|
| **Chroma** | 轻量向量数据库，存储 Agent 历史结果 |
| **Qdrant** | 生产级向量数据库，高并发支持 |
| **Redis** | 状态共享、缓存、Pub/Sub 消息 |

### 5.3 消息总线

```python
class MessageBus:
    """Agent 间通信总线"""
    async def publish(self, channel: str, message: dict): ...
    async def subscribe(self, channel: str): ...
    async def send_to_agent(self, agent_id: str, message: dict): ...
```

### 5.4 任务队列

- **Redis + Celery**：通用任务队列
- **RabbitMQ**：高可靠消息队列
- **Kafka**：大数据量、高吞吐场景

## 六、选型建议

### 场景一：快速验证 / 原型
→ **OpenAI/swarm**（最轻量）或 **agency-swarm**

### 场景二：企业级生产
→ **swarms**（功能最全，社区活跃）或 **microsoft/agent-framework**（微软技术栈）

### 场景三：分布式多节点集群
→ **hermes-agent-cluster** 或 **caxton**

### 场景四：高性能 Rust 技术栈
→ **swarms-rs**

### 场景五：复杂状态机工作流
→ **mentis**（基于 LangGraph）

## 七、集群规模与成本估算

### 硬件配置参考

| 配置 | 规格 | 适用规模 |
|------|------|---------|
| 单机多卡 | 4× H100 80GB | 10 个以内 Agent |
| 小型集群 | 8× H100（2节点） | 20-50 个 Agent |
| 中型集群 | 32× H100（8节点） | 100+ 个 Agent |
| 大型集群 | 100+ H100 | 企业级大规模部署 |

### 成本参考

| 规模 | 估算成本 |
|------|---------|
| 单机 4× H100 | ~$8-12/小时 |
| 8节点集群 | ~$80-120/小时 |
| 100节点集群 | ~$1000-3000/小时 |

## 八、注意事项

### 8.1 缓存成本陷阱

> "除了 Deepseek 和小米，现在很多 AI 实验室都会骗你缓存读取。如果你为缓存读取花了不少钱，实际上是在为几秒钟的显存时间付出高昂的代价。"

- 监控 `cache_read_input_tokens` vs `cache_creation_input_tokens` 比例
- 缓存命中≠省钱，需看实际账单
- KV Cache 占用大，batch size 需合理控制

### 8.2 模型选择

| 模型 | 特点 | 适用场景 |
|------|------|---------|
| **DeepSeek V4 Flash** | 性价比极高，接近 Opus | 通用任务 |
| **MiMo-16B** | 价格低，响应快 | 简单任务、分类 |
| **Claude Opus** | 能力最强 | 复杂推理、规划 |

### 8.3 多模型协同

不同模型扮演不同角色：
- **DeepSeek**：执行者（代码、搜索）
- **MiMo**：快速响应、简单任务
- **Claude**：规划、审核、复杂推理

## 九、总结

多 Agent 集群编排已相对成熟，存在多种生产级框架：

1. **swarms** 最全面，适合大多数生产场景
2. **hermes-agent-cluster** 专攻分布式多节点
3. **caxton** 提供 FIPA 兼容和 WebAssembly 编译
4. **swarms-rs** 面向 Rust 高性能场景

建议根据团队技术栈和具体场景选择合适的框架，从原型开始逐步扩展到生产级集群。

## 十、参考链接

- [swarms - GitHub](https://github.com/kyegomez/swarms)
- [agency-swarm - GitHub](https://github.com/VRSEN/agency-swarm)
- [microsoft/agent-framework - GitHub](https://github.com/microsoft/agent-framework)
- [OpenAI/swarm - GitHub](https://github.com/openai/swarm)
- [Shannon - GitHub](https://github.com/Kocoro-lab/Shannon)
- [hermes-agent-cluster - GitHub](https://github.com/HughesCuit/hermes-agent-cluster)
- [caxton - GitHub](https://github.com/jwilger/caxton)
- [mentis - GitHub](https://github.com/foreveryh/mentis)
- [swarms-rs - GitHub](https://github.com/The-Swarm-Corporation/swarms-rs)

## 模型版本说明

> ⚠️ 本文提及的模型（如 DeepSeek V4 Flash、MiMo-16B、Claude Opus 等）版本与能力**以发布时为准**，请在实际选型前核对各模型官方最新信息。
