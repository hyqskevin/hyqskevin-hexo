---
title: Palantir Doosan DI360 案例
date: 2026-10-08 00:00:00
description: 韩国斗山 Infracore 与 Palantir 自 2019 年起共建 DI360 数据底座，打通新品研发、供应链、售后三大工作流，形成多部门 virtuous cycle 数据飞轮，为重型机械行业 Ontology 落地提供可复制范式。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - Doosan
  - DI360
  - 重型机械
  - 数据中台
---

韩国斗山 Infracore 与 Palantir 自 2019 年起合作，把 Foundry 引入企业级数据底座并命名为 **DI360**，把新品研发、供应链、售后三大工作流统一在 Ontology 上，形成"virtuous cycle"数据飞轮。这一案例既是 Palantir 在韩国制造业的旗舰样板，也是制造业 Ontology 落地的典型形态，对国内"数据中台"项目有结构级参考价值。

## 一、业务背景

### 1.1 Doosan Infracore 的行业位置

Doosan Infracore 是韩国领先的重型机械制造商，主营挖掘机、装载机、发动机等建筑装备。重型机械行业有几个结构性特征，决定了它对数据底座的特殊要求：

- **产品生命周期长**：一台挖掘机从研发立项到退市往往跨 10 年以上，期间需要持续迭代；
- **全球竞争激烈**：北美、欧洲、东南亚、中东市场对配置、价格、利润率的需求差异极大；
- **售后收入占比高**：备件、维修、保养等"看不见的现金流"通常占总利润 30% 以上；
- **多产品线 + 多市场信号源**：挖掘机、装载机、发动机在各国各时段的市场表现需要并行跟踪。

### 1.2 韩国重工业的产业地位

选择 Doosan 作为样板并非偶然。韩国重工业在全球供应链中占据独特位置：船舶、挖掘机、半导体设备、汽车的零部件采购链都依赖韩国本土 OEM 的稳定供货。这意味着 Doosan 一旦停产或质量下滑，跨国客户会立即转向日本或中国供应商。在这种压力下，Doosan 对"数据驱动决策"的容忍度远高于普通制造业——任何能缩短决策链路、提升可靠性的方案，都会被快速采纳。

### 1.3 DI360 的诞生

2019 年起，Doosan 把 Palantir Foundry 作为企业级数据底座，并将其命名为 **DI360 (Doosan Infracore 360)**。DI360 的目标不是"再建一个 BI 看板"，而是把分散在 ERP、MES、CRM、Telematics System 中的数据汇集到 Ontology 层，让跨部门决策可以在同一组对象上发生。

## 二、挑战：典型重工企业三大痛点

Doosan 与 Palantir 在落地前梳理出三类典型痛点。

### 2.1 新品研发 KPI 监控缺位

传统研发流程中，新产品上市后的销量、价格、利润率、质量波动、市场份额变化等关键 KPI，往往要等月度或季度报表出来才能复盘。等到问题暴露，产品定位已经错过市场窗口。

### 2.2 供应链对外部冲击反应慢

疫情、地缘冲突、贸易区域化让跨国供应链高度不稳定。Doosan 原本的需求预测是静态的——基于历史销售均值给采购下单，信号延迟 1-2 个季度，导致备件库存与排产计划频繁错配。

### 2.3 售后索赔与产品质量数据孤立

质保索赔、维修记录、备件更换是反映产品质量的"金矿"，但这些数据散落在售后 CRM、经销商系统、车间 MES 中，没有回流到研发环节。结果是同一型号的故障在下一年新款上重复出现，研发与售后相互指责却无法定位根因。

### 2.4 跨国子公司的数据孤岛

Doosan 在北美、欧洲、东南亚均设有子公司和经销商网络。各国子公司出于合规、本地化、客户关系等原因，往往各自维护一套独立报表系统。总部想做一次"全球挖掘机市场份额对比"，需要先汇总七套不同口径的 Excel。这种数据孤岛不仅拖慢决策节奏，更让"全球最优解"无从谈起——每个区域都只能看到自己那一块。

## 三、Palantir 解决方案：DI360 三工作流

DI360 用 Foundry 同时支撑三个核心工作流，每条工作流都有专属 Object 与 Action，三者在 Ontology 层互联。

### 3.1 新品研发：五维 KPI 实时看板

研发部门通过 Machine Object 上的 **5 维 KPI——销量、价格、利润率、质量、市场份额**——实时监控新机型在不同国家、不同时段的表现。当某市场销量上行但利润率下滑时，研发可以立即调取价格构成，反推定价策略；当某市场售后质量投诉上升时，可以联动追溯到部件级设计参数。

