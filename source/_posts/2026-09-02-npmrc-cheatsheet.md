---
title: .npmrc 配置实战
date: 2026-09-02 00:00:00
description: .npmrc 21 个配置项里挑出 12 个真正高频使用的：registry 镜像、save-exact 锁版本、legacy-peer-deps、engine-strict、ignore-scripts、audit 等。含 4 类典型场景的完整 .npmrc 模板、CI/CD 集成、5 个常见错误码。
categories:
  - notes
tags:
  - npm
  - .npmrc
  - Node.js
  - cheatsheet
  - CI/CD
---

`.npmrc` 官方有 21 个配置项，但日常用到的就 10 来个。这篇是按使用频次排序的实战指南，**每个配置都配可直接复制的 .ini 块**，最后给 4 类典型场景的完整 .npmrc 模板。

## 一、文件位置与优先级

```bash
# 项目级（仅当前项目生效，提交到 git 给整个团队用）
项目根/.npmrc

# 用户级（所有项目生效，只对自己）
~/.npmrc

# 全局级（系统级，所有用户的兜底）
/etc/npmrc
```

**优先级**：项目级 > 用户级 > 全局级。同一字段多处定义时，项目级赢。

```bash
# 查看当前生效的所有配置（合并后）
npm config list
npm config list -l | grep "^;"   # 含默认值的所有项
```

## 二、12 个高频配置

### 1. `registry` — npm 镜像源

```ini
registry=https://registry.npmmirror.com/
```

国内项目**必加**。默认 `https://registry.npmjs.org/` 在国内经常 30 秒超时。

| 镜像 | URL | 特点 |
|---|---|---|
| 阿里 | `https://registry.npmmirror.com/` | 速度最快，淘宝团队维护 |
| 腾讯 | `https://mirrors.cloud.tencent.com/npm/` | 偶尔更稳 |
| 中科大 | `https://mirrors.ustc.edu.cn/npm/` | 学术网首选 |
| npm 官方 | `https://registry.npmjs.org/` | 海外服务器无障碍 |

**scope 镜像**（只对 `@scope/` 包换源）：

```ini
@my-company:registry=https://npm.internal.company.com/
@types:registry=https://registry.npmmirror.com/
```

### 2. `save-exact` — 锁版本

```ini
save-exact=true
```

`npm install xxx` 默认写 `"xxx": "^1.2.3"`（范围），团队里两台机器可能装到不同版本。`save-exact=true` 写精确版本 `"xxx": "1.2.3"`，避免"我本地能跑你跑不了"。

**注意**：开了 `save-exact` 后 `npm install` 不带版本时仍会装 latest。建议同步加：

```ini
save-exact=true
engine-strict=true
fund=false
audit=false
```

### 3. `legacy-peer-deps` — 跳过 peer 依赖检查

```ini
legacy-peer-deps=true
```

npm 7+ 严格检查 peer dependencies，老项目升级时常常报：

```
npm error ERESOLVE could not resolve
npm error While resolving: react@18.2.0
npm error Found: react@17.0.2
```

`legacy-peer-deps=true` 回到 npm 6 的宽松模式。**仅在确认依赖没问题时用**——它会隐藏真正的版本冲突。

### 4. `engine-strict` — 强制 Node 版本

```ini
engine-strict=true
```

如果 `package.json` 写了：

```json
"engines": { "node": ">=18" }
```

不开这个，Node 16 装时**只警告**；开了就直接报错。**生产项目必开**，本地开发可以不开。

### 5. `ignore-scripts` — 跳过 install 钩子

```ini
ignore-scripts=true
```

`postinstall`、`preinstall` 等脚本可能跑恶意代码（历史上 `event-stream` 事件就是被攻击的）。在不可信环境下装包时开它。

**典型场景**：

```bash
# CI 里跑陌生 PR 的依赖装包时
npm ci --ignore-scripts

# 本地装某个可疑包
npm install some-pkg --ignore-scripts
```

**注意**：开了之后**很多包的关键功能会失效**（husky、patch-package、prisma generate 都不跑）。生产构建**别开**。

### 6. `proxy` / `https-proxy` — 代理

```ini
proxy=http://127.0.0.1:7890
https-proxy=http://127.0.0.1:7890
```

公司内网访问 npm 仓库需要代理。或用 `npm config get proxy` 先确认默认值。

**noproxy 排除**（内网仓库不走代理）：

```ini
proxy=http://127.0.0.1:7890
https-proxy=http://127.0.0.1:7890
noproxy=localhost,127.0.0.1,.internal.company.com
```

### 7. `audit` / `audit-level` — 关漏洞审计

```ini
audit=false
audit-level=high   # 只报 high/critical
```

`npm install` 默认会跑 `npm audit` 查漏洞，**有时要 30+ 秒**。CI 上跑一次还好，本地反复装包时累。

**建议配置**：
- `audit=high`：只显示 high/critical，跳过 moderate/low
- `audit=false`：完全关掉（自己另跑 `npm audit`）

