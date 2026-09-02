---
skill: obsidian-to-hexo-publisher
version: "1.0.0"
description: "把 Obsidian 笔记（Markdown）改写为符合 MonoShow 博客文风的 Hexo 博文。自动处理 front matter、图片路径、参考链接、Obsidian 专有语法（callout、双链、嵌入语法），并给出发布前合规清单。"
trigger:
  - "把 Obsidian 笔记改成博客"
  - "obsidian 转博客"
  - "obsidian 转 hexo"
  - "把笔记发到 hexo"
  - "把笔记改成博文"
  - "改写笔记成博客"
  - "笔记发布到博客"
  - "把这篇 obsidian 笔记发布"
platforms:
  - obsidian
  - hexo
  - markdown
---

# Obsidian → Hexo 博客改写 Skill

## 1. 概述

本 Skill 用于把 Obsidian vault 里的笔记改写为 MonoShow 博客（`hyqskevin-hexo`）可发布的 Hexo 博文。核心流程：

```
Obsidian Markdown 笔记
    → 文风规范化（参考博客已发布文章）
    → 语法转换（callout、双链、嵌入语法）
    → 图片路径改写（→ https://hyqskevin.github.io/pic/...）
    → 参考链接收集与整理
    → 自动补 front matter
    → 输出到 source/_posts/<slug>.md
    → 发布前合规检查
```

发布流水线伙伴 Skill：
- `skill/SKILL.md`（`article-platform-publisher`，把 Hexo 源稿改写为小红书 / 公众号）
- `skill/humanizer.md`（`humanizer`，把 AI 味重的稿件改写为博客口语化口吻）

三者衔接顺序：**先**用本 Skill 把笔记改成 Hexo 博文 → **再**用 `humanizer` 去 AI 味 → **最后**用 `article-platform-publisher` 多平台分发。

## 2. 触发条件

遇到以下关键词或意图时激活本 Skill：

- "把 Obsidian 笔记改成博客 / 博文"
- "obsidian 转 hexo / 转博客"
- "改写笔记成博客文章"
- "笔记发布到博客"
- "用 obsidian 这篇写一篇博客"

## 3. MonoShow 博客文风规范

### 3.1 文风基准

以现有 `source/_posts/*.md` 为参考系，特别是：
- **技术研究类**：`slam-rgbd.md`（2019-01-10）、`js同步和异步.md`（2020-05-10）、`Webpack_1/2/3.md`
- **方法论 / 案例研究**：`EDH-combo.md`、`decision-tree-visualization.md`
- **个人 / 反思类**：`hello-world.md`、`hello-hexo.md`（最新博客上线公告）
- **代码 / 工程笔记**：`vue-notes.md`、`flask-learning1/2.md`

读 2–3 篇同主题现有文章作为本次改写的"语料锚点"，避免风格漂移。

### 3.2 文风硬性要求

| 维度 | 要求 |
|------|------|
| **语言** | 中文为主，技术术语保留英文（如 `Multi-Agent`, `Gateway`, `Hermes`, `RL`）。标题、tag 可以全英文或中英混合。 |
| **人称** | 第一人称为主（"我"、"本文"、"我们"），偶尔用第三人称自指（"Kevin"，与 `hello-world.md` 一致）。反思段允许抒情。 |
| **句长** | 段内每句 1–2 行，长段落拆为多个短段落。 |
| **结构** | 用 `##` 二级标题分节，`###` 三级标题分小节。技术稿子节数 3–7 个。 |
| **代码块** | 必须带语言标签（`js`、`python`、`bash`、`yaml` 等）。 |
| **图片** | 用 `https://hyqskevin.github.io/pic/<category>/<file>` 全路径。 |
| **表格** | 优先用 Markdown 表格；超过 5 列或 10 行的表格考虑拆图。 |
| **引用** | 行内或末尾用 Markdown 标准链接 `[文字](URL)`。Obsidian 双链 `[[...]]` 不能直接出现（必须转换）。 |
| **首段** | 不写"大家好今天给大家分享…"这类开场白；首段直接进入主题或 TL;DR。 |
| **结尾** | 技术稿可用一段"小结 / 后记"做总结；反思稿可以以问句收尾（与 `hello-world.md` 一致）。 |

