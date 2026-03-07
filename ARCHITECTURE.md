# Fairy Lied 官方网站 v2 - 架构设计文档

> Fairy Lied（妖精说了谎）哥特金属乐队官网架构设计

---

## 1. 技术架构总览

### 1.1 技术选型

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **框架** | Nuxt 3 | ^3.15.x | 全栈 Vue 框架，SSR/SSG 支持，文件系统路由 |
| **UI 框架** | Vue 3 | ^3.5.x | 渐进式框架，Composition API，TypeScript 原生支持 |
| **类型系统** | TypeScript | ^5.7.x | 类型安全，IDE 友好，大型项目必备 |
| **样式方案** | Tailwind CSS | ^3.4.x | 原子化 CSS，快速开发，设计系统友好 |
| **UI 组件** | Nuxt UI | ^2.21.x | 基于 Tailwind 的 Vue 组件库，暗色主题支持 |
| **包管理** | pnpm | 8.15.4+ | 高效磁盘利用，严格依赖解析 |
| **构建工具** | Vite | (内置) | 快速 HMR，优化的生产构建 |

### 1.2 架构决策

#### 为什么选择 Nuxt 3 SSR？

```mermaid
graph LR
    A[用户请求] --> B[Nuxt SSR]
    B --> C[服务端渲染首屏]
    C --> D[返回完整 HTML]
    D --> E[Vue hydrate]
    E --> F[完整 SPA 体验]
```

- **SEO 优化**: 乐队官网需要被搜索引擎良好收录
- **首屏性能**: SSR 减少白屏时间，对图片密集型网站友好
- **社交媒体分享**: OG 标签需要服务端渲染
- **渐进增强**: 无 JavaScript 也能展示基础内容

#### 为什么使用 Tailwind + CSS 变量？

- **设计一致性**: CSS 变量统一管理 V2 设计 Token
- **动态主题**: 支持未来可能的主题切换（如演出特别版）
- **开发效率**: Tailwind 原子类快速实现设计稿
- **运行时定制**: CSS 变量可在运行时动态修改

---

## 2. 组件架构

### 2.1 组件分层

```
┌─────────────────────────────────────────────────────────────┐
│                      Page Components                        │
│  (pages/*.vue) - 页面级组件，处理数据获取和页面布局          │
├─────────────────────────────────────────────────────────────┤
│                     Section Components                      │
│  (components/sections/*.vue) - 页面区块组件                  │
├─────────────────────────────────────────────────────────────┤
│                     Feature Components                      │
│  (components/features/*.vue) - 功能组件（成员卡、专辑卡等）   │
├─────────────────────────────────────────────────────────────┤
│                      Base Components                        │
│  (components/base/*.vue) - 基础原子组件                     │
├─────────────────────────────────────────────────────────────┤
│                      Nuxt UI / External                     │
│  (来自 @nuxt/ui 的现成组件)                                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 组件清单

#### 基础组件 (components/base/)

| 组件名 | 职责 | 设计规范关联 |
|--------|------|--------------|
| `BaseButton.vue` | 统一按钮样式 | CTA Text #FF2F7D，Hover 180ms |
| `BaseSectionTitle.vue` | 章节标题 + 下划线 | 字体 Cinzel 32px，下划线 110px |
| `BaseContainer.vue` | 内容容器 | 响应式内边距 px-8 md:px-[140px] |

#### 功能组件 (components/features/)

| 组件名 | 职责 | 复杂度 |
|--------|------|--------|
| `MemberCard.vue` | 成员卡片（4 态支持） | ★★★★☆ |
| `AlbumCard.vue` | 专辑卡片 | ★★★☆☆ |
| `TourDateItem.vue` | 巡演日期项 | ★★☆☆☆ |
| `GalleryImage.vue` | 图集图片（懒加载） | ★★★☆☆ |
| `SocialLinks.vue` | 社交媒体链接组 | ★★☆☆☆ |

#### 区块组件 (components/sections/)

| 组件名 | 对应页面区块 |
|--------|-------------|
| `HeroSection.vue` | 首屏主视觉 |
| `LegendSection.vue` | The Legend 传说 |
| `CovenSection.vue` | The Coven 成员阵列 |
| `DiscographySection.vue` | Discography 作品 |
| `TourSection.vue` | On Tour 巡演 |
| `GallerySection.vue` | Gallery 图集 |
| `ContactSection.vue` | Contact 联系 |

### 2.3 MemberCard 组件设计（核心组件）

```vue
<!-- components/features/MemberCard.vue -->
<script setup lang="ts">
interface MemberCardProps {
  name: string
  role: string
  image: string
  isFormer?: boolean      // 是否为历史成员
  height?: number         // 历史成员自定义高度
}

