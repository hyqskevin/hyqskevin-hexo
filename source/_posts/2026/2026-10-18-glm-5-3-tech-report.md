---
title: GLM-5.3 论文全景解读
date: 2026-10-18 00:00:00
description: 本文以 13 篇一手论文为骨架，逐篇拆解 GLM-5.3 的技术全貌：同基座纯后训练（scaling post-training）的核心论断、IndexShare 稀疏注意力、SAO 异步 RL、CompactionRL 上下文压缩、CyberGym 网络安全 SOTA，以及贯穿 GLM 系列的架构与训练演化。
categories: [notes]
tags: [GLM-5.3, 大语言模型, 后训练, 论文解读, 强化学习, 网络安全]
---

# GLM-5.3 论文全景解读

> 「同基座、纯后训练」是 GLM-5.3 的核心论断。本文不再重复技术报告要点篇的结论，而是按 13 篇一手论文重新组织，把每一篇论文的技术细节、与 GLM-5.3 的关联、落地价值一次性讲清。
> 论文分布：A.历史（5）/ B.架构（3）/ C.后训练（2）/ D.网络安全（1）/ E.GLM-5.3 官方一手（2）。

## 引言：GLM-5.3 的「无主论文」现象

GLM 系列通常以一篇主技术报告交付（如 GLM-130B arXiv 2210.02414、GLM arXiv 2103.10360、ChatGLM arXiv 2406.12793、GLM-4.5 arXiv 2508.06471、GLM-5 arXiv 2602.15763），但 **GLM-5.3 没有独立 arXiv 论文**。它的技术细节分散在 7 份资料里：