### 3.3 内容取舍

- **保留**：核心论点、事实结论、技术细节、对比表、代码示例、个人观察。
- **删除 / 改写**：
  - 直接复制大段网页剪藏（`Clippings/` 来源）
  - 含 `/Users/...` 绝对路径的代码或截图引用
  - 真实的 API key、token、账号、邮箱
  - 与个人财务 / 健康 / 家庭相关的具体数字
  - 私域项目 / 客户名 / 内部代号

## 4. 改写流程

按以下步骤处理输入笔记：

```
Step 1: 读取源稿（Read 工具）+ 同步读 2–3 篇博客同主题文章作为语料锚点
Step 2: 提取 TL;DR / 核心论点 / 关键事实 / 引用 / 图片清单
Step 3: 规划博文大纲（## / ### 结构），与博客已有同名分类的子目录对齐
Step 4: 按文风规范改写正文（不直接搬运大段原文）
Step 5: 语法转换（callout / 双链 / 嵌入语法 → 标准 Markdown）
Step 6: 图片路径改写 + 复制图片到 source/pic/<category>/
Step 7: 生成 front matter
Step 8: 输出完整 Markdown 文件，落到 source/_posts/<slug>.md
Step 9: 运行 npm run build 验证本地可生成
Step 10: 给出发布前检查清单（见第 10 节）
```

## 4.5 字数控制与分期策略

博客现役文章字数分布（2026-09 实测）：

| 区间 | 字数 | 比例 | 适合内容 |
|---|---|---|---|
| 短 | 500–1000 字 | ~25% | 单点笔记、踩坑记录、轻量心得 |
| **中（甜区）** | **1500–2500 字** | **~45%** | 单主题技术稿、案例分析 |
| 长 | 2500–4000 字 | ~20% | 深度研究、对比类长文 |
| 超长 | > 3000 字 | ~25% | **必须评估是否分期** |

**经验阈值**（用户硬性偏好：**>3000 字一律拆**）：

- **1500–2500 字**：理想甜区，读者一气读完，SEO 与传播最优
- **2500–3000 字**：可接受，但建议加 TL;DR + 目录
- **> 3000 字**：**必须分期**，不讨价还价

### 4.5.1 拆分决策树

```
源稿字数
  │
  ├─ < 1500 字 → 单篇发布（不需要拆分）
  │
  ├─ 1500–3000 字 → 单篇发布，可加 TL;DR + 目录
  │
  └─ > 3000 字 → 进入拆分决策 ↓

拆分评估
  │
  ├─ 内容强耦合（如教程、API 手册）→ 重新审视；如无强耦合，按下面模式拆
  │
  └─ 内容可自然分段 → 进入拆分模式选择 ↓

拆分模式（按主题自洽优先）
  ├─ 概念 → 细节 → 决策（适合架构对比 / 技术调研）
  ├─ 问题 → 方案 → 复盘（适合踩坑复盘）
  ├─ 入门 → 进阶 → 实战（适合教程）
  └─ 上 → 中 → 下（默认三段式）
```

### 4.5.2 拆分模式选择

**概念 → 细节 → 决策**（默认推荐）

| 期 | 内容 | 字数预算 |
|---|---|---|
| 上 | 设计哲学、TL;DR、架构总览 | 1500–2000 |
| 中 | 运行时行为、配置、故障、消息流 | 1800–2500 |
| 下 | 子系统对比、选型决策、数据来源 | 1500–2000 |

**问题 → 方案 → 复盘**（适合 P0/P1 事故类）

| 期 | 内容 | 字数预算 |
|---|---|---|
| 上 | 问题现场、时间线、影响评估 | 1200–1500 |
| 中 | 根因分析、排查路径、修复动作 | 1800–2500 |
| 下 | 教训、改进措施、长期 SOP | 1000–1500 |

### 4.5.3 命名与 front matter

