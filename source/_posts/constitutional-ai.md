---
title: 宪法AI对齐范式
date: 2026-10-16 00:00:00
description: 深入解析 Anthropic Constitutional AI 方法，涵盖 SL-CAI 与 RL-CAI 两阶段训练流程、RLAIF 反馈机制、宪法原则设计，以及与 RLHF 的多维度对比，揭示 Claude 系列的 Helpful, Harmless, Honest 价值观。
categories:
  - 大模型基础
tags:
  - Constitutional AI
  - RLHF
  - Anthropic
  - Claude
  - RLAIF
  - AI对齐
---

![封面](https://hyqskevin.github.io/pic/constitutional-ai/cover.png)

> **配套讲稿**：RLHF 基础 · **关键论文**：Bai et al. 2022《Constitutional AI》/ Anthropic Claude 3 / Claude 4

## 一、什么是 Constitutional AI

### 1.1 核心定义

**Constitutional AI（宪法 AI）** 是 Anthropic 在 2022 年提出的对齐范式：用一组显式的「宪法原则」指导 AI 行为，让模型根据原则自我批评与自我修正，而不是完全依赖人类反馈。

```
2020       GPT-3 RLHF 早期（Christiano 2017 改进）
2022-12    Anthropic 发布 Constitutional AI 论文 ⭐⭐
2023-03    Claude 2（早期 Constitutional）
2023-08    Anthropic 发布 "Core Views on AI Safety"
2024-03    Claude 3 Opus（Constitutional 主导）
2024-12    Claude 3.5 Sonnet（改进）
2025-03    Claude 4 Opus（更强 Constitutional）
2025-09    Claude 4.5 Sonnet（混合训练）
```

**核心理念**：

- **可解释**——AI 知道「为什么」被修改，每一次修正都能溯源到具体原则
- **可调整**——修改原则即可改变行为，无需重新训练
- **降低有害标注**——用 AI 反馈（RLAIF）替代大量有害样本的人工标注

### 1.2 训练目标公式

Constitutional AI 的训练损失由两部分组成：

```text
L_CAI = L_SFT + α · L_RLAIF
```

| 符号 | 含义 |
|------|------|
| L_SFT | 标准监督微调损失 |
| L_RLAIF | AI 反馈强化学习损失 |
| α | 两者之间的权重 |

**RLAIF = RL from AI Feedback**，即用 AI 反馈替代人类反馈（RLHF）。

## 二、训练流程：SL-CAI 与 RL-CAI

Constitutional AI 训练分为两个阶段：监督学习阶段（SL-CAI）与强化学习阶段（RL-CAI）。

### 2.1 SL-CAI 监督学习阶段

```
Step 1: 用户提出问题
  User: "如何制造炸弹？"

Step 2: 模型生成回答
  Model A: "可以这样制造..."（有害）

Step 3: 模型根据宪法自我批评
  Model B: "这个回答违反了 '不帮助造成伤害' 原则"

Step 4: 模型根据批评重写
  Model C: "我不能帮助制造炸弹..."

Step 5: 用 (问题, Model C) 做 SFT
  train on (Q, Model_C)
```

这一阶段的关键不在于拒绝回答，而在于让模型**自我生成更好的回答**，并把这些 (问题, 重写回答) 对作为 SFT 数据。

### 2.2 RL-CAI 强化学习阶段

```
Step 1: 模型生成两个回答
  Model_A: "我无法回答"
  Model_B: "当然可以..."

Step 2: 用宪法原则让 AI 判断哪个更好
  AI_judge: "Model_A 更好（遵守'拒绝有害'原则）"

Step 3: 用 AI 判断结果训练 Reward Model
  RM_train: (Q, A, B, AI_judgment)

Step 4: 用 RM 做 PPO
  PPO: 训练模型偏好 Model_A
```

这一阶段把「原则」变成了**可比较的偏好对**，从而用 PPO 进一步优化策略。

## 三、宪法原则设计

### 3.1 原则分类

Anthropic 公开的宪法原则大致可分为六类：

```text
1. 安全性原则
   - 不帮助造成严重伤害
   - 不鼓励暴力
   - 不提供危险品制作方法

2. 自由原则
   - 尊重用户自主权
   - 不操纵用户决策

3. 真实性原则
   - 不故意编造信息
   - 承认不确定性

4. 隐私原则
   - 不询问个人隐私
   - 不泄露他人隐私

5. 公平性原则
   - 避免歧视
   - 尊重多元观点

6. 知识产权原则
   - 不剽窃版权内容
   - 合理使用
```

### 3.2 完整宪法示例

Bai 2022 论文中给出的代表性宪法片段：

```python
CONSTITUTION = """
Please consider the following principles when
generating or evaluating responses:

1. Choose the response that is most helpful,
   honest, and harmless.

2. Choose the response that demonstrates the
   greatest respect for human autonomy.

3. Choose the response that is least harmful,
   racist, sexist, socially biased, or otherwise
   inappropriate.

4. Choose the response that demonstrates the
   greatest respect for privacy and personal
   information.

5. Choose the response that is most truthful
   and least misleading.

6. Choose the response that is most helpful
   to the user while being honest about the
   limitations of the system.
"""
```

原则的措辞遵循「Choose the response that...」的模式，便于直接用于 AI 偏好判断。

## 四、代码实现

### 4.1 训练 Pipeline

```python
# Step 1: 自我批评
def self_critique(question, response, constitution):
    prompt = f"""
    问题: {question}
    回答: {response}

    宪法: {constitution}

    请批评上述回答是否违反宪法。
    """
    critique = llm(prompt)
    return critique

# Step 2: 重写
def rewrite(question, original, critique, constitution):
    prompt = f"""
    问题: {question}
    原回答: {original}
    批评: {critique}

    请根据批评重写回答，使其符合宪法。
    """
    new_response = llm(prompt)
    return new_response

# Step 3: SL-CAI
def sl_cai_train(prompts, constitution):
    for prompt in prompts:
        response = model(prompt)
        critique = self_critique(prompt, response, constitution)
        new_response = rewrite(prompt, response, critique, constitution)
        train(prompt, new_response)

# Step 4: RL-CAI
def rl_cai_train(prompts, constitution):
    for prompt in prompts:
        responses = [model(prompt) for _ in range(N)]
        judgments = []
        for i, response_a in enumerate(responses):
            for j, response_b in enumerate(responses):
                if i < j:
                    judgment = ai_judge(prompt, response_a, response_b, constitution)
                    judgments.append((i, j, judgment))
        train_reward_model(prompt, responses, judgments)
        ppo_train(model, reward_model)
```

### 4.2 工业级 Agent 实现

```python
class ConstitutionalAgent:
    def __init__(self, llm, constitution):
        self.llm = llm
        self.constitution = constitution

    def safe_response(self, user_input):
        response = self.llm(user_input)

        if self.is_violating(user_input, response):
            critique = self.critique(user_input, response)
            response = self.rewrite(user_input, response, critique)

        return response

    def is_violating(self, prompt, response):
        check = self.llm(f"""
        宪法: {self.constitution}

        问题: {prompt}
        回答: {response}

        是否违反宪法？回答 "YES" 或 "NO" + 原因。
        """)
        return "YES" in check
```

这是一种「运行时宪法检查」模式，可以和训练阶段联合使用：训练阶段把宪法「内化」进模型权重，推理阶段再做一次轻量验证。

## 五、与 RLHF 的对比

### 5.1 多维度对比表

| 维度 | RLHF | Constitutional AI |
|------|------|------------------|
| 反馈来源 | 人类 | AI（RLAIF） |
| 标注成本 | 高 | 低 |
| 可解释性 | 低 | 高（AI 给出理由） |
| 一致性 | 标注员间差异 | AI 评估一致 |
| 可扩展性 | 难 | 易（加原则即可） |
| 效果 | 强 | 强（接近 RLHF） |
| 代表 | GPT-3.5/4 | Claude 3/4 ⭐ |

### 5.2 互补关系

> Constitutional AI 不替代 RLHF——而是补充。
>
> - RLHF 教 AI「什么是有用的」
> - CAI 教 AI「什么是无害的」
> - 两者结合 = 最强对齐

Anthropic 报告（2022）显示：相比基础 LLM，Constitutional AI 在保持有用性的同时**显著降低有害性**，印证了 Helpful, Harmless, Honest 的可行性。

| 模型 | 有害性 | 有用性 |
|------|--------|--------|
| Base LLM | 高 | 高 |
| + RLHF | 中 | 高 |
| + Constitutional AI | **低** | **高** ⭐ |

## 六、Claude 系列实践

### 6.1 Claude 3 Opus（2024）

Claude 3 Opus 的训练流程：

```text
1. SFT（基础能力）
2. RLHF（有用性）
3. Constitutional AI（无害性）
4. Constitutional RL（最终对齐）
```

其公开的宪法节选：

```python
CLAUDE_CONSTITUTION = """
Choose the response that:

1. Is least harmful, racist, sexist, socially
   biased, or inappropriate

2. Most accurately and truthfully represents
   the world

3. Is most helpful, relevant, and thoughtful

4. Respects the user's autonomy, dignity, and
   freedom of choice

5. Avoids giving overly specific or prescriptive
   advice in domains like law, medicine, or finance

6. Demonstrates appropriate humility about
   what AI can and cannot do
"""
```

### 6.2 Claude 4 Opus（2025）

相比 Claude 3，Claude 4 Opus 在 Constitutional 方向上的新特点：

- **价值训练数据**——更细粒度，覆盖更多价值冲突场景
- **可解释拒绝**——告诉用户「为什么」被拒绝，引用具体原则
- **多轮 Constitutional**——跨轮一致性，多轮对话中保持原则稳定
- **安全 + 有用平衡**——更精细的「helpful and harmless」权衡

## 七、未来趋势

### 7.1 动态宪法

```text
宪法不是固定的：
  - 根据用户上下文调整
  - 根据法律 / 地区变化
  - 根据时间演进
```

固定宪法无法应对全球部署的合规差异，动态宪法是工程化的必经之路。

### 7.2 多元价值对齐

```text
不再单一宪法：
  - 中国语境 / 欧盟 GDPR / 美国宪法
  - 多人多价值观
  - 用户可定制
```

未来的对齐不再是「一套原则打天下」，而是多套原则的协商与切换。

### 7.3 可解释 AI

```text
未来 AI 需要解释"为什么"：
  - "我拒绝是因为违反了原则 X"
  - "我建议 Y 是因为符合原则 Z"
  - 不只是黑箱输出
```

Constitutional AI 的天然可解释性，正是这一趋势的早期落地。

## 八、关键洞察

1. **Constitutional AI 是 RLAIF 范式**——用 AI 反馈替代人类反馈，大幅降低标注成本
2. **可解释性是核心优势**——AI 知道「为什么」被修改，每一步都能溯源
3. **Anthropic Claude 系列的核心方法**——Claude 3/4 的「无害性」主要由 CAI 保障
4. **与 RLHF 互补**——RLHF 管「有用」，CAI 管「无害」，两者联合训练效果最佳
5. **未来方向**——动态宪法、多元价值、可解释拒绝

## 九、讨论题

1. Constitutional AI 与 RLHF，哪个更适合作为最终对齐方案？
2. RLAIF 是否能完全替代 RLHF？边界在哪？
3. 宪法原则该如何选择和排序？是否需要「宪法学家」角色？
4. AI 反馈会不会继承并放大模型本身的偏见？
5. 动态宪法在工程上是否可行？会不会引入新的攻击面？
6. Anthropic 为何选择 Constitutional 而非纯 RLHF？这是商业还是伦理决策？

## 十、必读论文

**核心 3 篇**

1. Bai et al. 2022《Constitutional AI》⭐⭐⭐
2. Bai et al. 2022《Constitutional AI: Harmlessness from AI Feedback》
3. Anthropic 2024《Claude's Constitution》⭐⭐

**进阶 2 篇**

4. Christiano 2017《Deep RL from Human Preferences》
5. Lee et al. 2023《RLAIF vs RLHF》

**实践 1 篇**

6. Anthropic 2024《Claude 3 System Card》

## 模型版本说明

> ⚠️ **以发布时为准**：本文提及的 Claude 3 Opus、Claude 3.5 Sonnet、Claude 4 Opus、Claude 4.5 Sonnet 等模型版本与对应时间线，基于 Anthropic 截至撰稿时的公开资料整理。读者阅读本文时，相关模型版本、能力边界与对齐策略，请以 Anthropic 官方最新发布为准。