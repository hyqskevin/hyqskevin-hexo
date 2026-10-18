---
title: Q3 AI 行业前沿动态
date: 2026-09-18 00:00:00
description: 微信 AI 周报第三篇，盘点 2026 Q3 四条行业前沿动态：豆包 61 页白皮书、MonoCode 统一 8 家编程 CLI、RSIAgent 让开源模型超过闭源、中国团队 Atria Dawn 进军递归自我提升（RSI）。
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

> 整理自 <username> 在 2026-09-09 ~ 2026-09-15 推送的 4 条 AI 行业前沿动态文章。

本篇是「微信 AI 周报」系列的第三篇，聚焦 2026 年第三季度最值得关注的四条行业前沿信号：字节豆包的 61 页深度产品白皮书、把 8 家编程智能体 CLI 收进一个桌面窗口的 MonoCode、让开源模型在 OSWorld 2.0 上反超闭源的 RSIAgent，以及中国 AI 团队集体杀向递归自我提升（RSI）的 Atria Dawn Preview。

## 一、豆包 61 页工作白皮书（标题信号）

- **作者**：知识星球阿登（KOKOJOY）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=MzI5MjA4NzI4MA==&mid=2650886417&idx=1&sn=6eaa2e4a4175e07d5de9128a933c8838)
- **日期**：2026-09-09

> ⚠️ **内容缺失说明**：该公众号启用了 anti-bot 拦截机制，自动抓取工具只抓到标题，正文 61 页内容未能获取。以下内容仅基于已公开的标题信号整理，完整内容建议读者自行登录微信访问原文。

### 1.1 已知标题信号

- 「豆包」= 字节跳动 AI 产品
- 「409 工作」= 可能指工作流 / 办公场景（具体待确认）
- 「61 页深度介绍」= 达到重磅产品白皮书级别的体量
- 来自 KOKOJOY 知识星球阿登推送 = 在业内具备一定影响力

### 1.2 后续动作建议

1. 登录手机微信 → 复制链接到浏览器 → 阅读 61 页完整 PPT
2. 关注豆包官方文档站 / docs.doubao.com
3. 对比豆包 vs 千问 Skill 开放平台 vs 扣子 2.0 的 Agent 能力差异

> 小提示：这条动态虽然内容缺失，但它释放了一个明确信号——**头部大厂正在把 Agent / 工作流能力做成系统级白皮书对外输出**。等原文可访问后，建议重点看它对「工作流编排」和「工具调用」的定义，这往往是判断一个平台开放程度的关键。

> 为什么值得放进「前沿」而不是「资讯」？因为 61 页体量意味着它不是功能清单，而是**一套方法论**：从任务定义、工具接入、到执行与评估的全链路。这类文档的读者通常是对标做产品的人——当字节愿意把"工作"这件事讲 61 页，说明「AI 落地到具体工作流」已经从 demo 阶段进入工程化阶段。对中小团队来说，这份白皮书最大的价值是「照着抄架构」：少踩一遍大厂已经踩过的坑。

## 二、MonoCode：把 8 家编程智能体 CLI 收进一个桌面窗口

- **作者**：开源HubLab
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=Mzg4MjcyOTc3MA==&mid=2247486740&idx=1&sn=947824cdadd52fbf1d3670a05cb11639)
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
3. 子进程：Rust 侧 std::Command 起进程，三个线程（stdout/stderr/等待）
4. 解析：协议模块把 CLI 输出转成 HarnessEvent 统一事件
   （message.delta / tool.started / approval.requested / question.asked / context ...）
```

### 2.4 核心特性：适合什么人

```text
✅ 已用两家以上 Agent CLI
✅ 日常多项目多会话切换
✅ 确实会看 diff 再决定保留
✅ macOS Apple Silicon（dmg）/ Linux（deb + AppImage）/ Windows x64（v0.1.42+）

❌ 只用一家 CLI 一次跑一个长会话 → 收益有限，多一层进程管理
❌ 要远程开发机 / 多人共享 / 统一计费 → 不解决
```

### 2.5 关键设计取舍

- **每会话对应一个子进程**，空闲保留 5 分钟再停（追问可复用）
- **启动时不再无脑探测所有 provider**（早期 Pi 带扩展能吃 ~1GB），只刷新本次需要的 harness
- **OpenCode 占本机随机端口**，只绑 127.0.0.1
- **cwd 就是权限边界**，子进程以你的身份在你选定的项目目录里运行

这几条取舍都很「工程化」：内存控制、端口安全、把文件系统权限直接交给操作系统，而不是自己再造一层沙箱。

### 2.6 安装路径（macOS）

```text
第 1 步：装好、登录好至少一家 CLI
  Claude Code: claude auth login
  Codex: codex login
  Cursor CLI: agent login
  OpenCode: opencode auth login
  Grok Build: curl ... | bash + grok login
  Pi: npm i -g @earendil-works/pi-coding-agent
  omp: curl ... | sh
  fx: curl ... | bash + fx login

