---
title: Hermes vs OpenClaw（上）：设计哲学
date: 2026-09-02 00:00:00
description: Hermes Agent-First vs OpenClaw Gateway-First 的设计哲学对比。两者都是单进程 gateway，但 Hermes 把"执行"甩到子进程、OpenClaw 塞回 gateway 自己，故障半径完全不同。
series:
  name: hermes-vs-openclaw-gateway
  index: 1
  total: 3
categories:
  - notes
tags:
  - Agent
  - Hermes
  - OpenClaw
  - Gateway
  - Multi-Agent
---

最近在做 Hermes 和 OpenClaw 的 Gateway 架构对比，这事一开始只是想搞清楚"为啥这俩长得像但又不一样"，翻了 8 个一手 / 二手源、跑了一遍 Hermes 的实际配置热加载，写完整篇发现 5800 字——按我自己定的规矩（>3000 必须拆），只能拆成 3 期。本篇是（上），先放全文 TL;DR 和哲学 / 架构部分。

## 一、TL;DR

| 维度 | Hermes Agent | OpenClaw |
|---|---|---|
| 定位 | 学习型 agent 运行时 | 消息基础设施 |
| Gateway 形态 | 轻量 dispatcher + 每条消息拉起 `hermes chat` 子进程 | 单进程 gateway 持有所有 session/cron/channel/plugin |
| 配置热加载 | `model.*` / `compression.*` 改完**下一条消息**生效；API key / tool / skill 需重启 | 大部分配置需要重启 gateway 或 reload channel |
| 多 agent 协作 | `delegate_task` 拉起隔离子 agent（独立 terminal + 上下文） | 多 agent bindings + WebSocket 节点 |
| 故障隔离 | 子进程挂了不影响消息接入，gateway 自身轻 | 单点 gateway，挂了所有 channel 全断；已知有内存泄漏 + CPU 100% bug |
| 沙箱后端 | 5 种（local / Docker / SSH / Singularity / Modal） | Local Docker + SSH + OpenShell |
| Memory 模型 | `MEMORY.md`+`USER.md`，有界注入，Honcho dialectic | `MEMORY.md`+`memory/YYYY-MM-DD.md`，按天分文件 |
| Skills | 自主生成 / 安装 / 公共目录拉取 | workspace 挂载 + ClawHub marketplace（5700+） |
| 语音 | Telegram 语音 / Discord 语音频道 / Discord DM 朗读 | 文档中未见明显支持 |

**一句话**：两边都是单进程 gateway，但 Hermes 把"执行"甩到子进程，gateway 只负责分发；OpenClaw 把"执行"塞回 gateway 自己。两者的故障半径完全不同。

## 二、设计哲学：Agent-First vs Gateway-First

