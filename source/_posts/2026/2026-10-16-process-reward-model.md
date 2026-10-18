---
title: PRM 过程奖励模型解读
date: 2026-10-16 00:00:00
description: PRM（过程奖励模型）是 OpenAI o1 的核心技术之一。本文对比 ORM 与 PRM 的差异，详解蒙特卡洛估计训练法、Best-of-N 与树搜索推理策略，并给出可运行的 PyTorch 实现代码。
categories:
  - 大模型基础
tags:
  - PRM
  - 过程奖励模型
  - RLHF
  - 推理模型
  - OpenAI o1
  - DeepSeek R1
  - 蒙特卡洛估计
---

> 配套讲稿：RLHF 基础
> 关键论文：Lightman et al. 2023《Let's Verify Step by Step》/ OpenAI o1

2024 年 9 月 OpenAI 发布 o1 后，AIME 2024 上的数学题准确率从 13% 一跃到 70%+，关键创新不是更大的模型，而是**过程奖励模型（PRM, Process Reward Model）**。本文系统拆解 PRM 的原理、训练、推理与实战代码。

## 一、ORM vs PRM：奖励粒度的革命

### 1.1 两种范式

**ORM（Outcome Reward Model）**：传统做法。输入完整答案，输出一个 0-1 分数，判断"结果对不对"。

**PRM（Process Reward Model）**：新做法。输入每一步推理，输出该步的 0-1 分数，判断"这步对不对"。

### 1.2 核心差异

举个数学题的例子：解方程 $x^2 - 5x + 6 = 0$，5 步推理里 4 步对、最终答案错。ORM 给 0 分，模型完全不知道为什么错；PRM 给出 4 步高分 + 1 步低分，模型能精确定位错误。

| 维度 | ORM | PRM |
|------|-----|-----|
| 评估粒度 | 整个答案 | 每一步 |
| 奖励密度 | 稀疏 | 密集 |
| 训练数据 | 易获取 | 难（需逐步标注） |
| 推理效果 | 一般 | 显著更好 |
| 训练成本 | 低 | 高 |

## 二、PRM 训练数据：如何给每步打分

### 2.1 数据形式

训练数据按"问题 + 步骤序列"组织，每一步带 0/1 标签：

```json
{
  "problem": "解方程 x^2 - 5x + 6 = 0",
  "steps": [
    {"step_number": 1, "content": "原方程 x^2 - 5x + 6 = 0", "label": "correct"},
    {"step_number": 2, "content": "分解 (x-2)(x-3) = 0", "label": "correct"},
    {"step_number": 3, "content": "x = 2 或 x = 3", "label": "correct"}
  ]
}
```

### 2.2 数据来源

**人工标注**：雇佣数学专家逐题判断。质量高，但 1 个问题平均 5 分钟，10K 问题要 35 天（单人）。

**蒙特卡洛估计（OpenAI 主流方案）**：完全自动生成。流程如下：

1. 取问题 + 第 $k$ 步
2. 从第 $k$ 步开始，让 LLM 完成剩余步骤
3. 跑 $N$ 次（$N=16$ 或 $100$）
4. 统计"完成正确率"

核心洞察：**蒙特卡洛估计回答了"如果从这里继续，最终能答对吗？"** 这是 OpenAI 训练 PRM 的核心技术。

### 2.3 关键公式

**公式 1 · 蒙特卡洛 PRM 估计**：

$$
\text{PRM}(s_k) = \frac{\text{次数：}s_k \text{后能答对}}{\text{总次数}}
$$

**公式 2 · PRM 训练损失（二元交叉熵）**：

$$
L_{\text{PRM}} = -\sum_{k} \left[ y_k \log p_\theta(s_k) + (1 - y_k) \log(1 - p_\theta(s_k)) \right]
$$

其中 $y_k$ 是蒙特卡洛估计的"正确"概率，$p_\theta(s_k)$ 是 PRM 预测的概率。

## 三、PRM 推理时使用

