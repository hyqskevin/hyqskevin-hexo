---
title: 扩散语言模型入门
date: 2026-10-16 00:00:00
description: Diffusion LLM 是 2024-2025 突破自回归假设的全新架构：保留 Transformer 主体、改用 masked 语言模型训练、推理时单步并行去噪多个 token。LLaDA 8B 在数学与代码任务反超自回归基线，推理整体 5-10x 加速。本文梳理原理、公式、主流模型与未来趋势。
categories:
  - notes
tags:
  - Diffusion LLM
  - LLaDA
  - Mercury Coder
  - 大模型架构
  - 扩散模型
  - 生成模型
---

自回归 LLM 统治了 2023-2024 年，但每步只生成 1 个 token、串行累积延迟的硬伤始终存在。2024 年开始出现的 **Diffusion LLM**（扩散语言模型）把「逐 token 自回归」换成「逐轮迭代去噪」，每一步可以同时预测多个 token，推理速度和任务表现都有质变。本文是讲义级别的整理：原理、公式、模型、挑战、趋势一次过完。

## 一、核心思想 · 什么是 Diffusion LLM

### 1.1 自回归 vs 扩散 LLM

```text
传统 LLM（自回归）：
  输入: "今天天气"
    ↓
  LLM 预测: "真"
    ↓
  LLM 输入: "今天天气真"
    ↓
  LLM 预测: "好"
    ↓
  ...
每步生成 1 个 token —— 串行

Diffusion LLM：
  输入: [MASK, MASK, MASK, MASK, MASK, MASK]
    ↓
  Step 1: [今天, MASK, MASK, MASK, MASK, MASK]
    ↓
  Step 2: [今天, 天气, MASK, MASK, MASK, MASK]
    ↓
  Step N: [今天, 天气, 真, 好, MASK, MASK]
    ↓
  最终:   [今天, 天气, 真, 好, 。, ？]
每步并行去噪多个 token
```

直观区别只有一句话：**自回归每步 1 token、必须串行；扩散每步多 token、可并行**。这个差异直接决定了推理速度上限。

### 1.2 扩散过程的数学表达

把视觉领域的 Diffusion 直接搬到离散 token 上，前向加噪与反向去噪公式如下：

```text
前向（加噪）：
  q(x_t | x_{t-1}) = N(x_t; √(1-β_t) x_{t-1}, β_t I)

反向（去噪）：
  p_θ(x_{t-1} | x_t) = N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))
```

关键在反向过程：每个 step 同时去噪 **多个 token**，而不是只去噪一个。

## 二、关键优势 · 为什么值得关注

### 2.1 并行生成：5-10x 推理加速

```text
维度          自回归         扩散 LLM
串行 step     100+         8-16
每次 1 token   ✅           ❌
每次多 token  ❌           ✅
推理加速      1x          2-10x
```

生成 100 个 token 的句子：自回归要走 100 步串行解码，扩散 LLM 只要 8-16 轮迭代，每轮并行预测多个位置。

### 2.2 双向 context

```text
自回归：每个 token 只能看前面
  "今天天气___" → 预测 "真"，只能基于 "今天天气"

扩散：每个 token 能看前后
  "今天天气[MASK][MASK]" → 双向推理，同时利用前后文
```

双向 attention 让模型在做填空类、数学推理、代码补全时拿到更完整的上下文。

### 2.3 灵活长度与全局一致性

```text
长度控制：
  自回归：固定 1 个长度（生成到 <EOS> 停止）
  扩散：可任意长度（mask 数量可调）

一致性：
  自回归：局部最优，每步贪心
  扩散：全局最优，所有 token 联合考虑
```

## 三、主流模型 · LLaDA / Mercury / Plaid

### 3.1 LLaDA（2024-06）⭐

**Large Language Diffusion with mAsking**，是目前最有影响力的开源 Diffusion LLM 研究。

