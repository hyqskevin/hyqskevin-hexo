---
title: WorkBuddy MCP 桥接
date: 2026-09-12 00:00:00
description: IDE 托管的 streamableHttp MCP connector 在无人值守的 automation session 里经常因为启动期竞态而调不到工具。本文给出一个 stdio MCP bridge 方案：从本地加密凭证里解出 OAuth token，包装成 user-level stdio server，5 分钟落地，彻底绕开 IDE 注入延迟与竞态。附带解密原理、操作手册、其他 connector 复用与踩坑清单。
categories:
  - code
tags:
  - mcp
  - workbuddy
  - stdio
  - oauth
  - encryption
  - bridge
---

## 一、背景：MCP 与 IDE 托管 connector 的尴尬

### 1.1 三种传输方式

MCP（Model Context Protocol）是 2024 年底 Anthropic 推的协议，让 LLM 能调外部工具。一个 MCP server 就是一组工具，比如「查股票行情」。它有三种传输方式：

| 传输类型 | 连接方式 | 特点 |
|---|---|---|
| stdio | 启动本地子进程，走 stdin/stdout | 本地、零网络、无认证 |
| streamableHttp | 远端 HTTP endpoint（带 SSE 流） | 需要认证 token |
| SSE | 远端 HTTP endpoint（纯事件流） | 同上 |

我用的 WorkBuddy 客户端把 MCP connector 配置**托管在 IDE 里**：westock-mcp、ima-mcp、github、agent-mail 这些一共 9 个，都是 streamableHttp 类型。它们的 OAuth token 加密存在本地，由 IDE 主进程解密后加 `Authorization` 头。agent 看到的工具名是 `mcp__<connector>__<tool>`。

之所以要用 streamableHttp，是因为这些 connector 背后是腾讯等远端的真实服务，必须带认证 token 才能调；stdio 只能连本地进程，所以 IDE 选了远端方案。代价就是——token 被 IDE 独家攥着，agent 想用得等 IDE 喂。

### 1.2 问题：无人值守 session 调不到工具

这套托管模式在 IDE 里手动调用没问题。但一上 automation / cron / launchd 就抓瞎——session 是无人值守启动的，扫了一圈工具索引，westock-mcp 的工具根本不在里面，4 次重试（0s/30s/60s/120s）全是「Tool not found」，最后降级失败。

我连续几天 15:30 的定时任务都失败了，每次耗 4 分钟指数退避，automation 完全跑不起来。根因不是网络，是 IDE 内部的启动同步问题。真实失败历史是这样的：

| 日期 | 触发 | 根因 | 耗时 |
|---|---|---|---|
| 09-04 15:30 | automation | 冷启动竞态 | 4 min 重试后失败 |
| 09-07 15:30 | automation | 周末 IDE 更新后 Trust 重置 | 4 min 后失败 |
| 09-08 15:38 | automation | Trust 未恢复 | 4 min 后失败 |
| 09-09 15:35 | automation | 冷启动竞态 | 4 min 后失败 |
| 09-10 15:30 | automation | 冷启动竞态 | **3.5 秒降级**（bridge 生效） |

注意 09-07 那条：IDE 更新或重启后，connector 的 Trust 状态会被重置，而且**没有自动恢复**——必须人再点一次 Trust。这是最坑的一种，因为你在 cron 里根本没法手动点。

## 二、根因：启动期的同步竞态（简化版）

### 2.1 两套状态不同步

IDE 平台层和 agent runtime 有**两套独立状态**，互相不同步：

| 状态 | 存储位置 | 生命周期 | 谁写入 |
|---|---|---|---|
| 平台层 connector 状态 | `~/.workbuddy/connectors/<uid>/connector-states.json` | 持久化 | IDE Connector 面板 |
| agent 工具索引 | agent runtime 内存 | per-session | IDE 启动时扫描 |