**标题后缀**：用 `（上）/（中）/（下）` 或 `（Part 1/2/3）`，**不要混用**。推荐 `（上）`，与中文语境最贴合。

```
Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异（上）：设计哲学与架构
Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异（中）：运行时行为
Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异（下）：子系统与选型
```

**front matter 加 series 字段**（即使主题不支持渲染，结构化字段先存，便于将来聚合）：

```yaml
---
title: Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异（上）
date: 2026-09-02 00:00:00
series:
  name: hermes-vs-openclaw-gateway
  index: 1
  total: 3
categories:
  - notes
tags:
  - Agent
  - Hermes
  - OpenClaw
  - Gateway
---
```

### 4.5.4 分期内的衔接

- **首期开头**：写明系列定位 + 全文 TL;DR 速览（读者决定要不要跟读三期）
- **每期结尾**：留 1 段"下期预告"，给读者预期
- **末期结尾**：给完整的"参考"与"待跟进"，汇总三期数据来源
- **每期正文内**：跨期引用用 `（详见（中）篇）` 之类轻提示，**不要在博客里硬塞分页符或断章**

### 4.5.5 字数估算命令

```bash
# 估算一篇草稿字数
python3 -c "
import re
with open('source/_posts/<slug>.md') as f: t = f.read()
body = t.split('---', 2)[2]
zh = len(re.findall(r'[\u4e00-\u9fff]', body))
en = len(re.findall(r'[a-zA-Z]+', body))
print(f'中文字符: {zh}, 英文单词: {en}, 估算总字数: {zh + en//2}')
"
```

如果超出甜区，**回到 §4.5.1 拆分决策树**，不要硬塞单篇。

---

## 4.6 系列文导航与交叉链接校验

当一篇博文被拆成多期（如 `（上）/（中）/（下）`）时，**每一期都必须有正确的导航块**，否则读者在中途断开或不知道下一步去哪。规则来自 MonoShow 实际验证（Hermes vs OpenClaw 三期）。

### 4.6.1 命名与 URL 约定

- **slug 结尾**：每期文件名末尾加 `-1`、`-2`、`-3`（或 `-2` 等可识别序号），URL 才能区分
- **front matter series 字段**：必须填 `name` + `index` + `total`，三篇一致
- **标题后缀**：用 `（上）/（中）/（下）`，便于读者扫一眼知道当前位置

```
文件名：    2026-09-02-hermes-vs-openclaw-gateway-1.md   2.md   3.md
permalink： /2026/09/02/2026-09-02-hermes-vs-openclaw-gateway-1/
title：     Hermes ... 差异（上）：设计哲学与架构
series:    { name: hermes-vs-openclaw-gateway, index: 1, total: 3 }
```

### 4.6.2 跨期内容引用规则（**不需要文末系列导航块**）

**重要**：正文里已有的"下期预告"段就是跨期跳转，不要额外加一个"系列导航"块——会让读者视觉重复，也会让本期里"本篇"字样没链接造成困惑。规则如下：

- **正文已有的链接就是兜底**（如"下期预告"段里的链接）
- **不要在文末再贴一份**"← 上 | ▶ 本篇 | → 下" 这种汇总行
- 末篇（下）没有下一期链接，**不需要任何形式的回链**，靠"系列完结"段自然收束

正文里提到另一期的内容时：

| 场景 | 写法 | 原因 |
|---|---|---|
| 详细展开在某期 | `（详见（中）篇）` 或 `（详见 §四）` | 不强插链接，避免视觉割裂 |
| 必然要跳转 | `[（中）：运行时行为](/2026/09/02/...gateway-2/)` | 读者需要立刻跳转 |
| 数据来源表、参考章节 | **只放最后一期** | 避免三期都重复维护 |

**front matter 仍需 `series.name/index/total` 三字段**——这是结构化元数据，未来聚合 / 主题渲染可能用到，即使正文不渲染也要写。

### 4.6.3 校验脚本（必跑）

发布前必须跑这个脚本，确保所有跨期链接实际可达：

