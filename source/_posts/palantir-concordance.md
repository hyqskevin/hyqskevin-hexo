---
title: 医疗供应链 Surgence 范式
date: 2026-10-08 00:00:00
description: Concordance Healthcare Solutions 与 Palantir 共建首个全集成医疗供应链生态 Surgence，让 4,000+ 上下游供应商共享实时产品需求与库存可见性，告别 30/60/90 天滞后的供应链人工决策，开启医疗本体论「双向对象 + 生态共建」范式。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - Concordance
  - Surgence
  - 医疗供应链
  - 双向对象
  - 数据治理
---

美国最大医疗分销商之一 Concordance Healthcare Solutions 与 Palantir 共建了首个全集成医疗供应链生态 Surgence，让 4,000+ 上下游供应商共享产品需求与库存优先级，把 30/60/90 天滞后的信息交换换成实时双向可见。本文拆解 Surgence 的本体论落地细节与可借鉴范式。

> 主源：[palantir.com/impact/concordance](https://www.palantir.com/impact/concordance/) · [Concordance 官方博客](https://www.concordancehealthcare.com/blog/concordance-healthcare-solutions-launches-surgence-a-groundbreaking-platform-revolutionizing-the-future-of-the-healthcare-supply-chain-powered-by-palantir)

## 一、业务背景

### 1.1 Concordance 的行业位置

Concordance Healthcare Solutions 总部位于俄亥俄州 Tiffin，由三家美国最大医疗分销商合并而成，拥有 **175 年以上合并经验**，运营 **20 个配送中心**、覆盖 **48 州**，服务整个 care continuum（急症、社区、护理、政府、家庭、临终、化验、长期、初级、外科中心）。这种规模决定了它的供应链压力是行业级的——任何决策延迟都会被多个州的医院即时感受到。

### 1.2 医疗供应链的天然复杂度

医疗供应链与其他行业相比有几个结构性特征：

- **产品关键度高**：急救药品、手术耗材、检验试剂一旦缺货直接影响病人抢救；
- **SKU 数量庞大**：单家分销商可能要管理上万种 SKU，分布在 200/500/1000+ 不同网点；
- **多组织协作**：制造商 → 分销商 → 护理机构（医院、诊所、临终机构）三个层级缺一不可；
- **合规要求严**：药品追溯、批次管理、有效期跟踪是法律强约束；
- **突发事件敏感**：疫情、地缘冲突、季节性流感让需求曲线剧烈波动。

COVID-19 把医疗供应链的「信息不对称」危机暴露给全世界。当某医院急需某产品时，供应商未必知道；反之，供应商压了一堆库存却不知道该往哪发。

### 1.3 为什么需要 Surgence

在 Surgence 之前，整个产业链需要 **30/60/90 天才能交换一次信息**。医院端的紧急订单、补货信号、优先级调整，要等一到三个月才能传到上游供应商；上游的库存水平、生产排期、缺货预警同样要等一个季度才能下沉到医院。这种 reactive decision making 在平时只是效率问题，在疫情期间就是人命问题。

## 二、挑战

### 2.1 多方数据互不可见

制造商、分销商、护理机构之间数据互不可见。每个组织都使用自己的 ERP、CRM、采购系统，没有人愿意把自己的实时库存、需求预测、订单优先级完整暴露给上下游——这既是商业敏感性问题，也是技术异构性问题。

### 2.2 reactive 决策的代价

某医院急需某急救药品时，供应商未必知道；反之，供应商压了一堆库存却不知道该往哪发。这种信息延迟导致三输局面：

- **医院端**：关键药品短缺时无法快速调货，被迫寻找替代方案甚至延误治疗；
- **分销商端**：库存分布失衡，部分网点积压、部分网点断货；
- **制造商端**：看不到下游真实需求，产能排期与实际订单脱节。

### 2.3 传统供应链软件的局限

传统供应链软件只能优化单方——一家分销商的 ERP 再先进，也无法看到上游制造商的产能和下游医院的实时需求。要打通多组织协作，必须有一个让各方愿意共享数据的中立平台，而中立平台的前提是每个组织仍保留自己的数据控制权。这两个目标看似矛盾，正是 Surgence 要解的核心题。

## 三、Palantir 解决方案：Surgence

### 3.1 项目里程碑

Concordance 与 Palantir 在 **2022 年 10 月签约**，**2023 年 7 月 20 日**正式上线 Surgence。Surgence 是构建在 Foundry 上的 ecosystem（生态），也是第一个 agnostic（全厂商兼容）的医疗供应链平台——无论制造商、分销商、护理机构用 SAP、Oracle、还是自研 ERP，都能接进来。

### 3.2 三大核心能力

Surgence 的核心解决三件事：

1. **实时双向可见**：product demand + backorder + inventory level 在所有参与方之间实时同步，告别 30/60/90 天滞后的报表；
2. **优先级可升级**：可以给最关键的 back order 分配 urgency level，必要时向上升级优先级，让供应链资源向最紧急的订单倾斜；
3. **数据控制权保留**：Foundry 的 access control 让每个组织可以安全地与自己信任的上下游伙伴合作，且保持对自有数据的控制。

### 3.3 接入规模

Surgence 让 **4,000+ 上下游供应商**接入同一张 Ontology。从小型区域分销商到大型跨国制造商，都能在同一个平台上看到与自己相关的实时需求与库存信号，而无需担心自己的数据被泄露给竞争方——这是 ontology-as-ecosystem 与传统 multi-tenant SaaS 的关键区别。

## 四、本体论如何落地 ⭐

Surgence 的差异化不在于技术架构，而在于本体论如何定义多组织共享的语义层。

### 4.1 Object 定义

Surgence 的 ontology 把 medical supply chain 抽象为以下核心对象：

```yaml
Manufacturer:    # 制造商
  id: string
  name: string
  product_lines: list[string]
  production_capacity: object
  关联: [Product, Order, Shipment]

Supplier:        # 上游供应商
  id: string
  parent_manufacturer_id: string
  lead_time: int  # 天
  关联: [Product, Inventory]

Distributor:     # 分销商
  id: string
  distribution_centers: list[string]
  coverage_states: int
  关联: [Order, Inventory, Backorder]

Provider:        # 护理机构（医院、诊所、临终机构）
  id: string
  type: string  # 急症/社区/护理/家庭/临终/化验...
  bed_count: int
  urgent_demand: bool
  关联: [Order, Backorder, Product]

Product:         # 医疗产品
  id: string
  sku: string
  category: string
  regulatory_class: string  # 处方/OTC/管制类
  关联: [Inventory, Order, Backorder]

Order:           # 订单
  id: string
  provider_id: string
  distributor_id: string
  status: string  # placed/fulfilled/backordered/cancelled
  urgency_level: string  # low/normal/high/critical
  写回路径: → fulfill-order → Shipment

Backorder:       # 缺货订单
  id: string
  order_id: string
  product_id: string
  severity: string  # low/medium/high/critical
  escalate_flag: bool
  写回路径: → escalate-priority → Distributor 调度

Inventory:       # 库存
  id: string
  distributor_id: string
  product_id: string
  quantity: int
  location: string
  关联: [Shipment, Order]

Shipment:        # 物流
  id: string
  order_id: string
  origin_id: string
  destination_id: string
  eta: datetime
  关联: [Distributor, Provider]
```

### 4.2 Function/Action 写回

Surgence 不是单向 dashboard，而是带 governed actions 的双向操作层：

```python
# 伪代码：Surgence 的核心 Action
class SurgeActions:

    def fulfill_order(order_id, distributor_id):
        """履行订单：把 Order 状态从 placed → fulfilled，写回下游 Provider"""
        order = ontology.Order.get(order_id)
        inventory = ontology.Inventory.filter(
            distributor_id=distributor_id,
            product_id=order.product_id,
            quantity__gte=order.quantity
        )
        if inventory:
            Shipment.create(order=order, origin=inventory.location)
            order.status = "fulfilled"
            order.write_back()  # 实时同步到 Provider 视图
            return {"status": "ok", "shipment_id": ...}
        else:
            backorder = Backorder.create(
                order=order,
                severity="high",
                escalate_flag=True
            )
            escalate_priority(backorder.id)
            return {"status": "backordered"}

    def escalate_priority(backorder_id):
        """升级优先级：把最关键的 back order 推到所有相关方视野"""
        backorder = ontology.Backorder.get(backorder_id)
        backorder.urgency_level = "critical"
        backorder.notify_to(roles=["Manufacturer", "Distributor", "Provider"])
        backorder.write_back()

    def allocate_inventory(distributor_id, product_id, quantity, destination_id):
        """分配库存：从多网点调拨到紧急目的地"""
        candidates = ontology.Inventory.filter(
            distributor_id=distributor_id,
            product_id=product_id,
            quantity__gt=0
        ).order_by("lead_time")
        return candidates.first()

    def share_demand_data(provider_id, product_id, forecast_window):
        """分享需求预测：governed 共享给上游 Manufacturer"""
        # 受 data governance 约束，只对授权方可见
        forecast = ontology.DemandForecast.compute(
            provider_id=provider_id,
            product_id=product_id,
            window=forecast_window
        )
        forecast.share_with(roles=["Manufacturer"], scope="aggregate")
```

### 4.3 治理边界：双向可见的核心创新

Surgence 的关键创新是 **bidirectional visibility（双向可见）**——每个对象既有 inbound 又有 outbound 各自的视图：

- **Provider 视角的 Inventory**：只看自己能从哪些 Distributor 调到什么产品、库存量多少；
- **Distributor 视角的 Inventory**：看自己的全部库存分布在哪些 location，紧急订单从哪里能调拨；
- **Manufacturer 视角的 Order**：只看经过授权的 Distributor 发来的需求预测与紧急订单。

access control 与 data governance 不是后置的 IT 治理层，而是 **ontology 自身的属性**。这让生态伙伴可以共享而不放弃数据控制权——这是 Surgence 与传统 multi-tenant SaaS 的本质区别。

### 4.4 差异化：standing-alone → standing-together

标准供应链软件让每个组织 standing-alone（孤立运行），即使有 EDI 集成也只是单向推送。Surgence 让所有参与方 standing-together（共同站立在同一张 Ontology 上），但每个组织仍持有自己的数据 control，只是选择性地共享给信任伙伴。这是 multi-tenant ontology 与传统 supply chain 软件的本质区别（参考：[Repertoire 杂志](https://repertoiremag.com/from-standalone-to-standing-together.html)）。

## 五、可借鉴的开发范式

### 5.1 Ontology-as-Ecosystem

传统供应链软件只能优化单方——一家分销商的 ERP 再先进，也无法看到上游制造商的产能和下游医院的实时需求。只有 ontology 能让多方共享同一张操作视图，且保留各自的数据控制权。这是 B2B SaaS 难以复制的护城河。

对想做「产业互联网」项目的团队：平台想活下去，必须让每一方都觉得「我加入比不加入更划算」，而 ontology-as-ecosystem 是这个等式成立的唯一解。

### 5.2 Bidirectional Objects 是多组织 supply chain 的核心范式

任何一个对象既被上游 view 也被下游 view，所有 action 必须考虑双侧 effect：

- `Order` 对象：Provider 创建时是 outbound，Distributor 接收时是 inbound；
- `Backorder` 对象：Distributor 创建时是 outbound，Manufacturer + Provider 接收时各自是 inbound；
- `Inventory` 对象：Distributor 自己写入是 outbound，其他 Distributor 调拨时是 inbound。

如果写 action 时只考虑单侧视角，必然导致双侧信息不一致，进而引发信任崩塌。

### 5.3 Data governance as first-class object property

合作伙伴间 ontology 必须把 data sharing rules 建模到对象上，这对任何想用 ontology 解决多组织问题的项目都关键：

- 不是「先做数据汇集，再补权限」——那样等于把公司机密摆在同一个房间里邀请所有人参观；
- 而是「先在 ontology 层定义每个 Object 的访问权限矩阵，再做数据汇集」。

例如：某 Distributor 的具体库存量对 Manufacturer 不可见，但对 Provider（医院）可见并允许调拨申请；某 Provider 的病人数量对 Distributor 不可见，但对 Manufacturer 的需求预测模块可见（聚合后）。这些规则必须在 ontology schema 层面定义，而不是事后用 BI 权限补救。

## 六、关键数字与引语

| 指标 | 数值 |
|---|---|
| 配送中心 | 20 |
| 覆盖州数 | 48 |
| 合并行业经验 | 175+ 年（来自 3 家分销商） |
| 接入供应商数量 | 4,000+ |
| 信息交换延迟 | 30/60/90 天 → 实时 |
| 产品分布网点 | 200 / 500 / 1000+ |
| 签约时间 | 2022 年 10 月 |
| 上线时间 | 2023 年 7 月 20 日 |

**关键引语**：

> "Foundry can allow us to transition to where we want to be as an organization, but also to where healthcare supply chain needs us to be."
>
> —— Lisa Hohman，CEO, Concordance Healthcare Solutions

> "We are incredibly proud to unveil this groundbreaking healthcare ecosystem, which will revolutionize the healthcare supply chain by unifying providers, distributors and suppliers. By integrating advanced technology, data-driven solutions and collaborative partnerships, we aim to optimize the supply chain, ensure the availability of essential medical supplies and ultimately improve patient care."
>
> —— Lisa Hohman，Surgence launch 2023 年 7 月

数据来源：[palantir.com/impact/concordance](https://www.palantir.com/impact/concordance/) · [Concordance 官方博客](https://www.concordancehealthcare.com/blog/concordance-healthcare-solutions-launches-surgence-a-groundbreaking-platform-revolutionizing-the-future-of-the-healthcare-supply-chain-powered-by-palantir)

## 七、启示与失败模式

### 7.1 失败模式：把 ontology 当 multi-tenant SaaS

很多团队做产业互联网时，第一反应是「做一个多租户 SaaS，让所有上下游注册账号」。但这忽略了 ontology 的核心价值——**保留各自的数据控制权 + 选择性共享**。如果所有数据都集中到一个租户下，必然引发商业敏感性冲突，没人愿意上传真实库存或需求。Surgence 的解法是 Foundry 的 access control 作为 ontology 自身属性，每个组织看到的是经过授权的视图。

### 7.2 失败模式：只做单向数据推送

很多「供应链协同平台」本质只是 EDI 升级版——一方推送订单，另一方推送库存，但没有 bidirectional visibility。结果是一方能看到的另一方看不到，信任很快崩塌。Surgence 的每个对象都有 inbound + outbound 视图，所有 action 都考虑双侧 effect，这是判断 ontology 项目是否真的「双向」的关键。

### 7.3 跨案例可迁移的启示

- 对想做医疗、应急、产业链协同的项目：**bidirectional object + data governance as first-class property** 是结构级差异，不是工具差异；
- 对国内产业互联网项目：让每一方都觉得「加入比不加入更划算」是平台活下去的前提，ontology-as-ecosystem 是这个等式成立的唯一解；
- 对想用 ontology 解决多组织问题的 PM：不要先做数据汇集再补权限，而是先在 ontology 层定义每个 Object 的访问权限矩阵。

## 参考资料

- 主源：[palantir.com/impact/concordance](https://www.palantir.com/impact/concordance/)
- [Concordance 官方博客 - Surgence launch announcement](https://www.concordancehealthcare.com/blog/concordance-healthcare-solutions-launches-surgence-a-groundbreaking-platform-revolutionizing-the-future-of-the-healthcare-supply-chain-powered-by-palantir)
- [Repertoire 杂志 - from standalone to standing together](https://repertoiremag.com/from-standalone-to-standing-together.html)
- 工程参考：[aerotwin-recovery - aircraft supply-chain + digital twin demo with Foundry ontology mapping](https://github.com/anauhwar/aerotwin-recovery)

## 延伸阅读

- [Palantir Cleveland Clinic 案例](./2026-10-08-palantir-cleveland-clinic.md)：国家级多机构 ontology 的对比参考
- [Palantir Kinder Morgan 案例](./2026-10-08-palantir-kinder-morgan.md)：能源供应链 / 物理资产本体论
- [Palantir Doosan 案例](./2026-10-08-palantir-doosan.md)：同属「供应链 + Action 写回」范式
- [本体论范式手册 - 范式 7 Bidirectional Object](./2026-10-08-palantir-ontology-paradigms.md)
