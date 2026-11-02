---
title: Hermes vs OpenClaw（下）：子系统与选型
date: 2026-09-02 00:00:00
description: Hermes vs OpenClaw 下篇：沙箱 / 浏览器 / Memory / Skills 四块横向对比 + 选型决策树。
series:
  name: hermes-vs-openclaw-gateway
  index: 3
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

前两篇聊了哲学、配置、故障、消息流，本篇进到子系统细节——沙箱、浏览器、Memory、Skills 四块横向对比，最后给一张决策树帮你在"我该上哪个"这件事上不纠结。

## 七、子系统对比

### 7.1 沙箱 / 执行后端

| 框架 | 后端 |
|---|---|
| Hermes | local / Docker / SSH / Singularity / Modal（5 种） |
| OpenClaw | Local Docker + SSH + OpenShell（3 种） |

Hermes 多出 Singularity（HPC 环境）+ Modal（云端 serverless）。如果你的工作流里有 HPC 集群或 serverless 训练，Hermes 直接 cover；否则 3 种后端够用。

### 7.2 浏览器栈

| 框架 | 方案 |
|---|---|
| Hermes | Browserbase、Browser Use、Firecrawl、Camofox、本地 Chrome/CDP、本地 Chromium via `agent-browser` |
| OpenClaw | 隔离 managed browser + `user` profile（Chrome MCP 接已登录 Chrome） + Playwright 备份 |

Hermes 的选择面更广，对**新接入的 provider 不挑剔**；OpenClaw 偏向"用一个 Chrome 实例复用 cookie + Playwright 兜底"，对**自动化场景固定、需要带登录态**的任务更顺手。

### 7.3 Memory 模型

- **Hermes**：四层系统——session history + Honcho dialectic 用户画像 + FTS5 全文检索 + procedural memory。token 效率高的 hot/cold 分离（主 prompt 注入 + 归档存储）
- **OpenClaw**：文件式无界，`MEMORY.md` + `memory/YYYY-MM-DD.md`，依赖 FTS5 搜索

简单说：Hermes 的 Memory 是**有界**的（token 上限明确，hot/cold 隔离），适合长期跑、记忆越攒越多；OpenClaw 是**无界**的（按天分文件，全部进 FTS5），适合任务型 agent、跑完即丢。

### 7.4 Skills

- **Hermes**："Where OpenClaw says 'here are 5,700 skills you can install,' Hermes says 'I'll build the skills myself.'"（[Pickaxe](https://pickaxe.co/post/hermes-agent-vs-openclaw)）——自主生成 + 公共目录 + ClawHub 三种来源
- **OpenClaw**：ClawHub marketplace（5700+ skills）+ workspace 挂载

说到底 Hermes 的 Skills 是**生成型**（agent 自己造工具），OpenClaw 的 Skills 是**组装型**（从市场挑现成的）。前者适合"我的需求没人做过"的场景，后者适合"我要快速搭一个标准流水线"的场景。

## 八、选型决策树

别只看 feature 对比——把你自己的痛点列出来走一遍决策树，比 feature 列表靠谱得多：

```
你需要频繁换模型 / 热改 config？
  └─ 是 → Hermes
  └─ 否 → 继续 ↓

你的痛点是"消息接入 + 跨平台控制"？
  └─ 是 → OpenClaw
  └─ 否 → 继续 ↓

你想要 agent 越用越聪明（自主 skill 生成）？
  └─ 是 → Hermes
  └─ 否 → 继续 ↓

你要做大规模 agent 编排 / WebSocket 控制面？
  └─ 是 → OpenClaw
  └─ 否 → 看团队生态，二者都成熟
```

补几条经验：

- 如果你**机器配置不高**（< 4GB RAM），优先 OpenClaw——Hermes 子进程 + session + 四层 memory 跑久了比 OpenClaw 胖
- 如果你要**长期跑一个 agent 半年以上**，选 Hermes——OpenClaw 单点 gateway 跑这么久大概率撞上 #63643
- 如果你团队**已经有人在 OpenClaw 上写了大量 plugin**，迁移成本别忽视——历史投资有时候比技术优势更重

## 九、调研数据来源（三期汇总）

| 来源 | URL | 关键引用 | 交叉验证 |
|---|---|---|---|
| Screenshotone 博客 | [screenshotone.com](https://screenshotone.com/blog/hermes-agent-versus-openclaw) | "agent-first vs gateway-first" 总结 | ✅ 与 trilogyai / lushbinary 一致 |
| TrilogyAI Substack | [trilogyai.substack.com](https://trilogyai.substack.com/p/technical-deep-dive-hermes-vs-openclaw) | "OpenClaw 赌路由，Hermes 赌学习" | ✅ 与 composio / pickaxe 一致 |
| Lushbinary 博客 | [lushbinary.com](https://lushbinary.com/blog/hermes-vs-openclaw-key-differences-comparison) | CVE-2026-25253 / ClawHub 规模 | ✅ 多源印证 |
| Composio 博客 | [composio.dev](https://composio.dev/content/openclaw-vs-hermes-agent) | OpenClaw 适合"重复自动化"，Hermes 适合"长期任务" | ✅ |
| Pickaxe.co | [pickaxe.co](https://pickaxe.co/post/hermes-agent-vs-openclaw) | Hermes 四层 memory / "I'll build skills myself" | ✅ |
| **Hermes 官方文档** | [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs/) | gateway-internals.md / configuration.md / messaging.md / delegation-patterns | 一手源 |
| **OpenClaw 官方文档** | [docs.openclaw.ai](https://docs.openclaw.ai/) | concepts/architecture / cli/sessions / plugins/hooks | 一手源 |
| OpenClaw GitHub Issues | [#13758](https://github.com/openclaw/openclaw/issues/13758) / [#63643](https://github.com/openclaw/openclaw/issues/63643) | Gateway 内存泄漏 + CPU 100% 实测 | 一手 bug 报告 |

**抓取方式**：Tavily（advanced search）+ Exa（search_and_contents），命中权威源 8 个，关键论断均经多源印证。

---

## 十、待跟进问题

- [ ] Hermes 的 "cached-agent signature" 具体是哪几个字段的 hash？（需要翻 `gateway/run.py` 源码确认）
- [ ] OpenClaw 的 plugin 热加载机制是否跟 Hermes 一样有签名检测？
- [ ] 在自己的机器上跑 `ps -o rss,etime,cmd -p <OpenClaw_PID>` 抓一次内存基线，看是否复现 #63643

---

## 系列完结

写完这三期，回头看最值的不是 feature 对比表——是 4.2 节那个实战印证：**改完 config 发一条消息就生效**，这点比任何官方文档的承诺都管用。选型也是同理，与其看 feature list 不如自己跑一遍真实场景。下次有人问我"Hermes 和 OpenClaw 上哪个"，我会先反问一句："你的痛点是热加载、长期记忆、还是消息通道？"答案不同，结论就不同。

> 调研完成于 2026-06-01，源码与官方文档版本同步至当时最新。