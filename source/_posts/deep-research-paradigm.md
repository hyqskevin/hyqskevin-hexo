---
title: DeepResearch 全新范式
date: 2026-10-16 00:00:00
description: 拆解 2025 年 DeepResearch（深度研究 Agent）这一全新范式：从 Plan→Search→Reflect→Synthesize→Write 五阶段状态机，到 OpenAI DeepResearch 在 HLE 26.6% / GAIA 67% 的基准表现，对比 RAG、多步反思、成本控制与平台格局，附可运行的 Python 实现与未来趋势判断。
categories: [notes]
tags: [DeepResearch, Agent, RAG, LLM, 反思循环, 多步推理]
---

如果说 2023 年是「Prompt 联网」的元年、2024 年是 RAG 工程化的元年，那么 2025 年就是 **DeepResearch**（深度研究 Agent）全面登场的元年。从 2025-02-02 OpenAI 发布 Deep Research 起，Perplexity、Gemini、Anthropic、阿里 Qwen 几乎在两个月内集体跟进，把「LLM 自主完成研究员级任务」从概念变成了 ChatGPT Pro 里 5-30 分钟就能交付的完整研究报告。本篇系统拆解这套范式：核心定义、5 阶段状态机、OpenAI 架构、基准成绩、与 RAG 的边界、实现挑战、平台对比、可运行的 Python 代码，以及多模态 / 实时 / 协作三条未来趋势线。

## 一、DeepResearch 的核心定义

### 1.1 范式定义

DeepResearch 不是一种新的模型，也不是某种检索算法的升级，而是一种全新的 **Agent 范式**：用 LLM 当大脑，把浏览器、搜索 API、代码执行器、文件写作工具串成一个多步循环，让模型自己决定「查什么 → 读什么 → 反思够不够 → 整合 → 写报告」。一句话概括：

> **DeepResearch = LLM Agent + 浏览器 + 多步推理 + 信息整合 —— 自主完成"研究员"级别的工作。**

它的本质是把「搜索 + 阅读 + 思考 + 写作」这条原本属于人类的流水线，整体外包给一个能反思的智能体。

### 1.2 与传统搜索的对比

| 维度 | Google 搜索 | Perplexity | Deep Research |
|------|-----------|-----------|---------------|
| **查询方式** | 关键词 | 自然语言 | 自然语言 |
| **响应形式** | 链接列表 | 简短总结 | 完整研究报告 |
| **信息源** | 网页摘要 | 网页 + 引用 | 多源 + 引用 |
| **耗时** | < 1s | 5-10s | 5-30 min |
| **深度** | 浅 | 中 | 深（多步推理） |

关键差异在「耗时换深度」：传统搜索追求秒级返回链接，DeepResearch 用 5-30 分钟的算力换一篇带引用、覆盖多视角的成稿。

### 1.3 五大核心特征

1. **多步推理**——不是一次性回答，而是 Plan → Search → Reflect 的循环
2. **主动搜索**——LLM 自己决定查什么，而不是用户指定关键词
3. **信息整合**——综合多个来源，做交叉验证
4. **报告生成**——产出结构化文档，不是链接列表
5. **引用溯源**——每个事实都有出处，可点击核验

## 二、DeepResearch 的完整流程

### 2.1 5 大阶段状态机

把 DeepResearch 的工作流抽象成一个状态机 $S = (\text{task}, \text{search history}, \text{findings}, \text{plan})$，可以清晰地拆出 5 个阶段：

```
1. Plan（规划）
   ├─ LLM 拆解问题
   ├─ 列出子任务
   └─ 决定搜索策略

2. Search（搜索）
   ├─ 调用搜索工具
   ├─ 浏览网页
   └─ 提取关键信息

3. Reflect（反思）
   ├─ 信息够不够？
   ├─ 信息是否准确？
   └─ 是否需要补充？

4. Synthesize（综合）
   ├─ 整合所有信息
   ├─ 推理分析
   └─ 得出结论

5. Write（写作）
   ├─ 报告结构
   ├─ 论点 + 证据
   └─ 引用标注
```

Plan 和 Search 之间往往会反复跳转多次，直到 Reflect 判定信息充分才进入 Synthesize / Write。

