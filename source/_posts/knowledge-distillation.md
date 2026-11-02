---
title: 知识蒸馏从R1到工业
date: 2026-10-16 00:00:00
description: 系统梳理知识蒸馏的核心原理与工业实践：从 Hinton 2015 的暗知识与软标签出发，到 DeepSeek-R1 的推理能力下放，结合 4 大蒸馏范式、Capacity Gap 等关键挑战，帮你理解为什么小模型也能超越大模型。
categories:
  - 大模型基础
tags:
  - 知识蒸馏
  - 模型压缩
  - DeepSeek-R1
  - 暗知识
  - 推理能力
  - PEFT
---

![封面](https://hyqskevin.github.io/pic/knowledge-distillation/cover.png)

> **配套讲稿**：本系列 PEFT/LoRA 篇 · **关键论文**：Hinton 2015《Distilling the Knowledge》/ DeepSeek 2025《R1 Distillation》

## 一、什么是知识蒸馏

### 1.1 核心定义

> **知识蒸馏 = 用大模型（Teacher）的输出训练小模型（Student），让小模型继承大模型的能力。**

和传统监督学习不同，蒸馏过程中 Student 学的不只是「正确答案」，还包括 Teacher 对所有候选答案的「偏好分布」——也就是所谓的「暗知识」。

### 1.2 为什么需要蒸馏

| 原因 | 说明 |
|------|------|
| **部署成本** | 7B 模型比 70B 模型便宜约 10x |
| **推理延迟** | 7B 比 70B 推理快约 10x |
| **端侧设备** | 手机/边缘设备只能跑 1-4B 模型 |
| **能耗** | 同任务下能耗降低 10-100x |

### 1.3 蒸馏 vs 微调

| 维度 | 微调（SFT） | 蒸馏 |
|------|----------|------|
| **目标** | 学会任务 | 模仿 Teacher |
| **数据** | 人工标注 | Teacher 生成的软标签 |
| **效果上限** | 受限于任务标注质量 | 受限于 Teacher 能力 |

简言之：**微调让模型「会做」，蒸馏让模型「像 Teacher 那样做」**。

---

## 二、Hinton 2015 经典蒸馏

### 2.1 蒸馏损失公式

$$
L = \alpha \cdot L_{\text{soft}} + (1 - \alpha) \cdot L_{\text{hard}}
$$

| 符号 | 含义 | 典型值 |
|------|------|--------|
| $L_{\text{soft}}$ | 软标签损失（Teacher logits） | — |
| $L_{\text{hard}}$ | 硬标签损失（真实标签） | — |
| $\alpha$ | 软标签权重 | 0.7 – 0.9 |

软标签本质是 Teacher 输出概率分布与 Student 输出概率分布之间的 KL 散度。

### 2.2 软标签与温度

软标签 $q_i$ 由温度 $T$ 调节：

$$
q_i = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}
$$

| 符号 | 含义 | 典型值 |
|------|------|--------|
| $z_i$ | Teacher 的 logit | — |
| $T$ | 温度 | 3 – 20 |

```
Teacher 对"猫 vs 狗 vs 虎"：
  - 硬标签：    猫（仅 1.0）
  - 软标签 T=1：猫 0.6, 狗 0.3, 虎 0.1
  - 软标签 T=10：猫 0.4, 狗 0.35, 虎 0.25   ← 更"软"
```

### 2.3 暗知识

> 高温 $T$ 让概率分布更「软」——暴露 Teacher 的「暗知识」（dark knowledge）。

直觉上，Teacher 知道「虎比狗更像猫」——软标签暴露这种类别间的相似性关系。Student 直接学习软标签，等于继承了 Teacher 的「推理过程」，而不仅是最终答案。

---

## 三、蒸馏的 4 大范式

### 3.1 Logit Distillation（输出层蒸馏）

