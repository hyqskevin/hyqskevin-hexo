---
title: GLM-5.3 技术报告要点
date: 2026-09-08 00:00:00
description: 本文梳理 GLM-5.3 技术报告的核心要点：它沿用 GLM-5 同基座、纯后训练扩展路线，凭借 IndexShare 稀疏注意力、SAO 异步 RL、CompactionRL 上下文压缩与 slime 训练框架，在编码与网络安全基准上实现 Terminal Bench 3.0 +514%、CyberGym 84.5% 的突破。
categories: [notes]
tags: [GLM-5.3, 大模型, 后训练, 技术报告, 稀疏注意力]
series:
  name: "GLM-5.3 技术报告"
  index: 1
  total: 3
---

# GLM-5.3 技术报告要点

> 这是「GLM-5.3 技术报告」系列的第 1/3 期（要点篇）。本期只讲清一件事：**GLM-5.3 到底强在哪、为什么强**。后续两期将分别展开架构论文与后训练扩展论文。
> 原始素材来自 13 篇相关论文（全部含中文摘要），由本地翻译缓存提供，本文做要点提炼，不逐篇复述。

## 一、核心结论：扩展后训练即一切

GLM-5.3 没有独立的 arXiv 论文，其技术细节分散在 7 份一手资料里：GLM-5 技术报告、IndexCache、SAO、CompactionRL、CyberGym，以及 Z.ai 官方博客与 slime 框架。

Z.ai 官方给出的核心论断只有一句话——**「扩展后训练（scaling post-training）即我们所做的一切」**。GLM-5.3 与 GLM-5.2 使用同一基座，不重新预训练，所有增益完全来自后训练（post-training）扩展。

### 1.1 同基座、纯后训练

- GLM-5.3 沿用 **GLM-5 同一基座**，模型架构与 GLM-5 完全一致。
- GLM-5.2 已构建起完整技术栈：IndexShare 高效处理长上下文、SAO 支持长程任务 RL、slime 支持大规模异步训练。
- 过去一个月，团队持续在**更多环境、更多样化任务、更多算力**上扩展这套技术栈——这就是 GLM-5.3 的全部改动。

### 1.2 为什么这条路线值得关注

一个没有重新预训练、仅靠后训练就获得大幅跃升的模型，证明了「后训练扩展」本身是一条独立的主航道。它意味着：基座一旦固定，团队可以通过持续加码 RL 环境与算力，不断把编码、推理、Agent 能力往上推，而不必每次都重训千亿级模型。

## 二、关键技术栈拆解

GLM-5.3 的能力来自一套组合拳，可归纳为「1 基座 + 4 组件 + 1 基准」。

### 2.1 基座：GLM-5（DSA + 异步 RL）

GLM-5 旗舰技术报告（arXiv 2602.15763）是理解 GLM-5.3 的核心论文。它采用 **DSA（DeepSeek Sparse Attention）** 显著降低训练与推理成本、保持长上下文保真度，并实现了全新的异步强化学习基础设施（解耦生成与训练），以及新颖的异步智能体 RL 算法。GLM-5 在 Artificial Analysis Intelligence Index 上首破 50，而 GLM-5.3 沿用其同一基座。

### 2.2 长上下文：IndexShare（底层论文 IndexCache）

IndexCache（arXiv 2603.12201）是 GLM-5.2/5.3 **IndexShare** 技术的底层论文。它利用相邻层 top-k 索引的高度相似性，跨层复用稀疏注意力索引：

- 将层划分为「完整层」（各自运行 indexer）与「共享层」（复用最近完整层的索引）；
- 提供 Training-free 与 Training-aware 两种方案；
- 实验表明可移除 **75% 的 indexer 计算**，1M 上下文 prefill 加速 **1.82×**。

这正是 GLM-5.3 能在 1M 上下文里高效跑长程任务的根基。

### 2.3 上下文压缩：CompactionRL

CompactionRL（arXiv 2607.05378）是 GLM-5.2/5.3 训练栈的核心组件。长程 Agent 受限于上下文窗口，交互序列常在任务完成前就超出上限。它在 RL 中**联合优化「执行」与「摘要」两个动作**，通过 token 级损失归一化与跨轨迹 GAE，让模型学会「边执行边压缩」：

- GLM-4.5-Air 在 SWE-bench Verified 达 Pass@1 66.8%，绝对提升 **7.0** 点；
- 在 Terminal-Bench 2.0 达 24.5%，提升 **3.1** 点。

### 2.4 异步 RL 算法：SAO

SAO（Single-rollout Asynchronous Optimization，arXiv 2607.07508）是 GLM-5.3 RL 流水线的核心算法。异步 RL 在 rollout 到达时即更新模型，效率高于同步 GRPO，但稳定性不足。SAO 的改动：

