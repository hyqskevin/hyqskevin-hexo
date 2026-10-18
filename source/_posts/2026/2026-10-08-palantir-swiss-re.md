---
title: Swiss Re 本体论
date: 2026-10-08 00:00:00
description: 全球第二大再保险公司 Swiss Re 用 Foundry 把气候、供应链、流行病、承保数据汇成单一分析底座，6 PB 数据、200+ 项目、1/3 员工活跃使用，把报告时间从天级压到分钟级，Nucleus Research 测算 ROI 170%、回收期 7.3 个月，是再保险行业跨业务线共用 Ontology 的标杆案例。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - Swiss Re
  - 再保险
  - Analytical Data Models
  - 单一数据底座
  - 金融保险
---

全球第二大再保险公司 Swiss Re 与 Palantir 合作，把 Foundry 部署为覆盖寿险、财产险、健康险多条业务线的"单一分析数据底座（Single Analytical Data Foundation）"。6 PB 数据、200+ 项目并行运行，三分之一员工、一半承保人每日活跃使用，报告周期从"天级"压到"分钟级"，独立第三方 Nucleus Research 测算 ROI 170%、回收期 7.3 个月。这是再保险行业跨业务线共用 Ontology 的标杆案例，也是把"合规 + lineage + 多域治理"三件最难的事统一解决的可借鉴范式。

