---
title: .npmrc 配置实战
date: 2026-09-02 00:00:00
description: .npmrc 21 个配置项里挑出 12 个真正高频使用的：registry 镜像、save-exact 锁版本、legacy-peer-deps、engine-strict、ignore-scripts、audit 等。含 4 类典型场景完整模板、CI/CD 集成、5 个错误码、10 条 FAQ、npm vs pnpm vs yarn 对比。
categories:
  - notes
tags:
  - npm
  - .npmrc
  - Node.js
  - cheatsheet
  - CI/CD
---

`.npmrc` 官方有 21 个配置项，但日常用到的就 10 来个。这篇是按使用频次排序的实战指南——**每个配置都配可直接复制的 .ini 块**，最后给 4 类典型场景的完整 .npmrc 模板、5 个错误码速查、10 条 FAQ、npm vs pnpm vs yarn 对比。

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

# 含默认值的所有项（以 ; 开头的就是默认值）
npm config list -l | grep "^;"
```

**实战建议**：项目级 `.npmrc` 必须提交到 git；用户级只放"个人偏好"（如 `init-author-email`），不要放会影响团队构建的设置（如 `registry`、proxy）；全局级基本不用。

## 二、12 个高频配置详解

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

**scope 镜像**（只对 `@scope/` 包换源，私有包常用）：

```ini
@my-company:registry=https://npm.internal.company.com/
@types:registry=https://registry.npmmirror.com/
@babel:registry=https://registry.npmmirror.com/
```

**临时切换**（不写文件）：

```bash
npm install xxx --registry=https://registry.npmmirror.com/
# 一次性用，不影响其他命令
```

### 2. `save-exact` — 锁版本

```ini
save-exact=true
```

`npm install xxx` 默认写 `"xxx": "^1.2.3"`（范围），团队里两台机器可能装到不同次版本。`save-exact=true` 写精确版本 `"xxx": "1.2.3"`，避免"我本地能跑你跑不了"。

**注意**：开了 `save-exact` 后 `npm install` 不带版本时仍会装 latest。**建议同步加**：

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

**对比**：

| 模式 | 行为 | 适用 |
|---|---|---|
| npm 6 | 宽松 peer 检查 | 维护老项目 |
| npm 7+ 默认 | 严格 peer 检查 | 新项目 |
| `legacy-peer-deps=true` | 强制宽松 | npm 7+ 跑老项目 |
| `strict-peer-deps=true` | 强制严格 | 锁版本严格 |

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

**注意**：开了之后**很多包的关键功能会失效**：
- husky（git hooks）
- patch-package
- prisma generate
- electron-rebuild
- 任何用 `postinstall` 跑构建脚本的包

**生产构建别开**。

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

**踩坑**：proxy 配错会导致"卡在 `idealTree:building: sill idealTree buildDeps`"长时间无响应。建议先 `curl -I https://registry.npmjs.org/` 测试代理可达性。

### 7. `audit` / `audit-level` — 关漏洞审计

```ini
audit=false
audit-level=high   # 只报 high/critical
```

`npm install` 默认会跑 `npm audit` 查漏洞，**有时要 30+ 秒**。CI 上跑一次还好，本地反复装包时累。

**建议配置**：
- `audit=high`：只显示 high/critical，跳过 moderate/low
- `audit=false`：完全关掉（自己另跑 `npm audit`）

**audit 报告解读**：

```bash
npm audit --json
# 看具体漏洞
npm audit fix              # 自动升级补丁版本
npm audit fix --force      # 升级 major（破坏性变更，慎用）
```

### 8. `prefer-offline` / `cache` — 优先用缓存

```ini
prefer-offline=true
cache=~/.npm-cache
```

网络差的时候救命。`prefer-offline` 让 npm 先查本地缓存，没命中再走网络。`cache` 指定缓存目录到 SSD 或大硬盘。

**验证缓存命中**：

```bash
ls ~/.npm-cache/_cacache/content-v2/sha512/ | wc -l
# 1000+ 说明缓存有不少
```

**清理缓存**（磁盘不够时）：

```bash
npm cache clean --force
# 删 ~/.npm 整个目录也行
rm -rf ~/.npm
```

