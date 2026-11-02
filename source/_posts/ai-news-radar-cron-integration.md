---
title: ai-news-radar 融入 RSS cron
date: 2026-09-02 00:00:00
description: ai-news-radar pipeline 融入现有 RSS cron 改造方案：5 大现状问题（去重缺陷 / AI 评分缺陷 / 内容评分缺陷 / 评分成本 / 安全）、4 阶段改造路径（核心去重 / AI 评分 / 监控 / Skill 集成）、完整 Python 改造代码、3 个月里程碑 + 4 条避坑。
categories:
  - notes
tags:
  - ai-news-radar
  - RSS
  - cron
  - 改造方案
  - Python
---

ai-news-radar 融入现有 RSS cron 改造方案。**目标不是全盘替换**，是**逐步吸收 ai-news-radar 的核心设计**：去重 + AI 评分 + Skill 集成。

## 一、5 大现状问题

### 1.1 去重机制缺陷

| 问题 | 现有实现 | ai-news-radar 实现 |
|---|---|---|
| URL 不去跟踪参数 | ❌ 不过滤 utm_*/fbclid/spm | ✅ `normalize_url()` 去 15+ 种 |
| 跨 run 去重 | ❌ 无 archive | ✅ 21 天 archive，5 天窗口去重 |
| 同文多源去重 | ❌ 不处理 | ✅ `dedupe_items_by_title_url()` 按 `title\|url` 分组 |
| ID 不稳定 | ❌ 依赖 link 原始 | ✅ `site_id + source + title + normalize_url(Link)` 哈希 |

**影响**：同一篇文章因 utm_source 不同被识别为多篇，**重复推送**。

### 1.2 AI 相关性评分缺陷

| 问题 | 现有 | ai-news-radar |
|---|---|---|
| 评分方式 | 布尔关键词（包含即保留） | 0-1 评分 + 阈值 |
| 噪音处理 | ❌ 无 | ✅ 噪音词列表（娱乐/电商/八卦） |
| 标签分类 | ❌ 无 | ✅ ai_label（8 类） |
| 白名单源 | ❌ 无 | ✅ aibase/aihot/aihubtoday 高权重 |
| 输出字段 | is_ai 布尔 | ai_score + ai_label + ai_signals + ai_noise + ai_relevance_reason |

### 1.3 内容评分缺陷

- ❌ 只看"是不是 AI"——**不区分重要性**
- ✅ 应该看"对开发者/研究者重不重要"

### 1.4 评分成本

- LLM-as-judge 每条 1k token → 1000 条 = 1 元
- 引入缓存 + batch + 降级是关键

### 1.5 安全

- ❌ 凭据写在 cron 脚本里
- ✅ 改用环境变量 + secret manager

## 二、4 阶段改造路径

### 阶段 1（1-2 周）：核心去重

```python
# src/dedup.py
import re
from hashlib import sha1

TRACKING_PARAMS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'msclkid', 'mc_cid', 'mc_eid',
    'spm', '_ga', 'ref', 'source', 'share_source'
]

def normalize_url(url: str) -> str:
    """去除跟踪参数"""
    from urllib.parse import urlparse, parse_qs, urlunparse
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    for p in TRACKING_PARAMS:
        params.pop(p, None)
    cleaned_query = '&'.join(f'{k}={v[0]}' for k, v in params.items())
    parsed = parsed._replace(query=cleaned_query)
    return urlunparse(parsed)

def make_item_id(site_id: str, source: str, title: str, link: str) -> str:
    """生成稳定 item_id"""
    key = f'{site_id}|{source}|{title}|{normalize_url(link)}'
    return sha1(key.encode()).hexdigest()[:16]

# 在 fetcher.js 后处理调用
```

### 阶段 2（2-3 周）：AI 评分

