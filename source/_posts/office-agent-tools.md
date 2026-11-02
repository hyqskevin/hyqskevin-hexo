---
title: AI 操作 Office 工具全景
date: 2026-09-15 00:00:00
description: 盘点 2026 年能用 Agent 操作 Word/Excel/PPT 的开源工具与商业产品，按原生 PPTX、HTML 幻灯片、实时接口三条路径分类，给出 OfficeCLI、ppt-master、MCP 等典型代表与按场景的选型决策树。
categories:
  - AI
  - 工具
tags:
  - Agent
  - Office
  - PPT
  - MCP
  - 自动化
  - 开源
---

最近把「Agent 能不能像操作代码一样操作 Office」这件事彻底梳理了一遍。结论很乐观：2026 年已经不是"能不能"的问题，而是"选哪条路径"的问题。写代码早就能 Vibe Coding 了——自然语言驱动、边聊边改；但办公场景里，绝大多数人还在手动复制粘贴、逐页调格式。于是"Vibe Officing"成了这一年的热门话题：能不能把 Agent 接到 Word/Excel/PPT 上，让"做个周报""改一版报价单""把这份文档变成 20 页 PPT"变成一句话的事。

这篇把市面上的开源工具、商业产品和对应的技术路径归并成一张地图，方便按自己的场景选型。需要说明：源稿整理自 IMA 知识库「Agent 前沿仓库」与 Exa Web Search，原始清单里光 PPT 相关文章就有 8 篇、发现的工具/项目超过 18 个，本文不逐条照抄，而是按类别归并，只保留值得点开看的关键仓库与可复用的框架。

