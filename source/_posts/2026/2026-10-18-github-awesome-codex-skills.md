---
title: GitHub Codex 技能精选
date: 2026-10-18 00:00:00
description: GitHub 上 Codex / Claude Code 官方与社区精选 Skills、Plugins 资源汇总。23 个高星项目，按官方权威、Awesome 列表、专用技能、插件、Agent 框架分类整理，含安装命令与参考价值。
categories:
  - notes
tags:
  - Codex
  - Skills
  - Claude Code
  - GitHub
  - Awesome
  - AI 工具
---

最近为了搭 Agent 工具链，扫了一遍 GitHub 上"codex skills"和"codex plugins"的高星项目。整理成一份导航表，方便后续选型。

![cover](https://hyqskevin.github.io/pic/notes/github-awesome-codex-skills.png)

## 一、数据来源

- 搜索词：`codex skills` / `codex plugins`
- 排序：按 star 数倒排
- 抓取方式：浏览器自动化脚本一次性快照
- 抓取时间：2026-05-21

> star 数只是"关注度"参考，不代表项目质量。挑选时仍要看最近 commit、issue 响应、license。

## 二、官方权威

这一类优先用，最稳定。

### 2.1 openai/skills ⭐ 19.8k

- 链接：<https://github.com/openai/skills>
- Codex 官方 Skills 目录，官方维护
- 语言：Python
- 最近更新：8 小时前

### 2.2 anthropics/claude-plugins-official ⭐ 22.6k

- 链接：<https://github.com/anthropics/claude-plugins-official>
- Claude Code 官方插件目录
- 注：官方仓库通常用作权威性参考，具体安装还是要走官方 CLI

## 三、Awesome 技能列表

社区维护的精选导航，适合"先看一圈有哪些可选"。

### 3.1 ComposioHQ/awesome-codex-skills ⭐ 10.8k

- 链接：<https://github.com/ComposioHQ/awesome-codex-skills>
- Codex 实用技能精选，用于自动化工作流
- 兼容 Codex CLI 和 API
- 标签：`awesome`、`skills`、`codex`
- 语言：Python
- 最近更新：6 天前

### 3.2 sickn33/antigravity-awesome-skills ⭐ 38.3k

- 链接：<https://github.com/sickn33/antigravity-awesome-skills>
- 可安装的 GitHub 技能库，**1400+ 技能**
- 兼容 Claude Code / Cursor / Codex / Gemini CLI / Antigravity
- 语言：Python
- 最近更新：7 小时前

### 3.3 VoltAgent/awesome-agent-skills ⭐ 22.6k

- 链接：<https://github.com/VoltAgent/awesome-agent-skills>
- 1000+ Agent 技能精选，官方开发团队 + 社区贡献
- 兼容 Claude Code 和 Codex
- 最近更新：11 天前

### 3.4 ComposioHQ/awesome-claude-skills ⭐ 61.1k

- 链接：<https://github.com/ComposioHQ/awesome-claude-skills>
- Claude 技能精选列表，自动化工作流定制资源
- 语言：Python
- 最近更新：2 天前

### 3.5 alirezarezvani/claude-skills ⭐ 15.8k

- 链接：<https://github.com/alirezarezvani/claude-skills>
- **313+ Claude Code skills + plugins 集合**
- 兼容 Codex / Gemini CLI / Cursor
- 语言：Python
- 最近更新：8 小时前

## 四、专用技能

聚焦单一场景的 skill / skill manager。

### 4.1 kepano/obsidian-skills ⭐ 32.4k

- 链接：<https://github.com/kepano/obsidian-skills>
- Obsidian Agent 技能
- 教会 Agent 使用 Markdown / Bases / JSON Canvas / CLI
- 标签：`cli`、`skills`、`opencode`、`obsidian`、`codex`
- 最近更新：14 天前

### 4.2 Dimillian/CodexSkillManager ⭐ 1.1k

- 链接：<https://github.com/Dimillian/CodexSkillManager>
- macOS 上管理 Codex 技能的桌面应用
- 语言：Swift
- 最近更新：1 月 18 日

### 4.3 Dimillian/Skills ⭐ 3.5k

- 链接：<https://github.com/Dimillian/Skills>
- 个人 Codex 技能集，Shell 形式
- 语言：Shell
- 最近更新：3 月 29 日

## 五、Plugin 项目

围绕 Codex / Claude Code 的 IDE、Shell、认证插件。

### 5.1 hashgraph-online/awesome-codex-plugins ⭐ 270

- 链接：<https://github.com/hashgraph-online/awesome-codex-plugins>
- Awesome Codex Plugins 精选列表，自称 "#1 Codex Marketplace"
- 语言：Python
- 最近更新：昨天

### 5.2 zhukunpenglinyutong/jetbrains-cc-gui ⭐ 3.6k

- 链接：<https://github.com/zhukunpenglinyutong/jetbrains-cc-gui>
- JetBrains 平台的 Claude Code + Codex GUI 插件
- 语言：TypeScript
- 最近更新：2 天前

### 5.3 EveryInc/compound-engineering-plugin ⭐ 17.1k

- 链接：<https://github.com/EveryInc/compound-engineering-plugin>
- 官方 Compound Engineering 插件
- 兼容 Claude Code / Codex / Cursor
- 语言：TypeScript
- 最近更新：21 分钟前（活跃度极高）

### 5.4 tom-doerr/zsh_codex ⭐ 1.7k

- 链接：<https://github.com/tom-doerr/zsh_codex>
- ZSH 插件，让你在命令行直接调 Codex AI
- 语言：Python
- 最近更新：2025-03-23

### 5.5 numman-ali/opencode-openai-codex-auth ⭐ 2.1k

- 链接：<https://github.com/numman-ali/opencode-openai-codex-auth>
- OAuth 认证插件，用于 ChatGPT Plus/Pro 订阅的 Codex
- 适合不想单独买 API 额度的用户
- 语言：TypeScript
- 最近更新：1 月 9 日

### 5.6 YishenTu/claudian ⭐ 11.6k

- 链接：<https://github.com/YishenTu/claudian>
- Obsidian 插件，在 Vault 内嵌入 Claude Code / Codex 作为 AI 协作者
- 语言：TypeScript
- 最近更新：昨天

### 5.7 fcakyon/claude-codex-settings ⭐ 700

- 链接：<https://github.com/fcakyon/claude-codex-settings>
- 个人 Claude Code + Codex 设置集合
- 含经过测试的 skills / plugins / hooks / agents
- 语言：Python
- 最近更新：12 天前

### 5.8 RoggeOhta/awesome-codex-cli ⭐ 199

- 链接：<https://github.com/RoggeOhta/awesome-codex-cli>
- **150+ 工具、技能、子代理、插件精选列表** for Codex CLI
- 最近更新：4 月 11 日

### 5.9 johnseth97/codex.nvim ⭐ 241

- 链接：<https://github.com/johnseth97/codex.nvim>
- Neovim 的 Codex 插件
- 语言：Lua
- 最近更新：2025-11-20

## 六、Agent / 开发框架

把 Codex / Claude Code 当成 Agent 平台用的周边工程。

### 6.1 affaan-m/ECC ⭐ 188k

- 链接：<https://github.com/affaan-m/ECC>
- Agent 马具（harness）性能优化系统
- 包含 skills / instincts / memory / 安全模块
- 优先支持 Claude Code / Codex 研究型开发
- 语言：JavaScript
- 最近更新：昨天

### 6.2 coreyhaines31/marketingskills ⭐ 29.9k

- 链接：<https://github.com/coreyhaines31/marketingskills>
- Claude Code + AI Agent 营销技能集
- 覆盖 CRO、文案、SEO、分析、增长工程
- 语言：JavaScript
- 最近更新：2 小时前

## 七、源码与示例

想自己改 / 自己研究的人，直接看源码。

### 7.1 openai/codex

- 链接：<https://github.com/openai/codex>
- Codex 官方源码

### 7.2 anthropics/claude-code-examples

- 链接：<https://github.com/anthropics/claude-code-examples>
- Claude Code 使用示例与教程

## 八、安装方式

### 8.1 通过 Codex skill-installer

```bash
codex skill install <owner>/<repo> --path skills/<skill-name>
```

### 8.2 通过安装脚本

```bash
python3 scripts/install-skill-from-github.py --repo <owner>/<repo> --path skills/<skill-name>
```

> 两种方式都需要在本地已有 Codex / Claude Code 运行环境的机器上执行；`<owner>/<repo>` 替换成上面表格里的项目地址即可。

## 九、选型建议

简单几句：

1. **先看官方目录**（第二节），再去看社区 awesome（第三节），不要反着来。
2. **专用技能**（第四节）适合你已经确定要解决什么问题。
3. **Plugin 项目**（第五节）挑活跃的（看 commit 时间），冷仓库 star 刷的居多。
4. **Agent 框架**（第六节）属于"重型改造"，小项目没必要上。
5. **安装前**先看 license（MIT / Apache-2.0 通常安全，部分项目是 AGPL 或非商用，注意合规）。

## 模型版本说明

本文涉及的"Codex"、"Claude Code"等模型 / 产品名以**发布时**官方文档为准，star 数和最近更新时间均抓取自 2026-05-21 快照。

> ⚠️ 项目状态、版本号、价格、license 可能在阅读本文时已变化，请以项目官方仓库当前信息为准。