第 2 步：下载 MonoCode.dmg → 拖进 Applications
第 3 步：选工作目录 → 新建会话 → 选模型/强度/权限模式 → 发任务
第 4 步：审阅与回退（diff / Undo All / Keep All）
第 5 步：会话数据落在 ~/Library/Application Support/com.monocode.desktop/monocode.db
```

### 2.7 适合什么人

工程团队 leader / 全栈开发者 / 已经在用多个 Agent CLI、想统一管理的人。

> 一句话总结：MonoCode 的本质是「**多 Agent CLI 的调度层**」，它不抢 token 收费、不绑定模型，把选模型、看 diff、做回退的主动权还给了用户。

> 为什么用 Tauri 而不是 Electron？Tauri 用系统自带的 WebView 渲染，二进制体积更小、内存占用更低，这对一个要同时挂着多个子进程（每个 CLI 一个）的桌面应用至关重要。Electron 套一层 Chromium，光壳子就可能吃掉上百 MB。MonoCode 把「重量」留给了各家 CLI 自身，自己只做薄薄一层调度——这种克制的架构选择，也是它能在本地同时跑 8 家 Agent 还不卡的关键。它解决的不是「哪个模型更强」，而是「我已经有好几个模型，怎么一起用」这个真实痛点。

## 三、RSIAgent：让开源模型自主探索新环境

- **作者**：机器之心（Aether AI）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2651057178&idx=1&sn=3ee4d896a3d3ed5a39c7773752d61d30)
- **日期**：2026-09-15
- **论文**：[arxiv.org/pdf/2609.15364v1](https://arxiv.org/pdf/2609.15364v1)
- **代码**：[github.com/AetherLabsAI/RSIAgent](https://github.com/AetherLabsAI/RSIAgent)
- **网站**：[aetherlabsai.github.io/RSIAgent/](https://aetherlabsai.github.io/RSIAgent/)

### 3.1 核心观点

> **不 Scale Model，Scale Experience**。在不更新模型参数的情况下，让 Agent 像人一样通过探索新环境、发现因果规律、总结经验持续提升能力。

### 3.2 RSI 框架：Recursive Self-Improvement（递归自我提升）

**核心**：围绕一个不断演化的 Memory，构建由 **3 个智能体** 组成的多智能体递归闭环：

| 智能体 | 职责 |
|---|---|
| curriculum agent | 决定下一步应该探索什么 |
| actor agent | 进入环境执行任务并积累经验 |
| verifier agent | 根据真实环境反馈判断结果是否可靠 |

### 3.3 Broad-to-Depth 两阶段自探索

| 阶段 | 比喻 | 过程 |
|---|---|---|
| **Broad Recursive Self-exploration** | 预训练 | curriculum 同时生成多个方向任务 → 多组 actor + verifier 并行执行 → 汇总更新 Memory → 新一轮多方向任务 |
| **Deep Recursive Self-exploration** | 后训练 | curriculum 生成相对困难任务 → actor 用当前 Memory 完成 → verifier 检查 → curriculum 根据暴露的失败/未知/脆弱环节设计更难的 |

### 3.4 核心 Benchmark 结果

| Benchmark | RSIAgent | GPT-6 Astra | Claude Opus 5 |
|---|---|---|---|
| OSWorld 2.0（0808 offline）Partial Score | **78.98%** | 72.60% | - |
| Agents' Last Exam（Near-term） | **84.82%** | 82.26% | - |

> **RSIAgent 基于 GLM-5.3 / Kimi-K3 两个开源模型**，超过 GPT-6 Astra / Claude Opus 5 等闭源模型。

### 3.5 关键实验发现

1. **RSI 推动开源超过前沿闭源**（OSWorld 2.0：71.97% → 78.98%）
2. **可泛化到 Game 场景**（GameCraft-Bench：mechanics / depth / visuals / art 全面提升）
3. **BRS + DRS 缺一不可**（消融实验）
4. **RSI 轮次越多持续进化**，部分任务从 0-40% 初始成功率最终提升到 100%

### 3.6 Aether AI 因果驱动智能体路线

```text
Causal-Copilot      → 因果分析自主完成
C-World             → 开放式工具使用环境
Auto-scaling Memory → 经验沉淀为长期记忆
Hybrid Self-Evolving → 可演化的结构化记忆
StructAgent         → 长程数字智能体 + 统一因果结构
         ↓
     RSIAgent        → 数字环境中的具体实践
