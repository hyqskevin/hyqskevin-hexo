---
title: 智能体 Q2 资讯合集
date: 2026-10-18 00:00:00
description: 围绕 2026 年第二季度，整理 Agent、Harness、Loop Engineering、LLM 与 AI 产品领域的精选文章与工程实践，涵盖架构演进、源码拆解与企业级落地。
categories:
  - AI 资讯
tags:
  - Agent
  - LLM
  - Loop Engineering
  - Harness
  - Claude Code
  - Codex
  - 2026Q2
---

2026 年第二季度，AI 工程领域几乎被三个关键词主导：Harness、Loop Engineering、Skills 自进化。本季度大模型侧的迭代依旧密集（DeepSeek V4、Claude Opus 4.8、Kimi K2.6、SenseNova U1），RAG 在低成本方案下重新走红；而 Vibe Coding 的余波蔓延到了办公场景，"Vibe Officing" 成为新口号。本文按主题梳理这个季度值得收藏的文章与实践。

## 一、智能体：Harness、Loop 与 Skills 的工程化爆发

围绕 Prompt → Harness → Loop 的演进路径，Q2 出现了大量工程化文章，把"自进化""循环工程""SDD 落地"三条线索交织在一起。

### 1.1 自进化机制与 Harness 设计

Hermes Agent 给出三层视角：Prompt、Context、Harness 三者协同，使 Agent 在对话中持续改进。同时 Harness + SDD + 多仓管理模式把 Harness 从概念推向企业级落地。

代表文章：

- 2026-05-09 · 深度解析 Hermes Agent 如何实现"自进化"及其 Prompt / Context / Harness 的设计实践
- 2026-05-13 · 基于 Harness + SDD + 多仓管理模式的 AI 全栈开发实践（得物技术）
- 2026-05-15 · Agent Skill 规范、构建与设计模式
- 2026-05-22 · 怎么让 Agent Skills 自进化？Agent 回答质量翻倍
- 2026-06-01 · Agent Harness：从模型竞赛到系统工程的演进与实践
- 2026-06-01 · 一周 3.3k star，微软开启 Skills 自我进化
- 2026-06-16 · 让 Agent 在对话中成长：自进化机制的五层实现

### 1.2 Loop Engineering：从 Prompt 到循环

"Prompt 该退环境了，未来属于 Loop Engineering" 成为本季度最具冲击力的论断。Loop 把 Agent 的能力边界从单次推理扩展到持续循环、自我修正。

代表文章：

- 2026-06-10 · Loop Engineering. 循环工程（Addy Osmani）
- 2026-06-11 · Loop Engineering 深度解析与实战指南（全网最全）
- 2026-06-15 · Prompt 该退环境了，未来属于 Loop Engineering
- 2026-06-16 · AI Agent Loop 到底是什么？多数人一上来就用错了
- 2026-06-24 · Loop Engineering 实践指南：在 Code Buddy 中构建自主循环系统
- 2026-06-29 · 最新！万字综述 Prompt 到 Loop 进化
- 2026-07-03 · Agentic Engineering 概念（上）：Agent 的底层逻辑

### 1.3 SDD 与企业级落地

围绕 Spec-Driven Development 与 OpenSpec / Superpowers / Harness 架构组合，企业级 AI 编程的方法论逐步成型。

代表文章：

- 2026-07-02 · 企业基于 SDD 的 AI 编程落地：从 Harness 工程到 Loop 工程实践
- 2026-07-13 · 企业基于 SDD 的 AI 编程王炸：OpenSpec、Superpowers 与 Harness 架构三剑客深度解析
- 2026-07-15 · 基于人机协作的 AI 研发新体系架构：从 Harness 工程到 Loop 工程实践

## 二、大模型与基础架构

LLM 一侧的关注点落在新版本发布、多模态进展与 RAG 工程化。DeepSeek V4、Claude Opus 4.8、Kimi K2.6、商汤 SenseNova U1 构成了本季度的"模型日历"。

### 2.1 新模型与多模态

- 2026-04-30 · DeepSeek V4 发布，全网最细解读 & 技术报告拆解
- 2026-04-30 · 开源版的 GPT Image 2，信息图、连续图文、本地部署全拿下（商汤 SenseNova U1 实测）
- 2026-04-30 · Kimi K2.6 设计能力超越 ClaudeDesign
- 2026-04-30 · 读完这篇，你就搞懂 DeepSeek v4 了
- 2026-05-08 · GPT-5.5 和 Claude 4.7 的 11 个 Token 省烧小技巧（附官方指南）
- 2026-05-19 · LLM 近期重大架构进化一览：从 Gemma 4 到 DeepSeek V4
- 2026-06-04 · Claude Opus 4.8 + Workflows，一次性并行上百个 Subagents

### 2.2 RAG 与检索增强

RAG 重新成为焦点，工程师开始用更低成本的方式重建语义检索层。

- 2026-06-01 · 基于 NestJS + SQLite + Embedding 构建低成本语义 RAG 知识库
- 2026-07-15 · RAG：从前世今生到技术全景

## 三、AI 产品与 Vibe 范式

Vibe Coding 的余波正蔓延到办公场景，"Vibe Officing" 成为新口号。本季度还出现了 Codex × 剪辑 Skills 这类一句话剪视频的工具，把 Skills 范式推向内容生产侧。

- 2026-06-04 · 还在好奇鹅厂人 Vibe Coding 了什么东西？
- 2026-06-05 · 写代码可以 Vibe Coding 了，为什么办公还不能 Vibe Officing？
- 2026-06-22 · 大更新！Codex × 剪辑 Skills，一句话剪视频，免费开源
- 2026-07-07 · Codex + HyperFrames 自动剪辑视频：深度技术解析与工程化最佳实践

## 四、综合：Claude Code 与 Codex 源码拆解

跨分类的内容大多集中在两款明星产品的源码级解读：Claude Code 与 Codex。从 CLAUDE.md、Hooks、Skills、Subagents 到四层记忆系统、WebSocket / Agent Monitor，源码文章几乎把整个 Agent 运行时扒了个干净。

代表文章：

- 2026-05-09 · Claude Code 源码拆解：从启动到多 Agent 扩展层
- 2026-05-09 · 深度解析 OpenClaw 在 Prompt / Context / Harness 三个维度中的设计哲学与实践
- 2026-05-21 · 来自 Codex 官方团队的分享：如何把 Codex 用到极致
- 2026-06-02 · Claude Code 四层记忆系统源码解剖：从磁盘存储到模型注入的完整数据流
- 2026-06-11 · 从 Hook 到 WebSocket，深扒 Claude Code Agent Monitor 源码架构与 6 大核心技术
- 2026-06-20 · Codex 大更新：电脑操作正在成为 AI 经验包
- 2026-06-21 · 深入理解 Claude Code：从 CLAUDE.md 到 Hooks、Skills、Subagents
- 2026-06-23 · 从 OpenClaw 到 FastClaw：如何设计优秀的多 Agent 架构
- 2026-06-30 · 基于 OpenSpec AI 编程落地案例实践

## 五、模型版本说明

⚠️ 以发布时为准：本文涉及的模型名称（包括但不限于 DeepSeek V4、Claude Opus 4.8、Claude 4.7、GPT-5.5、Gemma 4、Kimi K2.6、商汤 SenseNova U1、GPT Image 2）均以各产品**发布时**的官方信息为准；版本号、能力边界与 API 形态可能随后续更新而变化，使用前请查阅对应官方文档。
