---
title: Palantir 医院 OS 范式
date: 2026-10-08 00:00:00
description: Tampa General Hospital 用 Palantir Foundry 与 AIP 构建现代医院操作系统 Hospital Sync，把患者安置时间下降 83%、PACU 留盘下降 28%、脓毒症住院日下降约 30%；以单 Use Case 起步、三年扩展到 12+ Use Case 的范式，回答了企业级本体论如何落地为可执行的运营系统。
categories:
  - Palantir 案例分析
tags:
  - Palantir
  - Foundry
  - AIP
  - 本体论
  - Hospital Sync
  - 医疗
---

> **行业**：医疗（学术医疗系统）
> **主源**：[palantir.com/impact/tampa-general-hospital](https://www.palantir.com/impact/tampa-general-hospital/)
> **本体论焦点**：Foundry Ontology、Connected Health System、Hospital Sync、Care Coordination OS、AIP 编码领域知识、Action-Centered Applications、现代医院 OS、iOS 类比

## 一、摘要

Tampa General Hospital（TGH）是佛州 981-bed 的学术医疗系统，自 2021 年起与 Palantir 合作，用 Foundry 构建 Connected Health System，2024 年升级为 AIP 驱动的 Care Coordination Operating System，三年内从单 Use Case 扩展到 12+ Use Case。落地效果：患者安置管理时间下降 83%、PACU 患者留盘下降 28%、护士配置比改善 30%、脓毒症患者住院日下降约 30%，并在 2022 年飓风 Ian 灾害响应中实现 24 小时内交付全新 use case。

CEO John Couris 直接把目标类比 iOS——"iOS 系统，那是用户与创作者和谐共处的地方。我们可以在医疗领域做到同样的事"。Hospital Sync 应用套件 + Care Coordination OS 的组合，正是 Palantir 2025 年 "Reimagining the Enterprise Operating System" 主题在医疗行业最具体的落地样板。

## 二、业务背景

Tampa General Hospital 是佛州西海岸最大的学术医疗中心之一，旗下拥有 7 家医院、981 张注册床位、150+ 个网点，年急诊量与手术量在佛州常年位居前列。作为学术医疗系统，TGH 同时承担 USF Health Morsani College of Medicine 的教学任务，临床复杂度远超普通综合医院。

2021 年起，TGH 与 Palantir 启动合作；2023 年 6 月，CTO Brian Hammond 在 FoundryCon 公开主题演讲 "Building a Connected Health System"，系统阐述 ontology-driven hospital 的愿景；2024 年 6 月 TGH 官方公告扩展到 AIP 驱动的 Care Coordination Operating System；2025 年 12 月，TGH-Palentir 合作获 Tampa Bay Business Journal Inno Award "Partnership of the Year"（来源：[Morph Systems](https://morphsys.substack.com/p/tampa-general-hospital-patient-experience)）。

这套时间线本身就值得注意：从单一数据整合项目，到 ontology 驱动的运营系统，再到 AIP 加持的决策操作系统，三年时间完成三级跳。这与 Palantir 同一时期在国防、能源领域的扩张节奏一致，证实了 Foundry + AIP 在垂直行业中的可复用性。

## 三、核心挑战

大型学术医疗系统的数据困境有目共睹：

### 3.1 数据被困在系统孤岛

TGH 同时运行护士排班系统、患者普查系统、手术排程系统、HR 系统、capability 管理系统、imaging 系统等多个独立软件。这些系统各自有数据模型，却无法在患者进入 PACU（麻醉后恢复室）的那 30 分钟窗口里给护士长一个统一决策视图。传统 BI 报表只能做事后分析——床位冲突已经发生、护士已经被超额排班、患者已经在走廊等待，才有人看到问题。

### 3.2 灾害响应的实时性要求

2022 年 9 月，飓风 Ian 正面袭击佛州西海岸，TGH 必须在 24 小时内启动应急响应——疏散非紧急患者、扩容 ICU 床位、调配呼吸机与护士。传统 BI 与电子病历系统（EHR）的报表生成周期以天计，无法支撑以小时为单位的应急决策。这个 24 小时窗口成为 TGH 与 Palantir 合作的第一个 "sharpest pain"。

### 3.3 临床决策缺少领域知识编码

即使把数据汇总到一个屏幕，护士长依然要靠经验判断 "这位患者优先转去哪张床"。这种判断隐含大量领域知识——ARDS 风险评分与床位匹配的规则、脓毒症早期预警与转科时机的权衡、术后患者与术后恢复单元的匹配——但这些知识散落在护士长的脑子里，无法被新护士快速复用，也无法被审计追踪。

## 四、Palantir 解决方案

TGH 的实施路径分两步，每一步都对应一个明确的 ontology 演进。

### 4.1 第一阶段（2021-2023）：Connected Health System

第一步把所有数据源整合进 Foundry Ontology，构建 action-centered applications：

- 把 nurse schedule、patient census、surgery schedule、HR、capability、imaging orders 等系统通过 Foundry 的数据管道接入本体；
- 在 ontology 上构建 patient placement、nurse scheduling、OR utilization 等应用，把护士长从被动调班升级为 6 周前瞻预测；
- 把飓风 Ian 的灾害响应打包成 disaster response 应用——<24 小时上线，验证 ontology 框架的可组合性。

Brian Hammond 在 FoundryCon 2023 的总结："Foundry has allowed us to be able to centralize all of our data assets so that we have one common operational layer. Everyone is connected to one health system."

### 4.2 第二阶段（2024+）：Care Coordination Operating System

第一步解决 "数据在哪里" 的问题，第二步解决 "决策怎么做" 的问题：

- 把 domain expertise + real-time situational awareness + LLM 编码进 decision-support tools，沉淀到 ontology 的 action 层；
- 服务前台 eligibility/prioritization 工作流：前台护士可以直接问 AIP "我为什么该把这位患者优先转过去"，系统返回 ARDS risk score 与床位匹配的具体依据；
- 横向扩展到 revenue cycle management、sepsis early warning、discharge planning 等 12+ use cases。

TGH 2024 年 6 月官方公告把这套系统命名为 Care Coordination Operating System——刻意用 "Operating System" 一词，强调 ontology 不是数据模型，而是 operation system（来源：[TGH 2024 公告](https://www.tgh.org/news/tgh-press-releases/2024/june/tgh-selects-palantir-ai-software-connected-care-coordination)）。

### 4.4 与 Cleveland Clinic 的实施差异

同为大型学术医疗系统的 Cleveland Clinic 选择与 Palantir "first-principles 共建 ontology"，强调从数据治理与对象建模的最底层重新梳理；而 TGH 选择 "iOS 类比 + Care Coordination OS" 的产品化路径，强调前台员工对 ontology 的可感知心智模型。两条路径并不互斥：Cleveland 偏重 ontology 的工程严谨性，Tampa 偏重 ontology 的产品可解释性。两家医院都为同一问题提供了答案——本体论不是后台的数据地图，而是前台员工可以随时追问决策依据的运营操作系统。

### 4.3 Hospital Sync 应用套件

Hospital Sync 是 TGH-Palentir 联合品牌下的应用矩阵，覆盖三大核心场景：

- **床位安置**（Bed Placement）：实时床位状态、患者优先级、转科路径；
- **患者行程**（Patient Journey）：从急诊入院到出院的全流程编排；
- **人员配置**（Staffing）：护士排班、技能匹配、跨院区调度。

每款应用都消费同一组 ontology 对象（Patient、Bed、Nurse、Shift、Procedure、OR、Imaging Order），不需要重复集成数据。

## 五、本体论如何落地 ⭐

TGH 案例最值得借鉴的不是数字，而是 ontology 的具体写法。

### 5.1 Object 定义

本体层的对象围绕医院运营的核心实体展开：

```yaml
Patient:
  properties: [mrn, acuity, diagnosis, ards_risk_score, sepsis_flag, location]
  links: [assigned_bed, primary_nurse, scheduled_procedures]

Bed:
  properties: [bed_id, unit, type, status, isolation_flag]
  links: [current_patient, primary_nurse]

Nurse:
  properties: [employee_id, skills, certifications, current_shift]
  links: [assigned_beds, scheduled_shifts]

Shift:
  properties: [date, unit, required_staffing, actual_staffing]
  links: [assigned_nurses, charge_nurse]

Procedure:
  properties: [procedure_type, scheduled_time, or_required, estimated_duration]
  links: [patient, or, surgical_team]

OR:
  properties: [or_id, turnover_time, equipment_state]
  links: [scheduled_procedures]

ImagingOrder:
  properties: [modality, priority, status, scheduled_time]
  links: [patient, ordering_physician]
```

### 5.2 Function/Action 写回

ontology 不是只读视图，而是 governed actions 的执行引擎：

```yaml
actions:
  - admit_patient: { inputs: [patient_id, target_bed], gate: bed_available AND nurse_assigned }
  - transfer_patient: { inputs: [patient_id, from_bed, to_bed], gate: acuity_match AND isolation_check }
  - schedule_shift: { inputs: [nurse_id, shift_id], gate: skill_match AND overtime_check }
  - assign_bed: { inputs: [patient_id, bed_id], gate: ards_risk_score AND bed_type_match }
  - prioritize_eligibility: { inputs: [patient_id, service_line], gate: insurance_verified AND clinical_criteria }
```

### 5.3 治理边界与 AIP 集成

AIP 把 hospital 的 domain expertise 编码进 ontology 的 action 层——这正是 Palantir 2025 年 "AIPCon 7: Reimagining the Enterprise Operating System" 主题的最具体落地。Care Coordination Operating System 一词刻意用 "Operating System" 而非 "data model" 或 "application suite"，强调本体论的目标不是建模，而是支撑运营。

### 5.4 差异化：iOS 类比

CEO John Couris 在 AIPCon 2025 直接类比 iOS：

> "If you think about the iOS system. It is where the user and the creator live in harmony. We can do the same thing in healthcare. The entire system has to be wired through Foundry and AIP and that's the journey that we're on. Foundry and AIP are doing for TGH USF… it takes the complex and does make it simple."

本体论在这里回答的是前台护士的实操问题——"为什么该把这位患者优先转过去"——答案是 "因为 ARDS risk score 与床位匹配"。iOS 类比揭示了一个更深的产品逻辑：本体论层如同操作系统，应用层如同 App Store 上的 apps，护士长与开发者可以在同一个 ontology 上协作开发新 use case，而不需要每次重新整合数据。

### 5.5 决策可追溯与审计

传统 EHR 系统的决策路径通常埋在医生的工作记忆里——为什么把患者转去 ICU？通常只有 "直觉判断" 四个字可以回答。Care Coordination OS 把每一条 governed action 的触发条件、依据字段、参考时序全部写入 ontology 的 audit trail。前台员工随时可以追问 "为什么这张床分配给了这位患者"，系统返回完整的决策链条：ARDS risk score、隔离要求、护士技能匹配、转科路径优先级、上一位患者出院时间。这种决策可追溯性不仅是运营效率的提升，更是医疗合规与患者安全的底层保障——任何事后审计与质量复盘都可以在 ontology 层一键回放。

## 六、可借鉴的开发范式

### 6.1 从单 Use Case 到 Operating System

TGH 第一年只做单点（PACU 排班），第二年扩到 12+ use cases，第三年把 use cases 抽象为 operating system。这条路径对任何做 ontology 的项目都关键：先打 1 个 sharpest pain（飓风 Ian 的 24 小时响应），证明 ontology 框架的可组合性；再把每个新 use case 共用同一组对象，避免数据重复集成；最后把 use cases 打包成 OS 级品牌（Care Coordination Operating System），让前台员工有统一心智模型。

### 6.2 AIP 让 ontology 拥有 reasoning 能力

传统 ontology 是数据模型，描述对象之间的关系；AIP 让 ontology 拥有 reasoning 能力——domain expertise 不再是文档，而是 ontology 里的 action 层。前台护士可以问 AIP "我为什么该把这位患者优先转过去"，AIP 返回基于 ontology 的具体依据（ARDS risk score、床位匹配、隔离要求）。这种 reasoning 能力让 ontology 从 "数据地图" 升级为 "决策操作系统"。

### 6.3 24 小时新 use case 上线证明框架稳定性

Hurricane Ian 的 disaster response 应用能 24 小时交付，说明 ontology 已经成为 "操作系统级的稳定层"。如果 ontology 不稳定，新 use case 需要重新整合数据、重新定义对象、重新配置权限——不可能在 24 小时内完成。TGH 的 24 小时上线是一个强信号：ontology 已经具备 OS 级别的可组合性与可扩展性。

### 6.4 临床影响与运营效率的耦合

TGH 的数据揭示了一个常被忽视的规律：临床结果（脓毒症住院日下降 30%、care coordination program 抢救约 600 条生命）与运营效率（床位安置时间下降 83%、护士配置比改善 30%）是 ontology 投资的同一个回报面。在传统医院信息化项目里，这两个维度通常分属不同 KPI 体系——临床归临床，运营归运营。TGH 的 ontology 把二者编织到同一张对象网络上：脓毒症早期预警（clinical action）与床位安置（operational action）共用 Patient 对象与 risk score 属性，临床决策直接触发运营调度。这种 "临床-运营耦合" 是 ontology 相对传统 BI/EHR 项目的最大增量价值，也是 ROI 论证中最难被对手复制的一环。

## 七、关键数字与引语

| 指标 | 数值 | 来源 |
|---|---|---|
| PACU 患者留盘 | -28% | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 护士配置比改善 | +30% | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| PACU 预测模型准确率 | 95% | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 患者安置管理时间 | -83% | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 飓风 Ian 灾害响应 | <24 小时交付 | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| Use cases 扩张 | 1 → 12+（3 年） | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 脓毒症患者住院日 | ~30% 下降 | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 抢救生命数 | ~600（care coordination program） | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |
| 网络规模 | 981-bed、7 医院、150+ 网点 | [palantir.com](https://www.palantir.com/impact/tampa-general-hospital/) |

### 7.1 关键引语

> "We are on a mission to transform health care through innovation, and Palantir's technology platforms enable us to leverage data to improve quality and strengthen our operations."
> —— John Couris，President and CEO, Tampa General Hospital

> "If you think about the iOS system. It is where the user and the creator live in harmony. We can do the same thing in healthcare. The entire system has to be wired through Foundry and AIP and that's the journey that we're on. Foundry and AIP are doing for TGH USF… it takes the complex and does make it simple."
> —— John Couris，AIPCon 2025

> "Foundry has allowed us to be able to centralize all of our data assets so that we have one common operational layer. Everyone is connected to one health system."
> —— Brian Hammond，CTO, Tampa General Hospital，FoundryCon 2023 keynote

## 八、失败模式与启示

### 8.1 易踩的坑

- **把 ontology 当数据模型**：如果只建模对象与关系而不定义 governed actions，ontology 就退化为一张 ER 图，无法支撑前台决策。TGH 的解法是把 action 显式写入 ontology 层，并由 AIP 暴露 reasoning 接口。
- **Use Case 之间各自为战**：每个 use case 单独集成数据、单独定义对象，会导致 ontology 碎片化。TGH 的解法是从第一天就强制所有 use case 共用 Patient、Bed、Nurse、Shift 等核心对象。
- **忽视灾害响应等 "极端 use case"**：灾害响应的 24 小时上线看似偶然，实则是 ontology 框架稳定性的极端测试。建议任何 ontology 项目至少设计一个 "灾难级 use case"，作为框架成熟度的标尺。

### 8.2 跨行业可迁移的 3 条启示

1. **单 Use Case 起步，三年扩到 OS**：不要试图第一天就构建 "企业级 ontology"。先打 1 个 sharpest pain，证明 ontology 框架的可组合性，再横向扩展到 12+ use case，最后把 use cases 打包为 OS 级品牌。TGH 的三年时间线（2021-2024）说明这条路径不需要比竞争对手更快，只需要比竞争对手更稳。
2. **iOS 类比的产品意义**：ontology 层如同操作系统，应用层如同 App Store。开发者可以在同一 ontology 上协作开发新 use case，前台员工有统一心智模型。这种 "OS + Apps" 的产品结构，是 ontology 项目从技术走向产品的关键。把 ontology 包装成 "Operating System" 而非 "data model"，直接决定了前台员工把它当工具用还是当流程绕过去。
3. **AIP 让 ontology 拥有 reasoning**：domain expertise 不再是文档，而是 ontology 里的 action 层。决策依据可被前台员工随时追问、可被审计全程追溯，这是传统 BI 与 EHR 报表无法提供的核心价值。AI 不是 ontology 的替代品，而是 ontology 的放大器——没有 ontology 的 AI 是黑盒推理，没有 AI 的 ontology 是静态地图，二者结合才是 Care Coordination OS 这样的现代运营操作系统。

## 九、来源与外部补充

- **主源**：[palantir.com/impact/tampa-general-hospital](https://www.palantir.com/impact/tampa-general-hospital/)
- **外部补充**：
  - [TGH 2024 公告](https://www.tgh.org/news/tgh-press-releases/2024/june/tgh-selects-palantir-ai-software-connected-care-coordination) — AIP 构建 Care Coordination Operating System 官方定义
  - [Morph Systems](https://morphsys.substack.com/p/tampa-general-hospital-patient-experience) — "modern hospital OS" 与 Palantir "Reimagining the Enterprise Operating System" 主题直接呼应
  - [CareFlow-AI-Ontology](https://github.com/Arshi-Fatima/CareFlow-AI-Ontology) — Microsoft Fabric Ontology 实现的医院智能 demo（patient flow + capacity + emergency decision）

### 相关案例

- [Cleveland Clinic 同属医院 Ontology 范式](./cleveland-clinic.md)；Cleveland 强调 first-principles 共建，Tampa 强调 iOS 类比 + Care Coordination OS
- [Concordance 对比](./concordance.md)：Tampa 是单医院 Care Coordination OS，Concordance 是医疗供应链 Surgence OS
- [Sompo 同属医疗/养老本体论](./sompo.md)（Resident object 类似 Patient object）
- [Fujitsu 互补](./fujitsu.md)：Fujitsu 把 50+ 应用铺在 Foundry 上，Tampa 把 Hospital Sync 应用套件铺在 Foundry 上
- [本体论范式手册 范式 8（Operating System 比喻 + iOS 类比）](./99-本体论范式手册.md) 主要引用本案例