```python
# src/ai_score.py
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

AI_LABELS = [
    'model_release',       # 新模型发布
    'developer_tool',      # 开发者工具
    'agent_workflow',      # Agent / workflow
    'research_paper',     # 学术论文
    'industry_news',      # 行业新闻
    'funding',            # 融资
    'open_source',        # 开源项目
    'tutorial'            # 教程
]

NOISE_KEYWORDS = [
    '娱乐', '八卦', '明星', '电商', '购物',
    '优惠', '促销', '抽奖', '直播带货'
]

def ai_score(title: str, summary: str) -> dict:
    """0-1 评分 + ai_label 分类"""
    # 1. 关键词预过滤（避免 LLM 调用）
    if any(k in title for k in NOISE_KEYWORDS):
        return {'ai_score': 0, 'ai_label': 'noise', 'reason': '噪音词'}

    # 2. LLM 评分（用便宜的模型）
    prompt = f"""
    给这篇 AI 内容打 0-1 分（重要性 + 相关性），并分类。
    标题：{title}
    摘要：{summary[:500]}
    标签：{', '.join(AI_LABELS)}
    返回 JSON：{{"ai_score": float, "ai_label": str, "ai_signals": [str], "reason": str}}
    """

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",  # 便宜
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(resp.choices[0].message.content)
    except Exception as e:
        return {'ai_score': 0.5, 'ai_label': 'unknown', 'reason': f'评分失败: {e}'}
```

### 阶段 3（2-3 周）：监控 + 缓存

```python
# src/cache.py
import redis
import json

r = redis.Redis(host='localhost', port=6379)

def get_cached_score(item_id: str) -> dict | None:
    """Redis 缓存评分结果"""
    key = f'ai_score:{item_id}'
    val = r.get(key)
    return json.loads(val) if val else None

def set_cached_score(item_id: str, score: dict, ttl: int = 7 * 24 * 3600):
    r.setex(f'ai_score:{item_id}', ttl, json.dumps(score))
```

### 阶段 4（3-4 周）：Skill 集成

```python
# src/skill.py
def ai_news_daily_skill() -> str:
    """AI 新闻日报 skill"""
    items = get_today_items()  # 拉今日 AI 评分 >= 0.7
    items = sorted(items, key=lambda x: x['ai_score'], reverse=True)[:10]

    return '\n\n'.join([
        f"# {item['title']}\n评分：{item['ai_score']}\n标签：{item['ai_label']}\n{item['url']}"
        for item in items
    ])

# 在 OpenClaw skill 文件里调
# skills/ai-news-daily.md
"""
name: AI News Daily
description: 今日 AI 圈重要新闻
triggers: ["AI 日报", "/news"]
tools: [ai_news_daily_skill]
"""
```

## 三、改造后架构

```text
RSS 源（50+）
  ↓
fetcher.js（保留）
  ↓
normalize_url() + make_item_id()  ← 新增
  ↓
21 天 archive 去重                  ← 新增
  ↓
AI score 缓存（Redis）              ← 新增
  ↓
未评分 → 调用 LLM 评分（gpt-4o-mini） ← 新增
  ↓
评分 ≥ 0.7 → 输出
  ↓
Skill 集成（每日推送 / 飞书通知）
```

## 四、3 个月里程碑

| 阶段 | 时间 | 产出 |
|---|---|---|
| M1 | 1-2 周 | 核心去重（无 AI 评分） |
| M2 | +2-3 周 | + AI 评分 + 缓存 |
| M3 | +1 周 | + 监控告警 + Skill 集成 |
| M4 | +1 周 | + 性能优化 + 文档 |

**风险控制**：每个阶段可独立回滚（只影响当批数据）。

## 五、4 条避坑

1. **不要"一次性改完"**——分阶段，每阶段验证
2. **不要"全员 AI 评分"**——先关键词过滤 90% 噪音，剩下 10% 再用 LLM
3. **不要"评分当真理"**——AI 评分有错，定期人工 review
4. **不要"凭据硬编码"**——环境变量 + secret manager

## 六、3 个相关项目

- [ai-news-radar](https://github.com/YourOrg/ai-news-radar) — 源
- [rss-fetcher.js](https://github.com/YourOrg/rss-info-aggregator) — 现有系统
- [redis](https://redis.io) — 评分缓存

## 七、本文 + 后续

本文是改造方案总览。后续：

- 阶段 1 实施细节（去重算法）
- 阶段 2 实施细节（AI 评分 + 成本控制）
- 完整 PR diff（与现有 fetcher.js 集成）

---

> **ai-news-radar 的核心价值不是"AI 评分"——是"统一去重 + 透明评分 + 可解释"**。**有评分 = 用户知道"为什么这条上榜"，没评分 = 用户怀疑"AI 是不是随机挑的"**。**透明性是 AI 落地的最大门槛**。