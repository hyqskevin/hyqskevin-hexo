---
title: Obsidian LLM Wiki 多端协同
date: 2026-09-02 00:00:00
description: 把笔记、Agent 配置、Skills、飞书知识库在 4 端（云服务器、Mac Mini、MacBook、手机）形成"一处修改、多处生效"的工作流。含数据流 mermaid 图、6 类资产同步方式、各端实际配置（脱敏版）、3 阶段自动化建议。
categories:
  - notes
tags:
  - Obsidian
  - LLM Wiki
  - Agent
  - Workflow
  - Knowledge Base
  - iCloud
---

最近在整理个人知识库的时候发现一个老问题：**Obsidian vault 横跨 4 个终端**（云服务器、Mac Mini、MacBook、手机），但每个端的同步方式都不一样，改一处要担心其他端能不能跟上。本文是我折腾完之后的协同方案——核心目标是「一处修改、多处生效」，让笔记、Agent 配置、Skills、飞书知识库在不同设备之间形成可预期的链路。

## 一、6 类协同资产

先把要协同的资产摊开看：

| 资产 | 存储位置 | 同步方式 |
|------|----------|----------|
| **Obsidian 笔记** | iCloud Drive + GitHub 备份 | Mac 间 iCloud 实时；云服务器通过 GitHub 拉取 |
| **Agent 配置**（config.yaml / .env） | vault 内的 `hermes/core/` 等子目录 | 跟随 Obsidian iCloud 同步；`.env` 需手动 |
| **Skills** | GitHub 独立仓库 | 各端 `git pull` + cron 定期 |
| **飞书知识库** | 飞书 Cloud | 云服务器 / Mac Mini 通过 plugin 同步 |
| **Coding 项目** | GitHub repo | git push/pull 协同 |
| **Dashboard 静态资源** | GitHub Pages | 各端浏览器访问 |

**核心原则**：**能用 GitHub 拉取的别用 iCloud**（iCloud 不能精细控制同步触发点，git pull 自动化更友好）。

## 二、4 端数据流图

```mermaid
graph TD
    Phone[手机]
    Feishu[飞书]
    Cloud[云服务器]
    Mini[Mac Mini]
    Book[MacBook]
    iCloud[iCloud / Obsidian Vault]
    GH_skills[GitHub Skills]
    GH_code[GitHub 项目]
    GH_blog[GitHub Blog]
    GH_backup[GitHub 备份]

    Phone -.->|飞书App| Feishu
    Phone -.->|iCloud只读| iCloud
    Mini -->|实时双向| iCloud
    iCloud -->|实时双向| Mini
    Book -->|实时双向| iCloud
    iCloud -->|实时双向| Book
    Cloud -->|feishu plugin| Feishu
    Mini -->|feishu plugin| Feishu
    Mini -->|feishu cli| Feishu
    Cloud -->|pull| GH_skills
    Mini -->|pull| GH_skills
    Book -->|pull| GH_skills
    Cloud -->|push/pull| GH_code
    Mini -->|push/pull| GH_code
    GH_code -->|push/pull| Cloud
    GH_code -->|push/pull| Mini
    Mini -->|push| GH_blog
    Cloud -->|pull/push| GH_backup
    Mini -->|备份到云pull| GH_backup
```

几个关键流：

1. **Obsidian 笔记**：Mac Mini ↔ MacBook 通过 iCloud 实时双向。云服务器无 iCloud，靠 GitHub 备份仓库间接同步——Mac 端 `git push` 备份，云服务器 `git pull` 拉取
2. **Skills**：独立 GitHub 仓库，各端 `git clone` 初始化、`git pull` 更新，靠 cron job 兜底
3. **飞书知识库**：云服务器和 Mac Mini 通过 feishu plugin 定时把整理结果推送到飞书；手机直接用飞书 App 消费
4. **Agent 配置**：Hermes 等 Agent 的配置放在 vault 内 `hermes/core/` 等子目录，跟 Obsidian 一起走 iCloud。`.env` 由人手动维护——**禁止 Agent 自动读写**

## 三、6 条同步链路速查表