const props = withDefaults(defineProps<MemberCardProps>(), {
  isFormer: false,
  height: 150
})

// 4 态设计实现
const cardClasses = computed(() => ({
  // 当前成员-默认: 彩色图 + mask #00000066，边框 #A22A55
  // 当前成员-Hover: 彩色图（无mask），边框 #FF2F7D / 3px
  // 历史成员-默认: 黑白图 + mask #00000077，文本 #9F99AD
  // 历史成员-Hover: 黑白图 + mask #00000066，文本 #B7B0C8
}))
</script>
```

### 2.4 组件通信规范

```typescript
// Props 命名规范
interface ComponentProps {
  // 基础数据
  title: string
  items: Item[]

  // 状态控制
  isLoading?: boolean
  isDisabled?: boolean

  // 样式变体
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

// Emits 命名规范
interface ComponentEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'update:modelValue', value: string): void
}
```

---

## 3. 动效系统架构

### 3.1 动效设计原则

| 动效类型 | 时长 | 缓动函数 | 应用场景 |
|----------|------|----------|----------|
| Hover | 180ms | ease | 按钮、链接、卡片悬停 |
| Press | 120ms | ease-out | 点击反馈 |
| Scroll Reveal | 400ms | cubic-bezier(0.4, 0, 0.2, 1) | 滚动进入视口 |
| Page Transition | 300ms | ease-in-out | 页面切换 |
| Ambient | 15s | ease-in-out | 背景渐变循环 |

### 3.2 CSS 变量体系

```css
:root {
  /* === 动效时间 === */
  --transition-hover: 180ms;
  --transition-press: 120ms;
  --transition-scroll: 400ms;
  --transition-page: 300ms;

  /* === 缓动函数 === */
  --ease-default: ease;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 3.3 Tailwind 扩展配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      transitionDuration: {
        'hover': '180ms',
        'press': '120ms',
        'scroll': '400ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease forwards',
        'fade-in-up': 'fadeInUp 1s ease forwards',
        'title-reveal': 'titleReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'gradient-shift': 'gradientShift 15s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        titleReveal: {
          '0%': { opacity: '0', transform: 'translateY(50px)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
      },
    },
  },
}
```

### 3.4 无障碍支持

```css
/* 尊重用户偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3.5 Composable: useScrollReveal

```typescript
// composables/useScrollReveal.ts
export function useScrollReveal(options?: IntersectionObserverInit) {
  const target = ref<HTMLElement>()
  const isVisible = ref(false)

  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    }, {
      threshold: 0.1,
      ...options,
    })

    if (target.value) observer.observe(target.value)
  })

  return { target, isVisible }
}
```

---

## 4. 响应式断点设计

### 4.1 断点策略

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '480px',      // 小屏手机
      'sm': '640px',      // 大屏手机
      'md': '768px',      // 平板竖屏
      'lg': '1024px',     // 平板横屏/小笔记本
      'xl': '1280px',     // 桌面显示器
      '2xl': '1536px',    // 大屏显示器
    },
  },
}
```

### 4.2 响应式规则

| 元素 | 移动端 (<768px) | 桌面端 (>=768px) |
|------|----------------|------------------|
| **容器内边距** | px-8 (32px) | px-[140px] |
| **成员卡片** | 2列 | 4列 |
| **章节标题** | 28-34px | 30-38px |
| **图集网格** | 2列 | 3列 |
| **专辑卡片** | 垂直布局 | 水平布局 |
| **导航** | 汉堡菜单 | 水平导航 |

### 4.3 移动端适配策略

```css
/* 移动端优先，渐进增强 */
.member-grid {
  @apply grid grid-cols-2 gap-4;
  @apply md:grid-cols-4 md:gap-4;
}

.section-padding {
  @apply px-8;
  @apply md:px-[140px];
}

/* 触摸设备优化 */
@media (hover: none) {
  .hover-effect {
    /* 触摸设备禁用 hover 效果 */
    @apply active:scale-95;
  }
}
```

### 4.4 视口适配

```vue
<!-- 响应式图片 -->
<img
  :src="imageSrc"
  :srcset="`${imageSrc}?w=400 400w, ${imageSrc}?w=800 800w, ${imageSrc}?w=1200 1200w`"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## 5. 文件目录结构规划

### 5.1 完整目录结构

