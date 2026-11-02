---
title: Palantir 本体论 10 范式
date: 2026-10-08 00:00:00
description: 从 15 个 Palantir Impact Story 横向提炼的 10 条可复用本体论范式,涵盖 Object-Action 闭环、Field-first Action、PBAC 治理、Bidirectional Object、生态合作等核心做法,每条含适用场景、关键步骤、来源案例与失败模式。
categories:
  - notes
tags:
  - Palantir
  - Ontology
  - Foundry
  - 数据架构
  - 案例研究
  - AI落地
  - 数字化转型
---

## 总览:从 15 个案例到 10 条范式

把 Palantir Foundry 落地拆开看,真正可复用的不是工具,而是**工程模式**。本手册从 15 个公开案例(Airbus、Cleveland Clinic、Tampa General、Sonnedix、Doosan、Concordance、WFP、HHS-CDC、Fujitsu、Sompo、Swiss Re、Axel Springer 等)中横向提炼 10 条范式。它们不是孤立技巧,而是搭建一个完整 ontology 项目的核心积木,实际项目通常组合使用 5-8 条。

为什么是这 10 条,而不是 7 条或 15 条?三条筛选标准:

1. **跨案例复现**:同一条做法在 ≥3 个不同行业出现(如 write-back 闭环出现在 Airbus / Cleveland / Tampa 三家)
2. **可拆解为步骤**:每条能写成 3-5 步可执行清单,不是抽象口号
3. **失败模式可识别**:能说清"什么情况下会失效",避免被包装成"银弹"

10 条范式按实现层次分四层:

- **对象与执行核心**(范式 1-3):落地 ontology 的最小集
- **数据接入与治理**(范式 4-6):把外部世界和合规纳入本体
- **协同与叙事**(范式 7-8):把单体扩展到多组织,把工具升级为基础设施
- **生态与组织**(范式 9-10):让供应商、合资伙伴、IT 服务商复用同一套范式

每条范式四个要素:**适用场景**、**关键做法**(3-5 步)、**来源案例**、**失败模式**。

---

## 一、对象与执行核心

### 1.1 Object → Action → Write-back 闭环

**适用场景**:任何想打通"数据 + 模型 + 业务执行"的企业。先识别业务 Object,再把工作流定义为对 Object 的 Action,最后把 Action 结果写回底层系统(MES / SAP / EHR / CRM)。这条范式是整个 ontology 落地的"如果只能选一条,选它"。

**关键做法**:
1. 先识别 3-7 个核心 Object,不要贪多
2. 把现有工作流逐一映射为 Action("X 动作对 Y Object")
3. Action 必须有 write-back 目标,没有 write-back 就退化为 dashboard
4. Object 状态字段定义为时序 + 事件流,确保可追溯
5. 跑通第一个端到端 Action 后再横向扩展

**来源案例**:
- [airbus](./01-airbus.md):Aircraft + Production Order Action 写回 SAP/MES
- [cleveland-clinic](./06-cleveland-clinic.md):Patient + Bed + Assign-bed Action 写回 EHR
- [tampa-general-hospital](./08-tampa-general-hospital.md):Bed + Schedule-shift Action 写回 Staffing Matrix
- [sonnedix](./05-sonnedix.md):Tracker Panel + Maintenance Action 写回资产系统

**失败模式**:
- Action 退化为只读 BI 视图,等于换皮 BI 项目
- Object 数量过多(>20)导致关系纠缠,建模半途而废
- 写回无 audit,医疗/金融场景合规风险

### 1.2 多业务线共用 Ontology 视图

**适用场景**:多业务线集团(内容+广告+订阅、保险+养老+医疗、媒体+订阅+广告)。同一用户/客户在不同业务线下定义不一致。

**关键做法**:
1. 在 Foundry 上建共享 Object Type(Reader / Subscriber / Policyholder / Resident),跨业务线引用
2. 每个业务线有各自的 Link Type + Action Type,但挂在共享 Object 上
3. 用 granular access control 把"商业机密"和"可共享数据"分层(open / internal / restricted)
4. 用 Workshop / Quiver 把 ML 产出以低代码界面下沉到非技术角色

**来源案例**:
- [axel-springer](./11-axel-springer.md):Reader/Article/AdSlot 跨内容+广告+订阅
- [swiss-re](./13-swiss-re.md):Policy/Claim/Portfolio 跨寿险+财险+健康险
- [sompo](./14-sompo.md):Resident/Policy/Claim 跨养老+保险+防灾+医疗
- 互补 [ringier](./12-ringier.md):85% 编辑每天使用是用户密度指标

