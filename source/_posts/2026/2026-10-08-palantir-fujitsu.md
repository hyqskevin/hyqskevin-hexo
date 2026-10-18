---
title: Fujitsu 本体论
date: 2026-10-08 00:00:00
description: 日本最大 IT 服务商 Fujitsu 自 2020 年与 Palantir 合作，40+ 业务系统接入 Foundry，15,000+ 用户、100+ 工程师、85% 系统联通；3 个月省 900 万美元，并为某制造商客户 1 年省 1,000 万美元。2025 年升级为 Global FDE Partner，揭示 IT 服务公司"内部实战 → 客户赋能"的范式。
categories:
  - Palantir
  - 本体论案例
tags:
  - Palantir
  - Foundry
  - Fujitsu
  - Global FDE Partner
  - IT 服务
  - 供应链韧性
  - 制造业
---

## 一、业务背景：IT 服务巨头的"自身现代化"命题

Fujitsu（富士通）是日本最大的 ICT 服务公司，业务遍及 100+ 国家、13 万员工，提供从服务器/存储硬件、软件、咨询到系统集成、运维管理的全栈服务。这家成立于 1935 年的科技巨头，本身就是"大型制造 + 供应链 + 服务运营"的复合体——它既是硬件供应商（PRIMERGY 服务器、ETERNUS 存储），又是日本制造业的核心 IT 服务商，还为跨国企业提供数字化转型咨询。

这种业务结构让 Fujitsu 同时背负三重任务：

- **数字化转型**：帮助客户上云、上数据平台、上 AI。
- **自身运营现代化**：把自己 40+ 业务系统打通，让内部运营不再依赖人工报表和邮件协调。
- **为客户输出业务**：把内部实战过的方案产品化，再卖给自己的制造业、零售业客户。