关键不变量：`connector-states.json` 写 `bound=true`，**不等于** agent 能看到工具。agent 的工具索引只在 session 启动时由 IDE 注入一次，而注入的触发条件 = 用户在 Connector 面板点 Trust——只能手动点。没点过，就没注入，agent 就看不到。

### 2.2 懒加载与就绪闸门的时序

IDE 内部有个「就绪闸门」服务，负责告诉守护进程：所有该连的 MCP 都连上了，可以 spawn agent 子进程了。问题出在它的默认策略——**只等当前已连上的同步连接，不等那些懒加载（deferred）的 MCP**。

时序大概是这样（我抓过启动日志）：

1. T0：spawn agent 子进程
2. T1：子进程调就绪闸门，1–3ms 就返回了（只探活已连上的同步连接）
3. T2：子进程基于 T1 的快照**锁定 tool list**，这一刻 deferred MCP 还没开始加载
4. T3：deferred MCP 陆续加载（5–10s 后），缓存重建了，但子进程的 tool list 已经 lock，没有后续刷新机制
5. T4：agent 调 `mcp__westock-mcp__data_quote` → `Tool not found`

说白了，闸门在工具还没到齐时就放行了，子进程拿了张空表走人，后面工具到了也没人通知它更新。

我把一次真实启动的日志截下来，能看清整个过程（时间戳已脱敏，删掉了进程 pid）：

```text
[16:09:18.240] 就绪闸门=1ms  getConnectedServers=0ms
[16:09:18.245] 锁定 tool list（count=0）
[16:09:20.153] Indexing deferred tools for server: ima-mcp
[16:09:21.048] Indexing deferred tools for server: westock-mcp   ← 5-10s 后才开始
[16:09:25.171] cache rebuilt: size=10
```

`16:09:18` 闸门就返回了，`count=0`；可 westock-mcp 的工具要到 `16:09:21` 才开始索引，缓存重建完成是 `16:09:25`——晚了整整 7 秒。这 7 秒里 agent 拿着空表去调工具，自然全是 `Tool not found`。

### 2.3 race condition 的三个必要条件

我事后总结，这个竞态要同时满足三个条件才会出现：

| 条件 | IDE 托管 connector | 自定义 stdio MCP |
|---|---|---|
| ① IDE 独占 OAuth token | 满足 | **不满足** |
| ② 工具索引需 IDE Trust | 满足 | **不满足** |
| ③ 持久化 vs 内存分离 | 满足 | 弱化（一次性扫描） |

结论很清楚：竞态存在的充要条件是这三条件同时满足。而自定义 stdio MCP 从源头就不满足 ① 和 ②，所以架构层面竞态直接消失。

要治本，得改 IDE 的启动期连接服务——让就绪闸门等 deferred MCP 也加载完再放行，或在工具索引变更时推一次增量刷新。但那是 IDE 团队的事，咱们用户层绕开就行。

> 顺带一提，我试过手动给 connector 的 mcp.json 加 `"defer_loading": false`，实测**完全无效**。因为 IDE 在 spawn 时会重写配置、把自定义字段过滤掉，这是它的安全策略，用户层绕不开。

## 三、方案：stdio MCP bridge

### 3.1 关键洞察——token 可逆向

突破口在于：WorkBuddy 的 OAuth token 加密是完全可逆向的，加密逻辑就写在客户端安装包的源码里（具体实现位置因 IDE 版本而异，以你本地安装为准）。它用的是 **HKDF-SHA256 推导密钥 + AES-256-GCM 解密**，推导公式和参数都是固定的——换句话说，密钥不是远程下发的，而是用本机的 `master.key` 在本地算出来的，所以本地进程同样能算出来。

我把解密出来后的 token 写到一个本地缓存文件，再起一个 stdio MCP server 进程，由它自己带 `Bearer` 直连远端 endpoint。这样任何 session 启动时扫描 mcp.json，自动 fork 这个子进程，**无需 IDE 介入，也就没有竞态**。token 不落盘明文，缓存文件 `chmod 600`，和 IDE 自身的安全等级一致。

