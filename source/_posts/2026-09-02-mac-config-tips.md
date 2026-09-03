---
title: Mac 开发机配置速查
date: 2026-09-02 00:00:00
description: 把新 Mac 配成顺手的开发机要做的全部事：Homebrew + 中科大镜像源、12 个必改的 Terminal defaults（截图位置、Dock、隐藏桌面文件等）、应用双开四步、修复"app 已损坏"两招、9 款装机必备 app 清单。
categories:
  - notes
tags:
  - Mac
  - Homebrew
  - Terminal
  - cheatsheet
  - 效率工具
---

每换一台 Mac 或重装系统后都要重新配置开发环境。这篇是**装机一次到位**的速查清单，按使用顺序排列，全部命令复制就能跑。

## 一、Homebrew + 镜像源

ARM Mac（Apple Silicon）：

```bash
# 一键装 Homebrew
/bin/bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/ineo6/homebrew-install/install.sh)"

# 配置 shell 环境
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 验证
brew --version
# 输出 Homebrew 4.x.x 表示成功
```

默认从 GitHub 拉慢，换成中科大源（4 个仓库）：

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

# 验证
brew update && brew doctor
```

**效果**：原本 5+ 分钟的 `brew install` 缩到 30 秒。

**Intel Mac**（老款）把 `/opt/homebrew` 换成 `/usr/local` 即可。

## 二、12 个必改的 Terminal defaults

Mac 出厂的 Dock / 通知 / 截图 / Finder 默认设置不少反人类。**这些命令全跑一遍**能省很多日常摩擦。

### 1. 截图存到指定目录

```bash
mkdir -p ~/Documents/screenshots
defaults write com.apple.screencapture location ~/Documents/screenshots && \
  killall SystemUIServer
```

### 2. 截图改 jpg 格式

```bash
defaults write com.apple.screencapture type jpg && killall SystemUIServer
```

默认 png 单张 5-10MB，jpg 缩到 1-2MB，**质量损失肉眼不可见**。

### 3. 桌面所有文件隐藏

```bash
defaults write com.apple.finder CreateDesktop -bool false && killall Finder
```

需要恢复：`defaults write com.apple.finder CreateDesktop -bool true && killall Finder`

### 4. Dock 隐藏/显示去延迟

```bash
defaults write com.apple.Dock autohide-delay -float 0 && killall Dock
# 动画时长也缩短
defaults write com.apple.Dock autohide-time-modifier -float 0.3 && killall Dock
```

### 5. Dock 不活跃图标半透明

```bash
defaults write com.apple.dock showhidden -bool TRUE && killall Dock
```

### 6. Launchpad 一页显示更多图标

```bash
defaults write com.apple.dock springboard-columns -int 8
defaults write com.apple.dock springboard-rows -int 7
defaults write com.apple.dock ResetLaunchPad -bool TRUE && killall Dock
```

### 7. 通知横幅 5 秒消失

```bash
defaults write com.apple.notificationcenterui bannerTime 5
```

### 8. 禁止 .DS_Store 写到 U 盘 / 网络盘

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores true
defaults write com.apple.desktopservices DSDontWriteUSBStores true
```

### 9. Finder 显示隐藏文件

```bash
defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder
```

### 10. 禁用开机 chime 声

```bash
sudo nvram SystemAudioVolume=%80
```

NVRAM 设置，重启后生效。恢复：

```bash
sudo nvram -d SystemAudioVolume
```

### 11. 触控板轻点点击（不用按下去）

```bash
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true
```

GUI 设置在「系统设置 → 触控板」也可以。

### 12. 关闭按 apps 自动更新

```bash
# 不自动下载更新
sudo softwareupdate --schedule off
```

GUI 在「系统设置 → 软件更新」。

## 三、应用双开（微信/QQ/钉钉）

Mac 不能像 iOS 那样直接装两个相同的 app，但可以手动做"应用克隆"：

```bash
# 1. 复制 app 到新名字
sudo cp -R /Applications/WeChat.app /Applications/WeChatWork.app

# 2. 改 bundle id（系统靠这个区分 app）
sudo /usr/libexec/PlistBuddy -c \
  "Set :CFBundleIdentifier com.tencent.WeChatWork" \
  /Applications/WeChatWork.app/Contents/Info.plist

# 3. 重签名（系统会拒绝未签名的 app）
sudo codesign --force --deep --sign - /Applications/WeChatWork.app

# 4. 启动分身
nohup /Applications/WeChatWork.app/Contents/MacOS/WeChatWork > /dev/null 2>&1 &
```