**失败模式**:
- 共享 Object 过于抽象("Customer" / "Account"),丢失业务语义
- 业务线间权限博弈耗时过长,access control 设计烂尾
- 没有低代码界面,退化为"数据团队玩具"

### 1.3 Field-first Action

**适用场景**:操作员/工人/编辑/护士/驾驶员等第一线用户。让他们主动学新 app 不现实,要把 Action 嵌进他们现有工作流(邮件、移动 push、对讲、IM)。

**关键做法**:
1. 识别第一线工作流,而非 dashboard
2. 把 AI/ML 输出翻译成"人话建议"("把 3 号曝气池 setpoint 从 X 调到 Y,因为氨氮水平将超限")
3. 在建议里嵌入 accept/reject 按钮 + 富文本反馈
4. reject/feedback 行为作为 first-class 事件写回 Ontology
5. 形成"操作员决策 → 模型反馈 → 模型更新"的持续训练闭环

**来源案例**:
- 主要 [jacobs](./03-jacobs.md):每天 2 封 setpoint 邮件,reject 写回 Ontology
- 主要 [tampa-general-hospital](./08-tampa-general-hospital.md):飓风 Ian 24 小时内把 disaster response 写成移动应用
- 主要 [ringier](./12-ringier.md):85% 编辑每天使用 Foundry 编辑界面
- 互补 [sonnedix](./05-sonnedix.md):资产经理从平台直接钻取 + action 维修请求

**失败模式**:
- 强推 app,让操作员学新工具——失败率高
- 没有 reject 路径,操作员被迫接受 AI 建议,模型偏差无人纠正
- 邮件/移动端 Action 无 audit trail,合规失效

---

## 二、数据接入与治理

### 2.1 外部世界数据纳入本体论

**适用场景**:物理资产运营(太阳能场、风电场、油气管道、水务、农业)。传统企业 IT 只映射内网系统,但运营决策需要外部信号(卫星图像、天气、地理、市场电价)。

**关键做法**:
1. 识别决策所需的外部世界信号(卫星 / 天气 / 市场 / 地理 / 第三方)
2. 在 Ontology 上为外部信号建模为 first-class Object(SatelliteImage / WeatherDriver / MarketPrice)
3. 通过 MetaConstellation 或类似能力接入外部数据
4. 让外部信号成为触发 Action 的依据(CV Detection Event → Maintenance Action)
5. Action 结果反向校准外部信号模型,持续学习

**来源案例**:
- 主要 [sonnedix](./05-sonnedix.md):MetaConstellation 卫星 + CV 检测写入 Tracker object
- 互补 [kinder-morgan](./04-kinder-morgan.md):Weather Driver + ERCOT Market Object → Supply Adjustment Action
- 互补 [airbus](./01-airbus.md):外部维修数据进入 Aircraft BOM,触发 Maintenance Action

**失败模式**:
- 外部数据只做"展示图层",不进入 Action 链
- 外部数据接入成本过高(人工标注、半手工 ETL)
- 没有 quality flag,决策错误无人察觉

### 2.2 多部门 virtuous cycle

**适用场景**:制造、重型机械、消费电子等"产品全生命周期数据有商业价值"的企业。售后索赔、市场信号、新品研发原本各自为政,数据闭环能让企业从"卖产品"升级到"用产品反馈驱动下一代产品"。

**关键做法**:
1. 识别跨部门核心 Object(Machine / Product / Order / Claim / MarketSignal)
2. 把售后 Claim object 写回 R&D 选型决策(不只是"看 dashboard")
3. 把市场信号驱动新品研发方向(MarketSignal → Product Development Action)
4. 把质量数据反向影响供应链(Claim root cause → Supply Adjustment)
5. 把闭环命名为可对外宣传的"flywheel"或"cycle"——这是销售/高层支持的硬抓手

**来源案例**:
- 主要 [doosan-infracore](./02-doosan-infracore.md):Claim → R&D + MarketSignal → Supply 的 virtuous cycle
- 对比 [airbus](./01-airbus.md):Defect → Production Schedule 的内部闭环
- 互补 [tampa-general-hospital](./08-tampa-general-hospital.md):临床结果 → OR 排程的医院内部循环