### 9. `loglevel` — 控制日志噪音

```ini
loglevel=warn
```

可选值：`silent` / `error` / `warn` / `info` / `http` / `verbose`。日常 `warn` 够安静，CI 跑 verbose 看细节。

**调试网络问题**时改 `http`，看完整的 HTTP 请求：

```ini
loglevel=http
```

### 10. `package-lock` — 锁文件

```ini
package-lock=true
```

默认 true，**别关**。包锁文件能保证团队装的版本一致。

`.gitignore` 别忽略它（默认就不忽略）。如果 `package-lock.json` 提交后 PR 频繁冲突，**说明团队没装好依赖**，先 `npm ci` 同步再开发。

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

# 自签证书（内网常遇到）
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

**调试流程**（错误时按顺序）：

```bash
# 1. 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 2. 验证网络
curl -I https://registry.npmmirror.com/

# 3. 详细日志
npm install xxx --loglevel=verbose

# 4. 跳过问题
npm install xxx --legacy-peer-deps --force
```

## 五、CI 集成模板（GitHub Actions）

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

| 命令 | 行为 | 速度 | 适用 |
|---|---|---|---|
| `npm ci` | 删 `node_modules` 后按 lock 重装 | 快 2-3 倍 | CI 必用 |
| `npm install` | 按 lock 增量装 | 慢 | 本地开发 |
| `npm install pkg` | 装新包 | 中 | 加依赖时 |

**私有 registry token 配置**：

```ini
# .npmrc（项目级）
@my-company:registry=https://npm.internal.company.com/
//npm.internal.company.com/:_authToken=${NPM_TOKEN}
```

GitHub Secrets 配置 `NPM_TOKEN`，env 注入到 `npm ci` 即可。

## 六、npm vs pnpm vs yarn 配置差异

| 配置 | npm | pnpm | yarn |
|---|---|---|---|
| 锁文件 | `package-lock.json` | `pnpm-lock.yaml` | `yarn.lock` |
| 镜像源 | `registry=` | `registry=` | `registry=https://registry.npmmirror.com/` |
| 锁版本 | `save-exact=true` | `save-exact=true` | `--save-exact` flag |
| peer 依赖 | `legacy-peer-deps` | `auto-install-peers=true` | `nodeLinker: node-modules`（Yarn Berry）|
| 离线缓存 | `prefer-offline` | `offline=true` | `--prefer-offline` flag |
| 安装速度 | 慢（npm 7+ 改进） | 最快（硬链接复用） | 快（Yarn 3+） |

**多 package manager 团队**的 `.npmrc` 和 `pnpm-workspace.yaml` 要并行维护，写好注释避免混淆。**项目里只能用一种**（`engines` + `packageManager` 字段锁住）。

## 七、10 条常见 FAQ

**Q1：项目级 .npmrc 要不要提交到 git？**
要。团队共享。

**Q2：改了 .npmrc 不生效？**
- 看 `npm config list` 输出，确认生效的是哪一份
- 大小写敏感（Windows 上）
- `npm config get registry` 测一下

**Q3：私有 registry 的 token 安全吗？**
- .npmrc 里的 `_authToken` **别提交**到 git
- 用 `.npmrc` 全局 + `~/.npmrc`，加到 `.gitignore`（项目级 .npmrc 也别含 token）
- CI 用 `NODE_AUTH_TOKEN` 环境变量

**Q4：.npmrc 和 package-lock.json 哪个优先？**
- `.npmrc` 控制 npm 行为（registry/proxy/版本策略）
- `package-lock.json` 记录依赖树
- 两者都该有，互补

**Q5：怎么知道某个包从哪个 registry 装的？**
```bash
npm config get registry
npm ls --all  # 看依赖树
```

**Q6：npm install 卡在 sill idealTree 很久？**
网络问题。开 `prefer-offline` 或换镜像。

**Q7：能多个 registry 混用吗？**
能，用 scope 镜像：
```ini
@scope-a:registry=https://reg-a.com/
@scope-b:registry=https://reg-b.com/
```

