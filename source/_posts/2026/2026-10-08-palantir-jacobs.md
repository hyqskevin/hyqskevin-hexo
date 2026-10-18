---
title: Palantir Jacobs 案例
date: 2026-10-08 00:00:00
description: Jacobs 在亚利桑那 Agua Nueva 水回收厂用 Foundry 部署 Blower+Setpoint Action Ontology，把远程数据科学家与现场操作员串成"每天 2 封邮件"的闭环。整体厂用电下降约 20%，电耗降至 1500 KWh/百万加仑，运营罚款归零，O&M 成本预期节省 10-30%。
categories:
  - notes
tags:
  - Palantir
  - Ontology
  - Foundry
  - 水务
  - 工业 AI
  - Field-first Action
---

水处理厂是"反应式运营"的典型样本——设备坏了才知道坏、月度复盘才发现跑得不好。Jacobs 把 Palantir Foundry 部署进已经"优化过"的 Agua Nueva 工厂，恰恰说明增量空间越小的工厂越能说明问题：整体厂用电降 20%，电耗从 2000 KWh/百万加仑降到 1500 KWh/百万加仑，运营罚款归零。这不是从 60 分做到 80 分的故事，而是从 90 分再挤出 20% 的硬证明。

## 一、业务背景

Jacobs 是全球基础设施解决方案巨头，市政水务是其核心板块之一。Agua Nueva Water Reclamation Site 位于美国亚利桑那 Pima County，是 Jacobs 自家已经"优化过的"水回收厂——这层背景比新厂改造更有说服力：当起点已经被前任团队拧过螺丝、跑过无数轮工艺调优时，再挤出 20% 的厂用电下降空间，才是 Foundry Ontology 落地能力的硬指标。

水务行业的 O&M（Operations & Maintenance，运营与维护）有三个先天特征，决定了它跟互联网 IT 项目完全不同的节奏：

- **资产寿命长**：鼓风机、泵、阀门动辄用 20-30 年，任何"换掉重买"的方案都过不了 CFO 这关。
- **现场 7×24 倒班制**：操作员是蓝领工程师，不是数据分析师，触达他们必须走他们已有的工作流。
- **合规硬约束**：出水水质受合规线（这里是氨氮 5.0 mg/L）卡死，模型失误的直接代价是罚款与停产。

这三点决定了水务 IT 项目失败的常见模式：投了 dashboard，工人不用；投了模型，工人不采纳。Jacobs 用 Foundry 解决的就是这最后一公里。

## 二、挑战

Agua Nueva 上线前的核心痛点有三层，分别对应"现场端""协作端""工艺端"：

### 2.1 SCADA 信息过载

水处理厂的 SCADA（数据采集与监控系统）会持续吐出几百个传感器的实时数据：溶解氧、氨氮、流量、温度、电流。操作员被 SCADA 噪音轰炸，无法蒸馏出 actionable insight，只能凭直觉定性决策。一个值夜班的操作员一晚上要看几十条曲线，没有精力再做一次"如果……那么……"的反事实推理。

### 2.2 远程与现场信息孤岛

Jacobs 的远程数据科学家擅长建模，但缺乏对现场节奏的感知；现场操作员懂工艺，但不懂 Python。两边长期处于"邮件往来三天才能对齐一次参数"的状态——一次 setpoint 调整从模型预测到现场执行，要经过 Excel 附件、邮件、电话三道转手，每道都可能引入误差。

### 2.3 鼓风机是优化抓手

水处理厂电耗结构里，鼓风机（blower）是为曝气池充氧的最大耗能单元。要降厂用电，先降鼓风机；要降鼓风机，要么调转速，要么调阀门开度，要么调运行台数。每个动作都直接关联出水氨氮合规线，是典型的"动一个参数影响五个变量"的多目标优化。

## 三、Palantir 解决方案

Jacobs 团队围绕 Foundry 搭了四层能力，从数据接入到闭环反馈形成完整飞轮：

### 3.1 数据接入与本体论化

用 Foundry 的 200+ 开箱即用连接器，接入五类源数据：

- **实时传感器**：SCADA 推流（每秒级）
- **实验数据**：化验室批次录入（每日级）
- **CMMS 工单**：设备维护记录（事件级）
- **Oracle 财务**：成本侧（每日/每月级）
- **合规事件**：出水水质报表（每日级）

按既定 schedule 清洗 + 转换为 Ontology 标准化模型——这就是 Foundry 的核心写回流程。五类异构源在 Ontology 层被统一成"Plant → Aeration Basin → Blower → Sensor → Setpoint Action → Compliance Event"的语义链。

值得注意的一点：Foundry 没有要求 Jacobs 推翻现有 SCADA 系统重做，而是在 SCADA 上加了一层"翻译层"——SCADA 继续干它擅长的高速控制，Foundry 负责语义聚合与跨源对齐。这种"叠加而非替换"的迁移策略让客户接受度极高，不会触发 IT 团队的存量保护反弹。

