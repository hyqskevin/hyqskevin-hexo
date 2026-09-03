---
title: Node.js 起步必知
date: 2026-09-02 00:00:00
description: 给 Node 新手的第一篇速读：常用 .npmrc 配置（按 2026-09 新规则只挑最常用的几项）、5 个 npm 错误码 + 解决、版本管理工具（nvm / fnm / volta）、Node 22 LTS 新特性、3 个进阶建议。
categories:
  - notes
tags:
  - Node.js
  - npm
  - .npmrc
  - cheatsheet
  - 新手
---

刚接触 Node.js 的人常被 `.npmrc` 21 个配置项吓到。这篇**只挑最常用的几项**给新手，配合 5 个常见错误码 + 3 个进阶建议，**5 分钟读完就能跑通项目**。

## 一、最常用的 4 个 .npmrc 配置

```ini
# 1. 国内镜像（速度）
registry=https://registry.npmmirror.com/

# 2. 锁版本（团队一致）
save-exact=true

# 3. CI 友好
audit=false
fund=false

# 4. 离线优先（网络差时）
prefer-offline=true
```

完整 12 项 + 4 类场景模板见 [.npmrc 配置实战](https://hyqskevin.github.io/2026/09/02/npmrc-cheatsheet/)。

## 二、5 个最常见错误码

### `ETARGET`

`package.json` 写了 `engines: { node: ">=18" }`，但你装的是 Node 16。

**解决**：升级 Node，或临时关掉检查：

```bash
npm install --engine-strict=false
```

### `ERESOLVE peer dep`

npm 7+ 严格检查 peer dependencies，老项目升级时常见：

```
npm error While resolving: react@18.2.0
npm error Found: react@17.0.2
```

**解决**：

```bash
npm install --legacy-peer-deps
```

或加到 `.npmrc` 永久生效。

### `EACCES permissions`

全局装包要 sudo。

**解决**：用 nvm 装 Node 到用户目录（推荐），别用 sudo 装全局。

### `ECONNRESET` / `ETIMEDOUT`

网络问题，npm 装到一半断了。

**解决**：

```bash
npm config set registry https://registry.npmmirror.com/
# 或
npm install --prefer-offline
```

### `EPEERINVALID`

两个包 peer 需求冲突（如 React 17 组件库 + React 18）。

**解决**：升级组件库到支持新 React 的版本，或用 `overrides` 字段强制。

## 三、版本管理：nvm / fnm / volta

**多 Node 版本管理**必备，单装一个版本会到处撞墙。

### nvm（最流行）

```bash
# 装 nvm（macOS / Linux）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 装 Node 22 LTS
nvm install 22
nvm use 22

# 列出已装版本
nvm ls

# 切回系统版本
nvm use system

# 项目级 .nvmrc
echo "22" > .nvmrc
nvm use  # 自动读 .nvmrc
```

### fnm（Rust 写的，更快）

```bash
brew install fnm
fnm install 22
fnm use 22
echo "22" > .nvmrc  # 兼容 nvm 的 .nvmrc
```

### volta（自动切版本）

```bash
brew install volta
volta install node@22
```

```json
// package.json 里加
{
  "volta": {
    "node": "22.0.0",
    "npm": "10.2.0"
  }
}
```

进项目目录自动切到指定 Node 版本。

## 四、Node 22 LTS 新特性（2024-10 发布的活跃 LTS）

```bash
# 确认版本
node --version
# v22.x.x
```

值得用上的 5 个新特性：

### 1. 内置 `.env` 文件支持（实验性）

```bash
node --env-file=.env app.js
```

不再需要 `dotenv` 包。

### 2. 内置 `fetch`（稳定）

Node 18+ 已内置，Node 22 优化了性能。`node-fetch` 库不再需要。

```js
const res = await fetch('https://api.example.com/data')
const data = await res.json()
```

### 3. 内置 `WebSocket`

```js
import { WebSocket } from 'node:ws'
const ws = new WebSocket('wss://example.com')
```

### 4. 性能提升

- V8 12.x 引擎，HTTP 性能提升 20%
- 启动时间快 15%
- 内存占用降低

### 5. 更好的 ESM 支持

```json
// package.json
{ "type": "module" }
```

```js
// 现在 import 完整路径
import { readFile } from 'node:fs/promises'
// 不再需要 .mjs 后缀或 --experimental-modules
```

## 五、3 条进阶建议

### 5.1 用 npm ci 不用 npm install（CI）

```bash
# CI 必用：删 node_modules 后按 lock 重装
npm ci

# 本地开发用：按 lock 增量装
npm install
```

`npm ci` 速度快 2-3 倍，且严格按 lock，不会偷偷升级。

### 5.2 用 `engines` 字段锁 Node 版本

```json
{
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }
}
```

`.npmrc` 加 `engine-strict=true`，不一致就报错。

### 5.3 `package-lock.json` 必须提交 git

`.gitignore` 别忽略它。lock 文件是**团队协作的关键**——保证所有人装到一样的版本。

## 六、5 分钟起步 checklist

```text
[ ] 装 nvm
[ ] nvm install 22 && nvm use 22
[ ] 写项目 package.json，加 engines 字段
[ ] 项目根写 .nvmrc，团队同步
[ ] 写 .npmrc（registry + save-exact + engine-strict）
[ ] npm install
[ ] git add package.json package-lock.json .npmrc .nvmrc
```

跑完这 7 步，新 Node 项目就 ready 了。

## 七、4 个常见误区

### 7.1 不要 sudo 装全局包

```bash
# ❌ sudo npm install -g xxx
# → 文件属于 root，后续 npm 装不进去

# ✅ 用 nvm 装 Node，全局包装在 ~/.nvm/versions/node/<ver>/lib/node_modules
```

### 7.2 不要混用 yarn 和 npm

```bash
# ❌ 项目里既有 yarn.lock 又有 package-lock.json
# → 装出不一致的依赖

# ✅ 团队统一 package manager（package.json 加 "packageManager": "npm@10" 字段）
```

### 7.3 不要忽略 .npmrc 提交

团队共享的 `.npmrc`（registry、save-exact）**必须提交 git**。个人偏好（init-author-email）放用户级。

### 7.4 不要锁 major 版本用 `^`

```json
{
  "dependencies": {
    "lodash": "^4.17.21"  // ^4 → 4.x.x 任意
  }
}
```

`^4` 允许升到 `4.x.x` 但不升到 `5.0.0`。生产项目用 `~4.17.21`（仅补丁版本）或 `4.17.21`（完全锁）。

## 八、参考

- [.npmrc 配置实战](https://hyqskevin.github.io/2026/09/02/npmrc-cheatsheet/) — 完整 21 项 + 4 类场景
- [nodejs.org](https://nodejs.org) — 官方
- [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) — nvm
- [volta.sh](https://volta.sh) — 自动切版本
- [docs.npmjs.com](https://docs.npmjs.com) — npm 官方文档