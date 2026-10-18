---
title: Oh My OpenCode Agent 配置指南
date: 2026-09-06 00:00:00
description: Oh My OpenCode 一站式配置指南：5 步安装流程（前置 / OpenCode / 插件 / Agent 系统 / 使用）、opencode.jsonc 主配置详解（mcp + provider + agents）、Build vs Plan 决策树、自定义 Subagent、AGENTS.md 项目知识注入、ULW 全自动工作流、6 条常见故障排查。
categories:
  - notes
tags:
  - Oh My OpenCode
  - Agent
  - MCP
  - 多模型
  - Skills
---

Oh My OpenCode 是基于 [OpenCode](https://opencode.ai) 的多 Agent 编排插件，一份配置打通 Anthropic Claude、OpenAI ChatGPT、Google Gemini 等多家模型，配合 Primary + Subagent 体系做复杂开发任务。这篇是 5 步安装流程 + 主配置详解 + 决策树 + 故障排查的一站式指南。

## 一、为什么用 Oh My OpenCode

- **一家配置、多家模型**：不再为每个模型写单独 CLI，OpenCode 提供统一接口
- **主代理 + 子代理**：Primary Agent 全工具调用，Subagent 通过 `@` 唤起，分工清晰
- **AGENTS.md 项目知识注入**：把项目规范、踩坑、约束写进 AGENTS.md，Agent 自动遵守
- **ULW 全自动工作流**：一个 `ULW` 命令触发多步任务自动编排

## 二、5 步安装流程

### Step 1：安装前置环境

```bash
# Node.js LTS（推荐）
node -v  # 确认 ≥ 18

# 或 Bun
curl -fsSL https://bun.sh/install | bash
```

终端推荐：macOS iTerm2 / Linux Terminal / Windows WezTerm。

### Step 2：安装 OpenCode

```bash
# 一键安装（推荐）
curl -fsSL https://opencode.ai/install | bash

# 或 Homebrew
brew install opencode

# 或 npm/pnpm
npm install -g opencode-ai
pnpm install -g opencode-ai
```

### Step 3：安装 Oh My OpenCode 插件

**自动安装**（最省事）：

```bash
# 启动 OpenCode 后在对话框执行
opencode
> Install and configure by following the instructions here https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/README.md
```

**手动安装**：

```bash
bunx oh-my-opencode install
```

**离线安装**（公司内网环境）：

```bash
# 有网机器
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode && bun install && bun run build

# 目标机器：编辑 ~/.config/opencode/opencode.json
{
  "plugin": ["file:///path/to/oh-my-opencode/dist/index.js"]
}
```

### Step 4：配置 Agent 系统

在 OpenCode 中输入 `/connect`，按提示配置：
- Anthropic Claude（推荐主力模型）
- OpenAI ChatGPT
- Google Gemini
- 其他支持的模型

### Step 5：验证

```bash
opencode
> @Oracle 帮我看看这个项目的架构
```

Oracle 回应 = 安装成功。

## 三、主配置文件 `opencode.jsonc` 详解

**位置**：`~/.config/opencode/opencode.jsonc`（推荐 `.jsonc`，自带注释支持）

### 3.1 三层结构

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // 第 1 层：MCP 工具集
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["pnpx", "@upstash/context7-mcp"],
      "enabled": true
    }
  },

  // 第 2 层：模型提供商
  "provider": {
    "anthropic": { "options": { "baseURL": "https://api.anthropic.com", "apiKey": "your-claude-api-key" }},
    "openai":    { "options": { "baseURL": "https://api.openai.com/v1",  "apiKey": "your-chatgpt-api-key" }}
  },

  // 第 3 层：Agent 体系
  "agents": {
    "primary":  [ /* 主代理列表 */ ],
    "subagents": [ /* 子代理列表 */ ]
  }
}
```

⚠️ **API Key 安全**：`apiKey` 字段**不要** commit 到 git。建议用环境变量：

```jsonc
"provider": {
  "anthropic": {
    "options": {
      "baseURL": "https://api.anthropic.com",
      "apiKey": "{env:ANTHROPIC_API_KEY}"
    }
  }
}
```

### 3.2 Primary vs Subagent 决策树

```
你的任务是什么？
  │
  ├─ 需要改代码 / 跑命令 / 写文件 → Primary（Build）
  │
  ├─ 只规划 / 分析 / 不修改 → Primary（Plan）
  │
  └─ 调用特定专家 → Subagent
       │
       ├─ 架构设计 / 调试 → @Oracle
       ├─ 前端 UI/UX → @Frontend Engineer
       └─ 文档 / 多仓分析 → @Librarian
