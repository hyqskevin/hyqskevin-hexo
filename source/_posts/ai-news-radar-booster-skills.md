---
title: AI信源雷达伯乐Skill体系
date: 2026-10-18 00:00:00
description: 解析 ai-news-radar 伯乐Skill 的六类信源分类、AI 相关性打分机制与可迁移设计，结合现有 RSS 定时任务给出短期与中期工程改进建议。
categories:
  - notes
tags:
  - ai-news-radar
  - 信源分类
  - 相关性打分
  - RSS
  - Skill体系
  - 工程改进
  - 伯乐Skill
---

> 研究日期：2026-06-01 / 来源版本：ai-news-radar master

最近在梳理 `ai-news-radar` 这套"信源雷达"的设计，发现它把"找信源"这件事拆得非常干净：先分类、再打分、最后只输出可迁移的部分。这篇是它**伯乐 Skill（Scout Skill）**的研究笔记，重点拆三块：**信源分类**、**AI 相关性打分**、**对现有 RSS cron 的可迁移设计**。

## 一、信源分类体系

伯乐 Skill 把所有潜在信源分成 **6 种类型**，每种都明确写了判断标准、处理路径和安全边界。这种"先分类再处理"的思路，比我们当前"一视同仁跑全部 RSS"要稳得多。

### 1.1 Official RSS / Changelog（官方源）

- **定义**：AI 厂商官方发布的 RSS/Atom feed 或 changelog 页面
- **代表案例**：OpenAI News RSS、Anthropic News、Google DeepMind RSS、Hugging Face Blog RSS、GitHub AI/ML RSS、GitHub Changelog RSS
- **判断标准**：
  - 来自已知 AI 厂商域名
  - 提供稳定时间戳
  - 无需登录 / 凭证
  - 可通过 RFC 标准协议获取
- **处理路径**：直接内置为 `fetch_<source>(session, now)` 函数，注册到主脚本的内置任务列表
- **安全边界**：公共可见，零隐私风险，可直接 commit 到公开仓库

### 1.2 Private OPML / RSS（私有订阅）

- **定义**：用户私有 RSS 源列表，通过 OPML 文件导入
- **代表案例**：用户自定义的 `feeds/follow.opml`、公开演示用的 `feeds/follow.example.opml`
- **判断标准**：
  - 用户通过 RSS 阅读器导出
  - 包含个人订阅源
  - 不应出现在公开仓库
- **处理路径**：`python scripts/update_news.py --rss-opml feeds/follow.opml`；生产环境通过 `FOLLOW_OPML_B64` GitHub Secret 传入
- **安全边界**：私有 OPML **禁止 commit**；只有 `follow.example.opml` 可以 commit（无隐私内容）

### 1.3 Public GitHub Feed / JSON（聚合源）

- **定义**：其他项目通过 GitHub Actions 生成的公开 JSON / RSS 文件
- **代表案例**：`follow-builders` 项目的 `feed-x.json`、`feed-blogs.json`、`feed-podcasts.json`；`state*.json`（去重状态文件）
- **判断标准**：
  - URL 指向 GitHub raw 内容
  - 文件由另一个 repo 的 Actions 自动生成
  - 有稳定时间戳
  - 低噪声
- **处理路径**：添加 `fetch_*` 函数，直接 `requests.get` 读取 raw URL；不复制对方私有 token 或重建爬虫
- **安全边界**：只读公开 raw 文件；不依赖对方内部 API

### 1.4 Static Page / Jina Fallback（静态兜底）

- **定义**：没有 RSS 的静态页面，通过 Jina Reader API 提取可读内容
- **代表案例**：AI Breakfast（Beehiiv 源，GitHub Actions 无法访问时兜底）；任何无 RSS 的博客 / 新闻页
- **判断标准**：
  - 有稳定 URL 和页面结构
  - 无需登录
  - 有足够文本内容
  - 其他 feeds 都失败后的兜底方案
- **处理路径**：`https://r.jina.ai/http://<url>` 获取结构化文本；内置 fetcher 解析 title / URL / time
- **安全边界**：依赖 Jina 服务可用性；优先使用官方 RSS 而非此方式

### 1.5 AgentMail 邮箱订阅（私有邮件）

- **定义**：通过 AgentMail API 读取用户私有邮箱中的 newsletters 或产品更新邮件
- **代表案例**：私有 newsletter 收件箱；AlphaSignal 元数据（通过环境变量 `AGENTMAIL_ALLOWED_SENDER_DOMAINS=alphasignal.ai` 白名单）
- **判断标准**：
  - 需要 `AGENTMAIL_API_KEY` 和 `AGENTMAIL_INBOX_ID`
  - 非公开内容
  - 只能调用 `/messages` 列表接口，不能读取 `/raw`
- **处理路径**：环境变量 `EMAIL_DIGEST_ENABLED=1` 开启；仅获取 message 元数据（标题 / 时间 / 发件人），不读取正文
- **安全边界**：**默认禁用**；禁止 commit API Key、Inbox ID 或邮件正文到仓库；不发布 `data/email-digest.json` 到公开 Pages