- [GLM-5（arXiv 2602.15763）](https://arxiv.org/abs/2602.15763)——同基座基础
- [IndexCache（arXiv 2603.12201）](https://arxiv.org/abs/2603.12201)——IndexShare 稀疏注意力
- [SAO（arXiv 2607.07508）](https://arxiv.org/abs/2607.07508)——异步 RL 算法
- [CompactionRL（arXiv 2607.05378）](https://arxiv.org/abs/2607.05378)——上下文压缩 RL
- [CyberGym（arXiv 2506.02548）](https://arxiv.org/abs/2506.02548)——网络安全基准
- [Z.ai 官方博客](https://z.ai/blog/glm-5.3)——一手技术公告
- [slime 框架](https://github.com/THUDM/slime)——RL 后训练基础设施

理解这 7 份资料，就理解了 GLM-5.3。

## 一、官方一手公告：scaling post-training

### 1.1 论文：GLM-5.3: Frontier Coding with Emergent Cyber Capabilities

| 字段 | 值 |
|---|---|
| 来源 | [Z.ai 官方博客](https://z.ai/blog/glm-5.3)（非 arXiv） |
| 年份 | 2026 |
| 作者 | Z.ai / THUDM Team |

**核心论断**：GLM-5.3 与 GLM-5.2 使用同一基座，不重新预训练，所有增益均来自后训练。

**怎么做**：
- GLM-5.2 已经构建起完整技术栈：IndexShare 高效处理长上下文、SAO 支持长程任务 RL、slime 支持大规模异步训练；
- 过去一个月，团队持续在**更多环境、更多样化任务、更多算力**上扩展这套技术栈——这就是 GLM-5.3 的全部改动。

**结果（关键数据点）**：
- **Z.ai Code Bench**：较 GLM-5.2 **+50%**
- **Terminal Bench 3.0**：从 GLM-5 的 4.6 → **28.3**（**+514%**）
- **CyberGym**：漏洞发现 **SOTA 84.5%**
- **ExploitBench**：较 GLM-5.2 **+100%+**

**落地价值**：GLM-5.3 是当前最强的开源编码模型之一；权重将于发布后两周开放（在完成安全评估与硬化后）；同时配套公开 Z.ai Security Disclosure Ledger（[cvd.z.ai](https://cvd.z.ai)）进行真实漏洞披露。

### 1.2 为什么「后训练扩展」是一条独立航道

```text
传统主航道：
  scaling pre-training（更大基座 + 更多数据）

后训练主航道：
  scaling post-training
    = 加更多环境、加更多任务、加更多算力
    = 基座不动，能力持续涨
```

GLM-5.3 不重新预训练而获得大幅跃升，证明「基座一旦固定，团队可以通过持续加码 RL 环境与算力，把编码、推理、Agent 能力往上推」，而不必每次都重训千亿级模型。

## 二、基座：GLM-5 同底座

### 2.1 论文：GLM-5: from Vibe Coding to Agentic Engineering

| 字段 | 值 |
|---|---|
| arXiv | [2602.15763](https://arxiv.org/abs/2602.15763) |
| 年份 | 2026 |
| 作者 | GLM-5 Team、Aohan Zeng, Xin Lv 等 |

**一句话**：744B/40B MoE + DSA 稀疏注意力 + 异步 RL 基础设施；GLM-5.3 **沿用同基座**。

**中文摘要**：

> **做了什么**：发布下一代基础模型 GLM-5，旨在将开发范式从「氛围编码」（vibe coding）转向「智能体工程」（agentic engineering）。

> **怎么做**：在 GLM-4.5 的 ARC（智能体、推理、编码）能力基础上，GLM-5 采用 DSA（DeepSeek Sparse Attention）以显著降低训练与推理成本，同时保持长上下文保真度；为推进模型对齐与自主性，实现了全新的异步强化学习基础设施，通过解耦生成（generation）与训练（training）大幅提升后训练效率；进一步提出新颖的异步智能体强化学习算法，使模型能够从复杂、长程（long-horizon）的交互中更有效地学习。

> **结果**：GLM-5 在主要开放基准上达到 SOTA（state-of-the-art）水平；更重要的是，在真实编码任务上能力空前，超越了处理端到端软件工程挑战的已有基线。

### 2.2 与 GLM-5.3 的关联

```text
GLM-5 = GLM-5.3 的技术底座
  ├─ 744B/40B MoE 架构（沿用）
  ├─ DSA 稀疏注意力（沿用 → 见第三节 IndexShare）
  ├─ 异步 RL 基础设施（沿用 → 见第四节 slime）
  └─ Artificial Analysis Intelligence Index 首破 50
```

GLM-5.3 不重新预训练，因此 GLM-5 论文的每一个组件都直接成为 GLM-5.3 的能力上限。

## 三、长上下文：IndexShare / IndexCache

### 3.1 论文：IndexCache: Accelerating Sparse Attention via Cross-Layer Index Reuse

| 字段 | 值 |
|---|---|
| arXiv | [2603.12201](https://arxiv.org/abs/2603.12201) |
| 年份 | 2026 |
| 作者 | Yushi Bai, Qian Dong, Ting Jiang 等 |

**一句话**：GLM-5.2/5.3 **IndexShare** 底层论文——跨层复用稀疏注意力索引，移除 75% indexer 计算，1M 上下文 prefill 加速 1.82×。

**核心机制**：

```text
DeepSeek Sparse Attention（DSA）：
  - 轻量 lightning indexer 给每个 query 选 top-k token
  - 注意力复杂度从 O(L²) 降到 O(Lk)
  - 问题：indexer 仍是 O(L²)，且每层独立跑

IndexCache 关键观察：
  - 相邻层产出的 top-k 选集合高度相似
  - 把层分为「完整层（Full layers）」和「共享层（Shared layers）」
  - 共享层复用最近完整层的索引
```

### 3.2 两种互补方案

```text
Training-free IndexCache：
  - 通过贪心搜索在校准集上挑选保留 indexer 的层
  - 目标：最小化语言建模损失
  - 无需权重更新

Training-aware IndexCache：
  - 引入多层蒸馏损失
  - 让每个保留的 indexer 训练去匹配它所服务所有层的平均注意力分布
  - 简单交错模式也能达到与全 indexer 相当的精度
```

### 3.3 结果

```text
30B DSA 模型实验：
  - 移除 75% 的 indexer 计算
  - 1M 上下文 prefill 加速 1.82×
```

GLM-5.3 之所以能高效处理 1M 上下文，IndexShare 是关键技术；IndexCache 是其底层方法论。

## 四、RL 后训练三件套

### 4.1 SAO：异步 RL 算法引擎

**论文：Single-Rollout Asynchronous Optimization for Agentic Reinforcement Learning**

| 字段 | 值 |
|---|---|
| arXiv | [2607.07508](https://arxiv.org/abs/2607.07508) |
| 年份 | 2026 |
| 作者 | Zhenyu Hou, Yujiang Li, Jie Tang 等 |

**一句话**：GLM-5.3 训练用 SAO——单 rollout 异步优化 + 双侧 token 裁剪，稳定训练 1000 步。

**核心动机**：

```text
传统同步 RL 流水线：
  - 同步、批量交叉执行
  - 效率低下
  - 不适合长程智能体任务

异步 RL（rollout 到达即更新）：
  - 效率高
  - 稳定性与任务有效性研究不足
  - GRPO 的组级采样不自然适配
```

**SAO 的两个关键改动**：

1. **单 rollout 采样**（替换 GRPO 的组级采样）：每个 prompt 仅使用一个 rollout，减少 off-policy 影响并提升泛化。
2. **双侧 token 级裁剪**：严格的 token 级 clip，提升优化稳定性。

**结果**：SAO 能够稳定训练 1000 步，且在 SWE-Bench Verified、BeyondAIME、IMOAnswerBench 等智能体编码与推理基准上持续优于 GRPO 及其变体。

SAO 是 GLM-5.3 大幅跃升的**算法引擎**——把 GRPO 的「组内多 rollout」换成「单 rollout 异步更新」，让后训练既快又稳。

### 4.2 CompactionRL：上下文压缩 RL

**论文：CompactionRL: Reinforcement Learning with Context Compaction**

| 字段 | 值 |
|---|---|
| arXiv | [2607.05378](https://arxiv.org/abs/2607.05378) |
| 年份 | 2026 |
| 作者 | Yujiang Li, Zhenyu Hou, Yi Jing 等 |

**一句话**：GLM-5.2/5.3 训练栈核心组件——在 RL 中联合优化执行 + 摘要动作。

**问题背景**：长程智能体 LLM 越来越受到有限上下文窗口的制约；扩展的交互序列可能在任务完成前就超出最大上下文长度。

**核心机制**：

```text
Context Compaction（上下文压缩）：
  - 摘要之前的交互状态
  - 在压缩后的上下文中继续 rollout
  - 怎么将压缩纳入 RL 缺乏探索

CompactionRL 做法：
  - token 级损失归一化（token-level loss normalization）
  - 跨轨迹广义优势估计（GAE）
  - 联合优化任务执行与摘要生成
```

**结果**：

| 模型 | SWE-bench Verified | Terminal-Bench 2.0 |
|---|---|---|
| GLM-4.5-Air（106B-A30B） | Pass@1 **66.8%**（**+7.0**） | **24.5%**（+3.1） |
| GLM-4.7-Flash（30B-A3B） | **70.7%**（再 +5.5） | **30.4%**（再 +6.8） |

GLM-5.3 在 1M 上下文里能跑长程 Agent，CompactionRL 是关键——它让模型学会「边执行边压缩」，避免长任务上下文爆掉。

### 4.3 AgentRL：多轮多任务 RL 框架

**论文：AgentRL: Scaling Agentic Reinforcement Learning with a Multi-Turn, Multi-Task Framework**

| 字段 | 值 |
|---|---|
| arXiv | [2510.04206](https://arxiv.org/abs/2510.04206) |
| 年份 | 2025 |
| 作者 | Hanchen Zhang, Xiao Liu, Bowen Lv 等 |

**一句话**：AutoGLM 同款 RL 框架——全异步生成-训练 + 跨策略采样 + 任务优势归一化，5 项 agent 任务超越 GPT-5/Claude-Sonnet-4。

**两层创新**：

```text
基础设施层：
  - 全异步生成-训练（generation-training）流水线
  - 基于函数调用（function call）的统一 API
  - 容器化环境开发 + 集中式控制器
  - 支撑多任务 RL 中异构环境的开发

算法层：
  - 跨策略采样（cross-policy sampling）
    鼓励多轮设置下模型探索
  - 任务优势归一化（task advantage normalization）
    稳定多任务训练
```

**结果**：在五项智能体任务上，基于开源 LLM 训练的 AgentRL 显著优于 GPT-5、Claude-Sonnet-4、DeepSeek-R1 及其他开源 LLM 智能体。

AgentRL 已开源（[https://github.com/THUDM/AgentRL](https://github.com/THUDM/AgentRL)）；其算法与框架被用于构建 AutoGLM（[https://autoglm.zhipuai.cn](https://autoglm.zhipuai.cn)）。

### 4.4 DeepDive：知识图谱 + 多轮 RL

**论文：DeepDive: Advancing Deep Search Agents with Knowledge Graphs and Multi-Turn RL**

| 字段 | 值 |
|---|---|
| arXiv | [2509.10446](https://arxiv.org/abs/2509.10446) |
| 年份 | 2025 |
| 作者 | Rui Lu, Zhenyu Hou, Zihan Wang 等 |

**一句话**：知识图谱随机游走合成 hard-to-find QA + 多轮 RL，DeepDive-32B 在 BrowseComp 击败 WebSailor/DeepSeek-R1-Browse。

**做法**：
1. 从开放知识图谱自动合成复杂、困难且「难找」（hard-to-find）的问题；
2. 对 LLM 应用端到端多轮强化学习，增强与深度搜索结合的长程推理能力；
3. 设计抑制重复相似查询的冗余惩罚（redundancy penalty），鼓励多样性并减少冗余。

**结果**：DeepDive-32B 在 BrowseComp 上取得新的开源最优结果；多轮 RL 训练显著提升深度搜索能力。

与 GLM-5.3 的 Agent 能力正交（更偏搜索而非编码），但 THUDM 系列工作的统一多轮 RL 范式有借鉴价值。

## 五、网络安全涌现：CyberGym

### 5.1 论文：CyberGym: Evaluating AI Agents' Real-World Cybersecurity Capabilities at Scale

| 字段 | 值 |
|---|---|
| arXiv | [2506.02548](https://arxiv.org/abs/2506.02548) |
| 年份 | 2025 |
| 作者 | Zhun Wang, Tianneng Shi, Jingxuan He 等 |

**一句话**：GLM-5.3 在此拿下 **84.5% SOTA**——1507 个真实 OSS-Fuzz 漏洞，4 agent 框架 + 9 LLM 评测。

**任务设定**：给定漏洞的文本描述与对应代码库，要求智能体生成可复现该漏洞的 PoC（proof-of-concept）测试。

### 5.2 关键发现

```text
覆盖范围：
  - 188 个软件项目
  - 1,507 个真实漏洞
  - 4 agent 框架 × 9 LLM 评测

当前最高水平：
  - 即便表现最好的智能体-模型组合，成功率也仅约 20%
  - 凸显该基准的整体难度

附带价值：
  - 助力发现 34 个零日（zero-day）漏洞
  - 发现 18 个历史上未被补全的补丁
```

### 5.3 GLM-5.3 为何在此涌现

GLM-5.3 在 CyberGym 上拿 **84.5%** 是本次发布的「最大爆点」——零训练却涌现网络安全能力，是同基座纯后训练策略的最佳证明。

## 六、训练基础设施：slime

### 6.1 论文：slime: An Open Reinforcement-Learning Framework for LLM Post-Training

| 字段 | 值 |
|---|---|
| 来源 | [slime GitHub](https://github.com/THUDM/slime) |
| 年份 | 2026 |
| 作者 | THUDM（清华）+ Z.ai（智谱） |

**一句话**：GLM-5.3 训练底层框架——Megatron 训练 + SGLang rollout + 数据缓冲，全异步 RL。

**架构核心**：

```text
slime = Megatron 训练 + SGLang rollout + 自定义数据生成
                      ↓
        数据生成 / 奖励计算 / 验证器反馈 / 环境交互
                      ↓
        训练 / rollout / Data Buffer 同一条路径
```

### 6.2 落地价值

- **经过实战检验**：GLM-5.2 / 5.1 / 5 / 4.7 / 4.6 / 4.5 全系 RL 训练均采用 slime；
- **训练效率**：GLM-5.2 整次后训练约 **2 天**（高吞吐异步管线）；
- **开源协议**：Apache-2.0，[GitHub 8,300+ stars](https://github.com/THUDM/slime)。

`slime + SAO + CompactionRL = GLM-5.3 后训练三件套`。

## 七、GLM 系列历史脉络

### 7.1 GLM-130B：130B 双语 + INT4 量化

| 字段 | 值 |
|---|---|
| arXiv | [2210.02414](https://arxiv.org/abs/2210.02414) |
| 年份 | 2022（ICLR 2023） |
| 作者 | Aohan Zeng, Xiao Liu, Zhengxiao Du 等（清华 THUDM） |

**一句话**：首个开源 130B 双语预训练模型，支持 INT4 量化，首批国产芯片适配（海光 DCU / 华为昇腾）落地模型。

**核心贡献**：利用 GLM-130B 独特的缩放属性，实现**无需后训练的 INT4 量化且几乎无性能损失**，使其成为首个支持 INT4 量化的 100B 级模型，可在 4×RTX 3090（24G）或 8×RTX 2080 Ti（11G）GPU 上推理。

GLM-5.3 的 INT4 / FP8 量化思路可追溯到这篇论文。

### 7.2 GLM：自回归填空 + 2D 位置编码

| 字段 | 值 |
|---|---|
| arXiv | [2103.10360](https://arxiv.org/abs/2103.10360) |
| 年份 | 2021（ICLR 2022） |
| 作者 | Zhengxiao Du, Yujie Qian, Xiao Liu 等（清华 THUDM） |

**一句话**：GLM 家族奠基论文——自回归填空预训练框架，2D 位置编码，统一 NLU + 生成任务。

**核心创新**：GLM 在填空式预训练基础上加入 2D 位置编码，并允许以任意顺序预测片段（span），从而在 NLU 任务上取得比 BERT 与 T5 更好的表现。

GLM 预训练范式的开端，「自回归填空 + 2D 位置编码」成为后续所有 GLM 系列的内核。

### 7.3 ChatGLM：GLM-4 全家族技术报告

| 字段 | 值 |
|---|---|
| arXiv | [2406.12793](https://arxiv.org/abs/2406.12793) |
| 年份 | 2024 |
| 作者 | Team GLM（GLM-4 Series）、Aohan Zeng, Bin Xu 等 |

**一句话**：GLM-4 全家族技术报告——128K 长上下文、All Tools 自适应工具调用、中英双语对齐，接近 GPT-4-Turbo 性能。

**关键能力**：
- GLM-4 在通用指标（MMLU、GSM8K、MATH、BBH、GPQA、HumanEval）上与 GPT-4 相当或更优；
- 指令跟随（IFEval）接近 GPT-4-Turbo；
- 长上下文任务与 GPT-4 Turbo（128K）和 Claude 3 持平；
- 中文对齐（AlignBench）超越 GPT-4。

GLM-5.3 的「All Tools」设计思路继承于此。

### 7.4 GLM-4.5：355B MoE + hybrid reasoning

| 字段 | 值 |
|---|---|
| arXiv | [2508.06471](https://arxiv.org/abs/2508.06471) |
| 年份 | 2025 |
| 作者 | GLM-4.5 Team、Aohan Zeng, Xin Lv 等 |

**一句话**：GLM-4.5/4.6/4.7 旗舰 MoE 技术报告——355B/32B-A355B，hybrid reasoning。

**结果**：

```text
GLM-4.5 ARC 任务表现：
  - TAU-Bench 70.1%
  - AIME 24 91.0%
  - SWE-bench Verified 64.2%
  - 综合排名所有评估模型第 3
  - 智能体基准第 2

开源成果：
  - GLM-4.5（355B-A32B）+ GLM-4.5-Air（106B-A30B 紧凑版）
  - 代码：[https://github.com/zai-org/GLM-4.5](https://github.com/zai-org/GLM-4.5)
```

GLM-4.5 是 GLM-5.3 的「前身」，**ARC 三能力**（Agentic + Reasoning + Coding）成为 GLM-5.3 的核心叙事。

## 八、横向对比与结论

### 8.1 13 篇论文一览

| # | 论文 | 类别 | 与 GLM-5.3 关联 | 核心贡献 |
|---|---|---|---|---|
| 1 | GLM-130B | 历史 | 弱 | 130B 双语 + INT4 量化 |
| 2 | GLM | 历史 | 中 | 自回归填空预训练 |
| 3 | ChatGLM | 历史 | 中 | 128K + All Tools |
| 4 | GLM-4.5 | 历史 | 高 | 355B MoE + ARC |
| 5 | GLM-5 | 历史 | **极高** | DSA + 异步 RL |
| 6 | IndexCache | 架构 | **极高** | 跨层索引复用 |
| 7 | AgentRL | 架构 | 中 | 多轮多任务 RL |
| 8 | DeepDive | 架构 | 低 | KG + 多轮 RL |
| 9 | CompactionRL | 后训练 | **极高** | 联合优化执行 + 摘要 |
| 10 | SAO | 后训练 | **极高** | 单 rollout 异步优化 |
| 11 | CyberGym | 网络安全 | **极高** | 84.5% SOTA |
| 12 | GLM-5.3 官方 | 官方一手 | **⭐⭐ 必读** | 同基座纯后训练 |
| 13 | slime | 官方一手 | **极高** | Megatron + SGLang |

### 8.2 一句话总结

**GLM-5.3 的核心技术栈**：

```text
GLM-5 基座
  + IndexShare 稀疏注意力（IndexCache）
  + SAO 异步 RL 算法
  + CompactionRL 上下文压缩
  + slime 训练框架
  + CyberGym 评估基准
```

这套「同基座、纯后训练」的技术栈使 GLM-5.3 实现 **Terminal Bench 3.0 +514%**、**CyberGym 84.5%** 的双重突破——是 2026 Q3 后训练扩展范式的标杆案例。

## 模型版本说明

⚠️ **以发布时为准**：本文涉及 GLM-5.3、GLM-5、GLM-4.5 等模型版本号与对应能力描述，均以 [Z.ai 官方博客](https://z.ai/blog/glm-5.3) 与各论文 arXiv 版本发布时的事实为准。不同时间窗口、不同评测口径下数字可能略有差异，但「同基座、纯后训练」这一定性结论与各项核心数据点（Terminal Bench +514%、CyberGym 84.5%、ExploitBench +100%+ 等）的相对关系应保持稳定。
