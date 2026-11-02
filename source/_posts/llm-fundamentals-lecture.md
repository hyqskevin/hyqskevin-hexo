---
title: 大模型基础 5 段式讲透
date: 2026-09-15 00:00:00
description: 面向资深 AI 从业者的演讲设计方法论：用「定义→前身→当代→Agent→延伸」五段式讲透 21 个 LLM 主题，含莫兰迪视觉规范与 8 幕演讲地图，展示方法论如何落地。
categories:
  - 技术分享
  - AI 演讲设计
tags:
  - 大模型
  - Transformer
  - Agent
  - RAG
  - 演讲设计
  - LLM
---

## 写在前面

这是一篇关于「如何设计一场大模型基础演讲」的方法论笔记，而不是演讲本身。源材料原本是一份 31 页、覆盖 21 个主题的 PPT 大纲与讲稿，面向已经写过 PyTorch、读过 BERT 源码的资深 AI 同行。我把它改写成可复用的演讲设计框架：重点不是某个模型怎么实现，而是**怎么把一堆庞杂概念，讲得让听众既懂来龙去脉、又知道怎么落地**。

如果你正要准备一场类似的技术分享，下面这套五段式骨架、视觉规范与 8 幕地图，可以直接套用到你自己的主题清单上。

## 一、方法论：5 段式讲透一个概念

这套演讲的核心不是重复入门课件，而是把每个概念讲透「前世今生 + Agent 嵌入」。关键约束是**不凭空抛出名词**——每个概念都交代从哪来、为什么这样设计、今天长什么样、怎么嵌进 Agent 工作流、最新研究方向。

为什么选五段而不是三段或十段？三段（是什么/为什么/怎么做）太浅，资深听众早已越过「是什么」；十段又稀释重点。五段恰好覆盖「认知闭环」：先给锚点，再讲动因，然后落地当代实现，接着桥接到 Agent 工作流，最后指向未解方向。听众带着这条线听 21 个主题，迁移到新概念时几乎零认知负担。

### 1.1 五段式拆解

每个主题独立成节，统一按下面五段推进：

1. **一句话定义**：用公式或一句直觉给锚点，让读者先知道「这是什么」。例如 `MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O`。
2. **前身（为什么出现）**：交代技术动因。RNN 必须串行、CNN 感受野有限，两者在「并行性 + 长依赖」上双重失败，才催生了 Transformer。
3. **当代主流（2024-2026）**：讲清楚今天长什么样。比如注意力变体从 MHA → MQA → GQA → MLA 的演进。
4. **Agent 流程嵌入**：这是本套方法论的灵魂。每个主题都要回答「怎么用在 Agent 工作流」。例如 MoE 的 gate 天然就是「软路由」，转成 Agent 就是「该不该调用某个工具」的决策。
5. **现阶段延伸**：给最新研究方向，避免内容过时。比如 NoPE、CoPE、细粒度 MoE 等。

> 这条「前世 → 当代 → Agent → 延伸」的链路是核心方法论，受众预设是已经写过 PyTorch、读过 BERT 源码的资深同行。

### 1.2 怎么套用到你自己的主题清单

拿到一份新主题（比如「扩散模型」「向量数据库」），先别急着写 slide，而是按五段填空：能不能用一句话定义？它的前身解决了什么旧方案的痛点？今天的主流实现是哪几个？它怎么嵌进 Agent 工作流？最新论文往哪走？五格填满，这一页的内容骨架就立住了。如果某一段填不出，说明你还没真正理解这个概念，正好回去补功课——这也是五段式作为「自检清单」的隐藏价值。

## 二、全局视觉规范

风格统一为**莫兰迪低饱和度 + 大字号 + 图文并茂**，避免花哨，用留白和色块拉开层次。

为什么是莫兰迪？资深技术听众一天看几十页 slide，高饱和配色只会加速疲劳。低饱和的大地色系既能区分模块，又不抢内容。再叠加大字号，让后排观众也能靠「大字报」抓住关键信息，细节留给前排自己读。