**Q8：怎么清缓存里某个包？**
```bash
npm cache clean <pkg-name>  # npm 不支持
# 实际只能全清
npm cache clean --force
```

**Q9：可以用 yarn.lock 替换 package-lock.json 吗？**
不能直接换。需要：
1. 删 `package-lock.json` 和 `node_modules`
2. 跑 `yarn install` 生成 `yarn.lock`
3. 团队统一改用 yarn

**Q10：.npmrc 在 Docker 镜像里怎么处理？**
- 在 `Dockerfile` 里 `COPY .npmrc ./` 后再 `RUN npm ci`
- 私有 token 用 `docker build --build-arg NPM_TOKEN=xxx` 注入
- 别在镜像里留 .npmrc（含 token），用 multi-stage build 在最终 stage 删掉

## 八、查所有可用项

```bash
npm config list                    # 当前生效
npm config list -l | grep "^;"      # 含默认的所有项
man npmrc                          # 完整文档
```

完整文档：[docs.npmjs.com/cli/v10/configuring-npm/npmrc](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)。

## 九、推荐配置（生产用）

把它当默认起点，项目里根据自己的情况微调：

```ini
# ===== registry =====
registry=https://registry.npmmirror.com/

# ===== 版本严格 =====
save-exact=true
engine-strict=true
package-lock=true

# ===== install 优化 =====
prefer-offline=true
audit=high
fund=false
loglevel=warn

# ===== 团队协作 =====
init-author-name=Your Team
init-license=MIT
```

国内项目用它起步，出问题再针对具体场景调（如老项目加 `legacy-peer-deps`，企业内网换 registry）。

## 十、.npmrc 全 21 项速查表

| 项 | 默认 | 何时用 |
|---|---|---|
| `registry` | `https://registry.npmjs.org/` | 换镜像/私有源 |
| `save-exact` | false | 团队项目必开 |
| `save-prefix` | `^` | 改 `~` 或精确版本 |
| `save-prod` | true | 装 dev 依赖时改 false |
| `save-dev` | false | 命令行 `npm i -D` |
| `legacy-peer-deps` | false | npm 7+ 跑老项目 |
| `strict-peer-deps` | false | 锁版本严格 |
| `engine-strict` | false | 生产项目必开 |
| `ignore-scripts` | false | 不可信环境装包 |
| `proxy` / `https-proxy` | 无 | 内网代理 |
| `noproxy` | 无 | 代理排除 |
| `strict-ssl` | true | 自签证书改 false |
| `audit` | true | CI 跑、本地关 |
| `audit-level` | low | high=只报高危 |
| `prefer-offline` | false | 网络差 |
| `offline` | false | 强制离线 |
| `cache` | `~/.npm` | 改到大盘 |
| `loglevel` | `info` | warn / http / verbose |
| `package-lock` | true | 别关 |
| `dry-run` | false | CI 测试用 |
| `yes` | false | 自动化初始化 |
| `init-author-*` | 无 | 配 `npm init` 默认值 |
| `fund` | true | 关闭打赏提示 |
| `workspaces-update` | true | monorepo 时 |
| `update-notifier` | true | 关闭升级提示 |

## 十一、.npmrc vs package.json `engines` 字段

很多人搞混这两者：

| 维度 | `.npmrc` | `package.json engines` |
|---|---|---|
| **作用对象** | npm CLI 行为 | 包对运行环境的要求 |
| **谁能改** | 项目维护者（自己写） | 项目维护者（写进 dependencies） |
| **影响范围** | 当前项目（项目级）或用户所有项目（用户级） | 任何安装本包的项目 |
| **被谁读** | npm CLI | npm install 时校验 |
| **示例** | `registry=...` | `"engines": {"node": ">=18"}` |

**关系**：`.npmrc` 决定**怎么装**，`engines` 决定**能不能装**。两者互补。

**`engines` 完整示例**：

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

**`volta` / `nvm` 替代**：

```json
{
  "volta": {
    "node": "20.10.0",
    "npm": "10.2.3"
  }
}
```

Volta 在团队里更流行（自动切换版本）。`.nvmrc` 也是常见选择（`node -v > .nvmrc`）。

