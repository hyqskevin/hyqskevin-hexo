---
title: 家庭多设备远程控制（上）：环境 + Tailscale + SSH
date: 2026-09-02 00:00:00
description: 家庭 Mac + Windows + NAS 混合环境通过 Tailscale 实现外网安全访问（上篇）：设备清单 / 4 种协议对比 / Tailscale 安装 / SSH 远程命令 / 公私钥配置 / 端口转发。
series:
  name: home-multi-device-remote
  index: 1
  total: 2
categories:
  - notes
tags:
  - Tailscale
  - SSH
  - RDP
  - VNC
  - SMB
  - 远程桌面
---

家里 Mac + Windows + NAS 混合环境想从外网安全访问？本文（上篇）讲 Tailscale 组网 + SSH 远程命令；（下篇）讲 RDP / VNC / SMB 图形和文件共享。

## 一、设备清单

| 设备 | 角色 | 需安装 |
|---|---|---|
| **MacBook** | 主力开发机 / 被控端 | Tailscale + SSH / VNC |
| **Windows PC** | 辅助开发 / 被控端 | Tailscale + RDP |
| **NAS** | 文件存储 / 被控端 | Tailscale + SMB |
| **外网设备**（手机/笔记本） | 控制端 | Tailscale 客户端 |

## 二、4 种协议对比

| 协议 | 用途 | 平台 | 端口 |
|---|---|---|---|
| **SSH** | 命令行操作 | Mac / Linux / Win PowerShell | 22 |
| **RDP** | Windows 远程桌面 | Windows（Win Pro 必要） | 3389 |
| **VNC** | Mac 屏幕共享 | Mac / Linux | 5900 |
| **SMB** | 文件共享访问 | 跨平台 | 445 |

Tailscale 把所有设备放进 `100.x.x.x` 虚拟内网，外网设备像在家一样访问，**不需要公网 IP / 端口转发 / 动态 DNS**。

## 三、Tailscale 基础安装

### 3.1 MacBook

```bash
brew install tailscale
# 或 App Store 搜 "Tailscale"

# 启动并登录
tailscale up
# 浏览器登录同一账号（Google / Microsoft / GitHub 都行）
```

### 3.2 Windows

```bash
# 下载安装
winget install Tailscale.Tailscale
# 或官网下载 https://tailscale.com/download

# 启动后浏览器登录
```

### 3.3 NAS（Synology / 群晖）

```bash
# 套件中心搜索 "Tailscale" 装
# 或 SSH 后手动装（ARM / x86 选对应包）
sudo tailscale up
```

### 3.4 验证组网

每台设备上：

```bash
tailscale status
# 应看到所有设备 + 100.x.x.x IP
tailscale ping macbook
# 测试到对端延迟
```

## 四、SSH 远程命令（最常用）

### 4.1 启用 Mac 远程登录

```bash
# 系统设置 → 通用 → 共享 → 远程登录 → 开
# 或命令行
sudo systemsetup -setremotelogin on

# 验证
sudo systemsetup -getremotelogin
# Remote Login: On
```

### 4.2 公私钥登录（推荐）

**MacBook（控制端）**生成密钥：

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
# 默认保存到 ~/.ssh/id_ed25519
# 提示 passphrase 时建议设（增强安全）
```

**Mac（被控端）**添加公钥：

```bash
# 从控制端把公钥拷过去
ssh-copy-id user@100.x.x.x

# 或手动
cat ~/.ssh/id_ed25519.pub | ssh user@100.x.x.x "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**配置 SSH 客户端**`~/.ssh/config`：

```
Host mac-home
    HostName 100.x.x.x
    User yourname
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60

Host nas
    HostName 100.y.y.y
    User admin
    Port 22
```

**连接**：

```bash
# 直接用别名
ssh mac-home
ssh nas

# 进一层目录
ssh mac-home "cd /Users/yourname/projects && ls"
```

### 4.3 公私钥登录 Windows

Windows OpenSSH Server（Win 10+ 自带）：

```powershell
# 装 OpenSSH Server
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# 启动并设置自启
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic

# 放行防火墙
New-NetFirewallRule -Name sshd -DisplayName "OpenSSH Server" `
  -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
