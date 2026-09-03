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

## 十三、zsh 进阶配置

`.zshrc` 不只是装 oh-my-zsh。**有 5 个细节能让你终端体验从"能用"变"顺手"**。

### 1. PATH 顺序

```bash
# .zshrc 顶部
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"
# Homebrew 在最前，local bin 次之
```

### 2. 自定义函数

```bash
# 在 ~/.zshrc 加

# 快速建项目目录并 cd 进去
mkcd() { mkdir -p "$1" && cd "$1"; }

# 提取任何压缩包
extract() {
  if [ -f $1 ]; then
    case $1 in
      *.tar.bz2) tar xjf $1 ;;
      *.tar.gz)  tar xzf $1 ;;
      *.bz2)     bunzip2 $1 ;;
      *.rar)     unrar e $1 ;;
      *.gz)      gunzip $1 ;;
      *.tar)     tar xf $1 ;;
      *.tbz2)    tar xjf $1 ;;
      *.tgz)     tar xzf $1 ;;
      *.zip)     unzip $1 ;;
      *.Z)       uncompress $1 ;;
      *.7z)      7z x $1 ;;
      *)         echo "'$1' 无法解压" ;;
    esac
  else
    echo "'$1' 不是有效文件"
  fi
}

# 快速查端口占用
port() {
  lsof -i :$1
}

# 查本机 IP
myip() {
  ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
}
```

### 3. 智能历史搜索

```bash
# 在 ~/.zshrc 加
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt SHARE_HISTORY      # 多终端共享历史
setopt HIST_IGNORE_DUPS   # 跳过重复
setopt HIST_FIND_NO_DUPS  # 搜索时跳过重复
```

`Ctrl+R` 反向搜索历史命令，按 `Ctrl+R` 多次继续往前找。

### 4. 智能补全

```bash
autoload -Uz compinit && compinit
# 模糊匹配
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={a-zA-Z}'
# 目录补全带颜色
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
```

### 5. 提示符美化（powerlevel10k 之外的选择）

如果不想装 p10k，用 starship（跨 shell）：

```bash
brew install starship
echo 'eval "$(starship init zsh)"' >> ~/.zshrc
```

`~/.config/starship.toml` 自定义：

```toml
[character]
success_symbol = "[➜](bold green)"
error_symbol = "[✗](bold red)"

[node]
version_format = "v[($semver)]($style) "
```

## 十四、Docker Desktop 替代方案

Docker Desktop 商业授权争议后，社区有 3 个常用替代：

| 工具 | 优势 | 安装 |
|---|---|---|
| **OrbStack** | 启动快、UI 优雅、免费个人用 | `brew install --cask orbstack` |
| **Colima** | 开源、CLI 工具 | `brew install colima docker docker-compose` |
| **Rancher Desktop** | k8s 友好 | `brew install --cask rancher` |

**Colima 配置示例**（推荐 ARM Mac 用）：

```bash
# 启动
colima start --cpu 4 --memory 8 --disk 60

# 装 docker-compose
brew install docker-compose

# 验证
docker run hello-world
```

**Docker Desktop 必装**（不在乎授权就用）：

```bash
brew install --cask docker
# 启动后开 OrbStack 兼容模式
```

**镜像加速**（国内）：

```ini
# ~/.docker/daemon.json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}
```

## 十五、系统性能优化

新 Mac 通常性能就 OK，但可以进一步优化：

### 1. 关闭多余启动项

```bash
# 查看登录时启动的应用
osascript -e 'tell application "System Events" to get the name of every login item'

# 禁用某个启动项
osascript -e 'tell application "System Events" to delete login item "ItemName"'
```

GUI 在「系统设置 → 通用 → 登录项」。

### 2. 关闭 Spotlight 索引

如果用 Alfred / Raycast 代替 Spotlight 搜索：

