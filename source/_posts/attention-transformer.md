---
title: Attention Transformer 论文速读
date: 2026-09-02 00:00:00
description: Transformer 与 Attention 论文速读：Bahdanau 2014（首次引入 attention）/ Memory Networks 2014（外部记忆）/ Attention Is All You Need 2017（self-attention 革命）/ Transformer 变种（Linformer / Performer / Reformer 等高效注意力）。
categories:
  - notes
tags:
  - Attention
  - Transformer
  - 论文速读
  - 深度学习
  - NLP
---

Attention / Transformer 是 2017 年以来深度学习最核心的架构创新。这篇速读覆盖 4-5 篇关键论文：Bahdanau 2014 引入 attention → Memory Networks 引入外部记忆 → Transformer 2017 完全 attention 化 → 后续变种。

## 一、Attention 是怎么来的

**RNN / LSTM 时代**（2014 前）：翻译靠 encoder-decoder，源句压成一个固定长度向量，瓶颈明显。

**Bahdanau 2014**：在 decoder 解码每个目标词时，**自动"看"源句中最相关的部分**——加权求和 encoder 隐状态，加权分数由对齐网络（additive attention）学得。

```text
传统 NMT：
  source → encoder → 固定向量 → decoder → target
                                  ↑
                            瓶颈在这一步

Bahdanau Attention NMT：
  source → encoder → 全部隐状态 → attention 加权 → decoder → target
                                  ↑
                            这里做"软对齐"
```

**核心洞察**：翻译不是"先总结再翻译"，而是"边看边译"。Attention 让 decoder 在生成每个词时动态关注源句不同位置。

## 二、Memory Networks 2014

**问题**：QA 任务需要"知识库 + 推理"，LSTM 的"内部记忆"容量有限。

**Memory Networks 方案**：把"记忆"显式化为**外部可读写存储**：

```text
输入 query
   ↓
检索相关记忆（向量相似度）
   ↓
attention 加权求和
   ↓
推理网络输出 answer
```

**核心贡献**：

- 显式 **memory slot**（多个 embedding）
- attention 选最相关的几个 slot
- 输出"基于事实"的回答（可追溯）

**意义**：Memory Networks 是 self-attention + RAG 的前身，**外部记忆 + attention** 后来成为 LLM 标配。

## 三、Attention Is All You Need 2017（最关键）