> 主源：[palantir.com/impact/swiss-re](https://www.palantir.com/impact/swiss-re/)
> 第三方测算：[Nucleus Research: ROI Case Study — Palantir at Swiss Re](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re)
> 扩展材料：[Palantir Blog: Scaling Data Operations with Foundry](https://blog.palantir.com/swiss-re-palantir-scaling-data-operations-with-foundry-35d2e167de91)

## 一、业务背景：再保险航母与"理解风险"的使命

### 1.1 Swiss Re 的行业地位

Swiss Re（瑞士再保险）成立于 1863 年，是全球前三大再保险公司，资产规模数千亿美元。它与 Munich Re、Berkshire Hathaway Reinsurance Group 并称"再保三巨头"，业务横跨寿险、财产险、健康险再保三大板块。"再保险"通俗讲是"保险公司的保险"——为直保公司提供风险转移、定价、组合分散方案，本身不直接面对终端消费者，而是面向保险公司、政府、企业大客户。这意味着再保公司的核心能力，不是销售能力，而是"理解风险"的能力。

150 年来 Swiss Re 靠精算师、风险建模师、承保人三类专业角色驱动业务——他们以模型和经验把世界的不确定性量化成保费、准备金、赔款、再保结构。这种"以人为核心"的风险评估体系，是 Swiss Re 在 19 世纪、20 世纪立于不败之地的基础。

### 1.2 相互关联风险时代的到来

进入 21 世纪 20 年代，传统建模方法开始失灵。气候变化让极端天气频次与强度非线性上升、新冠疫情揭示流行病对全球供应链的级联冲击、网络攻击让"无形风险"具备千亿美元级赔付潜力、地缘冲突让能源与粮食市场一夜之间重排。这些"相互关联风险（interconnected risks）"的特征是——单点看每一个都不致命，组合起来却能让再保公司的年度损失放大数倍。

Swiss Re 官方把这一阶段的核心目标提炼为：

> "identify connections between seemingly disparate trends and events, and operationalize these insights"（来源：[palantir.com](https://www.palantir.com/impact/swiss-re/)）

翻译过来：在看似无关的趋势与事件之间识别连接，并把洞察转化为运营决策。"识别 + 操作化"是关键词——这不是一份漂亮的分析师报告，而是要嵌入承保、投资、理赔的日常动作里。

## 二、痛点：整张风险图的现代化

Swiss Re 面对的不是单点数字化，而是"整张风险图的现代化"。具体可拆为四个相互纠缠的难题。

### 2.1 多源异构风险数据缺乏共同语言

气候模型、供应链数据、流行病监控、巨灾模型（catastrophe model）、承保历史、赔款数据库、监管报告——每一类数据都有自己的结构、口径、时效性。传统做法是建一个数据仓库，按主题域分区存储，但这种"贴标签式"的整合方式无法回答跨域关联问题。例如："新冠对东南亚台风赔款的二次影响"这类问题，单一域分析做不到。

### 2.2 四类角色的数据视角完全不一致

精算师关心"未来赔付分布的概率密度"、承保人关心"今天接不接这单"、投资组合经理关心"保费现金流如何在投资端匹配"、数据科学家关心"模型特征怎么构造"。四种视角对"同一份数据"的解读维度不同，单一 BI 报表无法同时满足。

### 2.3 强监管下的"可审计、可追溯"

再保险业务受 Solvency II、各国偿付能力规则、IFRS 17 会计准则的严格约束。任何定价决策、准备金计提、风险敞口计算都必须可审计、可追溯——这条线比一般企业级 BI 高一个量级。

### 2.4 工程层面的规模化难题

Swiss Re 的数据规模超过 6 PB，跨 200+ 项目共享——这不是"找一种工具分析一两个场景"的问题，而是"让全公司所有人、所有项目在统一底座上协作"的工程问题。

四个难题叠加，决定了 Swiss Re 需要的不是 BI 升级、不是数据湖、不是传统数据仓库，而是"数据 + 模型 + 业务应用共用同一底座"的新一代基础设施。

## 三、Palantir 解决方案：Single Analytical Data Foundation

Swiss Re 把 Foundry 部署为"单一分析数据底座"，覆盖**数据集成 + 风险建模 + 业务应用**三层。具体落地分为四个动作。

### 3.1 Analytical Data Models（ADM）：从百万级数据点压成单一真相版本

ADM 是 Swiss Re 案例中最重要的技术细节——把百万级多维数据点（policy、claim、exposure、catastrophe event、counterparty、reinsurance treaty 等）压成精算师、承保人、组合经理共享的"单一真相版本（single source of truth）"。这里的"压"不是简单的 ETL 同步，而是把数据组织为 Foundry Ontology 的对象与关系，并挂载业务规则与计算逻辑。

### 3.2 Climate Risk Score Tool：对内对外双输出

在统一底座之上，Swiss Re 开发了 climate risk score tool，用于在组合层面评估气候变化对不同地理区域、不同险种的影响。这套打分既对内支持承保与组合调整决策，也对外输出给直保客户与大企业——再保公司提供的不只是赔款，而是"风险洞察即服务"。

### 3.3 6 PB 数据、200+ 项目并行运行

整个底座在 6 PB 数据规模上支撑 200+ 并行项目，覆盖集团多个业务域、多个地域子公司、多个再保产品线。这种规模在传统数据仓库方案里基本不可行——只有 Ontology 架构的"对象 + 关系 + 写回"才能在 PB 级数据上做到统一语义。

### 3.4 治理与合规的双重满足

Foundry 的权限治理（who can see what）与 lineage 追溯（where did this number come from）同时满足再保险监管要求。这意味着 Swiss Re 不需要为合规再单独建一套系统——Foundry 本身就是合规的载体。

Ian Haycock（Group CDO）把这一阶段命名为：

> "We like to describe what we're doing with Foundry as becoming a **data-connected company**...This means more innovative solutions and services for our clients, as well as deeper information to steer and drive the business."
> —— Ian Haycock，Group CDO, Swiss Re（来源：[palantir.com](https://www.palantir.com/impact/swiss-re/)）

## 四、本体论如何落地 ⭐

Swiss Re 是 Palantir 在金融保险行业最完整的 Ontology 落地样本，关键映射如下。

### 4.1 Object Type 定义

五类核心 Object Type 覆盖再保业务的核心实体：

```yaml
Policy:                  # 保单
  - id, type(life/p&c/health), insured_amount, premium, inception_date
  - 关联: Portfolio, Reinsurer, Cedent

Claim:                   # 理赔
  - id, policy_id, event_date, payout_amount, status
  - 关联: Policy, CatastropheEvent

RiskExposure:            # 风险敞口
  - id, geographic_region, peril_type, expected_loss, pml
  - 关联: Portfolio, CatastropheEvent

Portfolio:               # 组合
  - id, line_of_business, aggregate_exposure, diversification_score
  - 关联: Policy (一对多), RiskExposure (一对多)

CatastropheEvent:        # 巨灾事件
  - id, type(earthquake/hurricane/wildfire), severity, geographic_footprint
  - 关联: Claim (一对多), RiskExposure (一对多)
```

### 4.2 Link Type 关系链

对象之间的关系链是 Ontology 的"骨架"：

```text
Policy  --belongs_to-->  Portfolio
Claim   --triggers-->    Payout
RiskExposure --aggregates_to--> Portfolio
CatastropheEvent --causes-->  Claim (多对多)
Reinsurer --assumes_share_of--> Portfolio
```

这些关系链让"组合层评估""事件回溯""再保摊赔"三类分析都可以在 Ontology 上直接完成，而不需要重新跑一遍 ETL。

### 4.3 Function / Action 写回

Ontology 的关键不只是"看"，而是"写"——Foundry 在 Swiss Re 案例中支持三类 Action 写回：

- **调整定价**：基于 climate score 与 portfolio exposure 调整下一个保单年度的费率
- **下发承保规则**：把新的风险偏好（risk appetite）即时下发到承保人界面
- **触发理赔工作流**：当 CatastropheEvent 触发时，自动给相关 Claim 推送理赔节点

Action 写回意味着 Foundry 不只是"分析底座"，而是直接参与运营决策的执行系统。

### 4.4 治理边界：Kinetic + Dynamic 双层

Foundry 在 Swiss Re 案例中完整启用了本体论三层（语义、动力、动态）中的两层：

- **Kinetic 层**：负责把 SAP、核心再保系统（core reinsurance systems）、外部 catastrophe models 的数据接入；
- **Dynamic 层**：负责"谁能看哪个 Portfolio 的数据"这种再保级权限——这是再保险合规的硬需求。

### 4.5 差异化：多业务域共治的运营经验

Palantir 官方博客披露 Swiss Re 在 Foundry 上支撑了"two dozen business domains、thousands of inbound data feeds、quarterly half of workforce 用户"（来源：[Palantir Blog](https://blog.palantir.com/swiss-re-palantir-scaling-data-operations-with-foundry-35d2e167de91)）。这意味着 Swiss Re 不是单业务域的"垂直项目"，而是把 Foundry 当作"集团级数字孪生"长期运营——24 个业务域、数千个数据源、季度活跃用户覆盖集团一半员工。

这种规模的多业务域共治有几个不易被外人看到的运营细节：第一，每个业务域有自己的 steward（数据管家），负责本域的对象定义、关系链、计算规则的演化；第二，跨业务域的对象与关系必须由集团级 ontology council 评审后才能发布，避免重复定义与口径冲突；第三，Foundry 的 lineage 不仅记录数据来源，还记录"对象定义变更历史"——这意味着任何 portfolio 数字都能溯源到当时的计算逻辑版本。这种运营成熟度，是其他再保客户或保险公司无法在短期内复制的护城河。

## 五、可借鉴的开发范式

Swiss Re 案例对金融保险行业的本体论落地有四条可迁移范式。

### 5.1 保险/再保险可建模为 ontology 价值链

保险/再保业务天然适合 Ontology——核心实体（Policy / Claim / Exposure / Portfolio / CatastropheEvent）相对稳定，关系链可枚举，监管框架清晰。第三方咨询机构 BD Emerson 在另一份再保案例中给出了可复用的蓝图：

> "securities / issuers / portfolios / positions / holdings" 五类 Object + 关系链（来源：[BD Emerson Reinsurer 案例](https://www.bdemerson.com/case-studies/reinsurer-palantir-foundry-investment-analytics)）

这种"五类对象 + 关系链"的可复用蓝图，使保险/再保类 SaaS 厂商可以基于 Palantir 平台快速搭建垂直产品。

### 5.2 数据 + 模型 + 业务应用共用同一底座

Swiss Re 把数据集成、风险建模、组合分析、承保决策都放在 Foundry 同一个底座上。这与传统"数据湖 + 建模平台 + BI 工具 + 业务系统"四层堆叠的架构形成鲜明对比——后者每一层都有自己的 schema 与权限模型，跨层数据流转需要 ETL 重新对账。Foundry 的 Ontology 让"数据 + 模型 + 业务应用"在同一个语义层闭环。

### 5.3 合规 + lineage 内置

再保险/银行业是合规最严苛的行业。Swiss Re 用 Foundry 的 kinetic + dynamic 双层权限、lineage 追溯、对象级 audit log 同时满足了 Solvency II、IFRS 17、各国监管的多重要求——这是单一数据底座"原生合规"的代表案例，对国内银行、保险、券商的合规改造有直接借鉴意义。

### 5.4 第三方独立测算的 ROI 是可信证据

Nucleus Research 给出的 **170% ROI + 7.3 个月回本期**，是少有的"独立第三方测算"的可信数据。在企业级软件采购中，"厂商自报数据"的可信度普遍打折，但 Nucleus 这种第三方咨询机构的测算结果往往被 CFO 与 CIO 直接引用。

## 六、关键数字与引语

### 6.1 关键指标表

| 指标 | 数值 | 来源 |
|---|---|---|
| ROI | 170% | [Nucleus Research](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) |
| 回本期 | 7.3 个月 | [Nucleus Research](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) |
| 报告时间压减 | 70-80% | [Nucleus Research](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) |
| 承保人效率提升 | 30% | [Nucleus Research](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) |
| 数据工程师效率提升 | 50% | [Nucleus Research](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) |
| 数据规模 | 6 PB | [palantir.com](https://www.palantir.com/impact/swiss-re/) |
| 并行项目数 | 200+ | [palantir.com](https://www.palantir.com/impact/swiss-re/) |
| 员工活跃度 | 1/3 全员 / 1/2 承保人 | [palantir.com](https://www.palantir.com/impact/swiss-re/) |
| 报告周期 | 天级 → 分钟级 | [palantir.com](https://www.palantir.com/impact/swiss-re/) |
| 业务域覆盖 | 24 个 | [Palantir Blog](https://blog.palantir.com/swiss-re-palantir-scaling-data-operations-with-foundry-35d2e167de91) |

### 6.2 关键引语

> "We like to describe what we're doing with Foundry as becoming a data-connected company...This means more innovative solutions and services for our clients, as well as deeper information to steer and drive the business."
> —— Ian Haycock，Group CDO, Swiss Re（来源：[palantir.com](https://www.palantir.com/impact/swiss-re/)）

## 七、借鉴启示

Swiss Re 案例对国内金融保险机构、监管科技厂商、再保类创业项目有四条可迁移启示：

1. **"多业务线共用 Ontology"是金融行业最有规模效应的范式**——同一集团下寿险、财险、健康险、再保、资管多条业务线天然可以共用 Policy / Claim / Exposure / Portfolio 这五类对象，建一次可省多次。Swiss Re 案例证明：跨业务线 Ontology 的 ROI 不只是"效率提升"，而是直接转化为新的服务收入（如 climate risk score 对外输出）。对国内大型保险集团而言，这条范式意味着可以避免每条业务线独立建数据中台的重复投资。

2. **合规 + lineage 内置不是可选项，是入场券**——金融保险类项目如果 Ontology 底座不原生支持 kinetic + dynamic 双层权限、对象级 audit log、lineage 追溯，落地后必然要补一套独立的合规层，导致 ROI 与工程效率双双打折。Swiss Re 用同一套底座同时满足业务运营与监管报送，是"原生合规"路线的最佳实践。

3. **第三方独立测算比厂商自报 ROI 更有说服力**——Nucleus Research 给出的 170% ROI + 7.3 个月回收期之所以被广泛引用，是因为它来自独立第三方机构。CFO 与 CIO 在评估 Palantir 类项目时，应该优先看 Nucleus、Forrester、Gartner 这类第三方报告，而非厂商案例研究。

4. **Ontology 三层（语义 + 动力 + 动态）必须全部启用**——Swiss Re 案例中 Kinetic + Dynamic 两层都启用了语义与权限治理，不是只做"对象映射"。如果只做语义层、不做动态层权限，意味着失去了再保险业务的核心差异化能力（基于 portfolio 级的细粒度访问控制）。国内金融客户在落地时，建议把 Kinetic + Dynamic 视为同一项目的两个不可分割的交付物。

## 八、来源与外部补充

- **主源**：[palantir.com/impact/swiss-re](https://www.palantir.com/impact/swiss-re/) — Swiss Re 官方业务背景与 Ian Haycock 引语
- **第三方测算**：[Nucleus Research ROI Case Study](https://nucleusresearch.com/research/single/roi-case-study-palantir-at-swiss-re) — ROI 170%、回收期 7.3 个月、报告时间压减 70-80%
- **运营规模披露**：[Palantir Blog: Swiss Re](https://blog.palantir.com/swiss-re-palantir-scaling-data-operations-with-foundry-35d2e167de91) — "two dozen business domains、thousands of inbound data feeds"
- **行业叙事**：[Reinsurance News](https://www.reinsurancene.ws/swiss-re-puts-palantir-powered-ai-at-heart-of-new-strategy) — Swiss Re "数据到决策"四层架构（数据整合 + ontologies + vector + application）
- **可复用蓝图**：[BD Emerson Reinsurer 案例](https://www.bdemerson.com/case-studies/reinsurer-palantir-foundry-investment-analytics) — securities/issuers/portfolios/positions/holdings 五类 Object 蓝图

## 九、相关案例

- [Axel Springer 本体论](./2026-10-08-palantir-axel-springer.md) 对比：Axel 用 reader-article-subscription 对象，Swiss Re 用 policy-claim-portfolio 对象——B2C 与 B2B 数据孪生同构
- [Palantir SOMPO 案例](./2026-10-08-palantir-sompo.md) 同属金融保险本体论（瑞士再保险 vs 日本财险+养老）
- [Fujitsu 本体论案例](./2026-10-08-palantir-fujitsu.md) 互补：Fujitsu 50+ 运营应用 + 15,000+ 用户 vs Swiss Re 200+ 项目 + 1/3 员工活跃——同样是大企业内化 Foundry 的硬指标