**失败模式**:
- 售后数据只用来"投诉处理",不写回 R&D,数据闭环失败
- 多部门 KPI 互相冲突,没有"virtuous cycle"叙事,高层推动失败
- Cycle 命名太学术,没有故事化包装,内部认知度低

### 2.3 治理分层 + PBAC

**适用场景**:政府、医疗、金融等受监管行业;多组织数据共享场景。RBAC(基于角色)粒度不够,需要把 markings / purpose / audit 作为 Object 自身属性,而不是 IT 层后置。WFP 在冲突地区保护受益人隐私、HHS 在疫情期间打通 25 亿数据点,都依赖这条范式。

**关键做法**:
1. 把数据敏感度标记(PHI / PII / 机密 / 内部 / 公开)建模为 Object property
2. 把访问目的(clinical / billing / research / emergency)建模为 action 的 context
3. audit log 作为 Object 自身的 event stream(不是后置 SIEM)
4. 跨组织共享时,每个 Object 同时持有"自己的 inbound view"和"对外的 outbound view"
5. 政府应急场景下,把多机构 markings 作为 Object 的 first-class property

**来源案例**:
- 主要 [hhs-cdc](./07-hhs-cdc.md):HIPAA-equivalent markings + 5 天上线 + 25 亿数据点 audit
- 主要 [world-food-programme](./10-world-food-programme.md):purpose limitation + beneficiary protection
- 主要 [sompo](./14-sompo.md):"只有值班护理员能改 Resident"这种业务级权限
- 互补 [concordance](./09-concordance.md):合作伙伴间 data sharing rules 作为 Object 属性

**失败模式**:
- markings 作为 IT 层后置,Object 与治理脱钩
- 没有 purpose-based 上下文,访问控制退化为"全有或全无"
- audit log 不在 Object 内,监管检查失败

---

## 三、协同与叙事

### 3.1 Bidirectional Object + Common Operating Picture

**适用场景**:供应链、多组织生态、跨部门协同。任何一个 Object 既被上游 view 也被下游 view,所有 action 必须考虑双侧 effect。

**关键做法**:
1. 为每个核心 Object 定义双向视图(inbound + outbound)
2. 跨组织数据共享时,每个组织保留对自有数据的控制权(data sovereignty)
3. 在 Ontology 上建模组织关系(Manufacturer → Distributor → Provider)作为 Link Type
4. Action 必须考虑"上游影响 + 下游影响",并在 audit log 中双向记录
5. 提供单点真相视图(Common Operating Picture)让所有组织基于同一份事实决策

**来源案例**:
- 主要 [concordance](./09-concordance.md):Surgence 让 4,000+ 供应商共享 demand + priority
- 主要 [kinder-morgan](./04-kinder-morgan.md):Common Operating Picture 量化供需,运维与商务共用同一份数据源
- 主要 [world-food-programme](./10-world-food-programme.md):Control Tower 让 173 国家 / 72 组织共享 visibility
- 互补 [fujitsu](./15-fujitsu.md):Single Pane of Glass 把 40+ 业务系统联通到 85% 系统覆盖率

**失败模式**:
- 单向视图,上游/下游看不到自己
- 没有 data sovereignty 边界,合作伙伴拒绝接入
- 视图分散在不同 BI 报表,没有真正的 Common Operating Picture

### 3.2 Operating System 比喻 + iOS 类比

**适用场景**:任何 ontology 项目想从"工具"升级为"基础设施"的场景。把 ontology 定位成"工具"或"应用",最终会被边缘化;定位成"Operating System"才能获得长期投入。Tampa General 的 CEO 在公开演讲中直接把 Hospital Sync 比作 iOS,这是叙事最成功的案例之一。

**关键做法**:
1. 在叙事上把 ontology 比作 Operating System(如 Tampa General CEO 的 iOS 类比)
2. 强调 "user and creator live in harmony"——用户与开发者共同迭代
3. 从单 use case 演化到 "12+ use cases on one OS"(Tampa 三年扩张)
4. 用 "wired through Foundry and AIP" 这种"全系统接入"的措辞
5. 产品定义写 "Operating System" 而不是 "Application" 或 "Module"

**来源案例**:
- 主要 [tampa-general-hospital](./08-tampa-general-hospital.md):iOS 类比 + Care Coordination Operating System 命名
- 互补 [airbus](./01-airbus.md):Skywise 从 OEM tool 演化到 industry operating platform
- 互补 [cleveland-clinic](./06-cleveland-clinic.md):Hospital Operating System 多模块复用同一 ontology

