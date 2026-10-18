---
title: RAG 企业级知识库落地
date: 2026-09-08 00:00:00
description: 梳理蚂蚁 FoRAG、人大&百度 KAPE 与 RioRAG 三篇国内大厂 RAG 论文的核心方法与企业级落地借鉴，覆盖长答案事实性、知识利用机制与评估训练一体化，为知识库选型提供参考。
categories: [notes]
tags: [RAG, 知识库, 大厂论文, 长答案问答, 企业落地, 事实性]
series:
  name: "RAG 企业级知识库落地"
  index: 1
  total: 2
---

# RAG 企业级知识库落地

> 这是「RAG 企业级知识库落地」系列的第 1/2 期。本期聚焦**三篇核心国内大厂论文**：蚂蚁 FoRAG（KDD 2024）、人大&百度 KAPE（SIGIR 2025）、人大&百度 RioRAG（arXiv 2025），重点讲清它们各自解决什么问题、企业落地能借鉴什么。元数据来自 arXiv API 与论文原文。

## 一、为什么是企业级知识库的典型场景

企业知识库问答大多是**长答案型（LFQA）**：产品说明、合同解读、技术规范查询，都需要模型产出连贯、多段落、带证据的答案。三篇论文正好覆盖了这条主线：**先理解机制（KAPE）→ 再优化生成（FoRAG）→ 最后评估与训练一体化（RioRAG）**。

### 1.1 三篇论文一句话定位

- **FoRAG（蚂蚁+清华）**：解决长答案"事实性弱、逻辑散"——用 outline-first 生成 + 双层细粒度 RLHF。
- **KAPE（人大+百度）**：拆开 RAG 黑盒，解释"LLM 到底怎么用内部/外部知识"，并做到可控。
- **RioRAG（人大+百度）**：解决长答案"训练数据稀缺、幻觉放大、评估困难"——用 nugget 层次化奖励 + RL。

## 二、论文 1 · FoRAG · 蚂蚁集团 · KDD 2024

**全称**：FoRAG: Factuality-optimized Retrieval Augmented Generation for Web-enhanced Long-form Question Answering
**作者/单位**：Tianchi Cai 等，Ant Group + Tsinghua University
**会议**：KDD 2024（Barcelona）
**链接**：https://arxiv.org/html/2406.13779v1 ｜ **代码**：https://huggingface.co/forag

### 2.1 一句话核心

**先写大纲再写正文 + doubly fine-grained RLHF 优化事实性**——Llama2-7B-chat + FoRAG 在 coherence / helpfulness / factuality 三项上击败 WebGPT-175B，参数量仅为其 1/24。

### 2.2 两个未解决的核心问题

在网络增强的长答案问答中，开源方法与商用系统（Bing Chat、perplexity.ai）普遍存在：

1. 生成的长答案**缺乏事实性**；
2. 生成的长答案**缺乏清晰逻辑**。

FoRAG 的解法分两步：先提出 outline-enhanced generator（先勾勒组织模式与大纲，再生成多面向答案），再提出双层细粒度 RLHF 框架做事实性优化。

### 2.3 技术方法

Outline-first 范式把"一次直出"改成"先规划后生成"：

```text
传统：query → LLM → long answer
FoRAG：query → LLM → outline → LLM → long answer (基于 outline)
```

大纲包含**组织模式**（如"先结论后论证"、"先对比后总结"）+ **章节大纲**，实验证明显著提升 answer coherence。

Doubly fine-grained RLHF 在两个环节都做"多粒度"：

- **自动事实性评估**：文档级（答案是否被检索段落支持）→ 段落级（每段是否对应检索源）→ 句子级（每个 claim 是否可追溯到源片段）。
- **奖励建模**：对应三层粒度分别计算奖励，训练信号从单一 holistic reward 变为分层 reward，解决长答案场景"奖励太稀疏"问题。

### 2.4 对你有什么用

- **场景匹配**：做"长答案型"企业问答，直接借鉴 outline-first。
- **场景不匹配**：短答案型（如"今天天气怎样"）用 FoRAG 属杀鸡用牛刀。
- **落地借鉴**：RLHF 在企业训练成本太高，可借鉴思路、实际用 SFT / DPO 替代。

## 三、论文 2 · KAPE · 人大+百度 · SIGIR 2025

**全称**：Unveiling Knowledge Utilization Mechanisms in LLM-based Retrieval-Augmented Generation
**作者/单位**：Yuhao Wang 等，Renmin University of China + Baidu Inc.
**会议**：SIGIR 2025 ｜ **链接**：https://arxiv.org/pdf/2505.11995

### 3.1 一句话核心

**首次系统拆解 RAG 中 LLM 如何使用知识**——宏观分 4 阶段（提炼→引出→表达→争辩），微观提出 KAPE 定位知识相关神经元，并能"选择性关掉某类神经元"让 LLM 偏向依赖某一知识源。

### 3.2 宏观：知识流分析（4 阶段）

```text
外部检索段落 → [Refining 提炼] → [Eliciting 引出] → [Expressing 表达] → [Arguing 争辩] → 最终答案
                        ↓
                  内部参数知识也会在 Eliciting/Expressing 阶段被调用
```

