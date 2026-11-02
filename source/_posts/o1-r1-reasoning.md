---
title: o1 与 R1：推理时算力改写 LLM
date: 2026-10-16 00:00:00
updated: 2026-10-17 02:38:40
updated_from: <vault>/4-class/20260914-大模型基础讲解/00-第八幕-o1-R1推理/01-章节级PPT大纲.md
updated_note: 源稿 v2：课时结构 4 → 6（增 PRM 独立成节、Snell 论文独立讲解），并补入幕间过渡到第九幕的衔接句。
description: 从 GPT-4 在 AIME 上 13% 的尴尬，到 o1 的 70%+ 突破，OpenAI o1 与 DeepSeek-R1 在 2024-2025 年共同掀起了推理时算力（Test-Time Compute）的范式革命。本文按 6 课时脉络，拆解 Test-Time Compute、GRPO、PRM 过程奖励模型、Test-Time Scaling Law、Snell 2025 Scaling 演进与 MoE 在推理时代的演进路径。
categories:
  - 大模型基础
tags:
  - o1
  - DeepSeek-R1
  - GRPO
  - Test-Time-Compute
  - 推理时扩展
  - MoE
  - Scaling-Law
  - PRM
  - Process-Reward-Model
---

> 本文为「第八幕 o1-R1 推理」的章节级讲义整理，按 6 课时（180 分钟原 4 课时 + PRM / Snell 论文 2 个增补节）编排：第 1 课时讲 o1 与 Test-Time Compute；第 2 课时讲 GRPO 与 R1 自我反思；第 3 课时讲 PRM 过程奖励模型（o1 核心技术）；第 4 课时讲 Test-Time Scaling Law；第 5 课时讲 2025 Scaling 演进（Snell 论文）；第 6 课时讲 MoE 在推理时代的演进。

## 一、从「会说话」到「会推理」——一场静悄悄的范式转移

把 2022 年至今的大模型进展摊开来看，你会发现一件很有意思的事：LLM 已经同时解决了「会说话」和「会听话」，但直到 2024 年之前，它都还不太会「推理」。

一个直观的数字：GPT-4 在 AIME 2024（美国数学奥赛邀请赛）上的准确率只有 **13%**，而 2024 年 9 月 OpenAI 发布的 o1 直接拉到 **70%+**。这不是「把模型再做大一号」的产物，而是范式转移——把算力从「训练时」搬到「推理时」。

核心洞察浓缩成一句话：

```text
传统范式：1 次 forward = 1 个答案
o1 范式 ：1 次 prompt = 1000 次思考
        → 像人类「多想想再做」
        → 推理时搜索（Tree of Thought / MCTS）
        → 过程奖励模型（Process Reward Model）
```

紧接着 2025 年 1 月，DeepSeek 放出 **R1**——纯 GRPO 训练、完全开源、登上 Nature 杂志。R1-Zero 阶段甚至在没有 SFT 冷启动的情况下，涌现出了「让我再想想」「我的推理有问题」这种自我反思语句。这意味着「推理」这件事，不再是少数闭源模型的看家本领，而是一条可复现、可研究的工程路径。

### 1.1 故事脉络

把时间线拉平，这一幕的演进大致是这样的：

```yaml
幕前（背景铺垫）:
  - 2022: CoT（Chain-of-Thought，Wei et al.）
  - 2023: Tree of Thoughts（Yao et al.）
  - 2023: ToT-Bearch、MCTS + LLM

幕中（高潮）:
  - 2024-09: OpenAI o1            # 算法性质 ⭐⭐⭐
  - 2024-12: OpenAI o3
  - 2025-01: DeepSeek-R1（Nature） # 算法性质 ⭐⭐⭐

幕后（落地与延续）:
  - 2025: Claude 3.7 Extended Thinking
  - 2025: QwQ / QVQ（通义千问推理 / 视觉推理）
  - 未来: 推理 Agent 化
```

注意节奏：2022–2023 年大家还在「让模型把思考过程说出来」（CoT），到了 2024 年 o1 直接变成「让模型在内部做 1000 次思考再给答案」。这两件事的差距，是「提示工程」与「推理算法」之间的鸿沟。

## 二、第 1 课时：o1 与 Test-Time Compute

**叙事主旨**：推理时算力也是算力——这一讲我们看 o1 怎么用 Test-Time Compute 突破推理瓶颈。

### 2.1 CoT 的起源（10 min）

一切的起点是 Wei 等人在 2022 年提出的 Chain-of-Thought。它做的事情非常简单：在 few-shot 示例里，把「问题 → 推理过程 → 答案」三段式摆出来，模型就会学着在最终答案前先输出一段推理。