启动后在 Dock 右键"在程序坞中保留"。从此一个 app 图标开一个号。

**批量双开**（写脚本）：

```bash
#!/bin/bash
APP_NAME=$1
BUNDLE_ID=$2
sudo cp -R /Applications/${APP_NAME}.app /Applications/${APP_NAME}Work.app
sudo /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier ${BUNDLE_ID}.work" \
  /Applications/${APP_NAME}Work.app/Contents/Info.plist
sudo codesign --force --deep --sign - /Applications/${APP_NAME}Work.app
echo "${APP_NAME}Work 已创建"
```

## 四、修复"app 已损坏 / 无法打开"

下载的第三方 app（不在 App Store / 没过 notarization）会触发 Gatekeeper 拦截：

```bash
# 解除隔离属性（一次性）
sudo xattr -r -d com.apple.quarantine /Applications/SomeApp.app

# 如果还是不行，强制重新签名
sudo codesign --force --deep --sign - /Applications/SomeApp.app
```

第一行删掉 macOS 给下载文件打的"可疑"标记；第二行重新签名骗过 Gatekeeper。**这两步 90% 的"损坏"提示都能解决**。

**批量处理**（装一批破解软件时）：

```bash
for app in /Applications/*.app; do
  sudo xattr -r -d com.apple.quarantine "$app" 2>/dev/null
done
```

## 五、装机必备 app 清单

| 类别 | 推荐 | 备选 |
|---|---|---|
| 启动器 | Alfred（付费，App Store） | Raycast（免费开源） |
| 菜单栏管理 | Bartender 4（付费） | Ice（免费） |
| 窗口管理 | Rectangle（免费开源） | Magnet（付费） |
| 截图 / OCR | iShot（免费带 OCR） | CleanShot X（付费） |
| 终端 | Warp（现代化） | iTerm2（老牌） |
| 终端美化 | oh-my-zsh + powerlevel10k | starship（跨 shell） |
| 剪切板 | Maccy（开源） | Paste（付费） |
| 密码管理 | 1Password（付费） | Bitwarden（免费） |
| VPN / 代理 | ClashX Pro | Surge |

**Alfred + Rectangle + iShot** 三个就能把日常效率拉高一大截。

**开发必装**：

```bash
# Homebrew Cask 一行装齐
brew install --cask \
  visual-studio-code \
  iterm2 \
  rectangle \
  raycast \
  alt-tab \
  iina \
  obsidian \
  figma \
  notion \
  wechat \
  feishu \
  dingtalk

# 命令行工具
brew install \
  git \
  node \
  python@3.12 \
  jq \
  ripgrep \
  fd \
  fzf \
  lazygit \
  neovim \
  tmux \
  htop
```

`ripgrep`（`rg`）比 `grep` 快 10-100 倍；`fd` 是 `find` 的现代替代；`fzf` 是模糊查找必备。

## 六、zsh + oh-my-zsh 配置

Mac 默认 zsh 但没装 oh-my-zsh 的话相当于没配：

```bash
# 装 oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 装 powerlevel10k 主题
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git \
  ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
# 在 ~/.zshrc 改 ZSH_THEME="powerlevel10k/powerlevel10k"
# 重启 shell，按提示配置

# 必装插件
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
# ~/.zshrc 改 plugins=(...)

# 必备别名（追加到 ~/.zshrc）
alias ll='ls -lah'
alias la='ls -A'
alias l='ls -CF'
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gd='git diff'
alias gco='git checkout'
alias gb='git branch'
alias gl='git log --oneline -20'
alias v='vim'
alias c='code .'
alias lg='lazygit'
```

## 七、SSH + Git 配置

开发机必配：

```bash
# 1. 生成 SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
# 默认路径 ~/.ssh/id_ed25519

# 2. 启动 ssh-agent
eval "$(ssh-agent -s)"

# 3. macOS 特殊配置（添加到 ~/.ssh/config）
cat >> ~/.ssh/config <<'EOF'
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519

Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
EOF

# 4. 把公钥加到 GitHub
cat ~/.ssh/id_ed25519.pub | pbcopy
# 打开 https://github.com/settings/keys 粘贴

# 5. 测试
ssh -T git@github.com
# Hi username! You've successfully authenticated
```

