---
title: OpenClaw 架构剖析（上）：Gateway
date: 2026-09-02 00:00:00
description: OpenClaw Gateway-First 架构范式详解：单进程 gateway、provider adapter、消息路由、4 种 Agent 集成方式（HTTP / WebSocket / CLI / 子进程）、与 Hermes 的关键差异、Gateway 选型决策。
series:
  name: openclaw-architecture
  index: 1
  total: 2
categories:
  - notes
tags:
  - OpenClaw
  - Gateway
  - 架构
  - Agent
  - 选型
---

OpenClaw 把自己定位为"an any-OS gateway for AI agents across chat surfaces"——跨平台消息中枢，Agent 是被调度的"乘客"。本篇（上）讲 Gateway 架构 + 选型决策；下篇讲 Skill / Memory / MCP 集成。

## 一、Gateway-First 架构

OpenClaw 的核心设计哲学是**"消息先于 Agent"**——先把所有聊天平台的消息集中，再调度 Agent 处理。

```text
用户（WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat）
                              ↓
              OpenClaw Gateway（单进程）
                              ↓
              Agent 1 / Agent 2 / Agent 3（被调度的"乘客"）
```

**关键特征**：

- **唯一进程持有 provider 连接**：所有消息平台客户端（WhatsApp Baileys / Telegram grammY / Slack SDK）由 gateway 统一维护
- **一个 host 一个 gateway**：不允许多 gateway 共享 provider 连接
- **事件总线模型**：channel / cron / heartbeat 都从 gateway 推

## 二、Gateway 5 大模块

```text
┌──────────────────────────────────────────────────┐
│              OpenClaw Gateway 进程                │
├──────────────────────────────────────────────────┤
│  Provider Adapter（WhatsApp / Telegram / Slack） │
├──────────────────────────────────────────────────┤
│  Message Bus（事件总线 + 状态）                │
├──────────────────────────────────────────────────┤
│  Session Store（SQLite / 多 Agent 上下文）      │
├──────────────────────────────────────────────────┤
│  Cron Scheduler（定时任务调度）                  │
├──────────────────────────────────────────────────┤
│  Agent Manager（拉起 / 监控 / 重启 Agent）      │
├──────────────────────────────────────────────────┤
│  Plugin Loader（plugin hook 系统）                │
└──────────────────────────────────────────────────┘
```

每个模块职责：

### 2.1 Provider Adapter

```typescript
// src/adapters/whatsapp.ts
import { Baileys } from './baileys'

export class WhatsAppAdapter implements ProviderAdapter {
  async connect() { /* 长连接 */ }
  async sendMessage(to, msg) { /* API 调用 */ }
  async onMessage(handler) { /* 接收消息 */ }
}
```

支持 7+ provider（WhatsApp / Telegram / Slack / Discord / Signal / iMessage / WebChat）。

### 2.2 Message Bus

```typescript
// 事件类型
type Event =
  | { type: 'message.received', channel: string, payload: any }
  | { type: 'agent.started', sessionId: string }
  | { type: 'agent.finished', sessionId: string, result: any }
  | { type: 'cron.fired', jobId: string }

// 事件分发
bus.on('message.received', (event) => {
  agentManager.dispatch(event)
})
```

### 2.3 Session Store

```typescript
// SQLite / PostgreSQL
interface Session {
  id: string
  channel: 'whatsapp' | 'telegram' | ...
  userId: string
  messages: Message[]
  context: Record<string, any>
  lastActiveAt: Date
}
```

### 2.4 Cron Scheduler

```yaml
# gateway.yaml
crons:
  - id: morning-report
    schedule: "0 9 * * *"
    agent: report-agent
    params: { template: "daily" }
  - id: weekly-cleanup
    schedule: "0 2 * * 0"
    command: "rm /tmp/*.log"
```

### 2.5 Plugin Loader

```typescript
// plugin.ts
export default {
  name: 'auto-reply',
  hook: 'message.received',
  handler: async (event) => {
    if (event.payload.text.startsWith('!echo ')) {
      return event.payload.text.slice(6)
    }
  }
}
```

## 三、4 种 Agent 集成方式

OpenClaw 集成 Agent 有 4 种方式：

### 3.1 HTTP（最简单）

```bash
# 启动 Agent
python my_agent.py --port 8080
# 启动 gateway 时配置
agents:
  - name: my-agent
    type: http
    url: http://localhost:8080
```

### 3.2 WebSocket（双向通信）

```typescript
const agent = new WebSocketAgent("ws://localhost:8081/ws")
gateway.registerAgent(agent)
```

### 3.3 CLI（子进程）

```typescript
agents:
  - name: claude
    type: cli
    command: "claude chat"
    work_dir: "/Users/.../projects"
```

### 3.4 自定义 protocol

支持自定义通信协议，SDK 提供 `Agent` 基类。

## 四、与 Hermes 的关键差异

| 维度 | OpenClaw | Hermes |
|---|---|---|
| **架构** | 单进程 gateway | gateway + 子进程 agent |
| **连接管理** | 统一在 gateway | 分散在子进程 |
| **故障域** | gateway 挂了 = 全断 | gateway 轻，挂了影响小 |
| **资源占用** | 重（消息 + cron + 全部 agent） | 轻（只 gateway + 当次 agent） |
| **适合** | 中等规模统一管理 | 大规模 + 高可用 |
| **学习成本** | 中（统一配置） | 中（分进程思维） |

**核心差异**：OpenClaw 强在"统一管理"，Hermes 强在"故障隔离"。

## 五、5 类场景推荐

| 场景 | 推荐 |
|---|---|
| 小团队（< 10 人）+ 3-5 个聊天平台 | **OpenClaw**（统一管理简单） |
| 大团队 + 高可用要求 | **Hermes**（故障隔离强） |
| 个人 + 1-2 个平台 | 两者皆可，选熟悉 |
| 大量定时任务（> 10 个） | OpenClaw（cron 内置） |
| 多设备多网络环境 | Hermes（gateway 轻） |

## 六、3 条避坑

1. **不要让 gateway 跑大量业务逻辑**——只做"消息路由 + 调度"
2. **不要把 database 放 gateway**——gateway 应该是 stateless
3. **不要忽视 plugin 版本**——plugin 升级可能 breaking change

## 七、3 条相关项目

- [openclaw/openclaw](https://github.com/openclaw/openclaw) — OpenClaw 官方
- [openclaw/docs](https://docs.openclaw.ai) — 官方文档
- [openclaw/plugin-examples](https://github.com/openclaw/plugin-examples) — 插件示例

## 八、本文 + 下篇

- （上）Gateway 架构 + 集成（本文）
- （下）Skill / Memory / MCP 集成

---

> **OpenClaw 的价值**："一个进程管理所有聊天 + 调度所有 Agent"——对小团队友好。**但单点故障风险**——gateway 挂了 = 所有消息 + 所有 Agent 一起挂。**规模大了要切到 Hermes**（分布式 gateway + 子进程 agent）。**先 OpenClaw 跑通业务，再切 Hermes 提升可用性**。