```

### 3.7 关键引用（论文）

> Sibo Zhu, Shicheng Fan, Xinyue Wang, Wenyi Wu, Kun Zhou*, Biwei Huang. RSIAgent: Autonomous Exploration for Recursive Self-improvement in New Environments. **2026**.

### 3.8 适合什么人

研究 Agent 自进化 / 因果驱动 AI / 数字智能体的研究者 + 工程团队。

> 亮点解读：这条动态最反直觉的地方在于——**它没换更大的模型，而是让模型「多做事、多复盘」**。在 OSWorld 2.0 上，开源模型靠 RSI 把成功率从 71.97% 推到 78.98%，越过了 GPT-6 Astra 的 72.60%。这对资源有限、但工程能力强的团队是个重要信号：经验闭环可能比堆参数更划算。

> 和传统 RLHF 的区别在哪？RLHF 是「人给反馈、模型改权重」，改一次权重要重新训练；RSI 是「环境给反馈、模型改记忆」，权重不动、只更新 Memory。前者成本高、频率低，后者成本低、可以高频循环。这也是为什么论文里能看到「部分任务从 0-40% 初始成功率最终到 100%」——它不是一次训出来的，是一轮轮探索试出来的。BRS（广度自探索）负责「见多识广」，DRS（深度自探索）负责「把难的啃透」，两个缺一不可，消融实验已经验证了这一点。

## 四、中国 AI 天团杀向 RSI：Atria Dawn Preview

- **作者**：ASI启示录（新智元）
- **来源**：[原文](https://mp.weixin.qq.com/s?__biz=MzI3MTA0MTk1MA==&mid=2652725910&idx=1&sn=20078771c05f66fb259eaacaf80d1a69)
- **日期**：2026-09-15
- **模型权重**：[huggingface.co/internlm/Atria-Dawn-Preview](https://huggingface.co/internlm/Atria-Dawn-Preview)
- **论文**：[github.com/atria-asi/Atria-Dawn-Preview/blob/main/atria-dawn-preview.pdf](https://github.com/atria-asi/Atria-Dawn-Preview/blob/main/atria-dawn-preview.pdf)
- **项目网站**：[atria-asi.ai](https://atria-asi.ai/)

### 4.1 核心观点

> **当 AI 开始帮忙「造 AI」，人类还在忙什么？**——上海人工智能实验室联合复旦、中科院软件所、人民大学、中科院自动化所、华东师大、哈工大共同发布。

### 4.2 两大 Demo 战绩

| Demo | 任务 | 关键指标 |
|---|---|---|
| **天气预测** | 设计并训练 4 亿参数的天气预测模型（ViT 骨干） | **1 分钟**预测未来一周全球天气；45,000 步训练；69 个气象变量；部分指标优于英伟达 FourCastNet |
| **MiniOS** | 从自然语言需求到 MiniOS 操作系统搭建 | **20 分钟**完成 |

### 4.3 研发过程人机分工观察（基于 769 条任务记录 / 56 名参与者）

| 维度 | 数据 | 含义 |
|---|---|---|
| AI 使用率 | 96.5%（713 / 739 项任务） | 用 AI 已成常态 |
| 离不开 AI 的任务 | 33.2%（151 / 455 项） | AI 改变任务可行性边界 |
| AI 提出方案 | 64.6%（367 / 567 项决策） | AI 经常出方案 |
| 人类最终选择 | 85.5%（方案决策） | 多数决策仍由人拍板 |
| 人类在目标/范围的选择 | 93.4% | 几乎全由人定 |
| 人类介入后继续推进 | 76.0%（447 / 588 项） | 多数卡住经人帮忙后继续 |
| AI 自行恢复 | 23.0% | 也有少数能自我修复 |
| 人类接管 | 0.7% | 极少数完全接管 |

### 4.4 Benchmark 表现（8 项基准对比）

| 基准 | 排名 |
|---|---|
| AutomationBench | 🥇 第一 |
| CyberGym | 🥇 第一 |
| SkillsBench | 🥈 第二 |
| Workspace-Bench-Lite | 🥈 第二 |

### 4.5 第三个 Demo：网络安全隔离靶场

```text
网站分析 → 攻击面排查 → 漏洞发现 → 利用 → 修复 → 复验
```

多轮测试排除错误判断，定位真实漏洞，完成攻击、修复和复验。

### 4.6 团队组成

- **96 名主要成员**
- **65 名在校生**（博士 33 + 本硕 32）占比超 2/3
- **31 名正式员工**
- 专项组长中**学生比例 70%**

### 4.7 关键反思（递归自我改进的两大问题）

```text
Q1: AI 做得更快，检验能不能跟上？
  → 训练信号可靠吗？评估漏掉了什么？自我修改有没有偏离原目标？
  → 一轮实验中没被发现的错误，可能被带进下一轮
  → 需要：独立评估 + 可追溯过程记录 + 异常暂停和回退