**Git 全局配置**：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true   # pull 时 rebase 而非 merge
git config --global core.autocrlf input  # macOS / Linux 不改行尾
git config --global core.editor "code --wait"
git config --global rerere.enabled true  # 复用冲突解决
```

## 八、Python 数据科学环境

```bash
# 用 Miniforge（conda 的轻量替代，M1 友好）
curl -L -O https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-MacOSX-arm64.sh
bash Miniforge3-MacOSX-arm64.sh

# 添加到 PATH
echo 'export PATH="$HOME/miniforge3/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 创建项目环境
conda create -n myproject python=3.11
conda activate myproject

# 装数据科学常用包
conda install numpy pandas matplotlib scikit-learn jupyter
```

**pip 用阿里镜像**：

```ini
# ~/.pip/pip.conf
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
trusted-host = mirrors.aliyun.com
```

## 九、常见错误速查

| 错误 | 原因 | 解决 |
|---|---|---|
| `command not found: brew` | Homebrew PATH 没配 | 装完后执行 `brew shellenv` |
| `xcrun: error: invalid active developer path` | Xcode Command Line Tools 没装 | `xcode-select --install` |
| `App 已损坏` | Gatekeeper 拦截 | `xattr -d com.apple.quarantine` |
| `Operation not permitted` | SIP 保护 | 多数情况不该关 SIP，少数如要关需要 Recovery Mode |
| `xcode-select: error: tool 'xcodebuild' requires Xcode` | 装错工具 | 装 `xcode-select --install`（不是 Xcode）|
| 终端 `command not found` 找不到 brew 安装的 | zsh PATH 配置问题 | `echo $PATH \| tr ':' '\n'` 看是否有 `/opt/homebrew/bin` |
| Finder 侧栏多一堆内容 | 旧设备同步 | 「访达 → 设置 → 边栏」关掉不要的项 |
| App Store 一直转圈 | 账号问题 | `sudo killall appstoreagent` |

## 十、装机后 30 分钟清单

```text
[ ] Homebrew + 中科大镜像源                  5 分钟
[ ] 12 个 defaults 命令                      10 分钟
[ ] zsh + oh-my-zsh + powerlevel10k          5 分钟
[ ] SSH key 生成 + GitHub 配置               5 分钟
[ ] 必备 brew install                        5 分钟
[ ] Python / Node 开发环境                    5 分钟
[ ] 应用双开（微信/钉钉）                    2 分钟
[ ] 终端别名（ll / gs / v 等）               1 分钟
[ ] 测试：brew install hello && brew doctor   1 分钟
```

跑完这 10 步，新 Mac 就能进入"能干活"状态。具体美化（主题、字体、配色）可以慢慢来。

## 十一、macOS 版本差异

不同系统版本的 defaults 路径可能不同：

| 版本 | 默认 Shell | Homebrew 路径 | 备注 |
|---|---|---|---|
| macOS 10.15 (Catalina) | zsh | `/usr/local` | 切换到 zsh |
| macOS 11 (Big Sur) | zsh | `/opt/homebrew`（ARM）/ `/usr/local`（Intel） | Apple Silicon 起步 |
| macOS 12 (Monterey) | zsh | 同上 | M1 Pro/Max 主流 |
| macOS 13 (Ventura) | zsh | 同上 | 系统设置重构 |
| macOS 14 (Sonoma) | zsh | 同上 | 新增桌面 widgets |
| macOS 15 (Sequoia) | zsh | 同上 | iPhone mirroring |

**Intel Mac 迁移到 Apple Silicon**：不用全装 Homebrew，原 `/usr/local` 的内容不能用，要在 `/opt/homebrew` 重新装。备份 `brew list` 输出，新机重装。

## 十二、参考

- [brew.sh](https://brew.sh) — 官方
- [github.com/ineo6/homebrew-install](https://github.com/ineo6/homebrew-install) — 国内镜像装
- [sspai.com/post/27662](https://sspai.com/post/27662) — 通知中心定制
- [sspai.com/post/40169](https://sspai.com/post/40169) — 更多 defaults 隐藏选项
- [github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) — zsh 配置框架
- [github.com/romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k) — 主题

---

> **适用 macOS 版本**：13+（Apple Silicon）。Intel Mac 把 `/opt/homebrew` 换成 `/usr/local` 即可。