```bash
# 关闭索引（节省 CPU）
sudo mdutil -a -i off

# 完全禁用 Spotlight
sudo mdutil -E /

# 重新启用（如果改主意）
sudo mdutil -a -i on
```

### 3. 关掉没用的动画

```bash
# 加快窗口动画
defaults write NSGlobalDomain NSWindowResizeTime -float 0.001

# 关掉 Mission Control 动画
defaults write com.apple.dock expose-animation-duration -float 0

# 关掉 Launchpad 动画
defaults write com.apple.dock springboard-show-duration -float 0
defaults write com.apple.dock springboard-hide-duration -float 0
defaults write com.apple.dock springboard-page-duration -float 0
```

### 4. 关闭 Crash Reporter

```bash
defaults write com.apple.CrashReporter DialogType none
```

**注意**：关掉后系统崩溃不再弹窗，但日志还在 `/Library/Logs/DiagnosticReports/`。

### 5. 减少 Time Machine 备份频率

```bash
# 默认每小时备份，改成每天
sudo defaults write /System/Library/LaunchDaemons/com.apple.backupd-auto Interval -int 86400
```

**注意**：这是 system-level default，谨慎改。

### 6. 内存压力监控

```bash
# 看内存压力
memory_pressure
# 输出 System-wide memory free percentage: XX%

# 看进程内存占用
top -o mem
```

**活动监视器** GUI 也行：Dock 右键 → 选项 → 活动监视器。

### 7. 清理系统缓存

```bash
# 系统缓存（需 sudo）
sudo rm -rf /Library/Caches/*

# 用户缓存
rm -rf ~/Library/Caches/*

# Xcode 派生数据（开发机才需要）
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

**MacCleaner Pro** 等第三方工具能可视化清理，**但大多数"清理工具"是骗钱的**——手动 rm 就行。

## 十六、备份与恢复策略

新 Mac 配好之后一定要做备份，否则下次换机要重来：

### 1. Time Machine（系统级）

```bash
# 启用 Time Machine 备份到外接硬盘
sudo tmutil enable
sudo tmutil startbackup --auto
```

推荐用 Time Machine 自动备份整个系统。

### 2. 配置文件 dotfiles 备份

`.zshrc`、`.npmrc`、SSH keys、`.gitconfig` 这些应该进 git 仓库：

```bash
# 推荐用 chezmoi 或 yadm 管理 dotfiles
brew install yadm
yadm init
yadm add ~/.zshrc ~/.gitconfig ~/.npmrc
yadm commit -m "Initial dotfiles"
yadm remote add origin https://github.com/your/dotfiles.git
yadm push
```

新机恢复：

```bash
yadm clone https://github.com/your/dotfiles.git
```

### 3. Homebrew 备份

```bash
# 导出当前所有安装的包
brew bundle dump --file=~/Brewfile
git add ~/Brewfile
git commit -m "Update Brewfile"

# 新机恢复
brew install --cask --app-store
brew bundle install --file=~/Brewfile
```

`Brewfile` 是声明式清单，比手动重装可靠。

### 4. SSH key 备份（**重要！**）

```bash
# SSH key 丢了 GitHub 账号就锁了，必须备份
# 加密存到 1Password / Bitwarden / 加密 U 盘
```

## 十七、装机后的微调

### 触控板手势（增加效率）

| 手势 | 动作 |
|---|---|
| 三指上滑 | Mission Control |
| 三指下滑 | App Exposé |
| 三指左右滑 | 切换全屏应用 |
| 四指捏合 | Launchpad |
| 四指张开 | 显示桌面 |
| 双指点按（轻按） | 智能缩放 |
| 双指从边缘滑入 | 通知中心 |

GUI 在「系统设置 → 触控板」全部可配。

### Spotlight 替代

如果禁用了 Spotlight，用 Alfred 替代：

```bash
brew install --cask alfred
```

设置 Workflows：
- 全局快捷键 `Cmd+Space` 触发
- 搜索 Everything（默认）
- 计算器（输入 `=2+2` 直接出结果）
- 系统命令（输入 `shutdown` 直接关机）
- 剪贴板历史（默认集成）

### 文件预览增强

```bash
# Quick Look 增强（预览各种文件）
brew install --cask qlmarkdown  # 预览 Markdown
brew install --cask qlimagesize  # 预览图片带尺寸
```

### 终端复用（tmux）

`tmux` 是 SSH 远程工作必备，本地也很有用：

```bash
brew install tmux

