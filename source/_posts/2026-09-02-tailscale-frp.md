---
title: Tailscale + frp 远程组网
date: 2026-09-02 00:00:00
description: macbook-air 远程连 mac-mini 的实战方案：Tailscale 直连失败时（Stash TUN 劫持 + 对称 NAT）的 frp 内网穿透 fallback，延迟从 450ms 降到 100ms。含完整 frps/frpc 配置 + 11 个常见问题排查 + Windows 远程桌面补充。
categories:
  - notes
tags:
  - Tailscale
  - frp
  - 内网穿透
  - VNC
  - 远程桌面
  - Mac
---

macbook-air 想远程连 mac-mini 时，Tailscale 直连经常失败——`MappingVariesByDestIP: true` 是对称 NAT、UDP 打洞不通，加上 Stash TUN 模式劫持所有出站流量，最后只能走 DERP 中继（香港节点，延迟 450ms）。本文记录**用 frp 内网穿透降到 <100ms** 的实战方案。

## 一、问题诊断

| 问题 | 位置 | 说明 |
|------|------|------|
| 对称 NAT | 两端 | `MappingVariesByDestIP: true`，UDP 打洞失败 |
| Stash TUN 劫持 | mac-mini | `StashTunnel.appex` 创建 `utun7 (198.18.0.1)`，拦截所有出站流量 |
| 只能走 DERP 中继 | 两端 | mac-mini 分配到 hkg（香港），延迟 400-500ms |
| 高分辨率传输 | mac-mini | Retina 2560×1600 + 外接 2560×1080，VNC 像素量巨大 |
| 运营商无 IPv6 | mac-mini | 路由器无 IPv6 前缀下发，无法 IPv6 直连绕过 NAT |

**最终方案**：frp 内网穿透（mac-mini → 阿里云服务器 → macbook-air），延迟从 450ms 降到 <100ms。

## 二、网络环境

| 设备 | 关键信息 |
|---|---|
| **macbook-air**（本地） | Tailscale: 100.124.133.75 / 电信对称 NAT / frp VNC 客户端 |
| **mac-mini**（远程） | Tailscale: 100.80.71.18 / 小米路由器 / 局域网 192.168.31.67 / 装 Stash |
| **阿里云 ECS**（中继） | 公网 121.43.122.77 / Ubuntu 22.04 / 开放 7000 + 5900 |

**关键**：mac-mini 上 Stash TUN 模式必须关闭，否则 Tailscale 流量全被劫持。

## 三、Tailscale 排查

```bash
# 查看 Tailscale 状态
tailscale status
tailscale netcheck

# 测试对端延迟
tailscale ping macbook-air
```

**关键诊断指标**：

```bash
# 正常直连（目标）
UDP: true
MappingVariesByDestIP: false   # 全锥 NAT 才能打洞

# 异常（需排查）
UDP: false                     # 防火墙/VPN 拦截
MappingVariesByDestIP: true   # 对称 NAT
Relay: hkg/sfo/...             # 只能走中继
```

### Stash 冲突处理（mac-mini）

**问题**：Stash TUN 模式创建 `utun7 (198.18.0.1)`，劫持 Tailscale UDP。

**排查**：

```bash
ifconfig | grep utun
pgrep -l StashTunnel
sudo lsof | grep utun | awk '{print $1, $2}' | sort -u
```

**方案 A：关 Stash TUN**（推荐）

```bash
osascript -e 'quit app "Stash"'
sudo killall -9 StashTunnel
ifconfig | grep utun        # utun7 应消失
tailscale netcheck           # UDP: true
```

**方案 B：Stash 规则排除 Tailscale**

```yaml
rules:
  - IP-CIDR,100.64.0.0/10,DIRECT,no-resolve
  - IP-CIDR6,fd7a:115c:a1e0::/48,DIRECT,no-resolve
```

## 四、frp 内网穿透（核心配置）

### 架构

```
mac-mini ─frpc─→ 阿里云 frps:7000 ←frpc─ macbook-air
127.0.0.1:5900   121.43.122.77       VNC 客户端
```

frps 是"接线员"——在公网监听，被动等 frpc 连入；frpc 是"翻译官"——从内网主动连出，把本地端口暴露成公网端口。

### 服务器 frps（阿里云）