### 3.2 架构改造前后

改造前（IDE 托管 streamableHttp）：用户在面板点 Trust → IDE 主进程解密 token 加头 → 转发给 agent → 但 Trust 状态没注入 session 索引，agent 看不到工具。

改造后（stdio bridge）：`init_token.py` 自动解密写 token 缓存 → `westock_bridge.py` 作为 stdio 子进程，启动时读缓存、直连 endpoint → 注册到 user-level `mcp.json` → session 启动自动加载。

反直觉的地方在这：stdio 看起来「丑」（本地进程 + 管道），恰恰是它的优势；streamableHttp 看起来「现代」（远程 HTTP + SSE），反而是竞态温床。根因是——依赖远端认证就必然要有中间层持 token 转发，中间层和 runtime 状态不同步，竞态就来了。stdio 完全本地、子进程自己解密，架构上竞态没了。

改造前后数据流对比：

- **改造前**：agent → IDE 主进程（解密 token + 加头）→ streamableHttp endpoint → 回 IDE → 转发 agent。多一跳，而且 Trust 状态得手动注入。
- **改造后**：agent → 本地 stdio 子进程（自己带 Bearer 直连）→ streamableHttp endpoint。零 IDE 依赖，session 启动扫 mcp.json 就 fork，天然 per-session。

bridge 子进程不做任何缓存，每次调用都直连远端，所以也不存在「token 状态过期不同步」的问题——唯一要注意的是 access_token 本身 30 分钟过期，这个下面会说。

### 3.3 解密原理（HKDF-SHA256 + AES-GCM）

不多卖关子，核心就这几行（示意，不是完整实现）：

```python
import hmac, hashlib
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 1. 用 master.key 推导 AES-256 密钥
def derive_key(master_key: bytes) -> bytes:
    # info 是固定串，不是 connector 名 / serverUrl / serverKey
    info = b"workbuddy-oauth-credentials-v1"
    hkdf = HKDF(algorithm=hashes.SHA256(), length=32, salt=None, info=info)
    return hkdf.derive(master_key)

# 2. AES-256-GCM 解密单个字段
def decrypt_field(key, iv, ciphertext, tag, user_id, server_key, field):
    # AAD 格式：三段用 | 连接
    aad = f"{user_id}|{server_key}|{field}".encode()
    aes = AESGCM(key)
    # cryptography 要求 ct + tag 顺序
    return aes.decrypt(iv, ciphertext + tag, aad)
```

几个踩死我的点：HKDF 的 `info` 是固定串 `"workbuddy-oauth-credentials-v1"`；`userId` 不要带 `||enterprise` 后缀（取 `accountIdentityKey` 第一段）；AAD 是 `${userId}|${serverKey}|${fieldName}` 三段拼；`decrypt` 接收的是 `ct + tag` 顺序，不是 `tag + ct`。

腾讯的 streamableHttp 还包了一层 JSON-RPC，所以 bridge 拿到 `tools/call` 结果后要做二次解析，这一步很容易漏：

```python
import json

# content[0].text 是 JSON 字符串，不是裸数据
raw = result["content"][0]["text"]
payload = json.loads(raw)        # 第一次解析：去外层 JSON-RPC
data = json.loads(payload["data"])  # 第二次：腾讯实际业务数据
print(data["quote"]["sh600026"])
```

## 四、操作手册：5 分钟落地

### 4.1 前置条件

- 你的 WorkBuddy IDE 至少成功连接过 westock-mcp 一次（让 IDE 写入 `.credentials.v3.json`）
- 装好 `cryptography` 库：`pip install cryptography`

### 4.2 三步落地

**Step 1 · 自动提取 token**

```bash
python3 ~/.workbuddy/scripts/westock-bridge/init_token.py --mode=auto
```