```bash
# 在 hexo 仓库根目录运行
SITE="http://localhost:4000"
DIR="source/_posts"

echo "=== 系列文交叉链接校验 ==="
# 1. 找出所有带 series 字段的 post
posts=$(grep -lE "^series:" $DIR/*.md)
for post in $posts; do
  slug=$(basename "$post" .md)
  # 2. 抓出 front matter 的 series.name 与所有 index
  series_name=$(grep -A 3 "^series:" "$post" | grep "name:" | awk '{print $2}')
  # 3. 抓出本文件正文里引用的所有 permalink
  refs=$(grep -oE '/20[0-9]{2}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/' "$post" | sort -u)
  echo ""
  echo "→ $slug (series: $series_name)"
  for ref in $refs; do
    code=$(curl -sI "$SITE$ref" | head -1 | tr -d '\r' | awk '{print $2}')
    if [ "$code" = "200" ]; then
      echo "  ✅ $ref"
    else
      echo "  ❌ $ref -> HTTP $code"
    fi
  done
done
```

**期望输出**：所有 `→ /<permalink>/` 都显示 `✅`，没有任何 `❌`。如有 `❌`：

1. 检查目标 post 是否已写并 build
2. 检查 permlink 拼写（最容易写错的：日期、序号后缀）
3. 检查 front matter 的 `series.index/total` 与正文导航块里写的"（上）/（中）/（下）"是否对得上

### 4.6.5 全链路校验清单

每发布一期系列文后，逐项打勾：

- [ ] front matter `series.name/index/total` 与其他期一致
- [ ] 正文里有跨期链接（首期有"下期预告"段或类似、中期必须指向下一期、末期不需）
- [ ] 跑 §4.6.3 校验脚本，所有 permalink 返回 200
- [ ] 如果有"下期预告"段，预告里的链接 target 与正文叙述对得上
- [ ] 末期数据来源表 / 参考章节已就位（不要拆到每期）
- [ ] 全文 series.total 与实际期数一致（不要 series.total=3 但只发 2 期）
- [ ] **没有**额外的文末"系列导航"块（按 §4.6.2 规则，正文已有跳转就够）

---

## 5. 图片处理

### 5.1 三种图片语法

| Obsidian 语法 | 转换目标 |
|---|---|
| `![[image.png]]`（嵌入语法） | `![](https://hyqskevin.github.io/pic/<cat>/image.png)` |
| `![[subfolder/image.png]]` | `![](https://hyqskevin.github.io/pic/subfolder/image.png)` |
| `![alt](相对路径)` | `![](https://hyqskevin.github.io/pic/<cat>/image.png)` |

`<cat>` 取自原笔记所在的二级目录，例如 `4-doc/multi-agent/...` → `/pic/multi-agent/...`。若笔记在 `_posts` 直接子层（如 `1-notes/`），省略 `<cat>`。

### 5.2 图片复制步骤

1. 从 Obsidian 笔记里枚举所有 `![[...]]` 嵌入语法
2. 用 `Read` 或 Bash 把每张图片**复制**到 `source/pic/<cat>/<filename>`（保留原文件名）
3. 检查 `source/pic/<cat>/` 是否已存在同名图片；存在则跳过并提示用户
4. 把原路径替换为完整 URL `https://hyqskevin.github.io/pic/<cat>/<filename>`
5. 若图片本身就是外链（`http://` / `https://`），**不复制**，直接保留原 URL

### 5.3 图片命名建议

- 文件名保持 Obsidian 原文，不强制改写（避免破坏外链与 Git 历史）
- 长文件名（> 60 字符）建议改写，但需要同步更新博客引用

## 6. 参考链接处理

### 6.1 三种链接语法

| Obsidian 语法 | 转换目标 |
|---|---|
| `[[Note Title]]`（双链无别名） | 视情况：<br>(a) 同 vault 内已有公开映射 → 标准链接<br>(b) 无映射 → 删除或转为脚注<br>(c) 通用引用 → 改为"[原文链接待补]"占位 |
| `[[Note Title\|别名]]`（双链带别名） | 保留别名，链接目标同上处理 |
| `[文字](URL)`（标准 Markdown） | **保留** |

### 6.2 链接整理规则