```python
# Teacher 前向（不计算梯度）
with torch.no_grad():
    teacher_logits = teacher(input_ids)  # (B, T, V)

# Student 前向
student_logits = student(input_ids)    # (B, T, V)

# 蒸馏损失
soft_loss = F.kl_div(
    F.log_softmax(student_logits / T, dim=-1),
    F.softmax(teacher_logits / T, dim=-1),
    reduction='batchmean'
) * (T ** 2)

hard_loss = F.cross_entropy(
    student_logits.view(-1, V),
    labels.view(-1)
)

loss = α * soft_loss + (1 - α) * hard_loss
```

适用场景：同任务、同 vocabulary——最经典范式。

### 3.2 Feature Distillation（中间层蒸馏）

```python
# 中间层蒸馏
def feature_loss(student_features, teacher_features):
    # 1x1 conv 对齐维度
    s = align_conv(student_features)
    t = teacher_features
    return F.mse_loss(s, t)
```

适用场景：Teacher 与 Student 同为 Transformer；隐藏层维度不同时需要投影层对齐。

### 3.3 Data-Free Distillation（无数据蒸馏）

```text
无训练数据时：
  - 用随机噪声作为输入
  - 蒸馏 Teacher 在噪声上的输出
  - 类似 GAN 的"合成数据"
```

适用场景：数据隐私要求严、训练数据不可获取的情况。

### 3.4 Self-Distillation（自蒸馏）

```text
Teacher = Student（同一模型），不同时间点：
  - Step 1：训练 Student v1
  - Step 2：Student v1 自己当 Teacher
  - Step 3：用 v1 的输出训练 Student v2

效果：Student v2 比 v1 更好（自提升）
```

这是当前 Self-Improvement 趋势的雏形。

---

## 四、DeepSeek-R1 蒸馏实战

### 4.1 R1 蒸馏到 Qwen / Llama

**背景**：DeepSeek-R1（671B MoE）开源，但 R1 太大无法本地部署，需要把推理能力下放到小模型。

**蒸馏流程**：

```python
# Step 1: R1 生成训练数据
training_data = []
for prompt in seed_prompts:  # 800K 样本
    response = deepseek_r1.generate(
        prompt,
        # 关键：让 R1 输出"思考过程"
        include_reasoning=True
    )
    training_data.append({
        "prompt": prompt,
        "response": response
    })

# Step 2: 用 R1 数据 SFT 小模型
model = QwenForCausalLM.from_pretrained("Qwen-7B")
trainer = SFTTrainer(model, training_data)
trainer.train(
    data=training_data,  # 800K
    epochs=3
)
```

### 4.2 蒸馏效果对比

| 模型 | AIME 2024 | MATH-500 | GPQA Diamond |
|------|-----------|----------|--------------|
| Qwen-7B（base） | 16% | 46% | 35% |
| **Qwen-7B + R1 蒸馏** | **55%** ⭐ | **83%** | **49%** |
| Qwen-32B + R1 蒸馏 | 72% | 94% | 62% |

> **R1 的推理能力可以「蒸馏」到小模型——效果惊人。**
> **32B 蒸馏模型超过 o1-mini。**

### 4.3 蒸馏的「推理能力」是什么

```text
R1 生成的数据包含：
  - 思考过程（CoT）
  - 自我反思
  - 多步推理
  - 错误修正

Student 学会这些"思考模式"而不仅仅是最终答案
```

这是 R1 蒸馏与传统 SFT 的最大区别：**传承的是「怎么想」，不是「答什么」**。

---

## 五、蒸馏 vs RLHF 关系

### 5.1 DeepSeek-R1 三种训练方法对比

| 方法 | 数据 | 效果 |
|------|------|------|
| **RL on Base**（R1-Zero） | 仅 RL（无 SFT） | 涌现推理，但不稳定 |
| **RL + SFT**（R1） | SFT + RL 多阶段 | 最强 |
| **纯 SFT on R1**（蒸馏） | R1 生成 800K 数据 SFT | 强，训练稳定 |

> **纯 SFT 蒸馏就能获得 R1 的大部分推理能力——比纯 RL 更稳定。**
> **小模型 + 蒸馏 = 推理能力下放。**

RLHF 仍是对齐「价值观」的关键工具，而蒸馏负责对齐「能力与风格」。两者并不冲突，在工业实践中常常叠加使用。

