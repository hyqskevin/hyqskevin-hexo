---
title: OpenClaw 架构剖析（下）：Skill / Memory / MCP
date: 2026-09-02 00:00:00
description: OpenClaw Skill / Memory / MCP 三大扩展机制详解：workspace skill 格式（Markdown + 工具声明）、Memory 持久化（MEMORY.md / USER.md / session 上下文）、MCP 工具集成、5 类技能组合 + 3 条避坑。
series:
  name: openclaw-architecture
  index: 2
  total: 2
categories:
  - notes
tags:
  - OpenClaw
  - Skill
  - Memory
  - MCP
  - 扩展
---

（上）讲了 OpenClaw Gateway 架构。本篇（下）讲 OpenClaw 的**三大扩展机制**：Skill / Memory / MCP——这才是 OpenClaw 真正强大的地方。

## 一、Skill 系统

OpenClaw 的 Skill 是一份 **Markdown 文件**，定义 Agent 在特定场景下"该做什么"。

### 1.1 Skill 文件结构

```markdown
---
name: "github-issue-handler"
description: "处理 GitHub Issue，自动归类 + 派发"
triggers:
  - "/issue"
  - "github issue"
tools:
  - github_api
  - linear_api
  - slack_notify
---

# 工作流程

1. 解析用户输入的 issue 标题 / 描述
2. 调用 github_api 拿 issue 详情
3. 用 LLM 分类（bug / feature / question）
4. 调 linear_api 创建对应 issue
5. 调 slack_notify 通知团队

# 输出格式

- 优先级：P0 / P1 / P2
- 负责人：根据 linear 的 assignee
- 截止日期：根据 priority
```

### 1.2 三要素

- **name**：Skill 唯一标识
- **description**：Agent 触发判断（哪些请求用这个 Skill）
- **tools**：Skill 可用的工具列表

### 1.3 Skill 加载

```yaml
# workspace.json5
{
  "skills": {
    "github-issue": "/path/to/skill.md",
    "weather": "/path/to/weather.md",
    "calendar": "/path/to/calendar.md"
  }
}
```

Agent 启动时按需加载（lazy load）。

### 1.4 Skill vs Function Calling 区别

| 维度 | Skill | Function |
|---|---|---|
| 内容 | 完整流程 + Prompt | 单个函数 |
| 粒度 | 任务级 | 操作级 |
| 加载 | 完整 markdown | JSON schema |
| 复用 | 跨 Agent 共享 | 单 Agent |

**Skill = "做这件事的 SOP"，Function = "可以调的工具"**。

## 二、Memory 系统

OpenClaw 的 Memory 分 3 层：

```text
~/.openclaw/
├── MEMORY.md       # 全局长期记忆
├── USER.md         # 用户偏好
└── session-xxx/    # 单次 session 临时
    └── context.json
```

### 2.1 全局长期记忆（MEMORY.md）

```markdown
# MEMORY.md

## 用户偏好
- 不喜欢 emoji
- 喜欢详细技术解释
- 习惯用 TypeScript

## 长期项目
- 项目 A：每周 1 自动报告
- 项目 B：客户管理 Agent

## 禁忌
- 不要在 user message 中提到具体公司名
- 不要自动部署到生产
```

Agent 每次启动**必读**。

### 2.2 用户偏好（USER.md）

```markdown
# USER.md

- 工作时间：9-18
- 沟通风格：直接、不客套
- 决策风格：数据驱动
- 喜欢的工具：Claude / Trae / OpenClaw
```

**注意**：USER.md 是 OpenClaw 专属（其他 Agent 框架不一定读）。

### 2.3 Session 上下文

```json
{
  "session_id": "sess-2026-09-03-001",
  "user_id": "u-12345",
  "channel": "whatsapp",
  "context": {
    "last_topic": "AI 编程工具对比",
    "tone_preference": "formal",
    "history_summary": "用户在调研 Trae vs Cursor"
  },
  "messages_count": 5
}
```

Session 上下文**短期**（重启丢失），但 summary 持久化到 MEMORY.md。

## 三、MCP 集成

