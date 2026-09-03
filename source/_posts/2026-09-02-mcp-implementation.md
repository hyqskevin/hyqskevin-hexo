---
title: MCP 技术实现详解
date: 2026-09-02 00:00:00
description: MCP 协议（Model Context Protocol）2026-07 规范技术实现详解：JSON-RPC 2.0 基础、stdio / SSE 传输、resources/tools/prompts 三大原语、Server / Client 实现示例、错误处理、Python + TypeScript 双语言代码。
categories:
  - notes
tags:
  - MCP
  - Agent
  - 协议
  - 技术实现
  - Python
  - TypeScript
---

读完这篇能独立写一个 MCP Server / Client。**基于 2026-07-28 协议规范** + 官方 TypeScript Schema。

## 一、协议基础

### 1.1 JSON-RPC 2.0 消息格式

MCP 所有消息**必须**遵循 JSON-RPC 2.0：

**Request**：
```json
{
  "jsonrpc": "2.0",
  "id": 1,                       // 字符串或整数，不能 null
  "method": "tools/list",
  "params": { ... }               // 可选
}
```

**Response**：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { ... }               // 成功
}
// 或 error
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": { "code": -32601, "message": "Method not found" }
}
```

**Notification**（无 id，无响应）：
```json
{ "jsonrpc": "2.0", "method": "notifications/cancelled", "params": {...} }
```

### 1.2 三种传输

| 传输 | 用途 | 适用 |
|---|---|---|
| **stdio** | 本地进程通信 | Claude Desktop 等本地 IDE 调本地 server |
| **HTTP + SSE** | 远程通信 | 跨网络 server |
| **Streamable HTTP** | 新标准（2026） | 推荐，取代 HTTP+SSE |

## 二、3 大原语

MCP Server 暴露 3 类能力给 Client：

### 2.1 Resources（资源）

文件 / 数据库 / API 响应的**只读数据**。

```json
// Server 端：声明
{
  "uri": "file:///path/to/doc.md",
  "name": "项目文档",
  "mimeType": "text/markdown"
}

// Client 调用：resources/read
{ "method": "resources/read", "params": { "uri": "file:///path/to/doc.md" } }
```

### 2.2 Tools（工具）

**可执行函数**——能带副作用。

```json
// Server 声明
{
  "name": "search_docs",
  "description": "搜索项目文档",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string", "description": "搜索关键词" },
      "max_results": { "type": "integer", "default": 5 }
    },
    "required": ["query"]
  }
}

// Client 调用
{
  "method": "tools/call",
  "params": {
    "name": "search_docs",
    "arguments": { "query": "AI 编程", "max_results": 3 }
  }
}
```

### 2.3 Prompts（提示词）

**预制 prompt 模板**，用户可在 Client 端触发。

```json
{
  "name": "code_review",
  "description": "代码审查模板",
  "arguments": [
    { "name": "language", "description": "编程语言", "required": true }
  ]
}
```

## 三、Python Server 实现（最简）

```python
# pip install mcp
import asyncio
from mcp.server import Server, stdio

app = Server("demo-server")

@app.tool()
async def search_docs(query: str, max_results: int = 5) -> list[dict]:
    """搜索项目文档"""
    return [{"title": f"结果 {i}", "url": f"https://example.com/{i}"}
            for i in range(max_results)]

@app.resource("config://app")
async def app_config() -> str:
    """应用配置"""
    return '{"version": "1.0", "debug": false}'

@app.prompt("code_review")
async def code_review_prompt(language: str) -> str:
    """代码审查模板"""
    return f"请审查以下 {language} 代码的：可读性 / 性能 / 安全性..."

async def main():
    await stdio.run_app(app, "demo-server")

asyncio.run(main())
```

## 四、TypeScript Server 实现

```typescript
// npm install @modelcontextprotocol/sdk
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "demo-server", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

server.tool(
  "search_docs",
  { query: z.string(), max_results: z.number().default(5) },
  async ({ query, max_results }) => ({
    content: [{ type: "text", text: `搜索 ${query} 的 ${max_results} 个结果` }]
  })
);

server.resource(
  "config://app",
  async () => ({ contents: [{ uri: "config://app", text: '{"version": "1.0"}' }] })
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 五、Client 端调用

```python
# Python Client
from mcp import ClientSession, StdioServerParameters

async with ClientSession(
    StdioServerParameters(command="python", args=["server.py"])
) as session:
    # 列出 tools
    tools = await session.list_tools()
    print([t.name for t in tools.tools])
    
    # 调用 tool
    result = await session.call_tool("search_docs", {"query": "AI"})
    print(result)
```

## 六、错误处理

| 错误码 | 含义 | 何时用 |
|---|---|---|
| -32700 | Parse error | JSON 解析失败 |
| -32600 | Invalid request | 协议不匹配 |
| -32601 | Method not found | 调不存在的 method |
| -32602 | Invalid params | 参数类型错 |
| -32603 | Internal error | 服务端 bug |
| -32000 | Server error | 自定义服务器错 |

**最佳实践**：
- 永远不要让 server 崩溃（捕获所有异常 → 转 error 响应）
- error response 必须带人类可读 message
- 关键错误用自定义 code（-32000~-32099）

## 七、4 条实战建议

### 7.1 用 stdio 起步

- 本地开发用 stdio（简单）
- 部署再切 SSE 或 Streamable HTTP

### 7.2 tool 命名用动词

```text
✅ search_docs / read_file / create_issue
❌ docs / file / issue
```

### 7.3 错误用 human-readable message

```python
return error(-32601, "Method 'foo' not found. Available: search_docs, read_file")
```

### 7.4 资源用 URI 命名空间

```text
file:///abs/path    # 文件
db://table/row     # 数据库
api://endpoint     # 远程 API
config://key       # 配置
```

## 八、3 条避坑

1. **不要忘了 initialize**：Server 启动后必须调 `app.run()` / `server.connect()`，否则 Client 收到空响应
2. **stdio 进程死锁**：server stdout 只能写 JSON-RPC 消息，不能写 log（log 写 stderr）
3. **stdio 协议错配**：server 用 `print()` 输出到 stdout 会破坏 JSON-RPC 解析

## 九、3 个相关项目

- [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) — Python SDK
- [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) — TS SDK
- [modelcontextprotocol/specification](https://github.com/modelcontextprotocol/specification) — 协议规范

---

> **本文目标**：看完能**独立写一个能跑通的 MCP Server**。SDK 把 JSON-RPC 2.0 包装得很好，你只需要关心 `tool` / `resource` / `prompt` 三个原语的业务逻辑。