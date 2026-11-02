---
title: AI Agent Skill 五大研究
date: 2026-10-18 00:00:00
description: 汇总 2026 年 arXiv 上 5 篇 Agent Skill 方向代表性论文：Contractual Skills 合同化设计框架、LOOP 一键录制确定性回放引擎、阿里云 Skill 测试充分度、SkillConsist 双向图对齐检测、LASANA 跨域数据集（腹腔镜手术技能视角）。
categories:
  - notes
tags:
  - AI Agent
  - Skill
  - arXiv
  - 论文速读
  - 工程化
---

Skill 是 2026 年 AI Agent 时代最热的资产——「一个 SKILL.md 文件打包一组工具 + 流程 + 决策规则」已经成为 Claude Code、Cursor、Codex 等 coding agent 的事实操作系统。然而，「Skill 写什么 / 怎么测 / 怎么录 / 一致性怎么保证」这四个问题，行业还没有标准答案。本文按 arXiv 时间线梳理 5 篇代表性论文，从工程化视角给出对照观察。

## 一、五篇论文一览

按 arXiv ID 排列，主题围绕 Agent Skill 的"设计 / 录制 / 测试 / 一致性"展开，最后一篇作为跨域对照（外科手术 Skill）：

| # | 论文 | arXiv ID | 主题切入点 |
|---|------|----------|------------|
| 1 | Contractual Skills | 2605.22634v2 | Skill 该怎么设计：合同化框架 |
| 2 | LOOP Skill Engine | 2605.14237v1 | 周期性 Skill：一次录制、确定回放 |
| 3 | Skill Test Adequacy | 2607.22015v3 | Skill 测试通过 ≠ 测试充分 |
| 4 | LASANA 数据集 | 2602.09927v1 | 跨域对照：手术 Skill 数据集 |
| 5 | SkillConsist | 2608.07639v1 | 声明 vs 实现的一致性检测 |

> **注**：4 篇聚焦 AI Agent Skill 本身，第 4 篇是医学手术 Skill 数据集（LASANA），用于类比 Skill 设计思路在"医疗 + 视频 + 标注"场景的另一种落地。

## 二、Contractual Skills：把 Skill 写成「可读合同」

### 2.1 核心问题

企业级 Agent 的 Skill 往往超出"任务指南"——它需要表达目标、输入边界、权限、人工审批点、证据要求、输出契约、质量准则、验证步骤、交接规则。这类 Skill 必须既**对人类可读**，又**对机器可发现 + 渐进加载**。Ting Liu 在 2605.22634v2 提出"合同化 Skill（contractual skills）"，借用 GovernSpec 的 YAML 合同设计哲学，重新组织 SKILL.md 文件结构。

### 2.2 边界澄清

论文明确划清了 7 个相邻概念的边界（不互相替代、各有分工）：

```yaml
contractual_skills:   # 人类可读的任务合同（SKILL.md 主体）
governspec_yaml:      # 机器消费的结构化合同（更严格、可校验）
mcp_surfaces:         # 工具能力暴露（API 协议层）
tool_adapters:        # 工具适配器（调用封装）
runtime_guardrails:   # 运行时护栏（执行期约束）
tracing:              # 调用追溯（可观测性）
evaluation_systems:   # 评估系统（评分、对齐、回归）
```

### 2.3 三项离线实验

论文通过三项离线经验研究验证框架效果：

```text
实验 1（文本生成）：
  - 3 个企业 Skill × 15 个合成任务 × 4 个指令条件 × 8 个生成模型
  - 产出：960 个生成输出 + 1680 条跨裁判评分记录

实验 2（公开 Skill A/B 扩展）：
  - 8 个公开 Skill vs 合同化改写版本
  - 48 个合成任务 × 6 个生成模型 × 2 次重复
  - 产出：1152 个生成输出 + 2 套完整裁判文件
  - 关键结果：均值质量 4.692 → 4.914
             关键错误率 0.083 → 0.013（≈ 84% 降幅）

实验 3（工具调用挑战）：
  - 8 个模型 × 192 次模拟工具调用重放
```

**核心启示**：合同化 Skill 不是装饰，而是显著提升输出质量 + 压低关键错误的工程实践。