### 1.6 Skip（跳过高风险来源）

- **定义**：维护成本过高、隐私风险大或信号质量差的信源，默认不接入
- **代表案例**：微信公众号直接抓取（版权 / 登录风险）、Telegram / Bilibili / Zhihu 非稳定 bridge、X API 直接调用（付费读额）、WeChat 公号（bridge 不稳定）
- **判断标准**：
  - 需要 cookie、登录态或浏览器自动化
  - 依赖不稳定第三方 bridge
  - 噪声比高
  - 有版权风险
  - 需要付费凭证
- **处理路径**：用户可自行通过 OPML 接入（有风险）；不做内置支持
- **安全边界**：不主动接入；明确告知用户风险

---

## 二、AI 相关性打分机制

打分是伯乐 Skill 的"漏斗核心"——信源分类解决"从哪里来"，打分解决"值不值得读"。

### 2.1 评分维度

核心逻辑在 `scripts/ai_relevance.py`，是一份可解释的 relevance scoring。

| 维度 | 说明 | 贡献值 |
|------|------|--------|
| **AI 信号** | 命中 `AI_KEYWORDS`（如 llm、agent、copilot、transformer 等中英文词） | +0.52（强 AI）/ +0.34（宽泛 AI） |
| **Tech 信号** | 命中 `TECH_KEYWORDS`（robot、gpu、developer 等） | +0.04 / 个（上限 0.18） |
| **噪声词扣分** | `NOISE_KEYWORDS`（娱乐、八卦）或 `COMMERCE_NOISE_KEYWORDS`（淘宝、京东） | -0.04 / 个（上限 -0.18） |
| **来源先验** | 预置来源可信度（`SOURCE_PRIORS`），如 `aibase` +0.45、`opmlrss` +0.15 | 加性加成 |

### 2.2 判定树（伪代码）

```text
输入: record {site_id, title, source, site_name, url}

1. 特殊站点处理
   - zeli: 只保留 "24h最热" 标签，其余全部丢弃
   - tophub: 只保留 allowlist 内 channel，其余丢弃

2. AI_DEFAULT_SOURCES（aibase, aihot, aihubtoday）
   → 直接 is_ai_related=True, score ≥ 0.72

3. 构建 text = title + source + site_name + url（小写）

4. has_ai = 命中 MEANINGFUL_EN_SIGNAL_RE 或 AI_KEYWORDS（非 broad 词）
   has_broad_ai = 命中 "agent"（英文）或 "模型"/"推理"（中文）
   has_tech = 命中 TECH_KEYWORDS

5. 噪声门控
   - 有 commerce_noise 关键词但无强 AI 信号 → 丢弃
   - 有一般噪声词但无强 AI 信号 → 丢弃

6. 综合评分
   score = source_prior
         + (0.52 if has_ai else 0.34)
         + min(0.18, 0.04 * len(ai_signals))
         + min(0.12, 0.03 * len(tech_signals))
         - min(0.18, 0.04 * len(noise))

7. 阈值判定
   is_ai_related = score >= AI_RELEVANCE_THRESHOLD (0.65)

8. 打标（LABEL_KEYWORDS 优先级顺序）
   model_release / developer_tool / agent_workflow / research_paper /
   infra_compute / robotics / industry_business / ai_product_update
```

### 2.3 如何决定"AI 强相关"

三件事一起决定：

- **硬阈值**：`score >= 0.65` → 进入推荐列表
- **来源先验加强**：可信来源（aibase、aihot）自带 +0.45 加成，使得即使信号偏少也能通过
- **标签体系**：通过 `LABEL_KEYWORDS` 对通过的文章打标签（model_release、developer_tool 等），用于筛选和展示分类

这套机制的好处是**可解释**：每一条 item 都能说清楚"为什么进来 / 为什么没进来"，而不是一个黑盒模型。

---

## 三、对我们现有 RSS cron 的启示

把伯乐 Skill 的设计当作"参照系"，反观我们当前的 RSS 定时任务，可以拆成"可迁移"和"不适合迁移"两类。

### 3.1 可迁移的设计（低工程量，高价值）

#### 3.1.1 信源分类分级（⭐⭐⭐ 高优先）

我们当前对所有 RSS 源一视同仁。可以参考它的分级策略：

- **内置稳定源**（OpenAI、Anthropic 等官方 feed）→ 内置 fetcher，直接定期请求
- **OPML 用户源** → 支持 OPML 导入，给予更低频率 / 更少资源配额
- **聚合源**（tophub、followbuilders）→ 带 `source_prior` 加权，不依赖则降低优先级

#### 3.1.2 AI 相关性打分（⭐⭐⭐ 高优先）

`ai_relevance.py` 的关键词打分逻辑可直接移植到 Node.js：

- 维护 `AI_KEYWORDS`（中英文）、`TECH_KEYWORDS`、`NOISE_KEYWORDS` 三张表
- 对每条 RSS item 计算 relevance score
- 低于 0.65 阈值的 item 标记为低优先级或丢弃（取决于我们是想要"过滤"还是"降权"）

#### 3.1.3 Special Case 站点处理（⭐⭐ 低工程）