# 配置文件 ~/.tmux.conf
cat > ~/.tmux.conf <<'EOF'
# 鼠标支持
set -g mouse on

# 前缀键改 Ctrl-a（emacs 风）
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# 切分窗格
bind | split-window -h
bind - split-window -v

# 重新加载配置
bind r source-file ~/.tmux.conf \; display "reloaded!"
EOF

# 启动
tmux
```

常用命令：
- `Ctrl-a "` 横切分
- `Ctrl-a %` 竖切分
- `Ctrl-a d` detach（后台）
- `tmux a` 重新 attach

## 十八、远程办公配置

新 Mac 拿来远程办公要配的几件事：

### 1. Tailscale（组网）

```bash
brew install --cask tailscale
# 启动后用 Google / Microsoft 账号登录
# 自动获得 100.x.x.x 虚拟 IP，可以访问家里 / 公司网络
```

### 2. SSH 服务器

```bash
# macOS 自带 sshd，只需开启
sudo systemsetup -setremotelogin on

# 验证
sudo systemsetup -getremotelogin
# Remote Login: On

# 防火墙允许
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/sbin/sshd
```

### 3. 屏幕共享（VNC）

```bash
# 系统设置 → 通用 → 共享 → 屏幕共享
# 或命令行
sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.screensharing.plist
```

### 4. Mos（鼠标平滑）

远程办公用 Mos 解决 macOS 鼠标加速问题：

```bash
brew install --cask mos
# 设置：滚动方向反转、滚轮平滑、指针加速曲线
```

## 十九、macOS 软件下载加速

App Store / Xcode 下载慢的话换 DNS：

```bash
# 临时换 DNS
sudo networksetup -setdnsservers Wi-Fi 223.5.5.5 119.29.29.29

# 阿里 DNS（推荐）
# 223.5.5.5 / 223.6.6.6
# 腾讯 DNS
# 119.29.29.29 / 119.28.28.28
# Cloudflare
# 1.1.1.1 / 1.0.0.1
```

恢复默认：

```bash
sudo networksetup -setdnsservers Wi-Fi empty
```

**Xcode 下载加速**：

```bash
# 用 aria2c 多线程下载
brew install aria2

# 或用 xcodes（专门管理 Xcode 版本的工具）
brew install xcodes
xcodes install 16.0  # 自动从苹果 CDN 加速下载
```

## 二十、给不同角色推荐的装机清单

### 给前端开发

```bash
brew install --cask \
  visual-studio-code \
  google-chrome \
  firefox \
  charles \
  postman \
  figma \
  iterm2

brew install \
  node \
  pnpm \
  yarn
```

### 给后端开发

```bash
brew install --cask \
  visual-studio-code \
  iterm2 \
  orbstack \
  postman \
  tableplus \
  redis-insight

brew install \
  go \
  python \
  rust \
  postgresql@15 \
  redis \
  mysql
```

### 给数据科学

```bash
brew install --cask \
  visual-studio-code \
  jupyter-notebook \
  visual-studio-code  # VSCode Jupyter 插件

brew install \
  python \
  miniforge
# 然后 conda install pandas numpy scikit-learn matplotlib jupyter
```

### 给设计师

```bash
brew install --cask \
  figma \
  sketch \
  zeplin \
  adobe-creative-cloud \
  cleanmymac \
  istat-menus
```

## 二十一、装机后最容易踩的 5 个坑

### 坑 1：SIP 关闭后系统升级挂掉

