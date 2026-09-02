---
title: Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异（中）：运行时行为
date: 2026-09-02 00:00:00
series:
  name: hermes-vs-openclaw-gateway
  index: 2
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

（上）篇我们聊了 Gateway 的设计哲学和架构差异，本篇进到运行时——配置改了多久能生效、挂了会不会波及消息通道、同样一条飞书消息在两边分别走什么路。这三块直接决定"日常运维踩不踩坑"。

## 四、配置热加载对比

### 4.1 Hermes：cached-agent signature + 自动 rebuild

> 关键数据来源：[Hermes 官方 configuration.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md)

Hermes 官方讲得很明确：

> "editing `model.context_length` or any `compression.` key in `config.yaml` on a running gateway takes effect on the next message — no gateway restart, no `/reset`, no session rotation required. The cached-agent signature includes these keys, so the gateway transparently rebuilds the agent when it sees a change. **API keys and tool/skill config still require the usual reload paths.**"

翻译一下：

- `model.*` 和 `compression.*` 改完**下一条消息**生效（gateway 检测到 signature 变了就重建 AIAgent）
- **API key / 工具 / skill 改完必须 reload**

### 4.2 实战印证

最近在飞书 DM 里把 Hermes 主模型从 `MiniMax-M2.7` 换成 `MiniMax-M3`，改完 `~/.hermes/config.yaml` 后：

- Hermes gateway 进程启动时间早于配置改动（`ps -o etime` 验证）
- 下一条消息发出去，`agent.log` 立刻出现：
  ```
  Vision auto-detect: using main provider minimax-cn (MiniMax-M3)
  Auxiliary auto-detect: using main provider minimax-cn (MiniMax-M3)
  ```
- **没重启 gateway，模型就已经切到 M3**

这就是官方那段"cached-agent signature + 自动 rebuild"行为的活样本。这事儿我在 OpenClaw 上试过就不灵——下面解释为什么。

### 4.3 OpenClaw：plugin/cron 都在 gateway 自己里

> 来源：[Lushbinary](https://lushbinary.com/blog/hermes-vs-openclaw-key-differences-comparison) / OpenClaw plugin docs

OpenClaw 把 plugin 和 cron 都装在 gateway 自己进程里——结果是大部分配置改动需要：

- `openclaw config reload` 重载部分配置
- 或者整个 gateway 重启

更糟的是 OpenClaw 已知"updates frequently break existing configs"——82 次发布里出现 11 次这种状况，单点重启几乎成了家常便饭。

**结论**：Hermes 在配置灵活性上明显占优，因为 AIAgent 是按消息重建的，gateway 进程本身不绑定任何模型状态；OpenClaw 因为状态全在胖 gateway 里，几乎没法做到无感热加载。

---

## 五、故障模式对比

### 5.1 OpenClaw 已知故障

> 来源：[#13758](https://github.com/openclaw/openclaw/issues/13758) / [#63643](https://github.com/openclaw/openclaw/issues/63643)

- **Issue #13758**："Gateway process accumulates memory and CPU over long sessions (69% CPU, 1.9GB RSS after 13h)"
- **Issue #63643**："Memory leak: Gateway process memory grows indefinitely"——空闲运行 12–24 小时，从 180MB 长到 400MB+

这都是**单点 gateway 集中化**的代价。session 状态、cron 调度、plugin 加载、provider 连接全在同一个进程里——任何一个泄漏都会污染整个 gateway。

### 5.2 Hermes：故障被隔在子进程里

Hermes 把执行甩到 `hermes chat` 子进程，子进程跑完即退。即使 LLM 工具调用炸了、上下文爆炸了、Python 抛异常，死的只是一个子 agent，gateway 进程和消息通道不受影响。

官方 Delegation 文档：

> 来源：[Hermes 官方 Delegation 文档](https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns)
>
> "Each subagent gets its own terminal session. They can work on the same project directory without stepping on each other."

这意味着 Hermes 里某个 agent 跑炸了，新进来的消息能立刻被路由到下一个新拉起的子进程——比 OpenClaw"重启整个 gateway 等 30 秒"快得多。说到底，两边故障半径的根本差别在这里：Hermes 是进程级隔离，OpenClaw 是单点高风险。

---

## 六、消息流对比

同一个飞书 DM 发条消息过来，Hermes 和 OpenClaw 分别怎么走：

| 步骤 | Hermes | OpenClaw |
|---|---|---|
| ① 飞书发消息 | 飞书 webhook 推到 gateway | 飞书 adapter 推到 gateway |
| ② 鉴权 | gateway 检查 chat_id 是否在白名单 / require_mention | gateway 检查 session 权限 + pair 状态 |
| ③ 路由 | 命中白名单 → 拉起 `hermes chat` 子进程 | 找到对应 session → 复用同进程 agent 上下文 |
| ④ LLM 调用 | 子进程里 AIAgent 调 minimax-cn / M3 | gateway 进程里 agent 调配置好的 provider |
| ⑤ 工具调用 | 子进程独立 terminal，可 `delegate_task` 拉子 agent | gateway 进程内执行，需要 plugin hook 介入 |
| ⑥ 响应回飞书 | 子进程产出文本 → gateway 调飞书 send API | gateway 直接调飞书 send API |
| ⑦ 持久化 | gateway `SessionStore`（SQLite + FTS5） | per-agent SQLite 文件 |

**关键观察**：Hermes 在第 ③ 步发生**进程分裂**——从这一刻起 gateway 不再负责具体执行，只负责消息通道；OpenClaw 从头到尾在同一进程内跑完全部 7 步。第 ⑦ 步两边都用 SQLite + FTS5，但 OpenClaw 是 per-agent 文件，Hermes 是统一 `~/.hermes/state.db`。

这点对我日常运维的影响很直接——要 trace 一条消息在 Hermes 里的完整路径，从 `gateway.log` 跳到子进程的 `agent.log`，再回 `SessionStore`，流程清晰；OpenClaw 全在 gateway 一个进程里，log 量大了之后 trace 难度比 Hermes 高一个量级。

---

## 下期预告

（下）篇讲子系统细节——沙箱、浏览器、Memory、Skills 四块横向对比，再给一张选型决策树帮你判断"我该上哪个"。👉 [（下）：子系统与选型](/2026/09/02/2026-09-02-hermes-vs-openclaw-gateway-3/)

---

> 调研完成于 2026-06-01，源码与官方文档版本同步至当时最新。

---