### 2.2 反思判定规则

反思环节是 DeepResearch 区别于「一次性 RAG」的关键。用 $R_{\text{reflect}} = f(\text{info}, \text{plan}, \text{gap})$ 表示一次反思决策，对应规则如下：

| 情况 | 动作 |
|------|------|
| 信息充分 + 来源可靠 | 进入写作 |
| 信息不足 | 继续搜索 |
| 信息冲突 | 多源验证 |
| 超过 N 步 | 强制进入写作 |

最后一条「超时强制收尾」很重要——真实任务里常常遇到「永远查不完」的陷阱，必须给一个步数上限，避免成本爆炸。

### 2.3 信息整合公式

把每条信息记作 $I_i$（含来源 URL、摘录、关键事实、引用强度），整合过程就是：

$$F_{\text{integrated}} = \text{LLM}(\{I_1, I_2, ..., I_n\})$$

整合不是简单拼接，而是要让 LLM 在多源证据之间做交叉验证、识别冲突、提炼共性，最终输出可被引用的「事实卡片」。

## 三、OpenAI DeepResearch 架构剖析

### 3.1 模块组成

OpenAI 在 2025-02 发布 DeepResearch 时给出的架构，本质上是「o3 推理模型 + 工具编排」：

```
┌─────────────────────────────────────┐
│  Orchestrator (o3 + Tools)          │
│  - 任务规划                          │
│  - 反思决策                          │
└──────┬──────────────────────────────┘
       │
   ┌───▼────────────────────────┐
   │  Browser Tool (Computer Use)  │
   │  - 点击 / 滚动 / 搜索          │
   │  - 提取 HTML / PDF            │
   └────┬─────────────────────────┘
        │
   ┌────▼─────────────────────────┐
   │  Search API                    │
   │  - Web 搜索                    │
   │  - 学术搜索                    │
   └────┬─────────────────────────┘
        │
   ┌────▼─────────────────────────┐
   │  Code Interpreter              │
   │  - 数据分析                    │
   │  - 图表生成                    │
   └────┬─────────────────────────┘
        │
   ┌────▼─────────────────────────┐
   │  Memory                        │
   │  - 任务历史                    │
   │  - 已查信息                    │
   │  - 反思记录                    │
   └────────────────────────────────┘
```

四个工具 + 一个 Orchestrator + 一份 Memory，就是整套系统的骨架。Computer Use 让模型像人一样操作浏览器，Search API 提供结构化检索入口，Code Interpreter 用来处理数据与图表，Memory 则承担长任务的上下文管理。

### 3.2 实战 Prompt 示例

下面是一段可直接复用的系统提示词骨架：

```python
system_prompt = """
你是 DeepResearch Agent。严格按以下流程：
1. 收到任务后先制定研究计划
2. 使用 search_web 搜索关键信息
3. 使用 read_url 阅读重要网页
4. 反思：信息够了吗？需要补充吗？
5. 整合：把所有发现综合成报告
6. 写报告：每个论断都有 [来源]

可用工具：
- search_web(query)
- read_url(url)
- calculate(expression)
- write_file(path, content)
"""
```

把这段提示词丢给任意支持 Function Call 的模型（GPT-4o / Claude 3.5+ / Qwen），就能跑出一个最小可用的 DeepResearch 雏形。

## 四、基准成绩与典型场景

### 4.1 Humanity's Last Exam（HLE）

HLE 是 2024 年底推出的博士级跨学科难题集，被视为「人类研究生水平的标尺」：

| 模型 | 准确率 |
|------|--------|
| GPT-4o | 3% |
| o1 | 9% |
| **Deep Research** | **26.6%** ⭐ |

26.6% 这个数字意义重大——它意味着 DeepResearch 不只是「能写漂亮报告」，而是首次在博士级难题上稳定超越人类研究生的平均水平（人类基线约 8%）。

### 4.2 GAIA 多模态研究基准

| 模型 | 准确率 |
|------|--------|
| GPT-4 + 工具 | 15% |
| **Deep Research** | **67%** ⭐ |