它的好处是即插即用，但天花板也很明显：模型只是「学会模仿思考的样子」，并没有真正学到何时该多算一步。

之后的工作沿着两条路线展开：

```text
- Self-Consistency：同一问题采样多条 CoT，投票决定最终答案
- Tree of Thoughts：把推理组织成树，每一步评估 + 回溯
- MCTS + LLM：用蒙特卡洛树搜索让模型做系统化探索
```

这些方法已经能稳定提升准确率，但都是「在 Prompt 和解码策略上做文章」，没有进入训练阶段。

### 2.2 o1：把搜索搬进训练与推理双链路（20 min）

2024 年 9 月，OpenAI 发布 o1（论文标题 *Learning to Reason with LLMs*），核心创新是把过去散落在 Prompt 层的技巧，整体内化到模型权重里：

```yaml
训练时：
  - 过程奖励模型（Process Reward Model, PRM）：
      对「每一步推理」打分，而不是只看最终答案
  - 大规模 RL：
      在 PRM 信号上做强化学习

推理时：
  - 蒙特卡洛搜索：
      对每一步候选推理做展开 + 评估
  - 100x 推理时间：
      同样的问题，用 100 倍算力换准确率
```

一句朴素但有效的结论：**100x 推理时间 = 13% → 83%**（以 AIME 数据趋势外推）。这种 scaling 不是来自更大的模型，而是来自「允许模型多想一会儿」。

### 2.3 o1 的性能飞跃（10 min）

o1 发布时附带的 benchmarks 把震撼感直接拉满，几个关键数字：

```text
AIME 2024   :  13%  →  70%+
SWE-Bench   :  1.96% →  70%+   # 真实软件工程任务
GPQA        :  56%  →  78%
```

这意味着 o1 不只是「数学变好了」，在工程任务上同样发生了质变。SWE-Bench 从 2% 到 70% 的跳跃，是 RL + PRM + 推理时搜索的组合拳，而不仅仅是 base 模型变大。

## 三、第 2 课时：GRPO 与 R1 自我反思

**叙事主旨**：DeepSeek-R1 完全开源——纯 GRPO 训练涌现「自我反思」行为，登上 Nature。这一讲看 GRPO 如何替代 Critic。

### 3.1 GRPO 的核心创新（15 min）

传统 PPO 路径下，做 reasoning 强化学习需要一个独立的 Critic（价值）模型。GRPO（Group Relative Policy Optimization，由 Shao 等人在 DeepSeekMath 论文中提出）把这个 Critic 拆掉了，改用「同一批采样的相对优势」：

```python
# GRPO 优势估计（伪代码）
def grpo_advantage(rewards):
    # rewards: 一组同 prompt 的采样回报
    mean = sum(rewards) / len(rewards)
    std  = sqrt(sum((r - mean) ** 2) / len(rewards))
    return [(r - mean) / std for r in rewards]
```

直观理解：

```yaml
PPO : 每条样本学习一个 "绝对价值" V(s)
       → 需要一个独立 Critic 模型，显存 ≈ policy 的 50%

GRPO: 同组样本互相比较，得出 "相对优势"
       → 不需要 Critic，节省一半显存
       → 训练更稳定（组内归一化天然抑制极端 reward）
```

这个看似简单的改造直接砍掉了一个模型，对 MoE 这种本身就要堆参数的结构非常友好。

### 3.2 R1-Zero：纯 GRPO 涌现的「自我反思」（10 min）

DeepSeek-R1 训练分两条线，最让人惊讶的是 **R1-Zero**：

```yaml
R1-Zero 配方：
  base       : DeepSeek-V3-Base
  RL 算法    : 纯 GRPO（无任何 SFT 冷启动）
  reward     : 规则式 + PRM 信号
  涌现行为:
    - 反复出现 "wait, let me reconsider..."
    - 自发写出 "this reasoning has a problem..."
    - 推理链长度随训练自动变长
```

所谓「涌现」，并不是空话——在 R1-Zero 的训练 log 里，研究人员真的观察到了模型开始用「让我再想想」「我刚才的推理有问题」这种句式来自检前面的步骤。这是 GRPO + 规则 reward 没人显式教过它的事情。

### 3.3 R1 完整版与开源意义（10 min）

R1-Zero 推理能力强但语言风格不稳定，于是最终版的 R1 在 GRPO 之前先做了一轮 SFT 冷启动，再多阶段 GRPO：

```text
SFT 冷启动 ──→ 多阶段 GRPO ──→ 拒绝采样 + SFT ──→ 最终模型
```