输出大概这样：

```text
[1/4] 定位 connector 目录…         ✓ ~/.workbuddy/connectors/<uid>
[2/4] 解密 westock-mcp 凭证…       ✓ access_token + refresh_token + client_id
[3/4] SSE 端到端验证 token…        ✓ token 有效
[4/4] 写入 token 缓存…             ✓ ~/.workbuddy/cache/westock-token.json (chmod 600)
```

**Step 2 · 注册到 user-level mcp.json**

```bash
python3 -c "
import json
p = '~/.workbuddy/mcp.json'
d = json.load(open(p))
d['mcpServers']['westock-bridge'] = {
    'type': 'stdio',
    'command': 'python3',
    'args': ['-u', '~/.workbuddy/scripts/westock-bridge/westock_bridge.py'],
    'cwd': '~/.workbuddy/scripts/westock-bridge',
    'description': 'westock-mcp stdio 桥接（绕开 IDE connector 注入延迟）',
    'disabled': False,
}
open(p, 'w').write(json.dumps(d, indent=2, ensure_ascii=False))
print('patch OK')
"
```

> 注意 `mcp.json` 的 patch 不需要确认，比解密 OAuth 凭证风险低得多，别过度谨慎。

**Step 3 · 重启 IDE 或新开会话，验证**

```bash
python3 ~/.workbuddy/scripts/westock-bridge/test_smoke.py
# 期望：[1/3] initialize ✓ [2/3] tools/list ✓ [3/3] tools/call ✓
```

新会话里 ToolSearch `mcp__westock-bridge__data_quote` 就能看到。

### 4.3 实测结果

我 09-10 实测：token 缓存写入且 `chmod 600`、smoke 测试 3/3 全过（单只 + 批量都验证过）、26 只自选股批量查询 9 涨 17 跌 0 持平。smoke 测试覆盖三步：`initialize` 握手、`tools/list` 列工具、`tools/call` 真调一次，三关全过才算 bridge 健康。改造当天 15:30 的定时任务，从原来 4 分钟降级失败，变成 **3.5 秒**就跑通了——差距不是一个数量级。

### 4.4 不走 agent：cron / launchd 直接调

bridge 是标准 stdio 子进程，不依赖 agent 也能用。想定时拉行情，直接 pipe 一段 JSON-RPC 进去即可：

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call",
      "params":{"name":"data_quote",
                "arguments":{"codes":"sh000001,sh600026,sz002155"}}}' \
  | python3 ~/.workbuddy/scripts/westock-bridge/westock_bridge.py \
  > /tmp/quote.json
