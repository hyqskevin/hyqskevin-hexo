---
title: Agent新闻2026Q2
date: 2026-09-08 00:00:00
description: 汇总 2026 年 Q2（4–7 月）AI 智能体与 LLM 领域关键资讯：从 Prompt Engineering 到 Loop / Harness / Agentic Engineering 的范式演进，以及 DeepSeek V4、Claude、GPT 等基础模型与 Codex、Claude Code 等工具实践。
categories:
  - notes
tags:
  - Agent
  - LLM
  - Loop Engineering
  - Harness
  - Claude Code
  - Codex
  - 2026Q2
---

2026 年第二季度，AI 工程的方法论从「写好 Prompt」快速转向「设计好循环与系统」。以下按智能体、基础模型、产品工具、综合实践四个维度，整理本季度值得关注的文章与动态（链接已剔除跟踪令牌）。

## 一、智能体：从 Prompt 到 Loop 的工程演进

Q2 最明显的趋势，是工程重心从单次 Prompt 转向可持续运行的 Agent Loop 与 Harness 架构。

### 1.1 自进化与 Skills

- 05-09 · 深度解析 Hermes Agent 如何实现「自进化」及其 Prompt / Context / Harness 设计实践 · https://mp.weixin.qq.com/s?__biz=MzIzOTU0NTQ0MA==&mid=2247559664&idx=1&sn=2c26ac0a4898e4c986d289a543808dd7
- 05-13 · 基于 Harness + SDD + 多仓管理模式的 AI 全栈开发实践（得物技术）· https://my.oschina.net/u/5783135/blog/19654120
- 05-15 · Agent Skill 规范、构建与设计模式 · https://mp.weixin.qq.com/s?__biz=MzIzOTU0NTQ0MA==&mid=2247559942&idx=1&sn=08953bb9fff5a3594e80a381157c5c11
- 05-22 · 让 Agent Skills 自进化，回答质量翻倍 · https://mp.weixin.qq.com/s/z6BOI1Um6MVYi2D5CsnSPA
- 06-01 · 微软开启 Skills 自我进化，像训练神经网络一样训练技能（一周 3.3k star）· https://mp.weixin.qq.com/s/pMlyj3a3KOh8L7cIHClRXA

### 1.2 Loop Engineering 与 Harness

- 06-10 · Loop Engineering 概念提出 · https://x.com/addyosmani/article/2064127981161959567
- 06-11 · Loop Engineering 深度解析与实战指南 · https://mp.weixin.qq.com/s/-BnxCLNngoFH4S5EAdaYxQ
- 06-15 · Prompt 该退环境了，未来属于 Loop Engineering · https://mp.weixin.qq.com/s/omwt7d9BSFX7kotW9vo9bQ
- 06-16 · AI Agent Loop 到底是什么，多数人一上来就用错 · https://mp.weixin.qq.com/s/-3uMah1y8Lj3y2r_3Ue_JA
- 06-16 · 让 Agent 在对话中成长：自进化机制的五层实现 · https://mp.weixin.qq.com/s/xsAhH6ydtkGhCs-azOE7rw
- 06-20 · 从 Prompt Engineering 到 Harness Engineering 的四次演进 · https://mp.weixin.qq.com/s/5tFXJCzmQ5SaaB-Y7vJRbA
- 06-24 · Loop Engineering 实践指南：在 Code Buddy 中构建自主循环系统 · https://mp.weixin.qq.com/s/YqIyL7uW4EV2r5HLDW7wcA
- 06-29 · 万字综述 Prompt 到 Loop 进化 · https://mp.weixin.qq.com/s/hcgKahtQRE2QqI6xplv2Rg
- 07-02 · 企业基于 SDD 的 AI 编程落地：从 Harness 到 Loop 工程 · https://mp.weixin.qq.com/s/nkTZpaMVQbMoIGTwz6cyPA
- 07-03 · Agentic Engineering 概念（上）：Agent 的底层逻辑 · https://x.com/vincemask/article/2072503940672008407
- 07-13 · OpenSpec、Superpowers 与 Harness 架构「三剑客」深度解析 · https://mp.weixin.qq.com/s/SktxLULElhz9FZ5zsBLnTw
- 07-15 · 基于人机协作的 AI 研发新体系：从 Harness 到 Loop 工程 · https://mp.weixin.qq.com/s/GFlVbB4DTtNjfNKq3zWIAA

## 二、LLM 与基础模型

### 2.1 模型发布与架构

