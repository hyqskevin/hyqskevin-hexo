---
title: ai-news-radar 技术调研
date: 2026-09-02 00:00:00
description: LearnPrompt/ai-news-radar 完整技术调研：三层模型（看报/读报/办报）、5 步数据流、20 个信源体系、10 个 JSON 输出产物、GitHub Actions 调度、变现能力、给本地运行的改造建议。
categories:
  - notes
tags:
  - AI
  - 信息聚合
  - GitHub Actions
  - RSS
  - Agent Skill
  - 工具调研
---

最近调研了 [LearnPrompt/ai-news-radar](https://github.com/LearnPrompt/ai-news-radar)——一个自动聚合 AI 新闻的开源项目，跑在 GitHub Actions 上、产出 8 个 JSON 文件、能装成 Agent Skill 读。本文是技术调研笔记。

## 一、三层使用模型

| 层级 | 用户角色 | 产物 | 门槛 |
|---|---|---|---|
| **看报** | 普通读者 | https://learnprompt.github.io/ai-news-radar/ | 零门槛（直接访问） |
| **读报** | Agent 用户 | 装 `ai-radar` Skill，自然语言读 JSON | 会装 Skill |
| **办报** | Fork 者 | fork + 改"伯乐 Skill"信源 | 了解 OPML / feed 配置 |

**对宁波本地社群的建议**：第三层最有价值——fork 后改成"宁波 AI 活动 + 706 社群动态"信源，能搭出本地日报。

## 二、5 步数据流

```text
collect_all() → 15 个内置 fetcher
  ↓
[OPML RSS] + [AgentMail] + [X API] + [SocialData] + [TikHub]
  ↓
[WaytoAGI 7d]
  ↓
raw_items → archive.json（21 天滑动窗口）
  ↓
24h 时间窗过滤 → AI 评分 → 双语翻译 → 故事合并 → 8 个 JSON 产物
```

**关键节点**：

- **collect_all()** 拉取 15 个信源（OPML、AgentMail、X、SocialData、TikHub 等）
- **raw_items 进 archive** 维护 21 天滑动窗口
- **24h 时间窗过滤** 缩到当天内容
- **AI 评分** 对每条打分（相关性、热度）
- **双语翻译** 中英对照
- **故事合并** 把多条相关报道聚合成 1 个故事
- **8 个 JSON 产物** 输出到 data/ 目录

## 三、20 个信源体系

按抓取方式分 4 类：

| 抓取方式 | 代表信源 | 数量 |
|---|---|---|
| **RSS/Atom + 页面解析** | official_ai、curated_media、aihubtoday、aibase | 5+ |
| **JSON API** | aihot、bestblogs、techurls、buzzing、zeli、newsnow | 6+ |
| **Jina Reader / GitHub raw** | aibreakfast、followbuilders | 2 |
| **特殊爬虫** | iris（JS 渲染）、waytoagi（飞书 Wiki）、tophub（HTML + 编码探测） | 3+ |

**几个有意思的源**：

- `tophub`：抓 3033 条/次，HTML 解析 + 编码探测，国内 TopHub 媒体
- `iris`：375 条但延迟 15.7 秒（JS 渲染慢）
- `waytoagi`：飞书 Wiki 解析，国内 AI 圈最权威
- `newsnow`：SPA bundle + POST API 抓取，反爬技术

**信源配置看 `feeds/follow.opml`**，OPML 格式标准，Fork 后改这个文件就能换信源。

## 四、10 个 JSON 输出产物

| 文件 | 大小 | 用途 |
|---|---|---|
| `latest-24h.json` | 1.8 MB | **24h AI 强相关消息**（主数据） |
| `latest-24h-all.json` | 11 MB | 24h 全量消息 |
| `source-status.json` | 11 KB | 各源抓取状态（监控用） |
| `daily-brief.json` | 56 KB | 伯乐精选 Top3 候选 |
| `stories-merged.json` | 1.2 MB | 故事合并完整池（637 故事） |
| `merge-log.json` | 9 KB | 合并审计日志 |
| `archive.json` | 56 MB | **21 天原始归档** |
| `waytoagi-7d.json` | 20 KB | WaytoAGI 7 天更新 |
| `title-zh-cache.json` | 3.9 MB | 翻译缓存（避免重复调用 LLM） |
| `paid-source-state.json` | 412 B | 付费源调度状态 |

**用 Skill 读 `latest-24h.json`**（1.8 MB，Agent 单次 context 装得下）：

```text
读取 https://raw.githubusercontent.com/LearnPrompt/ai-news-radar/main/data/latest-24h.json，
分析今日 AI 圈最热的 3 件事，每条给一句话总结。
```

## 五、GitHub Actions 调度

- **频率**：每 30 分钟跑一次
- **超时**：15 分钟
- **入口**：`scripts/update_news.py:5225`
- **核心命令**：

```bash
python scripts/update_news.py \
  --output-dir data \
  --window-hours 24 \
  --archive-days 21 \
  --rss-opml feeds/follow.opml
```

- **可白嫖** GitHub Actions 免费额度（2000 分钟/月，足够 30 分钟 × 30 天 = 900 分钟）
- Fork 后**改成 cron 或自部署**也行，commands 都开源

## 六、变现能力

我没仔细看付费层，但发现 `paid-source-state.json` 文件——说明：

- **免费层**：20 个内置信源（已够用）
- **付费层**：扩展信源（如 Twitter API v2 月费 $100+、新闻付费墙绕过）

**判断**：**对个人 / 小社群够用**；要商业化（如做宁波日报）需要付费信源支持 + 算力成本。

## 七、给本地运行的改造建议

Fork 后要跑起来改哪些：

1. **改信源** `feeds/follow.opml`：换成本地 AI 社群、活动博客、媒体源
2. **改 prompt**：在 `prompts/` 目录下调整 AI 评分的 prompt（更看重本地相关）
3. **改 cron 频率**：本地跑可以 5 分钟一次（GitHub Actions 30 分钟是省免费额度）
4. **加本地数据源**：写个 fetcher 抓宁波本地公众号、706 活动
5. **改主题**（看报层）：默认的 maupassant 主题不漂亮，可以改 next 或自写

## 八、5 条踩坑提醒

- **OPML 文件路径要写对**——`feeds/follow.opml` 是相对路径，跑脚本时 cwd 要对
- **付费源 token 必填**——漏填直接报 401，整条 pipeline 失败
- **Jina Reader 限速**——免费版 1000 次/日，超了换 RSS 源
- **waytoagi 飞书 API 经常变**——`requests.post` 失败时 fallback 到 `api` 而不是 `api/v1`
- **故事合并阈值**——默认合并相似度 > 0.85，宁波本地用可以降到 0.7（合并更激进）

## 九、给 Skill 编写者的启示

`ai-radar` 这个 Skill 的设计很值得学：

- **Skill 把"读 JSON"封装成自然语言**——用户不用学 JSON schema
- **数据由 Actions 自动更新**——Skill 是无状态读取
- **fallback 设计**——付费源挂了免费源补

**自己写 Skill 时**：

- 优先**只读操作**（读文件 / 读 API），不要让 Skill 写
- 状态外置到文件 / DB，Skill 是 stateless 的
- 错误信息要友好（"源 X 挂了，看 Y 替代"）

---

> **本文基于 v0.7（2026-06-30）**。仓库仍在活跃迭代，跑前看 README 更新。