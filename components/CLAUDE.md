[根目录](../CLAUDE.md) > **components**

---

# components 模块

> Vue 组件库模块，包含页面区块组件、功能组件和管理组件。

## 模块职责

- 提供可复用的 Vue 组件
- 实现页面区块（sections）
- 提供功能组件（features）
- 提供管理后台组件（admin）

## 文件结构

```
components/
├── AppNavigation.vue          # 全局导航组件
├── sections/                  # 页面区块组件
│   ├── HeroSection.vue        # 首屏英雄区
│   ├── LegendSection.vue      # 传说介绍区
│   ├── CovenSection.vue       # 成员阵列区
│   ├── DiscographySection.vue # 作品区
│   ├── TourSection.vue        # 巡演区
│   ├── GallerySection.vue     # 图集区
│   └── ContactSection.vue     # 联系区
├── features/                  # 功能组件
│   ├── ImageLightbox.vue      # 图片灯箱
│   └── MemberCard.vue         # 成员卡片
└── admin/                     # 管理组件
    └── AdminCard.vue          # 管理卡片
```

---

## 组件详细说明

### AppNavigation.vue

**职责**: 全局导航栏，支持桌面端和移动端响应式设计。

**功能特性**:
- 固定顶部导航栏
- 滚动时自动添加背景效果
- 平滑滚动到锚点章节
- IntersectionObserver 监听当前可见章节
- 移动端汉堡菜单
- 支持用户动画偏好设置

**导航项配置**:
```typescript
interface NavItem {
  id: string        // 锚点ID
  label: string     // 中文标签
  labelEn: string   // 英文标签
}
```

**使用位置**: `app.vue` 中全局引入

---

### sections/ 组件

所有区块组件遵循统一的设计规范：

#### 共同特性
- 章节标题样式：`.section-title` (Cinzel 字体, 32px, 700 字重)
- 章节装饰线：`.section-accent` (110px 宽, 2px 高, 红色)
- 玻璃效果：`.glass-effect`
- 悬停缩放：`.hover-scale`

#### HeroSection.vue

**职责**: 首屏英雄区域，展示乐队主视觉。

**Props**:
- `backgroundImage: string` - 背景图片URL
- `title: string` - 主标题
- `subtitle: string` - 副标题
- `description: string` - 描述文字
- `nextSectionId: string` - 下一章节ID（用于滚动）
- `video: string` - 背景视频URL（可选）

**特性**:
- 全屏高度（100vh）
- 渐变背景叠加
- 标题渐入动画
- 滚动指示器
- 视频背景支持

#### LegendSection.vue

**职责**: 乐队传说/故事介绍区域。

**Props**:
- `image: string` - 图片URL
- `title: string` - 标题
- `subtitle: string` - 副标题
- `content: string` - 介绍内容

**布局**: 左图右文（响应式）

#### CovenSection.vue

**职责**: 乐队成员展示区域。

**Props**:
- `currentMembers: Member[]` - 现任成员
- `formerMembers: Member[]` - 历任成员

**成员数据结构**:
```typescript
interface Member {
  id: number
  name: string
  role: string
  image: string
  is_current: number
  sort_order: number
}
```

**特性**:
- 网格布局（桌面4列，平板2列，手机1列）
- 成员卡片悬停效果
- 历任成员半透明遮罩
- 使用 `MemberCard.vue` 组件

#### DiscographySection.vue

**职责**: 音乐作品展示区域。

**Props**:
- `albums: Album[]` - 专辑列表

**专辑数据结构**:
```typescript
interface Album {
  id: number
  title: string
  year: string
  cover: string
  tracks: string[]
  sort_order: number
}
```

**特性**:
- 专辑封面展示
- 曲目列表展开/收起
- 悬停缩放效果

#### TourSection.vue

**职责**: 巡演日程展示区域。

**Props**:
- `tourDates: TourDate[]` - 巡演日期列表

**巡演数据结构**:
```typescript
interface TourDate {
  id: number
  date: string
  city: string
  venue: string
  status: 'onsale' | 'soldout'
  ticket_url: string
  sort_order: number
}
```

**特性**:
- 表格式布局
- 状态按钮（售票中/已售罄）
- 响应式设计

#### GallerySection.vue

**职责**: 图片集展示区域。

**Props**:
- `images: GalleryImage[]` - 图片列表

**图片数据结构**:
```typescript
interface GalleryImage {
  id: number
  url: string
  alt: string
  sort_order: number
}
```

**特性**:
- 瀑布流/网格布局
- 点击打开灯箱（使用 `ImageLightbox.vue`）
- 懒加载优化

#### ContactSection.vue

**职责**: 联系方式和社交媒体展示区域。

**Props**:
- `contacts: Contact[]` - 联系方式列表
- `socials: SocialLink[]` - 社交媒体链接

**数据结构**:
```typescript
interface Contact {
  label: string
  email: string
}

interface SocialLink {
  platform: string
  url: string
  icon: string
}
```

