---
title: RSI 自进化智能体
date: 2026-09-17 00:00:00
description: 速读 2026 Q3 五篇 RSI 主线论文：RSIAgent 用无训练记忆让开源模型反超 GPT-6，Experience Funnel 与 Dream-RSI 给出自进化闭环方法论，Parsing the Stream 与 NovaFabric 补全观测与审计工具链。含横向对比与落地选型。
categories:
  - notes
tags:
  - RSI
  - 自进化智能体
  - 论文速读
  - 多智能体
  - 观测性
---

## 一、为什么 RSI 突然成了 Q3 主线

递归自改进（Recursive Self-Improvement, RSI）并不是新概念，但 2026 Q3 它从一个思想实验变成了可落地的工程范式。这五篇论文指向同一个信号：**开源模型正在用"记忆 + 闭环"而非"堆权重"追上甚至反超闭源前沿**。

值得注意的几个共同点：

- **无训练（training-free）成为高频关键词**。多篇文章明确不更新模型参数，靠 agent memory、state-policy 固化来积累能力。对工程团队来说，这意味着 ROI 最高的一条 RSI 路径——不重训、不微调，只改写记忆与策略。
- **自进化从论文走向闭环**。单轮 prompt 优化退场，取而代之的是"探索 → 校验 → 固化 → 再探索"的交替循环。
- **观测性与审计并行成熟**。一旦 Agent 开始自我改写，可监控、可重放、可审计就从 nice-to-have 变成合规刚需（尤其 EU AI Act）。

下面五篇论文可归为两条线：**方法论三篇**（怎么自我改进）与 **可观测性 & 审计两篇**（怎么监控与回溯）。

> 说明：本文源稿为 Obsidian 笔记，已脱敏并去掉英文摘要，保留 arxiv 编号作为公开学术资源。

## 二、RSI 方法论三篇

### 2.1 RSIAgent：开源模型靠 memory 反超 GPT-6

