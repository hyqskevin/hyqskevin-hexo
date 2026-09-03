---
title: AI Agent 配置系统对比
date: 2026-09-02 00:00:00
description: 主流 AI Coding Agent 配置系统对比：Hermes / OpenClaw / Claude Code / Codex CLI / AgentMD（AGENTS.md）/ SOUL.md。6 维度（启动加载 / skill 机制 / 配置文件 / memory 管理 / 启动速度 / 启动体积）横向比较。
categories:
  - notes
tags:
  - AI Agent
  - Hermes
  - OpenClaw
  - Claude Code
  - Skill
  - 配置
---

发现一个问题：Claude Code 的 skill 过多会导致 system prompt 启动加载变慢（数 GB skill 内容 eager load），而 Hermes 没这个问题。这篇是 6 个主流 AI Agent 配置系统的**横向对比 + 实战推荐**。

## 一、6 维度对比矩阵

| 工具 | 启动加载 | skill 机制 | 配置 | memory | 启动速度 | 启动体积 |
|---|---|---|---|---|---|---|
| **Hermes** | lazy | 自定义 .md | TOML/JSON | session 级 | 极快 | 小 |
| **OpenClaw** | lazy | workspace skill | JSON5 | workspace 级 | 快 | 中 |
| **Claude Code** | eager | 自动加载 .md | Markdown + settings.json | 项目级 | 慢 | 大 |
| **Codex CLI** | lazy | 自定义 .toml | TOML | 项目级 | 快 | 小 |
| **AgentMD** | lazy | 模板化 | AGENTS.md | repo 级 | 快 | 中 |
| **SOUL.md** | lazy | 单文件 | Markdown | workspace 级 | 快 | 极小 |

**核心差异**：**启动加载策略**（eager vs lazy）决定启动速度与体积。

## 二、6 个工具详解

### 2.1 Hermes

```text
~/.hermes/
├── config.toml          # 主配置
├── skills/               # 自定义 skill
│   ├── code-review.md
│   └── docker.md
└── workspace/            # 工作区
    └── MEMORY.md
```

**特点**：
- **lazy load**：skill 按需加载，不一次全部读取
- session 级 memory：每个 session 独立
- 小巧：< 10 MB 总配置

### 2.2 OpenClaw

```text
.claw/
├── workspace.json5       # 主配置
├── skills/                # workspace skill
├── plugins/               # 插件
└── SOUL.md                # 灵魂 / 风格
```

**特点**：
- lazy load + workspace 级
- 5 步仓库加载流程
- 适合"一个项目一个 SOUL" 的场景

### 2.3 Claude Code（Anthropic）

```text
~/.claude/
├── CLAUDE.md             # 主风格 + memory
├── skills/                # skill 自动加载
│   └── ...
└── settings.json          # 权限 / 钩子
```

**特点**：
- **eager load**：skill 启动时**全部**读入 system prompt
- 项目级 memory（CLAUDE.md）
- 大配置：skill 多时 system prompt 可能数 GB

**问题**（GitHub Issue #16160）：skill 超过 30-50 个时启动明显变慢。

### 2.4 Codex CLI（OpenAI）

```text
~/.codex/
├── config.toml            # 主配置
├── skills/                # 自定义 skill
│   └── *.toml
└── AGENTS.md              # 仓库级指引
```

**特点**：
- lazy load
- 项目级 AGENTS.md（与 AgentMD 共享）
- 强调确定性配置（TOML）

### 2.5 AgentMD

```text
# 项目根
AGENTS.md                # 项目级 agent 指引
.claude/
└── skills/                # Claude 兼容
```

**特点**：
- **单文件规范**（AGENTS.md）
- 跨工具兼容（Claude / Codex / OpenClaw 都读）
- lazy load
- 简单但功能有限

### 2.6 SOUL.md（OpenClaw）

```text
# workspace 根
SOUL.md                   # 单文件风格
```

**特点**：
- **极简**（一个 markdown 文件）
- 定义 agent 性格 + 价值观
- workspace 启动时读

## 三、4 大核心维度对比

### 3.1 启动加载策略

| 策略 | 代表 | 优点 | 缺点 |
|---|---|---|---|
| **eager**（启动全读） | Claude Code | 启动后即用 | skill 多时慢 |
| **lazy**（按需加载） | Hermes / OpenClaw | 启动快 | 首次调用 skill 略慢 |
| **template**（模板化） | Codex / AgentMD | 配置标准化 | 不够灵活 |