![Office Agent 工具地图总览](https://hyqskevin.github.io/pic/office/office-agent-map.png)

## 一、PPT Agent 工具生态

PPT 是 Agent 操作 Office 里打得最热的一块。按"最终交付物"和"技术路径"可以分成三类，选对路径比选对单点工具更重要。

### 1.1 原生 PPTX 生成（可二次编辑，商务交付首选）

核心特征：最终输出是 `.pptx`，文字、形状、图表都是 PowerPoint 原生对象，客户拿到后能在 PowerPoint 里继续改。这是商务交付最稳妥的选择。

按技术子路径又可分为五种：

- **SVG → DrawingML**：LLM 先生成 SVG，再转成 PPT 原生形状。代表是 `ppt-master`（约 30K Star），它从任意文档生成真正可编辑的 PPTX，支持原生形状、动画、演讲者备注、配音，还支持自定义模板。适合报告转 PPT、杂志风、模板复刻。
- **Python-pptx 直接写 OOXML**：结构化数据 → python-pptx → PPTX。中科院自动化所的 `PPTAgent`（4.7K Star，EMNLP 2025）走的是反射式生成路线，先分析再生成；`Office-PowerPoint-MCP-Server`（1.8K Star）也是基于 python-pptx，提供 32 个工具，支持模板、图表、动画、演讲者备注。适合数据报告、图表幻灯片、批量生成。
- **PptxGenJS / OfficeCLI**：JS/C# 直接生成 PPTX。PptxGenJS（5.8K Star）可在 Node/React/浏览器里用 JavaScript 生成专业 PPTX；OfficeCLI 单二进制、无需安装 Office。适合 Web/CI 集成、跨平台。
- **Markdown → PPTX**：Markdown 作为单一真相源，渲染成可编辑 PPTX。适合技术文档、确定性报告。
- **模板填充（Template Fill）**：分析模板母版 → 替换占位符。代表是 `pptx-automizer`、BrandDocs。必须先有高质量模板，但一旦有就能企业级批量出稿。

### 1.2 HTML/Web 幻灯片（视觉表达优先）

核心特征：输出为 HTML 或在线链接，设计感、动画、响应式都更强，最后可导出 PPTX/PDF，但编辑性弱（导出多为图片或截图）。

代表分几路：

- **HTML-first Skill**：LLM 生成 HTML/CSS，浏览器直接打开，适合产品发布、技术演讲、Demo Day。
- **Slidev / reveal.js / Marp**：Markdown 幻灯片框架。Slidev（47K Star）面向开发者，reveal.js（72K Star）是老牌 HTML 演示框架，支持演讲者模式与 PDF 导出。它们的 PPTX 导出本质是截图。
- **Web 应用生成器**：Gamma、Beautiful.ai、PresentationAgent 等在线 SaaS，AI 生成网页卡片，适合快速原型、营销展示，但导出 PPTX 容易布局崩坏。

### 1.3 实时接口驱动（Agent 直接控制 Office）

核心特征：Agent 不生成文件，而是直接操作正在运行的 PowerPoint/Word/Excel。这条路径最适合"改已有文件"和"办公自动化"。

- **COM 自动化 MCP**：`mcp-server-ppt`、`powerpoint-mcp`、`mcp-office` 通过 pywin32 + COM 实时读写打开的文件，适合 Windows 办公自动化，缺点是需要 Windows 且安装 Office。
- **Office Add-in + AI**：`office-agents`（TypeScript，BYOK）是 Word/Excel/PPT 的 Add-ins，内置 AI Chat Panel，支持读写文档与沙盒 Shell；Word GPT Plus 类似。需要在 Office 内 sideload/部署插件。
- **Microsoft 365 Copilot**：官方原生集成，适合 M365 企业环境，缺点是订阅贵、可控性低。

除了 PPT，Excel 与 Word 的 Agent 化同样成熟，只是形态更偏"库 + 脚本"而非独立产品：Excel 侧有 `excelize`（Go，20.7K Star，纯原生读写、流式 API、支持图表公式透视表）、`xlwings`（Python 与 Excel 双向调用，跨 Windows/macOS/Web/Sheets）、`XlsxWriter`（Python 生成 XLSX）；Word 侧有 `python-docx`（5.7K Star）。这些基础库往往是上层 Agent 真正落地的底层依赖——很多 MCP Server 和 CLI 工具本质上就是在它们外面套了一层自然语言接口。

## 二、办公/Agent 工具地图：三条技术路径

把上面散落的工具按"Agent 怎么触达 Office"抽象出来，其实是三条清晰的技术路径，对应不同的团队能力和使用场景。

### 2.1 Office.js / Add-in 路径

通过 Office 官方 JS API 在文档内运行脚本，典型如 `AutoOffice`（GitHub: Sivan22/autoOffice）做 Office.js 代码生成与执行，`office-agents` 做 Add-in + AI Chat Panel。优点是原生、安全、可上架商店；缺点是开发成本偏高，需要部署插件。适合"在 Office 里直接协作"的团队场景。

### 2.2 MCP 路径

把 Office 操作暴露成 MCP Server，让任意支持 MCP 的 Agent（Claude、Cursor、Codex 等）直接调用。这一类的仓库非常多：

| 项目 | 语言 | Stars | 说明 |
|------|------|-------|------|
| Office-PowerPoint-MCP-Server | Python | 1.8K | 基于 python-pptx，32 个工具 |
| mcp-server-ppt | Python | — | 通过 COM API 控制 PowerPoint |
| mcp-ms-office-documents | Python | 31 | Docker 化，生成 PPT/Word/Excel/邮件/XML |
| powerpoint-mcp | Python | — | 实时编辑已打开的 Office 文档 |
| OfficeMCP | C# | 104 | 自然语言创建/读写 Office 与 PDF |

MCP 路径的优势是"即插即用"，Agent 侧几乎零改动；缺点是 Server 质量参差，Star 数普遍还不高，选的时候要看维护活跃度。

### 2.3 CLI 路径

把 Office 操作封装成命令行，Agent 通过调用命令完成读写改。最典型的是 **OfficeCLI**（C#，8.3K Star）：单二进制、无需安装 Office，支持 DOCX/XLSX/PPTX 的读写改与 HTML/PNG 渲染，专为 AI Agent 设计。还有 `python-office`（1.3K Star），中文世界最流行的 Python 办公自动化库，73 个 Skill 覆盖 PDF/Word/Excel/PPT/微信/邮件。

CLI 路径的好处是和 Agent 的工作流天然契合——命令输入输出都是文本，最容易被 LLM 编排；坏处是需要本地有运行环境。配套还有微软开源的 `markitdown`（151K Star），把 PDF/PPT/Word/Excel/图片/音频等转成 Markdown，喂给 LLM 特别友好。

```bash
# OfficeCLI：一行命令把 PPTX 渲染成图片供 Agent 读取
officecli render report.pptx --to png --out ./slides/

# markitdown：把任意 Office 文档转成 LLM 友好的 Markdown
pip install markitdown
markitdown budget.xlsx > budget.md
```

## 三、三类典型代表（项目案例）

光看地图不够，下面挑三类最有代表性的项目，看它们各自怎么落地。

### 3.1 通用套件：OfficeCLI + markitdown

如果你的目标是"让 Agent 在一个统一入口里处理各种 Office 文档"，这一对组合最省心。`markitdown` 负责把文档"读进来"变成 Markdown，LLM 在 Markdown 上做理解和改写；`OfficeCLI` 负责把内容"写出去"成 DOCX/XLSX/PPTX，还能把成品渲染成 HTML/PNG 供模型回看。两者都是单依赖、跨平台，几乎不挑运行环境，适合做 Agent 的文档 I/O 层。实际编排时，常见模式是「markitdown 抽取 → LLM 改写 → OfficeCLI 生成」，全程文本进出，最容易让 LLM 稳定可靠地驱动。

### 3.2 PPT 专精：ppt-master + PPTAgent

如果 PPT 是核心交付物，优先看这两个。`ppt-master` 走 SVG→DrawingML，产出的是真·可编辑 PPTX，设计自由度最高，还能带上动画、演讲者备注和配音，适合报告、杂志风、模板复刻；`PPTAgent` 是学术出身的反射式生成 Agent，先分析参考 PPT 的结构与风格，再生成新内容，支持模板生成与自由生成两种模式。前者偏工程可用、落地快，后者偏研究前沿、结构化强，二者可以互补：用 PPTAgent 定骨架，用 ppt-master 做视觉精修。

```text
典型流水线：
文档/大纲 → markitdown 转 Markdown → LLM 规划结构
          → ppt-master 生成 SVG → DrawingML → 可编辑 .pptx
```

### 3.3 实时自动化：COM 自动化 MCP

如果你的痛点是"每天要改一堆已经存在的 Excel/PPT"，那生成类工具帮不上忙，需要的是直接控制正在运行的 Office。`mcp-server-ppt` 这类 COM 自动化 MCP 让 Agent 实时读写打开的文件，配合 Claude / ChatGPT 即可做「打开 → 改数 → 保存」的闭环。更进一步，`Use-It Agent`（TypeScript）这类桌面原生 Agent 通过 COM/API 直接操作 PowerPoint/Word/Excel，甚至能延伸到 WPS、AutoCAD。代价是锁定 Windows + 已安装 Office，跨平台能力弱，更适合固定工位的企业办公场景。

## 四、选型决策树（按场景）

把前面所有路径收敛成一张对照表，照着需求对号入座即可。

### 4.1 需求 → 路径 对照

| 你的需求 | 推荐路径 | 代表工具 |
|----------|----------|----------|
| 给客户可编辑的 `.pptx` | 原生 PPTX 生成 | ppt-master、PPTAgent、OfficeCLI、PptxGenJS |
| 快速出视觉惊艳的网页演示 | HTML/Web 幻灯片 | Slidev、reveal.js、HTML-first Skill |
| 数据/报告批量转幻灯片 | Markdown→PPTX 或模板填充 | agent4ppt、BrandDocs、pptx-automizer |
| 直接修改已打开的 Office 文件 | 实时 COM 自动化 | mcp-server-ppt、powerpoint-mcp |
| 企业内部固定模板批量出稿 | 模板填充 | pptx-automizer、BrandDocs |
| 只想把文档转 Markdown 喂 LLM | 文档转 Markdown | markitdown |

一句话总结：**要交付可编辑文件就走原生 PPTX，要视觉冲击力就走 HTML，要改已有文件就走实时接口，要把文档喂给模型就走 markitdown。**

落地时还有两个常见坑值得提前说：第一，别迷信"一键生成"，Agent 第一次产出的 PPT 往往仍需要人工过一遍避雷清单（配色、字体、对齐），把 DESIGN.md 准备好能省掉一半返工；第二，路径选择要匹配团队能力——没有 Windows 环境就别选 COM 自动化，没有高质量品牌模板就别硬上模板填充，否则工具反而成为负担。

### 4.2 设计一致性：DESIGN.md 生态

Agent 生成 PPT/UI 最大的短板不是代码能力，而是"不懂设计"——不给约束，模型输出永远是同一套"AI 味"（柔光阴影、四五个配色、圆角卡片）。2026 年最大的进展是 Google Labs 开源了 **DESIGN.md** 格式规范（仓库 `google-labs-code/design.md`，约 24K Star，Apache-2.0），相当于给 AI 一份它读得懂的设计文档。

它采用双层结构：YAML front matter 放机器可读的 Design Token（颜色、字号、间距），Markdown body 放人可读的"为什么"。配套生态已经成型：

- **designtoken.md**：在线生成器，产出 150+ 行富 Token 文件，给 Agent "完整的品牌语言"。
- **Awesome DESIGN.md**（`VoltAgent/awesome-design-md`，约 95K Star）：73 套现成品牌设计，复制粘贴即用。
- **DESIGN.md for Slides**：针对幻灯片的配色+字体+图表+避雷清单。

给 PPT Agent 写一份 DESIGN.md，基本就是在定底色、选双字体、指派单一强调色、设标志元素、定图表规则、列避雷清单这六步，10 分钟就能写出一个可用版本，再对照避雷清单（严禁渐变、阴影、多强调色、clip-art、大圆角）迭代即可。

实际接入时，不同生成工具消费 DESIGN.md 的方式略有差异：`ppt-master` 的 SVG→DrawingML 路径能直接消费其中的配色与字体 Token；`PptxGenJS` 把 colors/typography 映射到 JS 调用的 color/fontFace；`python-pptx` 读取后注入 slide_master 的主题色与字体；HTML-first 的 Skill 则往往直接用 DESIGN.md 驱动 CSS 变量。换句话说，**一份设计文档可以同时喂给多条路径，保证"生成的 PPT 长得像一家人"**。这也是 2026 年 Agent 办公从"能用"走向"可控、可复现"的关键一步。

```yaml
# 一份极简的幻灯片 DESIGN.md 片段
colors:
  background: "#FFFFFF"
  card: "#F5F7FA"
  accent: "#2563EB"   # 关键数字 + 活动柱 + 链接，别处不用
typography:
  heading: "Inter, bold 32-48px"
  body: "Inter, regular 14-16px"
rules:
  - 严禁渐变、阴影、超过 2 种强调色
  - 禁用 clip-art 图标与大于 4px 圆角
```

整体看，2026 年的 Agent 办公已经形成了清晰的分工：底层是 excelize / python-docx / python-pptx 这类基础库，中间是 OfficeCLI、markitdown 这类统一 I/O 层，上层是 MCP Server 与各类 PPT 生成 Skill，再往上则是 DESIGN.md 这样的"设计约束层"。选工具时建议从"交付物形态"和"运行环境"两个维度先定路径，再在路径内挑活跃度高、文档完整的仓库，而不是被单个炫目的 demo 牵着走。等路径跑通、DESIGN.md 沉淀好，Vibe Officing 才真正从口号变成日常。

## 模型版本说明

> ⚠️ 本文涉及的模型能力（如千问 PPT Agent、Claude for Microsoft 365、Microsoft 365 Copilot 等）及其 API 行为**以发布时为准**，请在实际使用前查阅对应厂商的最新文档与定价。

## 参考链接

- OfficeCLI：<https://github.com/iOfficeAI/OfficeCLI>
- ppt-master：<https://github.com/hugohe3/ppt-master>
- PPTAgent：<https://github.com/icip-cas/pptagent>
- markitdown：<https://github.com/microsoft/markitdown>
- Office-PowerPoint-MCP-Server：<https://github.com/GongRzhe/Office-PowerPoint-MCP-Server>
- DESIGN.md（Google Labs）：<https://github.com/google-labs-code/design.md>
- Awesome DESIGN.md：<https://github.com/VoltAgent/awesome-design-md>
- 相关实践文章（微信，公开可访问）：<https://mp.weixin.qq.com/s/GXjjlxpIJ604HVCCZJkUBA>
- 相关实践文章（微信，公开可访问）：<https://mp.weixin.qq.com/s/rGoYnUcBRkfRKQPbIaawyg>
