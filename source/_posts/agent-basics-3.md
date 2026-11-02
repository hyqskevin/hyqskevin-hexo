---
title: Agent 基础讲解（下）：约束 + 框架对比
date: 2026-09-02 00:00:00
description: Agent 基础讲解下篇：约束先行体系（CLAUDE.md / AGENTS.md / SOUL.md 三大文件对比）、7 大 Agent 框架横评（Claude Code / Codex CLI / OpenClaw / Hermes / Kimi / Dify / Coze）、Harness 三阶段演进、3 个选型决策。
series:
  name: agent-basics
  index: 3
  total: 3
categories:
  - notes
tags:
  - Agent
  - 框架
  - 约束
  - AGENTS.md
  - 选型
---

（上）讲概念 + 工具，（中）讲上下文 + 记忆。本篇（下）讲**约束先行 + 7 大框架横评 + Harness 三阶段**——给项目选型参考。

## 一、约束先行原则

```text
传统开发：先写代码 → 补规范
  → 维护期补规范成本 10×

AI 项目：规范定在动手之前
  → CLAUDE.md / AGENTS.md / SOUL.md = Agent 的"宪法"
  → 写错规范 = Agent 跑错 = 浪费 100 倍 token
```

**核心**：**约束先行**——先写 200 行规范 → AI 在约束内自动执行。

## 二、3 大规范文件

### 2.1 CLAUDE.md（Claude Code）

```markdown
# 全局 CLAUDE.md（~/.claude/CLAUDE.md）

## 我的偏好
- 简洁回答，不客套
- TypeScript > JavaScript
- 详细注释优于简单注释

## 工作流
- 读 / 写 / 测试 / 提交 分 4 步
- 提交前必跑 lint + test

## 禁忌
- 不要用 any 类型
- 不要 console.log 调试（用 debug）
- 不要在 main 分支直接改
```

### 2.2 AGENTS.md（Codex CLI + Kimi Code）

```markdown
# 项目 AGENTS.md（项目根）

## 项目结构
- src/ - 源码
- tests/ - 测试
- docs/ - 文档

## 开发约定
- 用 TypeScript
- 函数 < 50 行
- PR 前跑测试

## 工具配置
- 包管理：pnpm
- 测试：vitest
- 部署：vercel
```

### 2.3 SOUL.md（OpenClaw 风格）

```markdown
# SOUL.md（workspace 根）

## 我是谁
你是"小红"，一个 28 岁的内容创作者
擅长写温暖治愈的文字，讨厌说教

## 我的风格
- 句子短
- 多用比喻
- 永远不说教
- 偶尔自嘲

## 我不做
- 不说大话
- 不写"正能量"
- 不引用名人名言
```

### 2.4 三大文件对比

| 维度 | CLAUDE.md | AGENTS.md | SOUL.md |
|---|---|---|---|
| 层级 | 全局 + 项目双层 | 仅项目 | 仅 workspace |
| 作用 | 个人偏好 + 工作流 | 项目规范 | 人格 + 风格 |
| 长度 | 50-200 行 | 100-300 行 | 50-150 行 |
| 改频 | 偶尔 | 偶尔 | 项目变更时 |
| 注入 | 启动 eager | 启动 eager | 启动 eager |

## 三、3 条约束编写原则

### 3.1 地图而非手册

```text
❌ CLAUDE.md 写 1000 行（手册）
  → Agent 启动加载慢
  → 噪音淹没重点

✅ CLAUDE.md 写 150 行（地图）
  → 重点突出
  → 加载快
  → 维护成本低
```

### 3.2 渐进式披露

```text
❌ 所有 skill 一次性全注入
  → 启动慢 + 上下文挤

✅ 描述符常驻 + 触发加载
  → Skill 描述常驻（100 words/skill）
  → 触发时加载完整内容
  → 加载速度 < 200ms
```

### 3.3 控制在 200 行以内

```text
> 200 行：维护成本指数增长
≤ 200 行：维护成本线性

实际项目：
  - CLAUDE.md 50-150 行
  - AGENTS.md 100-200 行
  - SOUL.md 50-100 行
```

## 四、7 大 Agent 框架横评

| 框架 | 核心定位 | 强项 | 弱项 |
|---|---|---|---|
| **Claude Code** | 强推理 + 代码 | 庞大 skill 生态 | skill 多时启动慢 |
| **Codex CLI** | OpenAI 官方 | AGENTS.md 原生 | 能力相对弱 |
| **OpenClaw** | 跨平台消息中枢 | 5700+ skill | Gateway 单点 |
| **Hermes** | 学习型长跑 agent | 子进程隔离 | 学习曲线 |
| **Kimi Code** | 渐进式披露 | 启动极快 | 国内生态 |
| **Dify** | 低代码 | 非开发者友好 | 复杂任务弱 |
| **Coze** | 字节生态 | 飞书集成 | 海外弱 |