- zeli 的 24h 热榜规则和 tophub allowlist / blocklist 逻辑是硬编码特殊规则
- 适用于我们已知的高噪声聚合源（如某些中文 AI 聚合站）
- **迁移方式**：在配置文件中用 `site_overrides` 或 `rules` 数组表达，而非硬编码在 JS 里

#### 3.1.4 Source Health 报告（⭐⭐ 中优先）

`data/source-status.json` 输出 `failed_feeds`、`zero_item_feeds`、`skipped_feeds` 的设计值得借鉴：

- 每次 cron 运行时记录每个 feed 的状态
- 长期零 item 的 feed 预警
- 帮助人工排查失效 feed

### 3.2 不适合迁移的设计（工程量太大）

#### 3.2.1 AgentMail 集成（❌ 不适合）

- 需要单独的邮件服务（AgentMail）和产品对接
- 我们的 cron 定位是 RSS / 公开源，不涉及私有邮箱
- 隐私管理复杂（"只读 metadata，不读正文"的约束）

#### 3.2.2 X API 直接集成（❌ 不适合）

- X API 本身是付费方案，免费配额不可靠
- 我们已有 `follow-builders` 这类中间层生成的 JSON，不需要自己对接 X API
- 维护 bearer token 和 rate limit 逻辑复杂

#### 3.2.3 重复信源去重（❌ 暂不适合）

- `evaluate_source_overlap.py` 对新增 RSS 源做内容重叠度分析
- 需要维护 baseline archive、lookback 窗口和 JSON 报告
- 当前规模下 ROI 较低；等 feed 数量 > 50 时再考虑

#### 3.2.4 Jina Reader Fallback（⚠️ 视情况）

- Jina Reader 是中国可访问的网页内容提取服务，对静态页面兜底有效
- **风险**：依赖第三方服务可用性，不是自托管
- **建议**：仅对明确需要 fallback 的站点使用，不做全量兜底

---

## 四、可操作建议

### 4.1 短期（1-2 周内可落地）

1. **在 fetcher 中增加 `scoreAIRelevance(item)` 函数**
   - 移植 `AI_KEYWORDS` / `TECH_KEYWORDS` / `NOISE_KEYWORDS` 列表
   - 对每条 item 打分，附加 `ai_score`、`ai_label`、`ai_is_related` 字段
   - 用法：在 cron 输出中增加这两列，或单独输出 `data/ai-filtered.json`

2. **增加来源分级配置**
   - 在 `sources.json` 或 `feeds.yaml` 中增加 `source_prior` 字段
   - 高质量官方源：0.35；聚合源：0.15~0.45；OPML 用户源：0.15

3. **特殊站点规则表**
   - 用配置文件表达 zeli / tophub 类站点的 allow / block 规则
   - 避免在代码中硬编码，改用数据驱动

### 4.2 中期（1 个月+）

4. **实现 source-status 报告**
   - 每次 cron 执行后写入 `data/source-status.json`
   - 统计 `failed_count`、`zero_item_count`、`avg_item_age`

5. **支持 OPML 导入**
   - 参考 `follow.example.opml` 格式
   - 提供用户上传 OPML 的入口（飞书机器人或配置文件）

6. **Jina Fallback 接入（可选）**
   - 对纯静态页面 feed 添加 Jina 提取作为兜底
   - 注意超时和错误处理

### 4.3 暂不跟进

- AgentMail / X API / WeChat 直接抓取
- 内容重叠度分析（规模未到阈值）
- GitHub Actions + Pages 部署（我们用 cron 直接跑）

---

## 五、模型版本说明

本文涉及的 AI 模型与工具版本信息：

- **ai-news-radar**：开源仓库 master 分支，研究时点为 2026-06-01
- **评分逻辑脚本**：`scripts/ai_relevance.py`、阈值常量 `AI_RELEVANCE_THRESHOLD=0.65`
- **辅助服务**：Jina Reader（`r.jina.ai`）、AgentMail API、GitHub raw content
- **关键词表**：`AI_KEYWORDS`、`TECH_KEYWORDS`、`NOISE_KEYWORDS`、`COMMERCE_NOISE_KEYWORDS`、`LABEL_KEYWORDS`

> ⚠️ **以发布时为准**：以上版本号、阈值常量、API 接口形态随上游更新可能变化，落地前请以官方仓库当前 commit 为准，不要直接复用研究时点的数字。

---

## 附：关键文件索引

| 文件 | 作用 |
|------|------|
| `skills/ai-news-radar/SKILL.md` | Skill 总体定义，workflow 规范 |
| `docs/SOURCE_COVERAGE.md` | 信源覆盖策略，产品分层 |
| `scripts/ai_relevance.py` | AI 相关性打分核心逻辑 |
| `scripts/evaluate_source_overlap.py` | 新源重叠度检查（参考） |
| `scripts/update_news.py` | 主脚本，fetch 函数注册方式 |
| `feeds/follow.example.opml` | 公开演示用 OPML 样例 |

---

*本分析由子 agent 整理自 ai-news-radar 伯乐 Skill 公开资料，输出至博客归档。*