### 3.1 Best-of-N 采样

最直接的使用方式：采样 N 个候选，用 PRM 给每个候选的每步打分，选总分最高的：

```python
For problem in problems:
    candidates = []
    for i in range(N):
        response = llm(problem)
        candidates.append(response)

    best_score = -inf
    best_response = None
    for response in candidates:
        score = 0
        for step in response.steps:
            score += prm(step)
        if score > best_score:
            best_score = score
            best_response = response

    return best_response
```

效果对照：在 AIME 题目上，GPT-4 (ORM) 准确率 70%，加上 PRM Best-of-N 后达到 85%，相当于 16x 推理开销换 15 个百分点。

### 3.2 树搜索（Beam Search + PRM）

PRM 还能引导生成过程本身：

1. 生成第 1 步 → 多个候选 → PRM 评分
2. 保留 top-K 步（按 PRM 分数）
3. 对每个 top-K 步生成第 2 步 → 多个候选 → PRM 评分
4. 累计分数排序，循环直到完成

**MCTS + PRM** 是更激进的方案——用蒙特卡洛树搜索 + PRM 引导，UCB 选择、扩展、模拟、回溯四步走，在数学竞赛题上效果最好但计算开销也最大。

## 四、训练公式汇总

### 4.1 PRM + RL 联合训练

完整训练目标：

$$
L = L_{\text{policy}} + \lambda \cdot L_{\text{PRM}} + \mu \cdot L_{\text{ORM}}
$$

三个损失项：策略学习（生成好答案）+ PRM（评估过程）+ ORM（评估结果），权重 $\lambda, \mu$ 控制平衡。

### 4.2 PRM 准确率

$$
\text{Acc}_{\text{PRM}} = \frac{\text{正确标注步数}}{\text{总步数}}
$$

经验目标：> 70% 的步骤判断正确。

### 4.3 PRM 引导搜索分数

$$
\text{Score}_{\text{response}} = \prod_{k=1}^{K} \text{PRM}(s_k)
$$

所有步骤的 PRM 分数乘积作为候选答案的总评分。

## 五、实际挑战

### 5.1 标注数据稀缺

人工逐步标注代价高昂（10K 问题 = 35 天单人工作量），主流解法：

- **蒙特卡洛自动生成**：无需人工，覆盖率最高
- **自训练**：用当前 PRM 标 → 训练新 PRM → 再标注，迭代改进
- **大模型辅助**：用 GPT-4 类强模型预标注，再人工校验

### 5.2 Reward Hacking

Student 可能学会"骗 PRM"——写看似正确但实际错误的步骤拿高分，最终答案却错。解法：

- **PRM + ORM 联合训练**（双保险）
- **对抗训练**（专门制造混淆步骤让 PRM 学）
- **人类定期审查** PRM 输出

### 5.3 任务迁移

PRM 在数学上训练，迁移到代码、科学问题时效果可能下降。解法：多任务训练 + 跨任务 PRM 蒸馏。

## 六、o1 vs R1 路径对比

### 6.1 OpenAI o1：PRM 主导

关键假设：PRM 是 o1 成功的核心。

- 蒙特卡洛估计训练 PRM
- 推理时 PRM 引导搜索
- 每步评估 → 准确率大幅提升

### 6.2 DeepSeek-R1：GRPO + 隐式 PRM

关键洞察：**不需要显式 PRM**。

- 组内相对优势（GRPO）= 隐式 PRM
- 每个问题的多个采样 → 组内相对好坏
- 简单有效，无需 PRM

### 6.3 对比

| 维度 | o1 | R1 |
|------|-----|-----|
| PRM | 显式 | 隐式（GRPO） |
| 训练复杂度 | 高（蒙特卡洛） | 低（组内比较） |
| 推理效果 | 强 | 接近 |
| 训练成本 | 高 | 低 |
| 开源 | ❌ | ✅ |

