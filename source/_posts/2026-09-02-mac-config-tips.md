---
title: Mac 开发机配置速查：Homebrew 镜像 + 终端隐藏技巧 + 应用双开
date: 2026-09-02 00:00:00
description: 把一台新 Mac 配成顺手的开发环境需要做的事：Homebrew + 中科大镜像源、12 个常用 terminal 默认值修改、应用双开和损坏修复。1204 字速查。
categories:
  - notes
tags:
  - Mac
  - Homebrew
  - Terminal
  - cheatsheet
  - 效率工具
---

每换一台 Mac 或重装系统后都要重新配置一遍开发环境。这篇是我的速查清单，按使用顺序排列，复制粘贴就能用。

## 一、Homebrew + 镜像源（必装）

ARM Mac（Apple Silicon）：

```bash
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

默认从 GitHub 拉慢，换成中科大源：

```bash
# brew / core / cask 三个仓库
cd "$(brew --repo)" && git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core" && \
  git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-cask" && \
  git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

# 二进制预编译包镜像（最大加速点）
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc

brew update && brew doctor
```

装完后体感：原本 5+ 分钟的 brew install 缩到 30 秒。

## 二、12 个必改的 Terminal 默认值

Mac 出厂的 Dock / 通知 / 截图 / Finder 默认设置不少反人类，下面这些命令全跑一遍能省很多日常摩擦。

```bash
# 截图存到 ~/Documents/screenshots 而不是桌面
defaults write com.apple.screencapture location ~/Documents/screenshots && \
  killall SystemUIServer

# 截图改 jpg 格式（默认 png 太大）
defaults write com.apple.screencapture type jpg && killall SystemUIServer

# 桌面所有文件隐藏（保持桌面干净）
defaults write com.apple.finder CreateDesktop -bool false && killall Finder

# Dock 隐藏/显示去延迟（默认有 0.5s 动画）
defaults write com.apple.Dock autohide-delay -float 0 && killall Dock

# Dock 不活跃图标半透明
defaults write com.apple.dock showhidden -bool TRUE && killall Dock

# Launchpad 一页显示更多图标
defaults write com.apple.dock springboard-columns -int 8
defaults write com.apple.dock springboard-rows -int 7
defaults write com.apple.dock ResetLaunchPad -bool TRUE && killall Dock

# 通知横幅 5 秒消失（默认太慢）
defaults write com.apple.notificationcenterui bannerTime 5

# 禁止 .DS_Store 写到 U 盘 / 网络盘
defaults write com.apple.desktopservices DSDontWriteNetworkStores true

# 禁用 .Localized 索引
defaults write -g AppleLanguages '("zh-CN", "en-US")'

# Finder 默认显示隐藏文件
defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder

# 禁用开机 chime 声
sudo nvram SystemAudioVolume=%80
```

最后一条 `nvram` 改的是 NVRAM，重启后生效。

## 三、应用双开（微信 / QQ / 钉钉）

Mac 不能像 iOS 那样直接装两个相同的 app，但可以手动做"应用克隆"：

```bash
# 1. 复制 app 到新名字
sudo cp -R /Applications/WeChat.app /Applications/WeChatWork.app

# 2. 改 bundle id（系统靠这个区分 app）
sudo /usr/libexec/PlistBuddy -c \
  "Set :CFBundleIdentifier com.tencent.WeChatWork" \
  /Applications/WeChatWork.app/Contents/Info.plist

# 3. 重签名
sudo codesign --force --deep --sign - /Applications/WeChatWork.app

# 4. 启动分身
nohup /Applications/WeChatWork.app/Contents/MacOS/WeChatWork > /dev/null 2>&1 &
```

启动后在 Dock 右键"在程序坞中保留"。从此一个 app 图标开一个号。

## 四、修复"app 已损坏 / 无法打开"

下载的第三方 app（不在 App Store / 没过 notarization）会触发 Gatekeeper 拦截：

```bash
# 解除隔离属性（一次性）
sudo xattr -r -d com.apple.quarantine /Applications/SomeApp.app

# 如果还是不行，强制重新签名
sudo codesign --force --deep --sign - /Applications/SomeApp.app
```

第一行删掉 macOS 给下载文件打的"可疑"标记；第二行重新签名骗过 Gatekeeper。这两步 90% 的"损坏"提示都能解决。

## 五、装机必备 app 清单

| 类别 | 推荐 |
|---|---|
| 启动器 | Alfred（App Store）或 Raycast（免费） |
| 菜单栏管理 | Bartender / Ice |
| 窗口管理 | Rectangle（免费开源）/ Magnet |
| 截图 / OCR | iShot（带 OCR）/ CleanShot X（付费） |
| 终端 | Warp（现代化）或 iTerm2 |
| 终端美化 | oh-my-zsh + powerlevel10k |
| 剪切板 | Maccy（开源） |

Alfred + Rectangle + iShot 三个就能把日常效率拉高一大截。

---

> **适用 macOS 版本**：13+（Apple Silicon）。Intel Mac 把 `/opt/homebrew` 换成 `/usr/local` 即可。