- 把 GRPO 的「组级多 rollout 采样」替换为**单 rollout 采样**，减少 off-policy 影响；
- 配合实用的价值模型训练设计；
- 引入严格的**双侧 token 级裁剪**（double-side token-level clipping）提升稳定性。

结果：稳定训练 1000 步，在 SWE-Bench Verified、BeyondAIME、IMOAnswerBench 上持续优于 GRPO 及其变体。

### 2.5 训练框架：slime

slime（GitHub: THUDM/slime）是 GLM-5.3 训练的底层基础设施，将 Megatron 训练与 SGLang rollout 连接，数据生成、奖励计算、验证器反馈与环境交互都流经同一条「训练 / rollout / Data Buffer」路径。GLM-5.2 整次后训练约 **2 天**，框架已开源（Apache-2.0），GitHub 获 **8,300+ stars**。

> 一句话记法：**slime + SAO + CompactionRL = GLM-5.3 后训练三件套**。

## 三、关键数据：编码与网络安全的双重突破

GLM-5.3 官方公告给出了一组极具冲击力的数据点（对比 GLM-5.2）：

| 基准 | 表现 | 相对提升 |
|---|---|---|
| Z.ai Code Bench | 编码能力 | 较 GLM-5.2 **+50%** |
| Terminal Bench 3.0 | 4.6 → 28.3 | **+514%** |
| CyberGym | 漏洞发现 SOTA | **84.5%** |
| ExploitBench | 利用链更上游 | 较 GLM-5.2 **+100%+** |

### 3.1 最大爆点：网络安全能力涌现

CyberGym（arXiv 2506.02548）涵盖 188 个软件项目中的 1,507 个真实漏洞，要求智能体生成可复现漏洞的 PoC 测试。即便是表现最好的智能体-模型组合，整体成功率也仅约 20%。而 **GLM-5.3 在该基准上拿下 84.5% SOTA**，且零训练即涌现网络安全能力——这正是「同基座、纯后训练」策略最有力的证明。该基准还助力发现了 34 个零日漏洞与 18 个历史未补全补丁。

### 3.2 编码能力的代际跃升

从 GLM-5 的 Terminal Bench 3.0 仅 4.6，到 GLM-5.3 的 28.3，跨代提升超过 5 倍。结合 Z.ai Code Bench +50%、ExploitBench 翻倍以上，GLM-5.3 被官方定位为「当前最强的开源编码模型之一」，权重在发布后两周（完成安全评估与硬化后）开放。

## 四、13 篇论文总览

原始素材共 13 篇论文，按与 GLM-5.3 的关联度分为五类：

- **A. GLM 系列历史（5 篇）**：GLM-130B（INT4 量化起点）、GLM（自回归填空范式）、ChatGLM（All Tools 生态）、GLM-4.5（ARC 三能力前身）、GLM-5（同基座技术底座，⭐ 核心）。
- **B. 相关架构（3 篇）**：IndexCache（IndexShare 底层）、AgentRL（AutoGLM 同款 RL 框架）、DeepDive（KG + 多轮 RL 搜索 Agent）。
- **C. 后训练扩展（2 篇）⭐**：CompactionRL、SAO——GLM-5.3 大幅跃升的关键。
- **D. 网络安全（1 篇）⭐**：CyberGym，84.5% SOTA 涌现。
- **E. 官方一手（2 篇）⭐⭐**：Z.ai 官方博客、slime 框架。

其中与 GLM-5.3 关联「极高」的论文为：GLM-5（同基座）、IndexCache（IndexShare 底层）、CompactionRL（训练栈核心）、SAO（异步 RL 算法）、CyberGym（84.5% SOTA）、slime（RL 框架）。

## 五、模型版本说明

⚠️ **本文涉及的模型名称、版本号、基准数据与性能数字，均以 GLM-5.3 发布时（2026 Q3）官方公告与对应论文为准。** LLM 领域迭代极快，后续版本可能在架构、能力边界与开放策略上发生变化，请以 Z.ai / THUDM 官方最新发布为准。

## 六、下期预告

- 第 2 期（架构篇）：展开 GLM 系列历史与 IndexShare / AgentRL / DeepDive 等架构论文；
- 第 3 期（后训练篇）：深入 CompactionRL、SAO 与 slime 的后训练扩展细节。

---

**一句话总结**：GLM-5.3 的核心技术 = GLM-5 基座 + IndexShare 稀疏注意力（IndexCache）+ SAO 异步 RL + CompactionRL 上下文压缩 + slime 训练框架 + CyberGym 评估基准。这套「同基座、纯后训练」技术栈，是 2026 Q3 后训练扩展范式的标杆案例。