## 十二、故障排查完整流程

遇到 `npm install` 错误时按这个顺序查：

### 第一步：清缓存

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --loglevel=verbose 2>&1 | tee /tmp/npm-install.log
```

`tee` 把日志存下来，方便贴到 issue。

### 第二步：检查网络

```bash
# 直接 curl 测镜像源
curl -I https://registry.npmmirror.com/

# 如果用代理，测试代理可达
curl -I --proxy http://127.0.0.1:7890 https://registry.npmjs.org/
```

### 第三步：单包测试

```bash
# 用最小 package.json 试
echo '{}' > /tmp/test.json
cd /tmp && npm install lodash --loglevel=verbose
```

如果单包能装，是项目配置问题；不能装是环境问题。

### 第四步：检查 Node/npm 版本

```bash
node -v
npm -v
which node
which npm
```

**版本不匹配**最常见：用 nvm 装多版本，按项目切：

```bash
nvm install 18
nvm install 20
nvm use 20  # 当前 shell
nvm alias default 20  # 默认
```

`.nvmrc` 自动切换：

```bash
# 项目根 .nvmrc 写 20
echo "20" > .nvmrc
nvm use  # 自动读 .nvmrc
```

### 第五步：检查权限

```bash
ls -la /usr/local/lib/node_modules
ls -la ~/.npm
```

全局包权限问题多发。**别 sudo**——用 nvm 把 Node 装在用户目录。

## 十三、monorepo 实战

`pnpm` 是 monorepo 的事实标准，但 npm workspaces 也够用：

```json
{
  "name": "my-monorepo",
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

```ini
# .npmrc（项目级）
save-exact=true
link-workspace-packages=true
prefer-workspace-packages=true
```

```bash
# 在 monorepo 根目录装包
npm install lodash -w @my-company/web
npm install typescript -D -w @my-company/shared
```

**monorepo 专有 .npmrc**：

```ini
# 用 npm 7+ 自带 workspace（不用 pnpm/yarn）
workspaces-update=true
workspaces-experimental=true  # 早期实验功能

# 解决 workspace 间 hoisting 问题
install-strategy=nested
install-links=true
```

## 十四、3 个真实案例

### 案例 1：老 React 项目升级 React 18

错误：
```
npm error While resolving: react@18.2.0
npm error Found: react@17.0.2
```

解决：加 `legacy-peer-deps=true`，然后逐步升级 peer 依赖。

### 案例 2：内网 Nexus 私有仓库

`.npmrc`：

```ini
registry=https://nexus.internal.company.com/repository/npm-hosted/
@nexus-internal:registry=https://nexus.internal.company.com/repository/npm-private/
strict-ssl=false  # 内网自签证书
always-auth=true
```

`nexus.internal.company.com` 的 token 配在 `.npmrc`：

```ini
//nexus.internal.company.com/repository/npm-hosted/:_authToken=YOUR_TOKEN
```

### 案例 3：CI 跑陌生 PR 防供应链攻击

```yaml
- name: Install with script-blocking
  run: npm ci --ignore-scripts --no-audit

- name: Run audit only on direct deps
  run: npm audit --omit=dev
```

`--ignore-scripts` 防恶意 postinstall；`--omit=dev` 只审计生产依赖，跳过 devDependencies 减少噪音。

## 十五、性能调优

### 用 pnpm 替代 npm（提速 3-5 倍）

```bash
npm install -g pnpm
pnpm install  # 直接用，硬链接复用
```

不需要 `.npmrc` 改任何东西。pnpm 自己的配置在 `~/.pnpmrc` 或 `pnpm-workspace.yaml`。

### 用 corepack 锁定 package manager

```bash
corepack enable
# package.json 里加
"packageManager": "pnpm@8.15.0"
```

团队用 `corepack prepare pnpm@8.15.0 --activate` 装指定版本，**避免 pnpm/npm/yarn 混用**导致的 lock 文件不兼容。

### 增量安装（适合 monorepo）

```bash
# 只装某 workspace 的依赖
npm install --workspace @my-company/web

# 增量装单包
npm install lodash --save --workspace @my-company/api
```

## 十六、最容易踩的 5 个坑

1. **proxy 配错导致卡死**——`loglevel=http` 看到 CONNECT 阶段就知道代理问题
2. **.npmrc 留了 token 提交到 git**——`git log -p .npmrc` 查历史
3. **`save-exact=true` 没生效**——`engines` 字段不写版本号也无效
4. **`engine-strict=true` 严格度过高**——本地 Node 18 跑 Node 20 项目会失败，可临时 `engine-strict=false`
5. **多 .npmrc 嵌套**——项目级被用户级覆盖是常见问题，用 `npm config get <key>` 确认实际生效值

## 十七、参考资源

- 官方文档：[docs.npmjs.com/cli/v10/configuring-npm/npmrc](https://docs.npmjs.com/cli/v10/configuring-npm/npmrc)
- npm config 命令：[docs.npmjs.com/cli/v10/commands/npm-config](https://docs.npmjs.com/cli/v10/commands/npm-config)
- pnpm 对比：[pnpm.io](https://pnpm.io)
- corepack：[nodejs.org/api/corepack](https://nodejs.org/api/corepack.html)
- 镜像源列表：[npmmirror.com/mirrors/npm](https://npmmirror.com/mirrors/npm/)

---

**总结**：`.npmrc` 配置 90% 的项目只需 5 项（registry / save-exact / engine-strict / audit / cache），剩下的按需加。CI 上多开 `audit=true`，本地多开 `prefer-offline`，团队统一 `.npmrc` 提交 git。

## 十八、4 个补充场景配置

### 场景 1：lock 文件冲突解决

```bash
# 团队里 lock 冲突了，强制统一
rm package-lock.json
npm install
git add package-lock.json
git commit -m "chore: regenerate lock"
```

预防：合并 PR 时先 `npm ci` 一遍，确认 lock 一致再合。

### 场景 2：私有 npm 包发布

自己组织内发布 `@my-company/utils` 类的私有包：

```ini
# .npmrc（项目级）
registry=https://registry.npmjs.org/
@my-company:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

发布命令：

```bash
npm login --registry=https://npm.pkg.github.com/ --scope=@my-company
npm publish
```

### 场景 3：Docker 多阶段构建

```dockerfile
# 阶段 1：装依赖
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci --ignore-scripts

# 阶段 2：构建
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 阶段 3：生产镜像
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
USER node
CMD ["node", "dist/index.js"]
```

**注意**：构建阶段和运行阶段都装 `.npmrc`（含 token 用 build-arg 注入），但最终镜像用 multi-stage 把 .npmrc 留在 deps 阶段不复制到 final。

### 场景 4：GitHub Packages + 公共 npm 混用

```ini
# 默认公共 registry
registry=https://registry.npmjs.org/

# 自己的 scope 走 GitHub Packages
@my-org:registry=https://npm.pkg.github.com/

# 必要认证
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

安装时自动从对应 registry 拉取：

```bash
npm install @my-org/utils  # 走 GitHub Packages
npm install lodash          # 走 npm 公共
```

## 十九、给新手的 5 个起步配置

完全没设过 `.npmrc`？从这 5 项开始：

```ini
# 1. 国内镜像（速度）
registry=https://registry.npmmirror.com/

# 2. 锁版本（团队一致）
save-exact=true

# 3. 严格 Node 版本（防环境差异）
engine-strict=true

# 4. 包锁文件必提交
package-lock=true

# 5. CI 友好
audit=true
```

贴到项目根 `.npmrc`，提交 git，团队所有人 `npm ci` 一次就同步了。**别从 .gitignore 排除 .npmrc**。

## 二十、最后的小贴士

- **复制别人项目的 .npmrc 时**，先把 `registry` 改成自己团队的（特别是私有 registry）
- **加了 .npmrc 但效果不对**，先 `npm config get <key>` 查实际生效值（合并后）
- **Node.js 升级后** npm 也会自动升级，跨大版本后建议删 lock 重装
- **多 `.npmrc` 嵌套** 项目里用 `npm config get registry` 看实际生效的是哪一份
- **lock 文件大**（>5MB）通常是 monorepo 或装太多包，正常