**特性**:
- 联系表单（当前为展示）
- 社交媒体图标链接
- 使用 Iconify 图标

---

### features/ 组件

#### ImageLightbox.vue

**职责**: 图片灯箱组件，用于全屏查看图片。

**Props**:
- `images: GalleryImage[]` - 图片列表
- `currentIndex: number` - 当前图片索引
- `isOpen: boolean` - 是否打开

**Emits**:
- `close` - 关闭灯箱
- `prev` - 上一张
- `next` - 下一张

**特性**:
- 键盘导航（左右箭头、ESC）
- 触摸滑动支持
- 图片缩放
- 背景模糊

#### MemberCard.vue

**职责**: 成员卡片组件，用于展示单个成员信息。

**Props**:
- `member: Member` - 成员数据
- `isFormer: boolean` - 是否为历任成员

**特性**:
- 成员头像
- 名字和角色
- 社交媒体链接
- 悬停效果
- 历任成员遮罩

---

### admin/ 组件

#### AdminCard.vue

**职责**: 管理后台通用卡片组件。

**Props**:
- `title: string` - 卡片标题
- `icon: string` - 图标名称

**插槽**:
- `default` - 默认内容插槽
- `actions` - 操作按钮插槽

**特性**:
- 统一的卡片样式
- 响应式设计
- 可自定义操作按钮

---

## 组件注册

在 `nuxt.config.ts` 中配置自动导入：

```typescript
export default defineNuxtConfig({
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
```

**使用方式**:
```vue
<!-- 自动导入，无需手动 import -->
<template>
  <div>
    <HeroSection :title="'标题'" />
    <AppNavigation />
  </div>
</template>
```

---

## 样式约定

### 通用样式类

| 类名 | 用途 | CSS 属性 |
|------|------|----------|
| `.section-title` | 章节标题 | Cinzel, 32px, 700 |
| `.section-accent` | 装饰线 | 110px, 2px, 红色 |
| `.glass-effect` | 玻璃效果 | 毛玻璃背景 |
| `.hover-scale` | 悬停缩放 | translateY(-5px) scale(1.02) |
| `.font-metal` | 金属文字 | Cinzel, 700 |
| `.gradient-text` | 渐变文字 | 红色渐变 |

### 响应式断点

- **移动优先**: 默认
- **平板**: `@media (max-width: 768px)`
- **桌面**: `@media (max-width: 1024px)`
- **大屏**: `@media (min-width: 1024px)`

---

## 组件通信

### Props 向下传递

父组件通过 props 向子组件传递数据：

```vue
<!-- 父组件 -->
<HeroSection 
  :title="hero.title"
  :subtitle="hero.subtitle"
/>
```

### Emits 向上触发

子组件通过 emits 向父组件发送事件：

```vue
<!-- 子组件 -->
<script setup>
const emit = defineEmits(['close'])
const handleClose = () => emit('close')
</script>
```

### Provide/Inject

用于深层嵌套组件通信（当前项目较少使用）。

---

## 性能优化

### 懒加载

```vue
<script setup>
// 动态导入组件
const ImageLightbox = defineAsyncComponent(() => 
  import('~/components/features/ImageLightbox.vue')
)
</script>
```

### 图片优化

- 使用 `loading="lazy"` 属性
- 适当的图片尺寸
- WebP 格式支持

### 组件缓存

使用 `<KeepAlive>` 缓存频繁切换的组件。

---

## 常见问题 (FAQ)

### Q: 如何添加新组件？
1. 在对应目录创建 `.vue` 文件
2. 定义 props 和 emits
3. 在页面中直接使用（自动导入）

### Q: 组件样式不生效？
- 检查是否使用了 `scoped`
- 确认类名拼写正确
- 检查 CSS 优先级

### Q: 如何调试组件？
- 使用 Vue DevTools
- 在组件中添加 `console.log`
- 使用 `v-model` 双向绑定调试

---

## 相关文件清单

```
components/
├── AppNavigation.vue              # 全局导航（440行）
├── sections/
│   ├── HeroSection.vue            # 首屏英雄区
│   ├── LegendSection.vue          # 传说介绍区
│   ├── CovenSection.vue           # 成员阵列区
│   ├── DiscographySection.vue     # 作品区
│   ├── TourSection.vue            # 巡演区
│   ├── GallerySection.vue         # 图集区
│   └── ContactSection.vue         # 联系区
├── features/
│   ├── ImageLightbox.vue          # 图片灯箱
│   └── MemberCard.vue             # 成员卡片
└── admin/
    └── AdminCard.vue              # 管理卡片
```

---

## 变更记录 (Changelog)

### 2026-04-08 - 模块文档初始化
- 创建 components 模块 CLAUDE.md 文档
- 详细记录所有组件的职责、props、特性
- 添加组件通信和性能优化说明