### 2.1 配色与字号

| 项 | 选择 |
|---|---|
| 主色 | 莫兰迪：#F5F1EB 底 / #C8B6E2 紫 / #B8E0D2 绿 / #F3E9B2 黄 / #A8D8EA 蓝 / #F5C2C7 粉 |
| 正文字号 | PPT 实际 24–28pt；大标题 44–52pt |
| 公式 | KaTeX 行内 + 居中显示，配直觉框 |
| 字体 | 思源宋体 Heavy（标题）+ 思源黑体（正文）+ JetBrains Mono（公式/代码）|
| 视觉风格 | 论文图重绘 + 简笔动画 + 流程方块图 + 关键数据大字报 + 「前世→今生」双栏对比 |

### 2.2 排版原则

- 单页只讲一件事，用大字号把关键信息做成「大字报」；
- 对比类内容一律用「前世 → 今生」双栏，强化演化感；
- 公式统一配直觉框，先讲物理含义再给符号；
- 视觉锚点固定放在封面中央——「前世 → 当代 → Agent → 延伸」四段式流程图。

### 2.3 图文并茂的实操技巧

纯文字 slide 是催眠剂。每个技术点尽量配一张自绘示意图：论文原图直接截图版权风险高，且风格不统一，不如用简笔重绘——把 Transformer 架构、注意力掩码、MoE 路由画成方块流向，听众三秒看懂。数据类结论（如 KV Cache 压缩比、显存占用）做成大字报，比塞进表格更抓眼。动画只用在「演化」场景：RoPE 旋转、MoE 时间轴这类有先后顺序的内容，动起来比静态图更有叙事感。

## 三、演讲地图：8 幕 21 主题

整个演讲分 8 幕，21 个独立主题，每主题独立讲、统一用五段式。时间轴结构如下：

### 3.1 八幕概览

| 幕 | 主题数 | 内容 |
|---|---|---|
| 0 铺垫 | — | Transformer 起源 / 12 组件速览 |
| 一 架构主题 | 6 | MHA / 位置编码 / FFN / MoE / Mask / LayerNorm |
| 二 训练主题 | 4 | Tokenization / Pre-training / SFT / RLHF-DPO |
| 三 推理主题 | 4 | KV Cache / Flash Attention / 量化 / Speculative |
| 四 应用主题 | 4 | RAG / Agent & MCP / 评测对齐 / LoRA-PEFT |
| 五 前沿主题 | 2 | 多模态 / 长上下文 |
| 六 新范式 | 1 | SSM / Mamba |
| 七 总结+Q&A | — | 全景回顾 / 思考题 |

> 每主题独立讲，5 段式结构；横向 8 幕时间轴 + 每个主题一个色块标注，读者一眼看懂全篇布局。

### 3.2 每幕在讲什么

- **0 铺垫**：用 4 页讲清 Transformer 为什么在 RNN/CNN 双重失败后诞生，并一张图标出 12 个组件，作为后续所有主题的锚点。
- **一 架构主题**：6 个主题深入 Transformer 内部——注意力、位置编码、FFN、MoE、Mask、归一化，是理解后续一切的基础。
- **二 训练主题**：从分词到预训练、指令微调、偏好对齐，串起一条「数据 → 基座 → 助手」的训练主线。
- **三 推理主题**：KV Cache、Flash Attention、量化、投机解码，全是把模型跑起来、跑得快、跑得便宜的工程核心。
- **四 应用主题**：RAG 补事实、Agent 补工具、评测对齐是指挥棒、LoRA 做多任务适配，把能力落到生产。
- **五 前沿主题**：多模态与长上下文，决定模型能处理什么形态、多长的输入。
- **六 新范式**：SSM / Mamba 提供 Transformer 之外的另一条路，复杂度 O(n)、无需 KV Cache。
- **七 总结+Q&A**：21 主题速查 + 6 条 takeaway + 8 个开放思考题，把单向输出转为共同探索。

