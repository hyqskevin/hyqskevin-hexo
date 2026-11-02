---
title: AI 编程框架方法论（下）：工具与代码图谱
date: 2026-09-02 00:00:00
description: AI 编程框架下篇：5 大代表项目横向对比（Spec-Kit / BMAD / OpenSpec / Superpowers / GStack）、代码图谱工具（CodeGraph / Graphify）、OpenCLI 工具层、综合映射矩阵、5 类项目选型决策树。
series:
  name: ai-programming-frameworks
  index: 2
  total: 2
categories:
  - notes
tags:
  - AI
  - 编程框架
  - 代码图谱
  - OpenCLI
  - 工具对比
  - 选型
---

（上）篇讲 SDD / TDD / BDD / DDD 4 种方法论；本篇讲**工具层**——5 大 AI 编程框架、代码图谱、OpenCLI 工具层，以及完整的选型决策矩阵。

## 一、5 大 AI 编程框架对比

| 项目 | 厂商 | 核心定位 | 规模 | 学习曲线 | 适合 |
|---|---|---|---|---|---|
| **Spec-Kit** | GitHub | spec 驱动 + tasks 自动化 | 中大 | 中 | 通用项目 |
| **BMAD-METHOD** | 社区 | 角色化协作（PO/架构/开发/QA） | 大 | 高 | 复杂产品 |
| **OpenSpec** | Fission AI | 轻量 spec + 变更追踪 | 小中 | 低 | 中小项目 |
| **Superpowers** | 社区 | TDD + spec 自动化 | 小中 | 中 | 个人 / 小团队 |
| **GStack** | ? | AI 辅助 spec | 实验 | 中 | 研究型项目 |

## 二、5 个项目详解

### 2.1 Spec-Kit（推荐，GitHub 官方）

```bash
# 安装
npx spec-kit init my-project
cd my-project

# 工作流
/spec.md        # 写规范（AI 协助）
/plan.md        # 生成实现计划
/tasks.md       # 拆分任务
/implement      # AI 写代码
```

**优点**：GitHub 官方背书，集成度高
**缺点**：规范驱动过重，小项目不必要

### 2.2 BMAD-METHOD

```text
工作流（4 角色）：
  - PO（Product Owner）：写用户故事
  - Architect：写架构 spec
  - Developer：写实现
  - QA：写测试
```

**优点**：角色清晰，大型团队友好
**缺点**：流程重，需要每个角色都熟悉

### 2.3 OpenSpec

```bash
npx openspec init
# 写 spec → openspec validate → openspec change <feature>
```

**优点**：轻量，变更追踪做得好
**缺点**：生态较小

### 2.4 Superpowers

```bash
git clone https://github.com/obra/superpowers
cd superpowers
# 集成 Claude / Cursor / OpenClaw
```

**优点**：TDD-first 自动化做得好
**缺点**：上手成本高

### 2.5 GStack

研究型项目，主要探索**AI 辅助 spec 生成**。生产环境使用还不成熟。

## 三、代码图谱工具

### 3.1 为什么需要图谱

AI 编码最大挑战是"上下文窗口不够"。代码图谱把项目结构 / 依赖 / 调用关系**结构化**给 AI。

### 3.2 CodeGraph

```bash
# 装
pip install codegraph
codegraph build src/

# AI 查询
codegraph query "auth module dependencies"
# 返回：graph 含 23 个节点 + 18 条边
```

**特点**：

- 支持 TypeScript / Python / Go
- 内置 AI 接口（OpenAI / Claude）
- 增量更新（git hook 触发）

### 3.3 Graphify

```bash
npm install -g graphify
graphify build
# 输出 .graphify/ 目录
# AI 通过 MCP 访问
```

**特点**：

- 纯 JS 生态
- 集成 Obsidian 双链
- 支持多语言（TS / Python / Go / Rust / Java）

### 3.4 CodeGraph vs Graphify

| 维度 | CodeGraph | Graphify |
|---|---|---|
| 语言 | Python 库 | JS CLI |
| 安装 | pip install | npm install -g |
| 触发 | git hook / cron | git hook / 文件监听 |
| AI 集成 | 内置 OpenAI | 通过 MCP |
| 适用 | Python 项目 | JS / TS 项目 |

## 四、OpenCLI 工具层

