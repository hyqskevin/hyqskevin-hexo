---
title: 小红书非官方 API 项目
date: 2026-09-02 00:00:00
description: 小红书非官方 API 工具地图：xhs / RedNoteTools / imgapi / MediaCrawler 等 6 个项目的对比表、安装速查、合规风险、给研究/运营/AI 训练 3 类用户的推荐。
categories:
  - notes
tags:
  - 小红书
  - API
  - 爬虫
  - 合规
  - 工具对比
---

最近做 AI 项目时需要小红书的数据做测试样本（用户授权的公开内容），调研了几个非官方 API 项目。这篇是工具地图 + 合规风险 + 给不同用户场景的推荐。

## 一、⚠️ 重要合规声明

在列工具前必须说清楚：

- **小红书 ToS 明确禁止未授权爬取**。违反会账号封禁 + 法律风险
- **国内法律**：违反《数据安全法》《网络安全法》《个人信息保护法》
- **欧盟 GDPR**：抓取个人数据最高罚 4% 全球营收
- **合法用途**：
  - 公开测试数据（用户授权）
  - 学术研究（IRB 批准 + 匿名化）
  - 个人备份自己的内容
- **非法用途**：
  - 商业数据爬取
  - 重新分发完整数据集
  - 绕过反爬机制

**本文仅做技术调研，不构成爬取建议**。用任何工具前**先看 ToS + 当地法律**。

## 二、6 个项目对比

| 项目 | 语言 | 维护 | 难度 | 主要功能 | 风险 |
|---|---|---|---|---|---|
| **xhs** | Python | 活跃 | 中 | 完整 API（笔记/评论/用户） | 高 |
| **RedNoteTools** | Python | 活跃 | 低 | 桌面 GUI 工具 | 中 |
| **imgapi** | Go | 中等 | 低 | 仅图片下载 | 中 |
| **MediaCrawler** | Python | 非常活跃 | 中 | 多平台（小红书/抖音/B站） | 高 |
| **xhs-mcp-server** | TypeScript | 新 | 低 | MCP 协议 | 中 |
| **redbook-toolkit** | Python | 低 | 低 | 简单搜索/下载 | 中 |

## 三、详细对比

### 3.1 xhs（推荐，深度用户）

- **GitHub**：`jiasy1016/xhs`（典型实现）
- **原理**：逆向小红书 web 端 X-S、X-S-Common、X-T 等签名
- **支持**：笔记详情 / 评论 / 用户资料 / 搜索 / 关注关系
- **依赖**：Python 3.8+，需要 `requests` / `cryptography`
- **使用**：

```bash
pip install xhs
python -m xhs sign --url "https://www.xiaohongshu.com/explore/xxx"
```

**优点**：功能最完整
**缺点**：维护成本高（小红书每次改前端都要跟）
**合规风险**：⚠️ 高（API 完整程度高 = 反爬对抗强）

### 3.2 RedNoteTools（推荐，GUI 用户）

- **GitHub**：`RedNoteTools/RedNoteTools`
- **GUI**：Electron 桌面应用
- **功能**：登录后下载笔记图片/视频、批量导出
- **使用**：

```bash
git clone https://github.com/RedNoteTools/RedNoteTools
cd RedNoteTools
npm install
npm start
```

**优点**：可视化，无需写代码
**缺点**：依赖第三方打包，分发安全要自己判断

### 3.3 MediaCrawler（推荐，多平台）

- **GitHub**：`NanmiCookie/MediaCrawler`（5 万+ stars）
- **支持平台**：小红书 / 抖音 / 快手 / B 站 / 微博
- **特点**：活跃维护，社区大
- **使用**：

```bash
git clone https://github.com/NanmiCookie/MediaCrawler
cd MediaCrawler
pip install -r requirements.txt
python main.py --platform xhs --type search --keywords "宁波AI"
```

**优点**：多平台一套代码
**缺点**：高频被反爬封 IP，需要代理池