---

## 六、工业蒸馏 Pipeline

### 6.1 完整流程

```text
Step 1: 数据准备
  ├─ 准备 seed prompts（10K-100K）
  └─ 多样性 / 难度分布

Step 2: Teacher 生成
  ├─ 调用 Teacher LLM
  ├─ 多 temperature 采样
  └─ 过滤低质量样本

Step 3: 数据增强
  ├─ CoT 显式推理
  ├─ 思考过程标注
  └─ 多语言翻译

Step 4: Student 训练
  ├─ 选合适 Student 架构
  ├─ SFT 阶段
  └─ (可选) DPO / RLHF 阶段

Step 5: 评估
  ├─ 与 Teacher 对比
  ├─ 多个 benchmark
  └─ 人类评估
```

### 6.2 蒸馏的 4 大挑战

**1. Capacity Gap**

```text
Teacher 70B  vs  Student 7B
容量差距大，Student 学不全
```

**解法**：
- 中间尺寸先蒸馏（70B → 13B → 7B）
- 只蒸馏关键能力（推理、数学）

**2. Mode Collapse**

```text
Student 只学 Teacher 的高频模式
忽略低频但重要的模式
```

**解法**：
- 高温 + 多 temperature 采样
- 数据增强
- 对抗训练

**3. Catastrophic Forgetting**

```text
Student 学新能力，忘掉旧能力
```

**解法**：
- 混合 SFT 数据
- EWC / LwF 正则
- 多任务学习

**4. Evaluation Gap**

```text
Student 在 benchmark 上接近 Teacher
但实际部署效果差
```

**解法**：
- 真实场景评估
- 人类评估
- A/B 测试

---

## 七、蒸馏的工程实践

### 7.1 选 Student 架构

```
推荐：
  7B   Student  ←  70B  Teacher（10x）
  13B  Student  ←  70B  Teacher（5x）
  70B  Student  ←  405B Teacher（6x）
不推荐：
  1B   Student  ←  70B  Teacher（70x） 容量差太大
  405B Student  ←  70B  Teacher  没意义
```

经验法则是 **容量比控制在 5-10x 以内**。

### 7.2 温度选择

```python
# 不同任务的推荐温度
temperature_map = {
    "classification": 1,    # 硬标签够了
    "generation":    4,     # 创造性
    "reasoning":     1,     # 推理要确定性
    "code":          1,     # 代码要精确
    "math":          1,     # 数学要精确
}
```

推理、代码、数学类任务对错误容忍度低，温度通常不开高；生成类任务可以适当提高温度来传递多样性。

### 7.3 数据量

```
最少：1K 样本
推荐：10K-100K 样本
上限：1M 样本
超过：边际收益递减
```

实际工业里 **「样本质量 > 数量」**，高质量 10K 往往比低质量 1M 更有效。

### 7.4 训练超参数

```python
# 蒸馏训练配置
training_args = TrainingArguments(
    num_train_epochs=3,
    per_device_train_batch_size=4,
    learning_rate=1e-5,         # 比 SFT 低
    warmup_ratio=0.1,
    weight_decay=0.01,
    bf16=True,
    temperature=4,              # 蒸馏温度
    alpha=0.7,                  # 软标签权重
)
```

蒸馏的学习率通常比纯 SFT 略低，避免 Student 偏离 Base 太远导致遗忘。

---

## 八、蒸馏 vs 量化

| 维度 | 蒸馏 | 量化 |
|------|------|------|
| **原理** | 用小模型学大模型 | 用低位表示原模型 |
| **架构** | 可以不同 | 必须相同 |
| **效果** | 可能更好 | 通常略差 |
| **速度** | 推理快（更小）| 推理快（更小）|
| **训练** | 需要训练 | 不需要训练 |
| **硬件** | 训练需要 GPU | 仅需量化工具 |

**配合使用**：

```text
70B Teacher
   ↓ 蒸馏
13B Student
   ↓ 量化
4-bit 13B（5GB）
```

蒸馏 + 量化可以叠加，实测压缩比可达 175x，是当前 70B → 消费级显卡部署的主路径。

