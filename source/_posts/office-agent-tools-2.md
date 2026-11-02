---
title: Agent 操作 Office 工具汇总
date: 2026-10-18 00:00:00
description: 一次性盘点 Agent 时代下 Word/Excel/PPT 操作工具链：8 篇中文公众号文章、10 个 Exa 检索项目、30+ GitHub 高星仓库、7 个 Office MCP Server、4 条 PPT 制作路径，以及 Google Labs DESIGN.md 设计规范与实操指南。
categories: [工具推荐]
tags: [AI Agent, Office, PPT, Word, Excel, MCP Server, DESIGN.md]
---

> 写代码可以 Vibe Coding，办公能不能 Vibe Officing？本文是「Agent 操作 Word/Excel/PPT」主题的**工具汇总 + 路径选型**。综合 IMA 知识库、Exa Web Search、Clippings 本地库三方资料，整理 30+ 仓库、4 条 PPT 制作路径与一份可落地的 DESIGN.md 写法。

## 一、文章与项目索引

### 1.1 IMA 知识库 8 篇

**PPT 专项**：

| 文章 | 关注点 |
|------|--------|
| AI PPT，这次是真不用返工了 | AI 自动出稿 + 可编辑 |
| 我的一人公司 AI PPT 团队，也被腾讯录用了 | 工作流 + Skill 化 |
| 开源一个 PPT Skill｜压进了我 10 年的设计经验 | 杂志风 HTML PPT |
| chartswiz：Nestjs + Vue3 AI PPT 项目 | 前后端实现 |
| 实测千问新出的 PPT Agent | 风格化与二次编辑 |
| 开源一个为演讲而生的 PPT Skill | 演讲者视角 |

**办公 / Agent**：

| 文章 | 关注点 |
|------|--------|
| Agent 时代，如何办公 | 飞书 CLI + Claude Code |
| 写代码可以 Vibe Coding，为什么办公还不能 Vibe Officing | 概念与现状 |

### 1.2 Exa Web Search 10 个项目

> 来源：Microsoft / GitHub / Anthropic 官方仓库或公开文章（2026-07 检索）。

| 项目 | 类型 | 说明 |
|------|------|------|
| Microsoft 365 Copilot Agentic Capabilities | 商业 | 2026-04 GA，官方 Agent 能力 |
| OfficeCLI | 开源 | 单二进制，无需安装 Office |
| Office Agents | 开源 | Word/Excel/PPT Add-ins + AI Chat |
| Claude for Microsoft 365 | 商业 | 直接操作 Excel/PPT/Word |
| AutoOffice | 开源 | Office.js 代码生成与执行 |
| PowerPoint MCP Server × 3 | 开源 | PPT 操作 MCP |
| Use-It Agent | 开源 | PPT/Word/Excel/WPS/AutoCAD |

---

## 二、GitHub 高星仓库

> Star 数取自 GitHub 检索快照（2026-07-03），近期热度变化较大者标"约"。

### 2.1 通用 Office 工具 / AI Agent 套件

