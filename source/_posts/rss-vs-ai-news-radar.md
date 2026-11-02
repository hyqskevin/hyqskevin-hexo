---
title: ai-news-radar vs RSS Cron 信源对比
date: 2026-09-02 00:00:00
description: 评估 ai-news-radar 和本地 RSS Cron 两个 AI 信息聚合方案的重叠与互补：信源清单、优缺点、合并优化建议、5 层分层架构、P0/P1/P2 优先级信源接入方案。
categories:
  - notes
tags:
  - AI
  - 信息聚合
  - RSS
  - 对比
  - ai-news-radar
---

最近想把本地跑的 RSS Cron（用 `rss-fetcher.js` + `rss-sources.json`）和社区流行的 [ai-news-radar](https://github.com/LearnPrompt/ai-news-radar) 合并优化。两个方案各有强项，本文是信源对比 + 合并建议。

## 一、两个方案概览

| 维度 | ai-news-radar | 本地 RSS Cron |
|---|---|---|
| **运行位置** | GitHub Actions 每 30 分钟 | 自部署 cron（5-30 分钟） |
| **存储** | GitHub 仓库 data/ 目录 JSON | 本地文件系统 |
| **信源数** | 20 个内置 fetcher | 22 个 RSS 源（20 启用） |
| **AI 处理** | 评分 + 双语翻译 + 故事合并 | 关键词过滤 + 去重 |
| **可读产物** | 8 个 JSON + 1 个 daily brief | 1 个 JSON + 1 个 Markdown 日报 |
| **Skill 集成** | 官方 `ai-radar` Skill | 无 |
| **资源消耗** | GitHub Actions 免费额度 | 自己的服务器 |

## 二、20 个信源分类

### ai-news-radar 官方源（7 个）

OpenAI News / Google DeepMind / Google AI Blog / Hugging Face Blog / GitHub AI & ML / GitHub Changelog / OpenAI Skills

### ai-news-radar 聚合源（13 个 fetcher）

| 函数 | 数据来源 | 特点 |
|---|---|---|
| `fetch_techurls` | techurls.com | 多源科技链接聚合 |
| `fetch_buzzing` | buzzing.cc | 全球热点，无需翻墙 |
| `fetch_iris` | iris.findtruman.io | 信息流订阅聚合 |
| `fetch_bestblogs` | bestblogs.dev | 每周精选 Newsletter |
| `fetch_tophub` | tophub.today | 中国热点排行榜 |
| `fetch_zeli` | zeli.app | Hacker News 24h 最热 |
| `fetch_waytoagi_recent_7d` | 飞书知识库 | WaytoAGI 近 7 日 |
| `fetch_official_ai_updates` | 官方站点 | Anthropic + OpenAI Changelog |
| `fetch_ai_breakfast` | Newsletter | AI Breakfast |
| `fetch_follow_builders` | GitHub JSON | Builder 动态（X + 博客 + 播客） |
| `fetch_ai_hubtoday` | Web Scrape | AI 资讯日报 |
| `fetch_aibase` | aibase.com | AIbase 新闻 |
| `fetch_newsnow` | newsnow.busiyi.world | HN/PH/GitHub/掘金/少数派 聚合 |

### 本地 RSS Cron 源（22 个）

**默认 4 个**：Bloomberg Technology / 36 氪 / 少数派 / Solidot

**AI 模式 14 个**：VentureBeat AI / Wired AI / MIT Tech Review / OSCHINA / 钛媒体 / 36 氪 / 爱范儿 / 知乎日报 / 机器之心 / 量子位 / 甲子光年 / GitHub Trending (Python/JS/TS)

**额外 12 个**：Hugging Face Blog / Interconnects AI / The Gradient / Import AI / The Batch / Last Week in AI / AI News / Ben's Bites / VentureBeat AI / Hacker News / Dev.to / ArXiv cs.AI / Linux.do / 今日头条热榜 / B 站热搜 / HelloGitHub 月刊 / TechCrunch

## 三、重叠与互补

**完全重叠（6 个）**：Hugging Face Blog / Wired AI / 36 氪 / VentureBeat AI / TechCrunch / GitHub Trending

**ai-news-radar 独有**（RSS Cron 没的）：

- **OpenAI / DeepMind / Google AI / Anthropic 一手源**（P0 重要）
- **AI Breakfast** 精选日报
- **AI HOT** 每日 AI 热点聚合
- **WaytoAGI** 飞书知识库
- **AI HubToday / AIbase** 中文 AI 资讯

**本地 RSS Cron 独有**：

- **Import AI / Ben's Bites / The Batch / Last Week in AI**（高质量 Newsletter 4 连）
- **ArXiv cs.AI**（学术论文入口）
- **机器之心 / 量子位 / 钛媒体 / 甲子光年**（中文 AI 媒体 4 连）
- **Hacker News / Dev.to**（开发者实战）
- **Bloomberg Technology**（商业科技）

## 四、5 层分层架构

```
Layer 1: AI Newsletter / 官方动态
  ai-news-radar 强 → 引入 RSS Cron
Layer 2: 技术社区 / 开发者生态
  RSS Cron 强 → 扩充 HN/Dev.to/ArXiv
Layer 3: 中文媒体 / 热点聚合
  两者各有覆盖 → 去重+扩充
Layer 4: 飞书文档 / 特殊源
  ai-news-radar 独有 → 保持
Layer 5: 学术 / ArXiv
  RSS Cron 已有
```

## 五、合并优化方案

### 5.1 RSS Cron 引入 ai-news-radar 的高价值信源

**P0 官方源**（强烈建议）：

```json
[
  { "name": "OpenAI News",     "url": "https://openai.com/news/rss.xml", "category": "AI", "tags": ["openai","官方"] },
  { "name": "Google DeepMind",  "url": "https://deepmind.google/blog/rss.xml", "category": "AI", "tags": ["google","deepmind"] },
  { "name": "Google AI Blog",   "url": "https://blog.google/innovation-and-ai/technology/ai/rss/", "category": "AI", "tags": ["google"] },
  { "name": "Anthropic News",   "url": "https://www.anthropic.com/news", "category": "AI", "tags": ["anthropic","claude"], "scrape": true },
  { "name": "AI HOT",           "url": "https://aihot.virxact.com/feed.xml", "category": "AI", "tags": ["热点"] }
]
```

**P1 Newsletter / 优质源**：

```json
[
  { "name": "AI Breakfast",     "url": "https://r.jina.ai/https://aibreakfast.beehiiv.com/", "category": "AI", "scrape": true },
  { "name": "InfoQ CN",         "url": "https://www.infoq.cn/feed", "category": "技术媒体", "tags": ["infoq","中文"] },
  { "name": "Microsoft AI Blog","url": "https://blogs.microsoft.com/ai/feed/", "category": "AI", "tags": ["microsoft","copilot"] },
  { "name": "NVIDIA Gen AI",    "url": "https://developer.nvidia.com/blog/category/generative-ai/feed/", "category": "AI", "tags": ["nvidia","gpu"] }
]
```

### 5.2 强化 RSS Cron 中文媒体覆盖

```json
[
  { "name": "机器之心",     "url": "https://feed.jiqizhixin.com/rss", "category": "AI", "tags": ["ai","中文"] },
  { "name": "量子位",       "url": "https://www.qubit.cn/rss",         "category": "AI", "tags": ["ai","中文"] }
]
```

### 5.3 合并后的推荐信源（RSS Cron 增强版）

**核心 AI 官方（7 个）**：OpenAI / DeepMind / Google AI / Hugging Face / Anthropic / Microsoft AI / NVIDIA

**AI Newsletter（5 个）**：AI Breakfast / Import AI / Ben's Bites / The Batch / Last Week in AI

**技术社区（5 个）**：Hacker News / ArXiv cs.AI / Dev.to / GitHub Trending (3 语言) / 掘金

**中文技术媒体（6 个）**：36 氪 / 机器之心 / 量子位 / 钛媒体 / 甲子光年 / InfoQ CN

**聚合 / 热点（5 个）**：AI HOT / TechURLs / Buzzing / 今日头条热榜 / B 站热搜

**开发者工具 / 开源（3 个）**：HelloGitHub 月刊 / OSCHINA / Linux.do

**英文科技媒体（3 个）**：Wired AI / VentureBeat AI / TechCrunch

## 六、4 条去重与精简建议

- **去重 36 氪 / Wired AI / Hugging Face Blog**：两端都有，**只保留 RSS Cron 端**（自己控制更稳）
- **NewsNow 替代知乎日报**：`newsnow.busiyi.world` 聚合更全
- **TechCrunch 重新启用**：本地 RSS Cron 之前禁用，ai-news-radar 也没，**RSS Cron 重新加回来**
- **tophub 与 RSS Cron 今日头条二选一**：保留 RSS Cron 的（更新更稳）

## 七、4 条落地建议

1. **先合并 5 个 P0 官方源**——补齐 OpenAI / DeepMind / Anthropic 等关键缺口
2. **中文媒体优先**——机器之心 / 量子位 国内 AI 圈最权威
3. **AI Newsletter 选 2-3 个就够**——Import AI + Ben's Bites 覆盖 80% 高质量内容
4. **ai-news-radar 保留作为 Skill 来源**——本地 RSS Cron 跑日报，它出 Skill 友好的 JSON

## 八、3 条避坑

- **去重要分阶段**——一次性合并会丢历史数据，建议先 1 周观察再切换
- **重复源加白名单**——两端都有 `Hugging Face Blog` 时，给 ai-news-radar 加 `@type: ignore` 标签
- **定期审计**——每季度看一次 `source-status.json`（ai-news-radar 提供的），发现连续失败的源就换

---

> **本文结论**：两者**不是替代关系**。ai-news-radar 强在"AI 官方+ 飞书+ 中文精选"，本地 RSS Cron 强在"Newsletter + 学术 + 中文技术媒体"。**分层合并**（5 层架构）比二选一更稳。