`~/frp_0.61.1_linux_amd64/frps.toml`：

```toml
bindPort = 7000

[transport]
heartbeatTimeout = 30   # 默认 90s 改成 30s，避免断联 90s 内复用代理名冲突
```

systemd 服务 `/etc/systemd/system/frps.service`：

```ini
[Unit]
Description=FRP Server
After=network.target

[Service]
ExecStart=/home/ecs-user/frp_0.61.1_linux_amd64/frps -c /home/ecs-user/frp_0.61.1_linux_amd64/frps.toml
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl start frps
sudo systemctl enable frps
sudo ss -tlnp | grep 7000     # 验证 LISTEN
sudo ufw allow 7000/tcp
sudo ufw allow 5900/tcp
```

**阿里云安全组**：入方向 TCP 7000 + 5900，授权 `0.0.0.0/0`。

### 客户端 frpc（mac-mini）

`~/frpc.toml`：

```toml
serverAddr = "121.43.122.77"
serverPort = 7000
transport.heartbeatInterval = 10   # 10s 心跳，配合 frps 30s 超时

[[proxies]]
name = "mac-mini-vnc"
type = "tcp"
localIP = "127.0.0.1"
localPort = 5900
remotePort = 5900
```

**手动运行**：

```bash
/opt/homebrew/bin/frpc -c ~/frpc.toml
# 成功输出：login to server success, get run id [xxx]
#          [mac-mini-vnc] start proxy success
```

### 持久化（macOS launchd）

`~/Library/LaunchAgents/com.fatedier.frpc.plist`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key><string>com.fatedier.frpc</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/frpc</string>
        <string>-c</string>
        <string>/Users/hanamaki_mac_mini/frpc.toml</string>
    </array>
    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>
    <key>StandardOutPath</key><string>/Users/hanamaki_mac_mini/frpc.log</string>
    <key>StandardErrorPath</key><string>/Users/hanamaki_mac_mini/frpc-error.log</string>
</dict>
</plist>
```

```bash
launchctl load ~/Library/LaunchAgents/com.fatedier.frpc.plist
launchctl list | grep com.fatedier.frpc
tail -f ~/frpc.log
```

## 五、VNC 连接（最终目标）

**通过 frp**（主方案）：

```bash
# macbook-air 上
open vnc://121.43.122.77:5900
```

凭据：mac-mini 的系统用户名和密码。

**通过 Tailscale**（备用，受限中继延迟）：

```bash
open vnc://100.80.71.18
```

## 六、11 个常见问题速查

| 问题 | 原因 | 解决 |
|---|---|---|
| `dial tcp ... i/o timeout` | frps 未运行 / 端口未放行 | `systemctl status frps` + `ss -tlnp \| grep 7000` |
| `Couldn't connect to server 127.0.0.1:7890` | Stash 代理环境变量残留 | `unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY` |
| Tailscale `UDP: false` | Stash TUN 模式劫持 UDP | `killall -9 StashTunnel` + 关 Stash |
| frpc Homebrew 装不上 | brew 源问题 | 手动下二进制：`curl -L -o frp.tar.gz https://github.com/fatedier/frp/releases/...` |
| 开 Stash 后 frpc 连不上 | Stash 劫持 frpc 出站 | Stash 加 `IP-CIDR,121.43.122.77/32,DIRECT` |
| `proxy already exists` | frp 0.61.1 默认 `heartbeatTimeout=90s`，断联后 90s 内复用名冲突 | 双方加心跳：frps 30s + frpc 10s |
| Windows frpc 连上但 RDP 连不上 | 3389 没监听 / Win Home 版不支持 RDP / 防火墙 / ECS 未放行 | `netstat -ano \| findstr :3389` + 升级 Windows 版本 |
| Windows 重启后 frpc 没起 | 任务计划或 nssm 未注册 | `Get-ScheduledTask -TaskName "frpc"` |
| Windows SSH 连不上 | sshd 未起 / 账户没密码 / 端口未放行 | `Get-Service sshd` + `Start-Service sshd` + 设账户密码 |
| Windows VNC 连不上 | 本机没装 VNC Server | `netstat -ano \| findstr :5900` + 装 RealVNC/TightVNC |
| Windows SMB 连不上 | 共享未启用 / 权限不足 / 60445 未放行 | `Get-SmbShare` + 验证账户能访问共享 |