| 项目 | 语言 | Stars | 核心能力 |
|------|------|-------|----------|
| [ppt-master](https://github.com/hugohe3/ppt-master) | Python | 约 30K | SVG → DrawingML，可编辑 PPTX + 原生动画/演讲者备注 |
| [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) | C# | 8.3K | 单二进制读写 DOCX/XLSX/PPTX + HTML/PNG 渲染 |
| [markitdown](https://github.com/microsoft/markitdown) | Python | 151K | Office/PDF/音视频 → Markdown，LLM 友好 |
| [python-office](https://github.com/CoderWanFeng/python-office) | Python | 1.3K | 中文圈 73 Skill：PDF/Word/Excel/PPT/微信/邮件 |
| [office-agents](https://github.com/hewliyang/office-agents) | TypeScript | — | Office Add-ins + AI Chat Panel，BYOK |
| [Use-It Agent](https://github.com/UseIt-AI/use-it-agent) | TypeScript | — | 通过 COM/API 操作 WPS/AutoCAD 等桌面应用 |
| [BrandDocs](https://github.com/ferdinandobons/brand-docs) | Python | — | Agent Skill：学习企业模板 → 生成品牌化文档 |

### 2.2 PPT / 演示文稿生成

| 项目 | 语言 | Stars | 定位 |
|------|------|-------|------|
| [PPTAgent](https://github.com/icip-cas/pptagent) | Python | 4.7K | 中科院自动化所，EMNLP 2025 反射式 Agent |
| [PptxGenJS](https://github.com/gitbrent/PptxGenJS) | TypeScript | 5.8K | JS 生成 PPTX，Node/React/浏览器通用 |
| [reveal.js](https://github.com/hakimel/reveal.js) | JavaScript | 72K | HTML 演示框架 + 演讲者模式 |
| [Slidev](https://github.com/slidevjs/slidev) | Vue/TS | 47K | 面向开发者的 Markdown 幻灯片 |
| [mdx-deck](https://github.com/jxnblk/mdx-deck) | React/MDX | 11K | MDX 演示文稿 |
| [pptx-automizer](https://github.com/singerla/pptx-automizer) | TypeScript | 220 | 基于模板的 PPTX 生成器，可改母版/图表 |
| [Awesome-Powerpoint-AI-Agents](https://github.com/ishandutta2007/Awesome-Powerpoint-AI-Agents) | Markdown | — | AI Slide 生态 curated |

### 2.3 Excel / Word 库

| 项目 | 语言 | Stars | 定位 |
|------|------|-------|------|
| [excelize](https://github.com/qax-os/excelize) | Go | 20.7K | 流式 API + 图表/公式/透视表/VBA |
| [ClosedXML](https://github.com/ClosedXML/ClosedXML) | C# | 6K | .NET 封装 OpenXML |
| [XlsxWriter](https://github.com/jmcnamara/XlsxWriter) | Python | 4K | 生成 XLSX |
| [python-pptx](https://github.com/scanny/python-pptx) | Python | 3.4K | 读写 PPTX 基础库 |
| [python-docx](https://github.com/python-openxml/python-docx) | Python | 5.7K | 读写 DOCX |
| [xlwings](https://github.com/xlwings/xlwings) | Python | — | Python ↔ Excel 双向调用，跨平台 |

---

## 三、Office MCP Server 汇总

MCP（Model Context Protocol）是 Agent 调用外部工具的事实标准。下面 7 个 Office MCP Server 是把 Word/Excel/PPT 能力暴露给 Claude / Codex / Cursor 的桥梁。

| 项目 | 语言 | Stars | 通道 | 工具数 / 特性 |
|------|------|-------|------|---------------|
| [Office-PowerPoint-MCP-Server](https://github.com/GongRzhe/Office-PowerPoint-MCP-Server) | Python | 1.8K | python-pptx | 32 工具，模板/图表/动画/演讲者备注 |
| [mcp-server-ppt](https://github.com/trsdn/mcp-server-ppt) | Python | — | COM API | 控制 PowerPoint，对接 Copilot/Claude/ChatGPT |
| [mcp-ms-office-documents](https://github.com/ForLegalAI/mcp-ms-office-documents) | Python | 31 | Docker | 生成 PPT/Word/Excel/邮件/XML |
| [python-office-mcp-server](https://github.com/rcarmo/python-office-mcp-server) | Python | 10 | python-office | 提取/转换/生成，含 word/excel/pptx 命名空间 |
| [mcp-office](https://github.com/dosev-ai/mcp-office) | Python | 3 | 本地优先 | Excel/PowerPoint/Word/Outlook |
| [powerpoint-mcp](https://github.com/kennypeh85/powerpoint-mcp) | Python | — | COM | 实时编辑已打开的 Office 文档 |
| [OfficeMCP](https://github.com/mhackermsft/OfficeMCP) | C# | 104 | 原生 | 自然语言创建/读写 Office 与 PDF |

**怎么选**：要 CI/CD 批量出稿选 Python 库系（python-pptx 系列），要修改用户正在打开的文件选 COM 系（`mcp-server-ppt` / `powerpoint-mcp`，仅 Windows）。

---

## 四、PPT 制作方式分类

> 按最终交付物与技术路径划分。LLM/Agent 时代，**选对路径比选对工具重要**。

### 4.1 四种路径对比

| 路径 | 输出 | 编辑性 | 视觉表达 | 代表工具 |
|------|------|--------|----------|----------|
| **原生 PPTX 生成** | `.pptx` | ★★★★★ | ★★★ | ppt-master、PPTAgent、PptxGenJS、OfficeCLI |
| **HTML/Web 幻灯片** | `.html` | ★ | ★★★★★ | html-ppt-skill、Slidev、reveal.js、Gamma |
| **图片/视觉流** | PNG + 容器 | ✘ | ★★★★★ | 早期 Gamma、PPT Agent PNG pipeline |
| **实时/接口驱动** | 不出文件 | ★★★★★ | ★★★ | mcp-server-ppt、Copilot、Office Add-in |

### 4.2 原生 PPTX 生成（商务交付首选）

> 文字/形状/图表是 PowerPoint 原生对象，客户可在 PowerPoint 继续编辑。

| 子路径 | 代表项目 | 技术要点 | 适用 |
|--------|----------|----------|------|
| SVG → DrawingML | ppt-master、ppt-agent-skill | LLM 出 SVG → 转为原生形状 | 报告转 PPT、模板复刻 |
| python-pptx 直写 | python-pptx、PPTAgent、Office-PowerPoint-MCP-Server | 结构化数据 → python-pptx → PPTX | 数据报告、批量生成 |
| JS / C# 直接生成 | PptxGenJS、OfficeCLI、auto-ppt-engine | JS/C# 调库生成 | Web/CI 集成 |
| Markdown → PPTX | agent4ppt、MdPr、mk-present | Markdown 为单一真相源 | 技术文档 |
| 模板填充 | pptx-automizer、BrandDocs、anyideaz/pptx-skills | 替换占位符 | 企业品牌模板 |

### 4.3 HTML / Web 幻灯片（视觉表达优先）

| 子路径 | 代表项目 | 适用 |
|--------|----------|------|
| HTML-first Skill | html-ppt-skill、guizang-ppt-skill、frontend-slides | 产品发布、Demo Day |
| Slidev | Slidev、slidev-ppt-agent | 开发者演讲、代码展示 |
| Reveal.js / Marp | reveal.js、mdx-deck、Marp | 学术演讲 |
| Web 应用生成器 | Gamma、Beautiful.ai | 营销展示 |

### 4.4 实时/接口驱动（Agent 改已打开文件）

| 子路径 | 代表项目 | 适用 |
|--------|----------|------|
| COM 自动化 MCP | mcp-server-ppt、powerpoint-mcp、mcp-office | Windows 已有文件修改 |
| Office Add-in + AI | office-agents、Word GPT Plus | 在 Office 内协作 |
| Microsoft 365 Copilot | Copilot for PPT | M365 企业环境 |

### 4.5 选型速查表

| 需求 | 推荐路径 | 代表工具 |
|------|----------|----------|
| 给客户可编辑的 `.pptx` | 原生 PPTX | ppt-master、PPTAgent、OfficeCLI、PptxGenJS |
| 视觉惊艳的网页演示 | HTML / Web | html-ppt-skill、Slidev、reveal.js |
| 数据/报告批量转幻灯片 | Markdown → PPTX 或模板填充 | MdPr、agent4ppt、BrandDocs |
| 修改已打开的 Office 文件 | 实时 COM 自动化 | mcp-server-ppt、powerpoint-mcp |
| 企业固定模板批量出稿 | 模板填充 | pptx-automizer、BrandDocs |
| 文档转 Markdown 喂 LLM | 文档解析 | markitdown |

---

## 五、Design 方向：DESIGN.md 生态

### 5.1 核心问题

AI 生成 PPT/UI 的最大短板不是代码能力，而是**不懂设计**。不给设计约束，模型输出永远是同一套"AI 味"——柔光阴影、四五个配色、每页一个 clip-art 图标、圆角卡片。这是因为模型在平均化它见过的所有设计。

**解决方案：给 AI 一份读得懂的设计文档**。2026 年最大进展是 Google Labs 开源 **DESIGN.md** 规范——像 `README.md` 描述功能、`AGENTS.md` 描述 Agent 行为，`DESIGN.md` 告诉 AI "这东西长什么样"。

### 5.2 方案矩阵

| 方案 | 粒度 | 交互 | 适合 | 代表 |
|------|------|------|------|------|
| **DESIGN.md（Google Spec）** | Token 级 | 文件 → Agent | 任何项目 | [google-labs-code/design.md](https://github.com/google-labs-code/design.md)，约 24K stars |
| **designtoken.md** | 全色阶 + 组件态 | 文件 → Agent | 完整 Token 团队 | 在线生成器，150+ 行 |
| **Awesome DESIGN.md** | 完整品牌视觉 | 复制粘贴 | 快速原型 | [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)，约 95K stars |
| **DESIGN.md for Slides** | 配色 + 字体 + 图表 + 避雷清单 | Prompt | 演讲/汇报 | SlideSpeak，70 套免费 |
| **MCP Brand Context** | 资产级（Logo/字体文件） | MCP 实时查询 | 企业多 Agent | SlideSpeak Onbrand / Atlassian ADS MCP |

### 5.3 DESIGN.md 格式详解（Google Labs，2026.04）

**双层结构**：

1. **YAML front matter**（`---` 包裹）— 机器可读的 Design Token
2. **Markdown body** — 人可读的"为什么"，`##` 章节组织

**Token 类型**：

| Token | 格式 | 示例 |
|-------|------|------|
| Color | 任意 CSS 色值 | `"#1A1C1E"`, `"oklch(62% 0.18 250)"` |
| Dimension | 数字+单位 | `48px`, `-0.02em` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | 对象 | fontFamily/fontSize/fontWeight/lineHeight/letterSpacing |

**完整示例（Heritage 主题）**：

```yaml
---
name: Heritage
version: alpha
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
rounded:
  sm: 4px
  md: 8px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary}"
---
```

**CLI 能力**：

```bash
# 校验结构 + Token 引用 + WCAG 对比度
npx @google/design.md lint DESIGN.md

# Diff 两个版本（exit 1 = 有回归）
npx @google/design.md diff DESIGN.md DESIGN-v2.md

# 导出为 Tailwind / CSS / W3C DTCG JSON
npx @google/design.md export --format tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

### 5.4 Awesome DESIGN.md — 73 套现成品牌设计

这是**目前最实用的入口**：把 73 个知名品牌/产品的视觉系统提炼成 DESIGN.md 文件，复制粘贴即可用。

**代表性品牌**：

| 类别 | 品牌 |
|------|------|
| 开发者工具 | Stripe、Vercel、Linear、Supabase、GitHub、Cursor、Raycast |
| AI 平台 | Claude、Mistral、Ollama、Runway、Together AI |
| 消费品牌 | Apple、Spotify、Notion、Figma、Shopify |
| 汽车/运动 | Tesla、SpaceX、Nike、Ferrari、Lamborghini、BMW |

**用法**：复制一份到项目根目录 → Agent 启动时自动读取 → 所有 UI/幻灯片统一品牌。

### 5.5 幻灯片 DESIGN.md 的 6 要素

1. **底色与表面色** — 精确 hex，每页统一底色
2. **双字体搭配** — 标题+正文各一，具名字体（Google Fonts）
3. **单一强调色 + 职能** — 说清楚用在哪（关键数字/活动柱/链接），只能用一次
4. **标志性视觉元素** — 重复出现的识别设备（agenda tracker、手绘刻度线）
5. **图表规则** — 柱状条颜色、标签位置、去掉什么
6. **避雷清单** — 最关键：禁渐变、禁阴影、禁多色、禁 clip-art、禁圆角卡片

**示例 — Atelier 风格**：

```text
Background: warm paper #F4F1EA on every slide, white #FFFFFF only for tonal image plates.
Typography: titles in 'Jost' 36-64px weight 500-600, ink #1C1B19;
body at 14-16px, #4A4843; labels in 'Spline Sans Mono' 10-12px uppercase letter-spaced 0.18em.
Accent: terracotta #B4502E exactly once per slide — a key stat, a rule, a caption, never twice.
Motif: drafting dimension ticks — thin 1px #DBD5C8 lines with short perpendicular end ticks.
Chart: bars in light gray, key bar in accent, values labeled directly, no gridlines/legend.
Strictly avoid: second accent color, drop shadows, rounded cards, gradients as decoration,
clipart or icon fonts, stock photos, dense bullet lists, cramped margins.
```

### 5.6 PPT 工具整合点

| PPT 工具 | 如何整合 DESIGN.md |
|---------|-------------------|
| **ppt-master** | Token 直接驱动 SVG → DrawingML 路径 |
| **PptxGenJS** | color/fontFace 映射到 JS 调用 |
| **python-pptx** | 读 YAML Token → 注入 slide_master 主题色 |
| **SlideSpeak** | 原生支持，粘贴文本即生成品牌化 PPT |
| **html-ppt-skill** | Token 直接驱动 CSS 变量 |

---

## 六、实操：给 PPT Agent 写一份 DESIGN.md

10 分钟写出一份可用的文件：

```text
1. 定底色:    Background: #FFFFFF. Cards: #F5F7FA.
2. 选双字体:  Headings: 'Inter' bold 32-48px. Body: 'Inter' regular 14-16px.
3. 指派强调色: Accent #2563EB → 关键数字 + 活动柱 + 链接，别处不用。
4. 设标志元素: 每节开头：大号数字（强调色）+ 细横线（标题下）。
5. 定图表规则: 柱状图：浅灰柱 + 关键柱用强调色，值直标，去网格线去图例。
6. 列避雷清单: 严禁：渐变、阴影、>2 种强调色、clip-art、>4px 圆角、整句 bullet。
```

**测试方法**：先写进 prompt 生成 1 页 → 对照避雷清单 → 收紧 → 再跑完整 PPT。

---

## 七、模型版本说明

⚠️ 本文仓库 Star 数与 Stars 数据**以发布时为准**。AI Agent 领域迭代极快，主流工具（ppt-master / OfficeCLI / markitdown / DESIGN.md 等）的版本号、API 与生态位置可能在 3–6 个月内发生显著变化。引用前请以官方仓库最新 release 为准。
