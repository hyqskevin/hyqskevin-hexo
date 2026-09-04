---
title: 跨端前后端开发技术栈
date: 2026-09-02 00:00:00
description: 国内小程序 + 后台管理 + 监控系统全栈技术栈选型：Taro + Vue3（小程序）+ Nuxt3（后台）+ NestJS（后端）+ TypeScript 共享类型包。完整对比表 + 4 框架核心用法 + 适配要点 + 3 条避坑。
series:
  name: cross-platform-stack
  index: 1
  total: 2
categories:
  - notes
tags:
  - Taro
  - Vue3
  - Nuxt3
  - NestJS
  - 小程序
  - 后台
---

国内"小程序 + 后台 + 监控"全栈技术栈选型实战——Taro（多端小程序）+ Nuxt3（后台）+ NestJS（后端）+ TypeScript 共享类型。本篇（上）讲选型 + 4 框架核心用法；下篇讲企业级落地。

## 一、选型原则

**国内开发环境**适配 + 业务场景匹配（小程序 + 后台管理 + 监控系统）+ **开发效率 / 可维护性 / 生态适配**。

## 二、整体技术栈

| 模块 | 技术 | 选型理由 |
|---|---|---|
| 小程序前端 | **Taro + Vue3 + TS + Vite** | 跨端（一套代码 → 微信/支付宝/百度多端）+ 类型安全 + 快速构建 |
| 后端服务 | **NestJS（TS 原生）** | 企业级架构规范 + 模块化 + DI + 与前端类型统一 |
| 后台前端 | **Nuxt3（Vue3 + TS + Vite）** | Vue 生态 + 与 Taro 复用组件 + SSR 性能 |
| 共享依赖 | **TypeScript 共享类型包** | 统一全栈接口类型，避免前后端字段不一致 |

**补充**：若团队无 TS 基础，NestJS → Express。但优先 NestJS（架构规范 + 多人协作）。**不推荐 Koa**（缺内置架构，多人协作易混乱）。

## 三、4 框架核心用法

### 3.1 Taro（小程序/多端前端）

```bash
# 安装 CLI
npm i -g @tarojs/cli

# 初始化项目（Vue3 + TS + Vite）
taro init my-app --template vue3-ts
cd my-app

# 跑 dev server（微信小程序）
npm run dev:weapp

# 编译发布
npm run build:weapp
```

```vue
<!-- src/pages/index/index.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <view class="container">
    <text>{{ count }}</text>
    <button @click="count++">+1</button>
  </view>
</template>
```

**关键点**：
- 用 `view` / `text` 替代 `div` / `span`（跨端兼容）
- 用 `import { ref }` 替代 `import { useState }`（Vue 风格）
- `npm run build:weapp` 出微信包；`build:alipay` 出支付宝

### 3.2 NestJS（后端服务）

```bash
npm i -g @nestjs/cli
nest new backend --package-manager npm
cd backend
```

```typescript
// src/user/user.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.findAll()
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }
}
```

**关键点**：
- `@Module` 装饰器组织代码（UserModule / AuthModule / ...）
- `@Controller` + `@Get/@Post` 定义路由
- `@Injectable` + DI 自动注入服务
- `class-validator` 做 DTO 验证

### 3.3 Nuxt3（后台前端）

```bash
npx nuxi@latest init admin
cd admin
npm install
```

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
const { data: stats } = await useFetch('/api/stats')
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p>用户数: {{ stats?.userCount }}</p>
  </div>
</template>
```

**关键点**：
- 文件路由（pages/* → /*）
- `useFetch` 自动 SSR 友好
- 可与 Taro 共享组件（都是 Vue 生态）

### 3.4 TypeScript 共享类型包

```
项目结构：
monorepo/
├── packages/
│   ├── shared-types/        # 共享类型
│   ├── miniprogram/        # Taro 小程序
│   ├── backend/            # NestJS 后端
│   └── admin/              # Nuxt3 后台
```

```typescript
// packages/shared-types/src/user.ts
export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface CreateUserDto {
  name: string
  email: string
}
```

```typescript
// packages/backend/src/user/user.service.ts
import { User, CreateUserDto } from '@myapp/shared-types'

