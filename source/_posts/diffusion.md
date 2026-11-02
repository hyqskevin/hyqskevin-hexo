---
title: Diffusion 论文速读
date: 2026-09-02 00:00:00
description: Diffusion 模型 5 篇代表论文速读：Diffusion ReRoll（机器人序列预测 + 可修正去噪）、DDPM（基础去噪）、DDIM（加速采样）、Stable Diffusion（文生图）、Consistency Model（一步采样）。Diffusion 模型在 2026 年的工程落地。
categories:
  - notes
tags:
  - Diffusion
  - 论文速读
  - 生成模型
  - 图像生成
  - 视频生成
---

最近读了 5 篇 Diffusion 模型的代表论文：DDPM（基础）→ DDIM（加速）→ Stable Diffusion（文生图）→ Consistency Model（一步）→ Diffusion ReRoll（机器人序列预测）。本篇速读 + 8 年演进全景。

## 一、Diffusion 模型基础回顾

```text
训练：逐步加噪
  干净数据 x₀
    → 加噪 → x₁（轻度）
    → 加噪 → x₂
    → ...
    → x_T（纯噪声）

推理：逐步去噪
  纯噪声 x_T
    → 去噪 → x_{T-1}
    → 去噪 → x_{T-2}
    → ...
    → 干净数据 x₀
```

**关键公式**：

```text
加噪：q(x_t | x_{t-1}) = N(x_t; √(1-β_t) x_{t-1}, β_t I)
去噪：p_θ(x_{t-1} | x_t) = N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))
```

**为什么有效**：
- 训练简单（每步 MSE loss）
- 推理可控（CFG 引导）
- 质量高（多步精修）

## 二、5 篇代表论文

### 2.1 DDPM：Denoising Diffusion Probabilistic Models（2020，基础）

