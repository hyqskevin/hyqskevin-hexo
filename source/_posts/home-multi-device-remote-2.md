---
title: 家庭多设备远程控制（下）：RDP / VNC / SMB
date: 2026-09-02 00:00:00
description: 家庭多设备远程控制下篇：RDP 远程 Windows 桌面完整配置（Win Pro 必要 + 用户权限 + 分辨率）、VNC 远程 Mac 屏幕（含 Apple Screen Sharing 替代）、SMB 文件共享访问、3 种远程方案性能对比、4 个常见故障排查。
series:
  name: home-multi-device-remote
  index: 2
  total: 2
categories:
  - notes
tags:
  - Tailscale
  - RDP
  - VNC
  - SMB
  - 远程桌面
  - 文件共享
---

（上）篇讲了 Tailscale 组网 + SSH 远程命令。本篇讲图形界面和文件共享：**RDP 远程 Windows 桌面**、**VNC 远程 Mac 屏幕**、**SMB 文件共享访问**。

## 一、3 种方案对比

| 维度 | RDP | VNC（Mac） | SMB |
|---|---|---|---|
| **用途** | 远程 Windows 桌面 | 远程 Mac 屏幕 | 文件共享 |
| **平台** | Windows | Mac | 跨平台 |
| **协议** | 3389/TCP | 5900/TCP | 445/TCP |
| **图像质量** | 高（GPU 加速） | 中（CPU 编码） | 不适用（文件传输） |
| **音频** | 双向 | 单向 | 不支持 |
| **剪贴板** | 同步 | 同步 | 同步（拖放） |
| **多屏** | 支持 | 支持（需配置） | 不支持 |
| **加密** | TLS | 弱（需 SSH 隧道） | 弱（需 VPN） |
| **跨平台客户端** | macOS / iOS / Android / Linux | 全平台（含 RealVNC） | Finder / Explorer / smbclient |

**核心建议**：

- Windows 桌面 → **RDP**（性能好、原生 GPU 加速）
- Mac 屏幕 → **VNC** 或 **Apple Screen Sharing**（更原生）
- 文件共享 → **SMB**（跨平台）或 **scp**（单文件传输）

## 二、RDP 远程 Windows 桌面

### 2.1 前置条件

- **Windows 必须是 Pro / Enterprise / Education**（Home 版不能作为 RDP 服务端）
- 系统设置 → 系统 → 远程桌面 → 开启"启用远程桌面"
- 防火墙放行 3389/TCP

### 2.2 配置用户权限

```powershell
# 启用 RDP
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server' -Name fDenyTSConnections -Value 0

# 启用网络级别身份验证（NLA，更安全）
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -Name UserAuthentication -Value 1

# 添加用户到"远程桌面用户"组（Win 11 默认排除管理员）
Add-LocalGroupMember -Group "Remote Desktop Users" -Member "YourUser"
```

### 2.3 Mac 控制端连接

```bash
# App Store 装 "Microsoft Remote Desktop"
open rdp://100.z.z.z
# 或 GUI 里输入 IP / 凭证
```

### 2.4 通过 Tailscale 优化

Tailscale 已经把设备放进 100.x.x.x 虚拟内网，RDP 直接走这个内网：

```bash
# 默认 Tailscale 启用 Magic DNS
open rdp://mac-win.tail1234.ts.net
# Magic DNS 比 IP 友好
```

### 2.5 性能调优

| 设置 | 推荐 | 说明 |
|---|---|---|
| 分辨率 | 1920×1080 或源端 | Retina 屏降低一半 |
| 颜色深度 | 32 位 | 16 位看着发灰 |
| 音频 | 远程主机播放 | Mac 端听 |
| 剪贴板 | 开 | 文件互传方便 |
| 磁盘/打印机重定向 | 关 | 减少带宽 |

```bash
# RDP 配置文件 ~/.rdp 关键项
screen mode id:i:2
use multimon:i:0
session bpp:i:32
audiomode:i:0
redirectclipboard:i:1
redirectprinters:i:0
redirectdrives:i:0
```

## 三、VNC 远程 Mac 屏幕

### 3.1 系统自带 Screen Sharing（推荐）

macOS 内置，**比第三方 VNC 兼容性好**：

```bash
# 系统设置 → 通用 → 共享 → 屏幕共享 → 开
# 设置 VNC 密码（必填）
```

或命令行：

```bash
sudo launchctl enable system/com.apple.screensharing
sudo launchctl start system/com.apple.screensharing
```

**Mac 控制端**（控制另一台 Mac）：

```bash
open vnc://100.x.x.x
# 或 Finder → 前往 → 连接服务器 → vnc://100.x.x.x
```

**Windows 控制端**：

```bash
# 用 RealVNC Viewer（免费）
# 输入 100.x.x.x:5900
```

### 3.2 第三方 VNC（高级用户）

如需更细的权限控制，装 RealVNC Server：

```bash
brew install --cask vnc-viewer  # 控制端
# RealVNC Server 在 Mac App Store 搜 "VNC Server"（付费）
```

### 3.3 提高 VNC 性能

```bash
# Mac 设置
defaults write com.apple.ScreenSharing "VNCScreenQuality" -int 5
# 0 = 最高质量（带宽大）
# 5 = 较快（默认）
# 9 = 最快（图像糊）

# 控制端用 RealVNC 时，选 "Medium" 质量 + 关闭颜色增强
```