**症状**：`sudo spctl assess --enable` 关闭 Gatekeeper 后系统大版本升级可能失败。
**解决**：升级前重新开启 Gatekeeper。

### 坑 2：默认 zsh PATH 不带 Homebrew

**症状**：`brew install xxx` 装好后 `command not found`。
**解决**：把 `eval "$(/opt/homebrew/bin/brew shellenv)"` 加到 `~/.zprofile`（zsh 默认登录 shell 读这个，不是 `.zshrc`）。

### 坑 3：MySQL/Postgres 数据文件没备份就重装

**症状**：`brew uninstall postgresql` 把 `~/Library/Application Support/Postgres` 一并删了。
**解决**：卸载前先 `pg_dumpall > backup.sql` 或拷贝 data 目录。

### 坑 4：Time Machine 备份到外接硬盘时机器休眠

**症状**：备份中断，下次想恢复发现数据不全。
**解决**：macOS 设置里关闭"电池供电时进入睡眠"，或在电源设置里选"防止自动睡眠"。

### 坑 5：dotfiles 装好后 SSH key 丢了

**症状**：GitHub / GitLab 账号锁了，重新走"忘记密码"流程很麻烦。
**解决**：装好 Mac 第一件事就是 `cat ~/.ssh/id_ed25519 | pbcopy`，存到 1Password / 加密 U 盘。

## 二十二、调试与诊断

Mac 调试工具集：

### 1. 活动监视器

GUI 应用，看 CPU / 内存 / 磁盘 / 网络。`/Applications/Utilities/Activity Monitor.app`

### 2. Console.app

系统日志：`/Applications/Utilities/Console.app`，按时间过滤应用日志。

### 3. 终端命令

```bash
# 看 CPU 占用
top -o cpu
# 持续 5 秒采样
top -o cpu -s 5

# 看内存压力
memory_pressure

# 看磁盘使用
df -h
du -sh ~/Library/* | sort -h

# 看网络连接
netstat -an | grep ESTABLISHED
lsof -iTCP -sTCP:ESTABLISHED

# 看系统启动时间
uptime
who -b

# 看系统日志
log show --predicate 'eventMessage CONTAINS "error"' --last 1h
```

### 4. 第三方工具

```bash
# 进程监控
brew install htop

# 网络分析
brew install --cask wireshark

# 系统信息
brew install neofetch

# 磁盘分析（看哪占空间）
brew install --cask omnidisksweeper
```

## 二十三、macOS 快捷键大全