- 04-30 · DeepSeek V4 发布，全网最细解读与技术报告拆解 · https://mp.weixin.qq.com/s/mjaBklBlAhUF4AXvVgMo1A
- 04-30 · 开源版 GPT Image 2：商汤 SenseNova U1 实测 · https://mp.weixin.qq.com/s/o1p-t1wIa1BnA_cQ05Zu3g
- 04-30 · KimiK2.6 设计能力超越 Claude Design · https://mp.weixin.qq.com/s/Cuj6_YpW3Tgn8ltA03Gu9w
- 04-30 · 读完这篇就搞懂 DeepSeek V4 · https://mp.weixin.qq.com/s/MamimcCQj_Hd12T8iFVmKg
- 05-08 · GPT-5.5 与 Claude 4.7 的 Token 使用技巧（附官方指南）· https://mp.weixin.qq.com/s/3k0cU9uWB1XPgJpi3_RSAA
- 05-19 · 从 Gemma 4 到 DeepSeek V4 的近期重大架构进化 · https://mp.weixin.qq.com/s/wRtvQK0P0o4cvVTlRq0LXA
- 06-04 · Claude Opus 4.8 + Workflows 并行上百个 Subagents · https://mp.weixin.qq.com/s/LRB3OOwCSYZ9Y7HFRC2z2A

### 2.2 工程化应用

- 06-01 · 基于 Nestjs + SQLite + Embedding 构建低成本语义 RAG 知识库 · https://mp.weixin.qq.com/s/Nd1dO2tvWlgU9bzgIrofsg
- 07-15 · RAG：从前世今生到技术全景 · https://x.com/snowboat84/article/2076868301809225932

## 三、AI 产品与工具

### 3.1 Vibe 范式扩展

- 06-04 · 鹅厂团队的 Vibe Coding 实践分享 · https://mp.weixin.qq.com/s/4EI3b2-U91Qf4rqLGcwhDg
- 06-05 · 写代码能 Vibe Coding，办公为何还不能 Vibe Officing · https://my.oschina.net/u/4545365/blog/19694250

## 四、综合实践（多分类）

### 4.1 Claude Code 与 Codex 拆解

- 05-09 · Claude Code 源码拆解：从启动到多 Agent 扩展层 · https://mp.weixin.qq.com/s?__biz=MzIzOTU0NTQ0MA==&mid=2247559548&idx=1&sn=e6a3f5d3b01eb32e14743130fb3a6d2a
- 05-09 · OpenClaw 在 Prompt / Context / Harness 三维度的设计哲学 · https://mp.weixin.qq.com/s?__biz=MzIzOTU0NTQ0MA==&mid=2247559511&idx=1&sn=64e933b0264e47f0940e693e315e0c82
- 05-21 · Codex 官方团队分享如何把 Codex 用到极致 · https://mp.weixin.qq.com/s/BzR8QdVkEg2nLtZP1wVXWQ
- 06-02 · Claude Code 四层记忆系统源码解剖 · https://mp.weixin.qq.com/s/DLyeq8ktyQQJE6UtyI6GUQ
- 06-11 · 从 Hook 到 WebSocket，深扒 Claude Code Agent Monitor 架构 · https://mp.weixin.qq.com/s/_ewq4_xlXIkLyT9kXHIs2A
- 06-20 · Codex 大更新：人在电脑上的操作成为 AI 经验包 · https://www.ifanr.com/1669204
- 06-21 · 深入理解 Claude Code：从 CLAUDE.md 到 Hooks / Skills / Subagents · https://mp.weixin.qq.com/s/-7C4WqRsuKlmBj6I31Is1w
- 06-22 · Codex × 剪辑 Skills，一句话剪视频（免费开源）· https://mp.weixin.qq.com/s/elM9M7UbspSt9RhQUIUPog
- 06-23 · 从 OpenClaw 到 FastClaw：如何设计优秀的多 Agent 架构 · https://mp.weixin.qq.com/s/mWU01CnuAoSnAvpjX5A4CA
- 06-30 · 基于 OpenSpec 的 AI 编程落地案例 · https://mp.weixin.qq.com/s/BMoejxPM8UBDStn24c5egg
- 07-07 · Codex + HyperFrames 自动剪辑视频技术解析 · https://mp.weixin.qq.com/s/n4j_eCLhWOWOY47PgemR9A

## 模型版本说明

⚠️ 以发布时为准：文中涉及的 DeepSeek V4、GPT-5.5、Claude 4.7 / Opus 4.8、Gemma 4、KimiK2.6、SenseNova U1 等模型名称与版本，均来自 Q2 资讯原文，实际能力、命名与可用性请以各厂商正式发布时为准。