### 3.4 Apple Screen Sharing vs VNC 差异

| 特性 | Apple Screen Sharing | 第三方 VNC（RealVNC） |
|---|---|---|
| 集成 | 系统级 | 单独应用 |
| 多屏支持 | 主屏 | 可选全屏 |
| 加密 | 弱（需 SSH 隧道） | 可强加密 |
| 文件传输 | 拖放 | 拖放（按需） |
| 跨平台 | 仅 Mac | 全平台 |

**结论**：macOS 互控用 **Screen Sharing**（最简），Windows/Mac 互控用 **RealVNC**（最广）。

## 四、SMB 文件共享

### 4.1 Mac 作为 SMB 服务端

```bash
# 系统设置 → 通用 → 共享 → 文件共享 → 开
# 勾选 "共享文件夹" 列表
# "选项" 里启用 SMB 访问
```

或命令行：

```bash
sudo launchctl enable system/com.apple.smbd
sudo launchctl start system/com.apple.smbd
```

### 4.2 Mac 控制端访问 SMB

```bash
# Finder → Cmd+K → 连接服务器
smb://100.x.x.x

# 或命令行
mount -t smbfs //user@100.x.x.x/Shared /Volumes/shared
```

### 4.3 Windows 控制端访问 SMB

```bash
# 资源管理器地址栏输入
\\100.x.x.x\Shared

# 或映射网络驱动器
net use Z: \\100.x.x.x\Shared
```

### 4.4 通过 Tailscale 优化 SMB

Tailscale 已加密，但 SMB 协议本身的认证较老（NTLMv2）。**强烈建议**：

- **SMB over Tailscale**（不暴露 445 到公网）= **安全**
- **不要把 SMB 直接暴露公网**（即使改了端口）

```bash
# 验证 SMB 通过 Tailscale 工作
smbutil statshares -m //100.x.x.x
# 应列出共享文件夹
```

## 五、性能对比实测

| 方案 | 局域网延迟 | Tailscale 延迟 | 带宽占用 | 适用 |
|---|---|---|---|---|
| **RDP** | 5-20ms | 30-80ms | 5-20 Mbps | 桌面操作 |
| **VNC** | 10-30ms | 50-150ms | 10-30 Mbps | 演示 / 跨平台 |
| **SMB** | 5-15ms | 20-50ms | 文件大小决定 | 文件传输 |
| **scp** | 5-15ms | 20-50ms | 文件大小决定 | 单文件 |

**Tailscale 直连 vs DERP 中继**：

- 直连（NAT 打洞成功）：延迟 < 50ms
- DERP 中继（NAT 类型不兼容）：延迟 200-500ms

可以 `tailscale ping` 看当前是哪种。

## 六、4 个常见故障

### 6.1 RDP 连接被拒

```
远程桌面无法连接到远程计算机
原因：远程桌面服务未启用 / 防火墙阻止
```

**排查**：

```powershell
# Windows 上
Get-Service TermService
# 应显示 Running

# 防火墙
Get-NetFirewallRule -DisplayGroup "Remote Desktop" | Select Enabled, Direction, Action
```

**解决**：

```powershell
# 启用服务
Set-Service -Name TermService -StartupType Automatic
Start-Service TermService

# 放行防火墙
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

### 6.2 Mac VNC 显示黑屏

**原因**：macOS 屏幕共享需要用户登录才能用，**未登录状态显示黑屏**。

**解决**：

- 让 Mac 始终登录（设置 → 用户与群组 → 自动登录）
- 或用锁屏模式（`pmset` 命令）
- 或 SSH 进 Mac 唤醒屏幕：`pmset wake` 或打开活动监视器

### 6.3 SMB 速度慢

```bash
# Mac 测速
smbutil view //user@100.x.x.x/Shared

# 启用 SMB 3（多通道）
sudo defaults write /Library/Preferences/nsmb.conf -dict-add "default" "{multichannel_enable=true;signing_required=false}"
```

**Mac SMB 默认 3.0 但有限制**。上 multichannel 后速度能翻倍。

### 6.4 Tailscale 子网路由不工作

```bash
# mac-home 上确认路由广播
tailscale status
# 192.168.31.0/24  via x.x.x.x

# 其他设备启用 subnet
# 在 Mac 上把 192.168.31.0/24 推给 tailscale
sudo tailscale up --advertise-routes=192.168.31.0/24
```

## 七、3 条安全建议

1. **强 VNC 密码**：默认 8 位容易破解，建议 16+ 位
2. **限制 SMB 用户**：用 macOS 文件共享里的"仅这些用户"白名单
3. **Tailscale ACL**：管理后台按设备 tag 精细控制访问权限

## 八、3 条进阶玩法

1. **远程开机（Wake-on-LAN）** + Tailscale 开机自启 = 出门在外也能远程开机
2. **文件版本管理**：Mac SMB 共享 + Git 自动 commit
3. **Screensharing 录屏**：QuickTime Player → 文件 → 新建屏幕录制 → 选远程

---

> **本文 + 上篇** = 完整的家庭多设备远程控制方案。**Tailscale + SSH/RDP/VNC/SMB** 的组合**比传统 VPN/TeamViewer 简单 5-10 倍**，且更安全（端到端加密）。