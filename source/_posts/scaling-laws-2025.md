---
title: 推理算力成 Scaling 新维度
date: 2026-10-16 00:00:00
description: 拆解 2024-2025 年 Test-Time Scaling（推理算力扩展）的崛起：从 o1/R1 把"推理时算力"变成与"训练算力"并列的新维度，到 Snell 2024 论文证明 Test-Time Compute 可预测，再到 Best-of-N / 树搜索 / 迭代修正三大策略与工业落地，最后给出训练-推理算力最优分配表与未来趋势。
categories: [notes]
tags: [Scaling Laws, Test-Time Compute, 推理算力, o1, DeepSeek-R1, Snell, RL Scaling]
---

如果说 2020 年的 Kaplan Scaling 打开了"训练算力驱动性能"的大门，2022 年 Chinchilla 重新平衡了参数与数据，那么 2024-2025 年真正打开的是另一扇门：**Test-Time Scaling（推理时算力扩展）**。OpenAI o1、DeepSeek-R1、Snell 等人的论文几乎在同一时间把"推理算力"推上了与"训练算力"等量齐观的地位。本文按时间线 + 公式 + 工业案例三层结构，把这场演进的核心理念、策略矩阵、算力分配表与未来趋势一次性梳理清楚。

## 一、时间坐标：从训练到推理

### 1.1 关键节点

```text
2020     Kaplan 2020《Scaling Laws for Neural LMs》
2022     Chinchilla（20 tokens / param）
2023     DeepSeek / Qwen 持续训练侧 Scaling
2024-09  OpenAI o1 发布 ⭐ Test-Time Scaling 显式提出
2024-10  Snell 等人《Scaling LLM Test-Time Compute》⭐⭐
2024-12  o3 / DeepSeek-R1 强化
2025-01  DeepSeek-R1 完整开源
2025-03  Scaling Law 2.0 涌现
2025-06  推理时算力 vs 训练时算力 平衡
2025-08  Test-Time Training (TTT) 探索
```

这张时间线的最大变化在 2024-09：**o1 把"推理"变成了一种可被显式扩展的资源**。在它之前，Scaling Law 的主战场是预训练；在它之后，推理时的算力投入也被纳入了"性能—算力"曲线。

### 1.2 范式迁移

**传统 Scaling Law（2020-2022）**：

```text
Training Compute ↑
   ↓
模型参数 ↑
   ↓
性能 ↑
```

**Test-Time Scaling Law（2024-2025）**：

```text
Test-Time Compute ↑
   ↓
推理质量 ↑
   ↓
性能 ↑
```

两者并不互斥——它们是同一根曲线的两条腿。

## 二、训练算力 vs 推理算力

### 2.1 总算力分解

$$C_{\text{total}} = C_{\text{train}} + N_{\text{queries}} \times C_{\text{inference}}$$

| 符号 | 含义 | 典型值 |
|------|------|--------|
| $C_{\text{total}}$ | 总算力 | 10²² - 10²⁵ FLOPs |
| $C_{\text{train}}$ | 训练算力 | 10²² - 10²⁴ |
| $N_{\text{queries}}$ | 推理查询数 | 用户数 × 时间 |
| $C_{\text{inference}}$ | 单次推理算力 | 10¹⁸ - 10²² |

注意 $N_{\text{queries}}$ 是"乘数"——**只要用户量足够大，推理侧的累积算力就会反超训练侧**。这也是为什么 2024 年之后所有头部团队都开始认真规划"推理预算"。

### 2.2 关键洞察

> **算力 = 训练算力 + 推理算力**
> 两者都能扩展性能——但方式不同。

**未来算力分配**：

> **未来算力分配 = 训练（一次性）+ 推理（持续）**
> 推理算力可能超过训练算力。

## 三、Test-Time Scaling 三大策略

### 3.1 策略 1 · Best-of-N 采样

```text
N 个候选回答 → PRM 评分 → 选最高分

N=1:     单次生成
N=16:    16 倍推理算力
N=1000:  1000 倍推理算力
```

