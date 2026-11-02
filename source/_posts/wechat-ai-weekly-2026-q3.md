---
title: 2026 Q3 AI 前沿速览
date: 2026-10-18 00:00:00
description: 微信 AI 周报 Q3 合订版，盘点 2026 Q3 四条行业前沿：豆包 61 页工作白皮书、MonoCode 统一 8 家编程 CLI、RSIAgent 让开源模型反超闭源、中国 AI 天团集体杀向 RSI 路线。
series:
  name: 微信 AI 周报
  index: 3
  total: 3
categories:
  - AI 周报
  - 行业前沿
tags:
  - 微信 AI 周报
  - RSI
  - MonoCode
  - RSIAgent
  - Atria Dawn
  - 编程智能体
  - 开源模型
---

> 整理自「微信 AI 周报」Q3 期推送的 4 条 AI 行业前沿动态，时间窗口 2026-09-09 ~ 2026-09-15。本篇为合订版，沿用与系列一致的「作者 / 来源 / 日期 / 核心观点 / 适合谁」四段式梳理。

Q3 最值得关注的信号集中在两条主线：

- **「AI 造 AI」从口号落到了 Demo**：RSIAgent、Atria Dawn Preview 接连把 RSI（Recursive Self-Improvement，递归自我提升）从论文带到了可跑通的系统。
- **统一入口正在替代「选一家站队」**：MonoCode 用一个 Tauri 桌面应用把 8 家编程 Agent CLI 收进同一窗口，标志着「多工具并存」开始成为工程标配。

下面逐条展开。

## 一、豆包 61 页工作白皮书（标题信号）

- **作者**：知识星球阿登（KOKOJOY）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=MzI5MjA4NzI4MA==&mid=2650886417&idx=1&sn=6eaa2e4a4175e07d5de9128a933c8838)
- **日期**：2026-09-09

> ⚠️ **内容缺失说明**：该公众号启用了 anti-bot 拦截机制，自动抓取工具只抓到标题，正文 61 页内容未能获取。本节只整理已公开的标题信号，完整内容建议读者自行登录微信访问原文。

### 1.1 已知标题信号

- 「豆包」= 字节跳动 AI 产品。
- 「409 工作」= 可能指工作流 / 办公场景（具体待原文确认）。
- 「61 页深度介绍」= 达到重磅产品白皮书体量。
- 来自 KOKOJOY 知识星球阿登推送 = 业内具备一定影响力。

### 1.2 后续动作建议

1. 登录手机微信 → 复制链接到浏览器 → 阅读 61 页完整 PPT。
2. 关注豆包官方文档站（docs.doubao.com）。
3. 对比豆包 vs 千问 Skill 开放平台 vs 扣子 2.0 的 Agent 能力差异。

> 解读：这条动态虽然内容缺失，但它释放了一个明确信号——**头部大厂正在把 Agent / 工作流能力做成系统级白皮书对外输出**。等原文可访问后，建议重点看它对「工作流编排」和「工具调用」的定义，这通常是判断一个平台开放程度的关键。61 页体量意味着它不是功能清单，而是**一套方法论**：从任务定义、工具接入、到执行与评估的全链路。对中小团队来说，这份白皮书最大的价值就是「照着抄架构」：少踩一遍大厂已经踩过的坑。

---

## 二、MonoCode：把 8 家编程智能体 CLI 收进一个桌面窗口

- **作者**：开源 HubLab
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=zg4mjcytcc3ma==&mid=2247486740&idx=1&sn=947824cdadd52fbf1d3670a05cb11639)（按公众号原文链接归档）
- **日期**：2026-09-15

### 2.1 核心观点

**MonoCode = 把 8 家编程 Agent CLI 收进一个 Tauri 桌面应用**。它不代理你的请求、不卖 token、不托管模型——所有请求都由你本地已登录的 CLI 发出，额度和计费完全遵循各家 CLI 自己的规则。换句话说，它做的是「统一入口」，而不是「统一后端」。

### 2.2 支持的 8 家 CLI

| CLI | 传输协议 |
|---|---|
| Claude Code | 双向 stream-json（stdio） |
| Codex | JSON-RPC（stdio，启动 app-server） |
| Cursor CLI | ACP 协议（stdio 上的 JSON-RPC） |
| Grok Build | stdio + HTTP |
| OpenCode | HTTP + SSE（127.0.0.1 抢空闲端口） |
| Pi | stdio |
| omp | stdio |
| fx | stdio |