---

## 九、未来蒸馏趋势

### 9.1 Self-Improvement 蒸馏

```text
Step 1: 模型 V1
Step 2: 用 V1 生成数据 → 训练 V2
Step 3: V2 优于 V1
Step 4: 用 V2 生成数据 → 训练 V3
...
```

意义在于「自提升循环」，避免对外部 Teacher 的依赖。

### 9.2 跨模态蒸馏

```text
Vision-Language Teacher
  ↓ 蒸馏
  ├─ Vision-only Student
  └─ Language-only Student
```

把多模态 Teacher 的能力分别下放到单模态 Student，是端侧多模态应用的关键。

### 9.3 推理能力蒸馏

```text
o1 / R1 Teacher（推理强）
  ↓ 蒸馏
小模型（推理能力下放）
```

这是 2025 年最关键的趋势——更多推理能力被「压缩」到小模型，让 70B 以下的模型也能拥有 o1 级推理。

---

## 模型版本说明

⚠️ **以发布时为准**

本文涉及的模型、论文与工程实践均以 **2026-10-16 发布日** 的事实状态为准，包括但不限于：

- **Hinton 2015《Distilling the Knowledge in a Neural Network》**——经典蒸馏开山论文。
- **DeepSeek-R1（2025-01）**——671B MoE 推理模型，其蒸馏技术报告中的 32B Qwen/Llama 蒸馏数据点为论文公开数值。
- **DeepSeek-V2.5（2024-08）**——蒸馏 Llama 3 的早期实践。
- **Anthropic Claude（2025）**——含蒸馏成分的对齐模型。
- **Llama 4（2025-03）**——含大量蒸馏数据的开源/半开源模型。
- **DistilBERT / MobileBERT / TinyBERT / FitNets / Born-Again Networks**——NLP 蒸馏里程碑。
- **o1-mini / Qwen 系列**——表中对比数字均为对应论文或公开 benchmark 的报告值。

后续模型迭代、benchmark 更新、训练范式演进可能影响文中结论，请以最新公开资料为准。

---

## 十、关键洞察

1. **Hinton 2015 经典论文**——知识蒸馏的开山，软标签 + 温度是核心 trick。
2. **暗知识（dark knowledge）**——Teacher 的「软标签」暴露类别间相似性，比硬标签信息量大得多。
3. **DeepSeek-R1 蒸馏**让 32B 模型超过 o1-mini，证明了「推理能力可下放」。
4. **纯 SFT 蒸馏**比纯 RL 更稳定，是当下小模型获取推理能力的事实标准路径。
5. **未来 = Self-Improvement + 跨模态 + 推理蒸馏**——大模型自我迭代 + 能力分发。

---

## 十一、思考题

- **Q1.** 为什么蒸馏有用？背后的理论基础是什么？
- **Q2.** 软标签和硬标签的区别？温度 $T$ 的作用？
- **Q3.** 蒸馏 vs 量化——业务场景下选哪个？能否叠加？
- **Q4.** Student 多大合适？Capacity Gap 如何控制？
- **Q5.** R1 蒸馏的「推理能力」具体是什么？传统 SFT 为什么做不到？
- **Q6.** 如何防止 Catastrophic Forgetting？EWC / LwF 在 LLM 时代还适用吗？

---

## 必读论文

- **核心 3 篇**
  - Hinton et al. 2015《Distilling the Knowledge in a Neural Network》⭐⭐⭐
  - DeepSeek 2025《R1 Distillation Technical Report》⭐⭐⭐
  - Sanh et al. 2019《DistilBERT》⭐⭐
- **进阶 2 篇**
  - Romero et al. 2015《FitNets》
  - Jiao et al. 2020《TinyBERT》
- **工程 1 篇**
  - Hugging Face 2024《Distillation Cookbook》

---

> **2025-01 关键节点**：DeepSeek 发布 R1 蒸馏技术报告，32B 蒸馏模型超过 o1-mini。这标志着「推理能力下放」成为开源 LLM 的关键路径——任何人都可以拥有 70B 以下的高性能推理模型。