```

Mac 控制端连 Windows：

```bash
ssh yourname@100.z.z.z
# 第一次需要密码
# 之后就能用公私钥免密
```

把 Mac 的公钥拷到 Windows：

```powershell
# 在 Windows PowerShell
mkdir $HOME\.ssh
notepad $HOME\.ssh\authorized_keys
# 粘贴 Mac 的 id_ed25519.pub 内容
```

### 4.4 端口转发（高级）

```bash
# 把远程 NAS 的 5000 端口转回本地（看 NAS Web UI）
ssh -L 5000:localhost:5000 nas
# 浏览器访问 http://localhost:5000 即可

# 反向：把本地服务暴露给远程
ssh -R 8080:localhost:3000 mac-home
# 远程访问 localhost:8080 即可
```

## 五、配置调优

### 5.1 Magic DNS（自动解析）

Tailscale 默认开启，每台设备都有自动域名：

```bash
ssh mac-home.tail1234.ts.net
# 不用记 100.x.x.x IP
```

### 5.2 节点共享（多人共享）

在 Tailscale 管理后台 → Access Controls：

```json
// tailnet policy
{
  "acls": [
    {"action": "accept", "src": ["*"], "dst": ["tag:server:22"]},
    {"action": "accept", "src": ["group:family"], "dst": ["tag:server:*"]}
  ],
  "groups": {
    "group:family": ["user1@", "user2@"]
  },
  "tagOwners": {
    "tag:server": ["autogroup:admin"]
  }
}
```

### 5.3 Exit Node（远程流量出口）

```bash
# 让 mac-home 当出口节点
tailscale up --advertise-exit-node

# 外网设备用 mac-home 当出口
tailscale set --exit-node=mac-home
```

这样在外网时所有流量从家里的 Mac 出去，**绕过公司网络限制 + 保护隐私**。

### 5.4 Subnet Router（访问整个家庭内网）

如果家里有 NAS、智能家居、打印机等 Tailscale 装不了的设备，可以让一台设备当 subnet router：

```bash
# 在 mac-home 上
tailscale up --advertise-routes=192.168.31.0/24

# 其他设备就能访问 192.168.31.x 整个家庭内网
ssh 192.168.31.1  # 路由器后台
```

### 5.5 Funnel（公网暴露服务）

```bash
# 把本地服务（web / ssh）通过 Tailscale 公开
tailscale funnel 80 on
# 自动分配 https://mac-home.tail1234.ts.net/ 域名
```

不暴露 NAS web UI 给朋友，**Funnel + ACL** 限定 IP 段。

## 六、5 个常见错误排查

### 6.1 SSH 连接超时

```bash
# 1. 验证 Tailscale 状态
tailscale status
ping 100.x.x.x

# 2. 验证 SSH 服务
sudo lsof -iTCP:22 -sTCP:LISTEN
# macOS 系统设置 → 共享 → 远程登录开

# 3. 检查防火墙
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

### 6.2 Permission denied (publickey)

```bash
# 检查公私钥配对
ssh -v mac-home
# 看到 "Offering public key" 和 "Authentications that can continue" 信息

# 确认服务端 authorized_keys 有你的公钥
ssh mac-home "cat ~/.ssh/authorized_keys"
# 复制 mac 控制端的公钥进去
```

### 6.3 Tailscale 显示 offline

```bash
# 重启服务
sudo tailscale down && sudo tailscale up

# 看日志
sudo tailscale log
# 常见：NAT 类型问题（symmetric NAT 打洞失败）→ 自动走 DERP 中继
```

### 6.4 连接慢（>500ms）

```bash
# 看是直连还是 DERP
tailscale status
# "direct" 表示直连；"relay" 表示中继

# 走 DERP 时延迟高 → 检查两端 NAT 类型
tailscale netcheck
# UDP: true 表示可打洞；UDP: false 走中继
```

### 6.5 SSH 频繁断连

```bash
# 客户端配置保活（防止 NAT 老化断流）
# ~/.ssh/config
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

---

## 下期预告

（下）篇讲图形与文件访问：**RDP 远程 Windows 桌面 / VNC 远程 Mac 屏幕 / SMB 文件共享**的完整配置 + 性能调优 + 故障排查。👉 [（下）：RDP / VNC / SMB 实战](/2026/09/01/2026-09-02-home-multi-device-remote-2/)