> 来源：[Screenshotone](https://screenshotone.com/blog/hermes-agent-versus-openclaw) / [Lushbinary](https://lushbinary.com/blog/hermes-vs-openclaw-key-differences-comparison) / Reddit r/better_claw

Hermes 官方讲自己是个 "agent that grows with you"——会学习的长期 agent，消息渠道只是它暴露的众多接口之一。

OpenClaw 官方讲自己是 "an any-OS gateway for AI agents across chat surfaces"——跨平台的消息中枢，agent 是被它调度起来的"乘客"。

TrilogyAI 这话更到位：

> [OpenClaw 的赌注是"路由和控制"是难题，Hermes 的赌注是"记忆和自我进化"是难题。](https://trilogyai.substack.com/p/technical-deep-dive-hermes-vs-openclaw)

不过别把这话当绝对结论——两边都在往中间靠。Hermes 加了 cron / 多平台，Hermes 也有自己的"单 gateway"概念；OpenClaw 也有 memory / skills。区别在**中心抽象**，不是 feature 清单。

## 三、Gateway 架构对比

### 3.1 OpenClaw：单进程全栈

> 来源：[docs.openclaw.ai/concepts/architecture](https://docs.openclaw.ai/concepts/architecture)

官方文档原文：

- "A single long-lived Gateway owns all messaging surfaces (WhatsApp via Baileys, Telegram via grammY, Slack, Discord, Signal, iMessage, WebChat)."
- "One Gateway per host; it is the only place that opens a WhatsApp session."
- "Maintains provider connections. Exposes a typed WS API (requests, responses, server-push events). Validates inbound frames against JSON Schema. Emits events like `agent`, `chat`, `presence`, `health`, `heartbeat`, `cron`."

**关键点**：

- Gateway 是**唯一持有 provider 连接**的进程
- 一切经过 WebSocket JSON Schema
- 事件总线模型，所有 channel/cron/heartbeat 都从 gateway 推
- 默认端口 `127.0.0.1:18789`

说到底这是"所有鸡蛋放一个篮子"的设计——好处是控制面统一、节点间通信简单；坏处留到（中）讲故障时再展开。

### 3.2 Hermes：轻量 dispatcher + 子进程

> 来源：[Hermes gateway-internals.md](https://hermes-agent.nousresearch.com/docs/developer-guide/gateway-internals.md) / [architecture](https://hermes-agent.nousresearch.com/docs/developer-guide/architecture)

官方原文：

- "The messaging gateway is the long-running process that connects Hermes to 20+ external messaging platforms"
- `GatewayRunner` 在 `gateway/run.py`，负责 slash 命令 + 消息分发
- 收到消息后调用 `_handle_message()` → 决定走「Slash 命令」「`AIAgent` 构造」还是「Queue/BG session」

**关键差异在 AIAgent 的构造时机**：`AIAgent` **不是** gateway 启动时创建的常驻对象，而是**每条消息触发时新建一次**。`AIAgent.__init__` 会读 `config.yaml` 的 `model.*` 字段，这就是为什么改 `model.default` 之后，下一条消息来时 gateway 调起新的 `hermes chat` 子进程就会读新值。

### 3.3 一张图看清差别

```
┌─────────────── OpenClaw Gateway ───────────────┐
│  全部塞进一个 Node.js 进程：                      │
│  • WhatsApp/Telegram/Slack 适配器（长连接）        │
│  • Session store（SQLite）                        │
│  • Cron 调度器                                    │
│  • Plugin 加载器                                  │
│  • Agent 运行时（ReAct loop）                     │
│  • WebSocket control plane（CLI / Web UI / 节点） │
│  端口 18789                                       │
└──────────────────────────────────────────────────┘

┌─────────────── Hermes Gateway ──────────────────┐
│  轻量 Python 进程，只做：                          │
│  • 20+ 平台适配器（长连接）                        │
│  • Slash 命令分发                                  │
│  • Pairing / 授权                                  │
│  • 收到消息 → 拉起 hermes chat 子进程（隔离）      │
│  ┌─────────────────────────────────────────┐     │
│  │ hermes chat（子进程，每次新拉起）        │     │
│  │  • AIAgent 构造（读 config.yaml）        │     │
│  │  • 工具调度 / 工具执行                   │     │
│  │  • 上下文压缩 / 提示词构造               │     │
│  │  • LLM 调用                              │     │
│  └─────────────────────────────────────────┘     │
│  进程隔离 → 子进程挂掉不影响消息接入                │
└──────────────────────────────────────────────────┘
```

图里能看出来核心差别：OpenClaw 是一个胖进程啥都管；Hermes 是瘦 gateway + 子进程扛活。

## 下期预告

（中）篇讲运行时行为——配置热加载、Hermes 的 "cached-agent signature + 自动 rebuild" 实战、OpenClaw 的 Issue #13758 / #63643 故障模式，以及同一条飞书消息在两边分别走什么路。👉 [（中）：运行时行为](/2026/09/02/hermes-vs-openclaw-gateway-2/)

---

> 调研完成于 2026-06-01，源码与官方文档版本同步至当时最新。