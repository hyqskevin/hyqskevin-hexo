---
title: Palantir HHS Protect
date: 2026-10-08 00:00:00
description: HHS 与 CDC 用 Palantir Foundry 在 5 天内搭建 HHS Protect,聚合 30+ 机构、300+ 数据源、约 25 亿条 COVID 数据,服务 ~3K 跨机构用户;后扩展为 5 年 9,000 万美元 SHARE BPA 合同,覆盖 NIH/CDC/FDA 全机构,是「Ontology-as-Emergency-Infrastructure」(本体论作为应急基础设施)范式的代表案例。
categories:
  - Palantir
  - 案例研究
tags:
  - Palantir
  - Ontology
  - 公共卫生应急
  - HHS Protect
  - COVID-19
  - 本体论范式
  - Foundry
---

Palantir Foundry 在 Spring 2020 用 **5 天时间**上线 HHS Protect,聚合 30+ 联邦机构、300+ 数据集、约 **25 亿条** COVID 数据,服务 **~3K 跨机构用户**;后扩展为 5 年 **9,000 万美元** SHARE BPA 合同,覆盖 NIH/CDC/FDA 全 HHS 机构(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf) + [Business Insider](https://www.businessinsider.com/hhs-protect-palantir-healthcare-data-coronavirus-trump-2020-5))。这一案例最重要的不是平台速度本身,而是它揭示了 Foundry Ontology 已经产品化到「5 天内即可搭建国家级跨机构操作图」的程度——这与航空、能源、医院运营场景中长期演化的 Ontology 形成对比,也是「Ontology-as-Emergency-Infrastructure」(本体论作为应急基础设施)这一新范式的核心证据。

## 一、业务背景:COVID-19 触发的国家级数据整合刚需

### 1.1 美国公共卫生应急的体制性挑战

美国卫生与公众服务部(HHS)及疾病控制与预防中心(CDC)长期面对一个根本难题:公共卫生数据天然分散。联邦层面有 NIH、CDC、FDA、ASPR、IHS 等 30+ 机构各自维护数据集;州层面有 50 个州卫生部及数千个地方公共卫生部门;私营层面有医院集团、检测实验室、保险公司、PPE 供应商等。在稳态下,这些数据通过定期报告、流行病学服务周报(MMWR)、电话沟通维持松散整合;但当一个未知流行病在两周内从社区传播升级为全国紧急状态时,这种「松散整合」会立刻崩塌成「数据真空」(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。

### 1.2 2020 年 3 月的「数据真空」

2020 年 3 月,COVID-19 在美国全面爆发,联邦决策层需要的核心问题——「全国 ICU 床位占用」「PPE 库存」「检测结果返回延迟」「州际转院通道」「高风险护理机构爆发点」——没有任何一个机构能直接回答。CDC 原有系统能产出州级聚合数据,但缺乏实时性;ASPR 的供应链数据分散在多个 Excel;HHS 的应急指挥只能依赖每日零散的简报。这正是 CDC 原流行病学家 Dr. Wilbert van Panhuis 所说的「过去几十年美国公共卫生监测最大的飞跃之一」必须解决的前置条件(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

### 1.3 为什么 CDC 原系统无法胜任

CDC 原有 DCIPHER 等系统侧重于历史性流行病学分析,设计上就不是为「全国实时作战图」准备的。它们能产出每周发布的 MMWR 报告,但不能告诉应急指挥长『今晚 7 点哪家医院的 ICU 还有空床、哪家护理机构有集中爆发风险』。当 Trump 政府要求医院把 COVID 数据直接发给新平台(而非先经 CDC 中转)时,机构间信任链条重构,迫切需要一个中立、跨机构、可在数日内部署的数据整合平台(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

## 二、痛点:联邦级数据碎片的四道高墙

### 2.1 数据极端异构

需要纳入 HHS Protect 的数据集涵盖床位占用、检测结果、PPE/呼吸机/Remdesivir 供应链、州行政命令、护理机构、死亡数据等几百个 dataset。这些数据既有 Teletracking 这类不可靠的医院上报数据(有报道显示曾出现「医院负数床位」等异常),又有 Epic、EBSEnymes 等互不通信的 EHR 系统;数据格式、更新频率、质量标准差异极大,异构程度远超任何单一企业的 ERP 整合场景(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

### 2.2 DCIPHER 被边缘化

CDC 沿用多年的 DCIPHER 系统在新架构下被边缘化。原本应作为联邦级数据中枢的 DCIPHER,实际只承担州级聚合数据接收与分析的角色,既无法实时反映医院端数据,也未参与联邦应急决策。当联邦政府决定绕开 CDC 直接建新平台时,机构间权威关系被重塑,DCIPHER 在新的 HHS Protect 架构下被定位为「下游分析消费者」而非「数据中枢」(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

### 2.3 机构间信任崩塌

新平台要求医院绕过 CDC 直接上报数据,本质上是把数据所有权从 CDC 转移到 HHS。这一安排引发大量机构反弹——CDC 内部流行病学家担心数据被政治化使用、州卫生部担心联邦绕过州权、医院担心合规与上报负担。在缺乏统一本体论的情况下,「哪些数据归谁看、谁有权改、谁负责审计」没有技术答案,只能靠行政命令临时协调(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

### 2.4 数据可靠性风险

匿名 CDC 官员直接对媒体承认:「It is a platform. It isn't a panacea. Some of the outside data sources HHS Protect depends on — including the hospital data from Teletracking — aren't reliable, sometimes showing that a hospital had a negative number of patients in beds.」(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。这意味着本体论平台在承接异构数据时,必须把数据质量标记(quality flag)作为对象的内禀属性,而不是依赖 ETL 层后置校验。

## 三、Palantir 解决方案:HHS Protect + SHARE 合同

### 3.1 5 天上线的工程奇迹

Palantir Foundry 在 Spring 2020 仅用 **5 天**即完成 HHS Protect 的上线与首批数据接入。这一速度的核心不是「数据团队连轴转」,而是 Foundry 平台本身已经把 ontology 框架、对象建模、governed actions、PHI 合规、审计日志做成了产品级能力。在 CDC、NIH、ASPR 等多个联邦机构同时接入的紧急场景中,平台工程师主要工作是「按机构语义映射数据到既有 ontology 模板」,而不是从零搭建数据管线(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。

### 3.2 五类核心能力

HHS Protect 围绕 Foundry 提供五类核心能力(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf)):

1. **Data connection/ingestion**——连接各机构 EHRA/EMR、医院上报系统、实验室检测系统、供应链系统;
2. **Collaborative data engineering and harmonization**——跨团队协作做数据清洁、字段对齐、跨源 reconciliation;
3. **Automated deployment of interfaces & applications**——自动部署仪表盘与操作视图,适配不同机构用户角色;
4. **AI/ML forecasting**——基于 live ontology 跑预测模型(感染曲线、ICU 需求、PPE 消耗);
5. **Workflow operationalization**——把决策路径落成 governed actions(alerting、转院调拨、库存释放)。

这五类能力不是孤立的「功能模块」,而是同一组 ontology 对象上的不同 application surface。Control Tower 模块、national supply chain visibility、跨州病例与床位仪表盘等均建立在统一 ontology 之上。

### 3.3 从 COVID 应急到 SHARE 长期基础设施

2020 年的 HHS Protect 是应急场景的临时部署,但 Palantir 与 HHS 的合作并未随疫情缓解而结束。2022 年,HHS 把 Palantir 升级为 **SHARE contract**(Strategic Healthcare Alliance for Readiness and Emergency Response)——一个 5 年 **9,000 万美元** 的 BPA(Blanket Purchase Agreement),覆盖 NIH、CDC、FDA 全 HHS 机构。Akash Jain(Palantir U.S. Government President)对这一升级的公开评价是:「We are grateful for our continued partnership with HHS and the confidence in our software it is showing by selecting Palantir for a long-term, wide-ranging BPA. We are proud to provide the software backbone to some of the country's most critical public health missions.」(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。

这一合同演化的关键信号是:ontology 一旦建好,新增 use case 的边际成本极低。从 2020 年 COVID 临时应急到 2022 年 SHARE 长期基础设施,平台并未推倒重来,而是把 COVID 期间沉淀的对象模型(Patients/Cases、Facilities、Supplies、Orders/Transfers)横向扩展到 monkeypox、H5N1、RSV、opioid 等公共卫生监测场景。

## 四、本体论如何落地 ⭐

HHS Protect 案例最有价值的地方,不在「5 天上线」这个数字,而在它揭示了 Foundry Ontology 在政府应急场景的对象建模与治理边界设计。

### 4.1 对象定义:疫情作为「作业系统视图」

HHS Protect 的 ontology 把疫情视为一张「作业系统视图」,核心对象包括(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf)):

```text
hhs_protect_ontology = {
  Patient/Case:    { id, demographics, exposure_history, test_results,
                    hospitalization_status, outcome }
  Facilities:       { id, beds, icu_capacity, ppe_inventory,
                    staffing_status, outbreak_flag }
  Supplies:        { id, type(ppe|ventilator|remdesivir|antibody_cocktail),
                    quantity, location, allocation }
  Orders/Transfers:{ id, source, destination, status, authorization }
  Datasets:        { id, source_agency, update_frequency,
                    reliability_flag, markings }
}
```

一个简化对象骨架示意如下(非真实 schema):

```yaml
# HHS Protect 核心对象骨架(简化,非真实 schema)
Case:
  properties:
    case_id: string
    exposure_date: date
    test_result: enum[positive, negative, pending]
    hospitalization_id: string | null
    outcome: enum[recovered, hospitalized, deceased, unknown] | null
  relations:
    facility: Facility
    transfers: Transfer[]

Facility:
  properties:
    npi: string
    facility_type: enum[hospital, nursing_home, lab, fqhc]
    beds_total: integer
    beds_occupied: integer
    icu_total: integer
    outbreak_flag: boolean
  relations:
    supplies: SupplyInventory[]

SupplyInventory:
  properties:
    item: enum[mask_n95, ventilator, remdesivir, antibody_cocktail]
    on_hand: integer
    burn_rate_per_day: float
    allocation_priority: integer
  relations:
    facility: Facility
    allocations: Allocation[]
```

这里的关键洞察是:**Datasets 自身**也是一个 managed object——每个数据源(医院上报、实验室检测、州行政命令)都带有 source agency、update frequency、reliability flag、markings 等属性。这把数据治理从「ETL 层后置校验」提升到「对象内禀属性」,正是 2.4 节提到的「数据可靠性风险」的技术答案。

### 4.2 Action 写回:governed actions 的应急闭环

HHS Protect 上的 governed actions 涵盖数据接入、对账、告警、预测模型执行、转院调拨、库存释放等(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。每一个 action 是一次业务事件,由 Foundry pipeline 或人工触发,同时写入:

- **下游系统**:transfer order 写入医院 EHR、supply allocation 写入物流系统;
- **审计日志**:谁、在何时、出于什么目的执行了此次操作;
- **预测模型**:用实际 admission vs forecast 反馈给 probabilistic forecasting pipeline。

governed actions 的设计直接对应应急场景的高时效性——当供应链告急时,系统需要能在 governed action 框架内自动触发「调拨 + 审计 + 预测校准」三件套,而不是依赖行政协调会议。

### 4.3 治理边界:合规作为对象内禀属性

HHS Protect 的差异化做法是把 markings、HIPAA-equivalent、purpose-based access、审计日志作为对象的内禀属性,而非上线后再补的合规层(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf)):

```text
Case {
  ...
  markings:           ["PHI", "deidentified_for_forecasting"]
  purpose_access:     ["federal_response", "state_aggregation", "research_opt_in"]
  source_reliability: ["high" | "medium" | "low"]
  audit_trail:        [...linked actions with operator + timestamp]
}
```

这一架构使 30+ 机构的用户能在同一份 ontology 上协作,各自只看到与自己 purpose 匹配的视图;同时所有访问与变更都被完整审计。WJS 报道的合同演进(从 2,500 万美元初始扩展到 9,000 万美元 SHARE BPA)说明,一旦治理边界在技术层落实,新增 use case 不需要重新谈合规,这是 SHARE 长期合同能成立的技术前提。

### 4.4 关键边界:本体论平台 vs. 数据所有权

HHS Protect 案例还有一个常被误读的关键澄清——Palantir **不参与健康数据本身的存储**(来源: [FedScoop](https://fedscoop.com/palantir-covid-19-coronavirus-data-cdc-hhs))。所有原始医疗数据仍由各机构(HHS、CDC、医院、实验室)保留,Palantir 仅提供 Foundry 工具与 ontology 层用于数据清洁与协调。这一点对理解本体论平台至关重要:**ontology 是协作与决策层,不是数据所有权层**。这一边界若被混淆,会导致「数据集中化」与「合规冲突」同时发生。

## 五、可借鉴的开发范式

HHS Protect 沉淀出三条对任何应急数据平台都关键的可迁移范式。

### 5.1 Ontology-as-Emergency-Infrastructure(本体论作为应急基础设施)

公共卫生应急场景中,ontology 必须 5 天内从零搭建完成,这意味着 **平台选型比建模深度更重要**。Palantir 在 Spring 2020 仅 5 天就上线,说明 ontology 框架本身已是产品级能力——平台选对了,后续的对象映射与跨源对账可以走模板化路径;平台选错了,即使建模深度再高也无法在应急窗口期交付。这一范式同样适用于自然灾害、能源紧急状态、供应链中断等场景:ontology 不是「建好后再用」,而是「必须在危机中可立即调用」的基础设施(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。

### 5.2 Government-grade access control

markings、HIPAA-equivalent、purpose-based access、审计日志作为对象属性内嵌,而不是 IT 层后置,这对任何做政企 ontology 的项目都至关重要。HHS Protect 之所以能在 30+ 联邦机构、50 个州卫生部、数千医院同时接入,正是因为每一类对象的访问范围与审计要求都在 ontology 层被显式定义,机构间无需为「我能不能看这份数据」反复协调。这一范式可迁移到金融监管、能源调度、跨企业供应链协同等所有需要多方协作但数据敏感的领域(来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))。

### 5.3 Compute on live data, not snapshots

HHS Protect 的 AI/ML forecasting 不是跑在每日快照上,而是直接跑在 live ontology 上——新数据进来立即反馈到预测模型。这正是匿名 CDC 官员所说的「It is a platform. It isn't a panacea.」的反面:**当数据源可靠时,平台把数据科学家想做的工作事层——实时计算、跨源对账、模型反馈——都已经替他做好了**。这一范式意味着,ontology 的核心价值不是「存数据」,而是「让计算跑在语义正确、治理合规的最新视图上」(来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))。

## 六、启示与跨案例可迁移经验

### 6.1 对应急数据平台

任何跨机构应急数据平台的核心矛盾都是「时间窗口极短 vs 数据极端分散」。HHS Protect 的答案是 **ontology 框架产品化**——把对象建模、跨源对账、governed actions、PHI 合规做成可立即调用的产品能力,让平台工程师主要工作变成「按机构语义映射数据到既有 ontology 模板」,而不是从零搭建。这一思路对应急管理、自然灾害、能源调度等场景都直接可迁移。

### 6.2 对政府级数据合作

HHS Protect 揭示的另一个反直觉结论是:**数据所有权与本体论平台必须解耦**。所有原始医疗数据仍由各机构保留,Palantir 仅提供 ontology 层用于清洁与协调。这一边界若被混淆,会立刻触发「数据集中化」与「合规冲突」的双重反弹。任何政府级数据合作项目都应在架构层面明确这一边界,而不是寄希望于合同文本的措辞。

### 6.3 对本体论平台选型

HHS Protect 从 2020 年的应急部署演进为 2022 年的 SHARE 长期 BPA,说明 ontology 平台的真正价值不在「一次性项目交付」,而在「一次建好、长期复用」。这意味着选型时应当重点考察:(1) 框架本身是否产品级(能否在 5 天内承接国家级跨机构场景);(2) 治理边界是否能内嵌到对象属性;(3) 模型是否能跑在 live data 而非 snapshot。满足这三条的平台,后续 use case 扩展的边际成本才会接近零。

## 关键数字与引语

| 指标 | 数值 | 来源 |
|---|---|---|
| 上线时间 | 5 天(Spring 2020) | [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf) |
| 跨机构用户 | ~3K / 30+ 机构 | [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf) |
| 数据源 | 300+(联邦/地方/私营) | [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf) |
| 数据点 | ~25 亿 | [Business Insider](https://www.businessinsider.com/hhs-protect-palantir-healthcare-data-coronavirus-trump-2020-5) |
| 合同演进 | $25M 初始 → $90M / 5 年 SHARE BPA(2022) | [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf) |

**引语**:

> "We are grateful for our continued partnership with HHS and the confidence in our software it is showing by selecting Palantir for a long-term, wide-ranging BPA. We are proud to provide the software backbone to some of the country's most critical public health missions."
> —— Akash Jain, President, Palantir U.S. Government (来源: [Palantir PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf))

> "It is a big leap forward. They are making major progress in this pandemic."
> —— Dr. Wilbert van Panhuis, Epidemiologist, University of Pittsburgh (来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))

> "It is a platform. It isn't a panacea. Some of the outside data sources HHS Protect depends on — including the hospital data from Teletracking — aren't reliable, sometimes showing that a hospital had a negative number of patients in beds."
> —— Anonymous CDC official (来源: [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect))

## 来源与外部补充

- **主源**: [Palantir Emergency Preparedness, Response, and Recovery PDF](https://www.palantir.com/assets/xrfr7uokpv1b/1EE4kLUXymcHCQ68Xo2OzQ/8cbc5cc985ff4c3cddffdeb292c2967a/Emergency_Preparedness__Response__and_Recovery.pdf)
- **外部补充**:
  - [Center for Public Integrity](https://publicintegrity.org/health/coronavirus-and-inequality/secretive-data-system-shaping-pandemic-response-hhs-protect) — 「过去几十年美国公共卫生监测最大的飞跃之一」,但同时披露数据可靠性风险
  - [FedScoop](https://fedscoop.com/palantir-covid-19-coronavirus-data-cdc-hhs) — Palantir 不参与健康数据本身存储,仅提供 Foundry 工具
  - [Business Insider](https://www.businessinsider.com/hhs-protect-palantir-healthcare-data-coronavirus-trump-2020-5) — 25 亿条数据点,供应商自愿提供

## 相关案例

- [world-food-programme](./10-world-food-programme.md) — 同属「政府级 Ontology 紧急基础设施」范式(5 天上线 vs 多年演化)
- [concordance](./09-concordance.md) — 互补:HHS Protect 是国家级多机构 ontology,Concordance Surgence 是企业级多组织 ontology
- [cleveland-clinic](./06-cleveland-clinic.md) — 对比:HHS Protect 是应急批量 ontology,Cleveland 是稳态医院 ontology
- [tampa-general-hospital](./08-tampa-general-hospital.md) — 互补:Tampa 在 24 小时内上线 Hurricane Ian 灾害响应 app,HHS Protect 用 5 天上线全国流行病学平台——两者都展示 Foundry 框架本身的「产品级稳定性」
- [本体论范式手册](./99-ontology-paradigms.md) — 范式 6(治理分层 + PBAC)主要引用本案例