### 3.3 时间分配建议

整场约 60–90 分钟（含 Q&A），可按受众耐心拆成 2–3 场。推荐切法：第一场放「0 铺垫 + 一 架构 + 二 训练」（约 25 分钟），把基础打牢；第二场放「三 推理 + 四 应用 + 五 前沿 + 六 新范式 + 七 总结」（约 60 分钟），偏工程与落地。每主题控制在 2–2.5 分钟，MoE、Agent、RAG、KV Cache 这四个可酌情扩到 4–5 分钟——它们既是听众兴趣高点，也是 Agent 工作流的技术枢纽。

## 四、核心主题示例

下面挑 4 个最能展示方法论落地的主题，按五段式完整呈现。其余 17 个在下一节列表速览。

### 4.1 Multi-Head Attention（主题 1）

- **一句话定义**：`MultiHead(Q,K,V) = Concat(head_1,...,head_h)W^O`，默认 d_model=512, h=8, d_k=d_v=64。把高维空间切到 h 个子空间并行检索。
- **前身**：Bahdanau 2014 加性 attention 一次性算一个 map；Luong 2015 提出 dot/general/concat 三种评分，dot 路径成为 Transformer 直系祖先。
- **当代主流**：MHA（原版，K/V 缓存最大）→ MQA（共享 K/V，缓存减 8×）→ GQA（分组共享，LLaMA/Mistral/Gemma 全用）→ MLA（低维 latent 压缩，比 GQA 更省）。
- **Agent 嵌入**：多模态融合时 vision/text encoder 经 cross-attention 互相查询；长对话复用 KV Cache 时，GQA/MQA 把多轮 KV 压缩 8×，100 轮对话显存可控。
- **延伸**：Native MLA（DeepSeek-V3）、跨层共享 K/V 的 CLA、把 head 也变 router 的 MoE-MHA。

> 为何选作示例：注意力是 Transformer 的心脏，它的变体演进（MHA→MQA→GQA→MLA）最能体现「前身 → 当代 → Agent 嵌入」这条主线，是五段式最好的样板。

### 4.2 MoE（主题 4）

- **一句话定义**：`MoE(x) = Σ gate_i(x)·expert_i(x)`，gate 是 top-k 路由，expert 是独立 FFN。典型 8 expert 每次激活 2 个。
- **前身**：1991 Jacobs 首提 Mixture of Experts；2017 Shazeer 首次用在 LSTM；2021 Switch Transformer 简化路由；2023 Mixtral 推到开源标杆。
- **当代主流**：Mixtral 8x7B、DeepSeek-V3（671B 总参 / 37B 激活，细粒度 MoE + MLA + 共享 expert）、Qwen2.5-MoE、Grok-1、Megablocks/Tutel 训练 kernel。
- **Agent 嵌入**：gate 网络天然就是「软路由」，转成 Agent 工作流等于「该不该调用某工具」的决策；训练充分的 MoE 自然出现专家特化（SQL 生成 / API 调用 / 闲聊），即「专家分裂」现象。
- **延伸**：细粒度专家、共享专家、动态专家数量、MoE+多模态；训练侧需解决路由崩溃与负载不均衡（Aux Loss / Dropless MoE）。

> 为何选作示例：MoE 是 2024-2026 最大的架构转折，而且它的 gate 网络天然就是 Agent 的「软路由器」——这是「Agent 嵌入」这一段的绝佳教材。

### 4.3 RAG（主题 15）