**论文**：[1706.03762](https://arxiv.org/abs/1706.03762) | Vaswani 等 | Google

### 3.1 核心贡献

**完全抛弃 RNN / CNN**，**只用 attention**：

```text
RNN：串行计算（依赖前一步）
CNN：局部 attention（窗口受限）
Transformer：全局 self-attention（每步看所有位置，可并行）
```

### 3.2 self-attention 公式

```text
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V

Q = Query（要查什么）
K = Key（被查的索引）
V = Value（查到的内容）
```

```python
# PyTorch 简化版
def self_attention(x):
    Q = linear_q(x)
    K = linear_k(x)
    V = linear_v(x)
    attn = softmax(Q @ K.T / sqrt(d_k))
    return attn @ V
```

### 3.3 多头 + 位置编码

- **Multi-Head**：8 / 16 个不同 attention 并行 → 不同子空间
- **Positional Encoding**：sin/cos 位置编码 → 让 attention 知道词序

```text
位置编码 PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
位置编码 PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

### 3.4 关键创新

- **完全并行**（RNN 必须串行）
- **长距离依赖**（CNN 受窗口限制）
- **可解释性**（attention 矩阵可视化）
- **统一架构**（NLP / 视觉 / 多模态都能用）

### 3.5 结果

- WMT 2014 英德翻译 BLEU 28.4（最好成绩）
- 训练时间：12 小时 / 8 GPU
- 比 RNN / CNN baseline 训练快 5-10 倍

**深远影响**：BERT / GPT / T5 / LLaMA / Claude 全部基于 Transformer 架构。**没有 2017 这篇论文就没有 2023 的 LLM 浪潮**。

## 四、Transformer 后续变种

Transformer 注意力复杂度 **O(n²)**（n 是序列长度），长文本吃不消。后续工作重点：**降复杂度 + 保持性能**。

| 变种 | 年份 | 核心思路 | 复杂度 | 性能 |
|---|---|---|---|---|
| **Linformer** | 2020 | 把 attention 矩阵低秩近似 | O(n) | 略低 |
| **Performer** | 2020 | 随机特征映射（Favor+） | O(n log n) | 略低 |
| **Longformer** | 2020 | 局部 + 全局 attention 组合 | O(n) | 略低 |
| **Reformer** | 2020 | LSH（局部敏感哈希） | O(n log n) | 略低 |
| **Big Bird** | 2020 | 随机 + 窗口 + 全局 | O(n) | 接近 |
| **FlashAttention** | 2022 | GPU 内存优化（不改算法） | O(n²) 但快 2-4x | 不变 |
| **Mamba** | 2023 | 状态空间模型（SSM） | O(n) | 接近 |

**2026 年主流选择**：
- 短文本（< 8K）：标准 Transformer
- 长文本（8K-128K）：FlashAttention + Sliding Window
- 超长（> 128K）：Mamba / Hybrid（Attention + SSM）

## 五、5 个工程应用

### 5.1 LLM 训练

```text
Transformer = LLM 唯一架构
  - GPT 系列（decoder-only）
  - LLaMA / Claude（decoder-only）
  - T5 / BART（encoder-decoder）
```

### 5.2 图像 / 多模态

- ViT（Vision Transformer）：把图像切成 patch → Transformer
- CLIP：图像 + 文本联合 embedding
- DALL-E / Stable Diffusion：Transformer + Diffusion

### 5.3 语音

- Whisper：Transformer 编码 + 解码
- VALL-E：语音合成

### 5.4 强化学习

- Decision Transformer：把 RL 当 sequence modeling
- Trajectory Transformer：轨迹预测

### 5.5 蛋白质 / 生物

- AlphaFold 2：Transformer 预测蛋白质结构
- ESM-2：蛋白质语言模型

## 六、5 条 Attention 工程实践

### 6.1 长文本处理

```python
# 短文本（< 8K）直接用全 attention
# 长文本用 sliding window
def chunked_attention(x, chunk_size=2048, overlap=128):
    chunks = [x[i:i+chunk_size] for i in range(0, len(x), chunk_size-overlap)]
    return torch.cat([self_attention(c) for c in chunks], dim=0)
```

### 6.2 KV Cache 优化

```python
# 推理时缓存 K/V，避免重复计算
class AttentionWithKVCache:
    def forward(self, q, past_kv=None):
        if past_kv is None:
            # 第一次：计算完整 K/V
            k, v = self.k(q), self.v(q)
        else:
            # 后续：只算新 token 的 K/V，拼接到历史
            k = torch.cat([past_kv[0], self.k(q[:, -1:])], dim=1)
            v = torch.cat([past_kv[1], self.v(q[:, -1:])], dim=1)
        return self.q(q) @ k.T, k, v
```

### 6.3 FlashAttention 部署

```python
# 装 flash-attn
pip install flash-attn

# 替换 attention
from flash_attn import flash_attn_func
attn = flash_attn_func(q, k, v, dropout_p=0.0, softmax_scale=None)
```

速度提升 2-4 倍，内存省 5-20 倍。

### 6.4 稀疏 Attention

```python
# Longformer 风格：局部 + 全局
def sparse_attention(x):
    # 局部窗口
    local = sliding_window_attention(x, window=512)
    # 全局 token
    global_attn = full_attention(x[:, :8])  # 前 8 个 token 全局
    return local + global_attn
```

### 6.5 量化 Attention

```python
# INT8 量化 K/V
q_int8 = (q / q.abs().max() * 127).to(torch.int8)
# 推理速度 +30%，精度损失 < 1%
```

## 七、3 条避坑

1. **不要 8K + 全 attention**——内存 O(n²) 直接 OOM
2. **不要省 KV cache**——长文本推理速度崩
3. **不要乱调位置编码**——大多数场景 sin/cos 已够用

## 八、3 个相关项目

- [huggingface/transformers](https://github.com/huggingface/transformers) — Transformer 库
- [flash-attention](https://github.com/Dao-AILab/flash-attention) — 快速 attention
- [state-spaces/mamba](https://github.com/state-spaces/mamba) — Mamba 实现

---

> **Attention 改变了什么**：从"序列长度限制"到"任意长度 + 高效"。Transformer 是 2017 年以来深度学习的"通用架构"——**没有 Attention，就没有 BERT / GPT / Claude / LLaMA**。