---
title: 706 智囊团技能树（中）：M4 工作流与 M5 分支
date: 2026-09-02 00:00:00
description: 706 智囊团技能树（中篇）：M4 三类工作流详解（调度监控 / 业务自动化 / IM 机器人）+ M5 七大分支路线（Skill 产品化 / 工作流 SaaS / RAG 知识库 / AI 应用 / Agent 系统 / 模型算法 / 多模态内容 / OPC 出海）。
series:
  name: 706-skill-tree
  index: 2
  total: 3
categories:
  - notes
tags:
  - 706
  - 技能树
  - 工作流
  - AI 项目
  - 分支选择
---

（上）篇讲了 M1-M6 主里程碑。本篇（中）讲 M4 三类工作流 + M5 七大分支——这是技能树从"必修"到"选修"的转折点。

## 一、M4 三类工作流详解

M4 是"工作流搭建者"里程碑，要求**完成任一类工作流**作为通关。三类分别是：调度监控类、业务自动化类、IM 机器人类。

### 1.1 调度监控类

**典型场景**：定时任务 + 监控 + 报警

**例子**：
- 每天 9 点拉取销售数据 → 写入数据库 → 异常时报警
- 每小时检查 API 状态码 → 不正常就飞书通知
- 每天凌晨清理临时文件 → 上传归档到 OSS

**推荐工具**：
- **n8n**（开源 / 自托管）
- **Airflow**（Python 生态 / 大规模 DAG）
- **Dagster**（现代 / 强类型）
- **腾讯轻联**（国内 / 简单）

**实战案例**（每天 9 点跑）：

```yaml
# daily_sales_report.yml
name: 每日销售报告
schedule: "0 9 * * *"
steps:
  - id: fetch
    type: http
    url: "https://api.example.com/sales/yesterday"
  - id: save
    type: postgres
    query: "INSERT INTO sales (...) VALUES (...)"
  - id: notify
    type: feishu
    webhook: "https://open.feishu.cn/..."
    condition: "sales.amount < threshold"
```

**M4 通关标志**：**跑 1 个月的 cron 工作流**（能扛住节假日 / 异常 / 重试）

### 1.2 业务自动化类

**典型场景**：触发 → 处理 → 通知

**例子**：
- 收到发票 PDF → OCR → 入账 → 通知财务
- GitHub PR 合并 → 自动发版到测试环境
- 表单提交 → 自动邮件确认 + CRM 入库

**推荐工具**：
- **n8n / Dify**（可视化）
- **Zapier / Make**（海外 / 商业）
- **腾讯轻联**（国内 / 商业）

**实战案例**（GitHub 自动化）：

```yaml
# github_pr_workflow.yml
trigger: github.pull_request.merged
steps:
  - name: deploy_test
    command: "kubectl apply -f deploy/test.yaml"
  - name: notify
    feishu:
      message: "PR #${pr.number} merged, deployed to test"
```

**M4 通关标志**：**1 个跑 1 个月的业务自动化流**（节省每周 ≥ 2 小时人工）

### 1.3 IM 机器人类

**典型场景**：飞书 / 钉钉 / 微信 + 自动化

**例子**：
- 群里 @ 机器人查订单 / 查库存
- 机器人定时推送日报
- AI 客服接入 IM

**推荐工具**：
- **飞书 / 钉钉 / 微信** 自带机器人 API
- **扣子（Coze）**（可视化）
- **Dify**（可视化 + AI 集成）
- **OpenClaw**（agent + IM）

**实战案例**（飞书机器人）：

```python
# feishu_bot.py
from lark_oapi import LarkClient

@bot.on_message("/查订单")
async def query_order(event):
    order_id = event.text.split()[-1]
    result = await db.query(f"SELECT * FROM orders WHERE id={order_id}")
    return f"订单 {order_id}：{result.status}，金额 {result.amount}"

# 启动
bot.start()
```

**M4 通关标志**：**1 个 IM 机器人跑 1 个月**（每周 ≥ 10 次使用）

## 二、M4 三类工作流对比

| 维度 | 调度监控 | 业务自动化 | IM 机器人 |
|---|---|---|---|
| 触发 | 定时 | 事件 | 消息 / 命令 |
| 处理 | 数据 + 报警 | 业务逻辑 | 响应 + 交互 |
| 价值 | 节省监控时间 | 节省人工操作 | 提升沟通效率 |
| 学习难度 | 中 | 中高 | 中 |
| 工具 | n8n / Airflow | n8n / Zapier | Coze / 自建 |
| 复用度 | 中 | 中 | 高 |

**3 类都做**的社群 = 完整的工作流能力。**只做 1 类**也能通关 M4。

## 三、M5 七大分支详解

M5 是"AI 项目开发者"——必须**选一个方向**深耕。7 大分支任选一：

### 3.1 Skill 产品化

**做什么**：把可复用 Skill 做成可卖产品

**代表场景**：
- 「公众号 10w+ 写作 Skill」¥999/份
- 「财务报表分析 Skill」¥4999/份
- 「学术论文综述 Skill」¥299/份

**关键技能**：
- Skill 设计（单一职责 / 通用性）
- 文档（README / 演示 / 案例）
- 分发（GitHub / Skill 商店）

