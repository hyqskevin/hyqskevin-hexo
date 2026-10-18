---
title: xsec_token 逆向研究
date: 2026-09-21 00:00:00
description: 梳理小红书 xsec_token 的服务端生成机制、账号/日期/来源绑定逻辑、AES-CBC 与 SM4 加密推测、15 条真实 token 统计特征，以及 5 大失效机制与可行的复现验证路径。
categories:
  - security
tags:
  - 小红书
  - xsec_token
  - 逆向工程
  - 反爬
  - 安全研究
  - 加密
---

最近把小红书 `xsec_token` 的公开资料与一手抓取数据做了一次系统梳理。本文是**现状综述 + 统计观察 + 算法推测**，并未完成实际逆向，目标是把已知事实、数据特征与可行路径先落定。

## 一、一句话总结

`xsec_token` 是**服务端下发**、**绑定账号 + 日期 + 来源（xsec_source）**、采用 **URL-safe base64 编码**（45–46 字符）的短时会话令牌，验证窗口约几分钟到几小时。

本批 15 条 token 集中在 **4 个前缀桶**：

- `ABok0nwmx-q9Ue8NCGxkW80` ×7
- `ABH28cUv` ×4
- `AB__fxL9ma9BRWBe3vPFpyV` ×3
- `ABxudi9lUdviGS7IoadOpZcPkZ1STuYt_vzC_AHjAaUro` ×1

前缀桶差异疑似与 `xsec_source` + Chrome session 强绑定。

## 二、数据基础与统计

数据来自一篇小红书相关推文文档中抓取的 15 条真实 URL（每条都带 `xsec_token=...&xsec_source=`），使用已登录态的 Chrome profile（`<chrome_profile>`）抓取，4 个关键词合并去重。

### 2.1 前缀（8 字符）分布

| 前缀 | 条数 | 占比 | 关联作者 |
|---|---|---|---|
| `ABok0nwmx` | 7 | 47% | 铁刚铁、折线之外、Liang、康斯坦汀、阿博粒、设计师言炎、冯叮当 |
| `ABH28cUv` | 4 | 27% | 量子位、瑞娜啊、赛文乔伊、可问春风 |
| `AB__fxL9` | 3 | 20% | 叉叉叉叉叉😈、Busoni、学术卷卷 |
| `ABxudi9l` | 1 | 7% | FlowAPI（**完全独立 token 格式**）|

### 2.2 长度分布

| 长度 | 条数 | 含义 |
|---|---|---|
| 46 字符 | 12 | 编码前 34 字节 |
| 45 字符 | 3 | 编码前 33 字节（**全部是 ABH28cUv 前缀**）|

### 2.3 字符集

- **URL-safe base64**：`A-Z a-z 0-9 - _`
- 不含 `+` `/` `=`（标准 base64 字符被替换）
- 字符频率分析显示**非均匀分布**，暗示非随机字符串（应是密文/签名）

### 2.4 关联特征

- `ABH28cUv` 4 条全部是 **2026-09-04 发布日**内容
- `ABok0nwmx` 7 条主要是**同 session 内的搜索结果**
- `ABxudi9l` 1 条是 **2026-08-03 的早期笔记**（不同算法路径 or 旧版本）

## 三、社区关键事实

综合 5 篇一手分析，提炼出 5 个关键事实。

### 3.1 token 是服务端生成，不是前端 JS 算出来

> 来自 GitHub Issue #186 (JoeanAmier/XHS-Downloader)
> "xsec_token 是服务器返回的，只能用博主主页作品的接口，传入 user_id 和 cursor 去遍历博主所有作品，每次返回结果里有 note_id 及其对应的 xsec_token"

关键词搜索接口 `https://edith.xiaohongshu.com/api/sns/web/v1/search/notes` 的返回结果里**直接包含 xsec_token**。

### 3.2 token 绑定账号 + 日期 + 来源（xsec_source）

> "xsec_token 的值与账号、日期、来源都有关，不是固定的"
> "Token is bound to **xsec_source** (e.g., pc_search, pc_user, pc_feed)"
> "Server validates token matches source and hasn't expired"

这解释了为什么同一 session 内 token 前缀聚集。

### 3.3 PC 端 = AES-CBC（密钥+IV 动态派生）或 SM4 国密

> 来自 CSDN wenku《小红书PC端xsec_token加密机制与反爬风控策略深度分析》

