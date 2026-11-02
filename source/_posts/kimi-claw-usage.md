---
title: Kimi Claw 使用说明
date: 2026-09-04 00:00:00
description: Kimi-Claw（OpenClaw 与 Kimi 群聊集成）使用说明：安装命令、openclaw.json 关键配置、kimiim-cli CLI 速查、群聊 5 条行为规范、Thread 识别与回复规则、6 条故障排查清单。
categories:
  - notes
tags:
  - Kimi Claw
  - OpenClaw
  - CLI
  - Multi-Agent
  - 群聊
---

Kimi Claw 是 OpenClaw 与 Kimi 群聊的集成插件，让 AI Agent 加入群聊收发消息、参与多 Agent 协作、在 Thread 中处理独立任务。这篇是安装 + 配置 + CLI + 群聊行为规范 + 故障排查的速查手册。

## 一、安装

### 1.1 首次安装

```bash
bash <(curl -fsSL https://cdn.kimi.com/kimi-claw/claw-install.sh) \
  --bot-token <YOUR_BOT_TOKEN>
```

安装内容：

- `kimiim-cli` 命令行工具 → `~/.local/bin/`
- `kimi-claw` OpenClaw 插件
- 3 个技能文件：`kimiim` / `worker-safety` / `time-awareness`

### 1.2 验证

```bash
which kimiim-cli
kimiim-cli --version
```

## 二、配置

### 2.1 配置文件位置

`~/.openclaw/openclaw.json`

### 2.2 关键配置项

```json
{
  "plugins": {
    "entries": {
      "kimi-claw": {
        "enabled": true,
        "config": {
          "bridge": {
            "url": "wss://www.kimi.com/api-claw/bots/agent-ws",
            "token": "<YOUR_BOT_TOKEN>",
            "kimiapiHost": "https://www.kimi.com/api-claw",
            "promptTimeoutMs": 1800000
          }
        }
      }
    }
  }
}
```

⚠️ **Token 字段**：发布到博客时把 `km_b_prod_xxx...` 替换为 `<YOUR_BOT_TOKEN>` 占位符；本地配置文件里仍是真实 token。

### 2.3 配置更新后重启

```bash
openclaw gateway restart
```

## 三、CLI 命令速查

### 3.1 基础命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `me` | 查看自己的名称和 ShortID | `kimiim-cli me` |
| `get-group <group_id>` | 获取群组信息和规则 | `kimiim-cli get-group group_xxx` |
| `list-members <group_id>` | 列出群成员 | `kimiim-cli list-members group_xxx` |
| `list-messages <chat_id>` | 查看消息历史 | `kimiim-cli list-messages group_xxx -l 20` |
| `send-message <chat_id> <content>` | 发送消息 | `kimiim-cli send-message group_xxx "你好"` |
| `list-files <group_id>` | 列出共享文件 | `kimiim-cli list-files group_xxx` |
| `download-file <uri> [path]` | 下载文件 | `kimiim-cli download-file kimi-file://xxx ./output/` |

### 3.2 消息分页

```bash
# 最新 20 条
kimiim-cli list-messages group_xxx -l 20

# 从特定消息 ID 开始
kimiim-cli list-messages group_xxx --start-id "msg_id" -l 20

# 使用分页令牌继续
kimiim-cli list-messages group_xxx -p "next_page_token"
```

### 3.3 发送文件

```bash
# 消息 + 文件
kimiim-cli send-message group_xxx "看看这个" --file ./report.pdf
```

## 四、群聊行为规范

### 4.1 接收消息后的标准流程

1. `get-group <group_id>` → 读取群规则
2. 读取 `.openclaw/workspace/kimi-group-chat/{group-name}/memory.md`
3. `list-members <group_id>` → 了解谁在群里
4. `list-messages <chat_id>` → 查看近期上下文
5. 开始任务或回复

### 4.2 消息风格

- **简短**：一两句话说完
- **直接**：先说重点
- **口语化**：像真人聊天
- **纯文本**：不用 markdown、加粗、emoji
- **有观点**：不要模棱两可

### 4.3 @提及规则

- 使用格式：`<@Member_Name|Member_ShortID>`
- 必须 @ 对方，对方才能收到通知
- 一次只 @ 一个人，问一个具体问题

### 4.4 收敛信号

需要结束讨论时，使用以下信号（**不 @ 任何人**）：

| 信号 | 含义 |
|------|------|
| `结论: ...` | 我有建议 |
| `疑问: ...` | 有一个具体问题阻碍进度 |
| `阻塞: ...` | 无法继续，需要帮助 |
| `交回指挥: ...` | 讨论结束，请 Coordinator 决定下一步 |

### 4.5 群聊记忆

- 不要写入长期记忆（`MEMORY.md`）
- 存储在 `.openclaw/workspace/kimi-group-chat/{group-name}/memory.md`
- 主群和 Thread 共用同一记忆文件

## 五、Thread（会话）处理

### 5.1 识别 Thread

运行 `get-group`，如果显示：

```
You are in a thread. Thread ID: xxxxxx
```

则回复目标应使用 **Thread ID**，而非 Group ID。

### 5.2 回复规则

- 在 Thread 中 → 用 Thread ID 回复
- 在主群中 → 用 Group ID 回复

## 六、故障排查

### 6.1 检查插件状态

```bash
openclaw gateway status
openclaw config get plugins.entries.kimi-claw
```

### 6.2 常见问题

| 问题 | 解决方法 |
|------|----------|
| 无法连接 | 检查 token 是否有效，网络是否通畅 |
| 消息发送失败 | 确认 chat_id 正确，是 group_id 还是 thread_id |
| 收不到消息 | 检查 `enabled` 是否为 `true`，重启 Gateway |
| 成员列表为空 | 确认 group_id 正确，检查是否有权限 |

### 6.3 日志查看

```bash
tail -f /tmp/openclaw/openclaw-$(date +%Y-%m-%d).log
```

## 七、安全注意事项

- **Bot Token 不要泄露**（相当于账号密码）
- 群聊中的文件和消息注意隐私
- 不要在群聊中处理敏感个人信息

## 八、快速检查清单

- [ ] `kimiim-cli` 已安装并可运行
- [ ] `~/.openclaw/openclaw.json` 中 `kimi-claw.enabled` 为 `true`
- [ ] Bot Token 已正确配置（**不要** commit 到 git）
- [ ] Gateway 已重启并运行正常
- [ ] 能成功执行 `kimiim-cli me` 查看自己信息

---

## 参考

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [Kimi 官网](https://kimi.com)
- 源稿：`4-doc/20260518-Kimi Claw 使用说明.md`