```

macOS 上用 launchd 定时更稳，`~/Library/LaunchAgents/com.kevin.westock.quote.plist` 里配好 `ProgramArguments` 和 `StartCalendarInterval`（比如 Hour=16, Minute=0），然后：

```bash
launchctl load ~/Library/LaunchAgents/com.kevin.westock.quote.plist
```

> 注意：launchd 的 `StartCalendarInterval` 是按**本地时区**触发的，别和 UTC 的 cron 表达式搞混；另外 stderr 默认写终端，被 launchd 接走后看不到，记得按 §七 第 7 条重定向到日志文件。

## 五、其他 connector 复用

### 5.1 可复用清单

同一套解密公式对所有 IDE 托管的 connector 都适用：

| Connector | serverKey 后缀 | 备注 |
|---|---|---|
| westock-mcp | `westock-mcp\|<id>` | 已落地 |
| ima-mcp | `ima-mcp\|<id>` | 同套解密 |
| github | （token 在 `tokens/github.txt` 明文） | 特例，直接读明文 |
| agent-mail | `agent-mail\|<id>` | 同套解密 |
| flova / tanyuan-assistant / finenter / teacher-assistant | 同上 | 同套 |

### 5.2 适配步骤

1. 看 `.credentials.v3.json` 的 `mcpOAuth` 段，找到对应 `serverName` 的 key
2. 复制 `init_token.py`，把里面的 `server_key` 改对应值
3. 改 `westock_bridge.py` 的 `ENDPOINT` 和 `TOOLS` 列表
4. 跑 `auto` 模式 + smoke 测试

github 是个特例——它的 token 是明文存在 `tokens/github.txt`，直接读就行，不用走解密流程。

## 六、关键踩坑与故障排查

### 6.1 避坑清单

1. HKDF 的 `info` 是固定串 `"workbuddy-oauth-credentials-v1"`，不是 connector 名
2. `userId` 不要带 `||enterprise` 后缀（取 `accountIdentityKey` 第一段）
3. AAD 格式 `${userId}|${serverKey}|${fieldName}`，三段用 `|` 连接
4. `cryptography` 的 `decrypt(iv, ct + tag, aad)` 要 `ct + tag` 顺序
5. 腾讯 SSE 响应是 `id: evt-xxx\ndata: {...}\n\n`，取最后一个 `data:` 行
6. 腾讯 streamableHttp 又包了一层 JSON-RPC，`tools/call` 的 `content[0].text` 是 JSON 字符串，要二次 `json.loads`
7. stdio MCP 是 per-session 加载，注册后**必须重启 IDE 或新开会话**才生效
8. `access_token` 30 分钟过期，bridge 启动时校验，过期重新跑 `init_token.py`
9. macOS 别给守护进程发 SIGHUP——它是 quit 不是 reload，必须新开会话
10. `mcp.json` patch 不用确认，别过度谨慎

### 6.2 故障排查表

| 现象 | 原因 | 处理 |
|---|---|---|
| `FATAL: westock-token.json 不存在` | 没跑 init_token | 跑 `init_token.py --mode=auto` |
| `ERROR: master.key 与 .credentials.v3.json 不匹配` | master.key 被替换/丢失 | IDE 面板解绑 + 重绑 |
| `ERROR: userId 不匹配` | accountIdentityKey 与 .credentials 不一致 | 同上 |
| `ERROR: token SSE 验证失败` | token 已过期 | IDE 内调一次触发 refresh 再 init |
| agent 工具索引仍 0 命中 | session 没重启 | 重启 IDE 或新开会话 |
| bridge 启动后 SIGHUP 让它退 | macOS Electron SIGHUP=quit | 不要发 SIGHUP，新开会话 |
| bridge 拿到数据但格式异常 | 腾讯双层 JSON-RPC | 看 stderr 日志 |

## 七、已知限制

这套方案不是银弹，落地前先知道边界：

| # | 限制 | workaround |
|---|---|---|
| 1 | access_token 30 分钟过期 | bridge 启动时校验；过期重新跑 `init_token.py`（未实现 OAuth refresh 自动续期）|
| 2 | 同机本地攻击面（master.key 在 `~/.workbuddy/`）| 不防御 root / 提权，与 IDE 客户端同等级 |
| 3 | 与 IDE 原生 connector 并存 | 工具索引同时有两套，优先用 `mcp__westock-bridge__*` |
| 4 | bridge 仅内置 7 个主用 tool | 腾讯实际提供 81 个，往 `TOOLS` 列表加名字即可 |
| 5 | stdio MCP 需 session 重启才生效 | 注册后第一次 session 仍可能 0 命中 |
| 6 | 不要给守护进程发 SIGHUP（macOS 是 quit 不是 reload）| 必须新开会话 |
| 7 | bridge stderr 默认写终端而非文件 | 加 `2>>~/.workbuddy/logs/westock-bridge.log` 即可 |

最后说一句：这套方案的本质，是把「依赖 IDE 中间层转发 token」换成「本地子进程自己解密」，竞态就从架构层面消失了。5 分钟能落地的东西，不值得为它每天浪费 4 分钟退避重试。