## 三、LOOP Skill Engine：一次录制、确定性回放

### 3.1 痛点：周期任务的两难

Xiaohua Wang 等在 2605.14237v1 指出周期性 Agent 任务的根本矛盾：

```text
LLM 灵活性强 + 工具编排灵活 → 但每次调用有随机性 + token 成本巨大
```

LOOP Skill Engine 的目标：对周期任务做到 **99% 成功率 + 99% token 削减**。

### 3.2 系统范式

```text
第一次执行：
  ┌─ Agent 用完整 LLM 推理执行任务
  ├─ 系统透明拦截 + 记录完整工具调用轨迹
  └─ 贪心（按长度降序）模板抽取算法 → 参数化、无分支的 Loop Skill

后续执行：
  ┌─ 完全绕过 LLM
  ├─ 引擎把模板变量解析为实时值
  └─ 确定性顺序重放工具序列
```

### 3.3 两项定理

```yaml
定理 1 Replay Determinism（重放确定性）：
  已验证的 Loop Skill 步骤序列在任何未来执行中保持不变。

定理 2 Write Safety（写入安全性）：
  对持久化配置的并发访问通过可重入锁 + 原子文件替换串行化。
```

### 3.4 基准数据

在间隔 5 分钟到 24 小时的周期任务基准上，**月度 token 消耗削减 93.3%–99%**。即：对那些能套用模板的周期任务，LOOP 把 LLM 调用降到一次性，剩下的是纯确定性回放。

**核心启示**：不是所有 Skill 都值得训练 / 推理——能找到"动作模板"的周期性任务，**录制 + 回放** 是 ROI 最高的方案。

## 四、Skill Test Adequacy：测试通过 ≠ 测试充分

### 4.1 阿里云场景

Haotian Si 等在 2607.22015v3 关注阿里云 Cloud Skill 的真实问题：测试用例通过 ≠ 行为被覆盖。一个 Skill 可能大量测试集中在 CRUD 主路径上，但异常分支、回退路径、资源回收路径**完全没测**。Skill Test Adequacy 提出"场景条件化的测试充分度准则"。

### 4.2 评估对象

输入：

```yaml
skill_package:        # Skill 包（SKILL.md + 资源）
testcase_normalized:
  prompt:             # 用户提示
  initial_resource:   # 初始资源状态
  expected_decision:  # 期望的用户决策
```

输出：

```yaml
suite_score:          # 套件级分数（总覆盖率）
explicit_gaps:        # 显式列出未覆盖的义务（带源定位）
```

### 4.3 五步评估流程

```text
1. 并行产出义务提案（parallel obligation proposals）
2. 保留分歧的聚合（disagreement-preserving aggregation）
3. 用例级状态提案（testcase-level status proposals）
4. 专家审查（expert review）
5. 源对齐推荐（source-grounded recommendations）
```

阿里云将该流程作为**任务成功评估的前置强制门禁**——不通过充分度门槛，不准进入发布前检查。

### 4.4 真实落地数据

```yaml
样本量:           157 个 Skill（门禁驱动补救前的初评）
不达 80% 强制线:  57 个（36.3%）
不达 90% 推荐线:  76 个（48.4%）
产出报告:         132 份，含 639 条义务级推荐（中位数 4 条/Skill）
开源基准:         SkillAdeqBench（已发布可复现子集）
```

**核心启示**：测试充分的视角从"用例通过率"转向"义务覆盖率"——这是 Skill 工程化的关键里程碑。

## 五、SkillConsist：双向图对齐检测不一致

### 5.1 不一致 = 安全风险

Chaofan Meng 等在 2608.07639v1 直接把 Skill 一致性当**安全问题**处理：

```text
不一致的两类危害：
  1. 暴露未声明的危险行为（hidden dangerous behavior）
  2. 导致错误的 Skill 选择（wrong skill selection）
```

### 5.2 方法对比

| 方法 | 思路 | 限制 |
|------|------|------|
| 传统分类法 | 与预定义类别比对 | 僵化、漏覆盖 |
| 属性图法 | 与声明作用域对齐 | 粒度粗 |
| PL-HCL | LLM 学 metadata/instruction/resource 一致性 | 文本与代码混用、声明→多步实现难对齐 |
| **SkillConsist** | LLM 分 + 静态分析 + 双向图对齐 | — |