| 链路 | 方式 | 实时性 | 说明 |
|------|------|--------|------|
| Obsidian 笔记（Mac 间） | iCloud Drive | 秒级 | Apple 原生，零运维 |
| Obsidian 笔记（云服务器） | GitHub 备份 | 定时 | Mac 端 push → 云端 pull，需 cron 驱动 |
| Skills 仓库 | GitHub | 定时 pull | 各端独立 pull，cron 确保版本一致 |
| Obsidian → 飞书知识库 | feishu plugin | 定时 | 处理结果由云端或 Mac Mini 推送 |
| Coding 项目 | GitHub | 手动 | 各端独立 push/pull |
| Agent 配置（`.env`） | 手动 | — | **用户亲自维护**，Agent 不碰 |

## 四、3 阶段自动化建议

### 4.1 立即可行

- **Skills 自动同步**：各端添加 cron job，每 2 小时 `git pull` skills 仓库
- **GitHub 日常 git 操作**：用 Hermes cron job + minimax-2.7 自动执行 `git pull --rebase` → `git add -A` → `git commit -m "auto"` → `git push`
- **Obsidian Git 备份（云服务器）**：cron job 定时从 GitHub 备份仓库 `git pull` 拉取最新 vault

**具体 cron 脚本示例**：

```bash
#!/bin/bash
# /usr/local/bin/sync-vault.sh
cd /opt/vault
git pull --rebase origin main
git add -A
git diff --cached --quiet || git commit -m "auto-sync $(date -I)"
git push origin main
```

```bash
# crontab -e
*/15 * * * * /usr/local/bin/sync-vault.sh
```

### 4.2 建议实施

- **Agent 配置热同步**：`config.yaml` 随 Obsidian 同步后，添加 cron 检测文件变更，自动执行 `hermes config reload`
- **飞书知识库自动写入**：把研究、整理、日报等处理结果按固定模板定时写入飞书知识库
- **Blog 自动发布**：blog 目录变更后自动 commit → push → GitHub Pages deploy

### 4.3 可选优化

- **统一模型配置表**：把所有模型选择集中到一个 `models.yaml`，cron job 分发到各端
- **飞书通知**：同步冲突、失败时通过飞书 bot 推送通知
- **冲突检测**：vault 同步前自动检测冲突，避免 iCloud 双向覆盖丢数据

## 五、典型工作流示例

### 5.1 研究类工作流

1. 在 Mac Mini 或 MacBook 检索资料、整理内容，先写进 Obsidian Wiki
2. 要归档到团队侧或移动端查看时，由 feishu plugin 把整理结果写入飞书知识库
3. 手机端主要用飞书 App 消费，Obsidian App 做只读查看

### 5.2 项目类工作流

1. 在 Mac Mini / 云服务器做 coding 或 multi-agent coding
2. 项目代码通过 GitHub repo 协同（push/pull）
3. 补项目方法论、故障记录、方案说明时再回写 Obsidian Wiki

### 5.3 配置类工作流

1. `config.yaml` 的结构化配置可纳入 Wiki 与 GitHub 备份链路
2. `.env` 由用户亲自修改，Agent 不自动读写
3. 配置变更完成后，再由各端 pull / sync，确保运行端与知识库记录保持一致

## 六、各端实际配置（脱敏版）

### 6.1 云服务器

- **Agent**：openclaw（multi agent）、hermes
- **IM 接入**：飞书、钉钉
- **功能**：24h agent 服务 / multi-agent coding / research / cron / 知识库维护
- **协同链路**：GitHub 仓库（skills 仓库 + Obsidian 备份）
- **模型分工**：research / review 用 deepseek 系，coding 用 doubao-seed-code，debug 用 glm，monitor / cron 用 minimax-2.7

### 6.2 Mac Mini（主力开发机）

- **Agent**：claude code / codex / minimax claw / kimi claw / openclaw / hermes
- **功能**：模型研究 / multi-agent coding / research / GitHub cron / blog 维护 / 飞书知识库
- **协同链路**：iCloud（Obsidian）+ GitHub 仓库 + feishu plugin
- **模型分工**：research 用 deepseek，coding 用 Claude Opus，debug 用 gpt-5.5，monitor/cron 用 minimax-2.7

### 6.3 MacBook（移动场景）

