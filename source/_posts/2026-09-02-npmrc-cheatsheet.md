---
title: .npmrc 配置速查：最常用的 10 项
date: 2026-09-02 00:00:00
description: .npmrc 21 个配置项里挑出 10 个真正会用的：registry 镜像、proxy 代理、save-exact 锁版本、legacy-peer-deps、ignore-scripts 等。每项给场景 + 示例。
categories:
  - notes
tags:
  - npm
  - .npmrc
  - Node.js
  - cheatsheet
---

`.npmrc` 有 21 个配置项，但日常能用的就 10 个。这篇是按使用频次排序的速查，每个都说清楚"什么时候用 + 怎么写"。

## 一、文件位置

```bash
# 项目级（仅当前项目生效）
.npmrc          # 提交到 git，给整个团队用

# 用户级（所有项目生效）
~/.npmrc        # 只对自己生效
```

**项目级优先**于用户级。两份都有的字段，项目级赢。

## 二、10 个最常用的配置

### 1. `registry` — npm 镜像源

```ini
registry=https://registry.npmmirror.com/
```

国内项目必加，默认 `registry.npmjs.org` 经常超时。**阿里**（`registry.npmmirror.com`）和**腾讯**（`mirrors.cloud.tencent.com/npm`）最常用。

### 2. `save-exact` — 锁版本

```ini
save-exact=true
```

`npm install xxx` 后**默认会写 `^x.x.x` 范围**，导致不同机器装到不同版本。`save-exact=true` 让它写精确版本，团队协作更稳定。

### 3. `legacy-peer-deps` — 跳过 peer 依赖检查

```ini
legacy-peer-deps=true
```

npm 7+ 严格检查 peer deps，老项目升级时常常报"无法解析"。开这个标志回到 npm 6 的宽松模式。**仅在确认依赖没问题时用**。

### 4. `engine-strict` — 强制 Node 版本

```ini
engine-strict=true
```

如果项目 `package.json` 写了 `"engines": {"node": ">=18"}`，开了这个就真的会在 Node 16 上报错（否则只警告）。**生产项目建议开**。

### 5. `ignore-scripts` — 跳过 install 钩子

```ini
ignore-scripts=true
```

`postinstall` 等脚本可能跑恶意代码（历史上发生过 event-stream 事件）。在不可信环境下装包时开它，**手动跑需要的脚本**。

### 6. `proxy` / `https-proxy` — 代理

```ini
proxy=http://127.0.0.1:7890
https-proxy=http://127.0.0.1:7890
```

公司内网需要代理访问 npm 时用。

### 7. `audit` — 关掉自动审计

```ini
audit=false
```

`npm install` 默认会跑 `npm audit` 检查漏洞。CI 里跑可以，本地太慢的话可以关掉再单独跑 `npm audit`。

### 8. `prefer-offline` / `offline` — 优先用缓存

```ini
prefer-offline=true
```

网络不好时让 npm 先看本地缓存，没有再走网络。

### 9. `loglevel` — 控制日志

```ini
loglevel=warn   # silent | error | warn | info | http | verbose
```

调试时改成 `verbose`，日常 `warn` 足够安静。

### 10. `cache` — 缓存目录

```ini
cache=/Volumes/external/npm-cache
```

小硬盘机器把缓存挪到大盘。**改之前确保旧缓存已无依赖**。

## 三、典型场景的完整 `.npmrc`

**国内小团队**：
```ini
registry=https://registry.npmmirror.com/
save-exact=true
engine-strict=true
audit=false
loglevel=warn
```

**企业内网**：
```ini
registry=https://npm.internal.company.com/
save-exact=true
engine-strict=true
proxy=http://proxy.internal:8080
https-proxy=http://proxy.internal:8080
```

**前端项目**（多框架混用）：
```ini
save-exact=true
legacy-peer-deps=true
engine-strict=true
```

## 四、查所有可用项

```bash
npm config list                    # 当前生效的所有配置
npm config list -l | grep "^;"      # 所有（含默认）
man npmrc                          # 完整文档
```

或者直接看 [官方文档](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)。