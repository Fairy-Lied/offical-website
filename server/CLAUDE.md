[根目录](../../CLAUDE.md) > **server**

---

# server 模块

> 服务端代码模块，基于 Nuxt 3 的 Nitro 引擎。

## 模块职责

- 提供服务端 API 端点（如有需要）
- 服务端渲染(SSR)逻辑
- 服务端中间件
- 服务端插件

## 当前状态

**当前为空目录**，仅包含 TypeScript 配置文件。

项目当前为纯静态展示网站，所有数据硬编码在前端页面中，暂未使用服务端功能。

## 文件结构

```
server/
└── tsconfig.json         # 服务端 TypeScript 配置
```

## tsconfig.json

```json
{
  "extends": "../.nuxt/tsconfig.server.json"
}
```

继承 Nuxt 生成的服务端 TypeScript 配置。

---

## 潜在扩展

未来如需添加后端功能，可在此目录创建：

### API 端点
```
server/
├── api/                  # API 路由
│   ├── news.get.ts       # GET /api/news
│   ├── news.post.ts      # POST /api/news
│   └── albums.get.ts     # GET /api/albums
├── middleware/           # 服务端中间件
│   └── auth.ts           # 认证中间件
├── plugins/              # 服务端插件
│   └── database.ts       # 数据库连接
└── utils/                # 服务端工具函数
    └── helpers.ts
```

### 示例 API 端点
```typescript
// server/api/news.get.ts
export default defineEventHandler(async (event) => {
  // 从数据库或 CMS 获取新闻
  const news = await getNewsFromDatabase()
  return news
})
```

### 示例中间件
```typescript
// server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log(`${event.method} ${event.path}`)
})
```

---

## 与前端数据集成

在页面中使用服务端数据：

```vue
<script setup>
// 使用服务端 API
const { data: news } = await useFetch('/api/news')

// 或使用 SSR 友好的数据获取
const { data: albums } = await useAsyncData('albums', () => {
  return $fetch('/api/albums')
})
</script>
```

---

## 部署考虑

- 使用 `nuxt build` 会生成包含服务端代码的构建
- 使用 `nuxt generate` 会生成纯静态站点（不需要 server）
- 如需服务端功能，部署时需要 Node.js 环境或边缘计算平台（如 Vercel、Cloudflare Workers）

---

## 常见问题 (FAQ)

### Q: 现在需要使用 server 吗？
当前不需要。所有数据都是静态的，直接硬编码在 pages 中。

### Q: 什么时候需要添加 server？
- 需要连接数据库时
- 需要处理表单提交时
- 需要集成第三方 API 时
- 需要用户认证时
- 需要 SSR 获取动态数据时

### Q: 可以删除 server 目录吗？
可以，但保留它不会有任何影响。建议保留以备后续扩展。

---

## 相关文件清单

```
server/
└── tsconfig.json         # TypeScript 配置
```

---

## 变更记录 (Changelog)

### 2026-03-07 - 模块文档初始化
- 创建 server 模块 CLAUDE.md 文档
- 记录当前为空状态和未来扩展方向