## 七、Windows 远程桌面补充（可选）

如果还要连家里 Windows PC，frp 配置加：

```toml
# C:\frp\frpc.toml
serverAddr = "121.43.122.77"
serverPort = 7000
transport.heartbeatInterval = 10

[[proxies]]
name = "winpc-rdp"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3389
remotePort = 3389   # 或改成 6002 自定义

[[proxies]]
name = "winpc-ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6001
```

Windows PowerShell 启 OpenSSH Server + 远程桌面 + 放行防火墙 + 持久化（任务计划程序或 nssm）—— 跟 mac-mini 的 launchd 类似。

**macbook-air 上连 Windows**：

```bash
# RDP
open rdp://121.43.122.77:3389

# SSH
ssh 你的Windows用户名@121.43.122.77 -p 6001
```

> ⚠️ SMB 不建议长期暴露公网（即使是改了端口）。长期用建议走 Tailscale 或其他 VPN。

## 八、frp 工作原理详解（5 步流程）

理解 frp 怎么跑的，对排查问题至关重要：

```text
1. 启动 → mac-mini frpc 连 ECS frps:7000
2. 注册 → frpc 告诉 frps：「mac-mini-vnc = 我本地 127.0.0.1:5900，请用公网 :5900 收流量」
3. 心跳 → frpc 每 10s 报一次心跳（heartbeatInterval），告知自己还活着
4. 断联检测 → frps 30s 没收到心跳就清掉这个代理（heartbeatTimeout）
5. 流量转发 → 用户连 ECS:5900 → frps 找到对应 frpc → 通过 7000 通道把数据塞给 frpc → frpc 转到本地 5900（VNC）
```

**关键**：第 5 步走的是**同一条 7000 控制连接**（多路复用），不是新开 5900 连接。所以 frps 的 5900 是"客户端看到的入口"，**实际数据还是跑在 7000 这条长连接上**。

**frps / frpc 角色对比**：

| 角色 | 全称 | 跑在哪 | 主要职责 |
|---|---|---|---|
| frps | frp **server** | 阿里云 ECS（公网 IP） | 监听控制端口 + 代理端口；等 frpc 主动连接；按规则做流量转发 |
| frpc | frp **client** | 内网机器（mac-mini） | 主动连出到 frps；声明本地哪个端口暴露成公网哪个端口；维护心跳 |

## 九、5 条安全建议

frp 默认是**明文传输**——VNC 流量在公网上是裸的。生产环境务必加层：

1. **frp 启用 TLS**（v0.50+ 支持）：`frps.toml` 加 `transport.tls.force = true`，流量加密
2. **frp 启用身份认证**：`token = your-strong-password` 在 frps 配置，frpc 必须带相同 token 才能连
3. **VNC 改 SSH + X11 转发**：VNC 协议不安全，远程桌面用 RDP（Windows）/SSH+X11（Linux/Mac）更稳
4. **服务器安全组最小化**：只放行 7000（控制）+ 5900/3389（具体代理端口），不开无关端口
5. **启用 fail2ban**：frps 配 iptables 规则，连续失败 5 次封 IP 一小时

```toml
# frps.toml 加 token 认证
auth.method = "token"
auth.token = "your-strong-random-password-here"
```

```toml
# frpc.toml 同步
auth.method = "token"
auth.token = "your-strong-random-password-here"
```

## 十、维护建议

1. **定期看日志**：`tail -f ~/frpc.log`，断联第一时间发现
2. **Stash 升级后重检**：新版本可能自动开 TUN 模式，要重新关
3. **服务器安全组最小化**：只放行 7000（控制）+ 必要的 remotePort（5900/3389/22/445）
4. **VNC/SMB 别长期暴露**：临时用可以，长期用走 Tailscale/ZeroTier
5. **配置备份**：所有 toml / plist / systemd 单元文件都该进 Git，机器坏了能快速恢复

---

> 实战中 frp 比 Tailscale 稳定（特别是在国内 NAT 环境）。如果只需要连 1-2 台机器，frp 简单够用；如果设备多 / 经常变，Tailscale 更省心。**两者结合（frp 主、TS 备）是最稳的方案**。