- **一句话定义**：RAG = Retrieval-Augmented Generation。先检索外部知识库，再让 LLM 基于结果生成，是 LLM 接入外部知识的「事实标准」。
- **前身**：经典 IR（TF-IDF/BM25）→ DrQA 开放域问答 → REALM 把检索集成进预训练 → Lewis 2020 统一 RAG 框架 → DPR 稠密检索。
- **当代主流**：Naive RAG（检索 top-k）→ Advanced（Query Rewriting/HyDE + Reranking + Self-RAG）→ Modular RAG（模块化插拔）→ GraphRAG（知识图谱）→ Agentic RAG（多步迭代决策）。
- **Agent 嵌入**：RAG Agent = ReAct + RAG，是当下工业主流；支持多源检索（向量库/数据库/搜索/API）、Self-RAG 自评重检索、把对话历史当检索源的 Memory-Augmented RAG。
- **延伸**：Agentic RAG 成 2025 主流；GraphRAG 适合企业全局问题；多模态 RAG、Reasoning+RAG（o1 风格多次检索）、Hybrid Search（BM25+向量）。

> 为何选作示例：RAG 是 LLM 落地最成熟的形态，它把「检索」当成外部记忆，与 Agent 的「工具调用」同源——五段式在它身上能清晰展示从算法到工业的完整链路。

### 4.4 Agent & MCP（主题 16）

- **一句话定义**：Agent = 能感知环境、规划步骤、调用工具、反思结果的大模型系统。三组件：规划（Planning）/ 记忆（Memory）/ 工具（Tools）。
- **前身**：经典 AI Agent（感知-规划-行动）→ Web 自动化 → RL Agent（AlphaGo）→ Toolformer 自学调 API → ReAct（思考+行动）→ OpenAI 2023 Function Calling。
- **当代主流**：Function Calling 标准化 JSON 调用；框架 LangChain/LlamaIndex、AutoGen、CrewAI、LangGraph、Swarm；**MCP（Model Context Protocol）成事实标准**；Computer Use Agent 直接控制 OS。
- **Agent 嵌入**：本主题即方法论的「Agent 化」全部落点——MCP 协议栈（Server 提供工具、Client 调用，一份代码通吃所有 LLM）、工具分类、短期/长期记忆、CoT/ReAct/ToT 规划、ReAct 反思循环。
- **延伸**：CUA 直接控制 OS/浏览器；Multi-Agent 协作；Self-Improving Agent；Agent Marketplace；Agent 安全（Sandbox/Harness）。

> 为何选作示例：这是整套方法论的「收口」主题——前面所有架构、训练、推理主题，最终都汇聚到「怎么让 LLM 调用工具」。MCP 把工具接入标准化，是方法论文献里 Agent 化的总落点。

## 五、其余 17 个主题速览

21 个主题中其余 17 个，按幕列出名称与一句话定位：

- **位置编码**：Self-attention 置换不变，必须显式注入先后顺序；RoPE/ALiBi/YaRN 的外推能力是核心战场。
- **Position-wise FFN**：占据每层约 2/3 参数，是独立非线性变换每个 token 的「思考」层；SwiGLU 是当代标准，MoE 是其规模化方向。
- **LayerNorm**：把每个 token 内部特征归一化；Pre-Norm/RMSNorm 是当代主流，Brody 2023 揭示其对 attention 表达力的隐藏角色。
- **Masked Self-Attention**：Causal Mask 决定 attention 的「通信方向」，是工具调用因果性的语义保证，而非单纯技术细节。
- **Tokenization**：把文本切成词表 id 序列；BPE/WordPiece/SentencePiece 的词表大小，直接影响模型能力与 Agent 的 JSON/工具调用结构化输出。
- **Pre-training**：在海量文本上做下一个 token 预测的自监督学习；Scaling Law 是地基，LLaMA-3 用了 15T tokens。
- **SFT**：在指令-回答对上微调，把基座变助手；1k 高质量数据 > 100k 凑数，Agent 轨迹 SFT 是训练基础。
- **RLHF / DPO**：从人类偏好对齐行为；DPO 直接用偏好数据做监督、无需奖励模型，已成新主流。
- **KV Cache**：缓存历史 K/V 让自回归从 O(n²) 降到 O(n)；催生 PagedAttention/GQA/MLA，Prefix Caching 是 Agent 部署核心。
- **Flash Attention**：IO 感知的 tiling + 重计算，显存 O(n²)→O(n) 且数学完全等价，是 H100 上的事实标准。
- **量化**：FP16→INT4/FP8 把模型压小 4-8×；端侧 Agent 与工业成本控制、实时响应的命脉。
- **Speculative Decoding**：小模型 draft + 大模型 verify，质量严格等价；流式 TTFT 优化与 Agent 多步加速的关键。
- **评测对齐**：评测是指挥棒，Benchmark 分数 ≠ 真实能力；Chatbot Arena + AgentBench/SWE-Bench 是当代主流。
- **LoRA / PEFT**：冻结基座注入低秩矩阵，可训练参数减 10000×；Multi-LoRA 热插拔是 Agent 多任务部署核心。
- **多模态**：Vision Encoder + Projector + LLM 三件套；CUA/OS Agent 让 Agent 从「打字」变成「看屏幕 + 操作」。
- **长上下文**：从 4K 到 1M token；YaRN/Ring Attention 让百万 token 不只是营销，是长文档/长对话 Agent 的刚需。
- **SSM / Mamba**：选择性状态空间替代 attention，复杂度 O(n) 且无需 KV Cache；但 ICL 弱，未来更可能是 hybrid 时代。

