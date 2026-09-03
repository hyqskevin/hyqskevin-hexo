---
title: 跨端前后端落地实战
date: 2026-09-02 00:00:00
description: 跨端前后端技术栈下篇：monorepo 工程化（pnpm workspace + turborepo）、CI/CD 流水线（GitHub Actions）、监控告警（Sentry + 钉钉 + Prometheus）、性能优化（小程序分包 / Nuxt3 SSR 缓存 / NestJS Fastify）、5 人团队分工、3 个月里程碑。
series:
  name: cross-platform-stack
  index: 2
  total: 2
categories:
  - notes
tags:
  - Taro
  - Nuxt3
  - NestJS
  - 部署
  - 监控
  - monorepo
---

（上）讲选型 + 4 框架核心用法。本篇（下）讲**企业级落地**——monorepo 工程化 + CI/CD + 监控告警 + 性能优化 + 团队分工 + 3 个月里程碑。

## 一、monorepo 工程化

### 1.1 用 pnpm workspace

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*"
  - "apps/*"
```

```text
monorepo/
├── package.json             # 根 package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── apps/
│   ├── miniprogram/        # Taro 小程序
│   └── admin/              # Nuxt3 后台
├── packages/
│   ├── backend/            # NestJS 后端
│   └── shared-types/        # 共享类型
└── tools/
    └── scripts/
```

### 1.2 根 package.json 关键字段

```json
{
  "name": "my-app-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r exec rm -rf dist .nuxt .taro-cache"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### 1.3 共享类型包

```bash
# 创建 packages/shared-types
mkdir -p packages/shared-types
cd packages/shared-types
pnpm init
# package.json
{
  "name": "@myapp/shared-types",
  "version": "0.0.1",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

```typescript
// src/index.ts
export * from './user'
export * from './order'
export * from './product'
```

```bash
# 其他包引用
cd apps/admin
pnpm add @myapp/shared-types@workspace:*
```

## 二、CI/CD 流水线

### 2.1 GitHub Actions 工作流

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r test
      - run: pnpm -r lint

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter backend build
      - name: Deploy to Aliyun
        run: |
          cd packages/backend
          aliyun ecs deploy --image node:20 --env .env.production

  deploy-admin:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter admin build
      - name: Deploy to Vercel
        run: vercel deploy --prod

  deploy-miniprogram:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - name: Build WeChat
        run: pnpm --filter miniprogram build:weapp
      - name: Upload to WeChat CI
        run: |
          miniprogram-ci upload \
            --pkp ${{ secrets.WECHAT_PKP }} \
            --appid ${{ secrets.WECHAT_APPID }} \
            --project-path ./dist
```

### 2.2 微信小程序 CI

```bash
# 微信小程序原生 CI
miniprogram-ci upload \
  --pkp ./private.key \
  --appid wx123456 \
  --project-path ./dist
```

## 三、监控告警体系

### 3.1 三层监控

```text
L1 业务监控（业务指标）：
  - DAU / 转化率 / GMV
  - 错误率 / 响应时间

L2 应用监控（技术指标）：
  - QPS / 延迟 / 错误日志
  - CPU / 内存 / 数据库

L3 基础设施监控（资源指标）：
  - 主机存活
  - 网络流量
  - 磁盘空间
```

### 3.2 Sentry（应用监控）

```typescript
// backend/src/main.ts
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  integrations: [new ProfilingIntegration()]
})

// 异常自动捕获
process.on('unhandledRejection', (err) => Sentry.captureException(err))
```

### 3.3 Prometheus（基础设施）

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - 9090:9090
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - 3000:3000
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: backend
    static_configs:
      - targets: ['backend:3000']
  - job_name: node-exporter
    static_configs:
      - targets: ['host:9100']
```

### 3.4 告警 → 钉钉

```typescript
// 异常捕获 + 钉钉通知
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    // 上报 Sentry
    Sentry.captureException(exception)

    // 严重异常发钉钉
    if (this.isCritical(exception)) {
      await axios.post('https://oapi.dingtalk.com/robot/send', {
        access_token: process.env.DING_TOKEN,
        msgtype: 'markdown',
        markdown: {
          title: '【严重异常】',
          text: `# 异常\n\n${exception.message}\n\n服务器：${os.hostname()}\n时间：${new Date()}`
        }
      })
    }
  }
}
```

## 四、性能优化 3 大块

### 4.1 小程序优化

```javascript
// 1. 主包 < 2MB
// 2. 分包加载
{
  "pages": [
    "pages/index/index",       // 主包
    "pages/detail/index"        // 主包
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": ["pages/list/index"]   // 单独包
    }
  ]
}

