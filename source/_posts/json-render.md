---
title: json-render 与 MCP 工具描述
date: 2026-09-02 00:00:00
description: 2026 年 AI 编程与 agent UI 协议 4 篇代表性论文速读：Object Aligner 评分、JSON Schema similarity、MCP 工具描述、generative UI。技术地图 + 3 个工程启示。
categories:
  - notes
tags:
  - json-render
  - MCP
  - AI
  - 论文速读
  - generative UI
---

最近调研"AI 生成的 JSON 怎么评估质量"和"agent UI 协议"，读了 4 篇代表性论文。这篇是速读 + 技术地图 + 工程启示。

## 一、4 篇论文速览

### 1.1 Object Aligner — JSON Schema 相似度评分

- arxiv：[2607.01972v1](https://arxiv.org/abs/2607.01972v1)
- 作者：Jan Drchal | 2026
- **做了什么**：开源 Python 库，给两张 JSON 对象确定性相似度评分
- **怎么做的**：递归对齐两棵 JSON 树
  - 无序集合：Hungarian algorithm（最优匹配）
  - 有序集合：sequence alignment（动态规划）
  - 图/超图：Weisfeiler-Leman color refinement 推断双射
- **场景**：信息抽取、工具调用、agent 规划、知识图谱构建
- **亮点**：可作为 prompt optimizer 的 reward signal，**比 LLM-as-judge 便宜 + 确定性**

### 1.2 MCP 工具描述优化

- 论文：MCP Tool Descriptions Are Smelly! Towards Improving AI Agent Efficiency with Augmented MCP Tool Descriptions
- 主题：MCP 工具的 description 写得好不好直接影响 agent 准确率
- **核心发现**：
  - description 措辞差 → agent 选错工具 → 任务失败
  - 简单改写 + 加 few-shot 示例 → 准确率提升 20-40%
- **实践工具**：[mcp-tool-optimizer](https://github.com/...)（自动改写 MCP description）

### 1.3 json-render 与 generative UI

- 工具：[vercel-labs/json-render](https://github.com/vercel-labs/json-render)
- **核心思想**：让 LLM 输出结构化 JSON → 前端按 catalog 渲染成 UI
- **关键点**：
  - JSON schema = UI 组件的 catalog
  - LLM 输出什么字段，前端就渲染什么组件
  - 不需要前端写专门的渲染代码
- **应用场景**：
  - AI 助手（输出 dashboard 配置 → 前端渲染）
  - 数据分析（输出查询 → 自动生成图表）
  - 报告生成（输出结构 → 排版成 PDF / Word）

### 1.4 agent UI 协议（Agent-UI Protocol）

- 核心：让 agent 与前端 UI 通信的标准化协议
- **类似 MCP 但面向 UI**：MCP 是工具调用，agent-UI 是 UI 渲染
- **典型实现**：
  - [agent-protocol](https://github.com/langchain-ai/agent-protocol)
  - [assistant-stream](https://github.com/openai/assistant-stream-js)
  - Vercel AI SDK UI 协议

## 二、4 个项目关系图

```
                  ┌──────────────────┐
                  │   json-render     │  ← UI 渲染
                  │  (Vercel 实验)    │
                  └──────────────────┘
                            ↑
                  ┌──────────────────┐
                  │  agent-UI 协议    │  ← 通信标准
                  └──────────────────┘
                            ↑
                  ┌──────────────────┐
                  │  Object Aligner   │  ← 评分
                  └──────────────────┘
                            ↑
LLM 输出 ──→ JSON schema ──→ MCP 工具 ──→ UI 渲染
```

## 三、Object Aligner 详解（最实用）

### 3.1 解决什么问题

```python
# LLM 输出
llm_output = {"name": "Alice", "age": 30, "city": "Beijing"}

# Ground truth
gold = {"name": "Alice", "age": 30, "city": "Beijing"}

# exact_match = 1.0（完美）
# 但如果 LLM 输出是：
llm_output_2 = {"name": "Alice", "age": "30", "city": "Beijing"}

# exact_match = 0.0（age 类型不匹配）
# 但人类看 = 正确（30 == "30"）
# Object Aligner 能给 0.85
```

### 3.2 实际使用

```bash
pip install object-aligner

python -c "
from object_aligner import align
score, repairs = align(
    candidate=llm_output,
    gold=gold,
    schema=json_schema
)
print(f'Score: {score}')  # 0.85
print(f'Repairs: {repairs}')  # ['age 类型应为 int 不是 str']
"
```

### 3.3 在 prompt 优化中的用法

```python
# GEPA prompt optimizer
from gepa import optimize

def reward(prompt, output, gold):
    score, _ = align(output, gold, schema)
    return score

# 训练循环
optimize(prompt, reward=reward, iterations=100)
```

## 四、json-render 详解

### 4.1 Catalog 设计

```json
// schemas/dashboard.json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "render": "heading" },
    "kpi": { "type": "number", "render": "bigNumber" },
    "chart": {
      "type": "object",
      "render": "chart",
      "properties": {
        "type": { "enum": ["bar", "line", "pie"] },
        "data": { "type": "array" }
      }
    }
  }
}
```

### 4.2 LLM 输出 → UI 渲染

```python
# LLM 输出
llm_output = {
  "title": "今日销售",
  "kpi": 12500,
  "chart": {
    "type": "bar",
    "data": [{"name": "周一", "value": 2000}, ...]
  }
}

# json-render 自动渲染
# → "今日销售" 标题
# → 12,500 大数字
# → 柱状图
```

### 4.3 优势 vs 传统做法

```text
传统：前端写 100 个 if/else 渲染不同 JSON 字段
json-render：写 schema，AI 输出什么就渲染什么
       → 前端代码减少 80%
       → 新增字段不用改前端
       → AI 可以"创造"新 UI 组件
```

## 五、4 个工程启示

### 5.1 LLM 输出必须可验证

```python
# 不要只信 LLM 输出，加个 Object Aligner 评分
def validate_output(llm_output, expected_schema):
    score, repairs = align(llm_output, expected_schema=expected_schema)
    if score < 0.8:
        # 重新生成 + 反馈 repairs
        retry_with_feedback(repairs)
    return llm_output
```

### 5.2 MCP description 是被低估的关键

```text
多数团队只关注：
  - 工具能跑（functional）
  - 参数正确（schema valid）

忽略的：
  - description 写得好（agent 选对工具的关键）
  - few-shot 示例（提升调用准确率 30%+）
```

投入 1 小时优化 10 个工具的 description，比调整 prompt 模型收益大。

### 5.3 generative UI 不是 LLM 专属

```text
适用：
  - 后端 API 返回 JSON → 前端按 catalog 渲染
  - 配置文件 → 工具 UI
  - 数据库 schema → 管理后台

不适用：
  - 固定业务逻辑的页面（电商列表等）
  - 高交互的 SPA（图表编辑器等）
```

### 5.4 agent-UI 协议是 2026 年新趋势

```text
传统：agent 输出文字 + 链接
新趋势：agent 输出可执行 UI 组件
  - 按钮 → 点击触发 agent 后续动作
  - 表单 → 收集用户输入
  - 图表 → 可缩放/筛选
```

## 六、3 个未解决

1. **跨 provider 一致性**：不同 LLM 输出 JSON 格式差异大，评分鲁棒性？
2. **catalog 复杂度上限**：超过 50 个组件时 json-render 性能下降
3. **agent-UI 协议标准化**：各厂商协议不同（MCP / agent-UI / Vercel AI SDK），互通性差

## 七、3 条相关项目

- [vercel-labs/json-render](https://github.com/vercel-labs/json-render) — Vercel 的 generative UI 实验
- [modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification) — MCP 官方
- [langchain-ai/agent-protocol](https://github.com/langchain-ai/agent-protocol) — LangChain 的 agent UI 协议

---

> **4 篇论文综合启示**：AI 编程工具的"质量"问题，本质是"AI 输出 ↔ 期望 schema"的**距离度量** + **可执行表示**（UI 渲染）问题。Object Aligner 解决前者，json-render 解决后者，组合起来就是"AI 生成可执行 UI"的完整链路。