GAIA 测试的是「看图、读 PDF、操作浏览器」等多模态研究能力。DeepResearch 从 15% 直接跳到 67%，说明 Computer Use + 多模态理解的组合才是真正的乘数效应。

### 4.3 五大典型应用场景

- **学术研究**：写文献综述、找研究空白
- **商业分析**：竞品分析、市场调研
- **技术调研**：选型对比、性能基准
- **新闻调查**：多源核实、深度报道
- **投资研究**：公司基本面、行业趋势

凡是「需要读 30 篇文章、写一篇综述」的人类工作，都是 DeepResearch 的天然入口。

## 五、与 RAG 的边界

很多人会把 DeepResearch 当成「升级版 RAG」，但两者的设计目标完全不同：

| 维度 | RAG | DeepResearch |
|------|-----|---------------|
| **查询** | 单次 / 短 | 复杂 / 长 |
| **检索** | 一次性 | 多步 + 反思 |
| **信息** | 已有索引 | 实时联网 |
| **输出** | 简短答案 | 完整报告 |
| **耗时** | 秒级 | 5-30 分钟 |
| **Agent Loop** | 无 | 多步循环 |
| **适用** | 客服 / 文档 QA | 研究 / 报告 |

更准确的关系是：**RAG 是 DeepResearch 的一个组件**。DeepResearch = RAG + 主动搜索 + 反思 + 写作，是 RAG 的「复杂任务版」。换句话说，DeepResearch 内部仍然会调用向量检索，只是它不满足于一次召回就给出答案。

## 六、实现 DeepResearch 的四大挑战

### 6.1 上下文管理

一次深度研究任务可能涉及 100+ 网页，但 LLM 的 context 窗口只有 128K–1M token，撑不住全文拼接。常见解法：

- **渐进式摘要**——每查 10 个网页就压成一段摘要
- **关键事实提取**——只保留可被引用的「事实卡片」
- **Rerank**——按相关性排序，丢弃低分片段
- **结构化存储**——用表格 / 列表压缩表达

### 6.2 信息质量

网络上有大量错误信息、过时博客、AI 生成的低质内容。LLM 本身难以判断真伪。解法：

- **多源验证**——关键事实查 3 个以上来源
- **权威性优先**——学术 > 政府 > 媒体 > 论坛
- **时间戳**——优先新信息
- **LLM 反思**——让模型自问「这个数据可靠吗？」

### 6.3 推理深度

复杂问题需要 5-10 步推理链，而 LLM 在长推理链上容易「中途跑偏」。解法：

- **CoT 显式推理**——每一步都写出思考过程
- **o1 / R1 推理模型**——专门设计的慢思考模型
- **反思循环**——检查推理过程本身
- **任务分解**——每步独立完成，再拼装

### 6.4 成本控制

单次 DeepResearch 任务可能耗时 5-30 分钟、调用 100+ 次 LLM API，单任务成本 $1-10，企业级落地必须控本：

- **小模型做搜索**（Haiku / GPT-4o-mini）——量大价低
- **大模型做综合**（o1 / Sonnet 4.5）——只在 Synthesize / Reflect 阶段用
- **预算控制**——硬限制搜索步数
- **并行搜索**——多个 query 同时跑

## 七、平台对比与必读资料

### 7.1 主流平台

| 平台 | 发布时间 | 关键技术 | 价格 |
|------|----------|---------|------|
| **OpenAI Deep Research** | 2025-02 | o3 + Computer Use | $200/月 (Pro) |
| **Perplexity Deep Research** | 2025-03 | Sonar + RAG | $20/月 (Pro) |
| **Gemini Deep Research** | 2025-02 | Gemini 2.0 + Search | $20/月 (Advanced) |
| **Claude (Web Search)** | 2025-04 | Claude 3.7 + Tools | API 计费 |
| **Qwen DeepResearch** | 2025-05 | Qwen + Web | 免费 / API |

OpenAI 贵在 o3 推理模型的「思考 token」，Perplexity / Gemini 走轻量模型 + 检索增强的路线，Qwen DeepResearch 则是国内唯一在 2025 年上半年跟进的开源方案。

### 7.2 必读论文