```
fairy-lied_offical-website/
│
├── 📁 .nuxt/                     # Nuxt 构建输出（自动生成）
├── 📁 .output/                   # 生产构建输出
├── 📁 .spec-workflow/            # 规范工作流模板
│
├── 📁 app/                       # Nuxt 3 应用目录
│   ├── 📁 components/            # Vue 组件
│   │   ├── 📁 base/              # 基础原子组件
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseSectionTitle.vue
│   │   │   └── BaseContainer.vue
│   │   │
│   │   ├── 📁 features/          # 功能组件
│   │   │   ├── MemberCard.vue
│   │   │   ├── AlbumCard.vue
│   │   │   ├── TourDateItem.vue
│   │   │   ├── GalleryImage.vue
│   │   │   └── SocialLinks.vue
│   │   │
│   │   └── 📁 sections/          # 页面区块组件
│   │       ├── HeroSection.vue
│   │       ├── LegendSection.vue
│   │       ├── CovenSection.vue
│   │       ├── DiscographySection.vue
│   │       ├── TourSection.vue
│   │       ├── GallerySection.vue
│   │       └── ContactSection.vue
│   │
│   ├── 📁 composables/           # Vue Composables
│   │   ├── useScrollReveal.ts
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   │
│   ├── 📁 layouts/               # 布局组件
│   │   └── default.vue
│   │
│   ├── 📁 pages/                 # 页面路由
│   │   ├── index.vue             # 首页
│   │   ├── news.vue              # 新闻页
│   │   ├── tour.vue              # 巡演页
│   │   ├── music.vue             # 音乐页
│   │   └── about.vue             # 关于页
│   │
│   ├── 📁 plugins/               # Nuxt 插件
│   │   └── aos.client.ts         # Animate On Scroll
│   │
│   ├── 📁 types/                 # TypeScript 类型
│   │   ├── member.ts
│   │   ├── album.ts
│   │   └── tour.ts
│   │
│   ├── 📁 utils/                 # 工具函数
│   │   ├── formatDate.ts
│   │   └── classNames.ts
│   │
│   └── app.vue                   # 应用根组件
│
├── 📁 assets/                    # 静态资源（需构建处理）
│   └── 📁 css/
│       └── main.css              # 全局样式
│
├── 📁 public/                    # 公开静态资源
│   ├── favicon.ico
│   ├── robots.txt
│   └── 📁 images/
│       ├── hero-bg.jpg
│       └── noise.svg
│
├── 📁 server/                    # 服务端代码
│   ├── 📁 api/                   # API 路由
│   │   ├── members.get.ts
│   │   ├── albums.get.ts
│   │   └── tour-dates.get.ts
│   │
│   └── tsconfig.json
│
├── 📁 tests/                     # 测试目录
│   ├── 📁 unit/
│   ├── 📁 component/
│   └── 📁 e2e/
│
├── nuxt.config.ts                # Nuxt 配置
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
├── eslint.config.mjs             # ESLint 配置
├── package.json                  # 项目依赖
└── pnpm-lock.yaml               # pnpm 锁定文件
```

### 5.2 目录组织原则

1. **按功能组织**: 组件按职责分层（base/features/sections）
2. **就近原则**: 紧密相关的文件放在同一目录
3. **自动导入**: 利用 Nuxt 自动导入机制，简化 import
4. **类型安全**: 所有数据模型定义在 types/ 目录

---

## 6. 依赖清单

### 6.1 生产依赖

```json
{
  "dependencies": {
    "@nuxt/ui": "^2.21.0",
    "@vueuse/core": "^12.0.0",
    "@vueuse/nuxt": "^12.0.0",
    "nuxt": "^3.15.0"
  }
}
```

| 包名 | 版本 | 用途 |
|------|------|------|
| nuxt | ^3.15.0 | 核心框架 |
| @nuxt/ui | ^2.21.0 | UI 组件库 |
| @vueuse/core | ^12.0.0 | Vue 工具函数 |
| @vueuse/nuxt | ^12.0.0 | VueUse Nuxt 模块 |

### 6.2 开发依赖

```json
{
  "devDependencies": {
    "@nuxt/eslint": "^0.7.0",
    "@nuxt/test-utils": "^3.15.0",
    "@vue/test-utils": "^2.4.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "happy-dom": "^16.0.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0",
    "vitest": "^2.1.0",
    "vue-tsc": "^2.2.0"
  }
}
```

| 包名 | 版本 | 用途 |
|------|------|------|
| tailwindcss | ^3.4.17 | 原子化 CSS |
| typescript | ^5.7.0 | 类型系统 |
| vitest | ^2.1.0 | 单元测试 |
| @nuxt/test-utils | ^3.15.0 | Nuxt 测试工具 |
| eslint | ^9.17.0 | 代码规范 |

### 6.3 可选依赖（按需添加）

```json
{
  "optionalDependencies": {
    "@nuxt/image": "^1.9.0",
    "@nuxtjs/sitemap": "^7.0.0",
    "@nuxtjs/robots": "^5.0.0",
    "nuxt-gtag": "^3.0.0"
  }
}
```

| 包名 | 用途 |
|------|------|
| @nuxt/image | 图片优化和懒加载 |
| @nuxtjs/sitemap | 自动生成 sitemap.xml |
| @nuxtjs/robots | robots.txt 管理 |
| nuxt-gtag | Google Analytics 集成 |