| N | AIME 2024 | SWE-Bench |
|---|-----------|-----------|
| 1 | 13% | 4% |
| 16 | 35% | 12% |
| 100 | 50% | 25% |
| 1000 | 75% | 50% |

这是 OpenAI o1 的核心机制之一：**大量 Best-of-N + 过程奖励模型（PRM）评分**。实现最简单，也最容易并行，但边际收益会迅速递减。

### 3.2 策略 2 · 树搜索（Tree Search）

```text
Step 1: 生成 8 个候选第一步
Step 2: PRM 评分，选 top-3
Step 3: 对每个 top-3 生成第二步
Step 4: PRM 评分，保留 top-3
Step 5: 继续直到完成
```

**MCTS + PRM**：

```text
蒙特卡洛树搜索：
  - 选择：UCB 公式
  - 扩展：生成新节点
  - 模拟：PRM 评分
  - 回溯：更新 Q 值
```

| 方法 | AIME 2024 |
|------|-----------|
| Best-of-N (N=100) | 50% |
| 树搜索 + PRM | **65%** |

树搜索是 Best-of-N 的"立体化"——把搜索空间从平面铺开变成层级展开。代价是实现复杂度和计算量都明显上升。

### 3.3 策略 3 · 迭代修正

```text
Step 1: 生成初始答案
Step 2: 自我反思
Step 3: 改进答案
Step 4: 循环直到满意
```

**Reflexion 范式**：

```python
def reflexion(question, max_iter=3):
    response = llm(question)

    for i in range(max_iter):
        # 自我批评
        critique = llm(f"批评：{response}")

        # 改进
        response = llm(f"基于批评改进：{critique}")

    return response
```

**Self-Refine 效果**：

| 任务 | 1 次 | 3 次 |
|------|------|------|
| 数学 | 35% | **55%** |
| 代码 | 30% | **45%** |
| 写作 | 60% | **75%** |

迭代修正的优势是**持续改进**——每次反思都给答案加一层"自检"，适合答案可以渐进优化的场景。

## 四、Snell 2024 论文详解

### 4.1 论文核心

**Snell, Kumar, Zhou 等（Google DeepMind）**：

《Scaling LLM Test-Time Compute——Can We Predict and Improve Performance？》

**核心发现**：

```text
Test-Time Compute Scaling 的两个阶段：

阶段 1（low compute）：
  - PRM 主导
  - 提升快，回报高

阶段 2（high compute）：
  - 树搜索 + revision 主导
  - 提升慢，但持续
```

低算力区段靠 Best-of-N + PRM 拿收益，高算力区段必须靠树搜索 + 迭代修正才能继续往上推。这是整篇论文最值得记住的一句话。

### 4.2 公式 2 · Test-Time Compute 优化

$$\text{Performance} = f(C_{\text{inference}})$$

**两个区域**：

| Compute 范围 | 最优策略 |
|-------------|---------|
| 1-100 | Best-of-N + PRM |
| 100-10000 | 树搜索 |
| 10000+ | 多方法集成 |

**关键**：

> **没有"一种方法适用所有"——按算力预算选最佳策略**

### 4.3 公式 3 · Performance-Compute 曲线

$$\text{Acc} = 1 - \exp(- \alpha \cdot C_{\text{inference}}^\beta)$$

| 符号 | 含义 |
|------|------|
| $\alpha$ | 任务难度系数 |
| $\beta$ | 边际收益（< 1） |
| $C_{\text{inference}}$ | 推理算力 |

**关键**：$\beta < 1$——**算力翻倍性能提升不到翻倍**（边际递减）。这意味着 Test-Time Scaling 不是"无脑堆算力"，而是存在天花板。

## 五、实际效果：o1 vs GPT-4o

### 5.1 算力对比

| 模型 | 训练算力 | 推理算力 | AIME 2024 | SWE-Bench |
|------|---------|---------|-----------|-----------|
| GPT-4o | 10²⁵ | 10¹⁸ | 13% | 4% |
| **o1** | 10²⁵ | **10²⁰** ⭐ | **70%+** | **70%+** |

**关键**：

> **o1 训练算力 ≈ GPT-4o**，但推理算力高 **100x**
> → 性能提升 **5-15x**