- **保留**：所有 `http://` / `https://` 外链；与博客已有引用对得上的双链
- **删除**：指向日记（`2-diary/`）、剪藏（`Clippings/`）、私人项目（`5-project/Claudio`）的双链
- **占位**：无法判断的内部双链 → 标记为 `<!-- TODO: link to public source -->`，让用户人工补
- **汇总**：长文末可加一段 `## 参考` 章节，列出文中所有外链（去重），格式 `[标题] — URL`

### 6.3 引用与脚注

- 学术性、技术性内容若引用了论文 / 官方文档，建议在 `## 参考` 章节列出
- 不强求脚注（Hexo 主题不原生支持）；用行内 `[1]` `[2]` 引用 + 末尾列表

## 7. Obsidian 专有语法 → Markdown 转换

| Obsidian 语法 | Markdown 替代 |
|---|---|
| `> [!note] 标题\n> 内容` | `> **📝 Note · 标题**\n>\n> 内容` |
| `> [!warning] 标题\n> 内容` | `> **⚠️ Warning · 标题**\n>\n> 内容` |
| `> [!tip] 标题\n> 内容` | `> **💡 Tip · 标题**\n>\n> 内容` |
| `> [!info] 标题\n> 内容` | `> **ℹ️ Info · 标题**\n>\n> 内容` |
| `> [!example]` | `> **📋 Example**\n>\n> 内容` |
| `> [!quote]` | `> **❝ 引用**\n>\n> 内容` |
| ` ```mermaid ` | 保留，Hexo 主题支持 Mermaid |
| ` ```dataview ` | 删除（Dataview 是 Obsidian 插件，Hexo 不支持） |
| `#tag` / `[[tag]]` | 转化为博客 front matter 的 `tags`，删除正文里的 hashtag |
| `%% 注释 %%` | 转为 `<!-- 注释 -->` 或直接删除 |
| 行内公式 `$...$` | 保留，前提是 Hexo 主题启用了 MathJax（参考 `_config.yml`） |
| 块公式 `$$...$$` | 保留（同上） |

若不确定 callout 类型，默认按 `> **ℹ️ Info**` 处理，并在末尾加 `<!-- 原 Obsidian callout 类型：[类型] -->` 提示用户。

## 8. Front Matter 生成

每篇博文必须包含：

```yaml
---
title: <博客标题，中英均可>
date: YYYY-MM-DD HH:MM:SS
categories:
  - <study|notes|code|paper|repo|language-learning>
tags:
  - <tag1>
  - <tag2>
  - <tag3>
---
```

### 8.1 字段生成规则

| 字段 | 来源 |
|---|---|
| `title` | 取笔记第一个 `#` 标题，去掉日期和 `.md` 后缀；若原标题是内部文件名则**必须改写**为面向读者的标题 |
| `date` | 默认使用今天日期 `YYYY-MM-DD 00:00:00`；如笔记正文里有明确日期（如论文 / 报告日期），用该日期 |
| `categories` | 单值，从以下选一个：`study`、`notes`、`code`、`paper`、`repo`、`language-learning` |
| `tags` | 3–5 个，从笔记里的 `tags:` 字段、Hashtag、双链主语里抽取，小写英文为主 |

### 8.2 标题改写建议

- 直接文件名（如 `20260521-302AI商业化.md`）→ `"302AI + New-API 付费 AI API 商业化落地指南"`
- 太技术（`Hermes与OpenClaw的Gateway差异.md`）→ `"Hermes Agent 与 OpenClaw 在 Gateway 设计上的差异"`
- 太口语 → 在文风允许范围内加一点情境或结论性描述

## 9. 草稿输出模板