效果上看，R1 完整版在多项 benchmark 上追平 o1，并且**完全开源**。这件事的影响远超模型本身：

```yaml
影响清单:
  社区     : 可以在本地复现 o1 级别的推理
  研究     : 有了可分析的推理轨迹语料
  工业     : 训练成本大幅下降（R1 训练费用远低于 o1）
  监管     : Nature 审稿让「推理 RL」走上了学术化道路
```

工业层面的跟进也很快：Claude 3.7 Extended Thinking、阿里 QwQ / QVQ 都是同一波技术红利的延续。

## 四、第 3 课时：PRM 过程奖励模型（o1 核心技术）

**叙事主旨**：o1 之所以能在推理时"多想一会儿"还做对，关键不是采样次数，而是一个能"给推理过程打分"的模型——Process Reward Model。这一讲把它单独拆出来讲清楚。

> 🆕 本节为 v2 增补（源稿课时演化：原 4 课时 → 现 6 课时，PRM 独立成节）。源稿位置：`30-RLHF/02`（过程奖励模型）。

### 3.1 PRM 与 ORM 的核心差别

传统 Outcome Reward Model（ORM）只看最终答案对错；PRM 看的是"每一步推理"：

```text
ORM（Outcome Reward Model）:
  输入 : (question, full_solution)
  输出 : scalar（最终答案对/错）
  问题 : 整步错了才发现 → reward 信号稀疏

PRM（Process Reward Model）:
  输入 : (question, step_i)
  输出 : scalar（这一步推理是否合理）
  优势 : 每一步都有 reward → 信号密集，可引导 MCTS 展开方向
```

直观类比：ORM 像"只看考试总分"，PRM 像"给每道大题的过程分"。

### 3.2 PRM 的训练数据从何而来

PRM 的训练数据有两条来源，工程上各有所长：

```yaml
来源 A：人工标注（Lightman 2023）
  - 标注员对每一步推理打分
  - 数据质量最高，但成本昂贵
  - Let's Verify Step by Step 即此路线

来源 B：自动合成（o1 / R1）
  - 用蒙特卡洛采样估计每一步的"未来回报"
  - 从正确答案回溯，标记"导致正确答案的步骤"
  - 成本低，可大规模生成，但需要规则 reward 配合
```

### 3.3 PRM 在 o1 推理时搜索中的作用

PRM 不是训练完就丢的——它直接驱动推理时的搜索：

```text
候选推理树展开过程中：
  1. 对每一步生成 K 个候选继续
  2. PRM 给每个候选打分
  3. 按分数剪枝 / 选择 / 回溯
  4. 最终答案选 PRM 总分最高的路径
```

这就把"训练时的 reward"和"推理时的搜索"打通了——PRM 既当老师，又当搜索的启发函数。这是 o1 和 R1 的关键共享组件。

## 五、第 4 课时：Test-Time Scaling Law

**叙事主旨**：训练时扩展是旧故事——推理时扩展是新前沿。这一讲看 Test-Time Scaling Law。

### 4.1 传统 Scaling Law 回顾（5 min）

先把背景拉齐。Kaplan（2020）和 Chinchilla（2022）已经告诉我们：

```text
训练算力 ↑  →  模型 ↑  →  性能 ↑
最优 token / param ≈ 20  (Chinchilla)
```

也就是说，「算力换性能」这件事，过去 4 年是靠「把模型做大 + 把数据按比例加长」来兑现的。

### 4.2 Test-Time Scaling Law（15 min）

o1 之后，一条新的 Scaling Law 被确立：**推理算力也可以换性能**。

```yaml
核心变量:
  - CoT 长度    : 单次回答写的推理步数
  - 采样次数    : 同问题并行采样多少条
  - 多数投票    : 取多数一致作为最终答案
  - 过程奖励搜索: 用 PRM 引导每一步的展开方向

经验关系:
  L_CoT ↑    →  准确率 ↑（边际递减）
  N_samples ↑ →  准确率 ↑（多数投票再叠加）
  搜索深度 ↑  →  准确率 ↑↑（PRM + MCTS）
```

换句话说，过去 scaling 是「数据 + 参数 + 训练算力」，现在 scaling 多了一个维度：**「同一道题允许模型想多久」**。

### 4.3 o1 的实证（10 min）

把 o1 的数字放到 Test-Time Scaling 框架里看，会得到非常清晰的曲线：

```text
AIME 2024  ：推理算力 ~100x   →  13% → 70%+
SWE-Bench ：推理算力大幅度扩展 →  1.96% → 70%+
经验法则  ：在数学 / 代码任务上，推理算力对准确率的弹性甚至高于参数规模
```