**M5 通关**：**1 个 Skill 在公开渠道被 5+ 用户付费使用**

### 3.2 工作流 SaaS

**做什么**：把工作流做成 SaaS 卖企业

**代表场景**：
- 「电商客服自动回复」SaaS
- 「周报自动生成」SaaS
- 「简历自动筛选」SaaS

**关键技能**：
- 工作流设计（用户痛点 → 自动化方案）
- 多租户架构（数据隔离 + 计费）
- 销售（BD + 客服）

**M5 通关**：**1 个 SaaS Demo + 1 个付费用户**

### 3.3 RAG 知识库

**做什么**：企业知识库 + 检索增强生成

**代表场景**：
- 律所案件知识库
- 医院病历问答
- 制造企业产品手册问答

**关键技能**：
- 数据清洗 / 分块 / embedding
- 向量库（Milvus / Qdrant / pgvector）
- 检索优化（BM25 / 混合检索 / rerank）
- 评测（召回率 / 准确率）

**M5 通关**：**1 个企业级 RAG Demo + 100 条真实问答测试集**

### 3.4 AI 应用开发

**做什么**：完整 App + 前端

**代表场景**：
- AI 笔记 App
- AI 翻译 App
- AI 客服 SaaS

**关键技能**：
- 前端（Vue / React）
- 后端（Node.js / Python）
- AI 集成（MCP / API）
- 上线（部署 / 监控）

**M5 通关**：**1 个完整 Web App + 100 注册用户**

### 3.5 Agent 系统

**做什么**：复杂多 Agent 协作

**代表场景**：
- 自动化办公（写文档 + 审核 + 发送）
- 软件开发（需求 → 设计 → 编码 → 测试）
- 科学研究（文献调研 + 实验设计 + 数据分析）

**关键技能**：
- Agent 框架（LangGraph / CrewAI / OpenClaw）
- 多 Agent 协作（消息传递 / 任务分配）
- 错误处理（Agent 会失败）

**M5 通关**：**1 个多 Agent 系统 Demo + 1 个实际任务跑通**

### 3.6 模型与算法

**做什么**：微调 / 训练 / 评测

**代表场景**：
- 行业大模型微调（医疗 / 法律 / 金融）
- 模型蒸馏（把大模型能力给小模型）
- 评测体系（业务指标 + 通用指标）

**关键技能**：
- 数据准备（清洗 / 标注）
- 训练框架（Transformers / PEFT / LLaMA-Factory）
- 评测（lm-evaluation-harness / 自建）

**M5 通关**：**1 个微调模型在 1 个业务场景比基线提升 10%+**

### 3.7 多模态内容生产

**做什么**：AI 视频 / 图像 / 音频

**代表场景**：
- AI 短视频（脚本 + 配音 + 剪辑）
- AI 图像（海报 / 头像 / 商品图）
- AI 音乐（BGM / 配音）

**关键技能**：
- 文生图（Midjourney / Stable Diffusion）
- 文生视频（Runway / Sora / 可灵）
- 文生音（Suno / Udio）
- 工作流（ComfyUI / Coze）

**M5 通关**：**1 个完整 AI 内容流水线 + 100 个作品**

### 3.8 OPC 出海商业化

**做什么**：一人公司 + 海外市场

**代表场景**：
- Indie Hacker 套现
- 海外 SaaS 起步
- AI 工具出海

**关键技能**：
- 海外支付（Stripe / Paddle）
- 海外营销（Twitter / Product Hunt）
- 海外客服（Intercom）

**M5 通关**：**1 个海外产品 + $100 MRR**

## 四、7 大分支对比

| 分支 | 现金流 | 难度 | 适用人群 |
|---|---|---|---|
| Skill 产品化 | 中 | 低 | 副业 / 内容创作者 |
| 工作流 SaaS | 高 | 中 | 创业者 |
| RAG 知识库 | 高 | 中 | 企业服务者 |
| AI 应用开发 | 中 | 高 | 全栈开发者 |
| Agent 系统 | 高 | 高 | AI 工程师 |
| 模型与算法 | 中 | 高 | 研究员 |
| 多模态内容 | 中 | 中 | 创作者 |
| OPC 出海 | 中 | 中 | 独立开发者 |

## 五、3 条选分支建议

### 5.1 看自己过去的经验

- 写过文章 → Skill 产品化
- 搭过自动化 → 工作流 SaaS
- 建过网站 → AI 应用
- 搞过 ML → 模型与算法

### 5.2 看市场需求

- B 端付费意愿强 → RAG / 工作流 SaaS
- C 端流量大 → AI 应用 / 多模态
- 副业试水 → Skill 产品化

### 5.3 选 1 个深耕，不并行

- ❌ 同时做 3 个方向 = 啥都不精
- ✅ 选 1 个方向，6 个月做透

## 六、本文 + 后续

- （上）M1-M6 主里程碑（已写）
- （中）M4 三类工作流 + M5 七大分支（本文）
- （下）M7-M10 企业岗位并行 + 实际应用

---

> **M4-M5 核心洞察**：**M4 学"工作流"是工程化基础，M5 选"分支"是职业化方向**。3 类工作流任意一类都通关，7 大分支任选一都达标——**没有"正确的选择"，只有"你的选择"**。下一阶段（M6+）再做技术深化和企业级能力。