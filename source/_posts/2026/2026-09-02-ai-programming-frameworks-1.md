---
title: AI 编程框架方法论（上）：SDD / TDD / BDD / DDD
date: 2026-09-02 00:00:00
description: AI 编程时代的 4 种方法论横向对比：SDD（规范驱动）、TDD（测试驱动）、BDD（行为驱动）、DDD（领域驱动）。每种方法论的核心项目对比 + AI 时代如何重新分层 + 选型决策树。
series:
  name: ai-programming-frameworks
  index: 1
  total: 2
categories:
  - notes
tags:
  - AI
  - 编程方法论
  - SDD
  - TDD
  - BDD
  - DDD
  - 选型
---

最近调研 AI 编程框架，发现**传统方法论不是被取代，是被重新分层**。SDD 居最上层（架构/需求），DDD 负责领域语言，BDD 负责验收标准，TDD 负责实现验证。AI 编码时代一个完整框架往往同时覆盖多层。本篇是 4 种方法论的横向对比 + 选型决策。

## 一、4 种方法论总览

| 方法论 | 核心问题 | 关键产物 | AI 时代的价值 |
|---|---|---|---|
| **SDD**（规范驱动开发） | 我们要造什么？ | spec.md / OpenAPI | AI 按规范生成代码，**避免幻觉** |
| **TDD**（测试驱动开发） | 怎么保证代码正确？ | 测试 + 实现 | AI 自动补全测试 / 实现，**提高信心** |
| **BDD**（行为驱动开发） | 用户行为是什么？ | Gherkin feature 文件 | AI 写场景化测试，**对齐业务** |
| **DDD**（领域驱动设计） | 业务怎么建模？ | 领域模型 / 限界上下文 | AI 理解领域语言，**减少误解** |

**核心洞察**：AI 编码时代**单一方法论不够**，要把 4 种组合成"AI 友好"的完整工作流。

## 二、SDD（规范驱动开发）

### 2.1 核心思想

"先写规范，再写代码"——spec 是 single source of truth，AI 按 spec 生成。

### 2.2 代表项目

| 项目 | 厂商 | 核心理念 | 推荐场景 |
|---|---|---|---|
| **Spec-Kit** | GitHub | spec.md → plan.md → tasks.md | 通用项目 |
| **BMAD-METHOD** | 社区 | 角色（PO/架构师/开发）协作 | 大型团队 |
| **OpenSpec** | Fission AI | 轻量 spec + 变更追踪 | 中小项目 |
| **Superpowers** | 社区 | TDD + spec 自动化 | 个人 / 小团队 |
| **GStack**（笔误应为 GStack） | ? | AI 辅助 spec | 实验性 |

### 2.3 实际使用

```bash
# 用 Spec-Kit（GitHub 官方）
npx spec-kit init my-project
cd my-project
# 编辑 spec.md 描述需求
# /tasks 让 AI 生成 task list
# /implement 让 AI 写代码
```

## 三、TDD（测试驱动开发）

### 3.1 核心思想

"先写测试，再写实现"——Red-Green-Refactor 循环。

### 3.2 AI 时代的增强

```text
传统 TDD:
  Red: 写失败测试
  Green: 写通过实现
  Refactor: 重构

AI TDD:
  Red: 写"我想要什么"自然语言
  Green: AI 写实现 + 配套测试
  Refactor: AI 自动建议重构
```

### 3.3 代表工具

- **GitHub Copilot**：AI 补全测试
- **Cursor Test Agent**：自动写测试 + 修复
- **Diffblue Cover**（Java）：自动生成单元测试
- **CodeMirror**（Python）：AI 生成 pytest

## 四、BDD（行为驱动开发）

### 4.1 核心思想

"用业务语言描述行为"——Given/When/Then 格式。

### 4.2 Gherkin 语法

```gherkin
# language: zh-CN
功能: 用户登录
  场景: 成功登录
    假如 用户访问登录页
    当 输入正确的邮箱和密码
    那么 应该跳转到首页
    而且 应该看到欢迎消息

  场景: 密码错误
    假如 用户访问登录页
    当 输入错误的密码
    那么 应该显示错误提示
    而且 不应该跳转
```

### 4.3 AI 时代的实践

