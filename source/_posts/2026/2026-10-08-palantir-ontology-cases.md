---
title: Palantir 本体论案例
date: 2026-10-08 00:00:00
description: 15 个 Palantir 官方 Impact Story 横向盘点：从 Airbus 到 Sompo，11 个行业落地路径、关键数字与可复用范式（Object→Action 闭环、多业务线共用 Ontology、Field-first 写回等）。
categories:
  - notes
tags:
  - Palantir
  - Ontology
  - Foundry
  - 数据中台
  - 企业案例
  - 数字化转型
---

Palantir 的 Ontology（本体论）是什么？不是哲学概念，而是企业里**可被数字化的实体（Object）+ 可被执行的写回（Action）+ 治理边界**三件套。从航空、重型机械、能源、医疗、媒体、再保险到 IT 服务，Palantir 官方公开了 15 个 Impact Story，覆盖 11 个行业。本文做一次横向盘点：先看对比表，再抽 5-8 个案例细节，最后提炼 5-8 条可复用范式。

## 一、15 个案例横向对比

| # | 案例 | 行业 | 本体论焦点 | 关键数字 | 核心范式 |
|---|---|---|---|---|---|
| 01 | Airbus + Skywise | 航空制造 | 行业平台 + Aircraft BOM | +33% A350 交付 / 12,000+ 飞机 | 单租户 → 多租户 Ontology 平台 |
| 02 | Doosan Infracore + DI360 | 重型机械 | Machine + Claim + MarketSignal | 3 大工作流闭环 | 多部门 virtuous cycle |
| 03 | Jacobs + Agua Nueva | 水务 | Blower + Setpoint Action | -20% 厂用电 / -25% 电耗 | Field-first Action（每天 2 封邮件） |
| 04 | Kinder Morgan + 7-Day DST | 能源储运 | Gas Storage + Pipeline + Market | 2-3 小时 → 2-3 分钟 | Common Operating Picture + 决策支持 |
| 05 | Sonnedix + MetaConstellation | 可再生能源 | Tracker Panel + 卫星 CV | 100% 远程监控 / -20% 失效损失 | 外部世界数据纳入本体论 |
| 06 | Cleveland Clinic | 医疗 | patients/beds/staff/equipment | -75% 容量计算 / +10% 转院 | PHI 合规 + bedside-out |
| 07 | HHS & CDC + HHS Protect | 公共卫生 | 300+ data sources / multi-agency | 5 天上线 / 25 亿数据点 | Ontology-as-Emergency-Infrastructure |
| 08 | Tampa General + Hospital Sync | 医疗 | Care Coordination OS | -83% 安置时间 / -30% 脓毒症住院日 | iOS 类比 + 1→12+ use cases |
| 09 | Concordance + Surgence | 医疗供应链 | bidirectional objects | 4,000+ 供应商 / 30/60/90 天预警 | Bidirectional Object + 生态 |
| 10 | WFP + DOTS | 人道主义 | dynamic ontology | 121M 人 / $30M 节省 / 98% 覆盖 | Dynamic ontology + 公共部门治理 |
| 11 | Axel Springer | 媒体 | reader/article/subscription | 跨业务线 LTV 预测 | 多业务线共用 Ontology 视图 |
| 12 | Ringier | 媒体 | newsroom operating system | 85% 编辑每天使用 | 非技术用户直接消费 Ontology |
| 13 | Swiss Re | 再保险 | policy/claim/portfolio | 170% ROI / 7.3 月回本 | Single analytical data foundation |
| 14 | Sompo | 保险+养老 | RDP / sensor/resident/policy | $60M 利润改善 / $100M 预期 | 合资模式 + 灾害响应 2 周上线 |
| 15 | Fujitsu | IT 服务 | common operating picture | 15,000+ 用户 / 85% 系统联通 | Global FDE Partner / 内部实战转客户 |