async create(dto: CreateUserDto): Promise<User> {
  // ...
}
```

**价值**：前后端共用一个类型，**字段不一致编译就报错**。

## 四、5 个企业级集成模式

### 4.1 微信登录

```typescript
// backend/src/auth/wechat.strategy.ts
@Injectable()
export class WechatStrategy extends PassportStrategy {
  async validate(token: string) {
    // 调微信接口验证 code → 拿 openid + session_key
    const res = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${token}`
    )
    return { openid: res.data.openid, sessionKey: res.data.session_key }
  }
}
```

### 4.2 钉钉通知

```typescript
@Injectable()
export class DingTalkService {
  async sendAlarm(text: string) {
    await axios.post('https://oapi.dingtalk.com/robot/send', {
      access_token: process.env.DING_TOKEN,
      msgtype: 'text',
      text: { content: text }
    })
  }
}
```

### 4.3 飞书审批

```typescript
@Post('approval')
async createApproval(@Body() dto: ApprovalDto) {
  // 调飞书审批 API 创建审批流
  const res = await axios.post(
    'https://open.feishu.cn/open-apis/approval/v4/instances',
    { ... },
    { headers: { Authorization: `Bearer ${tenant_access_token}` } }
  )
  return res.data
}
```

### 4.4 阿里云 OSS 上传

```typescript
@Injectable()
export class OssService {
  async upload(file: Buffer, key: string) {
    const client = new OSS({
      accessKeyId: process.env.OSS_KEY,
      accessKeySecret: process.env.OSS_SECRET,
      bucket: 'my-bucket',
      region: 'oss-cn-hangzhou'
    })
    return client.put(key, file)
  }
}
```

### 4.5 Sentry 错误监控

```typescript
// backend/src/main.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

// 异常自动上报
app.useGlobalFilters(new SentryExceptionFilter())
```

## 五、4 框架适配要点

| 框架 | 难点 | 解决 |
|---|---|---|
| **Taro** | 多端 API 差异（微信 / 支付宝） | 用 `Taro.xxx` 跨端 API，**避免**原生 API |
| **Taro** | 小程序包大小限制（2MB 主包） | 用分包加载 + 动态 import |
| **NestJS** | 装饰器多，新人学成本 | 先熟悉 Express，再学 NestJS |
| **NestJS** | 业务异常 vs 系统异常 | 用 `HttpException` 区分 |
| **Nuxt3** | SSR 性能优化 | 启用 `routeRules` + 缓存策略 |
| **Nuxt3** | SEO vs 后台（不需要 SEO） | 关闭 SSR，纯 SPA |

## 六、3 条避坑

### 6.1 Taro 不要用太多原生 API

```text
❌ 写 wx.login / wx.request → 只能跑微信
✅ 写 Taro.login / Taro.request → 自动编译到对应平台
```

### 6.2 NestJS 不要省 DTO

```text
❌ 用 any 类型接收所有参数
  → 客户端传错字段，服务端不报错

✅ 用 class-validator + DTO
  → 字段类型 / 必填 / 范围都自动验证
```

### 6.3 Nuxt3 不要全开 SSR

```text
后台管理系统：不需要 SEO
  → 关闭 SSR，纯 SPA（首屏 0.5s）
  → 关掉 useFetch 的 SSR 行为

对外展示页：需要 SEO
  → 开 SSR
  → 用 routeRules 配置缓存
```

## 七、本文 + 下篇

- （上）选型 + 4 框架核心用法（本文）
- （下）企业级落地 + 部署 + 监控 + 团队分工

---

> **跨端前后端技术栈选型的核心**：**Vue 生态一统天下**（Taro + Nuxt3 都是 Vue）+ **NestJS 企业级后端**（TypeScript 强类型 + 模块化）+ **TypeScript 共享类型**（前后端一致）。**国内开发首选组合**。**先 1 个端跑通 → 扩到 3 端**。