Q2: 下一次，能不能由 AI 主动请人帮忙？
  → 目标不明确 / 证据冲突 / 必须依赖现实反馈时，继续执行未必能解决问题
  → 模型需要识别：哪些可以自行处理，哪些需要补充信息/专业判断/明确授权
  → 有效的求助 = 卡在哪里 + 有哪些不确定性 + 为什么需要人类 + 反馈用于后续行动
```

### 4.8 适合什么人

研究 Agent / RL / 自进化 / 人机协作的研究者 + AI Lab + 模型团队负责人。

> 亮点解读：Atria Dawn 最有价值的不只是 Demo 多快，而是它**把「人机协作」做成了可量化研究**——96.5% 的任务用到了 AI，但 93.4% 的目标和范围仍由人定，0.7% 才需要人类完全接管。这种「AI 执行、人类定方向」的分工，正是 RSI 落地最现实的形态。

> 更值得玩味的是「人类介入后继续推进 76.0%」和「AI 自行恢复 23.0%」这组对照：大部分卡住的情况靠人点拨一下就活了，只有约 1/4 是 AI 自己绕出来的。这说明现阶段 RSI 还离不开「人在回路」，但它已经能稳定地把人类从「写代码」降到「指方向、解卡点」。再加上团队里 65/96 是在校生、专项组长 70% 是学生——年轻人不是「打下手」，而是真正在主导前沿项目，这对中国 AI 人才梯队是个很强的信号。两个 Demo（1 分钟全球天气、20 分钟手搓 OS）则直观展示了「AI 造 AI」已经从论文走进可复现的工程实践。

## 五、总结：中国 AI 集体发力 RSI

### 5.1 时间线信号

| 日期 | 团队 | 代表作 |
|---|---|---|
| 2026-09-15 | Aether AI | RSIAgent（开源模型超过闭源） |
| 2026-09-15 | 上海 AI Lab + 6 高校 | Atria Dawn Preview（AI 造 AI + 学生主导） |
| 2026-09-15 | 开源 Hub Lab | MonoCode（8 家 CLI 统一桌面） |
| 2026-09-09 | 豆包（字节） | 61 页深度介绍 |

### 5.2 三大趋势

1. **RSI（递归自我提升）成为共识路线**——不 Scale Model，Scale Experience
2. **中国 AI 团队集体发力**：Aether AI + 上海 AI Lab + 字节 + 复旦 + 中科院 + 哈工大
3. **学生团队走到舞台中央**：Atria 65/96 在校生 + 专项组长 70% 学生

### 5.3 三句话记忆点

1. RSIAgent 让 Kimi-K3 / GLM-5.3 在 OSWorld 2.0 超过 GPT-6 Astra（**78.98% vs 72.60%**）
2. Atria 团队 96 人里 65 人是学生，AI 造 AI 已成现实（1 分钟天气预测 / 20 分钟手搓 OS）
3. MonoCode 把 8 家编程 Agent CLI 统一到一个 Tauri 桌面窗口（不抢 token 收费）

### 5.4 产业意义：从「卷模型」到「卷经验」

把这四条动态放在一起看，一条主线很清楚：**2026 Q3 的竞争焦点，正在从「谁的模型更大」转向「谁的系统更能持续进化、更能落地到真实工作」**。MonoCode 解决多模型协同的工程问题，RSIAgent 证明开源模型靠经验闭环能反超闭源，Atria Dawn 把「AI 造 AI + 人机协作」跑成可量化现实，连字节都用 61 页白皮书把工作流能力正式对外定义。对开发者而言，这意味着工具链的「碎片化」会先被统一（像 MonoCode），而能力的「天花板」会被经验驱动的方法持续抬高（像 RSI）。这一波，中国团队在 RSI 路线上声量明显，值得持续跟踪。

---

### ⚠️ 模型与产品名称以发布时为准

本文涉及的模型与产品名称（Kimi-K3 / GLM-5.3 / GPT-6 Astra / Atria Dawn / RSIAgent 等）均来自 2026-09-09 ~ 2026-09-15 期间的公开推送，**具体命名、版本号与能力指标请以各官方发布为准**。AI 领域迭代极快，文中 benchmark 成绩与发布时间可能已有更新，建议读者结合最新官方信息阅读。