### 5.3 方法论

```text
声明侧 vs 实现侧：
  - LLM 把声明与实现内容拆为行为记录（behavior records）
  - 静态分析补充实现侧记录

构造两张图：
  - declaration_behavior_graph（声明行为图）
  - implementation_behavior_graph（实现行为图）

对齐与检测：
  1. 从任一侧某条记录出发
  2. 双向图对齐到另一侧找候选子图
  3. 沿行为关系扩展，直到完全表达源侧行为
  4. 图差异（graph differencing）识别冲突 → 检测输出
```

### 5.4 633-Skill 基准

```yaml
数据来源:
  - ClawHub 下载量前 500 的公开 Skill
  - 133 个 Skill-Inject 注入包
合计:   633 个 Skill
构成:
  - 319 个不一致 Skill
  - 314 个一致 Skill
  - 442 处局部不一致标注
```

**核心启示**：声明是给人看的、实现是给机器跑的——任何把两者当两个独立 "代码仓库" 分别维护的 Skill 工程方案，都需要**图级对齐**这道关。

## 六、LASANA：跨域对照案例

### 6.1 异曲同工的"Skill 数据集"

Isabel Funke 等在 2602.09927v1 发布腹腔镜手术技能数据集 LASANA，看似与 AI Agent 无关，但底层思路与 Skill 工程一致——**任务 + 标注 + 数据分割 + 基线** 构成可复用的能力包。

### 6.2 数据规模

```yaml
任务类型:    4 种基础腹腔镜训练动作
视频量:      1270 段双目视频记录
标注 1:      结构化技能评分（3 名独立评估人聚合）
标注 2:      二值错误标签（有/无）
来源:        多数来自腹腔镜训练课程（自然技能分布）
```

### 6.3 提供物

- 任务级预定数据分割（predefined splits）——直接对接未来基准
- 基线深度学习模型结果——为后续对比提供锚点

**对照启示**：不管 Skill 是给 AI 用还是给人练，"**清晰契约 + 充分标注 + 可复现基准**"的工程产物是通用的。

## 七、5 篇论文的横向启示

### 7.1 Skill 工程的 4 道关

```text
设计 → 用 GovernSpec 思路写"合同化" SKILL.md
   ↓
录制 → 周期性任务用 LOOP 模板回放，省 90%+ token
   ↓
测试 → 不止看用例通过率，看"义务覆盖率"
   ↓
一致 → 声明 vs 实现做双向图对齐，挡安全隐患
```

### 7.2 一句话总结

Agent Skill 不是 markdown 模板——它是**带设计契约、能录制回放、能被测充分、能被图对齐**的工程产物。

### 7.3 落地建议

```yaml
个人开发者:
  - 重点解决"录制"关：用 LOOP 思路周期性任务回归
  - 一致性人工 review 即可（暂不需要图对齐）

企业内 Skill 团队:
  - 全 4 关都过：
    设计（合同化 SKILL.md）
    录制（确定性回放）
    测试（义务覆盖率强制门禁）
    一致性（图级自动检测）

研究社区:
  - 跨域对照参考 LASANA：清晰契约 + 充分标注 + 公开基准
  - 关注 SkillAdeqBench、ClawHub 等公开基准的演进
```

### 7.4 与"微软 Skill Recorder"的关系

本文的 5 篇论文中**没有微软作者**或"SoundWave / Skill Recorder"专文，但 vault 主题目录名为 `microsoft-skill-recorder`，推测源自早期微软的 SoundWave 类语音录制思路——把"录制 + 回放"理念推广到 AI Agent Skill。本文 LOOP 论文与该思想一脉相承。

## 八、模型版本说明

> ⚠️ **以发布时为准**：本文涉及的 5 篇论文均为 2026 年 arXiv 预印本，方法名（Contractual Skills / LOOP Skill Engine / Skill Test Adequacy / SkillConsist / LASANA）与基准数据均来自论文原文，未做二次加工。
>
> 如发现链接失效、数值偏差或更新版本，**以 arXiv 最新版本为准**。
>
> 本文由 WorkBuddy / Claude Code 辅助整理，仅作研究学习用途。