- 客户端本地环境（Canvas/WebGL/音频哈希/TLS 指纹/时钟偏移熵）经**多层混淆**与**时间戳绑定**
- 通过 **AES-CBC**（密钥与 IV 均动态派生）或 **SM4 国密算法**加密生成
- 生命周期与页面加载会话绑定，每次刷新/滚动/点击都可能重签
- 与 Cookie 中 `session_id`、`device_id`、`web_id` 形成交叉验证闭环
- 时间戳越界（允许偏差 **≤300ms**）或设备指纹哈希不匹配 → 412 / 403

### 3.4 移动端 App 用 Frida Hook 才能拿到真算法

> "我用 Frida Hook 过 App 的 com.xhs.security.XSecTokenGenerator.generate() 方法，发现签名密钥是**动态生成**的，依赖于当前进程内存中的某个 AES 密钥对象——这意味着单纯静态分析 APK 几乎不可能还原完整算法"

更务实的做法：抓包定位 feed 请求触发时机，记录完整请求头，把 `x-sig` 值复制出来在自有服务里复用。**同一设备 token 复用窗口期约 4 小时**，比网页端解析 `a1` 更稳定。

### 3.5 失效机制（5 大主因）

来自 CSDN ask：

1. **登录状态过期** / 被强制下线
2. **频繁请求触发反爬**（>50次/分钟限流，重复使用相同 token 连续 10+ 次作废）
3. **客户端/服务器时间偏差过大**（> ±5分钟）
4. **App 版本更新导致加密策略变更**
5. **设备指纹/IP 突变**

## 四、算法推测

下图是推测的 token 内部结构示意：