```text
核心思想：
  - 输入加 mask（类似 BERT）
  - 训练 Transformer 预测 masked token
  - 但保持 Transformer 架构不变

训练：
  - 80% random mask
  - 20% keep original
  - 预测被 mask 的 token
```

**LLaDA 8B 实验结果**：

```text
Benchmark     自回归 LLaMA    LLaDA
MMLU          65%            63%
GSM8K         50%            57%   ⭐
HumanEval     35%            42%   ⭐
推理速度      1x             5x    ⭐
```

LLaDA 8B 在 **数学 + 代码**上首次系统性地超过同规模自回归 LLaMA，推理快 5 倍。

### 3.2 Mercury Coder（2024-08）

首个商用 Diffusion LLM，编程专用：

```text
能力：
  - 代码补全
  - 推理 + 多 token 生成

性能：
  - 1000+ tokens/s
  - 速度上超越同代 GPT-4o

局限：
  - 仅代码任务
  - 规模仍小
```

Mercury 是「Diffusion LLM 能落地」的第一个证据，但在通用语言任务上还没见到同级别工业产品。

### 3.3 Plaid（Google 2024-02）

```text
- 1.5B 参数
- 在 LM 任务上验证可行
- 首次证明 "Diffusion can do LM" 假设
```

Plaid 是 LLaDA 之前的关键铺垫工作，规模小但思路完整。

## 四、架构细节

### 4.1 LLaDA 架构

```text
输入: [token_1, token_2, ..., token_N]
   ↓
Random mask（80% 比例）:
   [今天, [MASK], [MASK], [MASK], 真, 好]
   ↓
Transformer 编码
   embeddings
   ↓
Bidirectional Self-Attention
   ↓
预测 masked positions:
   [今天, 天气, 天气, 真, 真, 好]
   ↓
取最一致预测:
   [今天, 天气, 真, 好]
```

要点：

- **完全 Transformer 架构**——主体结构不变
- **只改训练目标**——masked language modeling
- **推理时迭代去噪**——从全 mask 逐渐变完整文本

### 4.2 训练目标

```text
L = -E_t [ (1/|M_t|) Σ_{i ∈ M_t} log p_θ(x_i | x_{\M_t) ]
```

参数含义：

- `M_t`：第 `t` 步被 mask 的位置集合
- `x_i`：第 `i` 个 token
- `x_{\M_t`：未被 mask 的部分

直觉：**只对被 mask 的位置计算交叉熵**，未 mask 的位置不参与损失。

### 4.3 推理时的迭代去噪

```text
Step 1: 全部 mask
  [MASK] [MASK] [MASK] [MASK] [MASK] [MASK]

Step 2-15: 迭代去噪（每轮去噪 ~1/N 个位置）
  Step 2:  [今天] [MASK] [MASK] [MASK] [MASK] [MASK]
  Step 3:  [今天] [天气] [MASK] [MASK] [MASK] [MASK]
  ...
  Step 15: [今天] [天气] [真] [好] [。] [？]
```

每步可以**并行**预测所有 masked 位置，这是并行加速的来源。

## 五、训练挑战

### 5.1 长文本训练

```text
扩散 LLM 需要在"任意 mask 比例"上训练
比 BERT 的固定 15% mask 难得多
```

**解法**：

- 渐进式 mask（从少到多）
- Curriculum Learning

### 5.2 推理质量

```text
多次迭代去噪可能不一致
步骤之间需要协调
```

**解法**：

- **Re-mask 策略**：对低置信度位置重新 mask，下一轮重做
- **Threshold 策略**：固定每步去噪 10% 位置，保证节奏一致

### 5.3 与 Transformer 兼容

```text
Diffusion 改变了"自回归"假设
如何保持原 LLM 已有的能力？
```

**解法**：

- **保持 Transformer 架构**——只改训练目标
- **混合训练**——部分自回归 + 部分扩散
- **预训练初始化**——用现有 LLM 权重初始化，加速收敛

## 六、性能量化