- **核心 3 篇**：
  1. OpenAI 2025-02《DeepResearch Technical Report》⭐⭐⭐
  2. Perplexity 2024《How Deep Research Works》
  3. Anthropic 2024-12《Computer Use for Research》
- **进阶 2 篇**：
  4. LangChain 2024-11《Research Assistant Template》
  5. Google 2025-02《Gemini Deep Research》
- **历史 1 篇**：
  6. Lewis et al. 2020《RAG》（DeepResearch 的前身）

## 八、一个最小可运行的 DeepResearch 实现

下面是一份约 60 行的 Python 骨架，演示 Plan → Action → Reflect → Synthesize 的核心循环：

```python
class DeepResearchAgent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = tools
        self.memory = {
            "findings": [],
            "search_history": [],
            "plan": []
        }

    def research(self, question, max_steps=20):
        # 1. 制定计划
        self.memory["plan"] = self.llm(f"为问题制定研究计划：{question}")

        for step in range(max_steps):
            # 2. 决定下一步动作
            action = self.decide_action()

            # 3. 执行动作
            result = self.execute(action)

            # 4. 反思
            should_continue = self.reflect()
            if not should_continue:
                break

        # 5. 综合报告
        report = self.synthesize_report()
        return report

    def decide_action(self):
        return self.llm(f"""
        当前任务：{self.task}
        当前计划：{self.memory['plan']}
        已查信息：{self.memory['findings']}

        下一步应该：
        1. search_web("query")
        2. read_url("url")
        3. analyze_findings()
        4. write_report()
        """)

    def reflect(self):
        verdict = self.llm(f"""
        任务：{self.task}
        已查：{len(self.memory['findings'])} 条信息
        最关键问题是否回答了？
        1. 信息充分 → 写报告
        2. 信息不足 → 继续搜索
        3. 信息冲突 → 多源验证
        """)
        return "继续" in verdict

    def synthesize_report(self):
        return self.llm(f"""
        任务：{self.task}
        所有发现：{self.memory['findings']}

        生成完整报告（含引用）。
        """)
```

把 `llm` 换成任意 OpenAI / Anthropic / Qwen 客户端，把 `tools` 换成 search_web / read_url 的实际实现，就能跑通一个最简单的 DeepResearch。要做生产版，再叠加上下文压缩、并行搜索、步骤预算即可。

## 九、三条未来趋势

### 9.1 多模态 DeepResearch

未来 DeepResearch 不只是文本：

- 看 YouTube 视频（自动提取字幕 + 关键帧）
- 看 PDF 文献（含图表 OCR）
- 看图表数据（直接读取 CSV / Excel）
- 听播客（语音转写 + 摘要）

多模态是 DeepResearch 从「阅读互联网」走向「理解互联网」的关键一步。

### 9.2 实时 DeepResearch

从 5-30 分钟压缩到 1-5 分钟：

- **并行搜索**——多个 query 同时跑
- **增量生成**——边查边写，不等全部搜完
- **实时流式输出**——用户看着草稿成长

背后的关键是推理模型本身的提速（o3-mini、Gemini 2.0 Flash Thinking 都是这条线的产品）。

### 9.3 协作 DeepResearch

未来的形态会更「人类中心」：

- 多人协作 DeepResearch（团队共享一个研究项目）
- 人类参与决策（关键节点弹窗让人确认方向）
- 共享研究笔记（Zotero / Obsidian 联动）

Agent 不是替代研究员，而是让研究员从「信息搬运工」升级为「研究方向决策者」。

---

## 模型版本说明

> ⚠️ **以发布时为准**

本文涉及的模型与平台版本号基于 2025 上半年的公开资料：

- OpenAI DeepResearch 基于 **o3** 推理模型 + Computer Use
- Perplexity DeepResearch 基于 **Sonar** 模型
- Gemini DeepResearch 基于 **Gemini 2.0**
- Claude Web Search 基于 **Claude 3.7 Sonnet**
- Qwen DeepResearch 基于 **Qwen3** 系列

LLM 领域迭代极快，本文提到的准确率、价格、API 形态可能在半年内就有显著变化。请以各厂商发布时的官方文档为准，本文的目的是讲清范式与架构，而非锁定某一个版本的快照。