```

### 3.3 自定义 Subagent 模板

在 `subagents` 数组里追加：

```jsonc
{
  "name": "MySQL-Expert",
  "model": "anthropic/claude-sonnet-4-5",
  "description": "MySQL 索引优化与 SQL 调优专家",
  "tools": ["bash", "read"],
  "prompt": "你是 MySQL 调优专家，专注于索引设计、慢查询分析、EXPLAIN 解读。所有建议必须可执行。"
}
```

`tools` 控制可调用工具（默认全开）；`prompt` 给子代理注入系统提示词。

## 四、`AGENTS.md` 项目知识注入

在**项目根目录**创建 `AGENTS.md`，写项目特定的规则和约束：

```markdown
# 项目 AGENTS 配置

## 编码规范
- 使用 TypeScript + React
- 遵循 ESLint + Prettier
- 组件用函数式 + Hooks

## 技术栈
- 前端：React 18 + Vite + Tailwind
- 后端：Node.js + Express + PostgreSQL
- 状态管理：Zustand

## 踩坑记录
- 不要直接 DELETE FROM users，先 WHERE id = ?
- /api/* 路由必须走 JWT 校验
```

Agent 启动时会自动加载这个文件，作为项目级 system prompt。

## 五、ULW 全自动工作流

在 OpenCode 对话框输入 `ULW`（Ultrawork）触发全自动开发：

```
ULW 开发现代化数据分析仪表盘：深色模式 + 数据可视化 + 响应式布局
```

Oh My OpenCode 会自动：
1. 拆任务为多步
2. 调用合适的 Subagent
3. 边写边验证（跑测试 + lint）
4. 出错自动回滚重试

适合**有明确目标的中小型项目**（CRUD 页面、Dashboard、API Wrapper）。不适合需要大量人工判断的架构决策。

## 六、常见故障排查

| 症状 | 排查方向 |
|------|----------|
| Agent 不响应 | API Key 是否正确（`/connect` 重配）+ 网络 + `opencode log` 看错 |
| 自定义 Agent 不生效 | 配置文件格式（JSON / JSONC）+ 重启 OpenCode + Agent 名称一致 |
| MCP 工具不出现 | `mcp.<name>.enabled: true` + 命令路径正确 + 终端输出 |
| 模型切换失败 | 斜杠命令 `/model anthropic/claude-opus-4-5`，确认 model 名在 `provider.<name>.options` 里注册过 |
| 子代理报错 | `name` 唯一 + `description` 不要为空 + `tools` 是字符串数组不是对象 |
| ULW 卡死 | 网络问题或任务过大；拆成多个 `ULW` 子任务分别跑 |

## 七、模型版本说明

本文示例用的模型名（`claude-opus-4-5-thinking` / `gpt-5.2` / `gemini-3-pro` / `claude-sonnet-4-5`）是源稿当时的版本，**以你部署时的官方支持列表为准**。改模型前先跑 `/model <name>` 验证 OpenCode 是否支持该标识符。

## 八、参考资源

- [OpenCode 官方文档](https://opencode.ai/docs)
- [Oh My OpenCode GitHub](https://github.com/code-yeongyu/oh-my-opencode)
- [OpenCode 中文社区](https://opencodecn.com)
- 源稿：`4-doc/20260213-Oh My Opencode agent配置指南.md`

## 九、小结

5 步流程：**Node → OpenCode → Oh My OpenCode → /connect → @Oracle 验证**。配置三层：**MCP → provider → agents**。项目知识靠 **`AGENTS.md`** 注入。复杂任务用 **`ULW`** 一键触发。

第一次跑通后，建议立刻给 `~/.config/opencode/opencode.jsonc` 改成环境变量模式（`{env:ANTHROPIC_API_KEY}`），避免 API Key 进 git 历史。