### 3.4 xhs-mcp-server（推荐，AI Agent 用户）

- **原理**：用 MCP（Model Context Protocol）暴露小红书操作为 Agent 工具
- **场景**：让 Claude / Cursor / OpenClaw 直接调小红书

```bash
pip install xhs-mcp-server
# 在 .mcp.json 加：
{
  "mcpServers": {
    "xhs": {
      "command": "xhs-mcp",
      "args": ["--cookie", "your_cookie_here"]
    }
  }
}
```

**优点**：无缝集成 Agent 工作流
**缺点**：需要 cookie，频繁失效

### 3.5 imgapi（只下图片）

- **GitHub**：`imgapi/xhs-image`
- **功能**：只下载笔记图片，无文字/评论/用户数据
- **使用**：

```bash
go install github.com/imgapi/xhs-image@latest
xhs-image --url "https://www.xiaohongshu.com/explore/xxx" --out ./images/
```

**优点**：合规风险较低（图片可能合理使用）
**缺点**：只有图片，没元数据

### 3.6 redbook-toolkit（不推荐）

- **维护频率低**，最后更新半年前
- 功能简单但经常报错
- 适合个人玩玩，不适合生产

## 四、3 类用户场景的推荐

### 4.1 研究者（学术用途）

**推荐**：用公开数据集 + 自带工具

```bash
# Hugging Face 有公开小红书数据集
pip install datasets
from datasets import load_dataset
data = load_dataset("XHS-Dataset-2024")  # 公开学术数据集
```

**关键**：IRB 批准 + 数据匿名化 + 不重新分发原始数据

### 4.2 运营/营销（个人号）

**推荐**：官方蒲公英 + 新红 Ban tools

```bash
# 用官方 API（合法）
pip install xhs-official-api
# 设置 cookie，调用官方接口
```

**注意**：商业用途必须用官方 API（付费），爬虫是违法的

### 4.3 AI Agent 开发者

**推荐**：xhs-mcp-server

```bash
# Claude Desktop 配置
# ~/.config/claude/mcp.json
{
  "mcpServers": {
    "xhs": {
      "command": "xhs-mcp-server",
      "env": { "XHS_COOKIE": "your_cookie" }
    }
  }
}
```

Agent 可以直接读小红书数据。**风险**：账号关联，MCP 服务被封可能连累账号

## 五、5 个风控建议

1. **单 IP 限速**：每分钟 ≤ 10 次请求
2. **不要用云函数 IP**（阿里云/腾讯云 IP 段全在小红书黑名单）
3. **Cookie 池**：准备 5-10 个小号轮换
4. **数据脱敏**：发布前移除用户 ID、地理位置等
5. **定期清理**：本地数据库 ≤ 30 天滚动

## 六、4 条技术细节

- **签名算法 X-S**：MD5 + 自定义 salt，每天变 1-2 次
- **WebSocket 协议**：小红书 2024 改用 WS + protobuf，逆向难度翻倍
- **CDN 域名轮换**：笔记图片域名 `sns-img-bd.xhscdn.com` 等 4 个
- **风控设备指纹**：Canvas、WebGL、AudioContext 全部采集

## 七、推荐组合

| 场景 | 组合 |
|---|---|
| **学术研究** | Hugging Face 公开数据集 + 自带 Python 工具 |
| **个人备份** | RedNoteTools（GUI） + 手动审核 |
| **AI Agent** | xhs-mcp-server + 限速 |
| **多平台运营** | MediaCrawler + 代理池 |
| **生产环境** | 蒲公英官方 API（花钱但合法） |

## 八、3 条替代方案

如果完全不想用非官方 API：

1. **官方蒲公英 API**：花钱，合法
2. **MCN 合作**：找 KOL 数据授权
3. **第三方数据商**：阿里云 / 京东云有合规数据 API（贵）

---

> **本文重在技术调研，不构成爬取建议**。任何工具用前**必须看 ToS + 当地法律**。商业用途请走官方 API。