OpenClaw 通过 MCP（Model Context Protocol）接入外部工具。

### 3.1 配置 MCP Server

```json5
// workspace.json5
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/.../projects"]
    }
  }
}
```

### 3.2 Skill 调用 MCP 工具

```markdown
# Skill: GitHub Issue 处理
tools:
  - github.create_issue  # 来自 MCP server
  - github.list_issues
```

Agent 运行时：
1. 读 Skill 知道有哪些 tools 可用
2. 通过 MCP 协议调 github.create_issue
3. MCP server 调用 GitHub API 返回结果

### 3.3 MCP vs Plugin

| 维度 | MCP | Plugin |
|---|---|---|
| 协议 | 标准化（JSON-RPC） | OpenClaw 私有 |
| 跨平台 | ✅ 任何 Agent | ❌ 仅 OpenClaw |
| 工具发现 | 自动 | 手动注册 |
| 沙箱 | 进程级 | 同进程 |

**MCP 是未来**——任何 Agent 都能用，OpenClaw 私有 plugin 不可移植。

## 四、5 类 Skill 组合实战

### 4.1 客服 Skill 套件

```text
skills/
├── customer-greeting.md     # 问候 + 自我介绍
├── order-query.md          # 查订单
├── refund-handler.md        # 处理退款
├── escalate-to-human.md    # 升级人工
└── feedback-collector.md   # 收集反馈
```

### 4.2 内容创作 Skill 套件

```text
skills/
├── topic-research.md       # 选题
├── outline-generator.md    # 大纲
├── draft-writer.md        # 初稿
├── editor.md              # 改稿
└── seo-optimizer.md      # SEO
```

### 4.3 销售 Skill 套件

```text
skills/
├── lead-qualifier.md       # 线索评分
├── demo-scheduler.md       # 安排演示
├── follow-up.md            # 跟进
└── contract-review.md      # 合同审阅
```

### 4.4 数据分析 Skill 套件

```text
skills/
├── sql-generator.md        # 写 SQL
├── data-cleaner.md         # 清洗数据
├── visualizer.md           # 画图
└── report-writer.md        # 写报告
```

### 4.5 研发 Skill 套件

```text
skills/
├── code-reviewer.md        # 代码审查
├── test-writer.md          # 写测试
├── bug-investigator.md     # 排查
└── doc-generator.md        # 文档
```

## 五、3 个实战建议

### 5.1 Skill 按"任务"组织，不按"工具"

```text
❌ 按工具分：
  - send_email.md
  - query_database.md
  - search_web.md

✅ 按任务分：
  - customer-onboarding.md  # 用到 email + database + search 三个工具
  - report-generator.md      # 同样多个工具组合
```

Skill 是"任务 SOP"，不是"工具清单"。

### 5.2 MEMORY.md 要常更新

```bash
# 每月 review 一次
vim ~/.openclaw/MEMORY.md
# 删过时的
# 加新发现的
```

### 5.3 优先用 MCP，少写 Plugin

```text
需要新工具？
  1. 找现成的 MCP server（GitHub / Notion / Slack 多有官方）
  2. 没找到 → 写 MCP server（可移植）
  3. 实在不行 → 写 OpenClaw plugin（私有不推荐）
```

## 六、3 条避坑

1. **不要 Skill 太多**——> 10 个 Skill 维护成本爆炸
2. **不要 MEMORY.md 写得太多**——> 2000 token 反而拖慢启动
3. **不要每件事都做 Skill**——简单 prompt 能解决的不需要 Skill

## 七、本文 + 上篇

- （上）Gateway 架构 + 集成（已写）
- （下）Skill / Memory / MCP 扩展（本文）

---

> **OpenClaw 强大的真正原因**：**Skill 系统 + MCP 集成**。Skill 是"任务 SOP"，MCP 是"工具协议"，组合起来 Agent 就能像"加了 SOP 的员工"一样工作。**Skill 写得越具体 → Agent 越像专家**。**MCP server 越多 → 能力越广**。这两个扩展机制让 OpenClaw 不只是消息网关，是"可编程的 AI 员工管理平台"。