```
=== HEXO BLOG DRAFT ===
slug: <year>-<month>-<day>-<slug>
file: source/_posts/<slug>.md
images_to_copy:
  - <obsidian_path> → source/pic/<cat>/<filename>
  - <obsidian_path> → source/pic/<cat>/<filename>
references_section: <yes|no>
estimated_words: <整数>

=== CONTENT START ===
---
title: ...
date: ...
categories: ...
tags: ...
---

<正文 Markdown>
=== CONTENT END ===

=== PRE-PUBLISH CHECKLIST ===
- [ ] 标题公开友好
- [ ] front matter 完整
- [ ] 本机路径 / 敏感信息已脱敏
- [ ] Obsidian 双链已转换
- [ ] 图片已复制并改写 URL
- [ ] Callout 已转换
- [ ] 本地 `npm run build` 通过
- [ ] 本地 `npm run server` 预览通过
```

输出后**不要自动 commit / push**，等用户确认。

## 10. 发布前检查清单

- [ ] 标题适合公开阅读，不只是内部文件名。
- [ ] front matter 完整：`title`、`date`、`categories`、`tags`（系列文加 `series.name/index/total`）。
- [ ] **字数 ≤ 3000 字**（超出必须拆期；详见 §4.5）。
- [ ] **如果是系列文**：
  - 跑 §4.6.3 校验脚本确认所有跨期 permalink 返回 200（详见 §4.6）
  - 正文已有跨期链接（首/中期），末期不需
  - front matter `series.index/total` 与其他期一致
  - **没有**额外加文末"系列导航"块
- [ ] 删除或替换本机绝对路径（`/Users/...`）、token、邮箱、API key、私有仓库地址。
- [ ] Obsidian 双链 `[[...]]` 全部转换或删除，无残留。
- [ ] 所有图片 URL 都是 `https://hyqskevin.github.io/pic/...` 或外链。
- [ ] 物理图片已复制到 `source/pic/...`，且文件名对应。
- [ ] Callout 全部转为 Markdown blockquote 或 Mermaid 图。
- [ ] Dataview / Obsidian 特有插件语法已删除。
- [ ] 外部事实、产品版本、价格、star 数已更新或标注日期。
- [ ] 引用 / 参考链接在 `## 参考` 章节汇总。
- [ ] 行文风格与博客已有 2–3 篇文章无明显落差。
- [ ] 本地 `npm run build` 成功（控制台无 error）。
- [ ] 本地 `npm run server` 预览正常（样式、代码块、图片、表格都正确渲染）。

## 11. 与 humanizer、article-platform-publisher 的衔接

完整的流水线是**三段式**：

```
Obsidian 笔记
    → [本 Skill] → source/_posts/<slug>.md（结构、front matter、图片、链接都已规范）
    → [humanizer] → 博客口语化终稿（去 AI 味，注入真人痕迹）
    → [article-platform-publisher] → 小红书 / 公众号版本
```

调用顺序不能错：**先跑本 Skill 保证结构，再跑 humanizer 保证口吻**。并行调用会导致结构与口吻互相冲突。

阈值硬规则（来自 `feedback-article-length-cap`）：

- 单篇上限 **3000 字**，超出必须分期
- 分期命名用 `（上）/（中）/（下）`，front matter 加 `series.name/index/total`
- 详细拆分决策树见 §4.5

中间产物建议归档到 `creatives/<slug>/`：
- `article_final.md`：本 Skill 改写完成的结构稿
- `article_humanized.md`：humanizer 跑完的口语化终稿
- `wechat_<slug>.md`：公众号版
- `xhs_<slug>.md`、`xhs_<slug>_final.md`：小红书版
- `image_prompts.md`：配图 prompt 与导出记录
- `excalidraw/`、`output_arch/`、`output_p5js/`：素材源与导出产物

参考既有案例：`creatives/hermes-vs-openclaw/`。

## 12. 常用命令速查

```bash
# 读取源稿
Read /Users/hanamaki_mac_mini/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/Documents/<path>.md

# 复制图片
cp "<obsidian_path>" /Users/hanamaki_mac_mini/Documents/github/project/hyqskevin-hexo/source/pic/<cat>/

# 预览博客
cd /Users/hanamaki_mac_mini/Documents/github/project/hyqskevin-hexo && npm run server

# 生成静态文件
npm run build

# 检查 publish 候选（参考发布清单）
Read /Users/hanamaki_mac_mini/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/Documents/8-hexo/发布文章协作清单.md
```