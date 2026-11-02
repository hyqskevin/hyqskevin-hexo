---
title: Claude Code 速度优化
date: 2026-10-18 00:00:00
description: Claude Code 会话启动慢、context 消耗大？本文整理 system prompt 中 Skills、MCP、CLAUDE.md 的优化技巧，包含 skillListingFraction、disable-model-invocation、skillOverrides 三个已验证配置与官方 Plugin skills 拆分 workaround。
categories:
  - AI工具
tags:
  - Claude Code
  - 性能优化
  - System Prompt
  - Skills
  - MCP
---

## 一、背景

Claude Code 在会话开始时会一次性把以下内容塞进 system prompt：

- Skills（个人 + plugin）
- MCP server instructions
- CLAUDE.md 全局指令
- Tool definitions

结果就是冷启动慢、context 消耗大。下面整理几条已经验证过的优化手段。

## 二、已验证的优化

### 1.1 `skillListingFraction` — 减少 Skill 描述预算

**文件**：`~/.claude/settings.json`

```json
{
  "skillListingFraction": 0.005
}
```

**作用**：把 skill 描述预算从默认 1% 降到 0.5% context window，每条 skill 描述消耗的 token 随之下降。

**生效**：重启 Claude Code 后生效。

### 1.2 `disable-model-invocation` — 禁用自动加载

**文件**：`~/.claude/skills/{skill-name}/SKILL.md`

```yaml
---
name: my-skill
description: What this skill does
disable-model-invocation: true
---
```

**作用**：Skill 完全不进入 system prompt，只有显式 `/skill-name` 调用时才加载。

**适用**：个人 skills（`~/.claude/skills/`）。

**不支持**：Plugin skills（`~/.claude/plugins/`）—— 这是官方问题 [#22345](https://github.com/anthropics/claude-code/issues/22345)。

### 1.3 `skillOverrides` — 部分 skill 只显示名称

**文件**：`~/.claude/settings.json`

```json
{
  "skillOverrides": {
    "some-heavy-skill": "name-only"
  }
}
```

**作用**：指定 skill 在 system prompt 中只显示名称，不显示描述，进一步压缩 token。

## 三、官方 Plugin Skills 拆分方案

来源：[Issue #44371](https://github.com/anthropics/claude-code/issues/44371)

Plugin skills 的 SKILL.md 体积过大时，官方建议**把内容拆出去**：

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

Read `procedure.md` for full instructions.
```

把详细步骤放到 `procedure.md`，skill 执行时再用 Read 工具按需加载。

**效果**：冷启动从 ~34K tokens 降到 ~3K tokens。

**注意**：Plugin skills 你不能直接修改，这个 workaround 只适用于自己写的 skills。

## 四、已知问题跟踪

| Issue | 问题 | 状态 |
|-------|------|------|
| [#22345](https://github.com/anthropics/claude-code/issues/22345) | Plugin skills 不支持 `disable-model-invocation` | 官方确认，开放 |
| [#34940](https://github.com/anthropics/claude-code/issues/34940) | 已禁用的 plugin skills 仍然出现在 system prompt | Bug |
| [#44371](https://github.com/anthropics/claude-code/issues/44371) | Plugin skills 启动时加载完整 SKILL.md | 已提供 workaround |
| [#57074](https://github.com/anthropics/claude-code/issues/57074) | Lazy-load skill catalog | Feature Request |

## 五、诊断工具

运行 `/doctor` 可以查看：

- Skill 预算是否溢出
- 哪些 skill 被截断
- System prompt 当前状态

## 六、配置清单

| 优化项 | 文件位置 | 效果 |
|--------|---------|------|
| `skillListingFraction: 0.005` | `~/.claude/settings.json` | 减少 skill 描述预算 |
| `disable-model-invocation: true` | `~/.claude/skills/*/SKILL.md` | 禁用自动加载（仅个人 skills） |
| `skillOverrides` | `~/.claude/settings.json` | 指定 skill 只显示名称 |
| `--bare` | CLI flag | 最小模式（会跳过必要加载，不推荐） |

## 七、官方文档参考

- [Skills 文档](https://code.claude.com/docs/en/skills.md)
- [Plugins 文档](https://code.claude.com/docs/en/plugins)
- [Prompt Caching](https://code.claude.com/docs/en/prompt-caching)

## 模型版本说明

本文涉及的「Claude Code」为产品名称，未绑定具体底层模型版本。实际调用的模型由 Claude Code 运行时按官方策略决定，**以发布时官方文档为准**。如需精确控制，请查阅 [Claude Code 文档](https://code.claude.com/docs/en/) 中关于模型选择的章节。