- **AI 写 Gherkin**：根据用户故事自动生成场景
- **AI 实现 + 验证**：根据 Given/When/Then 自动写代码 + 跑测试
- **自动维护**：当代码改时，AI 重写对应 Gherkin

## 五、DDD（领域驱动设计）

### 5.1 核心思想

"代码 = 业务的镜像"——领域专家 + 开发共同建模。

### 5.2 关键概念

- **限界上下文（Bounded Context）**：每个子域独立
- **实体（Entity）**：有 ID 的领域对象
- **值对象（Value Object）**：无 ID 的属性集合
- **聚合根（Aggregate Root）**：一致性边界
- **通用语言（Ubiquitous Language）**：业务 + 技术共用术语
- **ADR（架构决策记录）**：记录重要决策

### 5.3 AI 时代的增强

```python
# AI 帮你做"限界上下文划分"
# 输入：业务描述
# 输出：建议的领域模型 + 限界上下文

# AI 帮你做"实体识别"
# 输入：业务需求
# 输出：实体清单 + 关系 + 行为
```

工具：

- **contextmapper**：可视化限界上下文
- **PlantUML + AI**：自动生成领域图
- **Structurizr**：架构即代码 + AI 补充

## 六、4 种方法论 AI 时代对比

| 维度 | SDD | TDD | BDD | DDD |
|---|---|---|---|---|
| 适合项目 | 中大型 | 所有 | 业务复杂 | 领域复杂 |
| 学习曲线 | 中 | 中高 | 中 | 高 |
| AI 友好度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 团队规模 | 3-10+ | 1-10 | 5-20 | 5-20+ |
| 投资回报（AI 时代） | 极高 | 高 | 高 | 中 |
| 失败成本 | 中（规范错全错） | 低（测试可改） | 中 | 高（重构成本） |

## 七、4 种方法论的"AI 友好度"详解

### 7.1 SDD 为什么对 AI 最友好

- **明确输入**：spec.md 给 AI 完整的需求描述
- **可验证**：spec 有 acceptance criteria，AI 实现后能自我验证
- **可迭代**：spec 改 → AI 重写代码，闭环清晰

### 7.2 TDD 对 AI 友好

- **明确目标**：测试就是"功能正确"的定义
- **可自动化**：AI 写测试 + 实现 + 跑测试形成闭环

### 7.3 BDD 对 AI 友好

- **业务语言**：AI 理解"Given 用户访问...那么..."比理解"user.click()"容易
- **可对齐**：业务和开发用同一份 Gherkin 文件

### 7.4 DDD 对 AI 友好度较低

- **抽象概念多**：限界上下文 / 聚合 / 实体 / 值对象 AI 难自动推断
- **需要领域专家**：DDD 强调"人"而非"规范"

## 八、选型决策树

```
项目类型？
├─ 个人 / 小工具 → SDD（写个 spec，AI 跑通）
├─ 业务系统 + 团队 → SDD + TDD（规范 + 测试双驱动）
├─ 多角色协作（产品/运营/技术）→ BDD（业务对齐）
├─ 复杂业务领域（金融/医疗/物流）→ DDD（建模）
└─ 完整 AI 编码框架 → SDD + TDD（推荐组合）
```

**推荐组合（2026 年）**：

- **80% 的项目**：SDD + TDD（双驱动）
- **复杂业务**：加 BDD（业务对齐）
- **企业级**：DDD + SDD + TDD（全套）

## 九、3 个常见误区

### 9.1 把 SDD 当需求文档

- ❌ 写 100 页 spec
- ✅ 写 1-2 页清晰 spec + AI 协助补充细节

### 9.2 把 TDD 当测试覆盖率工具

- ❌ 追求 100% 覆盖率
- ✅ 关注"关键路径"和"边界条件"

### 9.3 把 DDD 当万能药

- ❌ 任何项目都做 DDD
- ✅ 只在领域复杂（金融 / 医疗 / 物流）时用

---

## 下期预告

（下）篇讲 AI 编程的**工具层**——Spec-Kit / BMAD / OpenSpec / Superpowers / GStack 等 5+ AI 工具的横向对比、代码图谱（CodeGraph / Graphify）、OpenCLI 工具层，最后给完整的选型决策矩阵。👉 [（下）：AI 工具与代码图谱](/2026/09/01/2026-09-02-ai-programming-frameworks-2/)