### 5.2 公式 4 · 推理 vs 训练算力的等效关系

$$\text{Equivalent Compute} = C_{\text{train}} + \eta \cdot C_{\text{inference}}$$

| 符号 | 含义 |
|------|------|
| $\eta$ | 推理效率折扣（典型 0.1-0.5） |

**含义**：

> 100x 推理算力 ≈ 10-50x 训练算力的"等效性能提升"
> （但推理不需要重新训练，便宜很多）

**意义**：

> **不用训练更大模型，只用推理更多算力**——性价比更高

这正是 2024-2025 年各团队重新评估"是否还要做下一代超大预训练模型"的根本原因——推理侧投入的 ROI 更高、更可控、更可调度。

## 六、Test-Time Scaling 四类型

### 6.1 类型 1 · Parallel Scaling（并行）

```text
N 个独立采样
  ↓
聚合（投票 / Best-of-N）
  ↓
最终答案
```

- **优势**：容易实现、适合"独立可验证"任务
- **局限**：边际收益递减、大量冗余计算

### 6.2 类型 2 · Sequential Scaling（串行）

```text
Step 1: 生成
Step 2: 反思
Step 3: 改进
Step 4: 再反思
...
Step N: 最终答案
```

- **优势**：持续改进、适合"迭代"任务
- **局限**：慢（串行延迟）、可能陷入循环

### 6.3 类型 3 · Tree Search（树搜索）

```text
并行 + 串行 混合
  ↓
树结构
  ↓
剪枝 + 搜索
```

- **优势**：全局最优、避免局部最优
- **局限**：实现复杂、计算量大

### 6.4 类型 4 · Test-Time Training（TTT）

```text
推理时更新模型权重
  ↓
用当前任务数据微调
  ↓
用更新后的模型推理
```

2024-2025 新兴方向——Meta / Stanford 探索。这是把"训练"和"推理"边界彻底打破的一种尝试：每次推理时都在现场做一次小规模适配。

## 七、算力最优分配

### 7.1 公式 5 · 算力分配优化

$$\max_{C_t, C_i} \text{Performance} \quad \text{s.t.} \quad C_t + C_i = C_{\text{budget}}$$

**最优分配**：

| 任务类型 | $C_t$（训练）| $C_i$（推理）|
|---------|-------------|--------------|
| 创意写作 | 80% | 20% |
| 数学推理 | 50% | 50% |
| 客户服务 | 30% | 70% |
| 实时翻译 | 20% | 80% |

**关键**：

> **不同任务的最优分配不同**——不是"训练越大越好"或"推理越多越好"

创意写作重在风格多样性，更依赖训练侧；数学推理需要长链思考，训练与推理各占一半；客服和翻译的答案相对标准化，推理侧的反复校验收益更高。

### 7.2 公式 6 · 何时用 Test-Time Scaling

```text
使用条件（任一满足）：
  - 任务可验证（有 PRM）
  - 答案短（数学题）
  - 任务难度高
  - 推理预算充足

不使用条件：
  - 任务无 PRM
  - 答案长（文章）
  - 实时要求（< 100ms）
```

如果你的任务**既无法验证、又要长答案、还要实时返回**，Test-Time Scaling 几乎注定跑不通。

## 八、工业实践

### 8.1 DeepSeek-R1 案例

```text
训练算力：~5M H800-hour ≈ $5-10M
推理算力：每用户 1000-10000 token/s
  × 数亿用户
  × 365 天
  = 比训练算力高 10-100x
```

**关键**：

> **R1 的成功 = 高效训练 + 大规模推理算力**
> 训练不一定要重——推理时的算力更重要

DeepSeek-R1 用 GRPO + 蒸馏把"训练成本"压到几百万美元级，把成本压力转移到了推理侧的工程优化上。

### 8.2 OpenAI o1 定价

```text
GPT-4o：        $5  / 1M input tokens
o1-preview：    $15 / 1M input tokens
o1：            $60 / 1M output tokens

o1 价格高 12x = 因为推理算力高
```

**商业模式**：

> 推理算力收费 → 用户为"思考"付费
> 这是 LLM 行业的新范式