OpenCLI 是**通用 CLI 框架**，让 AI Agent 与外部世界交互：

```bash
# 装
npm install -g @opencli/cli

# 注册 skill
opencli skill add web-search
opencli skill add browser
opencli skill add code-exec

# AI 调用
opencli run web-search "AI 编程框架对比"
```

**优势**：

- 一套 CLI 多个 skill 共享
- 跨平台（macOS / Linux / Windows）
- 与 Agent 框架解耦

## 五、5 个项目综合映射矩阵

| 项目 | 方法论 | AI 集成度 | 工具链 | 社区活跃度 |
|---|---|---|---|---|
| **Spec-Kit** | SDD | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **BMAD** | SDD + 角色 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **OpenSpec** | SDD 轻量 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Superpowers** | TDD + Spec | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **GStack** | Spec 实验 | ⭐⭐ | ⭐⭐ | ⭐ |

## 六、5 类项目选型决策

### 6.1 个人小工具

```bash
# 1. 写 spec.md（用 Claude 协助）
# 2. 配 Superpowers 或 Spec-Kit
npx superpowers init
# 3. TDD 流程
npm test
```

**推荐工具**：Spec-Kit + Cursor
**预期**：1-2 周上线，AI 写 80% 代码

### 6.2 中小产品（3-5 人）

```text
工作流：
  - SDD 写规范
  - TDD 写测试
  - 团队用 OpenSpec 追踪变更
  - AI 写实现，codegraph 辅助
```

**推荐工具**：OpenSpec + CodeGraph + Claude
**预期**：1-2 月 MVP，AI 写 60% 代码

### 6.3 复杂产品（10+ 人）

```text
工作流：
  - BMAD 角色协作
  - 4 个 spec 分层（架构/模块/任务/测试）
  - 严格 CodeReview + TDD
  - AI 写 70% 简单代码，人 review
```

**推荐工具**：BMAD + Superpowers + CodeGraph
**预期**：3-6 月迭代，AI 写 50% 代码

### 6.4 企业级（金融/医疗）

```text
工作流：
  - DDD 领域建模优先
  - BDD 业务验收标准
  - 完整审计 + 合规
  - AI 仅辅助，不主导
```

**推荐工具**：DDD + BDD + Spec-Kit（合规版）
**预期**：6-12 月迭代，AI 写 30% 代码

### 6.5 研究型 / 实验型

```text
工作流：
  - 轻量 spec（OpenSpec）
  - 快速迭代
  - AI 主导
```

**推荐工具**：OpenSpec + Claude + GStack
**预期**：1-2 周一个 demo

## 七、3 条实战建议

1. **个人项目先 Spec-Kit**：开箱即用，30 分钟搭起来
2. **团队项目先统一方法论再选工具**：4 种方法论先定 1-2 种
3. **代码图谱从 day 1 启用**：项目越大越需要，前期 0 成本

## 八、3 条避坑

1. **不要追求全套**：BMAD + Superpowers + CodeGraph + OpenCLI 全装 = 团队负担不起
2. **方法论比工具重要**：SDD 思想对，Spec-Kit 工具不对也能凑合
3. **AI 主导但不是全自动**：关键决策（架构 / 安全 / 业务）必须人拍板

## 九、4 个推荐组合

### 9.1 个人开发者

- **Spec-Kit**（spec）
- **Cursor**（IDE）
- **Trae**（国内版备选）
- **节省**：完全靠 AI 写 80% 代码

### 9.2 中小团队

- **OpenSpec**（轻量 spec）
- **Superpowers**（TDD）
- **CodeGraph**（代码图谱）
- **Claude / Cursor**（AI）

### 9.3 复杂企业

- **BMAD**（角色协作）
- **Spec-Kit**（规范驱动）
- **CodeGraph + Graphify**（双图谱）
- **企业版 LLM**（数据不外流）

### 9.4 金融/医疗

- **DDD 优先**（先建模）
- **BDD 验收**（业务对齐）
- **Spec-Kit 合规版**（审计追踪）
- **内部 LLM**（数据合规）

---

> **两篇合并 = 完整的 AI 编程框架方法论 + 工具指南**。**方法论 4 种组合** + **工具 5 选 1** + **代码图谱 2 选 1** = 90% 项目够用。剩下 10% 是个性化调整。