- 论文：[2006.11239](https://arxiv.org/abs/2006.11239) | Ho 等 | Google
- **贡献**：把"逐步加噪 + 逐步去噪"做成可训练模型
- **训练目标**：预测每步的噪声 ε

```python
loss = mse(model(x_t, t), noise)  # 简单
```

- **结果**：CIFAR-10 FID 3.17（当时最好）
- **意义**：打开 Diffusion 时代

### 2.2 DDIM：Denoising Diffusion Implicit Models（2021，加速）

- 论文：[2010.02502](https://arxiv.org/abs/2010.02502) | Song 等
- **贡献**：把"必须 T 步"压缩到"20-50 步"，**质量不下降**
- **关键**：用确定性 ODE 代替随机 SDE

```python
# 推理：50 步 vs 1000 步，质量几乎一样
for t in [999, 949, 899, ..., 0]:
    x = model(x, t)
```

- **意义**：让 Diffusion 模型**实用**（每秒 1 张图 → 每秒 20 张图）

### 2.3 Stable Diffusion（2022，文生图里程碑）

- 项目：[CompVis/stable-diffusion](https://github.com/CompVis/stable-diffusion) | LMU Munich
- **贡献**：把 Diffusion 跑在 **latent space**（不是 pixel space）
- **架构**：
  - Encoder：图像 → latent（4× 压缩）
  - UNet + Text Encoder（CLIP）→ 在 latent 去噪
  - Decoder：latent → 图像
- **优势**：4096×4096 图能跑（A100 8GB）
- **意义**：催生 Stable Diffusion WebUI / ComfyUI / Midjourney 类应用

### 2.4 Consistency Model：一步采样（2023）

- 论文：[2303.01469](https://arxiv.org/abs/2303.01469) | OpenAI
- **贡献**：把 DDPM 的"50 步"压缩到**1 步**（无 CFG）
- **原理**：直接学"任意噪声 → 干净数据"映射（不一步步去噪）

```python
# 一致性：任意 t 时刻，模型输出应该一致
loss = mse(model(x_t, t), model(x_{t-1}, t-1))
```

- **速度**：1 秒 / 张（A100）
- **应用**：实时图像生成、设计工具

### 2.5 Diffusion ReRoll：可修正去噪（2026）

- 论文：[2607.19919v1](https://arxiv.org/abs/2607.19919v1) | Kim 等
- **场景**：机器人序列预测（多步动作规划）
- **创新**：局部"重新加噪"——已稳定的部分重置，结合上下文再细化

```text
传统 Diffusion 序列预测：
  x_T → x_{T-1} → ... → x_0（单调，单向）

Diffusion ReRoll：
  早期 x_0..k 稳定 → 重置为噪声 x_k'
  后期保持稳定
  重新去噪 x_k'（结合后期上下文）
```

- **提升**：OGBench PointMaze +21%，Diffusion Policy +56.5%
- **意义**：让长时程规划"自我修正"

## 三、Diffusion 8 年时间线

```text
2015  Sohl-Dickstein：扩散模型思想萌芽
2020  Ho et al.：DDPM（图像生成）
2021  Song et al.：DDIM（加速 50 步）
2022  Stable Diffusion（latent + 文生图）
2023  Consistency Model（1 步）/ DALL-E 3 / SDXL
2024  Sora（视频 Diffusion）/ DiT（Diffusion Transformer）
2025  Flux（开源 SOTA）/ SD 3.5
2026  Diffusion ReRoll（可修正）/ 多模态统一
```

## 四、4 个工程应用方向

### 4.1 图像生成

```python
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
    torch_dtype=torch.float16
).to("cuda")

image = pipe("a cat sitting on a laptop").images[0]
image.save("cat.png")
```

### 4.2 视频生成

- **Sora**（OpenAI）：60 秒 1080p 视频
- **Runway Gen-3**：商业视频生成
- **可灵 / 海螺 / 智谱**（国产）

### 4.3 音频

- **AudioLDM**：文生音效
- **DiffRhythm**：文生音乐
- **Suno / Udio**：商业 AI 音乐（基于 Diffusion）

### 4.4 机器人 / 具身智能

- **Diffusion Policy**（斯坦福）：机器人动作生成
- **Octo**：开源机器人基础模型
- **Pi-0**：跨本体机器人模型
- **Diffusion ReRoll**：可修正规划

## 五、3 个 vs 1 个 vs 4 个

- **vs VAE**：Diffusion 质量高但慢（20-50 步 vs 1 步），VAE 模糊但快
- **vs GAN**：Diffusion 训练稳定，GAN 模式崩溃
- **vs 自回归**：Diffusion 全局一致（图像 1 张），自回归 串行（文本 1 token）

**2026 共识**：Diffusion 是**视觉生成的事实标准**。

## 六、5 条 Diffusion 工程实践

### 6.1 选择合适模型

```text
实时设计工具 → Consistency Model / SDXL-Turbo（1-4 步）
文生图通用 → SD 3.5 / Flux（25-50 步）
视频生成 → Sora / 可灵（专有模型）
机器人 → Diffusion Policy / π-0
```

### 6.2 显存优化

```python
# 启用 xformers 加速
pipe.enable_xformers_memory_efficient_attention()

# 启用 attention slicing
pipe.enable_attention_slicing(1)

# 启用 VAE slicing
pipe.enable_vae_slicing()
```

4096×4096 单图能跑在 8GB 显存。

### 6.3 推理加速

```python
# LCM-LoRA：4 步达到 30 步质量
from diffusers import LCMScheduler
pipe.scheduler = LCMScheduler.from_config(pipe.scheduler.config)

# 用 LoRA + LCM
pipe.load_lora_weights("latent-consistency/lcm-lora-sdv1-5")

# 推理：4 步
image = pipe(prompt, num_inference_steps=4).images[0]
```

### 6.4 量化部署

```python
# 8-bit 优化
from optimum import quantize

quantized = quantize(pipe.unet, bits=8)
# 显存减半，速度 +20%
```

### 6.5 服务化

```python
# 用 BentoML 部署
import bentoml

bentoml.diffusers.save_model(
    "sd_1_5",
    pipe,
    signatures={"generate": {"batchable": True}}
)
```

## 七、3 条避坑

1. **不要在 4096×4096 上跑 SD**——先 512×512 验证流程
2. **不要忽视 CFG scale**——太高（> 15）会让图像过饱和
3. **不要用 SD 1.5 训练中文**——tokenizer 对中文支持差

## 八、3 个相关项目

- [CompVis/stable-diffusion](https://github.com/CompVis/stable-diffusion) — Stable Diffusion 官方
- [huggingface/diffusers](https://github.com/huggingface/diffusers) — 主流 Diffusion 库
- [black-forest-labs/flux](https://github.com/black-forest-labs/flux) — Flux SOTA 开源模型

## 九、3 条与 LLM 的对比

| 维度 | Diffusion | LLM |
|---|---|---|
| 数据类型 | 图像 / 视频 / 音频 | 文本 |
| 架构 | UNet / DiT / Transformer | Transformer |
| 训练 | 加噪 + 去噪 | 下一 token 预测 |
| 推理 | 20-50 步 | 1 token 1 步（多步生成） |
| 模态 | 视觉为主 | 文本为主 |
| 2026 主流 | 文生图 / 文生视频 | 文本对话 |

**两者正在融合**：多模态 LLM（如 GPT-4o） = LLM + Diffusion Encoder/Decoder。

---

> **Diffusion 的 8 年**：从"小众研究方向"到"文生图 / 文生视频的事实标准"。**Diffusion 改变了创意产业**——设计 / 影视 / 广告 / 教育都在用。**未来 2-3 年是视频 Diffusion 普及期**（类似 2023-2024 图像 Diffusion 的爆发）。