这直接重塑了「算力预算分配」的讨论：

```yaml
旧公式: 总算力 ≈ 训练算力
新公式: 总算力 ≈ 训练算力 + 推理算力 × 调用次数 × 单次思考深度
```

## 六、第 5 课时：2025 Scaling 演进（Snell 论文）

**叙事主旨**：把 Test-Time Scaling 这件事从「o1 的工程报告」升格为「有量化边界的科学命题」。这一讲看 Snell 等人在 2024-2025 年对推理时算力的系统化研究。

> 🆕 本节为 v2 增补（源稿课时演化：原 4 课时 → 现 6 课时，Snell 论文独立讲解）。源稿位置：`23-Scaling-Laws/02`。

### 5.1 从「定性现象」到「可拟合曲线」

o1 发布时，社区已经知道「推理算力 ↑ → 准确率 ↑」，但没人给出函数形式。Snell 团队的工作把这个缺口补上：

```text
研究问题：
  - 给定一个固定 base model
  - 在推理时投入不同算力（采样数 / 验证次数 / 搜索深度）
  - 准确率随算力如何变化？是否存在「最优分配」？

核心发现（Snell et al. 2024）：
  - 推理算力对准确率的弹性，与任务难度强相关
  - 简单任务：少量采样即可饱和
  - 困难任务：算力-准确率曲线接近对数线性，可继续堆
  - 存在「算力最优分配」：不同难度问题应分配不同推理算力
```

### 5.2 三种推理时策略的对比

Snell 论文把推理时策略归为三类，并系统对比了它们的算力-准确率曲线：

```yaml
策略 1：Sampling（多次独立采样 + 投票）
  优点 : 实现最简单
  缺点 : 边际递减明显，浪费算力在「已经会做的题」

策略 2：Verification（采样后用 PRM 验证 + 选最优）
  优点 : 比纯采样更高效
  缺点 : 依赖 PRM 质量

策略 3：Search（PRM + MCTS，树搜索）
  优点 : 算力效率最高
  缺点 : 实现复杂，工程门槛高
```

工程上「哪种最好」取决于任务难度分布：大量简单题 → 采样；少量难题 → 搜索。

### 5.3 对「未来算力预算」的启示

Snell 的结论直接重塑了"算力该怎么花"的讨论：

```text
旧范式：
  训练算力固定 → 推理时不做额外动作 → 模型直接给答案

新范式：
  训练算力固定 → 推理时按问题难度自适应分配算力
              → 简单题：几十 token 解决
              → 难题：上百万 token 慢慢想
              → 总成本可能不变，但整体准确率上一个台阶
```

这也是后来 o3、Claude 3.7 Extended Thinking 设计的理论依据——「自适应推理算力」是 Test-Time Scaling 的下一站。

## 七、第 6 课时：MoE 在推理时代的演进

**叙事主旨**：MoE 在训练时省算力——推理时呢？这一讲看 MoE 如何与 Test-Time Compute 结合。

### 6.1 MoE 的推理挑战（10 min）

MoE（Mixture of Experts）的特点是一组「看起来大、用起来小」的参数：

```yaml
总参数     : 大（提升容量）
激活参数   : 小（每次推理只走其中几条专家）
核心矛盾:
  - 显存占用 ≈ 总参数（要全部装进显存的存储）
  - 算力消耗 ≈ 激活参数（每次 forward 实际只算一部分）
  - 路由不稳定 : 专家被激活的次数不均，会塌缩
```

也就是说，MoE 在训练阶段是省算力的；但在推理时，**显存压力反而更大了**——你必须把 671B 参数全部装下，才能在每次 forward 时挑出 37B 用。

### 6.2 DeepSeek-V3 的 MoE 设计（10 min）

DeepSeek-V3 用了相当激进的 MoE 配置，正好把这一阶段的工程问题摊开：

```yaml
DeepSeek-V3 MoE:
  总参数     : 671B
  激活参数   : 37B
  专家数     : 256（细粒度）
  共享专家   : 单独分离（处理通用知识）
  路由策略   : 改进的负载均衡 + 节点受限路由
```

这种「又大又省」的形态刚好为后续 R1 留下了空间——base 本身就具备「能容纳大量复杂推理策略」的能力。

### 6.3 MoE + 推理扩展：R1 的成本账（15 min）

R1 把上面所有东西拼到了一起：

```text
DeepSeek-V3 (671B / 37B 激活 MoE)
        │
        ▼  纯 GRPO + 过程 reward
R1 (推理时)
        │  每道题允许「激活 37B × 想 1000 步」
        ▼
性能追平 o1，训练成本仅 ~1/10
```