**失败模式**:
- 仅叫"BI 平台"或"数据分析工具",高层投入不足
- 单 use case 跑通后没有扩展到 12+ use cases,退化为单点项目
- "Operating System" 仅是宣传话术,没有真实 multi-app 复用,反噬品牌

---

## 四、生态与组织

### 4.1 Deployed Engineer 嵌入客户现场

**适用场景**:医疗、政府、人道主义、重型机械等复杂行业。客户场景不能靠"卖现成方案"解决,需要工程师长期驻场。Cleveland Clinic 的 capacity nurse 不是软件用户,而是 ontology 的共同建模者。

**关键做法**:
1. Forward Deployed Engineer(FDE)团队从 day 1 嵌入客户现场
2. FDE 与客户领域专家(capacity nurse、bed manager、plant operator)共同建模 ontology
3. "Solve the hardest problems" 作为 FDE 文化(不是"卖软件许可")
4. 长期驻场(多年期)共建数据治理与多边信任
5. 合同从单次采购升级到多年期协议(Kinder Morgan、WFP、HHS 都是多年期)

**来源案例**:
- 主要 [world-food-programme](./10-world-food-programme.md):多年期合作 + field officer + DOTS 自定义
- 主要 [cleveland-clinic](./06-cleveland-clinic.md):Rohit Chandra 强调 "sit side-by-side" 共建
- 主要 [sompo](./14-sompo.md):2019 合资成立 Palantir Technologies Japan K.K.,股权关系绑定
- 互补 [airbus](./01-airbus.md):多年期合作 + Forward Deployed 真实作战

**失败模式**:
- 派销售而非 FDE 现场,客户业务理解浅
- FDE 项目周期过短(< 6 个月),无法共建 ontology
- FDE 与客户团队没有共同决策机制,沦为外包

### 4.2 Global FDE / IT 服务商伙伴

**适用场景**:大型企业、政府、多国运营场景。单靠 Palantir FDE 不够,需要借助大型 IT 服务商(Accenture / Fujitsu / Deloitte / Sompo)的本地能力与生态。Fujitsu 从 2020 合作到 2025 Global FDE Partner,经历了完整的"PMM → 采购 → 深度合作"三段演进。

**关键做法**:
1. **PMM 阶段**:先与 AI 平台公司合作(销售 / 培训 / 概念验证)
2. **采购阶段**:签全球分销协议(IT 服务商在区域内销售 Foundry)
3. **深度合作阶段**:签 AIP 许可 + Global FDE Partner 协议
4. **IT 服务商必须先用 ontology 自训 2-3 年**再交付给客户(Fujitsu 自 2020 起内部用,2023 才开始客户交付)
5. **内部实战转化为客户解决方案套件**(Fujitsu 50+ 运营应用 → 制造业供应链韧性方案)

**来源案例**:
- 主要 [fujitsu](./15-fujitsu.md):2020 合作 → 2023 全球分销 → 2025 AIP 许可 + Global FDE Partner 的演进路线
- 互补 [sompo](./14-sompo.md):2019 合资模式,日本企业以股权关系绑定 AI 平台公司
- 互补 [swiss-re](./13-swiss-re.md):与 Accenture 等大型咨询合作扩展

**失败模式**:
- IT 服务商直接转售而不内化使用,客户实施质量差
- 跳过 PMM 阶段直接进深度合作,业务理解不足
- 内部实战没有沉淀为可复用套件,客户交付边际成本高

---

## 五、横向对比

