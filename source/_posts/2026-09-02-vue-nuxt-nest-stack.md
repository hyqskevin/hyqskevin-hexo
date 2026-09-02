---
title: Vue3 + Nuxt + NestJS 全栈最佳实践速览
date: 2026-09-02 00:00:00
description: Vue3 Composition API、Nuxt3 app/ 目录结构、NestJS 模块化架构、Pinia 状态管理、Prisma + MySQL、Nuxt 内置 API 路由。一篇涵盖前后端分离 / 一体化两种部署模式的关键最佳实践。
categories:
  - notes
tags:
  - Vue3
  - Nuxt
  - NestJS
  - Pinia
  - Prisma
  - 全栈
---

最近用 Vue3 + Nuxt3 + NestJS 搭了个全栈应用，整理一下用到的最佳实践。这套组合既能**前后端分离部署**（Nuxt 静态站 + NestJS API 服务），也能**一体化部署**（Nuxt 接管 server/api/，后端逻辑直接写在 Nuxt 项目里）。

## 一、为什么这套组合

| 框架 | 角色 | 优势 |
|---|---|---|
| **Vue3** | 前端视图层 | 组合式 API + 类型推断 + 生态成熟 |
| **Nuxt3** | 前端框架 + 可选后端 | SSR / SSG / SPA 三模式、约定路由、文件路由 |
| **NestJS** | 独立后端 | 模块化 + DI + 装饰器，企业级架构 |

最实用场景：**用 Nuxt3 的 `server/api/` 写后端**——一套进程搞定前后端，省一台机器。NestJS 适合**独立后端服务**（多端复用、复杂业务域）。

## 二、Vue3 组件写法（必读）

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUser } from '@/composables/useUser'

const count = ref(0)
const { user, fetchUser } = useUser()
const doubleCount = computed(() => count.value * 2)

function increment() { count.value++ }

onMounted(async () => {
  await fetchUser()
})
</script>

<template>
  <p>Count: {{ count }} (Double: {{ doubleCount }})</p>
  <button @click="increment">Increment</button>
  <p v-if="user">User: {{ user.name }}</p>
</template>
```

三个关键习惯：
- **`<script setup>`** 永远是默认，比 Options API 简洁
- **`ref()` 优先于 `reactive()`**：类型推断更准 + 整个对象替换更安全
- **逻辑抽到 composables/**：复用 + 测试 + SSR 友好

## 三、Nuxt3 目录结构（推荐）

```
nuxt-app/
├── app/
│   ├── components/      # 自动 import 的组件
│   ├── composables/     # 自动 import 的 composable
│   ├── pages/           # 文件路由（pages/foo.vue → /foo）
│   ├── layouts/         # default.vue 等
│   ├── middleware/      # 路由守卫
│   └── plugins/         # 全局插件
├── server/
│   ├── api/             # 文件 API 路由（defineEventHandler）
│   └── plugins/         # Nitro 服务端插件
├── public/              # 不编译的静态资源
├── nuxt.config.ts
└── package.json
```

**Nuxt 3 默认用 `app/` 目录**（Nuxt 2 是根目录），这是 v2 → v3 升级最常踩的坑。

## 四、NestJS 模块化架构（独立后端场景）

```
src/
├── app.module.ts          # 根模块
├── main.ts
├── user/                 # 每个域一个目录
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.entity.ts
│   └── dto/
└── auth/
    ├── auth.module.ts
    ├── auth.controller.ts
    └── jwt.strategy.ts
```

```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() { return this.userService.findAll() }

  @Post()
  create(@Body() dto: CreateUserDto) { return this.userService.create(dto) }
}
```

NestJS 的核心理念：**控制器只接 HTTP，服务只管业务，DTO 管类型**。三者解耦后单测好写。

## 五、状态管理：Pinia（推荐 Setup 风格）

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => !!currentUser.value)

  async function login(credentials) {
    const r = await fetch('/api/login', { method: 'POST', body: JSON.stringify(credentials) })
    currentUser.value = await r.json()
  }
  function logout() { currentUser.value = null }

  return { currentUser, isLoggedIn, login, logout }
})
```

Setup Store（`defineStore('xxx', () => {...})`）比 Options Store 简洁，**所有逻辑可以直接用 Vue3 组合式 API 写**。

## 六、数据访问：Prisma + MySQL

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

Prisma 优势：**类型安全从 schema 一路传到前端**（`@prisma/client` 生成 TS 类型 + Nuxt 自动转发 API 类型）。

## 七、Nuxt 内置 API 路由（一套进程方案）

```typescript
// server/api/users.get.ts
import { defineEventHandler } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  return await prisma.user.findMany()
})
```

**文件命名即路由**：`users.get.ts` → `GET /api/users`，`users.post.ts` → `POST /api/users`。前端用 `useFetch` 直接调：

```vue
<script setup lang="ts">
import type { User } from '@/types/user'
const { data: users, error, pending } = await useFetch<User[]>('/api/users')
</script>
```

这种方式**省掉 NestJS 一整套进程**，适合中小项目。需要复杂业务域再拆 NestJS。

## 八、5 条最容易踩的坑

1. **`<script setup>` 别混 Options API**——同一个组件里用两种写法，状态会丢失
2. **Nuxt3 别用 Nuxt2 目录结构**——`pages/` 必须放 `app/pages/` 而不是根目录
3. **`reactive()` 别包整个组件状态**——破坏响应式追踪；用 `ref()` 替代
4. **NestJS 装饰器顺序**——`@Body()` 必须在 `@Get()`/`@Post()` 之后
5. **Prisma client 不要全局单例**——Nuxt SSR 时会泄露连接，每个请求一个 client

## 九、何时升级到 Nuxt + NestJS 拆分部署

| 场景 | 推荐 |
|---|---|
| 单团队 / 小项目 | Nuxt 一体化（server/api/） |
| 多端复用 API（小程序 + Web + App） | 拆 NestJS 独立服务 |
| 后端需要复杂业务域（DDD） | NestJS 模块化 |
| 需要独立后端部署频率 | 拆 NestJS |
| 一周内要上线 MVP | Nuxt 一体化 |

判断标准：**如果你发现 Nuxt 的 server/api/ 文件夹开始超过 50 个**——该拆 NestJS 了。