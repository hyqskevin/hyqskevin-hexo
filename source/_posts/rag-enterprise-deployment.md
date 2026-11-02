---
title: 国内大厂 RAG 论文精读
date: 2026-10-18 00:00:00
description: 精读蚂蚁 FoRAG、人大&百度 KAPE 与 RioRAG 三篇顶会论文，覆盖企业级 RAG 落地的长答案事实性优化、知识利用机制可解释性、nugget 层次化奖励与评测方案。
categories:
  - RAG
tags:
  - RAG
  - 论文精读
  - FoRAG
  - KAPE
  - RioRAG
  - 企业级落地
---

> 三篇核心论文：蚂蚁 FoRAG（KDD 2024）+ 人大&百度 KAPE（SIGIR 2025）+ 人大&百度 RioRAG（arXiv 2025）。
> 这条主线基本代表了国内大厂在「长答案型 RAG」上的算法思路：从机制理解 → 优化生成 → 评估训练一体化。

## 一、三篇论文的一句话定位

正式展开之前，先把每篇论文的核心放在一起对比，方便后文展开时对照看。

- **FoRAG（蚂蚁，KDD 2024）**：先写大纲再写正文 + 双层细粒度 RLHF，Llama2-7B + FoRAG 在 coherence / helpfulness / factuality 三项上击败 WebGPT-175B，参数只有 1/24。
- **KAPE（人大 + 百度，SIGIR 2025）**：首次系统拆解 RAG 中 LLM 怎么用知识，宏观分 4 阶段（提炼 → 引出 → 表达 → 争辩），微观用 KAPE 定位知识相关神经元，能做到「选择性关掉某类神经元让 LLM 偏向依赖某一种知识源」。
- **RioRAG（人大 + 百度，arXiv 2025）**：针对长答案 RAG 的三大难题（监督数据稀缺、幻觉放大、评估困难），提出 nugget-centric hierarchical reward 强化学习框架。

三篇放一起的意义在于：KAPE 解释机制、FoRAG 给出一种优化范式、RioRAG 给出训练 + 评估一体化方案，正好是落地工程化最关心的三件事。

## 二、FoRAG：蚂蚁 KDD 2024

### 2.1 论文基本信息

| 项 | 内容 |
|---|---|
| **全名** | FoRAG: Factuality-optimized Retrieval Augmented Generation for Web-enhanced Long-form Question Answering |
| **作者** | Tianchi Cai, Zhiwen Tan, Xierui Song, Tao Sun, Jiyan Jiang, Yunqi Xu, Yinger Zhang, Jinjie Gu |
| **单位** | Ant Group（蚂蚁集团） + Tsinghua University（清华大学） |
| **会议** | KDD 2024 · Barcelona · August 25-29, 2024 |
| **DOI** | 10.1145/3637528.3672065 |
| **链接** | <https://arxiv.org/html/2406.13779v1> |
| **代码/模型** | <https://huggingface.co/forag> |
| **方向** | 长答案问答（LFQA）的事实性优化 |

### 2.2 核心问题

在网络增强的长答案问答（web-enhanced LFQA）场景里，开源方法和 Bing Chat、perplexity.ai 等商用系统一直有两个没解决的问题：**生成的长答案缺乏事实性、缺乏清晰的逻辑**。FoRAG 就是冲着这两件事去的。

### 2.3 主要贡献

1. **Outline-first 的长答案生成范式**——先生成组织模式 + 大纲，再写答案，解决长答案「逻辑松散」问题。
2. **Doubly fine-grained RLHF**——在评估和奖励建模两个环节都做「多粒度」设计（句子级 / 段落级 / 事实级）。
3. **构造两个数据集**——基于 outline-enhanced generator 的训练集。
4. **可复现**——Llama2-7B 基线 + FoRAG 方法 + 数据集全部开源。
5. **跨语言验证**——英文 + 中文 benchmark 都验证有效。

### 2.4 技术细节

#### 2.4.1 Outline-enhanced Generator

```text
传统：query → LLM → long answer
FoRAG：query → LLM → outline → LLM → long answer (基于 outline)
```

大纲包含两层内容：**组织模式**（比如「先结论后论证」、「先对比后总结」）+ **章节大纲**。实验证明 outline-first 显著提升 answer coherence。

#### 2.4.2 Doubly Fine-grained RLHF

两步走：

**Step 1：自动事实性评估（多粒度）**

- 文档级：答案整体是否被检索段落支持
- 段落级：每个段落是否对应检索源
- 句子级：每个 claim 是否可追溯到源文档片段

**Step 2：奖励建模（多粒度）**

- 对应上述三层粒度，分别计算奖励
- 训练信号不再是单一 holistic reward，而是分层 reward
- 解决传统 RLHF 在长答案场景下「奖励太稀疏」的问题

### 2.5 实验亮点

- 在 LFQA 两个 benchmark 上击败基线
- 击败 WebGPT-175B（OpenAI 早期联网搜索模型），但只用了 1/24 参数量
- 同时支持英文 + 中文

### 2.6 落地借鉴