- **Agent**：kimi claw / hermes
- **功能**：research / blog 维护 / 飞书知识库
- **协同链路**：iCloud（只读为主）+ GitHub
- **特点**：大部分操作回 Mac Mini 做，MacBook 主要消费内容

### 6.4 手机

- **IM 接入**：飞书 App / 钉钉 App
- **功能**：模型研究 / research / 飞书维护
- **协同链路**：Obsidian App（只读）+ 飞书 App（消费为主）

> **隐私说明**：本文涉及的本地路径、`.env` 具体内容、Agent 真实账号已全部脱敏，仅保留架构与同步链路层面的描述。vault 根目录用「Mac 主机的 iCloud Drive 子目录」概括，不暴露实际路径。

## 七、3 个常见问题

### 7.1 iCloud 同步冲突

Mac Mini 和 MacBook 同时改同一文件，iCloud 会留两个版本。

**解决**：

```text
1. iCloud 留两个版本（如 "文件.md" + "文件 2.md"）
2. 人工对比，删一份
3. 改用 Git 双向同步避免冲突（多一道工序）
```

### 7.2 Git 推送失败（远端有更新）

```bash
error: failed to push some refs
hint: Updates were rejected because the remote contains work
```

**解决**：

```bash
git pull --rebase
git push
```

cron 里用 `git pull --rebase` 避免产生 merge commit。

### 7.3 Agent 误改配置

`.env` 在 iCloud 里 Agent 误编辑了。

**预防**：

```bash
# 在 vault 外加 .gitignore 排除敏感文件
echo ".env" >> .gitignore
echo "hermes/core/.env" >> .gitignore
```

**恢复**：iCloud 版本历史里找回 → 比对 → 手动恢复。

## 八、4 条工具建议

### 8.1 iCloud 替代品

不放心 Apple：可用 **Syncthing**（点对点同步）或 **Dropbox**（更稳但要钱）。

```bash
# Syncthing 安装（macOS）
brew install syncthing
brew services start syncthing
# 配 Web UI http://localhost:8384
```

### 8.2 feishu plugin 推荐

- [feishu-doc-sync](https://github.com/lark-base/cli) — 官方 CLI
- [lark-cli](https://github.com/larksuite/lark-cli) — 社区版
- 自己用 Python `lark-oapi` SDK 写脚本

### 8.3 Obsidian Git 插件

- **Obsidian Git**（社区）—— 定时 commit + push
- 配置 5 分钟一次 commit，10 分钟一次 push

```text
Vault backup 间隔：5 min
Auto push after commit：true
```

### 8.4 飞书机器人

做个轻量飞书 bot 监听 vault 变更：

```python
# feishu_bot.py
from lark_oapi import LarkClient
import subprocess

client = LarkClient(app_id="...", app_secret="...")

def on_vault_change(path):
    subprocess.run(["git", "-C", "/opt/vault", "add", path])
    subprocess.run(["git", "-C", "/opt/vault", "commit", "-m", f"auto: {path}"])
    # 推送飞书通知
    client.im.v1.message.create(
        receive_id="ou_xxx",
        msg_type="text",
        content=f"📝 vault 更新: {path}"
    )
```

## 九、4 条避坑总结

1. **`config.yaml` 改完必须 reload**——Agent 配置改了不 reload 等于没改
2. **`.env` 不要进 iCloud 共享目录**——`config/` 共享，`.env` 留在 `~/.local/` 私有位置
3. **Skills 仓库用 git tag 版本化**——cron 拉取固定 tag，避免破坏性更新
4. **冲突解决人工来**——不要写脚本自动 merge 笔记，逻辑冲突代码看不懂

## 十、参考

- [obsidian.md](https://help.obsidian.md) — Obsidian 官方
- [syncthing.net](https://syncthing.net) — iCloud 替代
- [obsidian-git.github.io](https://obsidian-git.github.io) — Obsidian Git 插件
- [open.feishu.cn/document](https://open.feishu.cn/document) — 飞书开放平台
- [lark-oapi](https://github.com/larksuite/lark-oapi) — 飞书 Python SDK

---

> **本文适用版本**：Obsidian 1.x + iCloud Drive。`config/` 共享 + `.env` 私有的分层设计是 2026 上半年在宁波本地 4 端实测可行的方案，**适用于个人 / 小团队**，**企业级需要更严格的权限和审计**。