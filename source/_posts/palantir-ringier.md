---
title: Ringier 新闻编辑室
date: 2026-10-08 00:00:00
description: 瑞士最大媒体集团 Ringier 与 Palantir 自 2019 年合作，把 Foundry 落地新闻编辑室 Blick.ch，85% 编辑每天使用，揭示非技术用户直接消费 Ontology 的关键范式。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - Ringier
  - 媒体数字化
  - Foundry
  - 本体论
---

## 一、业务背景：瑞士最大媒体集团的转型

Ringier 是瑞士最大的私营媒体集团，旗下拥有 Blick、Blick.ch 等核心刊物。广告被 Google、Meta 蚕食、读者付费意愿下滑、编辑部人手有限——"高质量新闻"在瑞士同样面临商业模式危机（来源：[palantir.com](https://www.palantir.com/impact/ringier/)）。

2019 年，Ringier 与 Palantir 签约，把 Foundry 部署为"编辑部 + 广告部 + 订阅运营"共用的操作系统。**85% 编辑每天使用**——2021 年续约时披露的采用率，也是 Palantir 在媒体行业最有价值的实证之一（来源：[Nasdaq 续约新闻](https://www.nasdaq.com/press-release/palantir-and-ringier-extend-digital-transformation-partnership-2021-04-20)）。

## 二、核心挑战：编辑部三个长期痛点

### 2.1 数据散落：同一读者跨产品的偏好不可见

不同栏目、平台、广告系统的读者数据散落在各自 BI 报表里——数据团队跑 SQL、出 dashboard，编辑拿到的是"昨天的数据"，而新闻是按小时过期的。"同一读者在新闻 App、订阅页、广告落地页的真实偏好"，在分立报表里根本无法回答。Ringier 把这个痛点浓缩为：local newsrooms need to connect their readers with high-quality content。

### 2.2 编辑能力：90% 编辑无 SQL 背景

新闻编辑部的核心能力是写稿、采访、判断选题。SQL、数据建模、A/B 测试——这些不是编辑的强项，也不是他们愿意学的技能。如果 Ontology 必须由数据团队运营、业务团队继续用 Excel，那这套系统对编辑就是透明的。

Ringier 的解法不是培训编辑学 SQL，而是把 Foundry 的界面做成"打开就能用"的低门槛 Workshop，让编辑用业务术语而非 SQL 表达需求。**85% 编辑每天使用**这个数字本身就是"非技术用户能否直接消费 Ontology"的关键指标。

### 2.3 KPI 错位：编辑部与广告部目标分离

编辑部看 read time、订阅转化、内容忠诚度；广告部看 reach、CPM、fill rate。两边的 KPI 在 Excel 里独立计算，同一个读者会被解读成"低价值读者"（广告侧）与"高忠诚读者"（编辑侧）。

这不仅是统计问题，更是商业模式问题——如果编辑部与广告部继续在 KPI 上分裂，"内容+商业双轮驱动"就只是 PPT 上的口号。

## 三、Palantir 解决方案：编辑部操作系统

### 3.1 本体映射：把读者、内容、广告变成 Object

Ringier 把读者、文章、广告位、订阅、栏目映射到 Foundry Ontology 的 Object Type（来源：[Elementum](https://www.elementum.ai/blog/palantir-ontology-explained)）：

- **Reader / Article Object**：用户级与稿件级聚合，承载订阅状态、阅读偏好、读者画像
- **Subscription / AdInventory Object**：订阅产品、广告位资源
- **Section Object**：栏目维度，承担权限边界

行为通过 Link Type 建模：reads、clicks、subscribes、converts。编辑的日常决策——分配选题、调整订阅价格、调整广告位——建模为 Action Type，直接作用于 Object。

### 3.2 双层治理

Kinetic 层承担 ETL 角色——把不同栏目系统、广告投放系统、订阅系统的实时数据汇入 Ontology；Dynamic 层承担权限管理——"Only editor of X section can modify Article objects of X section"。

这套治理让 Ringier 不再依赖独立 BI 报表，所有决策直接作用于 Object 上的 Action。Nasdaq 续约新闻明确指出，**granular access controls**（细粒度访问控制）是说服编辑部采纳这套系统的合规关键（来源：[Nasdaq](https://www.nasdaq.com/press-release/palantir-and-ringier-extend-digital-transformation-partnership-2021-04-20)）。

### 3.3 关键引语

Katia Murmann Amirhosseini（Head Digital & Product Blick-Group and Editor-in-Chief Blick.ch）的引语直指核心：

> "Because we see all data in one place, we are able to better serve and to inform our readers... We are able to improve our content and increase reach, we also were able to increase our revenue, which is very important for the funding of quality journalism."

数据统一、服务读者、商业可持续——编辑部操作系统必须同时回答的三个问题（来源：[palantir.com](https://www.palantir.com/impact/ringier/)）。

## 四、可借鉴的开发范式

### 4.1 范式一：85% 编辑每天使用 = 非技术用户 Ontology 标杆

很多企业卡在"数据团队用 Ontology，业务团队用 Excel"。Ringier 提供反例——**85% 的非技术编辑每天使用 Foundry**。把"采用率"作为核心 KPI，而不是"模型数量"或"数据表数量"，这本身就是对企业 Ontology 成熟度的重新定义。

### 4.2 范式二：编辑部 + 广告部共用 Ontology

让商业指标（reach、revenue）与内容指标（readability、loyalty）天然融合，是"内容+商业双轮驱动"公司最稀缺的范式。两部门共用同一套 Ontology，KPI 错位自然消失。这对电商、内容平台、SaaS 的 marketing 与 sales 联动都是同类问题。

### 4.3 范式三：8 年长期粘性

媒体行业数据形态高度异构（图文、视频、播客、互动），能在这种异构性中存活 8 年的系统本身是企业级数据平台的硬要求。Ringier 案例对希望长期投资数据底座的企业是关键信号。

## 五、启示与边界

### 5.1 可迁移的启示

- **采用率优先于覆盖率**：85% 编辑每天使用，比"接入了多少数据源"更能说明 Ontology 是否真正落地。
- **细粒度权限是合规前提**：编辑部、广告部、订阅运营共用 Ontology 时，权限必须按"业务域"切分，而非按"角色"切分。
- **统一数据视角先于统一 KPI**：先把所有数据在一个 Ontology 里聚合，再用同一套视角反推 KPI。

### 5.2 边界条件

Ringier 的成功有三个隐含条件：**编辑团队规模适中**——Blick.ch 是瑞士顶级数字媒体之一，人均产值足够高才能负担 Ontology 运营成本；**媒体业务相对成熟**——栏目、广告位、订阅产品已成型，Ontology 映射有清晰业务对象可锚定；**管理层长期承诺**——短周期项目无法沉淀这种范式。

85% 的采用率不是部署第一天就能拿到的，它需要 Workshop 级低门槛界面、细粒度权限设计、以及业务团队对 Ontology 的长期共同运营（来源：[palantir.com](https://www.palantir.com/impact/ringier/) + [Elementum](https://www.elementum.ai/blog/palantir-ontology-explained)）。