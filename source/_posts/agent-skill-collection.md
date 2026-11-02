---
title: 26 个 Agent skill
date: 2026-10-08 00:00:00
description: 2026 年 Agent Skill 精选合集：Top 5 高 stars 概览 + 10 条生产级 Skill 深度解读（mattpocuck/skills、affaan-m/ECC、Graphify-Labs/graphify、addyosmani/agent-skills、claude-mem 等），覆盖通用工程、性能优化、知识图谱、持久化上下文、MCP 生态、安全审计、架构图 7 大类别，附 16 条紧凑推荐与选型三层过滤。
categories:
  - notes
tags:
  - Agent
  - Skill
  - Claude Code
  - MCP
  - 工具
  - 资源精选
updated: 2026-10-10 02:30:00
updated_from: vault://skill推荐/01-Agent skill.md
updated_note: 源稿批次 2026-10-09 增补 4 个高 star 仓库
---

Agent Skill 是 2026 年 AI 工程师的核心资产——一个好的 Skill 能让 Claude Code、Cursor、Codex 等 coding agent 的产出从「能跑」变成「生产级」。本文从社区 26 条高价值 Skill 里，**精选 Top 5 + 10 条深度解读 + 16 条紧凑清单**，覆盖工程、性能、上下文、安全、视觉化 7 大场景。

## 一、Top 5 概览

按 GitHub stars 降序，每个 Skill 都点过星标做交叉验证：