- **场景匹配**：如果做的是「长答案型」企业问答（产品说明、合同解读、技术规范查询），直接借鉴 outline-first。
- **场景不匹配**：如果只是「短答案型」（如「今天天气怎么样」），FoRAG 杀鸡用牛刀。
- **训练成本**：RLHF 在企业场景训练成本太高，可以借鉴思路但实际用 SFT / DPO 替代。

### 2.7 相关工作

- **RioRAG**（人大 + 百度，2025）——在 LFQA 基础上加入 RL-based nugget 奖励
- **WebGPT**（OpenAI）——FoRAG 的对比基线之一
- **Bing Chat / perplexity.ai**——工业级 web-enhanced LFQA 系统

## 三、KAPE：人大 + 百度 SIGIR 2025

### 3.1 论文基本信息

| 项 | 内容 |
|---|---|
| **全名** | Unveiling Knowledge Utilization Mechanisms in LLM-based Retrieval-Augmented Generation |
| **作者** | Yuhao Wang, Ruiyang Ren, Yucheng Wang, Wayne Xin Zhao, Jing Liu, Hua Wu, Haifeng Wang |
| **单位** | Renmin University of China（中国人民大学） + Baidu Inc.（百度） |
| **会议** | SIGIR 2025 |
| **链接** | <https://arxiv.org/pdf/2505.11995> |
| **方向** | RAG 内部知识利用的可解释性 + 可控性 |

### 3.2 核心问题

LLM 在参数知识上存在固有局限，RAG 通过外部检索补足这块短板。但**基于 LLM 的 RAG 内部知识利用机制一直没被系统研究过**——也就是「为什么 RAG work」这件事，理论层面是黑的。KAPE 就是要把这块黑盒打开。

### 3.3 主要贡献

1. **首次系统化拆解 RAG 知识利用机制**——填补理论空白
2. **4 阶段知识利用流程**——Knowledge Refining → Eliciting → Expressing → Arguing
3. **KAPE（知识激活概率熵）**——一种定位「知识相关神经元」的方法
4. **可干预性证明**——选择性停用神经元，可让 LLM 偏向依赖某一种知识源（内部 / 外部）
5. **MHA vs MLP 角色分工**——多头注意力管「对齐」，MLP 管「内容」

### 3.4 技术细节

#### 3.4.1 宏观：知识流分析（4 阶段）

```text
外部检索段落 → [Refining 提炼] → [Eliciting 引出] → [Expressing 表达] → [Arguing 争辩] → 最终答案
                        ↓
                  内部参数知识也会在 Eliciting / Expressing 阶段被调用
```

四个阶段的语义：

- **Refining（提炼）**：检索段落进入 LLM 后，被「提纯」成可用的内部表示
- **Eliciting（引出）**：LLM 从内部参数 + 外部检索中「引出」相关事实
- **Expressing（表达）**：把这些事实组织成自然语言表达
- **Arguing（争辩）**：当内 / 外知识冲突时，模型做「争辩」决定采纳哪一方

#### 3.4.2 微观：KAPE（Knowledge Activation Probability Entropy）

```python
# KAPE 计算伪代码
def kape(neuron_i, activations):
    # 统计该神经元在「内部知识触发」vs「外部知识触发」两种场景下的激活概率分布
    p_internal = activations["internal"][neuron_i].mean()
    p_external = activations["external"][neuron_i].mean()
    p = [p_internal, p_external]
    entropy = -sum(pi * math.log(pi) for pi in p if pi > 0)
    return entropy
# 熵低 = 神经元专门负责某一种知识
# 熵高 = 神经元不区分
```

选择性停用「专门负责某一种知识」的神经元，LLM 就会被强迫依赖另一种知识。

### 3.5 实用价值

- **降幻觉**：怀疑模型在编内部知识时，停用「内部知识神经元」强制依赖外部检索
- **强制新知识**：企业内部有「知识截止日期」问题时，停用「旧参数化知识神经元」
- **诊断工具**：用 KAPE 看 LLM 在哪些层在做「知识整合」，定位故障点

### 3.6 落地场景

- **可解释性**：给老板 / 客户讲「我们的 RAG 是怎么工作的」——4 阶段框架
- **可控性**：必须基于最新知识的场景（法规、金融数据），可借鉴 KAPE 思路
- **诊断**：评估现有 RAG 系统时，用 KAPE 思路分析「哪一层在出问题」

### 3.7 相关工作

- **Mechanistic Interpretability**（Anthropic、OpenAI 等）——LLM 内部机制研究方向
- **Knowledge Neurons**（Dai et al., 2022）——KAPE 的前置工作，定位「事实相关神经元」
- **RIO / RioRAG**（人大 + 百度 2025）——同团队后续工作

## 四、RioRAG：人大 + 百度 arXiv 2025

### 4.1 论文基本信息

| 项 | 内容 |
|---|---|
| **全名** | RioRAG: Reinforced Informativeness Optimization for Long-Form Retrieval-Augmented Generation |
| **作者** | Yuhao Wang, Ruiyang Ren, Yucheng Wang, Wayne Xin Zhao, Jing Liu, Hua Wu, Haifeng Wang |
| **单位** | Renmin University of China + Baidu Inc. |
| **会议** | arXiv preprint（2025-05-27，v2 在 2026 更新） |
| **链接** | <https://arxiv.org/html/2505.20825v1> |
| **代码** | <https://github.com/RUCAIBox/RioRAG> |
| **方向** | 长答案 RAG 的强化学习优化 + 评估方法 |