数据来源：[Palantir Impact Stories](https://www.palantir.com/impact-stories/)。

## 二、4 大行业聚类

15 个案例不是平铺，可以按本体论焦点归为 4 类：

### 2.1 物理资产 Object + Action 写回飞轮

代表：Airbus、Doosan、Jacobs、Sonnedix、Kinder Morgan、Fujitsu 制造业客户。

共同点：**先建模实体（机器/管道/光伏板），再让决策写回现场**。例如 Jacobs 的水务厂把"鼓风机"和"设定值"做成 Object + Action，工程师每天收到 2 封邮件，直接在邮件里点击确认或调整 Setpoint，**不再需要打开 SCADA 系统**。

### 2.2 医院 / 医疗本体论

代表：Cleveland Clinic、Tampa General、HHS Protect、Sompo 养老。

共同点：**把床位、医生、设备、患者都当成 Object**，再围绕它们编排护理、转院、应急流程。Cleveland Clinic 把容量计算时间压掉 75%，Tampa General 把患者安置时间压掉 83%。

### 2.3 多组织 / 决策支持

代表：Concordance Surgence、WFP DOTS、Swiss Re。

共同点：**多个外部组织共享一份 Ontology**，靠治理分层（PBAC）和 Bidirectional Object 解决数据归属。Concordance 把 4,000+ 供应商接入同一个供应链本体论，30/60/90 天库存可替代性实时可见。

### 2.4 媒体 B2C 数据孪生

代表：Axel Springer、Ringier。

共同点：**把读者、文章、订阅做成 Object**，让非技术编辑直接在 Ontology 上操作——Ringier 85% 编辑每天使用，没有 SQL 也能跑数据查询。

## 三、5 个代表性案例细节

下面挑 5 个最能体现本体论设计的案例展开。

### 3.1 Airbus Skywise：从单租户到行业平台

Airbus 是最早把 Foundry 用成"行业平台"的客户。Skywise 原本只是 Airbus 内部用来管理 A350 交付链的本体论（BOM、工序、供应商），后来开放给 12,000+ 飞机的运营商做预测性维护。**核心范式是"单租户 → 多租户 Ontology 演化"**：同一种 Aircraft Object，Airbus 自己看到的是制造视角，航司看到的是运营视角，治理边界由 PBAC（Purpose-Based Access Control）按"用途"切分，不是按"用户"切分。

关键数字：**A350 交付速度 +33%**（来源：[Palantir Impact Story - Airbus](https://www.palantir.com/impact-stories/airbus/)）。

### 3.2 HHS Protect：5 天上线 25 亿数据点

2020 年新冠期间，HHS 和 CDC 需要把全美医院床位、检测试剂、供应链数据实时整合到一张图上。Palantir 5 天完成部署，**接入 300+ 数据源，累计 25 亿数据点**。这不是传统 BI 项目的"几个月上线"，而是把 Ontology 当作**应急基础设施**——Object 定义可以事后改，Action 写回先打通。

来源：[Palantir Impact Story - HHS](https://www.palantir.com/impact-stories/hhs/)，批评性视角见 [Center for Public Integrity](https://publicintegrity.org/) 关于数据可靠性的报道。

### 3.3 Tampa General Hospital Sync：iOS 类比

Tampa General 把医院本体论叫 **Hospital Sync**，类比 iOS：本体论是操作系统（OS），每个 use case 是一个 App。**第一个 App 是脓毒症早期识别**（-30% 住院日），然后扩散到床位管理、患者安置、急诊分流等 12+ 个 use case。

关键数字：**患者安置时间 -83%**。来源：[Palantir Impact Story - Tampa General](https://www.palantir.com/impact-stories/tgh/)。

### 3.4 Swiss Re：170% ROI 由 Nucleus 独立测算

再保险巨头 Swiss Re 用 Foundry 统一了 policy、claim、portfolio 三类 Object，搭出一个跨精算、跨承保、跨理赔的统一分析数据底座。第三方机构 **Nucleus Research** 独立测算 ROI **170%**，回本周期 **7.3 个月**——这是少数有"独立第三方 ROI 报告"的 Palantir 案例。

来源：[Nucleus Research - Swiss Re Case Study](https://nucleusresearch.com/)。

### 3.5 Sompo：合资模式 + 灾害响应 2 周上线

日本保险+养老巨头 Sompo 和 Palantir 合资成立 Palantir Japan，**$60M 利润改善已实现**，预期 **$100M**。最大的亮点是灾害响应：地震/台风后，**2 周内就能上线一套应急调度 Ontology**（sensor、resident、policy 三类 Object 联动），靠的是事前已经搭好的本体论骨架。

来源：[Sompo Holdings + Palantir](https://www.sompo-hd.com/en/)。

## 四、5-8 条可复用范式

从 15 个案例里抽出的本体论落地范式，按"必须 → 加分 → 高级"分层。

### 4.1 范式 1：Object → Action → Write-back 闭环 ⭐ 必学

本体论不是"画一张实体关系图"，而是 **Object 能被 Action 改写，Action 的结果写回 Object**。Jacobs 水务厂的鼓风机 Setpoint 被调整后，**实际功耗立刻反馈到 Object 的 KPI**，下一封调度邮件自动基于新数据生成。**没有 Write-back 的 Ontology 只是 ER 图**。

### 4.2 范式 2：多业务线共用 Ontology 视图

Axel Springer 旗下有新闻、招聘、电商多个业务线，每个业务线都跑在**同一套订阅者本体论**上，但只看到自己的字段（PBAC 按用途切分）。**好处是一次建模，跨业务线 LTV（生命周期价值）预测直接联动**。

### 4.3 范式 3：Field-first Action（写回邮件/移动端）

Doosan、Jacobs、Tampa General 都在用同一种模式：**Action 不在 Foundry 里点，而是在邮件/手机推送里点**。工程师不用登录系统，在邮件里"批准/拒绝"一个 Setpoint 调整，写回自动触发。**这条范式决定了 Ontology 能不能被一线使用**。

### 4.4 范式 4：外部世界数据纳入本体论

Sonnedix 把**卫星图像 + 计算机视觉**识别到的光伏板故障，**作为 Object 状态写回本体论**，现场人员根本不用爬屋顶看。**任何"线下世界的状态"都可以被 CV/卫星/IoT 数字化后注入 Object**——这是 Physical AI + Ontology 的标准接法。

### 4.5 范式 5：多部门 virtuous cycle

Doosan Infracore 的 DI360 跑通 3 大工作流的闭环：

```text
设备故障 (Machine) → 理赔 (Claim) → 市场信号 (MarketSignal)
       ↑                                              ↓
       └──────────── 产品改进 ←────────────────────────┘
```

**不是单点优化，而是三个部门的 Object 互为输入**，飞轮越大，预测越准。

### 4.6 范式 6：治理分层 + PBAC

医疗（WFP、Surgence）、金融（Swiss Re）、政府（HHS）场景都对**谁能看什么字段、谁能触发什么 Action**极度敏感。Palantir 的答案是 **PBAC（Purpose-Based Access Control）**——按"用途"而不是"角色"授权。同一个 Patient Object，护士看到的字段和保险公司看到的字段不同，**因为用途不同**。

### 4.7 范式 7：Bidirectional Object + Common Operating Picture

Concordance Surgence 把 4,000+ 供应商接进同一个 Object 仓库，**任何一方改了库存，其他方 5 秒内看到**。这是 **Bidirectional Object（双向对象）**——Object 不是单方面的快照，而是**有写权限的多方共视图**。瑞士再保险、联合国 WFP 都用这个范式做跨组织协调。

### 4.8 范式 8：Operating System 比喻 + Deployed Engineer

Tampa General 的 Hospital Sync 类比 iOS，每个 use case 是 App；Fujitsu 派 **Deployed Engineer（驻场工程师）**长期嵌入客户现场，平均驻场 18 个月。**本体论不是一次性项目，是长期工程**——驻场模式决定了 Ontology 能不能"长"出来。

## 五、落地优先级

如果你的企业想从某个范式起步，建议顺序：

1. **先做范式 1（Object→Action→Write-back 闭环）**：没有写回的 Ontology 等于 ER 图。
2. **再上范式 6（治理分层）**：数据一旦进 Ontology，合规/权限没设计好就是定时炸弹。
3. **第三步范式 4（外部数据注入）**：把卫星/CV/IoT 数据接进来，Object 才"活"。
4. **第四步范式 2/7（多业务线/Bidirectional）**：从单部门扩展到跨组织。
5. **最后范式 3/5/8（Field-first/virtuous cycle/驻场）**：决定能不能规模化。

## 六、参考与延伸阅读

- 主源：[Palantir Impact Stories](https://www.palantir.com/impact-stories/)（15 条官方案例）
- 第三方测算：[Nucleus Research](https://nucleusresearch.com/)（Swiss Re ROI 170%）
- 行业媒体：[Smart Water Magazine](https://smartwatermagazine.com/)、[Equipment Journal](https://www.equipmentjournal.com/)、[Reinsurance News](https://www.reinsurancene.ws/)
- 批评性视角：[Center for Public Integrity](https://publicintegrity.org/)（HHS Protect 数据可靠性）、[France 24](https://www.france24.com/)（WFP 治理与伦理）
- 学术：[INFORMS Edelman Award](https://www.informs.org/Recognizing-Excellence/INFORMS-Prizes/Edelman-Award)（WFP 获奖）
- 代码参考：GitHub 上的 Foundry Ontology OSS 实现（`palantir-ontology-strategy`、`foundry-ontology-open`、`operational-ontology`、`CareFlow-AI-Ontology`）

## 七、一句话总结

> Palantir Ontology 在 15 个 Impact Story 里反复出现的不是某种 AI 神技，而是 **Object 能被 Action 改写、改写结果又回到 Object** 这个闭环——再叠加治理分层、外部数据注入、驻场工程，才让 11 个行业、几十种业务场景跑得通。