### 6.1 推理加速比

```text
Accel = N_steps(AR) / N_steps(Diff)
```

```text
符号        自回归     扩散 LLM
N_steps     100       8-16
加速比      1x        6-12x
```

实际加速 5-10x（考虑并行开销与调度成本）。

### 6.2 双向 context 的实测收益

```text
任务           相对自回归的提升
数学推理       +7%
代码补全       +7%
文本填空       +10%
```

数学和代码上 +7%，填空任务 +10%——这就是 LLaDA 8B 能在 GSM8K / HumanEval 上反超同规模 LLaMA 的来源。

## 七、适用场景与局限

```text
✅ 适合 Diffusion LLM：
  - 代码补全（可多 token 并行）
  - 数学推理（可全局思考）
  - 文本填空（可双向推理）
  - 短文本生成

❌ 不适合：
  - 超长文本（> 2K）—— mask 空间爆炸
  - 严格流式（必须 token-by-token 增量输出）
  - 实时聊天（需要稳定的单 token 延迟）
```

到 2025 年为止，Diffusion LLM 的主战场还是**代码与短文本填空**，长文本生成与流式聊天仍以自回归为主。

## 八、未来趋势

### 8.1 统一架构

```text
未来可能：
  - 自回归 + 扩散 混合
  - 根据任务选最佳模式
  - 一个模型多种生成方式
```

### 8.2 大规模扩散 LLM

```text
当前：1-8B 扩散 LLM
未来：70B+ 扩散 LLM
挑战：训练稳定性
```

规模上 70B+ 的扩散 LLM 何时能稳定训练出来，是开放问题。

### 8.3 视频 / 音频的扩散统一

```text
Sora 已经用扩散
未来 LLM 也可能用扩散
统一 = 视频 + 文本 + 音频
```

视觉已经押注扩散，文本 + 音频 + 视频统一在扩散框架下，是潜在的中长期方向。

## 九、关键洞察与必读论文

### 9.1 关键洞察

1. **Diffusion LLM 是 2024-2025 全新架构**——突破自回归假设
2. **LLaDA 8B 实证**——数学 + 代码超过自回归
3. **5-10x 推理加速**——并行生成
4. **保持 Transformer 架构**——只改训练目标
5. **未来 = 自回归 + 扩散 混合**

### 9.2 经典讨论题

- Q1：扩散 LLM 为什么在数学 / 代码上更强？
- Q2：自回归和扩散的根本区别是什么？
- Q3：扩散 LLM 的训练数据量是否要更多？
- Q4：扩散 LLM 能否完全替代自回归？
- Q5：为什么 Mercury Coder 只做代码？
- Q6：未来 LLM 架构会是什么样？

### 9.3 必读论文

```text
核心 3 篇：
  1. LLaDA 2024-06《Large Language Diffusion with mAsking》⭐⭐⭐
  2. Plaid 2024-02《A Diffusion Language Model》
  3. Mercury 2024-08《Mercury Coder Technical Report》

进阶 2 篇：
  4. Austin et al. 2021《Structured Denoising Diffusion》
  5. Han et al. 2022《SSD-LM》

历史 1 篇：
  6. Ho et al. 2020《DDPM》（图像 diffusion 起源）
```

## 模型版本说明

本文中提及的 **LLaDA**、**Mercury Coder**、**Plaid**、**Gemini Diffusion** 等模型版本与发布时间均来自源稿，截止到 **2025-08** 的公开信息。

⚠️ **以发布时为准**——具体版本号、参数规模、benchmark 分数可能已迭代更新；引用论文与产品细节请以官方仓库/技术报告原文为准。

## 相关资料

如果对本文的背景感兴趣，可以继续看：

- 扩散模型基础与论文速读（Diffusion DDPM / DDIM / Stable Diffusion / Consistency Model）
- SSM / Mamba 架构（状态空间模型）
- Transformer 自回归推理优化（KV-Cache、Flash-Attention）