### 4.2 核心问题

长答案 RAG 面临的三大难题：

1. **监督数据稀缺**——传统 SFT 需要「query - long answer（含证据标注）」对，成本极高
2. **幻觉放大**——长答案包含多 sentence，错误会「叠加放大」
3. **评估困难**——传统指标（BLEU / ROUGE / BERTScore）不适合长答案

RioRAG 针对这三个难题逐个击破。

### 4.3 主要贡献

1. **绕过监督数据**——用 RL 直接优化信息量，无需昂贵的人工标注长答案
2. **Nugget-centric Hierarchical Reward**——评估长答案事实性的新方法
3. **在 2 个 benchmark 上验证**——LongFact + RAGChecker
4. **开源**——代码 + 数据公开

### 4.4 技术细节

#### 4.4.1 难题 1：监督数据稀缺

传统 SFT 需要「query - long answer（含证据标注）」对，成本极高。RioRAG 的解法：**RL 直接优化信息量**，无需 SFT 数据。从检索段落直接采样生成，RL 信号来自「是否覆盖了关键事实点」。

#### 4.4.2 难题 2：幻觉放大

长答案包含多 sentence，错误会「叠加放大」。RioRAG 的解法：**hierarchical reward**——不只看答案整体事实性，而是按 nugget 粒度算奖励。

#### 4.4.3 难题 3：评估困难

传统指标（BLEU / ROUGE / BERTScore）不适合长答案。RioRAG 的解法：**Nugget-based 三阶段评估**。

```text
源网页 → 抽取 nugget（事实点） → 构建 checklist → 按答案 vs checklist 算分
```

实际例子：

```yaml
源网页：iphone 16 specs
nuggets:
  - "A18 chip"
  - "8GB RAM"
  - "USB-C"
  - "48MP camera"
answer_checklist:
  - claim: "A18 chip"
    covered: true
  - claim: "8GB RAM"
    covered: true
  - claim: "USB-C"
    covered: false
  - claim: "48MP camera"
    covered: true
reward: 3 / 4 = 0.75
```

### 4.5 落地借鉴

- **评估指标**：如果做企业 RAG 没有评测指标，可以直接抄 **Nugget checklist** 思路——比「LLM-as-judge」更可靠
- **训练方法**：如果 RAG 数据不足，借鉴「RL 直接优化」绕过 SFT
- **实际部署**：nugget extraction 这一步可以用 LLM 自动完成，不需要人工

### 4.6 跟 KAPE 的关系（同团队）

- **KAPE**（SIGIR 2025）——回答「RAG 黑盒里发生了什么」
- **RioRAG**（arXiv 2025）——基于 KAPE 的理解，给出「怎么优化 RAG」的方法
- 两篇一起读效果最好

## 五、横向对比与选型建议

### 5.1 横向对比表

| 维度 | FoRAG | KAPE | RioRAG |
|---|---|---|---|
| 团队 | 蚂蚁 + 清华 | 人大 + 百度 | 人大 + 百度 |
| 会议 | KDD 2024 | SIGIR 2025 | arXiv 2025 |
| 核心问题 | 长答案事实性 | RAG 黑盒机制 | 长答案训练 + 评估 |
| 方法 | outline + RLHF | 知识流分析 + KAPE | nugget reward + RL |
| 可解释性 | 中 | **极强** | 中 |
| 落地可借鉴度 | **高**（思路清晰） | 中（理论偏多） | **高**（评测指标可直接抄） |
| 代码开源 | ✅ HuggingFace | ❌ | ✅ GitHub |

### 5.2 推荐阅读顺序

1. **先 KAPE**——搞清楚「RAG 内部发生了什么」
2. **再 FoRAG**——看蚂蚁怎么落地「长答案事实性」
3. **最后 RioRAG**——看评估 + 训练方法的完整方案

### 5.3 一句话总结

> 国内大厂 RAG 论文主线：**先理解机制（KAPE）→ 再优化生成（FoRAG）→ 最后评估 + 训练一体化（RioRAG）**。
> 共同特点：长答案场景（LFQA），这是企业知识库的典型形态。

## 六、模型版本说明

> ⚠️ **以发布时为准**

本文涉及的模型与方法名称保留论文原貌，方便读者对照原论文检索：

- **Llama2-7B-chat**（Meta）——FoRAG 的基座模型
- **WebGPT-175B**（OpenAI）——FoRAG 的对比基线
- **LongFact** / **RAGChecker**——RioRAG 使用的两个 LFQA benchmark
- **Knowledge Neurons**（Dai et al., 2022）——KAPE 的前置工作

后续如有新版本（Llama3 / Qwen3 / GPT 系等）或同思路新论文，建议回溯到原始仓库（<https://huggingface.co/forag>、<https://github.com/RUCAIBox/RioRAG>）确认最新性能数据。