o1 是行业里第一个把"思考本身"明码标价的模型——**用户为每一步推理付钱**，这一定价模型后来被 Claude、Perplexity、Qwen 等陆续跟进。

### 8.3 案例：Perplexity Deep Research

```text
用户问：研究 XXX 主题
  ↓
Perplexity 后台跑 10 分钟
  ↓
调用 50+ 次 LLM
  ↓
输出完整研究报告
```

**成本**：

- 每次查询 $0.5-$2
- 用户付费 $20/月
- **靠"推理算力"变现**

Perplexity 的 Deep Research 是另一个典型范式：**把高单价、低频次的研究任务做成订阅产品**，本质上是用推理算力替代人工研究员的工时。

## 九、训练 vs 推理算力演进

### 9.1 2020-2025 Scaling 路线图

```text
2020  Kaplan:    训练算力 10x 提升 → 模型 10x 大
2022  Chinchilla: 重新平衡数据
2023  GPT-4:     训练算力到顶
2024  o1:        推理算力开始规模化 ⭐
2025  R1:        开源推理模型
2026+            训练 + 推理 联合优化
```

### 9.2 公式 7 · 双算力扩展

$$\text{Performance} = f(C_t^\alpha \cdot C_i^\beta)$$

- $\alpha = 0.3$（训练算力影响）
- $\beta = 0.7$（推理算力影响）
- 训练算力**更稀缺**（一次性）
- 推理算力**可重复使用**（用户多）

**未来**：

> 推理算力的总贡献 > 训练算力
> "Inference Compute" > "Training Compute"

## 十、未来趋势

### 10.1 趋势 1 · 推理时训练（TTT）

```text
未来：
  - 推理时用当前数据微调模型
  - 适应特定任务
  - Meta 2024 TTT 模型
```

TTT 把"训练"嵌入到"推理"内部，可以看作 Test-Time Scaling 的极端形态。

### 10.2 趋势 2 · 自适应算力

```text
未来：
  - 简单问题用少算力
  - 复杂问题用多算力
  - 动态调整
```

路由式推理（router model）已经在工业界普及，GPT-5 / Claude / Gemini 都内置了"轻模型 / 重模型"自动分流。

### 10.3 趋势 3 · 分布式推理

```text
未来：
  - 多个小模型协作
  - 任务分解
  - 算力弹性
```

MoE + 路由 + 分布式集群，让"算力"从单一 GPU 扩展到整个数据中心级别。

## 十一、关键洞察

1. **2024 是 Test-Time Scaling 元年**（o1 发布）
2. **推理算力 = 新的 Scaling 维度**——与训练算力同等重要
3. **Snell 论文证明**——Test-Time Scaling 可预测
4. **DeepSeek-R1 证明开源可追平闭源**——GRPO + 蒸馏
5. **未来 = 训练算力 + 推理算力 联合优化**

落到工程实践上：**别再把预算全压在训练侧**——给推理侧留出独立预算、设计可调度的算力路由、把 Test-Time Scaling 当成产品功能而不是研究 demo，是接下来两年模型团队必须回答的命题。

## 模型版本说明

⚠️ 本文涉及的具体模型名称（OpenAI o1 / o1-preview / GPT-4o、DeepSeek-R1、Snell 等论文署名模型）以及对应版本、价格、性能数据，**均以发布时（2024-2025）的公开资料为准**。读者在引用时，建议自行核验 OpenAI、DeepMind、DeepSeek 官方在 2026 年 10 月之后的最新版本说明——这些模型的产品形态、定价、可用 API 都可能已经迭代多次。

## 必读论文

### 核心 3 篇

1. **Snell et al. 2024《Scaling LLM Test-Time Compute》⭐⭐⭐**
2. **OpenAI 2024-09《o1 / Learning to Reason》⭐⭐⭐**
3. **DeepSeek 2025《R1》⭐⭐⭐**

### 进阶 2 篇

4. **Lightman et al. 2023《Let's Verify Step by Step》**
5. **Kaplan et al. 2020《Scaling Laws》**

### 工业 1 篇

6. **Hoffmann et al. 2022《Chinchilla》**