// 3. 图片压缩
import { Taro.compressImage } from '@tarojs/taro'
const compressed = await Taro.compressImage({
  src: originalPath,
  quality: 75
})

// 4. 缓存
import { Taro.setStorageSync, Taro.getStorageSync } from '@tarojs/taro'
Taro.setStorageSync('user', userData, 60 * 60)  // 缓存 1 小时
```

### 4.2 Nuxt3 性能

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },          // 静态化
    '/admin/**': { ssr: false },       // 后台不开 SSR
    '/api/**': { cache: { maxAge: 60 } }  // API 缓存
  },
  experimental: {
    payloadExtraction: true,           // 减少 payload
    inlineSSRStyles: true              // 内联样式
})
```

### 4.3 NestJS 性能

```typescript
// main.ts
import { FastifyAdapter } from '@nestjs/platform-fastify'

// 用 Fastify 替代 Express（快 3 倍）
const app = await NestFactory.create(AppModule, new FastifyAdapter())

// 启用压缩
await app.register(fastifyCompress)

// 启用缓存
import { CacheModule } from '@nestjs/cache-manager'
@Module({
  imports: [CacheModule.register({ ttl: 5 * 60 * 1000 /* 5 min */ })]
})
```

**QPS 对比**（同一台机器）：
- NestJS + Express：~5000 QPS
- NestJS + Fastify：~15000 QPS

## 五、5 人团队分工

```text
PM 1：
  - 需求 + 协调 + 客户对接
  - 月活 / GMV 等业务指标

后端 1（NestJS）：
  - API / DB / 部署
  - 性能 + 安全 + 测试

前端 1（Taro 小程序）：
  - 微信小程序 + 支付宝小程序
  - 跨端适配 + 性能优化

前端 1（Nuxt3 后台）：
  - 后台管理 + 数据可视化
  - UI / 交互 / 体验

DevOps 1（兼）：
  - CI/CD + 监控 + 部署
  - 运维 + 安全审计
```

**5 人 = 中型团队最小单位**，10-20 人可加 1-2 个测试 / 设计师。

## 六、3 个月 MVP 里程碑

### 月 1：搭骨架

```text
Week 1：
  - monorepo 初始化（pnpm + TypeScript）
  - Taro + NestJS + Nuxt3 项目脚手架
  - CI 跑通（lint + test + build）

Week 2：
  - 共享类型包 @myapp/shared-types
  - 用户 / 订单基础 CRUD API
  - 小程序登录 + 列表页

Week 3：
  - 后台登录 + 数据列表
  - 飞书 / 钉钉通知
  - Sentry 错误监控接入

Week 4：
  - 部署到阿里云 ECS + Vercel
  - 微信小程序上传体验版
  - 第一版 5 个内测用户
```

### 月 2：补功能

```text
- 核心业务功能（按 PRD）
- 权限管理（RBAC）
- 数据导出（Excel / CSV）
- 监控告警完善
- 性能优化首轮
```

### 月 3：跑业务

```text
- 50 个种子用户 / 商家
- 收集反馈 + 迭代
- 跑通核心商业模式
- 月活 / GMV 等关键指标跑出来
```

## 七、3 条避坑

1. **不要 monorepo 起步就搞 5+ 包**——先 2 个包（Taro + NestJS）+ 类型共享就够
2. **不要"先搭完美 CI"**——CI 跑通即可，业务上线后再优化
3. **不要忽视监控告警**——上线第一天就要有 Sentry + 告警

## 八、本文 + 上篇

- （上）选型 + 4 框架核心用法（已写）
- （下）落地实战 + 监控 + 性能（本文）

---

> **跨端前后端落地的核心**：**monorepo + TypeScript 共享类型** 是协作基础。**Taro 适配多端、NestJS 企业级、Vue 生态统一**。**5 人小团队 + 3 个月 MVP 跑通 = 能上线**。**别从架构开始，从第一个用户开始**——业务上线后再优化架构。