**系统级**：
- `Cmd+Q` 退出应用
- `Cmd+W` 关闭窗口
- `Cmd+M` 最小化
- `Cmd+H` 隐藏
- `Cmd+Tab` 切换应用
- `Cmd+`` 同应用多窗口切换
- `Cmd+Shift+3` 全屏截图
- `Cmd+Shift+4` 区域截图
- `Cmd+Shift+5` 截图工具
- `Ctrl+上箭头` Mission Control
- `Cmd+Space` Spotlight（如果没改）

**文本编辑**：
- `Cmd+←/→` 行首/行尾
- `Option+←/→` 词首/词尾
- `Cmd+Shift+K` 注释/取消注释（VSCode）

**终端**：
- `Ctrl+A/E` 命令行首/行尾
- `Ctrl+U/K` 删除到行首/行尾
- `Ctrl+R` 反向搜索历史
- `Ctrl+L` 清屏
- `Cmd+K` 清屏（部分终端）
- `Cmd+D` 垂直分屏（iTerm2）
- `Cmd+Shift+D` 水平分屏（iTerm2）

## 二十四、推荐资源

- [macos-defaults.com](https://macos-defaults.com) — 所有 defaults 命令大全
- [github.com/mathiasbynens/dotfiles](https://github.com/mathiasbynens/dotfiles) — 前 Google 工程师的 dotfiles（学习范式）
- [sspai.com](https://sspai.com) — 少数派，macOS 高质量教程
- [github.com/agarrharr/awesome-macos](https://github.com/agarrharr/awesome-macos) — macOS 资源汇总
- [macos.tips](https://macos.tips) — 每日小技巧
- [reddit.com/r/macapps](https://reddit.com/r/macapps) — 应用推荐
- [macmenu.app](https://macmenu.app) — 状态栏图标管理

## 二十五、参考

- [brew.sh](https://brew.sh) — Homebrew 官方
- [github.com/ineo6/homebrew-install](https://github.com/ineo6/homebrew-install) — 国内镜像装
- [sspai.com/post/27662](https://sspai.com/post/27662) — 通知中心定制
- [sspai.com/post/40169](https://sspai.com/post/40169) — 更多 defaults 隐藏选项
- [github.com/ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh) — zsh 配置框架
- [github.com/romkatv/powerlevel10k](https://github.com/romkatv/powerlevel10k) — 主题
- [github.com/twpayne/chezmoi](https://github.com/twpayne/chezmoi) — dotfiles 管理
- [macos-defaults.com](https://macos-defaults.com) — 所有 defaults 命令大全

---

> **适用 macOS 版本**：13+（Apple Silicon）。Intel Mac 把 `/opt/homebrew` 换成 `/usr/local` 即可。

**最后**：装机不是一次性事，**好用的配置都是慢慢调出来的**。从这 21 节的速查开始，按需添加，每次新发现好用的小工具就 `brew install` 装上、`Brewfile` 备份下来。半年后你的 Mac 就成了最顺手的开发机。

## 二十六、一句话总结

**Homebrew + 镜像源 + zsh + 9 款 app + 12 个 defaults**——这五件套搞定一台新 Mac 80% 的开发机需求。剩下 20% 留给慢慢调：**先用、再优化、最后备份**，是这个装机清单的核心节奏。

## 二十七、推荐的 4 个 dotfiles 仓库

如果你刚换 Mac 没头绪，先 clone 这 4 个 dotfiles 仓库做参考：

- [mathiasbynens/dotfiles](https://github.com/mathiasbynens/dotfiles) — 前 Google 工程师的，macOS + Homebrew + Bash 范式
- [holman/dotfiles](https://github.com/holman/dotfiles) — GitHub CEO 的极简版
- [driesvints/dotfiles](https://github.com/driesvints/dotfiles) — Laravel 维护者的 PHP 友好版
- [nikitavoloboev/dotfiles](https://github.com/nikitavoloboev/dotfiles) — 个人最爱，AI / ML 工具链齐全

**不要直接复制**——看思路后挑适合自己工作流的 20% 留下，剩下改成本地化版本。每个人的 dotfiles 都不一样，盲目抄只会给自己挖坑。

## 二十八、macOS 升级策略

每年 9-10 月苹果发大版本（macOS 16、17...），**不要第一时间升级**：

- **Wait 3 个月**：等 .0 → .3 修复已知 bug（特别是外接显示器 / Wi-Fi 兼容性问题）
- **Wait 6 个月**：等 .0 → .5，确认主流 dev 工具（Docker、Homebrew、Node）兼容
- **Wait 1 年**：等 .1 → .1，确认稳定后再升

**升级前必做**：

```bash
# 1. Time Machine 完整备份
tmutil startbackup --block

# 2. Brewfile 导出
brew bundle dump --file=~/Brewfile.backup

# 3. 关键文件备份
cp ~/.ssh/id_ed25519 ~/Desktop/ssh-backup
cp -r ~/.gnupg ~/Desktop/gpg-backup

# 4. 列出已安装 app
ls /Applications/ > ~/Desktop/apps-backup.txt
```

**升级失败回退**：

macOS 通常不能直接降级，要么：
- 用 Time Machine 恢复到升级前的备份（全盘擦写）
- 干净重装（要重做所有配置）

**建议**：生产机永远别追大版本，等次年 .1 / .2 再说。