---
title: 伯乐Skill信源分类体系
date: 2026-09-15 00:00:00
description: 拆解 ai-news-radar 的伯乐 Skill 信源体系：详解官方 RSS、私有 OPML、GitHub Feed、Jina 兜底、AgentMail、Skip 共 6 种信源的判断标准、处理路径与安全边界，梳理 AI 相关性四维打分与 0.65 阈值机制，并给出本地 RSS Cron 的分级、打分与监控落地 SOP。
categories:
  - notes
tags:
  - ai-news-radar
  - 信源体系
  - RSS
  - Agent Skill
  - 信息聚合
  - 工具调研
series:
  name: ai-news-radar
  index: 4
  total: 4
---

前 3 篇我们分别做了 [技术调研](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-ai-news-radar/)、[信源对比](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-rss-vs-ai-news-radar/) 和 [融入 RSS Cron 的改造方案](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-ai-news-radar-cron-integration/)。本文聚焦其中最有工程价值的一块——**伯乐 Skill（Scout Skill）的信源分类体系**，这也是决定「聚合质量上限」的核心模块。

![信源分类总览](https://hyqskevin.github.io/pic/notes/ai-news-radar-sources.png)

## 一、伯乐Skill 信源分类总览

伯乐 Skill 把所有潜在信源分为 **6 种类型**，每种都有明确的「判断标准 → 处理路径 → 安全边界」三段式定义。这一设计最值得借鉴的地方在于：它**不把所有源一视同仁**，而是按隐私风险、维护成本和信号质量做分级处理。

| 类型 | 一句话定义 | 隐私风险 | 是否内置 |
|---|---|---|---|
| ① Official RSS / Changelog | 厂商官方 feed | 零 | ✅ 内置 |
| ② Private OPML / RSS | 用户私有订阅 | 高 | ⚠️ 需 Secret |
| ③ Public GitHub Feed / JSON | 别的项目自动产物 | 零 | ✅ 只读 |
| ④ Static Page / Jina Fallback | 无 RSS 的静态页兜底 | 低 | ⚠️ 依赖服务 |
| ⑤ AgentMail 邮箱订阅 | 私有 newsletter 收件箱 | 高 | ❌ 默认禁用 |
| ⑥ Skip | 高风险/低质量源 | — | ❌ 不接入 |

### 1.1 Official RSS / Changelog

这是最干净的一类。定义是 **AI 厂商官方发布的 RSS/Atom feed 或 changelog 页面**，判断标准有四条：来自已知 AI 厂商域名、提供稳定时间戳、无需登录凭证、可通过 RFC 标准协议获取。

处理路径极其简单——直接写成 `fetch_<source>(session, now)` 函数，注册到 `update_news.py` 的内置任务列表即可。因为内容公共可见、零隐私风险，这类 fetcher **可以直接 commit 到公开仓库**，是最省心的部分。

### 1.2 Private OPML / RSS

用户通过 RSS 阅读器导出的私有订阅列表，典型如 `feeds/follow.opml`（真实订阅）与 `feeds/follow.example.opml`（公开演示）。

它的安全边界是整体系列里最严格的一条：**私有 OPML 禁止 commit**。生产环境通过 `FOLLOW_OPML_B64` 这个 GitHub Secret 以 Base64 形式传入，本地则用命令行参数：

```bash
python scripts/update_news.py --rss-opml feeds/follow.opml
```

只有 `follow.example.opml` 这种不含任何隐私内容的样例文件，才允许进公开仓库。这一点对我们自己的 cron 同样适用——用户的私有订阅绝不能进 git。

### 1.3 Public GitHub Feed / JSON

指**别的项目用 GitHub Actions 自动生成的公开 JSON/RSS 文件**。这类源很巧妙：它不直接去爬第三方站点，而是「借力」另一个 repo 已经整理好、带稳定时间戳、低噪声的产出物。

判断标准：URL 指向 GitHub raw 内容、文件由另一个 repo 的 Actions 自动生成、有稳定时间戳、低噪声。处理路径是新增 `fetch_*` 函数，直接 `requests.get` 读 raw URL，**不复制对方的私有 token，也不重建爬虫**。安全边界也很清晰——只读公开 raw 文件，不依赖对方内部 API。

### 1.4 Static Page / Jina Fallback

没有 RSS 的静态页面，通过 **Jina Reader API** 提取可读正文。它通常是「其他所有 feed 都失败后的兜底方案」。

判断标准：有稳定 URL 和页面结构、无需登录、有足够文本、作为兜底。处理路径是把目标 URL 包进 `https://r.jina.ai/http://<url>` 拿到结构化文本，再解析 title/URL/time。安全边界是它**依赖第三方服务可用性**，所以优先级永远排在官方 RSS 之后——能走标准协议就别走这个。

### 1.5 AgentMail 邮箱订阅

通过 AgentMail API 读取用户**私有邮箱里的 newsletters 或产品更新邮件**，例如只允许特定发件域名的私有收件箱。

它的判断标准最重：需要 `AGENTMAIL_API_KEY` 和 `AGENTMAIL_INBOX_ID` 两个环境变量、内容非公开、且**只能调用 `/messages` 列表接口，不能读 `/raw` 正文**。处理路径靠 `EMAIL_DIGEST_ENABLED=1` 开启，且**只取元数据（标题/时间/发件人），不读正文**。安全边界上它是**默认禁用**的，API Key、Inbox ID、邮件正文一律禁止 commit，也不允许把 `data/email-digest.json` 发布到公开 Pages。

### 1.6 Skip（跳过高风险来源）

最后一类是「主动不接」的清单：维护成本过高、隐私风险大或信号质量差的源。典型代表是微信公众号直接抓取（版权/登录风险）、各种不稳定的 Telegram/Bilibili/Zhihu bridge、付费读额的 X API、以及 WeChat 公号 bridge。

判断标准：需要 cookie/登录态/浏览器自动化、依赖不稳定第三方 bridge、噪声比高、有版权风险、需要付费凭证。处理路径是**用户可自行通过 OPML 冒险接入，但官方不做内置支持**，并明确告知风险。这条原则对我们尤其重要——不要为了「覆盖广」牺牲稳定性和合规性。

## 二、AI 相关性打分机制

分类解决「从哪来」，打分解决「值不值得推」。核心文件是 `scripts/ai_relevance.py`，一套**可解释的 relevance scoring**。

### 2.1 四维评分

| 维度 | 说明 | 贡献值 |
|---|---|---|
| AI 信号 | 命中 `AI_KEYWORDS`（llm / agent / copilot / transformer 等中英文词） | +0.52（强）/ +0.34（宽泛） |
| Tech 信号 | 命中 `TECH_KEYWORDS`（robot / gpu / developer 等） | +0.04/个（上限 0.18） |
| 噪声扣分 | 命中 `NOISE_KEYWORDS` 或 `COMMERCE_NOISE_KEYWORDS`（娱乐/淘宝/京东） | -0.04/个（上限 -0.18） |
| 来源先验 | 预置来源可信度 `SOURCE_PRIORS`，如 `aibase` +0.45、`opmlrss` +0.15 | 加性加成 |

### 2.2 判定树与阈值

打分逻辑本质是一棵判定树，伪代码长这样：

```python
def score_ai_relevance(record):
    # 1. 特殊站点处理
    if record.site_id == "zeli":
        return keep_only("24h最热")          # 其余丢弃
    if record.site_id == "tophub":
        return keep_only(allowlist_channels) # 其余丢弃

    # 2. 默认强相关源
    if record.source in AI_DEFAULT_SOURCES:  # aibase/aihot/aihubtoday
        return is_ai_related(True), score >= 0.72

    # 3. 拼接文本
    text = (record.title + record.source +
            record.site_name + record.url).lower()

    # 4. 信号检测
    has_ai = bool(MEANINGFUL_EN_SIGNAL_RE.search(text)) or hit(AI_KEYWORDS, narrow=True)
    has_broad = "agent" in text or "模型" in text or "推理" in text

    # 5. 噪声门控
    if has_commerce_noise(text) and not has_ai:
        return discard()
    if has_general_noise(text) and not has_ai:
        return discard()

    # 6. 综合评分
    score = source_prior \
          + (0.52 if has_ai else 0.34) \
          + min(0.18, 0.04 * len(ai_signals)) \
          + min(0.12, 0.03 * len(tech_signals)) \
          - min(0.18, 0.04 * len(noise))

    # 7. 阈值判定
    is_ai_related = score >= AI_RELEVANCE_THRESHOLD  # 0.65
    return is_ai_related, score
```

几个关键点：**硬阈值是 `score >= 0.65`** 才进推荐列表；来源先验能「拉一把」可信源——`aibase`、`aihot` 自带 +0.45 加成，即使信号偏少也能过线；噪声门控是「有商业/娱乐噪声且无强 AI 信号就直接丢」，避免带货软文混进 AI 日报。

### 2.3 标签体系

通过 `LABEL_KEYWORDS` 对通过阈值的文章打标签，按优先级顺序归类：`model_release`（模型发布）/ `developer_tool`（开发工具）/ `agent_workflow`（智能体工作流）/ `research_paper`（论文）/ `infra_compute`（算力基建）/ `robotics`（机器人）/ `industry_business`（行业动态）/ `ai_product_update`（产品更新）。这些标签既是展示分类，也是后续筛选维度。

### 2.4 一个算例

假设有一条来自 `aibase` 的 item：标题「OpenAI 发布 GPT-5.2，推理成本下降 40%」，URL 含 `/model-release`。

- 来源先验：`aibase` → +0.45
- 命中强 AI 信号 `openai`/`推理`（模型）→ 取 +0.52
- `ai_signals` 命中 2 个 → +0.08（未超 0.18 上限）
- 无 tech、无噪声 → 0

合计 `0.45 + 0.52 + 0.08 = 1.05 ≥ 0.65` → **通过**，打标 `model_release`。可见可信来源 + 强信号会远超阈值，几乎稳进推荐列表。反例：一条「京东双十一预售开启」的标题，命中商业噪声且无强 AI 信号，直接被噪声门控丢弃，根本走不到评分那一步。

## 三、对本地 RSS Cron 的启示

把上面这套体系映射到我们自己的 `rss-fetcher.js`，哪些值得搬、哪些先别动，结论很清楚。

### 3.1 可迁移的设计（低工程量、高价值）

**① 信源分级（⭐⭐⭐）**：我们目前对所有 RSS 源一视同仁。应参考其分级：内置稳定源（OpenAI、Anthropic 官方 feed）→ 内置 fetcher 定期请求；OPML 用户源 → 更低频率、更少配额；聚合源（tophub、followbuilders）→ 带 `source_prior` 加权。

**② AI 相关性打分（⭐⭐⭐）**：`ai_relevance.py` 的关键词逻辑可直接移植到 Node.js——维护 `AI_KEYWORDS`/`TECH_KEYWORDS`/`NOISE_KEYWORDS` 三张表，对每条 item 算 relevance score，低于 0.65 的标记低优先级或丢弃。

**③ 特殊站点规则（⭐⭐）**：zeli 的 24h 热榜、tophub 的 allowlist/blocklist 本质是硬编码特殊规则。迁移时建议用配置文件里的 `site_overrides` 或 `rules` 数组表达，而非写死在代码里。

**④ Source Health 报告（⭐⭐）**：它输出 `data/source-status.json` 记录 `failed_feeds`/`zero_item_feeds`/`skipped_feeds`。我们每次 cron 跑完也该写一份，长期零 item 的 feed 自动预警，帮人工排查失效源。

### 3.2 不适合迁移的设计

- **AgentMail 集成（❌）**：需要独立邮件服务，我们定位是公开 RSS 源，且隐私约束复杂，暂不跟进。
- **X API 直接集成（❌）**：付费方案、免费配额不可靠，我们已有 `follow-builders` 这类中间层 JSON，不必自己对接。
- **重复信源去重分析（❌ 暂不适合）**：`evaluate_source_overlap.py` 需维护 baseline archive 和 lookback 窗口，当前规模 ROI 低，feed 数 > 50 再考虑。
- **Jina Reader Fallback（⚠️ 视情况）**：对中国可访问的静态页兜底有效，但依赖第三方、非自托管，建议仅对明确需要的站点用，不做全量兜底。

## 四、落地 SOP

把伯乐体系落进我们自己的 pipeline，按节奏分步走。

### 4.1 短期（1-2 周）

1. 在 `rss-fetcher.js` 增加 `scoreAIRelevance(item)` 函数，移植三张关键词表，为每条 item 附加 `ai_score` / `ai_label` / `ai_is_related` 字段，可单独输出 `data/ai-filtered.json`。
2. 在 `sources.json` / `feeds.yaml` 增加 `source_prior` 字段：高质量官方源 0.35、聚合源 0.15~0.45、OPML 用户源 0.15。
3. 用配置文件表达 zeli/tophub 类站点的 allow/block 规则，数据驱动而非硬编码。

```yaml
# feeds.yaml 片段
sources:
  - id: openai
    url: https://openai.com/blog/rss.xml
    source_prior: 0.35
  - id: tophub
    url: https://tophub.today/rss
    source_prior: 0.15
    rules:
      allow_channels: [科技, AI]
```

### 4.2 中期（1 个月+）

4. 实现 `data/source-status.json` 报告，统计 `failed_count` / `zero_item_count` / `avg_item_age`。
5. 支持 OPML 导入，参考 `follow.example.opml` 格式，提供飞书机器人或配置文件入口。
6. 可选接入 Jina Fallback，仅对纯静态页兜底，注意超时与错误处理。

### 4.3 暂不跟进

AgentMail / X API / WeChat 直接抓取、内容重叠度分析（规模未到阈值）、GitHub Actions + Pages 部署（我们直接用 cron 跑）。

## 五、信源选型决策指南

把上面 6 类收敛成一句可操作的判断口诀，落地时照着问自己四个问题：

1. **要不要登录？** 要 cookie / 登录态 / 浏览器自动化的，一律归入 ⑥ Skip 或让用户 OPML 自担风险，不做内置。
2. **有没有官方 RSS？** 有 → ① 内置 fetcher；没有但页面稳定 → ④ Jina 兜底（慎用）。
3. **是不是别人已整理好的公开产物？** 是（GitHub raw JSON）→ ③ 只读拉取，不重建爬虫。
4. **涉不涉及私有内容？** 私有 OPML / 邮箱 → ② / ⑤，必须走 Secret、默认禁用、绝不 commit。

对应的快速决策伪代码：

```js
function classifySource(src) {
  if (src.requiresLogin) return 'SKIP';
  if (src.officialRss)   return 'OFFICIAL';
  if (src.githubRawJson) return 'GITHUB_FEED';
  if (src.isPrivate)     return src.type === 'email' ? 'AGENTMAIL' : 'PRIVATE_OPML';
  if (src.hasStablePage) return 'JINA_FALLBACK';
  return 'SKIP';
}
```

这套分类法最值钱的不是「覆盖了多少源」，而是**明确划定了不做什么**——Skip 清单和隐私红线，恰恰是很多自建聚合器翻车的地方。

---

> 本分析由子 agent 完成，输出至本地知识库后整理为公开博客。

## 系列小结

ai-news-radar 系列到此告一段落：第 1 篇做[整体技术调研](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-ai-news-radar/)，看清「看报/读报/办报」三层模型与 5 步数据流；第 2 篇做[信源对比](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-rss-vs-ai-news-radar/)，理清它与本地 RSS Cron 的重叠与互补；第 3 篇给[融入 Cron 的改造方案](https://hyqskevin.github.io/2026/09/02/2026/2026-09-02-ai-news-radar-cron-integration/)，落到去重与 AI 评分代码；本文则下沉到最底层的**信源分类与打分内核**。如果把整个聚合系统比作一家报社，前 3 篇讲的是「版面、发行与排版」，这一篇讲的是「怎么选稿」——而选稿质量，才是日报好不好看的根本。

## 模型版本说明

⚠️ 本文涉及的信源分类、AI 相关性打分阈值（0.65）、关键词表与各项加成比例，均以 **ai-news-radar 项目发布时**的实际版本为准。开源项目迭代较快，落地前请核对对应仓库的最新 `scripts/ai_relevance.py` 与 `SKILL.md`，避免沿用过期参数。