### 3.2 供应链：Telematics + 市场信号的动态预测

供应链侧把 **Telematics System (TMS) 高频边缘数据**（每台机器的位置、工时、油耗、负载）与市场信号（订单、招投标、宏观指标）放到同一 Ontology 上做需求预测。预测结果通过 Supply Adjustment Action 写回采购与库存计划，把"静态历史均值"换成"自适应实时信号"。

### 3.3 售后：Claim 根因定位 + 备件规划

售后通过 Claim Object 分析全机队索赔，做根因定位——例如某型号挖掘机的液压泵故障集中出现在 8000-10000 工时区间，对应的备件库存需要前置到区域仓库。维修决策通过 Maintenance Plan Action 写回备件与召回体系，把"事后补救"变成"事前预警"。

### 3.4 三工作流在 Ontology 层互联

三个工作流并非独立运行，而是通过共享 Object 在 Ontology 层耦合：

```text
            ┌─────────────────────────────┐
            │   MarketSignal (市场信号)    │
            └──────────────┬──────────────┘
                           ▼
   ┌──────────────┐  写回  ┌──────────────┐
   │  新品研发     │ ────▶ │  Machine 新版 │
   └──────────────┘        └──────────────┘
           ▲                       │
           │ Claim 反向反馈          │
           │                       ▼
   ┌──────────────┐  写回  ┌──────────────┐
   │  供应链       │ ────▶ │  库存/采购    │
   └──────────────┘        └──────────────┘
           ▲                       │
           │ TMS edge data         │
           │                       ▼
   ┌──────────────┐  写回  ┌──────────────┐
   │  售后         │ ────▶ │  备件/召回    │
   └──────────────┘        └──────────────┘
```

这种"一个 Object、多条 Action、闭环写回"的结构，是 DI360 与传统数据中台最显著的差异。

## 四、本体论如何落地

DI360 的核心不是建了数据底座，而是把跨部门对象与写回路径定义清楚。下面从三个层面拆解。

### 4.1 Object 定义

DI360 的核心对象层由五类 Object 组成：

```yaml
Machine:        # 整机
  - id, model, family, region
  - 关联: Component, Claim, Order, MarketSignal

Component:      # 部件
  - id, parent_machine_id, type
  - 关联: Claim

Claim:          # 售后索赔
  - id, machine_id, failure_mode, cost
  - 写回路径: → R&D 选型 / 备件规划

Order:          # 订单
  - id, machine_id, dealer, region
  - 关联: MarketSignal

MarketSignal:   # 市场信号
  - region, signal_type, timestamp
  - 驱动: 新品选型、Supply Adjustment
```

### 4.2 Action 写回路径

DI360 不是单向 dashboard，而是**闭环写回**。三类 Action 各自对应不同的业务系统：

| 工作流 | Action 类型 | 写回目标 |
|---|---|---|
| 新品研发 | Product Development Action | Machine 新版本配置 |
| 供应链 | Supply Adjustment Action | 库存与采购计划 |
| 售后 | Maintenance Plan Action | 备件与召回决策 |

### 4.3 virtuous cycle 闭环

DI360 的关键不在于建了数据底座，而在于让数据**反向倒逼决策**：

- **Claim → R&D**：某型号液压泵故障频发 → 研发在新机型选型时规避该部件或改型
- **MarketSignal → Supply**：某区域订单激增 → 供应链上调备件与产能
- **TMS edge data → Demand forecast**：机器工时逼近上限 → 客户可能进入大修期 → 售后提前介入

Palantir 官方明确表述为 *"DI360 connects diverse functions in a virtuous cycle"*——Ontology 的写回路径不是单向 BI 推送，而是**多部门共享同一组 Object + 不同 Action + 闭环反馈**的范式。

## 五、可借鉴的开发范式

DI360 暴露出的几条开发范式，对国内制造业 Ontology 项目有直接借鉴意义。

### 5.1 售后/市场/研发必须在 Ontology 层互联

否则数据底座只是 BI。Doosan 的差异化在于：Claim object 真正写回了 R&D 选型决策，而不是停留在售后部门的独立报表里。如果三个部门的 Object 只读不写回，数据中台再漂亮也只是看板。

### 5.2 Telematics 边缘数据要纳入本体论