| # | 仓库 | stars | 一句话核心 |
|---|------|-------|-----------|
| 1 | [mattpocuck/skills](https://github.com/mattpocuck/skills) | 278,768 | "Skills for Real Engineers"，来自 mattpocuck 本人 .agents 目录的实战工程 Skill 合集 |
| 2 | [affaan-m/ECC](https://github.com/affaan-m/ECC) | 274,535 | Agent harness 性能优化系统：Skills + 经验 + 记忆 + 研究优先开发 |
| 3 | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | 124,525 | 把任意代码库（含文档、SQL schema、配置、PDF）变成可查询的知识图谱 |
| 4 | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 102,310 | Google Chrome 团队出品，面向 AI 编程 agent 的生产级工程 Skill 集合 |
| 5 | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 97,391 | 跨会话持久化上下文：自动捕获/压缩/重注入，兼容 Claude Code / Cursor / Codex / Gemini |

**一句话总结**：Top 1-2 是「通用工程方法论」，Top 3 是「代码理解新范式」，Top 4 是「工程实践模板」，Top 5 是「上下文持久化」。装这 5 个，基本覆盖日常 coding agent 90% 的场景。

## 二、Skill 知识底座

在装 Skill 之前，先理解它的运行机制——否则容易装了一堆、撞车率 40%。

### 2.1 什么是 Agent Skill

```text
Skill = 一个 SKILL.md 文件（含 frontmatter + markdown body）
  - frontmatter：描述、触发条件、模型选择、权限
  - body：具体执行流程 + 工具调用规则
  - 加载流程：系统注入 description → 按需触发 → 读取 body
```

**Skill ≠ Tool**：
- Tool 是「单次原子能力」（调 API、读文件）
- Skill 是「一组 Tool + Prompt + 决策规则的 SOP」

### 2.2 Skill 触发机制

```text
1. 启动 Agent 时：所有 Skill 的 description 被注入系统提示
2. 用户输入：Agent 根据 description 判断匹配度
3. 命中阈值：自动加载 body，按 SOP 执行
4. 不命中：保持沉默，不占用上下文
```

**这意味着**：Skill 的 description 写得好不好，决定了它「撞车率」与「触发率」。

### 2.3 选型三层过滤

社区总结的三层过滤法：

```text
第一层：能否解决我的具体场景？（不是"看起来很酷"）
第二层：description 是否清晰？（撞车率 > 40% = 装它就是坑队友）
第三层：维护是否持续？（README + commits + 最近 90 天活跃）
```

**关键指标**：撞车率 ≤ 5% + 近 90 天有 commit = 可装。否则先观察。

## 三、生产级 Skill 集合（10 条精选）

下面 10 条按「stars 高 + 类别代表性强」排序，每条都带"为什么推荐 / 适用场景"。

### 3.1 mattpocuck/skills（278k · 通用工程方法论）

```yaml
仓库: https://github.com/mattpocuck/skills
作者: mattpocuck（TypeScript Weekly 主理人）
语言: TypeScript
stars: 278,768
```

**核心**：「Skills for Real Engineers」——来自 mattpocuck 本人 `.agents` 目录的真实工程 Skill，不是 Demo。

**适用场景**：
- 想了解「高水平工程师每天用 coding agent 干什么」
- 想直接复用一批 TS 工程的 code review、refactor、test 模板
- 想学习 Skill 怎么写得"不撞车"

**为什么推荐**：TypeScript Weekly 的受众都是真实工程师，278k stars 是真实使用量而非炒作。**第一个该装的 Skill**。

### 3.2 affaan-m/ECC（274k · 性能优化系统）

```yaml
仓库: https://github.com/affaan-m/ECC
语言: JavaScript
stars: 274,535
```

**核心**：**Agent harness performance optimization system**——不是单个 Skill，而是一套"Agent 操作系统级别"的优化框架。

**包含模块**：
- Skills（可复用方法）
- Instincts（条件反射级决策）
- Memory（跨会话上下文）
- Security（安全护栏）
- Research-first（先调研后编码）

**适用场景**：
- Agent 跑得慢、token 浪费严重
- 多个 Agent 间需要共享上下文
- 想给 Agent 加安全护栏

**为什么推荐**：**唯一一个把"Agent 性能"当一级概念做的项目**——其他 Skill 都是"加能力"，ECC 是"让 Agent 跑得更快"。

### 3.3 Graphify-Labs/graphify（124k · 代码 → 知识图谱）

```yaml
仓库: https://github.com/Graphify-Labs/graphify
语言: Python
stars: 124,525
```

**核心**：把任意代码库（含文档、SQL schema、配置、PDF）转成可查询的知识图谱，提供 `/graphify` Skill。

**使用方式**：
```bash
/graphify
# Agent 自动扫描代码库 → 抽取实体关系 → 存入知识图谱
# 之后可问：「订单服务的所有外部依赖是什么？」
```

**适用场景**：
- 接手陌生大型代码库，需要快速理解架构
- 想让 Agent 能"跨文件推理"（如"用户表的所有写入路径"）
- 做架构评审、依赖审计

**为什么推荐**：**代码理解从 grep 时代跨入知识图谱时代**——Agent 不用再一行行读文件，而是直接查图谱。

### 3.4 addyosmani/agent-skills（102k · Chrome 团队出品）

```yaml
仓库: https://github.com/addyosmani/agent-skills
作者: Google Chrome 团队（addyosmani）
语言: JavaScript
stars: 102,310
```

**核心**：**Google Chrome 团队内部使用**的 AI 编程 agent 工程 Skill 集合，覆盖代码审查、调试、规划、PR 描述等场景。

**适用场景**：
- 在大厂工程团队，希望 Skill 风格"工业化"
- 想参考 Chrome 团队的代码审查 SOP
- 需要 PR 描述、commit message 自动化

**为什么推荐**：**大厂背书 + 真实工程实践**——addyosmani 是 Chrome 性能优化负责人，102k stars 是工业级验证。

### 3.5 thedotmack/claude-mem（97k · 跨会话持久化）

```yaml
仓库: https://github.com/thedotmack/claude-mem
语言: TypeScript
stars: 97,391
```

**核心**：「跨会话持久化上下文」——自动捕获、压缩、重注入上下文，**解决 Claude Code「开新窗口就忘事」的痛点**。

**核心特性**：
- 自动捕获所有对话历史
- 智能压缩（保留关键决策、去除冗余）
- 新会话启动时自动重注入
- 兼容 Claude Code / Cursor / Codex / Gemini

**适用场景**：
- 长周期项目（跨多天、多周）
- 团队多人协作同一个 codebase
- 需要 Agent 记住"上次为什么选 PostgreSQL 而不是 MongoDB"

**为什么推荐**：**Agent 的"长期记忆"问题目前没有标准答案，claude-mem 是社区最成熟的方案**。

### 3.6 cloudflare/security-audit-skill（25k · 安全审计）

```yaml
仓库: https://github.com/cloudflare/security-audit-skill
作者: Cloudflare
语言: JavaScript
stars: 25,565
```

**核心**：Cloudflare 出品的**多阶段安全审计 Skill**——结果机器可读、可独立验证，给 coding agent 加安全门禁。

**审计阶段**：
1. 依赖审计（已知 CVE）
2. 代码审计（注入、越权、敏感信息泄露）
3. 配置审计（CORS、CSP、Secrets）
4. 部署审计（容器、CI/CD）

**适用场景**：
- 企业内部 Skill（合规、安全审计必须）
- 给生产代码加最后一道门
- CI/CD 集成 Agent 自动审计

**为什么推荐**：**Stars 数虽然只有 25k，但背书最强（Cloudflare）**——企业内审首选。

### 3.7 tt-a1i/archify（78k · 想法 → 架构图）

```yaml
仓库: https://github.com/tt-a1i/archify
语言: JavaScript
stars: 78,944
```

**核心**：把任意想法、计划、代码库变成**好看的可交互架构图**——一个面向 Claude Code、Codex 的可视化 Skill。

**使用方式**：
```bash
/archify
# 输入：「画出当前微服务架构」
# 输出：HTML + SVG 可交互图
```

**适用场景**：
- 技术方案评审（PPT 配图）
- 文档自动生成（README 加图）
- 新人 onboarding（架构图替代文字）

**为什么推荐**：**架构图是工程沟通的硬通货**——archify 把"画图"从设计师手里抢回到 Agent。

### 3.8 Egonex-AI/Understand-Anything（85k · 交互式知识图谱）

```yaml
仓库: https://github.com/Egonex-AI/Understand-Anything
语言: TypeScript
stars: 85,481
```

**核心**：「Graphs that teach > graphs that impress」——把任意代码转成可探索、可搜索、可交互的知识图谱。

**与 graphify 的区别**：
- graphify：Python 实现，强调查询能力
- Understand-Anything：TypeScript 实现，强调交互体验

**适用场景**：
- 教学场景（让学生"点图"理解代码）
- 代码评审（可视化依赖关系）
- Onboarding（新人"看图"代替"读文档"）

**为什么推荐**：**stars 85k 是真实用户量**——交互体验在知识图谱赛道最强。

### 3.9 punkpeye/awesome-mcp-servers（95k · MCP 生态）

```yaml
仓库: https://github.com/punkpeye/awesome-mcp-servers
语言: N/A（awesome 列表）
stars: 95,897
```

**核心**：MCP servers 精选列表——GitHub、GitLab、Postgres、Filesystem、Slack 等数百个官方/社区 MCP server。

**适用场景**：
- 想找现成的 MCP server 接入 Agent
- 想了解 MCP 生态成熟度
- 想找特定服务的官方 MCP 实现

**为什么推荐**：**MCP 是 Agent 时代最重要的协议**——awesome-mcp-servers 是 MCP 生态的"HN 首页"。

### 3.10 ComposioHQ/awesome-claude-skills（76k · Claude Skill 精选）

```yaml
仓库: https://github.com/ComposioHQ/awesome-claude-skills
语言: Python
stars: 76,639
```

**核心**：Claude Skills 精选列表 + 资源 + 工具——Composio 维护，专注 Claude AI 工作流定制。

**适用场景**：
- 想系统了解 Claude Skill 生态
- 找现成的 Skill 直接装
- 找 Skill 设计模式参考

**为什么推荐**：**Composio 是 Claude 生态最活跃的公司之一**——list 质量与更新频率都是顶级。

## 四、场景化 Skill（2 条精选）

### 4.1 sergebulaev/linkedin-skills（4k · 写 LinkedIn 帖子）

```yaml
仓库: https://github.com/sergebulaev/linkedin-skills
语言: Python
stars: 4,268
```

**核心**：11 个 Claude Code + Codex Skill，**专攻"写出人味不机械"的 LinkedIn 帖子**。

**适用场景**：
- 个人品牌运营（LinkedIn 是主战场）
- 不擅长写"人话"的工程师
- 想批量产出 LinkedIn 内容

**为什么推荐**：**stars 不高但垂直领域唯一**——专门解决"Agent 写社交媒体很机械"的痛点。

### 4.2 panniantong/agent-reach（· 16 平台统一接入）

```yaml
仓库: https://lobehub.com/en/skills/panniantong-agent-reach-skill
语言: Skill
stars: 0（站点）
```

**核心**：AI agents **统一接入 16 个 Web 平台**（Twitter/X、Reddit、YouTube、GitHub、Bilibili、小红书、抖音、微博、微信公众号等）。

**适用场景**：
- 多平台内容分发
- 跨平台数据采集
- 不想每个平台单独写 Skill

**为什么推荐**：**"撞车率"最低的 Skill**——一个 Skill 替代 16 个平台接入。

## 五、其他推荐（16 条紧凑清单）

剩余 16 条按类别分组，每条一行：

### 5.1 官方文档与商城（5 条）

- [Anthropic Agent Skills 官方文档](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — 理解 SKILL.md 加载流程的最佳入口
- [mcpservers.org/agent-skills](https://mcpservers.org/agent-skills) — 官方/社区 Skill 一站式商店，分类清晰，一键安装
- [awesomeclaude.ai/awesome-claude-skills](https://awesomeclaude.ai/awesome-claude-skills) — 区分 slash command（手动触发）vs skill（自动按 context 触发）
- [Totalum Blog — Claude Code Skills 完整指南](https://www.totalum.app/blog/claude-code-skills-totalum) — Skills vs Hooks vs Subagents vs MCP 差异对比
- [leehanchung — Claude Skills Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive) — 源码级拆解 frontmatter + markdown body

### 5.2 实战经验贴（4 条）

- [Medium: 10 Must-Have Skills for Claude (2026)](https://medium.com/@unicodeveloper/10-must-have-skills-for-claude-and-any-coding-agent-in-2026-b5451b013051) — 官方/验证/社区三层 Skill 全景
- [aihero: 5 Agent Skills I Use Every Day](https://www.aihero.dev/5-agent-skills-i-use-every-day) — 实战工程师每日 5 个：prompting、TDD、架构、spec
- [什么值得买: 1000 个 skills 推荐 30 个](https://post.smzdm.com/p/apql9qp9/) — 中文社区从 1000 个 SKILL.md 精选 30 个
- [smzdm: 装上就快一倍 — 谁该装、谁该建](https://post.m.smzdm.com/p/ad7m5ovz) — 选型三层过滤 + 撞车率 40% → 5% 描述写法

### 5.3 特定功能 Skill（4 条）

- [luxueliu-agent-discipline-skills](https://blog.yeyupiaoling.cn/article/1791149995294?lang=en) — 4 个单文件工程纪律 Skill，一行命令安装
- [Launch Post (Grade A)](https://www.skillsdirectory.com/skills/jackneil-launch-post) — Claude Skill：自动发布 X/Twitter 公告
- [PromptArmor Databricks Genie 披露](https://aihot.virxact.com/api/v1/items/dfcis3hxowljt45i0bvyi3f0n) — Skill 安全风险 case：企业内审 Skill 来源是刚需
- [agent-reach](https://lobehub.com/en/skills/panniantong-agent-reach-skill) — 16 平台统一接入（已在 4.2 详解）

### 5.4 新功能与平台（3 条）

- [Claude Code 云端会话](https://aihot.virxact.com/api/v1/items/sxr71auxicu8uk3e4bqxol02h) — 每个任务独占 VM，可并行 + 以分支收尾，Pro/Max/Team/Enterprise 免费
- [Claude Code mods 入门](https://aihot.virxact.com/api/v1/items/sbvvdrkyjbtob4gp4iwwtyar1) — Token Weather 上下文窗口预报插件，mods = hooks 形式运行的 JS/TS 模块

## 六、Skill 生态的 5 段 takeaway

### 6.1 通用工程方法论 > 单点 Skill

mattpocuck/skills（278k）和 affaan-m/ECC（274k）高居榜首，因为它们是「方法论」而非「单功能」。装一个能解决一类问题，而不是装十个解决十个问题。

### 6.2 代码理解进入"知识图谱"时代

Graphify-Labs/graphify（124k）和 Egonex-AI/Understand-Anything（85k）合并 stars 超 200k——**代码理解的下一个十年是图谱，不是 grep**。

### 6.3 大厂背书是工业级信号

addyosmani/agent-skills（Chrome）和 cloudflare/security-audit-skill（Cloudflare）——**stars 数背后是大厂内部使用量**。

### 6.4 跨工具兼容性是新主线

claude-mem（兼容 4 个 Agent 平台）和 agent-reach（16 个 Web 平台）——**Skill 必须多平台兼容才有未来**。

### 6.5 安全审计是企业刚需

cloudflare/security-audit-skill（25k）和 PromptArmor 披露的 Skill 钓鱼风险——**企业级 Agent 落地，安全 Skill 是入场券**。

## 七、装 Skill 的 3 个铁律

```text
1. 先理解机制，再装：SKILL.md 怎么加载、description 怎么触发
2. 三层过滤选型：场景匹配 + 描述清晰 + 持续维护
3. 撞车率 ≤ 5%：description 写得像搜索词，而不是通用描述
```

## 八、推荐起步包

如果只装 5 个：

```text
1. mattpocuck/skills（278k）       — 通用工程方法论
2. addyosmani/agent-skills（102k） — 工程实践模板
3. thedotmack/claude-mem（97k）    — 跨会话持久化
4. punkpeye/awesome-mcp-servers    — MCP 生态地图
5. cloudflare/security-audit-skill — 安全门禁
```

**装完这 5 个，覆盖 80% 日常 coding agent 场景**。剩下 21 条按场景按需装。

---

> **Skill 生态的现状**（2026 H2）：**Top 5 stars 都是百万 / 几十万量级**——Skill 已经是 coding agent 时代的「事实操作系统」。**未来 12 个月的核心趋势**：① 跨平台统一（claude-mem、agent-reach 路线） ② 知识图谱化（graphify、Understand-Anything 路线） ③ 安全审计标配（cloudflare、PromptArmor 路线）。**会装 Skill、会改 SKILL.md、是 AI 工程师的核心竞争力**。

## 更新记录（2026-10-09）

> 本节为源稿「批次 2026-10-09」GitHub 增补——在原 26 条基础上追加 4 个高 star 仓库（编号 27-30）。原 26 条内容未改动。

- [#27] [obra/superpowers](https://github.com/obra/superpowers) ⭐ 296,610 — An agentic skills framework & software development methodology that works.
- [#28] [anthropics/skills](https://github.com/anthropics/skills) ⭐ 180,018 — Public repository for Agent Skills.
- [#29] [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps) ⭐ 140,838 — 100+ AI Agents, Agent Skills and RAG Apps - Free and Open Source.
- [#30] [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) ⭐ 110,606 — why use many token when few token do trick. Viral skill + proxy for coding agents that cuts 65% of tokens by talking like a caveman.

**入库说明**：上述 4 条来自源稿批次 2026-10-09 的 GitHub 公开仓库增补，用于补充近期 stars 增长显著的 Agent skill 仓库；原 26 条保持不变，整体收录扩展为 30 条。