### 8. `prefer-offline` / `cache` — 优先用缓存

```ini
prefer-offline=true
cache=~/.npm-cache
```

网络差的时候救命。prefer-offline 让 npm 先查本地缓存，没命中再走网络。`cache` 指定缓存目录到 SSD 或大硬盘。

**验证缓存命中**：

```bash
ls ~/.npm-cache/_cacache/content-v2/sha512/ | wc -l
```

### 9. `loglevel` — 控制日志噪音

```ini
loglevel=warn
```

可选值：`silent` / `error` / `warn` / `info` / `http` / `verbose`。日常 `warn` 够安静，CI 跑 verbose 看细节。

### 10. `package-lock` — 锁文件

```ini
package-lock=true
```

默认 true，**别关**。包锁文件能保证团队装的版本一致。

### 11. `dry-run` / `yes` — 自动确认

```ini
yes=true
```

`npm init` / `npm create` 时的 `Are you sure?` 自动 yes。**谨慎开**——只在自己熟悉的场景。

### 12. `init-*` — 项目初始化默认值

```ini
init-author-name=Kevin
init-author-email=kevin@example.com
init-author-url=https://kevin.com
init-license=MIT
init-version=0.0.1
```

`npm init -y` 时自动填这些，避免每次手输。

## 三、4 类典型 .npmrc 完整模板

### 模板 1：国内小团队

```ini
# registry 镜像
registry=https://registry.npmmirror.com/

# 版本严格
save-exact=true
engine-strict=true

# CI 友好
audit=high
loglevel=warn
fund=false

# scope 镜像（私有包走自己的源）
@my-company:registry=https://npm.internal.company.com/
```

### 模板 2：企业内网

```ini
# 强制走公司内网仓库
registry=https://npm.internal.company.com/

# 代理出内网
proxy=http://proxy.internal:8080
https-proxy=http://proxy.internal:8080
noproxy=localhost,127.0.0.1,.internal.company.com

# 严格审计
audit=true
engine-strict=true
always-auth=true

# 自签证书
strict-ssl=false
```

### 模板 3：前端项目（多框架混用）

```ini
save-exact=true
legacy-peer-deps=true
engine-strict=true

# 加快 install
prefer-offline=true
audit=high

# 包锁文件必提交
package-lock=true
```

### 模板 4：CI/CD（GitHub Actions）

```ini
# 严格模式
save-exact=true
engine-strict=true
audit=true
fund=false

# 用 npm ci 更快（要求 lock 文件存在）
package-lock=true
```

对应 GitHub Actions 片段：

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 四、5 个常见错误码速查

| 错误 | 原因 | 解决 |
|---|---|---|
| `ETARGET` | package.json engine 字段与当前 Node 不符 | 升级 Node 或设 `engine-strict=false` |
| `ERESOLVE peer dep` | npm 7+ 严格 peer 检查 | 加 `legacy-peer-deps=true` |
| `EACCES permissions` | 全局安装需要 sudo | 改用 nvm 管理 Node，或 `chown` 全局目录 |
| `ECONNRESET` / `ETIMEDOUT` | 网络问题或镜像源挂了 | 换镜像 / 开 `prefer-offline` / 检查代理 |
| `EPEERINVALID` | 装的两个包 peer 要求冲突 | 升级冲突的包，或装 `--legacy-peer-deps` |

## 五、npm vs pnpm vs yarn 配置差异

| 配置 | npm | pnpm | yarn |
|---|---|---|---|
| 锁文件 | `package-lock.json` | `pnpm-lock.yaml` | `yarn.lock` |
| 镜像源 | `registry=` | `registry=` | `registry=https://registry.npmmirror.com/` |
| 锁版本 | `save-exact=true` | `save-exact=true` | `--save-exact` flag |
| peer 依赖 | `legacy-peer-deps` | `auto-install-peers=true` | `nodeLinker: node-modules`（Yarn Berry）|
| 离线缓存 | `prefer-offline` | `offline=true` | `--prefer-offline` flag |

**多 package manager 团队**的 `.npmrc` 和 `pnpm-workspace.yaml` 要并行维护，写好注释避免混淆。

## 六、CI 集成模板（GitHub Actions）

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # 用 npm ci 走 lock 文件，install 速度比 npm install 快 2-3 倍
      - run: npm ci
        env:
          # 私有包需要 token
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - run: npm run build
      - run: npm test
```

**`npm ci` vs `npm install`**：
- `npm ci`：删 `node_modules` 后重装，严格按 lock 文件，CI 必用
- `npm install`：按 lock 增量装，本地开发用

## 七、查所有可用项

```bash
npm config list                    # 当前生效
npm config list -l | grep "^;"      # 含默认的所有项
man npmrc                          # 完整文档
```

完整文档：[docs.npmjs.com/cli/v10/configuring-npm/npmrc](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)。