[arxiv 2609.15364](https://arxiv.org/abs/2609.15364)

RSIAgent 提出一种**无训练多智能体框架**：通过在新环境中自主构建记忆来实现递归自改进，专门应对接口、工具与失败模式未被预训练充分覆盖的适应难题。

其做法是协调 **curriculum、actor、verifier** 三类智能体持续探索与校验，保留动作-条件-后果之间的可复用因果；并采用"**先广度后深度**"策略——先并行广度探索发现多样结构，再聚焦深度探索挖掘隐藏约束与未知因果。最终记忆被冻结，可直接复用而无需更新模型参数。

结果很硬：在 OSWorld-v2 与 Agent's Last Exam 上，使 Kimi-K3 与 GLM-5.3 超越包括 GPT-6 在内的前沿闭源模型。

> 关键词：**无训练**。这是工程团队 ROI 最高的一条 RSI 路径——不更新权重，只靠 memory。

- 落地场景：电商知识图谱（KG）冷启动。新平台接口变更频繁，用 RSIAgent 的广度-深度探索自动沉淀"操作-条件-后果"记忆，免去每次重训。

### 2.2 Experience Funnel：State-Policy 交替闭环

[arxiv 2609.08919](https://arxiv.org/abs/2609.08919)

Experience Funnel 把"快状态适应"与"慢策略固化"耦合成**交替闭环**，解决的核心难题是：如何把任务专属交互经验转化为可复用模型能力，又不丧失对新证据的快速适配。

流程为：交互轨迹先被蒸馏为显式文本状态（textual state，含 skills 与 agent harnesses）；再通过 transition-aware 蒸馏选择性识别跨修订仍稳定的行为，固化进策略（policy）参数。更新后的 state–policy 对继续产出新样本，启动下一轮循环。

它在多 Agent 基准上一致优于纯状态进化与策略内化（policy internalization）。本质是解耦"快调 vs 慢学"：外部知识本体负责即时可读可编辑，参数化策略负责紧凑复用。

- 落地场景：自进化 AI Tutor 的双轨记忆——外部知识本体（state）+ 模型内化（policy）协同架构。

### 2.3 Dream-RSI：用演化世界模拟器做递归自改进

[arxiv 2609.14858](https://arxiv.org/abs/2609.14858)

Dream-RSI 提出可扩展、递归自改进的探索框架，解决自主 Agent 在复杂域发现高价值解时的探索策略瓶颈。

核心洞察是：累积的发现历史可作为已实现搜索空间上的 **replay simulator**。轻量编排层把"探索"显式化、可编程化（不改底层编码 Agent），在由历史发现树构建的 simulator 中执行"**做梦**（dreaming）"，获得即时、低成本的 off-policy 反馈来评估与改进探索策略；改进后的策略再部署回线上驱动新一轮发现，扩张 simulator pool。

它在算法工程、数学优化、GPU kernel 工程三类场景上达到具有竞争力甚至更优的发现质量，并显著降低成本。这是一种 Meta-RSI 范式——用"演化世界"替代昂贵的线上 rollout。

- 落地场景：GPU kernel 自动调优 / 数学求解器。线上试错成本高，离线 dreaming 评估策略后再上线，把搜索成本压到最低。

## 三、可观测性 & 审计两篇

### 3.1 Parsing the Stream：长程 Agent 的 Live Trace 模型

[arxiv 2609.01466](https://arxiv.org/abs/2609.01466)

长程 Agent 的 trace 会同时超出两类消费者的承载能力：监控运行的人类观测者，以及自身上下文受限的 Agent 本身。本文提出 **live trace 模型**：将追加式事件日志（append-only event ledger）增量折叠为带类型的运行态（typed run state），按消费者编译为不同视图，并在人与 Agent 两端以确定性 ground-truth 评测。

观测者侧以 LLM 充当 reader，编译视图回答监控问题的 token 约为原始 trace 预算版本的 1/14、成本降低 5–7 倍，准确率由 0.48 升至 0.85–0.87。Agent 侧在 120 步顺序依赖任务中，每步维护运行统计的折叠机制达到 30/30，全上下文提示仅 8/30。

其折叠相对廉价替代的剩余价值是：**确定性可审计性**与"同一状态服务观测者与 Agent"。

- 落地场景：可作为 Langfuse / LangSmith 之外的轻量替代架构，尤其适合长程 OSWorld 任务运行监控。

### 3.2 NovaFabric：防篡改可重放审计证据

[arxiv 2609.12582](https://arxiv.org/abs/2609.12582)

NovaFabric 产出**审计级（audit-grade）执行证据**：与供应商无关、防篡改（tamper-evident）、可重放、可分享，对接 EU AI Act、ISO 42001、NIST AI RMF 的"独立可校验记录"要求。

做法是不改 Agent 逻辑，把运行封装为便携式 **Run Capsule（15 实体 schema）**，以 DSSE 签名、RFC 3161 时间戳、Merkle log 与脱敏证明封存，可在四模式重放协议下重新执行，并导出 Evidence Bundle。贡献在于工程集成（OpenTelemetry、DSSE/in-toto、W3C PROV）而非新密码学；mocked 重放 10/10 模型响应完整还原，工具型负载仅 2/10 完成。

- 落地场景：金融、医疗合规。四模式重放协议可直接借鉴为合规证据模板。

## 四、横向对比表 + 落地选型

| 论文 | 标签 | 一句话核心 |
|---|---|---|
| [RSIAgent](https://arxiv.org/abs/2609.15364) | RSI / sota-2026 | 无训练多智能体框架 + 广度-深度探索策略，让 Kimi-K3/GLM-5.3 在 OSWorld-v2 / Agent's Last Exam 上反超 GPT-6 |
| [Parsing the Stream](https://arxiv.org/abs/2609.01466) | observability / trace | Append-only event ledger 增量折叠为 typed run state，再按消费者（人/agent）编译成不同视图；评测问答 14× token 节省、5-7× 成本降低 |
| [Experience Funnel](https://arxiv.org/abs/2609.08919) | self-evolution | 把交互轨迹先蒸馏成显式 textual state（快适应），再选择性把稳定行为固化进 policy 参数（慢巩固），交替循环——解耦"快调 vs 慢学" |
| [NovaFabric](https://arxiv.org/abs/2609.12582) | observability / audit | 把 Agent 运行封装为 15 实体 Run Capsule + DSSE 签名 + RFC 3161 时间戳 + Merkle log，四模式重放协议对接 EU AI Act / ISO 42001 |
| [Dream-RSI](https://arxiv.org/abs/2609.14858) | RSI / self-evolution | 把历史发现树构造成 replay simulator，离线 dreaming 优化探索策略（低成本 off-policy），再上线扩展 simulator pool |

**落地选型建议**：

- **电商 KG / 新平台冷启动**：优先 RSIAgent 的广度-深度探索，靠 memory 自适应接口变更，零重训成本。
- **金融合规 / 医疗审计**：NovaFabric 的 Run Capsule + 四模式重放直接对接 EU AI Act，是合规证据模板。
- **OSWorld 长程任务 / 自进化 Tutor**：Experience Funnel 的 State-Policy 闭环 + Parsing the Stream 的 live trace 监控组合，兼顾自我改进与可观测。
- **GPU kernel / 数学求解等昂贵探索域**：Dream-RSI 的 replay simulator dreaming，把线上成本压到最低。

## 五、一句话总结 + 模型版本说明

**2026 Q3 = RSI 主线 + observability 工具化**。Experience Funnel 是方法论基石（State-Policy 交替闭环）；RSIAgent 把 RSI 落到开源模型上（不更新权重，靠 memory）；Dream-RSI 用"演化世界模拟器"做 RSI；Parsing the Stream 与 NovaFabric 是配套的观测/审计工具，让自进化 Agent 可被监控与回溯。

### 模型版本说明 ⚠️ 以发布时为准

文中出现的模型与版本名（Kimi-K3、GLM-5.3、GPT-6 / GPT-6 Astra）均直接引用源论文表述，**具体能力、命名与发布状态以各厂商正式发布时为准**。AI 领域版本迭代极快，写作时（2026-09-17）的"前沿闭源"与"开源反超"结论可能已随后续发布而改变，请在引用前复核最新基准。