| 范式 | 行业适用 | 实施难度 | 价值密度 | 代表案例 |
|---|---|---|---|---|
| 1. Object → Action → Write-back | 通用 | 中 | ⭐⭐⭐⭐⭐ | [airbus](./01-airbus.md) [cleveland-clinic](./06-cleveland-clinic.md) |
| 2. 多业务线共用 Ontology | ToC / 多业务集团 | 高 | ⭐⭐⭐⭐ | [axel-springer](./11-axel-springer.md) [swiss-re](./13-swiss-re.md) |
| 3. Field-first Action | 制造 / 医疗 / 应急 | 中 | ⭐⭐⭐⭐⭐ | [jacobs](./03-jacobs.md) [tampa-general-hospital](./08-tampa-general-hospital.md) |
| 4. 外部世界数据纳入本体论 | 物理资产 / 能源 / 农业 | 高 | ⭐⭐⭐⭐ | [sonnedix](./05-sonnedix.md) [kinder-morgan](./04-kinder-morgan.md) |
| 5. 多部门 virtuous cycle | 制造 / 重工 | 中 | ⭐⭐⭐⭐ | [doosan-infracore](./02-doosan-infracore.md) |
| 6. 治理分层 + PBAC | 政府 / 医疗 / 金融 | 高 | ⭐⭐⭐⭐⭐ | [hhs-cdc](./07-hhs-cdc.md) [world-food-programme](./10-world-food-programme.md) |
| 7. Bidirectional + Common Operating Picture | 供应链 / 多组织 | 高 | ⭐⭐⭐⭐ | [concordance](./09-concordance.md) [kinder-morgan](./04-kinder-morgan.md) |
| 8. Operating System 比喻 | 通用 | 低 | ⭐⭐⭐⭐ | [tampa-general-hospital](./08-tampa-general-hospital.md) [airbus](./01-airbus.md) |
| 9. Deployed Engineer 嵌入 | 复杂行业 | 高 | ⭐⭐⭐⭐⭐ | [world-food-programme](./10-world-food-programme.md) [cleveland-clinic](./06-cleveland-clinic.md) |
| 10. Global FDE / IT 服务商 | 大企业 / 多国 | 高 | ⭐⭐⭐⭐ | [fujitsu](./15-fujitsu.md) [sompo](./14-sompo.md) |

---

## 六、实施优先级

落地本体论项目,建议按四阶段递进:

### 阶段一:基础设施(Months 1-6)

```text
[范式 1] Object → Action → Write-back  ← 先跑通核心闭环
[范式 3] Field-first Action             ← Action 嵌进第一线工作流
```

没有范式 1,后面所有范式都是空中楼阁。范式 3 决定操作员愿不愿意用。

### 阶段二:规模扩展(Months 6-18)

```text
[范式 8] Operating System 比喻          ← 叙事升级到基础设施,争取长期投入
[范式 2] 多业务线共用 Ontology         ← 横向扩展到相邻业务线
[范式 5] 多部门 virtuous cycle         ← 售后/研发/市场数据闭环
```

阶段二的关键是**扩展**——从单一业务线扩到多业务线,从单部门扩到跨部门。

### 阶段三:高级能力(Months 18-36)

```text
[范式 7] Bidirectional + Common Operating Picture  ← 跨组织数据共享
[范式 6] 治理分层 + PBAC                            ← 受监管行业必补
[范式 4] 外部世界数据纳入本体论                     ← 物理/能源/农业
```

阶段三解决的是**复杂度**——把外部信号纳入,把合规纳入,把跨组织纳入。

### 阶段四:规模化与生态(Months 36+)

```text
[范式 9]  Deployed Engineer 嵌入       ← 复杂行业需要 FDE 长期驻场
[范式 10] Global FDE / IT 服务商伙伴   ← 多国 / 多客户场景借 IT 服务商扩展
```

阶段四是**杠杆化**——让一家公司无法单独交付的能力,通过 FDE 和 IT 服务商生态复制出去。

---

## 七、组合范式:如何用是关键

范式不是清单,是积木。三个常见的组合:

- **闭环组合**:范式 1 + 3 + 5。Airbus、Tampa General、Doosan 都用了这三层,形成"Object 可执行 + 第一线能用 + 跨部门闭环"。
- **多边组合**:范式 1 + 2 + 7。Concordance、WFP、Sompo 用这三层,把跨业务线和跨组织的共用 ontology 搭起来。
- **合规组合**:范式 1 + 6 + 9。HHS-CDC、Cleveland Clinic、World Food Programme 用这三层,把治理和长期驻场嵌入执行。

判断一个 ontology 项目是否成熟的简单标准:**用了多少条范式、用了哪几层**。一个成熟项目通常覆盖四层中的前三层,跨"执行核心 + 数据接入 + 协同"三段。范式 9 和 10 是生态放大器,通常在第三、四阶段才进入。

最后一条提醒:**范式的价值在于组合,而非堆砌**。15 个案例里没有一家用了全部 10 条,但每家都在自己的核心业务域里把 3-6 条打透。选哪几条取决于你的业务最痛的是"执行"(范式 1-3)、"合规"(范式 6)、还是"协同"(范式 2、7),再围绕这一两条主线把相邻范式逐步加上。

---

## 参考

15 个案例的完整笔记位于本文 [01-airbus](./01-airbus.md) 至 [15-fujitsu](./15-fujitsu.md)。本手册是横向范式提炼,案例细节见对应文件。