### 2.3 核心架构（src/lib/harness/）

```text
1. 分发：sendHarnessTurn() 按 harness id 找 adapter 转发
2. 翻译：adapter 把输入编成 CLI 的 stream-json + 拼参数
3. 子进程：Rust 侧 std::Command 起进程，三个线程（stdout / stderr / 等待）
4. 解析：协议模块把 CLI 输出转成 HarnessEvent 统一事件
   （message.delta / tool.started / approval.requested / question.asked / context ...）
```

### 2.4 适合什么人

```text
✅ 已用两家以上 Agent CLI
✅ 日常多项目多会话切换
✅ 确实会看 diff 再决定保留
✅ macOS Apple Silicon（dmg）/ Linux（deb + AppImage）/ Windows x64（v0.1.42+）

❌ 只用一家 CLI 一次跑一个长会话 → 收益有限，多一层进程管理
❌ 要远程开发机 / 多人共享 / 统一计费 → 不解决
```

### 2.5 关键设计取舍

- **每会话对应一个子进程**，空闲保留 5 分钟再停（追问可复用）。
- **启动时不再无脑探测所有 provider**（早期 Pi 带扩展能吃约 1 GB），只刷新本次需要的 harness。
- **OpenCode 占本机随机端口**，只绑 127.0.0.1。
- **cwd 就是权限边界**，子进程以你的身份在你选定的项目目录里运行。

### 2.6 安装路径（macOS）

```bash
# 第 1 步：装好、登录好至少一家 CLI
# Claude Code
claude auth login
# Codex
codex login
# Cursor CLI
agent login
# OpenCode
opencode auth login
# Grok Build
curl -fsSL https://example/grok.sh | bash
grok login
# Pi
npm i -g @earendil-works/pi-coding-agent
# omp
curl -fsSL https://example/omp.sh | sh
# fx
curl -fsSL https://example/fx.sh | bash
fx login

# 第 2 步：下载 MonoCode.dmg → 拖进 Applications
# 第 3 步：选工作目录 → 新建会话 → 选模型 / 强度 / 权限模式 → 发任务
# 第 4 步：审阅与回退（diff / Undo All / Keep All）
# 第 5 步：会话数据落在
#   ~/Library/Application Support/com.monocode.desktop/monocode.db
```

> 解读：MonoCode 的核心命题是「不抢 token、纯做壳」。在订阅制 Agent CLI 普及的当下，这种中立工具层反而比「大模型超市」更有生命力——它把「用哪家」的决定权完全留给用户，把统一体验做到最好。工程团队 leader、全栈开发者、已经在用多 Agent CLI 想统一管理的人最值得一试。

---

## 三、RSIAgent：让开源模型自主探索新环境

