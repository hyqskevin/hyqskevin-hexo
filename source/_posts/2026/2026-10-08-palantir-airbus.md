---
title: Airbus Skywise 本体论
date: 2026-10-08 00:00:00
description: Airbus 与 Palantir 自 2015 年合作,以 Foundry Ontology 重构 A350 生产排程并演化出行业平台 Skywise,覆盖 49% Airbus 服役机队、25,000+ 月活用户与 12,000 架飞机,验证了"单租户→多租户"本体论的工业化路径。
categories:
  - 案例研究
  - 本体论
tags:
  - Palantir
  - Ontology
  - 航空制造
  - Skywise
  - Airbus
  - 数字孪生
---

# Airbus Skywise 本体论

## 一、业务背景:航空制造的"零件海"

Airbus 是全球最大的宽体客机制造商之一,旗舰机型 A350 单架含 **500 万零件**,由分布在 8+ 工厂、4 个国家、几百个团队的协作网络共同完成 (来源: [palantir.com](https://www.palantir.com/impact/airbus/))。这意味着它既是一家飞机制造商,也是一家由海量异构数据驱动的复杂运营系统——每一颗螺丝的状态、每一次排产的变更、每一个工单的关闭,都直接关联到公司级的现金流。

2015 年正值 A350 产能爬坡的关键阶段,质量与交付速度被推到公司级生死线的高度。产能每延迟一天,就意味着数亿美元的现金流损失与客户信誉侵蚀。这种"硬时间盒"压力,是 Airbus 主动拥抱 Palantir 的真正动因。

## 二、痛点:跨工厂、跨系统的数据孤岛

A350 的关键驱动数据——生产排期、班次、零件齐套、工单、质量缺陷——分别散落在不同工厂、不同国家、不同 IT 系统中。每个工厂有各自的 MES(制造执行系统),每个工段有各自的工单系统,质量缺陷靠工程师手工录入 Excel,供应商的齐套状态只能靠邮件和电话确认。这种"系统碎片化"在产能爬坡期会被急剧放大:一处排程变更,需要四五个团队的 Excel 来回传递,信息失真与决策延迟按小时级累计。

Airbus 看不到一张端到端的全局视图,更无法回答下列跨域关联问题:

- 同一缺陷模式在不同工厂的复发频次
- 下游返工的实际成本归因
- 未关闭工单究竟卡在哪个工序、卡了多少天
- 班次调整对零件齐套率的影响

这些不是传统 BI 报表能解决的问题——它们需要把数据先**物化**为可被推理、可被写回的"对象",再围绕对象组织决策。Airbus 选择的路径,不是再建一座数据仓库,而是与 Palantir 一起把 Foundry Ontology 嵌入生产运营最核心的环节,让对象本身成为跨系统协作的"通用语"。

## 三、Palantir 解决方案:三阶段演化

Airbus 与 Palantir 的合作按以下节奏展开 (来源: [palantir.com](https://www.palantir.com/impact/airbus/)):

### 3.1 2015 — Foundry 落地 A350 排产

把排程、班次、零件齐套、缺陷五类数据接入 Foundry,建立**单一操作面板**,让 A350 交付速度提升 **+33%**。这是 Skywise 的种子场景,也证明了"Ontology + Action 写回"在工业制造场景的真实威力。

### 3.2 2016 — 横向扩展到供应链与财务

把已沉淀的本体论范式复制到相邻工作流——供应链(供应商齐套与交付)、财务(成本归因),验证了"单点跑通 → 横向扩张"的可行性,避免 Ontology 沦为一次性 BI 项目。

### 3.3 2017 — 开放为 Skywise 行业平台

把 Airbus 内部沉淀的数据资产开放成行业级平台,把航司、MRO(维修、修理与大修)、供应商、空管全部接入同一个生态。Skywise 由此成为 Palantir 极少对外披露的"**单租户 Ontology → 多租户 Ontology 平台**"演化的代表性剧本,也是其后续向汽车、能源、制造业扩张的样板案例。

## 四、本体论如何落地 ⭐

Airbus 案例最有价值的地方,不在"+33% 交付加速"这个数字,而在它揭示了 Foundry Ontology 在工业场景的**对象建模与写回机制**。

### 4.1 对象定义:Aircraft 是图谱核心

在 Skywise 的 Ontology 中,`Aircraft` 是核心对象,其下挂载约 500 万个 `Part` 对象,两者通过 **Bill-of-Materials(BOM)** 关系图链接。`Production Order`、`Shift`、`Defect` 都是与 Aircraft 关联的 `Action` 与 `Event` 对象。

一个最简化的 Ontology 片段示意如下:

```yaml
# Skywise Ontology 核心对象骨架(简化,非真实 schema)
Aircraft:
  properties:
    tail_number: string
    model: enum[A320, A330, A350, A380]
    delivery_date: date
  relations:
    parts: Part[]                 # 反向通过 BOM 聚合
    production_orders: ProductionOrder[]
    defects: Defect[]
    flights: Flight[]

Part:
  properties:
    part_number: string
    serial: string
  relations:
    parent_aircraft: Aircraft

ProductionOrder:
  type: Action
  relations:
    aircraft: Aircraft
    factory: Factory
    shift: Shift

Defect:
  type: Event
  relations:
    aircraft: Aircraft
    discovered_at: timestamp
    severity: enum[low, medium, high]
```

这段伪 YAML 不是 Foundry 真实 schema,而是为了让读者直观理解"**Aircraft 是图谱根、Action/Event 围绕它发生**"这一建模原则——这是 Ontology 区别于"再加一层宽表"的关键。

### 4.2 Function / Action 写回:价值闭环的关键

A350 排产能提速,核心不是因为多了一张漂亮的仪表盘,而是因为优化结果可被**写回**到 MES / SAP:

```text
Foundry Ontology 中的排产优化模型
        ↓ 计算结果
Function: optimize_production_schedule(aircraft_id, horizon_days)
        ↓ Action write-back
MES / SAP 中的 Production Order 字段被更新
        ↓ 触发
下一班次直接按新排产执行
```

这就是 Palantir 反复强调的"**ontology write-back to systems of record**"——本体论不只是数据底座,更是改写业务系统的中介层。一旦缺失写回能力,Ontology 就会迅速退化为又一个"看得见、改不动"的 BI 项目。

### 4.3 平台演化:从单租户到多租户

Skywise 把这一本体论范式从单家 OEM 复制到整个航空业:

- 航司侧:`Flight`、`Crew`、`Maintenance Event` 进入 Ontology
- MRO 侧:`Work Order` 关联回原 Aircraft
- 供应商侧:`Shipment` 与 BOM 节点对接
- 空管侧:运行数据作为外部 `Event` 流接入

所有参与方用同一套 Ontology 对象类型,**借助 Foundry 的 Ontology SDK 让第三方也能以相同语义读写数据**——这是"多租户 Ontology 平台"区别于"为客户做 BI 项目"的核心差异。

### 4.4 与 Digital Twin 的衔接

随着飞机进入服役阶段,Ontology 中每个 Aircraft 对象都对应一份持续更新的 Digital Twin(数字孪生):飞行小时、传感器读数、维护记录、零部件更换历史都挂在同一对象上。Allegiant Air 的引语提到"每天至少节省一架在役飞机的停场时间",正是建立在这种"飞行数据—维护事件—机队对象"的实时关联之上。

更关键的是,这种 Digital Twin 不是孤立静态模型,而是**双向可写**的——排产阶段的对象与服役阶段的对象是同一个 Aircraft,设计阶段的 BOM 与维护阶段的更换记录也指向同一个 Part。这种"全生命周期同一对象"的能力,才是本体论范式相对于传统 PLM(产品生命周期管理)系统最本质的优势。

## 五、可借鉴的开发范式

从 Airbus 案例可以提炼出三条对工业制造类项目普遍适用的范式:

### 5.1 业务对象先于数据管道

Airbus **没有先建数仓再建对象**,而是让 Ontology 直接消化五类异构源数据,反向倒推数仓结构。这与传统"先 ODS、再 DWD、再 DWS、再 ADS"的湖仓分层思路相反——本体论范式下,数据管道的边界由"对象需要哪些属性"决定,而不是由"源系统有哪些表"决定。

对实施团队来说,这条原则意味着前两周的工作重心不是画数据流图,而是和业务方一起讨论"Aircraft 对象到底有哪些属性、Part 怎么挂、Defect 怎么归类"。

### 5.2 Action write-back 是价值闭环关键

如果 Ontology 只能查询、不能写回,它会迅速沦为又一个 BI 项目。Airbus 把排产优化的结果直接写回 MES/SAP,使 Foundry 从"看的工具"变成"做的工具",这是项目能否被一线团队持续使用的分水岭。判断标准很朴素:业务团队愿不愿意在日常工作中主动打开 Ontology,而不是等月度汇报时再看。

### 5.3 单点跑通后横向扩展

A350 排产 → 供应链 → 财务 → Skywise 行业平台,是一条清晰的"**垂直打透、横向复制**"路径。这条路径给了后来者一条朴素但关键的纪律:不要在第一个场景跑通前就铺开十个场景。Skywise 直到 2017 年才对外开放,而此时 Airbus 内部已经跑了两年——这种节奏感是平台化成功的隐性前提。

## 六、关键数字与引语

| 指标 | 数值 | 来源 |
|---|---|---|
| A350 交付加速 | +33% | [palantir.com](https://www.palantir.com/impact/airbus/) |
| Skywise 接入飞机数 | 12,000+ | [palantir.com](https://www.palantir.com/impact/airbus/) |
| Airbus 服役机队覆盖 | 49% | [palantir.com](https://www.palantir.com/impact/airbus/) |
| Skywise 月活用户 | 25,000+ | [palantir.com](https://www.palantir.com/impact/airbus/) |
| 第三方估算年营收机会 | 850M USD | [官方 PDF](https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf) |
| 第三方估算年成本节约 | 1.7B USD | [官方 PDF](https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf) |

**引语**:

> "We are saving no less than one aircraft out of service per day, largely based on predictive alerting, but also in relation to expediency and heightened accuracy."
> —— Allegiant Air 团队,Director, MX Ops Planning & Analytics (来源: [palantir.com](https://www.palantir.com/impact/airbus/))

## 七、启示与可迁移模式

### 7.1 常见的失败模式

观察其他制造业 Ontology 项目,常见的失败模式有两类:

- **本体论止于 BI**:只建模、不写回,六个月后无人使用,最终被新的 dashboard 工具取代。这种项目往往被内部称为"演示厅",演示当天客户眼前一亮,演示结束后再没人打开。
- **多租户扩张过早**:第一个场景没跑通就铺向十个客户,既未沉淀出可复用的对象,也未建立可对外的语义,平台沦为定制项目集合体。每个客户的"个性化"看似差异巨大,回头看却都是同一套对象的不同写法,本质上是没有沉淀出通用语义。

Airbus 都避开了这两个坑——它的扩张节奏是"2015 跑通 A350 → 2016 扩展内部 → 2017 开放行业",每个阶段都有可量化的业务结果作为扩张门票。这种"业务结果驱动扩张"的纪律,比任何技术架构都更能决定 Ontology 项目的最终命运。

### 7.2 跨案例可迁移的三条启示

1. **从"卡业务命脉"的工作流切入**:A350 排产是 Airbus 公司级生死线,资源、注意力、决策权都会到位,这是单点突破的最小必要条件。如果切入点只是"质量部门想看个新报表",资源、注意力、决策权都会缺位。
2. **让本体论成为写回中介,不只是数据底座**:Ontology 与 MES/SAP 的 Action 闭环是价值能否兑现的分水岭,也是项目能否摆脱"BI 项目"标签的根本。
3. **单租户跑通后,再用 SDK 把语义开放给生态**:Skywise 之所以能演化为多租户平台,是因为 Foundry 的 Ontology SDK 让第三方也按同一套对象类型读写,这是技术资产转平台资产的关键转折点。

对于正在评估本体论落地的团队,A350 案例的真正启示不是"航空业也能上 Ontology",而是"任何由复杂物理资产、跨域协作、严格时序约束三者叠加的行业,都可以套用这套范式"——汽车、能源、重型装备、医疗器械,几乎都能找到对应版本。

## 八、外部参考与延伸阅读

- **主源**: [palantir.com/impact/airbus](https://www.palantir.com/impact/airbus/)
- **官方 PDF**: [Palantir-Airbus Partnership Overview](https://www.palantir.com/assets/xrfr7uokpv1b/7uEHPTEM0MkKtBFcx2zh63/9d75da5b76439717ac95135b5012479e/Palantir-Airbus-Partnership_Overview.pdf) — 8.5 亿/年营收机会与 17 亿/年成本节约估算的来源
- [theforwarddeployed.io/engagements/airbus](https://www.theforwarddeployed.io/engagements/airbus) — FDE(forward-deployed engineer)真实作战视角,强调 Foundry 不是单点工具,而是与甲方长期驻场共建的数据治理与多边信任平台
- [aviationfile.com/skywise](https://www.aviationfile.com/skywise-how-airbus-is-transforming-aviation-through-big-data) — Skywise 的 Digital Twin、IoT 边缘集成、自主维修 AI 三大能力综述
- [palantir-foundry-ai-manufacturing-decision-support](https://github.com/MaxErmler/palantir-foundry-ai-manufacturing-decision-support) — 16 个互连 ontology object type + AIP Logic 最小代码模板

## 相关案例

- [Palantir Doosan Infracore](./2026-10-08-palantir-doosan.md) — 同属工业制造范式(多部门共享同一组 Object + Action 闭环)
- [Palantir Kinder Morgan](./2026-10-08-palantir-kinder-morgan.md) — 同属能源基础设施 + Common Operating Picture 范式
- [Palantir Sonnedix](./2026-10-08-palantir-sonnedix.md) — 同属物理资产 Object + write-back 飞轮
- [Palantir Fujitsu](./2026-10-08-palantir-fujitsu.md) — 互补:Fujitsu 把 Foundry 内化为 IT 服务公司底座后,又以解决方案交付给制造业客户