## 六、总结与 Q&A 设计

五段式方法论的价值不在于「讲了多少」，而在于**复用边界清晰**：每个概念都按同一套五段骨架展开，听众迁移到新主题时零认知负担。

### 6.1 六个核心 takeaway

1. **架构**：Transformer 12 组件，MoE 主导规模化。
2. **训练**：Pre-train → SFT → RLHF/DPO，token 预测是地基。
3. **推理**：KV Cache + Flash Attention + 量化 + Speculative 是工程核心。
4. **应用**：RAG 补事实 / Agent 补工具 / 评测对齐是指挥棒。
5. **前沿**：MoE 主导规模化 / 多模态主导场景 / SSM 主导长序列。
6. **方法论**：每个概念讲透「前世 → 当代 → Agent → 延伸」。

### 6.2 八个开放思考题（Q&A 落点）

1. MoE 是终极架构吗？细粒度 vs 粗粒度谁赢？
2. Decoder-only 会持续主导还是 Enc-Dec / SSM 回归？
3. 长上下文真有用还是营销？128K+ 真实任务有哪些？
4. RLHF 是否已死？DPO / Process Reward / Constitutional 谁赢？
5. Mamba / SSM 何时取代 Transformer？还是 hybrid 时代？
6. 多模态 Agent（CUA）会成为下一代 OS 形态吗？
7. Agent 是否会取代 SaaS？每个企业都需要 Agent 吗？
8. 通用 LLM 是否会被领域小模型 + RAG 取代？

> Q&A 设计为开放挑战，没有标准答案，鼓励听众任选一题深挖，把演讲从「单向输出」转为「共同探索」。

### 6.3 复用建议

这套五段式不只服务于大模型主题。凡是「技术概念密集、听众已有基础、需要兼顾原理与落地」的分享——比如数据库内核、编译器优化、分布式系统——都能直接套用。唯一要调的是「Agent 嵌入」这一段：如果你的领域没有 Agent 工作流，把它换成「生产落地 / 工程实践」即可，骨架不变。

## 结语

好的技术演讲不是信息搬运，而是给听众一把可复用的认知尺子。21 个主题会过时，但「每个概念讲透前世、当代、落地与延伸」的节奏不会。下次你准备分享时，不妨先画那条「前世 → 当代 → Agent → 延伸」的流程图，再往里填肉——这比堆 100 页 slide 管用得多。真正的高级感，从来不是内容多，而是结构让人记得住。

## 模型版本说明

⚠️ 本文提及的模型与框架版本（LLaMA、Mistral、DeepSeek-V3、Qwen、Gemma、Claude、Gemini、vLLM、Flash Attention 等）截至撰写时（2026-09）的最新状态，**以发布时为准**。大模型领域演进极快，引用具体版本前请核对官方文档与论文。