这是「MoE + RL + Test-Time Compute」三件套的第一次清晰组合。R1 的意义不只是模型本身，而是证明了一条可复现的链路：

```yaml
工程结论:
  1. MoE base 让大规模推理 RL 成为显存可行的工程
  2. GRPO 砍掉 Critic，让训练侧也省一半成本
  3. Test-Time Compute 让推理侧用 「想得久」 换 「答得对」
  4. 三者叠加 → 1/10 成本追平闭源旗舰
```

### 6.4 未来的几个方向（10 min）

```yaml
实时 MoE 路由        : 不同难度问题用不同专家组合
端侧 MoE + BitNet    : 1-bit 权重 × MoE，把推理塞进消费级 GPU
推理时专家动态激活    : 不再固定激活数，按 PRM 信号动态调整
Tool-augmented Reasoning : 推理过程中调用搜索 / 代码解释器
```

## 八、思考题与学习目标

读完这一整幕，下面 7 个问题应该能自己回答：

```yaml
✅ 1. 解释 Test-Time Compute 是什么，和 Training Compute 的区别
✅ 2. 推导 GRPO 的组内相对优势估计公式
✅ 3. 解释 o1 推理时搜索的工作机制（PRM + MCTS）
✅ 4. 解释 R1-Zero 涌现「自我反思」的可能原因
✅ 5. 理解 Test-Time Scaling Law 与传统 Scaling Law 的关系
✅ 6. 理解 MoE 与推理结合的成本-性能账
✅ 7. 说说推理 Agent 化（tool + reasoning）可能的形态
```

几个值得反复咀嚼的开放问题：

```text
Q1: Test-Time Compute 和 Training Compute 哪个更重要？
    → 答案不是二选一，而是「任务难度越高，越靠前者」。

Q2: o1 真的在「思考」吗？
    → 它在做的是统计意义上的搜索，不是意识层面的反思，但效果逼近。

Q3: GRPO 为什么能去 Critic？
    → 因为相对优势是组内可比的，对 Critic 的绝对估计不再必要。

Q4: R1-Zero 的「自我反思」是涌现智能吗？
    → 是 reward shaping 下的一种行为模式，客观有效，但应避免拟人化。

Q5: 推理时扩展的极限在哪？
    → 物理上是 cost / latency 曲线，本质上是搜索 + 验证的回报递减点。

Q6: MoE 怎么与推理结合？
    → base 用 MoE 提供容量，推理时只激活少量专家做深度思考。

Q7: 推理 Agent 化的未来是什么？
    → 推理 + 工具 + 记忆 + 自我评估形成闭环，o3 / Agentic R1 是方向。
```

## 幕间过渡：通向第九幕

o1 / R1 解决了「会推理」这件事——但工业 AI 怎么用 LLM 解决真实问题？推荐、搜索、知识图谱、翻译、语音……这些传统 AI 任务如何与 LLM 融合？下一讲（第九幕），我们看工业 AI 综合应用与兜底章节。

## 必读论文清单

```text
核心 3 篇：
  ⭐⭐⭐ OpenAI 2024《o1 / Learning to Reason with LLMs》
  ⭐⭐⭐ DeepSeek 2025《R1》（Nature）
  ⭐⭐   Shao et al. 2024《DeepSeekMath / GRPO》

进阶 3 篇：
        Wei et al. 2022《Chain-of-Thought》
        Yao et al. 2023《Tree of Thoughts》
        Lightman et al. 2023《Let's Verify Step by Step》

Scaling Law 2 篇：
        Kaplan et al. 2020《Scaling Laws for Neural LMs》
        Hoffmann et al. 2022《Chinchilla》
```

## 模型版本说明

⚠️ **以发布时为准**：本文涉及的模型名称（OpenAI o1 / o3、DeepSeek-V3 / R1、Claude 3.7、QwQ / QVQ 等）及其具体能力指标，均为撰写当时已公开披露的事实。模型版本迭代频繁，后续如有更新，请以官方发布为准。文中给出的 benchmark 数字（如 AIME 2024、SWE-Bench、GPQA）均来自原始论文或官方公告，未做外推。

## 更新记录（2026-10-17）

- 课时结构由 4 课时扩为 6 课时：新增第 3 课时「PRM 过程奖励模型（o1 核心技术）」，新增第 5 课时「2025 Scaling 演进（Snell 论文）」，原 Scaling Law 与 MoE 两节顺延为第 4 / 第 6 课时。
- 新增章节号与子节号同步更新；front matter 增补 `updated` / `updated_from` / `updated_note` 三字段，扩 `tags`（新增 PRM、Process-Reward-Model）。
