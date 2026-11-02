---
title: Cleveland Clinic Hospital 360
date: 2026-10-08 00:00:00
description: Cleveland Clinic 用 Foundry 构建 Hospital 360 与 Virtual Command Center，把 23 家医院、6,600+ 床位、19,000 护士的数据汇聚为本体论操作图，容量计算耗时下降 75%、转院接收量提升 10%+、ED 单患者留盘下降约 1 小时，是医疗本体论落地的旗舰案例。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - 医疗
  - Hospital 360
  - Cleveland Clinic
  - Virtual Command Center
---

Cleveland Clinic 与 Palantir 围绕 Foundry 共同搭建 **Hospital 360** 与 **Virtual Command Center** 模块，把 23 家医院、275 个门诊点、6,600+ 床位、19,000 名护士连成一张实时操作图。这一案例不仅是 Palantir 在医疗行业的旗舰落地，也是「ontology of the hospital」范式的代表性实践——本体论对象、PHI 合规、写回 EHR 形成端到端闭环。

## 一、业务背景:多专科学术医疗中心的运营复杂度

### 1.1 Cleveland Clinic 的网络规模

Cleveland Clinic 是 1921 年成立的非营利多专科学术医疗中心，至 2023 年已发展为覆盖 23 家医院、275 个门诊点、6,600+ 床位、19,000 名护士与高阶执业人员的巨型网络；2022 年系统内完成 303,000 例入院、270,000 例手术 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。这一规模意味着任何决策——无论是转院接收、床位分派还是护理排班——都必须在 23 个院区、几十个专科、几千个房间的尺度上同时做权衡。

当一家医院从单体扩张到 23 家时，原本「每栋楼一张白板」式的本地决策会被迅速放大成系统性问题：床位空置、转院延迟、ED 拥堵、护理工时浪费每年累计的财务与患者体验损失可达数亿美元。

### 1.2 行业特殊性:床位/护理/设备的高维耦合

医疗运营与制造业或物流业的根本差异在于「每一张床、每一个护士、每一台设备都同时被多种决策路径竞争」。一张 ICU 床位既是「当前患者的留置资源」，也是「等待转院患者的潜在目的地」，还是「下一班次护理单元的人力锚点」。这种高维耦合让传统的孤立 BI 看板失效——只看床位占用率，无法回答「今晚 7 点能否接收一例转院心脏外科患者」。

Cleveland Clinic 在 2020 年后明确意识到：必须把患者、床位、人员、设备建模为同一张语义网络上的对象，才能让床位决策从「被动响应」变成「主动编排」。

### 1.3 传统 EBS/EHR 系统的局限

原有的床位管理（EHR/EBS）与排班数据被割裂在多个系统里：EHR 记录患者临床信息，EBS（Enterprise Bed System）记录床位状态，HR 系统记录排班，capability 系统记录护士资质。护理人员只能靠电话、Excel 与多年经验做容量决策，每天平均花费数小时拼接这些数据 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。

## 二、挑战:数据割裂下的四类运营痛点

### 2.1 转院接收能力受限

Cleveland Clinic 的旗舰院区承担大量外院转诊请求，但接收决策完全依赖人工电话确认床位可用性。一次转院请求往往要打 5-10 通电话给不同院区的床位协调员，平均耗时 30 分钟以上，导致部分患者在等待中流失到竞争对手医院。

### 2.2 ED 与 PACU 拥堵

急诊科（ED）与麻醉后恢复室（PACU）是医院运营的「瓶颈节点」。当上游床位无法及时清空，ED 患者无法转入住院床位，PACU 患者无法从恢复室转入普通病房，整条患者流都会出现「瀑布式拥堵」。结果是 ED 留盘时间居高不下、PACU 占用恢复室床位超过设计容量。

### 2.3 护理人员配置过度或不足

护士长需要提前 6 周排班，但缺乏对预测患者 census（住院人数）的可见性。常见结果是：要么排班过多造成人力浪费（每名闲置护士每天成本约 600-800 美元），要么排班不足导致临时调用 float 护士，护理质量与员工满意度双下降。

### 2.4 单点解决方案只能优化孤立环节

医院此前部署过若干单点 BI 工具——床位看板、排班系统、capability 跟踪系统——但它们各自只看到网络的一个切面。缺乏实时全局视图意味着：护理管理者看不到「今晚 8 点全网络有哪些床位会被释放」，转院协调员看不到「最匹配的床位在哪栋楼」。

## 三、Palantir 解决方案:Hospital 360 + Virtual Command Center

### 3.1 Virtual Command Center 总览

与 Palantir 共建 **Virtual Command Center**，把 EHR、调度、HR、capability 与吞吐量指标整合为统一操作视图。Command Center 不是单一应用，而是一组 application surface 的统一入口：护士长看到排班视图、床位协调员看到转院视图、容量规划师看到 6 周预测视图——三者底层读取同一份本体论数据 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。

### 3.2 Hospital 360 模块

Hospital 360 是核心模块，提供实时床位状态、护理容量与准入预测三层信息：

