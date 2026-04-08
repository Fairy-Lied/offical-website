[根目录](../CLAUDE.md) > **pages**

---

# pages 模块

> 页面路由组件模块，基于 Nuxt 3 的文件系统自动生成路由，包含前台展示页面和完整的管理后台系统。

## 模块职责

- 定义网站的所有页面路由
- 实现各页面的 UI 和交互逻辑
- 管理页面级别的数据（通过 API 获取）
- 提供完整的后台管理界面

## 入口与路由

Nuxt 3 自动根据文件系统生成路由：

| 文件 | 路由路径 | 页面描述 | 认证要求 |
|------|----------|----------|----------|
| `index.vue` | `/` | 首页 - 乐队主展示页面 | 无 |
| `admin.vue` | `/admin` | 管理后台入口/布局 | 需要 |
| `admin/index.vue` | `/admin` | 后台首页/仪表板 | 需要 |
| `admin/login.vue` | `/admin/login` | 登录页 | 无 |
| `admin/hero.vue` | `/admin/hero` | 首屏配置 | 需要 |
| `admin/legend.vue` | `/admin/legend` | 传说配置 | 需要 |
| `admin/members.vue` | `/admin/members` | 成员管理 | 需要 |
| `admin/gallery.vue` | `/admin/gallery` | 图集管理 | 需要 |
| `admin/tours.vue` | `/admin/tours` | 巡演管理 | 需要 |
| `admin/albums.vue` | `/admin/albums` | 专辑管理 | 需要 |
| `admin/contacts.vue` | `/admin/contacts` | 联系管理 | 需要 |

---

## 前台页面

### index.vue - 首页

**职责**: 网站主入口，展示乐队完整形象，数据从 API 动态获取。

**数据获取**:
```typescript
const { data: bandData, pending } = await useFetch('/api/band-data')
```

**主要区块**:
1. **Hero 区域** - 全屏背景、乐队 Logo、标语、视频背景
2. **Legend 传说** - 乐队故事和介绍
3. **Coven 成员** - 现任和历任成员展示
4. **Discography 作品** - 专辑和曲目列表
5. **Tour 巡演** - 巡演日程和购票状态
6. **Gallery 图集** - 图片展示和灯箱
7. **Contact 联系** - 联系方式和社交媒体

**数据结构**:
```typescript
// 从 API 获取的数据
const hero = computed(() => bandData.value?.hero || {})
const legend = computed(() => bandData.value?.legend || {})
const currentMembers = computed(() => bandData.value?.members?.current || [])
const formerMembers = computed(() => bandData.value?.members?.former || [])
const albums = computed(() => bandData.value?.albums || [])
const tourDates = computed(() => bandData.value?.tours || [])
const galleryImages = computed(() => bandData.value?.gallery || [])
const contacts = computed(() => bandData.value?.contacts || {})
const socialLinks = computed(() => {
  const socials = bandData.value?.contacts?.socials || []
  return socials.map((s: any) => ({
    platform: s.platform,
    url: s.url,
    icon: s.icon
  }))
})
```

**特性**:
- 服务端渲染（SSR）
- 加载状态指示器
- 响应式布局
- 平滑滚动导航

---

## 管理后台

### admin.vue - 后台布局

**职责**: 管理后台的布局容器，包含侧边栏和主内容区。

**布局结构**:
```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
      <!-- 导航菜单 -->
    </aside>
    
    <!-- 主内容区 -->
    <main class="ml-64 p-8">
      <slot />
    </main>
  </div>
</template>
```

**特性**:
- 固定侧边栏导航
- 响应式设计
- 菜单项高亮

---

### admin/login.vue - 登录页

**职责**: 管理员登录界面。

**功能**:
- 密码输入表单
- 登录状态检查
- 错误提示
- 自动跳转（已登录时）

**实现**:
```typescript
const handleLogin = async () => {
  const { success } = await $fetch('/api/auth/login', {
    method: 'POST',
    body: { password: password.value }
  })
  
  if (success) {
    navigateTo('/admin')
  }
}
```

**默认密码**: `fairylied2024`

---

### admin/index.vue - 后台首页

**职责**: 管理后台仪表板，显示快捷入口和数据概览。

**功能**:
- 快捷操作入口
- 数据统计概览
- 最近更新记录

---

### admin/hero.vue - 首屏配置

**职责**: 管理首页 Hero 区域的内容。

**功能**:
- 修改标题、副标题、描述
- 上传背景图片
- 上传背景视频
- 实时预览

**API**:
- `GET /api/hero` - 获取当前配置
- `POST /api/hero` - 保存配置

---

### admin/legend.vue - 传说配置

**职责**: 管理乐队传说/故事内容。

**功能**:
- 编辑标题和副标题
- 上传展示图片
- 富文本编辑内容
- 实时预览

**API**:
- `GET /api/legend` - 获取当前配置
- `POST /api/legend` - 保存配置

---

### admin/members.vue - 成员管理

**职责**: 管理乐队成员信息。

**功能**:
- 成员列表展示
- 添加新成员
- 编辑成员信息（姓名、角色、图片）
- 设置现任/历任状态
- 调整排序
- 删除成员

**API**:
- `GET /api/members` - 获取成员列表
- `POST /api/members` - 添加/更新成员
- `DELETE /api/members/[id]` - 删除成员

**特性**:
- 拖拽排序
- 批量操作
- 图片上传

---