- **作者**：机器之心（Aether AI）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=mza3mzi4mjgzmw==&mid=2651057178&idx=1&sn=3ee4d896a3d3ed5a39c7773752d61d30)（按公众号原文链接归档）
- **日期**：2026-09-15
- **论文**：[arxiv.org/pdf/2609.15364v1](https://arxiv.org/pdf/2609.15364v1)
- **代码**：[github.com/AetherLabsAI/RSIAgent](https://github.com/AetherLabsAI/RSIAgent)
- **网站**：[aetherlabsai.github.io/RSIAgent/](https://aetherlabsai.github.io/RSIAgent/)

### 3.1 核心观点

> **不 Scale Model，Scale Experience**。在不更新模型参数的情况下，让 Agent 像人一样通过探索新环境、发现因果规律、总结经验持续提升能力。

### 3.2 RSI 框架：Recursive Self-Improvement（递归自我提升）

围绕一个不断演化的 Memory，构建由 3 个智能体组成的多智能体递归闭环：

| 智能体 | 职责 |
|---|---|
| curriculum agent | 决定下一步应该探索什么 |
| actor agent | 进入环境执行任务并积累经验 |
| verifier agent | 根据真实环境反馈判断结果是否可靠 |

### 3.3 Broad-to-Depth 两阶段自探索

| 阶段 | 比喻 | 过程 |
|---|---|---|
| **Broad Recursive Self-exploration** | 预训练 | curriculum 同时生成多个方向任务 → 多组 actor + verifier 并行执行 → 汇总更新 Memory → 新一轮多方向任务 |
| **Deep Recursive Self-exploration** | 后训练 | curriculum 生成相对困难任务 → actor 用当前 Memory 完成 → verifier 检查 → curriculum 根据暴露的失败 / 未知 / 脆弱环节设计更难的 |

### 3.4 核心 Benchmark 结果

| Benchmark | RSIAgent | GPT-6 Astra | Claude Opus 5 |
|---|---|---|---|
| OSWorld 2.0（0808 offline）Partial Score | **78.98%** | 72.60% | - |
| Agents' Last Exam（Near-term） | **84.82%** | 82.26% | - |

> RSIAgent 基于 GLM-5.3 / Kimi-K3 两个开源模型，在上表中反超 GPT-6 Astra / Claude Opus 5 等闭源模型。

### 3.5 关键实验发现

1. **RSI 推动开源超过前沿闭源**（OSWorld 2.0：71.97% → 78.98%）。
2. **可泛化到 Game 场景**（GameCraft-Bench：mechanics / depth / visuals / art 全面提升）。
3. **BRS + DRS 缺一不可**（消融实验）。
4. **RSI 轮次越多持续进化**，部分任务从 0-40% 初始成功率最终提升到 100%。

### 3.6 Aether AI 因果驱动智能体路线

```text
Causal-Copilot       → 因果分析自主完成
C-World              → 开放式工具使用环境
Auto-scaling Memory  → 经验沉淀为长期记忆
Hybrid Self-Evolving → 可演化的结构化记忆
StructAgent          → 长程数字智能体 + 统一因果结构
         ↓
     RSIAgent         → 数字环境中的具体实践
```

### 3.7 论文关键引用

> Sibo Zhu, Shicheng Fan, Xinyue Wang, Wenyi Wu, Kun Zhou*, Biwei Huang. **RSIAgent: Autonomous Exploration for Recursive Self-improvement in New Environments.** *2026*.

> 解读：这条工作的最大信号不在「开源超闭源」的单一分数，而在「不更新参数就能持续进化」的范式——它把 Agent 的成长路径从「堆参数 + 堆数据」转向「堆经验」。RSI 路线能否通用到 GUI / 浏览器 / IDE 等真实办公场景，是接下来 1-2 年观察的重点。研究 Agent 自进化、因果驱动 AI、数字智能体的研究者和工程团队最值得跟进。

---

## 四、中国 AI 天团杀向 RSI：Atria Dawn Preview

- **作者**：ASI 启示录（新智元）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=mzi3mta0mtk1ma==&mid=2652725910&idx=1&sn=20078771c05f66fb259eaacaf80d1a69)（按公众号原文链接归档）
- **日期**：2026-09-15
- **模型权重**：[huggingface.co/internlm/Atria-Dawn-Preview](https://huggingface.co/internlm/Atria-Dawn-Preview)
- **论文**：[github.com/atria-asi/Atria-Dawn-Preview/blob/main/atria-dawn-preview.pdf](https://github.com/atria-asi/Atria-Dawn-Preview/blob/main/atria-dawn-preview.pdf)
- **项目网站**：[atria-asi.ai](https://atria-asi.ai/)

### 4.1 核心观点

> **当 AI 开始帮忙「造 AI」，人类还在忙什么？** ——上海人工智能实验室联合复旦、中科院软件所、人民大学、中科院自动化所、华东师大、哈工大共同发布。

### 4.2 两大 Demo 战绩

| Demo | 任务 | 关键指标 |
|---|---|---|
| **天气预测** | 设计并训练 4 亿参数的天气预测模型（ViT 骨干） | 1 分钟预测未来一周全球天气；45,000 步训练；69 个气象变量；部分指标优于英伟达 FourCastNet |
| **MiniOS** | 从自然语言需求到 MiniOS 操作系统搭建 | 20 分钟完成 |

### 4.3 研发过程人机分工观察（基于 769 条任务记录 / 56 名参与者）

| 维度 | 数据 | 含义 |
|---|---|---|
| AI 使用率 | 96.5%（713 / 739 项任务） | 用 AI 已成常态 |
| 离不开 AI 的任务 | 33.2%（151 / 455 项） | AI 改变任务可行性边界 |
| AI 提出方案 | 64.6%（367 / 567 项决策） | AI 经常出方案 |
| 人类最终选择 | 85.5%（方案决策） | 多数决策仍由人拍板 |
| 人类在目标 / 范围的选择 | 93.4% | 几乎全由人定 |
| 人类介入后继续推进 | 76.0%（447 / 588 项） | 多数卡住经人帮忙后继续 |
| AI 自行恢复 | 23.0% | 也有少数能自我修复 |
| 人类接管 | 0.7% | 极少数完全接管 |

### 4.4 Benchmark 表现（8 项基准对比）

| 基准 | 排名 |
|---|---|
| AutomationBench | 第一 |
| CyberGym | 第一 |
| SkillsBench | 第二 |
| Workspace-Bench-Lite | 第二 |

### 4.5 第三个 Demo：网络安全隔离靶场

```text
网站分析 → 攻击面排查 → 漏洞发现 → 利用 → 修复 → 复验
```

多轮测试排除错误判断，定位真实漏洞，完成攻击、修复和复验。

### 4.6 团队组成

- 96 名主要成员。
- 65 名在校生（博士 33 + 本硕 32），占比超 2/3。
- 31 名正式员工。
- 专项组长中学生比例 70%。

### 4.7 关键反思（递归自我改进的两大问题）

```text
Q1: AI 做得更快，检验能不能跟上？
  → 训练信号可靠吗？评估漏掉了什么？自我修改有没有偏离原目标？
  → 一轮实验中没被发现的错误，可能被带进下一轮
  → 需要：独立评估 + 可追溯过程记录 + 异常暂停和回退

Q2: 下一次，能不能由 AI 主动请人帮忙？
  → 目标不明确 / 证据冲突 / 必须依赖现实反馈时，继续执行未必能解决问题
  → 模型需要识别：哪些可以自行处理，哪些需要补充信息 / 专业判断 / 明确授权
  → 有效的求助 = 卡在哪里 + 有哪些不确定性 + 为什么需要人类 + 反馈用于后续行动
```

> 解读：Atria 给出了 RSI 路线最稀缺的东西——**「人机分工的实证数据」**。比起「AI 全自动」的宏大叙事，96.5% 的 AI 使用率 + 85.5% 的人类决策权才是更现实的图景。它直接指向两个工程问题：评估能力跟不上生成能力时怎么办、AI 卡住时如何主动求救。研究 Agent / RL / 自进化 / 人机协作的研究者、AI Lab、模型团队负责人值得把它作为参考样本。

---

## 五、Q3 总结：中国 AI 集体发力 RSI

### 5.1 时间线信号

| 日期 | 团队 | 代表作 |
|---|---|---|
| 2026-09-15 | Aether AI | RSIAgent（开源模型超过闭源） |
| 2026-09-15 | 上海 AI Lab + 6 高校 | Atria Dawn Preview（AI 造 AI + 学生主导） |
| 2026-09-15 | 开源 HubLab | MonoCode（8 家 CLI 统一桌面） |
| 2026-09-09 | 字节豆包 | 61 页深度介绍 |

### 5.2 三大趋势

1. **RSI 成为共识路线**——不 Scale Model，Scale Experience。
2. **中国 AI 团队集体发力**：Aether AI + 上海 AI Lab + 字节 + 复旦 + 中科院 + 哈工大。
3. **学生团队走到舞台中央**：Atria 65/96 在校生 + 专项组长 70% 学生。

### 5.3 三句话记忆点

1. RSIAgent 让 Kimi-K3 / GLM-5.3 在 OSWorld 2.0 超过 GPT-6 Astra（78.98% vs 72.60%）。
2. Atria 团队 96 人里 65 人是学生，AI 造 AI 已成现实（1 分钟天气预测 / 20 分钟手搓 OS）。
3. MonoCode 把 8 家编程 Agent CLI 统一到一个 Tauri 桌面窗口（不抢 token 收费）。

---

## 模型版本说明

> ⚠️ **以发布时为准**：本文引用的模型名称、版本号、benchmark 成绩均按发布时（2026-10-18）看到的报道与论文整理。后续若官方更新模型代号（例如 GLM-5.3、Kimi-K3、GPT-6 Astra、Claude Opus 5、GLM-5.3、Kimi-K3 等），请以厂商最新发布说明为准。