不要只做传统 ERP 集成。把 TMS 高频边缘数据和市场信号放在同一 Ontology 上做需求预测，才能让供应链获得实时自适应能力。重型机械行业的"金矿"是机器本身的运行数据，不是 ERP 里的财务数字。

### 5.3 "virtuous cycle" 命名本身就是范式

把数据项目包装成可叙事、可对外宣传的飞轮，比单纯卖"数据中台"更易获高层支持，也更容易跨部门协调资源。一个被讲清楚的飞轮，比一个堆满指标的中台更能推动组织变革。

### 5.4 治理边界要先于数据汇集

Palantir 在实施 DI360 时强调"governed actions + permissions + auditability"。如果数据汇集先于权限治理，等于把公司所有机密摆在同一个房间里邀请所有人参观。Doosan 的做法是先在 Ontology 层定义每个 Object 的访问权限矩阵，再做数据汇集——研发能看自己的 Machine 配置但看不到财务成本，售后能看 Claim 历史但看不到研发选型理由。Ontology 的权限模型要参照企业 IT 治理框架，而不是简单复用 BI 报表的"行级权限"。

## 六、关键数字与引语

| 指标 | 数值 |
|---|---|
| 合作起始 | 2019 年 |
| 实时监控 KPI 维度 | 5（销量 / 价格 / 利润 / 质量 / 份额） |
| 工作流覆盖 | 新品研发 / 供应链 / 售后 |
| 跨国多产品线 | 是 |

> "With our new system open, the structure of the 'virtuous cycle' of our work environment has been established, where live data paves a better way forward for new product development. Palantir will continue to provide us with superior value service over the competition through their differentiated technology prowess. We hope the success of our joint project will be utilized as a reference point for many other companies in Korea's domestic manufacturing industry."
>
> —— Doosan Infracore 管理层（官方声明）

数据来源：[palantir.com - Powering Innovation for Doosan Infracore](https://www.palantir.com/impact/powering-innovation-for-doosan-infracore/)

## 七、启示与失败模式

### 7.1 失败模式：把 Ontology 当 BI 替代品

如果只是把 ERP、MES、CRM 数据汇集到 Foundry，做几张漂亮看板就收工，那本质还是 BI。DI360 的真正价值在于 Claim / MarketSignal object 能反向写回业务 Action。判断标准很简单——你的 Object 是否触发了业务系统的真实更新？

### 7.2 失败模式：TMS 边缘数据被排除在外

很多重工企业只做传统 ERP 集成，忽略了机器本身的 Telematics 高频数据。结果需求预测仍然是静态历史均值，疫情或地缘冲击一来直接断链。重资产行业的"信号源"在机器上，不在财务系统里。

### 7.3 跨案例可迁移的启示

- 对国内"数据中台"项目：本体论的"Object + Action + 闭环写回"是**结构级差异**，不是工具差异；
- 对航空、能源、矿业等同样存在售后 + 研发 + 供应链三角的行业：Doosan 的 virtuous cycle 模型可直接套用；
- 对想推动跨部门数据项目的 PM：把项目包装为飞轮叙事，比单纯卖技术栈更容易拿到高层预算。

### 7.4 跨文化实施的隐性成本

韩国制造业在执行力、文档规范、跨部门协作上相对成熟，这降低了 DI360 落地阻力。但在跨国推广时，文档规范与执行力的差异会成为最大变量——同样的 Ontology 模板，在欧美子公司可能需要 6 个月才能跑通，在东南亚可能要 12 个月。把"实施周期 × 当地组织成熟度"算进项目预算，比单纯按人头报价更接近真实成本。

## 参考资料

- 主源：[palantir.com - Powering Innovation for Doosan Infracore](https://www.palantir.com/impact/powering-innovation-for-doosan-infracore/)
- 视频版：[YouTube - DI360](https://www.youtube.com/watch?v=S7st0QER5So)
- 行业报道：[Equipment Journal - Palantir & Doosan Big Data](https://www.equipmentjournal.com/tech-news/palantir-doosan-big-data)
- 工程参考：[operational-ontology - GitHub](https://github.com/Aryan1718/operational-ontology)

## 延伸阅读

- [Palantir Airbus 案例](./02-airbus.md)：同属工业制造 Action write-back 范式
- [Palantir Sonnedix 案例](./02-sonnedix.md)：卫星 CV 检测驱动维修的对比
- [Palantir Kinder Morgan 案例](./02-kinder-morgan.md)：供应链 / 物理资产本体论
- [本体论范式手册 - 范式 5 多部门 virtuous cycle](./99-paradigm-handbook.md)