R1 的 GRPO 实现了"无显式 PRM"的等价效果，是开源推理模型的关键突破。

## 七、实战：训练简单 PRM

下面给出一个可运行的 PyTorch 实现：

```python
import torch
import torch.nn as nn
import torch.nn.functional as F


class SimplePRM(nn.Module):
    """过程奖励模型"""

    def __init__(self, base_model, hidden_dim=4096):
        super().__init__()
        self.base_model = base_model
        self.reward_head = nn.Linear(hidden_dim, 1)

    def forward(self, input_ids, attention_mask):
        # 1. 编码
        outputs = self.base_model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            output_hidden_states=True,
        )
        hidden = outputs.hidden_states[-1]  # (B, T, D)

        # 2. 对每步预测奖励
        rewards = self.reward_head(hidden).squeeze(-1)  # (B, T)

        # 3. 只在步骤结束位置评估
        #    （实际需要标注 step boundary）
        return rewards


# 训练
prm = SimplePRM(base_model=llm, hidden_dim=4096)
optimizer = torch.optim.AdamW(prm.parameters(), lr=1e-5)

for batch in dataloader:
    # batch: {input_ids, step_labels}
    # step_labels: 每步的 0/1 标签（蒙特卡洛估计）

    rewards = prm(batch.input_ids, batch.attention_mask)

    # 损失
    loss = F.binary_cross_entropy_with_logits(
        rewards[batch.step_mask],
        batch.step_labels[batch.step_mask].float(),
    )

    loss.backward()
    optimizer.step()
```

工业级实现还需要：步骤边界检测、负样本挖掘、PRM-ORM 联合 loss、Reward Hacking 检测。

## 八、关键洞察

1. **PRM 是 o1 成功的关键**——逐步奖励 vs 结果奖励，是奖励粒度的范式转变
2. **蒙特卡洛估计**是 PRM 训练数据的主要来源，让自动标注成为可能
3. **PRM 引导搜索**显著提升推理准确率（Best-of-N 即可拿到 15 个百分点）
4. **R1 的 GRPO**是 PRM 的轻量级替代，组内比较替代逐步评分
5. **PRM 数据是稀缺资源**——蒙特卡洛自动生成是当下主流方案
6. **未来方向**——PRM + GRPO + 多任务融合

## 九、思考题

1. PRM vs ORM 哪个更有效？为什么奖励密度比奖励准确率更重要？
2. 蒙特卡洛估计的 $N$ 取多少合适？$N$ 与 PRM 质量、计算成本的关系曲线如何？
3. PRM 如何避免 Reward Hacking？联合 ORM 训练的边界条件是什么？
4. PRM 训练数据怎么获得？小样本场景下还能用吗？
5. PRM 在非数学任务（代码 / 科学问答）上有效吗？迁移瓶颈在哪？
6. R1 的 GRPO 是否取代了 PRM？两种路线的长期演化方向是什么？

## 十、必读论文

**核心 3 篇**

1. Lightman et al. 2023《Let's Verify Step by Step》
2. OpenAI 2024《Learning to Reason with Language Models》（o1）
3. Shao et al. 2024《DeepSeekMath: GRPO》

**进阶 2 篇**

4. Hinton 2015《Distillation》
5. Uesato et al. 2022《Solving Math Word Problems with Process-based Supervision》

**历史 1 篇**

6. Christiano 2017《Deep RL from Human Preferences》

---

## ⚠️ 模型版本说明

文中提及的模型与时间节点（GPT-4、OpenAI o1 / o3 / o3-mini、DeepSeek-R1、Claude 4 等）以各厂商**发布时**的官方信息为准。随着推理模型迭代加速（2024-09 o1 → 2024-12 o3 → 2025-01 DeepSeek-R1 → 2025-03 Claude 4 → 2025-08 PRM 成为推理模型标配），具体版本号、参数规模、训练数据可能已有更新；本文阐述的是 PRM 技术的核心原理与方法论，模型版本细节请以发布时的官方文档为准。