Fujitsu 与 Palantir 的合作，正是从第二项任务开始，逐步扩展到第三项的典型样本（来源: [palantir.com](https://www.palantir.com/impact/fujitsu/))。

### 1.1 行业坐标

与 Accenture 主导的"咨询 + 数据平台外包"路线不同，Fujitsu 选择的是**"先把 Palantir 用透自己，再卖给客户"**的内化路径。这条路径与 [swiss-re](./15-swiss-re.md) 的"内部 200+ 项目"路线呼应，但 Fujitsu 的特殊之处在于：**它是 Palantir 在亚太的首个 Global FDE Partner**——这意味着 Fujitsu 不仅自己用 Foundry，还在为 Palantir 的日本客户做实施交付。

## 二、挑战：40+ 系统未打通的"信息烟囱"

Fujitsu 的现代化挑战典型到可以写进任何一本《企业架构》教科书：

1. **全球 40+ 业务系统未打通**：ERP（SAP/Oracle）、SCM、HR、财务、服务管理（ServiceNow 类）、制造执行系统（MES）——每个部门一套，跨系统的"主数据对齐"长期靠人工。
2. **硬件业务的库存悖论**：服务器和存储业务同时面临过剩与缺货——某型号新加坡仓库存压 3 个月，但大阪工厂的客户订单等不到货。
3. **跨国协同难**：日本总部 + 海外子公司 + 集团公司之间的财务/资源/供应链计划，必须在 Excel 里手动对齐，每月关账耗时 10+ 天。
4. **零中断约束**：Fujitsu 自身在运营现代化过程中不能停摆——它正在为客户做业务连续性方案，自己不能"实施到一半宕机"。

Fujitsu 内部把这描述为："integrating disparate data into a single pane of glass to drive digital transformation"（把分散的数据整合到单一视图中，驱动数字化转型）。这是典型的"common operating picture"诉求——但对一家 13 万员工、100+ 国家、40+ 业务系统的公司来说，实现 single pane of glass 几乎是企业架构的"圣杯"（来源: [palantir.com](https://www.palantir.com/impact/fujitsu/))。

### 2.1 为什么传统方案不够用

传统的数据仓库 + BI 方案（如 Informatica + Tableau）解决的是"看数据"，但解决不了"动数据"。Fujitsu 需要的是能在 ERP/HR/SCM 之上建立**可写回的操作层**——这正是 Palantir Foundry 的 kinetic 层 + dynamic 层设计的核心能力。

## 三、Palantir 解决方案：三阶段演进

Fujitsu 与 Palantir 的合作自 2020 年起，分三阶段演进：

### 3.1 第一阶段（2020-2023）：40+ 系统"days not years"集成

Fujitsu 在这一阶段完成了 40+ ERP/业务系统的 Foundry 接入。Palantir 的 Ontology 让每条数据从"表里的字段"变成"语义化的对象"——Product（产品）、Factory（工厂）、Supplier（供应商）、Contract（合同）、ServiceTicket（服务工单）、Engineer（工程师）、Inventory（库存）。

集成时长被压缩到"days not years"——这是 Palantir 在日本市场最具说服力的卖点。对比传统 ETL 项目动辄 6-12 个月，Foundry 的 ontology-driven 集成让 Fujitsu 在 3 个月内就完成了原本预算 2 年的工作量（来源: [palantir.com](https://www.palantir.com/impact/fujitsu/))。

### 3.2 第二阶段（2023-2025）：全球分销协议

2023 年，Fujitsu 与 Palantir 签全球分销协议，正式在日本销售 Foundry。这意味着 Fujitsu 不只是 Palantir 的客户，还是 Palantir 在亚太的分销渠道——这与 Accenture 的"Foundry on Accenture"路线类似，但 Fujitsu 更进一步（总部位于东京，全日本总部）——它直接拿到了分销权。

这一阶段的成果：

- 15,000+ 内部 Foundry 用户（覆盖采购、销售、运营、财务多条线）
- 100+ Foundry Engineer（Fujitsu 内部的 ontology 工程师团队）
- 85% 业务系统联通率
- 50+ 运营应用（涵盖需求预测、库存控制、警报系统、服务工单分派）
- 来源: [Fujitsu AIPCon 4 主题分享](https://www.youtube.com/watch?v=JBvUK_EOod8)

### 3.3 第三阶段（2025-2026）：AIP 许可 + Global FDE Partner

2025 年 8 月，Fujitsu 与 Palantir 签 AIP（Artificial Intelligence Platform）许可，从 Foundry 阶段升级到 AIP 阶段，开始在企业内部部署 LLM 驱动的 AI Agent。

2026 年 9 月，Fujitsu 升级为 Palantir **全球 FDE（Forward Deployed Engineer）合作伙伴**——这是 Palantir 在亚太的首个全球 FDE 合作伙伴。FDE 的本质是"在客户部署 Palantir 的工程师"，Fujitsu 现在既是为自己的客户做 FDE 实施，也是为 Palantir 在日本的客户提供 FDE 服务（来源: [Fujitsu 2025 新闻](https://global.fujitsu/en-global/pr/news/2025/08/19-01-en)）。

## 四、关键数字与 ROI

Fujitsu 案例提供了 IT 服务行业稀缺的"ontology 量化 ROI"：

### 4.1 内部节省：3 个月省 900 万美元

Fujitsu 在硬件业务部部署 Foundry，把 SAP、Oracle ERP、MES、CRM、服务管理平台的数据整合进单一视图，构建了实时需求预测、库存控制、警报系统。**3 个月内实现 900 万美元的年化成本下降**。

> "We've combined Foundry's data integration capabilities and Fujitsu's machine learning AI to transform our operations … creating alert systems, demand forecasting, inventory control systems, and so on. This transformation resulted in an impressive annual cost reduction of $9M within just 3 months."
> —— Kazuki Hiraiso，Data Scientist, Fujitsu（来源: [palantir.com](https://www.palantir.com/impact/fujitsu/))

### 4.2 客户赋能：某日本制造商 1 年省 1,000 万美元

Fujitsu 为某日本制造商客户做供应链韧性方案，整合 **3,000+ 供应商、18 个工厂**的数据进 Foundry，建立供应链 ontology：

- 1 年节省 1,000 万美元
- 运营生产力翻倍
- 灾韧性恢复时间从 10 天压缩到 2 天
- 来源: [Fujitsu 2026 公告](https://global.fujitsu/en-global/pr/news/2026/09/10-01)

### 4.3 规模指标

| 指标 | 数值 | 来源 |
|---|---|---|
| 全球员工 | 130,000 | [palantir.com](https://www.palantir.com/impact/fujitsu/) |
| 覆盖国家 | 100+ | [palantir.com](https://www.palantir.com/impact/fujitsu/) |
| 集成业务系统 | 40+ | [palantir.com](https://www.palantir.com/impact/fujitsu/) |
| 集成时长 | days not years | [palantir.com](https://www.palantir.com/impact/fujitsu/) |
| Foundry 内部用户 | 15,000+ | AIPCon 4 |
| Foundry Engineer | 100+ | AIPCon 4 |
| 系统联通率 | 85% | AIPCon 4 |
| 运营应用 | 50+ | AIPCon 4 |
| 内部 3 个月节省 | $9M 年化 | [palantir.com](https://www.palantir.com/impact/fujitsu/) |
| 制造商客户 1 年节省 | $10M + 生产力翻倍 + 灾韧性 10→2 天 | [Fujitsu 2026 公告](https://global.fujitsu/en-global/pr/news/2026/09/10-01) |
| 合作演进 | 2020 合作 → 2023 全球分销 → 2025 AIP + Global FDE Partner | [Fujitsu 2025 新闻](https://global.fujitsu/en-global/pr/news/2025/08/19-01-en) |

## 五、本体论如何落地 ⭐

Fujitsu 的本体论落地是 IT 服务行业的标杆样本：

### 5.1 Object 定义

- **Product**：服务器（PRIMERGY）、存储（ETERNUS）、服务产品
- **Factory**：自有制造工厂 + 客户代工厂
- **Supplier**：3,000+ 供应商（覆盖电子元件、机箱、电源等）
- **Customer**：B2B 客户（按行业、按地区）
- **Contract**：销售合同、采购合同、服务合同
- **ServiceTicket**：运维工单
- **Engineer**：现场工程师 + ontology 工程师
- **Inventory**：仓库、SKU、批次

### 5.2 Link Type 设计

- `Product manufactured_at Factory`（产品由工厂生产）
- `Supplier supplies_to Factory`（供应商供货到工厂）
- `Contract covers Customer`（合同覆盖客户）
- `ServiceTicket assigned_to Engineer`（服务工单分派给工程师）
- `Inventory stored_at Warehouse`（库存存储在仓库）

### 5.3 Function/Action 写回

Action Type 包括：

- 调整生产计划（`AdjustProductionSchedule`）
- 下发采购单（`IssuePurchaseOrder`）
- 修改合同条款（`UpdateContractTerms`）
- 分派服务工单（`AssignServiceTicket`）

这些 Action 不是"按钮"，而是 ontology 级别的操作——每一步都受 dynamic 层的权限、合规、商业机密保护约束。

### 5.4 治理边界：kinetic vs dynamic 分层

- **kinetic 层**：负责把 SAP、Oracle ERP、MES、CRM、服务管理平台的原始数据接入 Foundry。
- **dynamic 层**：执行 Fujitsu 复杂的跨国合规（GDPR、日韩数据本地化）+ 商业机密权限（不同业务线只能看自己的数据）。

### 5.5 差异化：把"内部实战"外溢为商业服务

Fujitsu 与其他 IT 服务商最大的不同，是它**把内部实战成本均摊后转化为客户产品**——它的数字孪生能力、供应链韧性方案，原本是为自身硬件业务做的，现在被打包成"Foundry on Fujitsu"卖给制造业客户。

这种"内部实战 → 产品化"的路径，比 [swiss-re](./15-swiss-re.md) 的"200+ 项目"更具体——Fujitsu 直接给出了可量化的 ROI 数字（$9M 内部 + $10M 客户），这是 IT 咨询行业最稀缺的"ontology 商业化证据"（来源: [Fujitsu AIPCon 4 主题分享](https://www.youtube.com/watch?v=JBvUK_EOod8)）。

## 六、可借鉴的开发范式

### 6.1 IT 服务公司"先用自己 10 年再交付客户"

Fujitsu 是继 Accenture 之后的第二个标杆——**IT 服务公司本身用 ontology 自训，再把能力外溢给客户**。这条路线对国内的联想、用友、东软等 IT 服务商有直接借鉴意义：与其一开始就给客户做"空降 ontology"，不如先在自己公司内部跑通 1-2 个业务线（财务、HR、供应链），再用实战案例说服客户。

### 6.2 "内部用例 → 客户解决方案套件"

Fujitsu 的"内部实战 → 客户产品"路径是"业务模板库建设"最清晰的样本。它的具体做法是：

1. 在内部部署 Foundry（自己当小白鼠）
2. 跑通 50+ 运营应用（沉淀 15,000+ 用户的使用模式）
3. 把高频用例（需求预测、库存控制、服务工单分派）抽成"行业模板"
4. 用这些模板给制造业客户做 3 个月快速实施

这条路径避免了"咨询公司从零搭 ontology"的试错成本，也避免了"客户自己做不熟悉工具"的实施风险。

### 6.3 合作成熟度路线图

Fujitsu 与 Palantir 的合作给出了清晰的演进路线图：

- **2020 合作**（客户阶段）：Fujitsu 自己用 Foundry
- **2023 全球分销**（渠道阶段）：Fujitsu 在日本卖 Foundry
- **2025 AIP 许可**（产品升级阶段）：从 Foundry 升级到 AIP
- **2026 Global FDE Partner**（深度合作阶段）：成为 Palantir 在亚太的 FDE 实施伙伴

这条路线对任何想与 Palantir 深度合作的企业有借鉴意义——从"客户"到"渠道"到"FDE Partner"是渐进式的合作升级，每一步都需要证明价值（内部用例成熟度、市场销售能力、实施交付能力）。

## 七、失败模式与启示

Fujitsu 案例也揭示了几个值得警惕的失败模式：

### 7.1 失败模式 1：跳过"内部实战"直接交付客户

如果 Fujitsu 在 2020 年就试图把 Foundry 卖给日本制造商，而它自己都没用过——大概率会失败。它选择"先在自己内部跑 3 年"，积累 15,000+ 用户、100+ 工程师的实战经验后，再做客户赋能。这是"先做小白鼠再做医生"的策略。

### 7.2 失败模式 2：把"系统联通率 85%"当成 100%

Fujitsu 公开的数据是 85% 系统联通，不是 100%。这说明即使有 Palantir 的 ontology 框架，仍然有 15% 的系统因为历史遗留、监管、商业等原因无法联通。**不要承诺"打通所有系统"**——应该把 85% 联通作为现实目标，剩下的 15% 用其他方式（人工报表、临时 ETL）补充。

### 7.3 启示：IT 服务行业的"内化-外溢"范式

Fujitsu 案例的最大启示，是 IT 服务行业可以走"内化-外溢"路线：

- **内化**：在自己公司内部用 Palantir，把内部实战成本（如 $9M）摊薄到 3 个月
- **外溢**：把内部实战转化为客户产品（如 $10M 节省案例），实现能力变现
- **升级**：从"客户"升级到"渠道"再到"FDE Partner"，建立长期护城河

这条路线比"纯咨询 + 解决方案外包"的传统 IT 服务业务更有护城河——你不仅有咨询能力，还有 ontology 工程能力 + 内部实战验证 + 客户实施经验。

## 八、总结

Fujitsu 是 IT 服务行业 ontology 内化最深的公司之一：

- **规模**：15,000+ Foundry 用户 + 100+ Foundry Engineer + 85% 系统联通 + 50+ 运营应用
- **ROI**：3 个月内部省 $9M + 1 年客户省 $10M
- **护城河**：从"客户"到"渠道"到"Global FDE Partner"的合作成熟度

对于任何想用 ontology 改造 IT 服务业务的咨询公司、系统集成商，SaaS 平台，Fujitsu 给出了一个清晰的范式：**先把自己当小白鼠，再用实战说服客户**。

## 来源

- [palantir.com/impact/fujitsu](https://www.palantir.com/impact/fujitsu/)
- [Fujitsu 2025 官方新闻](https://global.fujitsu/en-global/pr/news/2025/08/19-01-en)
- [Fujitsu 2026 公告](https://global.fujitsu/en-global/pr/news/2026/09/10-01)
- [Fujitsu AIPCon 4 主题分享](https://www.youtube.com/watch?v=JBvUK_EOod8)