```text
Hospital 360 = {
  realtime_beds:      每个床位的状态（occupied / clean / dirty / available）
  nursing_capacity:   每个单元当前的 nurse-to-patient ratio
  admission_forecast: 未来 6-24h 的预计入院与出院
}
```

床位协调员在 Hospital 360 上看到的不只是「哪张床空着」，而是「这张床预计何时清空、是否匹配转院患者的 acuity 等级、对应护理单元今晚的人力是否充足」。

### 3.3 Staffing Matrix 模块

Staffing Matrix 是面向护士长的单位级 6 周滚动预测工具。它读取同一组 patient census + bed availability 对象，但渲染的是「排班视图」：每名护士的资质、最近一次值班的单元、本周剩余工时、是否能 float 到其他单元 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。

护士长可以跨单元平衡排班，提前识别 late floats（临时借调），把「明早 6 点才发现人手不够」的被动场景变成「提前 3 天就看见缺口」的主动场景。

### 3.4 部署范围

Hospital 360 + Staffing Matrix 已部署至 main campus、Hillcrest、South Pointe、Euclid 四家医院，覆盖 Cleveland 区域的核心院区网络 (来源: [Cleveland Clinic ConsultQD](https://consultqd.clevelandclinic.org/how-ai-assists-with-staffing-scheduling-and-once-tedious-tasks))。后续计划扩展到 Florida 院区与海外合作伙伴。

## 四、本体论如何落地 ⭐

### 4.1 Object 定义:医院的核心四元组

Foundry Ontology 把医院建模为四类核心对象：

```text
hospital_ontology = {
  Patient:   { id, acuity, current_location, expected_discharge, pcp_team }
  Bed:       { id, unit, status, cleaning_eta, capability_tags }
  Staff:     { id, credentials, current_shift, fatigue_score, float_eligibility }
  Equipment: { id, type, location, maintenance_window, assignment }
}
```

这四类对象之间通过 link 互相引用：Patient 链接到当前 Bed 与负责的 Staff，Staff 链接到 Equipment 的使用权，Equipment 链接到 Patient 的护理路径。任何一类对象的变更都会触发其它对象的级联更新。

### 4.2 Action 写回:governed actions 闭环

governed actions 涵盖 transfer、assign-bed、float-staff、admit 等可执行操作。每一个 action 是一次业务事件，由 Foundry pipeline 或 batch pipeline 触发，同时写入：

- **下游系统**：床位状态写回 EHR、护士排班写回 HR、admit 通知写回 admitting team；
- **审计日志**：谁、在何时、出于什么目的执行了此次操作；
- **预测模型**：用实际 admission vs forecast 反馈给 probabilistic census forecast。

### 4.3 PHI 合规与本体设计同步进行

医疗数据最大的特殊性是 **PHI（Protected Health Information）合规**。Palantir 与 Cleveland Clinic 的差异化做法是把 markings、purpose-based access、audit log 作为对象的**内禀属性**——而非上线后再补的合规层：

```text
Patient {
  ...
  markings:        ["PHI", "sensitive"]
  purpose_access:  ["clinical_care", "bed_management", "research_opt_in"]
  audit_trail:     [...linked actions]
}
```

这样做的结果是：合规策略与本体结构同时演进，临床用户看到的是「按需的最小数据视图」，合规审计看到的是「完整的访问流水」，两边不冲突。

### 4.4 共享 ontology 让多模块复用

Hospital 360 与 Staffing Matrix 实质上是两个共享同一个 ontology 的 application surface——它们读取同一组 patient census + bed availability 对象，只是渲染不同决策视图 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。这一架构让新增模块（如 OR Stewardship 手术室调度）的边际成本极低——只需写一个新的 view 层，底层 ontology 复用既有数据。

## 五、可借鉴的开发范式

### 5.1 bedside-out / first-principles 开发

Cleveland Clinic Chief Digital Officer Rohit Chandra 强调 Palantir「**从零搭建而不是卖现成方案**」——Palantir 的工程师会与 capacity nurse、bed manager 一起坐在 hub 里画对象、把流程拆解成 action，再用 Foundry 实现。这意味着 ontology 必须由领域专家与工程师共同建模，而不是 IT 部门拍板 (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))。

这种「bedside-out」的开发方式与传统的「vendor-in」相反：不是让医院适配一套现成产品，而是让产品从医院的真实工作流中生长出来。

### 5.2 ontology 是共享数据源,不是单应用属性

多个模块（Hospital 360 + Staffing Matrix + OR Stewardship）复用同一组床位 / 排班对象，新增模块边际成本极低。这一范式与 Fujitsu 的 50+ 运营应用形成对照——同样靠「单 ontology 多 application surface」降低耦合复杂度 ([fujitsu](./fujitsu.md))。

### 5.3 PHI 合规与本体设计同步进行

如 4.3 所述，把合规标记作为对象属性而非后置流程，是医疗行业落地 ontology 的关键差异化。这一点在与 [Tampa General Hospital](./tampa-general-hospital.md) 的对比中尤为明显——Tampa 强调「iOS 类比 + Care Coordination OS」，而 Cleveland 强调「first-principles 共建」，两者的 ontology 起点一致但落地风格不同。

## 六、关键数字与引语

| 指标 | 数值 | 来源 |
|---|---|---|
| 床位容量计算耗时下降 | 75% | [palantir.com](https://www.palantir.com/impact/cleveland-clinic/) |
| 转院接收量增加 | >10%（main campus 8% within months） | [BD Emerson](https://www.bdemerson.com/article/palantir-healthcare-hospital-operations) |
| 转院后床位分派效率 | +20% | [palantir.com](https://www.palantir.com/impact/cleveland-clinic/) |
| ED 单患者留盘 | ~1 小时下降 | [palantir.com](https://www.palantir.com/impact/cleveland-clinic/) |
| 网络规模 | 23 医院 / 275 门诊 / 6,600+ 床 / 19,000 护士 | [palantir.com](https://www.palantir.com/impact/cleveland-clinic/) |

**关键引语**：

> "What has been unique about Palantir over the last couple of years is Palantir is not just willing, but actually thrives on solving the hardest problems as opposed to selling us an existing solution. And this translates to not just willingness, but eagerness to sit side-by-side with us, spend the time understanding healthcare, understanding our needs, understanding our process, understanding our culture, and then developing solutions from the ground up and literally from first principles."
>
> —— **Rohit Chandra**, Chief Digital Officer, Cleveland Clinic (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))

> "As a doctor, when we're able to improve efficiency, we're able to spend more time at the bedside with each of our individual patients, which is the reason I went into medicine."
>
> —— **Amy Teleron, MD**, Physician Lead, Medical Operations, Dept. of Hospital Medicine (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))

> "[With] the projections that Palantir offers, we can look at our core number of nurses that are scheduled on every shift for a six-week period. This system allows me to see all of our units as a whole, so then I can easily look through all of them and make that collective decision."
>
> —— **Kristen Vargo, DNP, RN**, Director of Nursing, Neurological, Orthopaedic, Rheumatology Institutes (来源: [palantir.com](https://www.palantir.com/impact/cleveland-clinic/))

## 七、借鉴启示

### 7.1 「床位即对象,转院即 action」的抽象可迁移

把床位、护理、患者、设备都视为「可调度资源对象」+「可执行业务事件」的抽象，并非医疗专属——任何具备「多类资源 + 多类决策路径」特征的运营场景（养老院床位、产线工位、仓储库位）都可借鉴。可参考 [Sompo 养老本体论](./sompo.md) 中 Resident object 的类似抽象。

### 7.2 合规属性内禀化的设计选择

把 PHI markings 作为对象内禀属性，而非外挂合规层，是医疗与金融、政府等高合规行业的通用范式。这一点对国内做医保数据、社保数据、医保结算系统的项目有直接参考价值——合规策略与数据模型应同时设计，而不是分两期工程。

### 7.3 first-principles 共建 vs 标准化产品的取舍

Cleveland Clinic 的 bedside-out 模式带来的是「深度适配 + 边际成本递减」，代价是「实施周期长 + 高度依赖合作方文化」。对国内医院信息化项目而言，关键是判断「业务足够独特、值得从零建模」与「流程相对标准、应直接用现成产品」的边界——通常当单院区规模 > 1000 床、跨多院区协作场景占比 > 30% 时，前者更划算。

## 八、来源与外部补充

- **主源**: [palantir.com/impact/cleveland-clinic](https://www.palantir.com/impact/cleveland-clinic/) — 官方案例，Hospital 360 + Virtual Command Center 完整介绍
- **外部补充**:
  - [BD Emerson](https://www.bdemerson.com/article/palantir-healthcare-hospital-operations) — 把 Cleveland/Tampa 提炼为「ontology of the hospital」共同范式；NHS Federated Data Platform 反例
  - [Cleveland Clinic ConsultQD](https://consultqd.clevelandclinic.org/how-ai-assists-with-staffing-scheduling-and-once-tedious-tasks) — Hospital 360 + Staffing Matrix 已部署至 main campus、Hillcrest、South Pointe、Euclid 四家医院
  - [ORIP GitHub](https://github.com/Riddhimaan-Senapati/ORIP) — Foundry Ontology + OSDK + TypeScript 跟踪医疗机构合规认证的最小脚手架

## 九、相关案例

- [Tampa General Hospital](./tampa-general-hospital.md) — 同属医院 Ontology 范式；Cleveland 强调 first-principles 共建，Tampa 强调 iOS 类比 + Care Coordination OS
- [Concordance](./concordance.md) — 同属医疗行业（前者院内运营，后者医疗供应链）
- [Sompo](./sompo.md) — 同属养老 / 医疗本体论（Resident object 类似 Patient object）
- [Fujitsu](./fujitsu.md) — 互补：Fujitsu 的 50+ 运营应用与 Cleveland 的 Hospital 360 + Staffing Matrix + OR Stewardship 多模块复用同源
- [本体论范式手册](./99-ontology-paradigms.md) — 范式 1（Object → Action → Write-back 闭环）主要引用本案例