![xsec_token 结构推测](https://hyqskevin.github.io/pic/security/xsec-token-structure.png)

### 4.1 候选 A：HMAC-SHA256 + 时间戳 + device_id

CSDN 流传的实现（**未经官方验证**）：

```python
def generate_xsec_token(secret_key, device_id, path):
    timestamp = int(time.time() * 1000)  # 毫秒
    raw_string = f"{timestamp}\n{device_id}\n{path}"
    signature = hmac.new(secret_key.encode('utf-8'),
                          raw_string.encode('utf-8'),
                          hashlib.sha256).digest()
    return base64.b64encode(signature).decode().replace('+', '-').replace('/', '_').replace('=', '')
```

**问题**：HMAC-SHA256 输出 32 字节 → base64url 编码 = 43 字符，**与我们观察的 45–46 字符不符**。长度差 2–3 字节，可能是 prefix（如 timestamp 8 字节）+ signature 32 字节 → 40 字节 = 54 字符（也不符）。

### 4.2 候选 B：AES-CBC + 16 字节 IV + 16 字节密文

- SM4 / AES-128-CBC 输出 = 16 字节块
- 加上 16 字节 IV = 32 字节 → base64url = 43 字符
- 加上时间戳前缀 2 字节 = 34 字节 → 46 字符 ✅ **匹配**
- 与 CSDN wenku 分析一致（**最可能**）

### 4.3 候选 C：SM4-GCM（认证加密）

- 12 字节 IV + 16 字节密文 + 16 字节 tag = 44 字节 → 59 字符（**不符**）

### 4.4 候选 D：自定义混合（签名 + 加密 + 元数据）

- 元数据（timestamp 4B + xsec_source 1B + 标志 1B）+ 加密签名（28B）= 34 字节 → 46 字符 ✅
- 与多个前缀桶现象吻合：不同 xsec_source 用不同前缀

**最可能**：候选 B（**AES-CBC 或 SM4-CBC**，34 字节 = 16 字节 IV + 16 字节密文 + 2 字节元数据）。

## 五、复现路径

### 5.1 方向 1：服务端真实算法（高门槛，难）

- **方法**：抓浏览器真实调用栈 → Chrome DevTools → Network → HAR 文件导出 → 找生成 token 的 XHR 调用 → 看 response 字段
- **预期产出**：拿到原始 token + 生成参数（device_id / path / timestamp / secret_key 来源）
- **风险**：服务端可能用 WebAssembly / 加密的 JS bundle 防静态分析

### 5.2 方向 2：构造伪造 token 测试服务端验证（最实用）

- **方法**：用候选 B 算法（AES-CBC + 16B IV + 16B 密文），用任意 key 构造 token → 用 curl_cffi 模拟 Chrome TLS 指纹请求小红书接口
- **预期产出**：观察服务端拒绝方式（412 / 403 / 300031 验证码）
- **价值**：反推 token 内部结构
- **推荐工具**：MediaCrawler 已有完整 Python 框架 + curl_cffi + Playwright

示例请求骨架：

```bash
curl_cffi https://edith.xiaohongshu.com/api/sns/web/v1/search/notes \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0" \
  -H "x-s: <YOUR_TOKEN>" \
  -H "x-t: $(date +%s000)"
```

### 5.3 方向 3：DOM 抓取 window.__INITIAL_STATE__（最稳健）

- **方法**：浏览器加载笔记详情页 → 提取 `window.__INITIAL_STATE__` 大型 JSON
- **预期产出**：完整 token 字段（note_id / xsec_token / xsec_source / 创建时间）
- **推荐工具**：MediaCrawler 已实现，可直接复用

### 5.4 方向 4：前端 JS 静态分析（最低门槛）

- **方法**：Chrome DevTools → Sources → 搜 `xsec_token` 关键字 → 找生成函数
- **风险**：小红书用 webpack + 混淆 + 死代码 + 字符串编码（Base64 + XOR），纯静态分析耗时

## 六、实验设计与待验证清单

| 优先级 | 方向 | 工具 | 预期时间 | 成功率 |
|---|---|---|---|---|
| ⭐⭐⭐ | 方向 3：DOM 抓取 INITIAL_STATE | MediaCrawler + Chrome | 1-2h | **90%** |
| ⭐⭐⭐ | 方向 2：构造伪造 token 测试 | curl_cffi + Python | 2-3h | 80% |
| ⭐⭐ | 方向 1：浏览器 HAR 抓包 | Chrome DevTools | 1h | 70% |
| ⭐ | 方向 4：JS 静态分析 | Chrome Sources + 反混淆 | 4-8h | 40% |

### 6.1 短期（1 周内可做）

- [ ] 用方向 3 抓 `window.__INITIAL_STATE__` 看 token 完整字段
- [ ] 用方向 2 构造伪造 token 测服务端拒绝方式
- [ ] 验证 `ABH28cUv` 前缀桶内 3 条 45 字符 token 与 1 条 46 字符 token 的差异
- [ ] 验证 `ABxudi9l` 桶（FlowAPI，2026-08-03）是否真是不同算法版本

### 6.2 中期（1 个月内可做）

- [ ] 抓 100 条 token 做大样本统计（前缀/长度/时间相关性）
- [ ] 复现 CSDN wenku 描述的"Canvas/WebGL/音频哈希 + AES-CBC"链路
- [ ] 写一篇完整逆向报告

### 6.3 长期（持续追踪）

- [ ] 监控 token 算法变更（小红书每 15 分钟轮换密钥池）
- [ ] 集成到 xhs-info-crawl 项目（自动 refresh token）
- [ ] 与开发者社区交叉验证

## 七、相关资源

| 来源 | 链接 |
|---|---|
| CSDN wenku - PC 端 xsec_token 加密机制 | https://wenku.csdn.net/doc/bceuwqrnts |
| CSDN wenku - HMAC-SHA256 Python 实现（**未经验证**） | https://wenku.csdn.net/answer/8a9wfb8494 |
| CSDN wenku - Frida Hook 移动端算法 | https://wenku.csdn.net/answer/2yx4pyy16k |
| GitHub Issue #186 - JoeanAmier/XHS-Downloader | https://github.com/JoeanAmier/XHS-Downloader/issues/186 |
| deepwiki - MediaCrawler XHS 集成 | https://deepwiki.com/mcp-service/media-crawler-mcp-service/4.2-xiaohongshu-(xhs)-integration |
| MediaCrawler 项目分析 | https://bitibiti.com/2024/03/24/MediaCrawler-小红书爬虫源码分析/ |
| XHS-Downloader 项目 | https://gitee.com/yonglelolu/XHS-Downloader |

## 八、法律与合规提示

- 本研究**仅用于安全研究/学习**，不应用于：
  - 商业爬虫批量抓取
  - 绕过小红书付费/会员限制
  - 任何违反小红书《用户协议》或《数据安全法》的活动
- 实测时务必用**自己的测试账号**，控制 QPS ≤ 5/分钟
- 如发现漏洞，请通过**小红书官方 SRC**（安全应急响应中心）上报

## 模型版本说明

⚠️ 本文所引用的 **Codex-GPT6-Astra** 及相关分析结论，**以发布时为准**。小红书 `xsec_token` 的生成算法与风控策略处于持续变更中（密钥池约每 15 分钟轮换），文中"算法推测"与"社区关键事实"仅反映整理时点（2026-09）的公开认知，后续版本可能已失效，请读者自行验证。