---

## 7. 性能优化策略

### 7.1 图片优化

#### 策略矩阵

| 图片类型 | 格式 | 加载策略 | 尺寸适配 |
|----------|------|----------|----------|
| Hero 背景 | WebP/JPEG | eager + preload | 1920x1080, 768x432 |
| 成员照片 | WebP/JPEG | lazy | 400x600, 200x300 |
| 专辑封面 | WebP/JPEG | lazy | 400x400, 200x200 |
| 图集 | WebP/JPEG | lazy + 渐进加载 | 根据容器动态 |
| UI 图标 | SVG | inline | 矢量 |

#### 实现方案

```vue
<!-- 使用 @nuxt/image -->
<NuxtImg
  src="/images/hero-bg.jpg"
  format="webp"
  quality="80"
  sizes="xs:100vw md:100vw lg:100vw"
  preload
  alt="Fairy Lied Band"
/>

<!-- 懒加载 -->
<NuxtImg
  v-for="img in gallery"
  :key="img.id"
  :src="img.src"
  loading="lazy"
  placeholder
/>
```

### 7.2 代码分割

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  // 路由级别代码分割
  experimental: {
    payloadExtraction: true,
  },

  // 组件懒加载
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // 构建优化
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // Vite 优化
  vite: {
    build: {
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'ui': ['@nuxt/ui'],
          },
        },
      },
    },
  },
})
```

### 7.3 字体优化

```html
<!-- 预连接 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 字体加载策略 -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
>
```

### 7.4 缓存策略

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      // 静态资源长期缓存
      '/_nuxt/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
      // 图片缓存
      '/images/**': {
        headers: {
          'Cache-Control': 'public, max-age=86400',
        },
      },
      // API 响应缓存
      '/api/**': {
        headers: {
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      },
    },
  },
})
```

### 7.5 核心 Web 指标目标

| 指标 | 目标值 | 优化手段 |
|------|--------|----------|
| LCP | < 2.5s | 图片优化、预加载 |
| FID/INP | < 200ms | 代码分割、减少主线程阻塞 |
| CLS | < 0.1 | 图片尺寸预留、字体显示策略 |
| FCP | < 1.8s | SSR、关键 CSS 内联 |
| TTFB | < 600ms | Edge 部署、缓存优化 |

### 7.6 性能监控

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  // Web Vitals 监控
  if ('web-vitals' in window) {
    // 发送核心指标到分析服务
  }

  // 性能标记
  performance.mark('app-start')
  onMounted(() => {
    performance.mark('app-mounted')
    performance.measure('app-init', 'app-start', 'app-mounted')
  })
})
```

---

## 8. 部署架构

### 8.1 推荐部署方案

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN Layer                             │
│              (Vercel Edge / Cloudflare)                      │
├─────────────────────────────────────────────────────────────┤
│                       App Layer                              │
│              (Nuxt SSR / Nitro Server)                       │
├─────────────────────────────────────────────────────────────┤
│                      Asset Layer                             │
│              (Object Storage / Image CDN)                    │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 环境配置

```bash
# .env.development
NUXT_PUBLIC_API_BASE=/api
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# .env.production
NUXT_PUBLIC_API_BASE=https://api.fairylied.com
NUXT_PUBLIC_SITE_URL=https://fairylied.com
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 9. 附录

### 9.1 设计 Token 映射表

| Design Token | CSS 变量 | Tailwind 类 |
|--------------|----------|-------------|
| Primary Accent | `--primary-accent` | `text-primary-accent` |
| CTA Text | `--primary-accent-hover` | `text-cta` |
| Title Color | `--text-title` | `text-text-title` |
| Background | `--bg-primary` | `bg-bg-primary` |
| Former Mask | `--mask-former` | - |
| Hover Duration | `--transition-hover` | `duration-hover` |

### 9.2 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `MemberCard.vue` |
| Composable | camelCase with use | `useScrollReveal.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 类型定义 | PascalCase | `Member.ts` |
| CSS 类 | kebab-case | `member-card` |
| CSS 变量 | --kebab-case | `--primary-accent` |

### 9.3 文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 项目文档 | [CLAUDE.md](./CLAUDE.md) | 项目概览和模块索引 |
| 架构设计 | [ARCHITECTURE.md](./ARCHITECTURE.md) | 本文档 |
| 页面文档 | [pages/CLAUDE.md](./pages/CLAUDE.md) | 页面模块详情 |
| 资源文档 | [assets/CLAUDE.md](./assets/CLAUDE.md) | 样式系统详情 |

---

*文档版本: v2.0.0*
*最后更新: 2026-03-07*
*维护者: Fairy Lied Dev Team*