## 五、3 大核心差异

### 5.1 架构核心

```text
OpenClaw：Gateway-First（消息中枢优先）
  → 单进程 gateway 持有所有消息平台连接
  → Agent 是被调度的"乘客"

Hermes：Agent-First（执行隔离优先）
  → gateway 轻 + 子进程 agent
  → 故障半径小
  → 适合长跑任务

Coze / Dify：Platform-First（应用开发优先）
  → 可视化编排
  → 适合非开发者
  → 不适合复杂逻辑
```

### 5.2 Skill 加载

```text
Claude Code：Eager load
  → 启动时全部 skill 加载
  → 30 个 skill → 启动慢

Kimi Code：Progressive disclosure
  → metadata ~100 words/skill 常驻
  → 触发时加载完整内容
  → 启动 < 1s

OpenClaw：Tiered load
  → 核心 metadata 常驻
  → 高频 skill 预热
  → 低频 skill 懒加载

Hermes：Pure lazy
  → 全部懒加载
  → 首次调用慢
```

### 5.3 Memory 模型

```text
Claude Code：
  → Session metadata + 自动摘要
  → 项目级 CLAUDE.md
  → 跨项目需要手动迁移

Hermes：
  → SQLite 压缩（短）
  → 跨 session 自动持久
  → 项目内透明

OpenClaw：
  → MEMORY.md（按天分文件）
  → user / agents / skills 独立
  → 长期可读

Kimi / Dify / Coze：
  → 平台级（云端）
  → 跨项目可用
  → 需账户登录
```

## 六、Harness 三阶段演进

```text
阶段 1：Prompt Engineering
  → 手写完美 prompt
  → 调 model 表现
  → 适合：探索阶段

阶段 2：Context Engineering
  → 自动注入知识 / 工具 / 历史
  → 用 Skill + Memory 扩展
  → 适合：MVP 阶段

阶段 3：Harness Engineering
  → 验收基线 + 反馈 + 回退
  → 自适应 + 自动化
  → 适合：生产阶段
```

**Harness 4 部分**：
1. **验收基线**：每个 Skill 都有 success criteria
2. **执行边界**：Agent 不能做的（需人工）
3. **反馈信号**：怎么判断成功 vs 失败
4. **回退手段**：失败怎么恢复

## 七、5 个选型决策

### 7.1 团队规模

```text
1-2 人：Claude Code 个人版 / Cursor
3-5 人：Dify / Coze（可视化）
5-20 人：Claude Code + Cursor 团队版
20+ 人：OpenClaw / 自建
```

### 7.2 任务类型

```text
代码生成 → Claude Code
通用 agent → Hermes / OpenClaw
企业工作流 → Dify / Coze
长跑任务 → Hermes
```

### 7.3 部署偏好

```text
云端：OpenAI / Anthropic API
本地：Hermes / Ollama
国内：Dify / Coze（合规）
混合：Claude Code + 本地模型
```

### 7.4 成本

```text
按月费：Cursor $20 / Claude Code $20 / Dify 免费
按用量：API 调用费（贵）
按自建：服务器 + 运维费

低成本：Ollama + Hermes
中成本：Claude Code API
高成本：GPT-4 高频调用
```

### 7.5 上手难度

```text
最易：Dify（GUI 拖拽）
中：Coze（GUI 但要写 prompt）
难：Claude Code / Hermes（要写配置文件）
```

## 八、3 个相关项目

- [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) — Claude Code
- [github.com/openai/codex](https://github.com/openai/codex) — Codex CLI
- [github.com/agentscope-ai/agentScope](https://github.com/agentscope-ai/agentScope) — AgentScope 中文

## 九、本文 + 前 2 篇

- （上）概念 + 工具（已写）
- （中）上下文 + 记忆（已写）
- （下）约束 + 框架对比（本文）

---

> **Agent 基础（下）核心**：**约束先行 + 框架对比**。**CLAUDE.md / AGENTS.md / SOUL.md 三大文件**是 Agent 的"宪法"，**写错宪法 = 100× token 浪费**。**选框架先看任务类型**（代码 / 通用 / 工作流 / 长跑），**再看团队规模**（1-2 / 3-5 / 5-20 / 20+），**最后看成本**（自建 / API / SaaS）。**没有银弹**，只有"哪个最适合你"。