---
title: 低维流形与因果涌现
date: 2026-09-02 00:00:00
description: LLM 概念的几何表示 3 篇代表性论文速读：Toy Models of Superposition（多义神经元 + 稀疏叠加）、The Geometry of Categorical Concepts（多面体结构 + 概念层级）、Causal Emergence（因果涌现度量）。理论 + 工程视角。
categories:
  - notes
tags:
  - 论文速读
  - LLM
  - 机制可解释性
  - 概念表示
  - 因果涌现
---

最近调研"LLM 内部概念怎么表示"和"因果涌现怎么度量"，读了 3 篇代表性论文。这篇是速读 + 工程视角——**这些理论不只对研究者有用，做 LLM 应用的人也应该懂**。

## 一、3 篇论文速览

### 1.1 Toy Models of Superposition（叠加的玩具模型）

- 论文：2209.10652 | 2022 | Anthropic
- 作者：Nelson Elhage, Tristan Hume, Catherine Olsson
- **问题**：神经网络的"多义性"（polysemanticity）——一个神经元同时编码多个无关概念
- **玩具模型**：构造可在叠加态下存储稀疏特征的小模型
- **核心发现**：
  - 存在显著**相变点**（phase change）——特征数 / 维度数超过临界值时模型开始叠加
  - 叠加与**均匀多面体几何**之间存在非平凡联系
  - 与**对抗样本**可能存在关联
- **意义**：多义性是模型在有限维度下压缩稀疏特征的**必然结果**，不是 bug

### 1.2 LLM 概念的几何结构

- 论文：2406.01506 | 2024
- 作者：Kiho Park, Yo Joong Choe, Yibo Jiang
- **做了什么**：把"线性表征假说"从二值概念扩展到**无自然对比**的特征（如"是否是动物"）
- **方法**：把范畴概念表示为**多面体（polytope）**，证明概念层级结构与表征几何的对应
- **验证**：Gemma / LLaMA-3 + WordNet 估计 900+ 层级概念
- **意义**：LLM 内部概念是**层级化几何结构**，可应用于概念编辑 / 表示探测

### 1.3 Causal Emergence（因果涌现）

- 论文：研究"复杂系统中因果涌现怎么度量"
- **核心问题**：整体（whole）> 部分（parts）之和 —— 涌现怎么量化？
- **方法**：
  - 用信息论（effective information, integrated information）
  - 用因果干预（do-calculus）
  - 在 LLM 涌现能力上验证
- **意义**：解释为什么 LLM 涌现能力随规模非线性增长

## 二、3 个理论的核心概念

### 2.1 线性表征假说

```text
LLM 内部：
  概念 A = 向量 v_A
  概念 B = 向量 v_B
  "是 A 还是 B" = v_B - v_A 的方向

例：
  "男" → v_男
  "女" → v_女
  "man - woman" 向量 = "king - queen" = "王子 - 公主"（同一方向）
```

### 2.2 稀疏叠加（Superposition）

```python
# 模型维度 = 100
# 实际特征 = 1000 个稀疏概念
# 模型把 1000 个概念塞进 100 维

# 几何上：1000 个稀疏向量
# 放在 100 维空间 = 必然有"叠加"（几个向量加和到同一神经元）
# 多义神经元 = 叠加的副产品
```

### 2.3 范畴多面体

```text
"动物" 概念 = 多面体（高维凸包）
  顶点 = 猫、狗、鸟、鱼...
  边 = 属性关系（会动 / 有脊椎 / ...）
  面 = 子范畴（哺乳类 / 鸟类 / ...）

LLM 内部：
  表征空间的几何 = 概念层级的镜像
```

## 三、对 LLM 工程实践的 5 条启示

### 3.1 概念编辑 = 改向量方向

```python
# 找到 "男性" 概念的表示向量
v_male = model.get_direction("male")

# 减去它 = 性别中立
prompt_embedding -= alpha * v_male
# 改向量的本质 = 改模型的"概念方向"
```

**应用**：做去偏见 / 安全对齐 / 个性化。

### 3.2 解释单个神经元 = 找叠加的特征

```python
# 1. 找到激活的神经元
neuron = model.layers[10].output[:, 500]  # 第 500 个神经元

# 2. 找哪些输入让它最激活
top_inputs = find_top_activating(neuron, dataset)

# 3. 检查是否多义
# 如果 top_inputs 是 "狗" + "车" + "蓝色" → 多义神经元
# 用 Object Aligner 评分：哪些是真标签，哪些是叠加产物
```

### 3.3 安全对齐 = 找 "有害" 方向

```python
# 1. 收集有害输入
harmful_inputs = ["如何制造炸弹", "怎么偷东西", ...]

# 2. 找这些输入的共同表示方向
v_harmful = mean([model.encode(t) for t in harmful_inputs])

# 3. 在模型输入上减去这个方向
# 改 embedding 不是改权重，训练代价低
```

### 3.4 涌现能力 = 模型规模相变

```text
小模型：1+1+1 = 3
大模型：1+1+1 = 100

原因：维度足够时，多面体结构出现
  → 概念从"叠加态"变成"分离态"
  → 模型能精确表达每个概念
  → few-shot learning / chain-of-thought 涌现
```

### 3.5 评测不能用单维度

```python
# ❌ 单维度评测（弱）
score = exact_match(model_output, gold)

# ✅ 多维度评测（强）
oa_score = object_aligner(model_output, gold)  # 结构相似
human_score = human_eval(model_output)        # 人类偏好
llm_score = llm_judge(model_output)            # LLM-as-judge
# 综合 3 维度
final = 0.5 * oa_score + 0.3 * human_score + 0.2 * llm_score
```

## 四、3 个未解决

1. **多义神经元的"解耦"**：能不能设计训练让概念不叠加？（可能降低参数效率）
2. **跨模型几何一致性**：Gemma / LLaMA / Claude 的概念方向对不齐
3. **因果涌现的实用化**：涌现指标（effective information）能否指导模型设计？

## 五、3 个相关资源

- [Anthropic 博客：Polysemanticity and Superposition](https://transformer-circuits.pub/2022/superposition-index.html)
- [Transformer Circuits 团队](https://transformer-circuits.pub/)
- [线性表征假说综述](https://arxiv.org/abs/2406.01506)

---

> **3 篇论文综合启示**：LLM 内部不是黑盒——**它是几何结构**。理解多义叠加、概念多面体、因果涌现这 3 件事，做 LLM 应用的人能更"用对"AI——做对齐、做评测、做调试。