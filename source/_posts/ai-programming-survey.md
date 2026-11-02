---
title: AI 编程框架调研
date: 2026-09-02 00:00:00
description: AI 编程框架 12+ 概念全景调研：规范/流程驱动（BMAD/OpenSpec/Spec-Kit/Superpowers）、AI Skills 库（mattpocock-skills/ui-ux-pro-max）、代码图谱（CodeGraph/Graphify）、工具层（OpenCLI）、综合映射矩阵、选型决策树。
categories:
  - notes
tags:
  - AI
  - 编程框架
  - 工具对比
  - SDD
  - TDD
  - 代码图谱
---

2026 年 7 月做的 AI 编程框架全景调研，把 12+ 概念按"功能维度"分成 4 大类。本篇是调研笔记 + 选型决策。

## 一、4 大分类总览

| 分类 | 定位 | 包含项目 |
|---|---|---|
| **规范/流程驱动框架** | 定义 AI 编程的工作流 / 阶段门 / 协作规范 | BMAD、OpenSpec、Spec-Kit、Superpowers、GStack、Trellis |
| **AI Skills / 技能库** | 可复用的 Markdown 指令集，注入 AI 会话改行为 | mattpocock/skills、ui-ux-pro-max |
| **代码上下文与图谱** | 构建代码知识图谱，增强 AI 对项目理解 | CodeGraph、Graphify |
| **通用工具层** | AI Agent 与外部世界交互的基础设施 | OpenCLI |

**核心洞察**：传统方法论**不是被取代，是被重新分层**——SDD 居最上层（架构/需求），DDD 负责领域语言，BDD 负责验收标准，TDD 负责实现验证。AI 编码时代一个完整框架**同时覆盖多层**。

## 二、规范/流程驱动框架

| 项目 | 厂商 | 核心理念 | 规模 | 推荐场景 |
|---|---|---|---|---|
| **BMAD-METHOD** | 社区 | 角色化（PO/架构师/开发/QA）协作 | 大 | 复杂产品 |
| **OpenSpec** | Fission AI | 轻量 spec + 变更追踪 | 小中 | 中小项目 |
| **Spec-Kit** | GitHub | spec 驱动 + tasks 自动化 | 中大 | 通用 |
| **Superpowers** | 社区 | TDD + spec 自动化 | 小中 | 个人 / 小团队 |
| **GStack** | ? | AI 辅助 spec（实验性） | 实验 | 研究 |
| **Trellis** | 社区 | Trellis workflow（实验） | 实验 | 研究 |

## 三、AI Skills 技能库

| 项目 | 内容 | 用途 |
|---|---|---|
| **mattpocock/skills** | Claude / Cursor 用的 Markdown skill 集 | 通用 |
| **ui-ux-pro-max** | UI/UX 设计 skill | 前端 |

Skills 是**纯文本指令**——AI 读到后行为就变。比微调便宜，比 prompt 稳定。

## 四、代码上下文与图谱

### 4.1 为什么需要

AI 编码最大挑战是"上下文窗口不够"。代码图谱把项目结构 / 依赖 / 调用关系**结构化**给 AI。

### 4.2 CodeGraph

```bash
pip install codegraph
codegraph build src/

# AI 查询
codegraph query "auth module dependencies"
```

特点：Python 库，内置 OpenAI/Claude 接口，增量更新。

### 4.3 Graphify

```bash
npm install -g graphify
graphify build
```

特点：纯 JS，集成 Obsidian 双链，支持多语言。

## 五、通用工具层

**OpenCLI** —— 一套 CLI 跑多个 skill：

```bash
npm install -g @opencli/cli
opencli skill add web-search
opencli skill add browser
```

跨平台（macOS / Linux / Windows），与 Agent 框架解耦。

## 六、综合映射矩阵

| 项目 | 规范/流程 | Skills | 图谱 | 工具层 |
|---|---|---|---|---|
| BMAD | ✅ 角色 | ❌ | ❌ | ❌ |
| OpenSpec | ✅ 轻量 | ❌ | ❌ | ❌ |
| Spec-Kit | ✅ 完整 | 部分 | ❌ | ❌ |
| Superpowers | ✅ TDD | 部分 | ❌ | ❌ |
| CodeGraph | ❌ | ❌ | ✅ | ❌ |
| Graphify | ❌ | ❌ | ✅ | ❌ |
| OpenCLI | ❌ | ❌ | ❌ | ✅ |

**结论**：**没有单一框架覆盖全部维度**——实际部署需要 2-3 个组合。

## 七、4 种推荐组合

### 7.1 个人小工具

- **Spec-Kit**（spec）
- **Cursor**（IDE + AI 集成）
- **节省**：完全靠 AI 写 80% 代码

### 7.2 中小产品

- **OpenSpec**（轻量 spec）
- **Superpowers**（TDD）
- **CodeGraph**（代码图谱）
- **Claude / Cursor**（AI 助手）

### 7.3 复杂企业

- **BMAD**（角色协作）
- **Spec-Kit**（规范）
- **CodeGraph + Graphify**（双图谱）
- **企业 LLM**（数据不外流）

### 7.4 金融 / 医疗

- **DDD**（领域建模优先）
- **BDD**（业务验收）
- **Spec-Kit 合规版**
- **内部 LLM**（数据合规）

## 八、3 条实战建议

1. **个人项目先 Spec-Kit**：30 分钟搭起来，立即用
2. **团队项目先统一方法论**：4 种方法论先定 1-2 种
3. **代码图谱 day 1 启用**：项目越大越需要，前期 0 成本

## 九、3 条避坑

1. **不要追求全套**：BMAD + Superpowers + CodeGraph + OpenCLI 全装 = 团队负担不起
2. **方法论比工具重要**：SDD 思想对，Spec-Kit 工具不对也能凑合
3. **AI 主导但不是全自动**：关键决策（架构 / 安全 / 业务）必须人拍板

## 十、3 个相关项目

- [github.com/varun-doshi/spec-kit-1](https://github.com/varun-doshi/spec-kit-1) — Spec-Kit 复刻
- [github.com/SuperpowersProjects](https://github.com/obra/superpowers) — Superpowers 主仓库
- [github.com/any4ai/CodeGraph](https://github.com/any4ai/CodeGraph) — CodeGraph

---

> **本文定位**：快速了解"AI 编程时代用什么框架 + 工具"。**4 大类分清楚、3 个组合选 1 个** = 90% 项目够用。剩下 10% 是个性化调整。