**实战建议**：
- 个人项目 → lazy（Hermes / OpenClaw）
- 大型项目（skill 多）→ eager + 拆分（Claude Code 但分多个 workspace）
- 标准化需求 → template（Codex / AgentMD）

### 3.2 Skill 管理

| 工具 | skill 格式 | 加载方式 | 数量限制 |
|---|---|---|---|
| Hermes | .md | lazy | 无 |
| OpenClaw | workspace | lazy | 无 |
| Claude Code | .md | **eager** | 30-50（多了会卡） |
| Codex | .toml | lazy | 无 |
| AgentMD | .md | lazy | 无 |

**核心问题**：Claude Code 是**唯一** eager load 的，导致 skill 多了启动变慢。

### 3.3 Memory 管理

| 工具 | 范围 | 持久化 |
|---|---|---|
| Hermes | session | 自动 |
| OpenClaw | workspace | 文件 |
| Claude Code | project（CLAUDE.md） | git commit |
| Codex | project | git commit |
| AgentMD | repo | 文件 |

**对比**：
- session 级：短上下文，跨 session 不共享
- workspace 级：每个项目独立
- project 级：随项目 git 走，跨机器同步

### 3.4 配置文件格式

| 工具 | 主配置 | 格式 | 注释风格 |
|---|---|---|---|
| Hermes | config.toml | TOML | # |
| OpenClaw | workspace.json5 | JSON5 | // |
| Claude Code | settings.json | JSON | // |
| Codex | config.toml | TOML | # |
| AgentMD | AGENTS.md | Markdown | 自然语言 |
| SOUL.md | SOUL.md | Markdown | 自然语言 |

**TOML vs JSON5**：
- TOML：严格、人类可读、适合结构化
- JSON5：宽松、支持注释、适合嵌套深

**Markdown（AGENTS.md / SOUL.md）**：
- 优点：人 + AI 都可读
- 缺点：没有结构校验

## 四、5 条实战建议

### 4.1 skill 控制在 20-30 个以内

不管是哪个工具，skill 多于 30 个就难维护。建议：

```text
skill 分层：
  通用 skill（5-10 个）：代码风格、git、测试、文档
  领域 skill（10-15 个）：按业务线拆分
  项目 skill（5-10 个）：只给当前项目用
```

### 4.2 用 lazy load 工具

如果你有 30+ skill → 选 Hermes / OpenClaw / Codex，**不要选 Claude Code**。

### 4.3 AGENTS.md 作为项目级"主入口"

不管你用哪个 Agent，**项目根写一份 AGENTS.md** 是必备的：

```markdown
# AGENTS.md

## 项目概述
本项目是 X 系统，用 Y 技术栈。

## 开发约定
- 用 TypeScript
- 提交前跑测试
- 不用 any

## 测试
- 单测：npm test
- E2E：npm run e2e

## 不要做
- 不要改 db 迁移文件
- 不要直接 push main 分支
```

**所有 Agent（Claude / Codex / OpenClaw / Hermes）都读这个文件**。

### 4.4 memory 要分"长期 vs 短期"

```text
~/.hermes/MEMORY.md       # 长期（你是什么样的人）
.workspace/MEMORY.md    # 项目级（这个项目是什么样的）
~/.hermes/session-xxx/   # 短期（这次对话）
```

混淆 memory 范围 = AI 困惑 = 输出质量下降。

### 4.5 定期 review 配置

每 3 个月 review 一次：

```bash
# 哪些 skill 没用过？
# 哪些 memory 已过时？
# 哪些 workflow 跑得不顺？
```

## 五、3 条避坑

1. **不要"skill 越多越好"**——20-30 个是甜区
2. **不要混用多个 Agent**（同一项目用 Hermes + Claude Code）——配置冲突
3. **不要在 main 分支改 SOUL.md / CLAUDE.md**——配置改动单开 PR

## 六、3 个相关项目

- [Piebald-AI/claude-code-system-prompts](https://github.com/Piebald-AI/claude-code-system-prompts) — Claude Code prompt 收集
- [anthropics/claude-code/issues/16160](https://github.com/anthropics/claude-code/issues/16160) — skill 加载性能问题
- [agentmd/agent.md](https://github.com/agentmd/agent.md) — AGENTS.md 规范

---

> **核心洞察**：**配置是 AI 项目的"代码"**——和代码一样需要 review、测试、版本控制。**CLAUDE.md / SOUL.md / config.toml 不只是给 AI 看的，更是给团队对齐用的文档**。**配置管理 = 项目管理**。