### 3.2 Smart Algorithms 建模

远程数据科学家用 Jacobs 自研的过程模型（Smart Algorithms）预测未来 12-24 小时的氨氮水平，对照合规线，反解出当下最优的鼓风机 setpoint。模型侧不试图做"全厂优化"，而是收敛到单一可执行动作。

### 3.3 每天 2 封邮件 ⭐

模型把 setpoint 建议封装成"人话邮件"，每天两次推送：

```text
Subject: [Agua Nueva] Blower #3 建议 setpoint 调整 2026-10-08 06:00

当前溶解氧 1.8 mg/L，预测 14:00 氨氮将到 4.6 mg/L（合规线 5.0）。
建议：Blower #3 setpoint 由 68% 调至 72%，持续 4 小时。

[✓ Accept]  [✗ Reject + 反馈]
```

操作员无需打开新 app，无需登录后台，邮件就是他们的工作流——这条原则在后面"借鉴范式"里会反复出现。

### 3.4 闭环 reject

操作员在邮件里点击 Reject，可以填富文本反馈给数据科学家。这个 reject 行为本身就是 Ontology 的 first-class 事件，会写回平台用于下一轮模型再训练。Jacobs 把这一闭环称为"distributed positive feedback loop between data scientists and operators"。

## 四、本体论如何落地 ⭐

本节是整个案例的方法论核心。

### 4.1 Object 层次

Foundry Ontology 把水厂拆成六层 Object：

```text
Plant（工厂）
  └─ Aeration Basin（曝气池）
       └─ Blower（鼓风机）
            └─ Sensor（传感器）
                 └─ Setpoint Action（设定值动作）
                      └─ Compliance Event（合规事件）
```

每一层都是 Foundry Ontology 里的 Object，可被链接、可被权限隔离、可被版本化。Blower 不是 SCADA 里的一行点表，而是带上下游、带历史、带运维工单、带合规事件的完整数字孪生。

### 4.2 Action 而非 View

Foundry Ontology 把"模型输出"直接绑到对象级别的 Action 上——每天两封邮件不是仪表盘，而是 Setpoint Action 的执行入口。Action 写回路径遵循操作员现有邮件工作流，不强推新 app。

这一选择直接颠覆了"先做 dashboard 让用户接受"的传统 BI 思维：Ontology 的核心交付物不是给人看的可视化，而是能触发现实世界动作的可执行接口。

### 4.3 治理边界

操作员的 reject 行为作为新事件写回 Ontology，让模型持续学习。Jacobs 把这一模式标榜为"distributed positive feedback loop between data scientists and operators"——数据科学家不用再追问"现场为什么不用我的模型"，因为每次否决都自动变成下一轮训练的标签数据。

### 4.4 多厂复制

同一套 Ontology 可扩展到 Jacobs 运营的其他十几个水务工厂，O&M 成本节约预期 10-30%——这是把"单点 PoC → 多厂复制"的标准打法。Ontology 的抽象层让一次建模能复用到所有"Plant"对象，而不是每个厂都重做一套。

复制的关键不是部署复制，而是数据契约复制：每个 Plant 在 Ontology 上挂同一组 Sensor、同一组 Action、同一组 Compliance Event——所有厂在数据科学家眼里长得几乎一样，差异只是 Plant 名字和地理位置。这也是为什么智能合约式的数据模型（Foundry Ontology）比传统数仓更适合多厂运营：换厂不需要重新对齐表结构。

### 4.5 写回路径的可审计性

每一封 setpoint 邮件、每一次 Accept/Reject、每一次实际调整结果都进 Ontology，形成可审计的因果链。监管机构、合规团队、内审部门事后都能拉出"某年某月某日 Blower #3 setpoint 调整的依据是谁的建议、谁点的 Accept、最终出水水质如何"——这是合规场景下 Ontology 比黑盒 ML 模型更被法务接受的关键。

## 五、可借鉴的开发范式

把上面的方案抽象成三条可迁移到其他工业场景的范式：

### 5.1 Ontology 落地的关键是 Action 而非 View

本案价值不在 dashboard，而在每天两封把人话建议写到操作员工作流的 Setpoint Action email——这是国内"AI 给建议但工人不听"困境的标准解药。判断一个 Ontology 项目是否落地的硬指标：**操作员每天至少打开一次的工作流里，有没有来自 Ontology 的可执行 Action**。

### 5.2 现场优先（field-first）原则

Foundry 不强推 app，而是在既有邮件工作流里嵌入 Action，写回路径遵循操作员现有节奏，比"教操作员用新 app"现实得多。这一原则同样适用于巡检工单、班前会、交接班记录——任何"工人已经每天打开"的地方都是 Action 入口。

### 5.3 闭环 reject 写回