- **Refining**：检索段落进入 LLM 后被"提纯"成可用内部表示。
- **Eliciting**：从内部参数 + 外部检索中"引出"相关事实。
- **Expressing**：把事实组织成自然语言表达。
- **Arguing**：内/外知识冲突时，模型做"争辩"决定采纳哪一方。

段落的相关性会引导知识在这些阶段中流动。

### 3.3 微观：KAPE（知识激活概率熵）

```text
KAPE(neuron_i) = -Σ p(activation | knowledge_type) * log p(activation | knowledge_type)
```

对每个神经元，统计它在"内部知识触发"vs"外部知识触发"下的激活概率分布，计算熵：

- 熵低 = 神经元专门负责某一种知识；
- 熵高 = 神经元不区分。

选择性停用"专门负责某一种知识"的神经元，LLM 会被迫依赖另一种知识。

### 3.4 实用价值与可借鉴点

- **降幻觉**：怀疑模型在编内部知识，可停用"内部知识神经元"强制依赖外部检索。
- **强制新知识**：企业"知识截止日期"问题，可停用"旧参数化知识神经元"。
- **诊断工具**：用 KAPE 思路看你的 LLM 在哪些层做"知识整合"。
- **可解释性**：给老板/客户讲"RAG 怎么工作"，直接套 4 阶段框架。

## 四、论文 3 · RioRAG · 人大+百度 · arXiv 2025

**全称**：RioRAG: Reinforced Informativeness Optimization for Long-Form Retrieval-Augmented Generation
**作者/单位**：Yuhao Wang 等，Renmin University of China + Baidu Inc.
**链接**：https://arxiv.org/html/2505.20825v1 ｜ **代码**：https://github.com/RUCAIBox/RioRAG

### 4.1 一句话核心

针对长答案 RAG 三大难题（监督数据稀缺、幻觉放大、评估困难），提出 **nugget-centric hierarchical reward** 强化学习框架——从源网页提取 nugget → 构建 claim checklist → 按事实对齐算奖励。

### 4.2 三大难题与解法

- **监督数据稀缺**：传统 SFT 需"query - 长答案（含证据标注）"对，成本极高。RioRAG 用 RL 直接优化信息量，从检索段落采样生成，RL 信号来自"是否覆盖关键事实点"。
- **幻觉放大**：长答案多 sentence，错误会叠加。用 hierarchical reward，按 nugget 粒度算奖励。
- **评估困难**：BLEU / ROUGE / BERTScore 不适合长答案。用 Nugget-based 三阶段评估。

```text
源网页 → 抽取 nugget（事实点） → 构建 checklist → 按答案 vs checklist 算分
```

示例：

```text
源网页：iphone 16 specs
nuggets: ["A18 chip", "8GB RAM", "USB-C", "48MP camera"]
answer checklist: ["✓ A18 chip", "✓ 8GB RAM", "✗ USB-C", "✓ 48MP camera"]
reward = 3/4 = 0.75
```

### 4.3 对你有什么用

- **评估指标**：企业 RAG 没有评测指标，可直接抄 **Nugget checklist** 思路——比"LLM-as-judge"更可靠。
- **训练方法**：RAG 数据不足，借鉴"RL 直接优化"绕过 SFT。
- **实际部署**：nugget extraction 这一步可用 LLM 自动完成，无需人工。

### 4.4 跟 KAPE 的关系（同团队）

- **KAPE**：回答"RAG 黑盒里发生了什么"。
- **RioRAG**：基于 KAPE 的理解，给出"怎么优化 RAG"的方法。
- 两篇一起读效果最好。

## 五、三篇论文横向对比

| 维度 | FoRAG | KAPE | RioRAG |
|---|---|---|---|
| 团队 | 蚂蚁+清华 | 人大+百度 | 人大+百度 |
| 会议 | KDD 2024 | SIGIR 2025 | arXiv 2025 |
| 核心问题 | 长答案事实性 | RAG 黑盒机制 | 长答案训练+评估 |
| 方法 | outline + RLHF | 知识流分析 + KAPE | nugget reward + RL |
| 可解释性 | 中 | **极强** | 中 |
| 落地可借鉴度 | **高**（思路清晰） | 中（理论偏多） | **高**（评测指标可直接抄） |
| 代码开源 | ✅ HuggingFace | ❌ | ✅ GitHub |

### 5.1 推荐阅读顺序

1. **先 KAPE** —— 搞清楚"RAG 内部发生了什么"。
2. **再 FoRAG** —— 看蚂蚁怎么落地"长答案事实性"。
3. **最后 RioRAG** —— 看评估 + 训练方法的完整方案。

> 国内大厂 RAG 论文主线：**先理解机制（KAPE）→ 再优化生成（FoRAG）→ 最后评估+训练一体化（RioRAG）**。共同特点：长答案场景（LFQA），这正是企业知识库的典型形态。

## 模型版本说明

⚠️ 文中涉及的模型名称（如 Llama2-7B-chat、WebGPT-175B）均以论文发布时为准，实际选型请以你部署时的最新模型版本为准。
