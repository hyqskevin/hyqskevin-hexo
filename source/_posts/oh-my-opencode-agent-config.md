---
title: Oh My OpenCode 配置指南
date: 2026-10-18 00:00:00
description: 从零搭建 Oh My OpenCode Agent 系统：覆盖环境准备、安装步骤、配置文件详解、AGENTS.md 项目知识定义与 ULW 工作流实战，附模型版本说明与常见问题排查。
categories:
  - 开发工具
tags:
  - OpenCode
  - AI Agent
  - MCP
  - 配置指南
  - Claude
  - GPT
  - 开发效率
---

> 这是一篇实操向的「Oh My OpenCode Agent」配置笔记，从环境准备一路写到 ULW 全自动工作流，所有配置都给出可直接复制的代码块。

## 一、准备工作

### 1.1 安装 Node.js 或 Bun

Oh My OpenCode 依赖 Node.js 或 Bun 运行时，二选一即可。

- **Node.js**：前往 [nodejs.org](https://nodejs.org/) 下载 LTS 版本
- **Bun**：执行一键安装脚本

```bash
curl -fsSL https://bun.sh/install | bash
```

### 1.2 选择现代终端

官方推荐带真彩色和快速渲染的终端：

- macOS / Linux：Terminal、iTerm2 或 Alacritty
- Windows：Windows Terminal 或 WezTerm

## 二、安装 OpenCode 与 Oh My OpenCode

### 2.1 一键安装 OpenCode（推荐）

```bash
curl -fsSL https://opencode.ai/install | bash
```

### 2.2 包管理器安装

```bash
# macOS / Linux - Homebrew
brew install opencode

# Node.js - npm
npm install -g opencode-ai

# Node.js - pnpm
pnpm install -g opencode-ai

# Windows - Chocolatey
choco install opencode
```

### 2.3 安装 Oh My OpenCode 插件

最省事的方式是让 OpenCode 自己读 README 自动安装：

1. 启动 OpenCode：`opencode`
2. 在对话框中粘贴：

```
Install and configure by following the instructions here https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/README.md
```

3. 跟随终端提示完成授权。

如果更喜欢手动控制：

```bash
bunx oh-my-opencode install
```

### 2.4 离线安装（无网络环境）

在能联网的机器上构建产物，再拷贝到目标机器：

```bash
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode
bun install
bun run build
```

然后在目标机器编辑 OpenCode 配置，加入本地插件路径：

```json
{
  "plugin": [
    "file:///path/to/oh-my-opencode/dist/index.js"
  ]
}
```

## 三、配置 Agent 系统

### 3.1 配置 API 密钥

在 OpenCode 对话框中输入 `/connect`，按提示填入各模型提供商的 Key：

- Anthropic Claude（推荐主力）
- OpenAI ChatGPT
- Google Gemini
- 其他 Oh My OpenCode 支持的模型

### 3.2 理解两类 Agent

- **Primary Agent**：直接和你对话的主代理
  - `Build`（默认，全工具访问，适合写代码）
  - `Plan`（只读，仅做规划与方案）
- **Subagent**：通过 `@` 调用的专家子代理，例如 `General`、`Explore`、`Oracle`、`Frontend Engineer`、`Librarian` 等

### 3.3 自定义配置文件

编辑全局配置文件 `~/.config/opencode/opencode.jsonc`（推荐 `.jsonc` 以支持注释）：

```jsonc
{
  "$schema": "https://opencode.ai/config.json",

  // MCP 工具集配置
  "mcp": {
    "context7": {
      "type": "local",
      "command": ["pnpx", "@upstash/context7-mcp"],
      "enabled": true
    }
  },

  // 模型提供商配置
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com",
        "apiKey": "<YOUR_API_KEY>"
      }
    },
    "openai": {
      "options": {
        "baseURL": "https://api.openai.com/v1",
        "apiKey": "<YOUR_API_KEY>"
      }
    }
  },

  // Agent 配置
  "agents": {
    "primary": [
      {
        "name": "Build",
        "model": "anthropic/claude-opus-4-5-thinking",
        "tools": "all",
        "description": "全功能开发代理，支持所有工具操作"
      },
      {
        "name": "Plan",
        "model": "openai/gpt-5.2",
        "tools": "read-only",
        "description": "仅用于规划和分析，不修改代码"
      }
    ],
    "subagents": [
      {
        "name": "Oracle",
        "model": "openai/gpt-5.2",
        "description": "架构设计、调试和代码审查专家"
      },
      {
        "name": "Frontend Engineer",
        "model": "google/gemini-3-pro",
        "description": "前端UI/UX开发专家"
      },
      {
        "name": "Librarian",
        "model": "anthropic/claude-sonnet-4-5",
        "description": "文档研究和多仓库分析专家"
      }
    ]
  }
}
```

### 3.4 用 AGENTS.md 定义项目知识

在项目根目录新建 `AGENTS.md`，把团队约定和技术栈固化下来，Agent 会自动遵循：

```markdown
# 项目 AGENTS 配置

## 编码规范
- 使用 TypeScript + React
- 遵循 ESLint + Prettier 规范
- 组件使用函数式组件 + Hooks

## 技术栈
- 前端：React 18 + Vite + Tailwind CSS
- 后端：Node.js + Express + PostgreSQL
- 状态管理：Zustand
```

## 四、实战使用

### 4.1 切换 Primary Agent

- 按 `Tab` 键在主代理之间循环切换
- 或输入命令：`/switch-agent <agent-name>`

### 4.2 调用 Subagent

在对话里用 `@` 提及子代理即可：

```
@Frontend Engineer 帮我设计一个深色模式的用户仪表盘
@Oracle 分析一下这个架构的性能瓶颈
@Librarian 查找 React 18 新特性的官方文档
```

### 4.3 Ultrawork 全自动工作流

输入 `ULW` 触发从规划到落地的全自动流程：

```
ULW 开发现代化数据分析仪表盘，包含深色模式和数据可视化
```

## 五、常见问题排查

### 5.1 Agent 不响应

- 确认 API Key 配置正确（注意 `<YOUR_API_KEY>` 已替换为真实值）
- 检查网络是否能访问对应模型提供商的 `baseURL`
- 查看日志：`opencode log`

### 5.2 自定义 Agent 不生效

- 校验配置文件是合法 JSON / JSONC
- 保存后重启 OpenCode
- 确认 Agent `name` 与 `/switch-agent` 命令参数一致

### 5.3 临时切换模型

无需改配置文件，用斜杠命令即可：

```
/model anthropic/claude-opus-4-5
/model openai/gpt-5.2
/model google/gemini-3-pro
```

## 六、模型版本说明

> ⚠️ 以下模型标识以发布时为准，模型版本迭代频繁，请以官方文档最新列表为准。

| 用途 | 配置文件中的模型标识 |
| --- | --- |
| Build 主代理 | `anthropic/claude-opus-4-5-thinking` |
| Plan 主代理 | `openai/gpt-5.2` |
| Oracle 子代理 | `openai/gpt-5.2` |
| Frontend Engineer | `google/gemini-3-pro` |
| Librarian | `anthropic/claude-sonnet-4-5` |

实际配置时建议根据官方 `https://opencode.ai/docs` 当下支持的模型 ID 替换，避免硬编码过期版本号。

## 七、参考资料

- 官方文档：[https://opencode.ai/docs](https://opencode.ai/docs)
- Oh My OpenCode GitHub：[code-yeongyu/oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
- 中文社区：[https://opencodecn.com](https://opencodecn.com)