把现场工位的"否决 + 反馈"作为 Ontology 的 first-class 事件，而不是丢弃，是工业 AI 项目最容易漏掉的环节。模型迭代的燃料是现场 reject 信号；没有写回的 reject 等于把数据科学家和操作员继续隔离在两个时区。

### 5.4 失败模式提醒

- **失败模式 A**：模型准确率高但操作员不点 Accept → 没有 Action 入口，纯 dashboard。
- **失败模式 B**：操作员点 Accept 但数据科学家看不到反馈 → 没有 reject 写回，单向闭环。
- **失败模式 C**：单厂跑通但无法复制 → 没有 Ontology 抽象，硬编码到一家厂的 SCADA 点表。
- **失败模式 D**：操作员"假装 Accept"但不真调 → 接受率虚高，需要在 Ontology 里加"建议 vs 实际执行"对比指标来识破。

三条全部命中就是"项目验收时 PPT 很好看，三个月后没人用"的典型剧本。

### 5.5 跨场景迁移清单

Jacobs 这套范式可以无缝迁移到以下场景，迁移时只需替换"鼓风机"对应的物理资产：

- **电力**：燃煤机组燃烧优化 setpoint 邮件给值长
- **石化**：精馏塔回流比 setpoint 邮件给外操
- **钢铁**：高炉送风 setpoint 邮件给炉前工
- **半导体**：扩散炉温度 setpoint 邮件给 PE
- **楼宇**：冷站制冷机 setpoint 邮件给暖通工程师

共同模式：**合规线 + 大耗能单元 + 现场 7×24 倒班 + 远程数据科学家**——四要素同时满足的行业，Jacobs 范式都可以复制。

## 七、关键数字与引语

| 指标 | 数值 | 来源 |
|---|---|---|
| 厂用电下降 | ~20% | [palantir.com](https://www.palantir.com/impact/jacobs/) |
| 电耗变化 | 2000 → 1500 KWh/百万加仑 | [palantir.com](https://www.palantir.com/impact/jacobs/) |
| 运营罚款 | 归零 | [palantir.com](https://www.palantir.com/impact/jacobs/) |
| setpoint 邮件频次 | 每天 2 次 | [palantir.com](https://www.palantir.com/impact/jacobs/) |
| Foundry 开箱连接器 | 200+ | [palantir.com](https://www.palantir.com/impact/jacobs/) |
| O&M 成本节约预期 | 10-30% | [Smart Water Magazine](https://smartwatermagazine.com/news/jacobs/jacobs-and-palantir-pilot-successful-data-solution-suite-and-expand-services) |

引语：

> "As part of Jacobs' Data Solutions and Climate Response accelerators within our Boldly Moving Forward strategy, the Jacobs and Palantir solutions leverage data securely to optimize operations and maintenance at plants across the country. Leveraging AI and machine learning to address the global energy challenge, particularly in water and wastewater treatment – one of the highest energy consumers – saves on materials and energy while setting the stage for sustainable operations."
>
> —— Bob Pragada，Jacobs President & COO（来源：[palantir.com](https://www.palantir.com/impact/jacobs/)）

## 八、来源与延伸阅读

- **主源**：[palantir.com/impact/jacobs](https://www.palantir.com/impact/jacobs/)
- **外部补充**：
  - [Smart Water Magazine](https://smartwatermagazine.com/news/jacobs/jacobs-and-palantir-pilot-successful-data-solution-suite-and-expand-services) — Jacobs Replica™ ML + Foundry 动态管理套件，10-30% O&M 节约预期
  - [Jacobs IOM15UseCases](https://resources.jacobs.com/IOM15UseCases) — Jacobs 官方 IOM（Intelligent O&M）15 个 use case
  - [WEFTEC 2024 联合演讲](https://www.weftec.org/weftec-now/intelligent-water-solutions-from-jacobs-and-palantir) — John Rickermann（VP Operations, Jacobs）+ Anita Beveridge-Raffo（Deployment Strategist, Palantir）

## 九、相关案例

- [Sonnedix 案例](./2026-10-08-palantir-sonnedix.md)：同属"Object-level Action + write-back"范式；Jacobs 写回 Setpoint Action 到操作员邮件，Sonnedix 写回 Maintenance Action 到资产经理
- [Kinder Morgan 案例](./2026-10-08-palantir-kinder-morgan.md)：同属能源基础设施本体论 + Field-first Action
- [Airbus 案例](./2026-10-08-palantir-airbus.md)：同属物理资产 + Action 写回飞轮
- [Fujitsu 案例](./2026-10-08-palantir-fujitsu.md)：互补——Fujitsu 把制造业 IT 服务范式延伸到供应链，与 Jacobs 把水务 IT 服务范式延伸到 O&M 同源
- [本体论范式手册](./2026-10-08-palantir-ontology-paradigms.md)：范式 3（Field-first Action）主要引用本案例