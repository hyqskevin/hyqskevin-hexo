---
title: GitHub Awesome Codex Skills 精选
date: 2026-09-06 00:00:00
description: GitHub Awesome Codex Skills 精选：5 类 Skill 一览（开发者工具 / 工具链 / 领域能力 / 编程语言 / 工作流）+ 10 条私藏精选（Codex-Atlas、hermes-agent、oh-my-codex、awesome-claude-code、codex-cli-acp、lstr 主题、Playwright MCP 等），含 stars/作者/适配度/部署方式。
categories:
  - notes
tags:
  - Codex
  - Skills
  - Open Source
  - Agent
  - GitHub
---

Codex 是 OpenAI 的代码专用 LLM，GitHub 上围绕 Codex / Claude Code / OpenCode 已经形成了一个 Skills 生态。本文精选 10 个**实战好用、维护活跃、社区认可度高**的 Skill，按场景分类方便快速挑选。

## 一、5 大 Skill 类型速览

| 类型 | 用途 | 代表项目 |
|------|------|----------|
| 开发者工具 | CLI / 桌面端 / 自动化脚本 | Codex-Atlas、opencode |
| 工具链 | Skills / Plugins / Harness 体系 | hermes-agent、oh-my-codex |
| 领域能力 | 测试 / 文档 / 代码评审 | code-review、test-writer |
| 编程语言 | Python / TS / Rust 专用 | rust-toolkit、python-lsp |
| 工作流 | Git / PR / CI 自动化 | git-helper、pr-assistant |

## 二、10 条精选（按 stars + 实用性排序）

### 1. openai/codex — OpenAI 官方 CLI

- **仓库**：`openai/codex`
- **亮点**：Codex 官方命令行；`codex exec "fix the failing tests"` 直接跑任务；支持云端 + 本地双模式
- **适配度**：⭐⭐⭐⭐⭐（必装）

### 2. openai/openai-cookbook — 官方示例库

- **仓库**：`openai/openai-cookbook`
- **亮点**：100+ 真实场景的代码示例（Function Calling / RAG / 微调 / 评估）
- **适配度**：⭐⭐⭐⭐⭐（学习 + 改写模板）

### 3. anthropics/claude-code — Claude Code 官方 CLI

- **仓库**：`anthropics/claude-code`
- **亮点**：Anthropic 的 Codex 对位产品；`/skill`、`/plugin` 命令支持生态
- **适配度**：⭐⭐⭐⭐⭐

### 4. code-yeongyu/oh-my-opencode — OpenCode 多 Agent 编排

- **仓库**：`code-yeongyu/oh-my-opencode`
- **亮点**：一家配置多家模型（Claude / GPT / Gemini）；Primary + Subagent 分工
- **适配度**：⭐⭐⭐⭐⭐
- **本博客配套文章**：`2026-09-06-oh-my-opencode-agent.md`

### 5. anthropics/skills — Skills 官方示例库

- **仓库**：`anthropics/skills`
- **亮点**：Anthropic 官方 Skills 模板（PDF 处理、Excel 自动化、Notebook 编辑等）
- **适配度**：⭐⭐⭐⭐（Skill 写法参考）

### 6. openai/openai-agents-python — OpenAI Agents SDK

- **仓库**：`openai/openai-agents-python`
- **亮点**：Python 多 Agent 编排 SDK；Guardrails / Handoffs / Tracing 内置
- **适配度**：⭐⭐⭐⭐

### 7. upstash/context7 — MCP 文档查询

- **仓库**：`upstash/context7-mcp`
- **亮点**：通过 MCP 实时查询任何库的最新版文档；解决"训练数据过时"
- **适配度**：⭐⭐⭐⭐⭐（强烈推荐配 OpenCode / Claude Code）

### 8. microsoft/playwright-mcp — Playwright 浏览器自动化

- **仓库**：`microsoft/playwright-mcp`
- **亮点**：浏览器自动化 + 截图 + 表单填写；可与 Kimi WebBridge 对位
- **适配度**：⭐⭐⭐⭐

### 9. sigoden/duffle — GitHub Actions 多任务工具

- **仓库**：`sigoden/duffle`
- **亮点**：用 TypeScript 写 GitHub Actions 复合任务，比 yaml 直观得多
- **适配度**：⭐⭐⭐

### 10. sinewave-hertz/awesome-claude-code — Skills 资源汇总

- **仓库**：`sinewave-hertz/awesome-claude-code`
- **亮点**：Claude Code 生态导航，按用途分类的 Skills / Plugins / Subagents 索引
- **适配度**：⭐⭐⭐⭐

## 三、按场景推荐组合

| 你的目标 | 推荐组合 |
|---------|----------|
| 纯写代码 | `codex` + `oh-my-opencode` + `context7` |
| Claude Code 深度用户 | `claude-code` + `awesome-claude-code` + `anthropics/skills` |
| 多 Agent 系统 | `openai-agents-python` + `oh-my-opencode` + `context7` |
| 浏览器自动化 | `playwright-mcp` + 你的 Kimi WebBridge |
| 学习 + 改写 | `openai-cookbook` + 各 Skills 仓库 README |

## 四、装前必看

1. **Stars ≠ 适合你** — 先看最近 commit 时间，半年没动的慎装
2. **License 看清楚** — MIT / Apache 2.0 友好；AGPL 会传染整个项目（避坑）
3. **依赖管理** — 优先选 Bun/npm 生态；避免奇怪的自制工具链
4. **本地优先** — 别一上来就装云端依赖，本地能跑通再考虑云端
5. **安全** — Skills 会被自动加载到 system prompt，**不要**装来路不明的 Skill

## 五、Quick Start

```bash
# 1. 装 Codex CLI
brew install openai/tap/codex

# 2. 装 OpenCode + 插件
curl -fsSL https://opencode.ai/install | bash
bunx oh-my-opencode install

# 3. 装常用 MCP
npm install -g @upstash/context7-mcp

# 4. 验证
codex "echo hello"
opencode
> @Oracle 帮我看看 oh-my-opencode 安装对不对
```

## 六、参考

- [GitHub Topic: claude-code](https://github.com/topics/claude-code)
- [GitHub Topic: codex](https://github.com/topics/codex)
- [GitHub Topic: mcp-server](https://github.com/topics/mcp-server)
- [awesome-codex-skills 原始源稿](https://github.com/code-yeongyu/awesome-codex-skills)
- 源稿：`4-doc/github/20260522-GitHub Awesome Codex Skil.md`

## 七、小结

**10 个精选**覆盖了从「官方 CLI」到「社区 Skills 导航」的全链路。**最值得现在装的 3 个**：

1. **`openai/codex`** — OpenAI 官方 CLI，新手必装
2. **`upstash/context7`** — 解决 LLM 训练数据过时问题的 MCP（最常用）
3. **`code-yeongyu/oh-my-opencode`** — 一份配置打通多模型 + Subagent 体系（最高 ROI）

读完这篇你大概花了 5 分钟，但能省下未来 5 小时摸索 GitHub 的时间。