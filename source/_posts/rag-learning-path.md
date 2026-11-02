---
title: RAG 学习路径与课程
date: 2026-09-20 00:00:00
description: 从 B 站视频、知乎长文到公众号、小红书、技术博客与 Twitter，精选全平台 RAG 学习资源，并按零基础、工程师、架构师等角色给出分阶段学习路径与调优建议。
categories: [notes]
tags: [RAG, 学习路径, B站, 知乎, 公众号, 课程]
---

> 检索增强生成（RAG）是当前让大模型拥有"私有知识"的主流解法。本文从 B 站视频 → 知乎专栏 → 公众号 → 小红书 → 技术博客 → Twitter，整理一份全平台学习资源导航，并附按角色划分的学习路径。如果你想系统了解 RAG 的工程落地，也可以回看本博客已发的 RAG 系列文章作为补充。

## 一、B 站系统教程

B 站适合用"视频 + 跟练"的方式建立原理全景，下面三条按入门到进阶排好序。

### 1.1 入门原理

[RAG 工作机制详解——一个高质量知识库背后的技术全流程](https://www.bilibili.com/video/BV1JLN2z4EZQ)：把 RAG 从文档切分、向量化、检索到生成的完整技术链路讲透，适合先建立全局认知。

### 1.2 速成上手

[最适合新手的大模型 RAG 入门课程](https://www.bilibili.com/video/BV1hj5DzyE5d)：偏实操，跟着敲一遍就能跑通一个最小可用知识库。

### 1.3 进阶原版

[吴恩达《检索增强生成 RAG》](https://www.bilibili.com/video/BV1eecUz7ExG)：DeepLearning.AI 原版课程的中英双语搬运，覆盖高级检索、评测等工程要点，适合想系统进阶的同学。

**推荐路线**：入门看"工作机制详解"建立全景 → 速成看"新手课程"动手跑通 → 进阶看"吴恩达课程"补齐工程细节。

## 二、知乎深度长文

知乎是 RAG 深度长文的首选，以下三篇覆盖了从综述到工程实战的主线，其余可作为延伸阅读。

### 2.1 高级 RAG 全面指南

[高级检索增强生成技术（RAG）全面指南](https://zhuanlan.zhihu.com/p/673922981)：从原理、分块、编码、索引到微调、Agent、未来展望，几乎是 RAG 的全链路地图，强烈建议通读。

### 2.2 一文读懂大模型 RAG

[一文读懂：大模型 RAG（含高级方法）](https://zhuanlan.zhihu.com/p/675509396)：进阶版综述，适合在看过视频后用来补齐高级方法的理论框架。

### 2.3 工程实战三大件

[RAG 系统：向量数据库、Embedding 与重排序的工程实践](https://zhuanlan.zhihu.com/p/2065445087715276161)：聚焦向量数据库选型、Embedding 模型与重排序（Re-rank）三大工程件，落地必看。

**延伸阅读**：[从零吃透 RAG](https://zhuanlan.zhihu.com/p/2064719828422746929) 含完整 Python 工程代码；[RAG 有哪些好用的技巧？](https://www.zhihu.com/question/625481187/answer/2071198172307788190) 高赞问答合集覆盖 Query Rewrite、HyDE、混合检索、Re-rank、Query Decomposition 等实操技巧。

## 三、公众号 / 小红书 / 博客 / Twitter 精选

这一节把零散资源按平台合并，每条保留核心，方便碎片化时间按需取用。

### 3.1 微信公众号（入门科普）

- [【技术分享】RAG（检索增强生成）](https://weixin.sogou.com/link?url=dn9a_-gY295K0Rci_xozVXfdMkSQTLW6cwJThYulHEtVjXrGTiVgS9J1qB18eBHZn6vaIWlNHPJ-GzzbiE4fbVqXa8Fplpd9Yf3Wr99KS6qFIjnBG8rRUZgpLRLDmrHKWs1nk5bCx1-6McJoNElFgyacC1AY4V0dy5BSjzYP8Ye7CvX8D6unlJq4Q5mF2ht_JVHoKEriDmDR7sjWn4Ir2smVFYub0UDpB-jR2TZnPoGIVbHyELbAnP6DClIo8Q93Hhi7W5Uggv8Cn9lOoZLP2Q..&type=2)：中文技术分享，讲清 RAG 是什么。
- [什么是检索增强生成（RAG）](https://weixin.sogou.com/link?url=dn9a_-gY295K0Rci_xozVXfdMkSQTLW6cwJThYulHEtVjXrGTiVgS9J1qB18eBHZn6vaIWlNHPJ-GzzbiE4fbVqXa8Fplpd9hF_jdq0D6VdYYNJQ-bR85FHwN1uW8qnyRPi1uepydVidBSF4z_wYNXoiNu9_li8sRIrqbSKv_nB8cbMSqYbTW0eEV6a7lGkJjwgYugBckBXixi-T5Pf5T36uqRDSsOj9s9PB-NMKcdQgr5zTAL7V6y00sMirUKjXXyApjT6fbRn2CsG6-xMgzQ..&type=2)：概念科普向，适合转给刚接触 RAG 的同事。

### 3.2 小红书（速学攻略）

- [一张图搞懂 RAG 运行全流程](https://www.xiaohongshu.com/search_result/6a02eaf80000000035031e22)：图解全流程，3 分钟建立直觉。
- [手搓 RAG 知识库，10 分钟从零跑起来](https://www.xiaohongshu.com/search_result/6a6967f1000000000f016592)：极简上手，适合跟着做第一个 demo。
- [RAG 准确率上不去？4 步从 87% 到 95%](https://www.xiaohongshu.com/search_result/6a1ad67c0000000037036978)：调优经验贴，给出可操作的准确率提升路径。

### 3.3 技术博客（进阶工程）

- [LazyLLM 高阶 RAG：Agentic RAG](https://my.oschina.net/u/8690838/blog/18909942)：讲 Agentic RAG 的编排思路。
- [GraphRAG 实战：知识图谱 + RAG](https://blog.csdn.net/2601_96285279/article/details/162674033)：向量库语义匹配 + Neo4j 多跳路径查询双路召回，含评测集搭建经验。
- [五大 AI 应用框架深度对比](https://cloud.baidu.com/article/4510271)：MaxKB / Dify / FastGPT / RagFlow / Anything-LLM 选型对比，含基准评测数据。

### 3.4 Twitter / LinkedIn（海外实践）

- [LlamaIndex + LangGraph 优化实践](https://www.linkedin.com/posts/michael-lx-chen_llamaindex-langgraph-rag-activity-7397058726895054849-tvD4)：避免 QueryEngine + Agent 双重 LLM 调用的工程经验。
- [bRAG-langchain 完整学习路径](https://x.com/i/status/1978309861361258998)：一套较完整的 RAG 学习路径推荐。

## 四、按角色的学习路径建议

不同目标对应不同节奏，下面按角色给出分阶段路线。

### 4.1 零基础入门（约 1 周）

先建立全景再动手：B 站 [RAG 工作机制详解](https://www.bilibili.com/video/BV1JLN2z4EZQ) → 知乎 [一文读懂大模型 RAG](https://zhuanlan.zhihu.com/p/675509396) → 小红书 [一张图搞懂全流程](https://www.xiaohongshu.com/search_result/6a02eaf80000000035031e22) → 实操 [手搓知识库 10 分钟跑起来](https://www.xiaohongshu.com/search_result/6a6967f1000000000f016592)。

### 4.2 工程师进阶（2–4 周）

补齐高级方法与工程细节：B 站 [吴恩达 RAG 课程](https://www.bilibili.com/video/BV1eecUz7ExG) → 知乎 [高级 RAG 全面指南](https://zhuanlan.zhihu.com/p/673922981) → 知乎 [向量数据库 / Embedding / 重排序工程实践](https://zhuanlan.zhihu.com/p/2065445087715276161) → 博客 [Agentic RAG](https://my.oschina.net/u/8690838/blog/18909942)。

### 4.3 架构师落地（1–2 月）

面向生产系统选型与复杂召回：知乎 [手摸手 RAG 速成](https://zhuanlan.zhihu.com/p/1994408940822340935) → 博客 [GraphRAG 实战](https://blog.csdn.net/2601_96285279/article/details/162674033) → 博客 [五大框架对比](https://cloud.baidu.com/article/4510271) → Twitter [LlamaIndex + LangGraph 优化](https://www.linkedin.com/posts/michael-lx-chen_llamaindex-langgraph-rag-activity-7397058726895054849-tvD4)。

### 4.4 提效 / 调优（持续）

把准确率与稳定性当长期工程：小红书 [4 步 87%→95%](https://www.xiaohongshu.com/search_result/6a1ad67c0000000037036978) → 小红书 [提升准确率全攻略](https://www.xiaohongshu.com/search_result/6a3aae9b00000000220173a0) → 知乎 [RAG 好用的技巧问答](https://www.zhihu.com/question/625481187/answer/2071198172307788190)。

## 五、学习路径补充与贴士

### 5.1 海外系统课程补充

本次整理以中文平台为主，海外系统课程可作补充：

- [DeepLearning.AI · Andrew Ng RAG 课程](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/)：Building and Evaluating Advanced RAG，覆盖评测与高级检索，B 站有中英双语搬运（见 §1.3）。
- Coursera / MOOC 等平台上也有相关专项课程，可结合英文官方文档深入技术细节。

> ⚠️ 说明：海外课程平台结果以发布时实际可用为准，链接可能更新，建议以官网为准。

### 5.2 学习小贴士

- **先原理后实操**：先看视频 / 综述文建立全景，再去 GitHub 跑开源项目，避免一上来就被配置劝退。
- **论文 + 代码双线**：每个技术流派配套读 1 篇 paper + 1 个开源项目，理解才扎实。
- **中文优先 + 英文补充**：中文资源消化快，技术细节看英文官方文档更准。
- **加入社群**：在知乎 / X / Twitter 关注 Nir Diamant、LlamaIndex、LangChain 等官方账号，紧跟一线实践。