### admin/gallery.vue - 图集管理

**职责**: 管理展示图片。

**功能**:
- 图片列表展示
- 批量上传图片
- 设置图片描述
- 调整排序
- 删除图片

**API**:
- `GET /api/gallery` - 获取图集列表
- `POST /api/gallery` - 更新图集
- `DELETE /api/gallery/[id]` - 删除图片
- `POST /api/upload` - 上传文件

---

### admin/tours.vue - 巡演管理

**职责**: 管理巡演日程。

**功能**:
- 巡演列表展示
- 添加新演出
- 编辑演出信息（日期、城市、场馆、票务）
- 设置演出状态（售票中/已售罄）
- 删除演出

**API**:
- `GET /api/tours` - 获取巡演列表
- `POST /api/tours` - 添加/更新巡演
- `DELETE /api/tours/[id]` - 删除巡演

---

### admin/albums.vue - 专辑管理

**职责**: 管理音乐作品。

**功能**:
- 专辑列表展示
- 添加新专辑
- 编辑专辑信息（标题、年份、封面）
- 管理曲目列表
- 调整排序
- 删除专辑

**API**:
- `GET /api/albums` - 获取专辑列表
- `POST /api/albums` - 添加/更新专辑
- `DELETE /api/albums/[id]` - 删除专辑

**特性**:
- 曲目拖拽排序
- 封面图片上传
- 曲目批量添加

---

### admin/contacts.vue - 联系管理

**职责**: 管理联系方式和社交媒体。

**功能**:
- 编辑联系邮箱
- 管理社交媒体链接
- 添加/删除社交平台
- 调整排序

**API**:
- `GET /api/contacts` - 获取联系方式
- `POST /api/contacts` - 更新联系方式

---

## 路由守卫

### 认证守卫

管理后台路由需要认证：

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    // 检查登录状态
    const { authenticated } = useAuth()
    if (!authenticated) {
      return navigateTo('/admin/login')
    }
  }
})
```

### 自动跳转

已登录用户访问登录页时自动跳转到后台首页。

---

## 页面组件规范

### 数据获取

```typescript
// 使用 useFetch 获取数据
const { data, pending, error } = await useFetch('/api/endpoint')

// 使用 useAsyncData（需要手动触发时）
const { data, refresh } = await useAsyncData('key', () => 
  $fetch('/api/endpoint')
)
```

### 表单处理

```typescript
// 响应式表单数据
const formData = ref({
  name: '',
  role: '',
  image: ''
})

// 提交处理
const handleSubmit = async () => {
  try {
    await $fetch('/api/endpoint', {
      method: 'POST',
      body: formData.value
    })
    // 成功处理
  } catch (error) {
    // 错误处理
  }
}
```

### 错误处理

```vue
<template>
  <div v-if="error" class="error-message">
    {{ error.message }}
  </div>
  <div v-else-if="pending" class="loading">
    加载中...
  </div>
  <div v-else>
    <!-- 正常内容 -->
  </div>
</template>
```

---

## 样式约定

### 页面布局

- **前台页面**: 使用 `<UContainer>` 作为内容容器
- **后台页面**: 使用固定宽度侧边栏 + 自适应主内容区

### 响应式设计

- 移动优先设计
- 断点：768px（平板）、1024px（桌面）
- 后台在移动端隐藏侧边栏

### 统一的页面结构

```vue
<template>
  <div>
    <!-- 页面标题 -->
    <Head>
      <Title>页面标题 - Fairy Lied</Title>
    </Head>
    
    <!-- 主要内容 -->
    <main>
      <!-- 各区块组件 -->
    </main>
  </div>
</template>
```

---

## 性能优化

### 懒加载

```typescript
// 动态导入大型组件
const HeavyComponent = defineAsyncComponent(() => 
  import('~/components/HeavyComponent.vue')
)
```

### 数据缓存

- `useFetch` 自动缓存
- 手动刷新：`refresh()`

### 图片优化

- 使用 `loading="lazy"`
- 适当的图片尺寸
- WebP 格式

---

## 常见问题 (FAQ)

### Q: 如何添加新页面？
在 `pages/` 目录创建 `.vue` 文件，Nuxt 自动创建路由。

### Q: 如何保护路由？
使用中间件检查认证状态。

### Q: 如何修改页面标题？
使用 `useHead()` 组合式函数。

### Q: 数据如何更新？
通过管理后台修改，数据自动同步到数据库。

---

## 相关文件清单

```
pages/
├── index.vue                  # 首页（约 90 行）
├── admin.vue                  # 后台布局
└── admin/
    ├── index.vue              # 后台首页
    ├── login.vue              # 登录页
    ├── hero.vue               # 首屏配置
    ├── legend.vue             # 传说配置
    ├── members.vue            # 成员管理
    ├── gallery.vue            # 图集管理
    ├── tours.vue              # 巡演管理
    ├── albums.vue             # 专辑管理
    └── contacts.vue           # 联系管理
```

---

## 变更记录 (Changelog)

### 2026-04-08 - 模块文档重大更新
- 全面更新 pages 模块文档
- 添加完整的管理后台系统说明
- 添加路由守卫和认证机制文档
- 添加数据获取和表单处理规范
- 更新页面列表和功能描述

### 2026-03-07 - 模块文档初始化
- 创建 pages 模块 CLAUDE.md 文档
- 记录初始页面结构（5个前台页面）
- 梳理数据结构和关键依赖
