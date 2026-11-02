---
title: Claude Code 速度优化
date: 2026-09-04 00:00:00
description: 4 个实测可用的 Claude Code System Prompt 减负方法：skillListingFraction 调小、disable-model-invocation 禁用自动加载、skillOverrides 部分 skill 只显示名称、Plugin SKILL.md 拆 procedure.md。冷启动从 ~34K tokens 降到 ~3K tokens。
categories:
  - notes
tags:
  - Claude Code
  - Skills
  - MCP
  - System Prompt
  - 性能优化
---

Claude Code 启动时会把 Skills、MCP server instructions、CLAUDE.md、Tool definitions 一次性塞进 system prompt，**冷启动常打到 30K+ tokens**，响应慢、context 消耗大。这篇整理 4 个我实测过的减负方法 + 已知问题表 + 诊断命令。

## 1. `skillListingFraction` — 减少 Skill 描述预算

**文件**：`~/.claude/settings.json`

```json
{
  "skillListingFraction": 0.005
}
```

把 skill 描述预算从默认 1% 砍到 0.5% context window，**每条 skill 描述的 token 消耗直接减半**。重启 Claude Code 后生效，对所有 skill 一视同仁（个人 + plugin 都生效）。

适合：装了 20+ skill、且不每次都用完的场景。

## 2. `disable-model-invocation: true` — 禁用自动加载

**文件**：`~/.claude/skills/<skill-name>/SKILL.md` 的 front matter

```yaml
---
name: my-skill
description: What this skill does
disable-model-invocation: true
---
```

**作用**：这个 skill **完全不进入 system prompt**，只有你显式 `/skill-name` 调用时才加载，节省的 token 最彻底。

**适用**：个人 skills（`~/.claude/skills/`），你自己写的话可以直接改 SKILL.md。

**不支持**：Plugin skills（`~/.claude/plugins/`）—— 这是官方已知问题 [Issue #22345](https://github.com/anthropics/claude-code/issues/22345)，截至 2026-09 仍未修。

## 3. `skillOverrides` — 部分 skill 只显示名称

**文件**：`~/.claude/settings.json`

```json
{
  "skillOverrides": {
    "some-heavy-skill": "name-only"
  }
}
```

只让某个 skill 在 system prompt 中显示名称（占几个 token），不显示描述。**比 `disable-model-invocation` 温和**：模型仍然"知道有这个 skill 存在"，但不会因为长描述而消耗 context。

适合：偶尔用到、描述很长的 skill。

## 4. 官方 Plugin SKILL.md 拆分（最推荐）

来源：[Issue #44371](https://github.com/anthropics/claude-code/issues/44371) 的官方回复。

Plugin skills 你不能直接改 SKILL.md，但**官方建议把自己的 skill 改成两层**：

```markdown
---
name: my-skill
description: What this skill does
---

# My Skill

Read `procedure.md` for full instructions.
```

把详细内容搬到 `procedure.md`，skill 执行时用 Read 工具按需加载。**实测效果：冷启动从 ~34K tokens 降到 ~3K tokens**，降幅 ~91%。

**注意**：这个 workaround **只适用于自己写的 skills**，第三方 plugin 改不了 SKILL.md。

## 已知问题清单（2026-09-04）

| Issue | 问题 | 状态 |
|-------|------|------|
| [#22345](https://github.com/anthropics/claude-code/issues/22345) | Plugin skills 不支持 `disable-model-invocation` | 官方确认，开放 |
| [#34940](https://github.com/anthropics/claude-code/issues/34940) | Disabled plugin skills 仍然出现在 system prompt | Bug |
| [#44371](https://github.com/anthropics/claude-code/issues/44371) | Plugin skills 启动时加载完整 SKILL.md | 已提供 workaround（见第 4 节）|
| [#57074](https://github.com/anthropics/claude-code/issues/57074) | Lazy-load skill catalog | Feature Request |

## 诊断

跑 `/doctor` 可以看：
- Skill 预算是否溢出
- 哪些 skill 被截断
- System prompt 当前状态

如果发现总 token 没降下来，第一时间 `/doctor` 看是哪个 skill 在拖后腿。

## 配置清单速查

| 优化项 | 文件位置 | 效果 |
|--------|---------|------|
| `skillListingFraction: 0.005` | `~/.claude/settings.json` | 减少 skill 描述预算（所有 skill）|
| `disable-model-invocation: true` | `~/.claude/skills/*/SKILL.md` | 禁用自动加载（**仅个人 skills**）|
| `skillOverrides` | `~/.claude/settings.json` | 部分 skill 只显示名称 |
| SKILL.md 拆 procedure.md | 自己的 skill 目录 | **降幅最大 ~91%**（仅个人 skills）|
| `--bare` | CLI flag | 最小模式（会跳过必要加载，**不推荐**）|

## 小结

4 个方法按**性价比**排序：

1. **SKILL.md 拆 procedure.md**（降幅 91%，最推荐）
2. **skillListingFraction: 0.005**（一行配置，立刻见效）
3. **skillOverrides**（按需点名）
4. **disable-model-invocation: true**（最彻底，但只能管个人 skills）

如果你也用 Claude Code + WorkBuddy 这套，第一步先跑 `/doctor` 摸清现状，再决定动哪个。Plugin skills 那边目前只能等官方修 [Issue #22345](https://github.com/anthropics/claude-code/issues/22345) + [#57074](https://github.com/anthropics/claude-code/issues/57074)。

## 参考

- [Skills 官方文档](https://code.claude.com/docs/en/skills.md)
- [Plugins 官方文档](https://code.claude.com/docs/en/plugins)
- [Prompt Caching 官方文档](https://code.claude.com/docs/en/prompt-caching)
- [Issue #22345](https://github.com/anthropics/claude-code/issues/22345) — Plugin skills 不支持 disable-model-invocation
- [Issue #44371](https://github.com/anthropics/claude-code/issues/44371) — SKILL.md 拆分 workaround
