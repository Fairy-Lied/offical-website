# Fairy Lied 官网 v2 - 前台页面结构设计文档

> 基于 FairyLied_ui.pen 设计稿 v2 的详细页面结构规范

---

## 1. 页面整体布局

### 1.1 布局结构

```
┌─────────────────────────────────────────────────────────────┐
│                        AppHeader                            │
│              (固定导航 + 锚点跳转 + 移动端汉堡菜单)            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      HeroSection                            │
│              (全屏背景 + 标题 + 滚动提示)                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    LegendSection                            │
│              (左图右文 + 乐队故事介绍)                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    CovenSection                             │
│         (当前成员4列 + 历史成员 + 4态交互效果)               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                  DiscographySection                         │
│              (专辑卡片 + 展开曲目 + 平台链接)                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    TourSection                              │
│              (巡演列表 + 筛选 + 购票按钮)                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   GallerySection                            │
│              (图片网格 + 灯箱浏览)                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   ContactSection                            │
│              (联系信息 + 邮箱 + 版权)                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                       AppFooter                             │
│                    (简洁页脚)                               │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 锚点导航映射

| 导航文本 | 锚点ID | 对应Section |
|---------|--------|-------------|
| The Legend | `#legend` | LegendSection |
| The Coven | `#coven` | CovenSection |
| Discography | `#discography` | DiscographySection |
| On Tour | `#tour` | TourSection |
| Gallery | `#gallery` | GallerySection |
| Contact | `#contact` | ContactSection |

---

## 2. 组件详细设计

### 2.1 AppHeader - 固定导航栏

```typescript
// 组件接口
interface AppHeaderProps {
  sections: NavItem[]
}

interface NavItem {
  id: string      // 锚点ID
  label: string   // 显示文本
  href: string    // #锚点
}

// 导航数据
const navItems: NavItem[] = [
  { id: 'legend', label: 'The Legend', href: '#legend' },
  { id: 'coven', label: 'The Coven', href: '#coven' },
  { id: 'discography', label: 'Discography', href: '#discography' },
  { id: 'tour', label: 'On Tour', href: '#tour' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]
```

**布局结构：**
```vue
<template>
  <header class="fixed top-0 left-0 right-0 z-50">
    <!-- 桌面端：水平导航 -->
    <nav class="hidden md:flex items-center justify-between px-[140px] py-4">
      <!-- Logo -->
      <a href="#" class="font-metal text-xl text-[#F2EEF8]">Fairy Lied</a>

      <!-- 导航链接 -->
      <div class="flex gap-8">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :class="['nav-link', { 'active': activeSection === item.id }]"
          @click="scrollToSection(item.id)"
        >
          {{ item.label }}
        </a>
      </div>
    </nav>

    <!-- 移动端：汉堡菜单 -->
    <div class="md:hidden">
      <button @click="toggleMenu">
        <Icon name="heroicons:bars-3" />
      </button>
      <!-- 展开的菜单 -->
      <div v-show="isMenuOpen" class="mobile-menu">
        <a v-for="item in navItems" :key="item.id" :href="item.href">
          {{ item.label }}
        </a>
      </div>
    </div>
  </header>
</template>
```

---

### 2.2 HeroSection - 首屏

```typescript
// 数据结构
interface HeroData {
  title: string           // "Fairy Lied"
  subtitle: string        // "妖精说了谎 · Gothic Metal / Symphonic Metal"
  description: string     // "A dark symphonic journey..."
  backgroundImage: string // Unsplash URL
}

// 样式规范
const heroStyles = {
  height: '100vh',        // 全屏高度
  minHeight: '700px',
  titleColor: '#FF6A95',  // 粉色标题
  accentColor: '#FF174F', // 装饰线
  subtitleColor: '#D6CCEA',
  descriptionColor: '#B7ABC8',
}
```

**布局结构：**
```vue
<template>
  <section id="hero" class="relative h-screen min-h-[700px]">
    <!-- 背景层 -->
    <div class="absolute inset-0">
      <img :src="backgroundImage" class="w-full h-full object-cover" />
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#060609] via-transparent to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-r from-[#060609]/60 to-transparent" />
    </div>

    <!-- 内容层 - 左下角 -->
    <div class="relative z-10 h-full flex flex-col justify-end pb-28 px-8 md:px-28">
      <h1 class="font-metal text-6xl md:text-[86px] font-bold text-[#FF6A95]">
        {{ title }}
      </h1>
      <div class="w-32 h-0.5 bg-[#FF174F] my-6" />
      <p class="text-lg md:text-[22px] text-[#D6CCEA] font-medium">
        {{ subtitle }}
      </p>
      <p class="text-sm md:text-base text-[#B7ABC8] mt-3">
        {{ description }}
      </p>
    </div>

    <!-- 滚动提示 -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <ScrollIndicator />
    </div>
  </section>
</template>
```

---

### 2.3 LegendSection - 传说区块

```typescript
// 数据结构
interface LegendData {
  title: string       // "The Legend 传说"
  image: string       // 乐队图片
  story: string[]     // 故事段落数组
}

// 示例数据
const legendData: LegendData = {
  title: 'The Legend 传说',
  image: 'https://images.unsplash.com/...',
  story: [
    '妖精说了谎成立于夜色最深处。',
    '我们以哥特金属的冷峻骨架，叠加交响金属的史诗织体，',
    '在每一首歌中讲述关于谎言、命运与自我救赎的故事。',
  ]
}
```

**布局结构：**
```vue
<template>
  <section id="legend" class="py-[72px] bg-[#07070A]">
    <div class="px-8 md:px-[140px]">
      <!-- 章节标题 -->
      <SectionTitle title="The Legend 传说" />

      <!-- 内容：左图右文 -->
      <div class="flex flex-col md:flex-row gap-6 mt-8">
        <!-- 左侧图片 -->
        <div class="w-full md:w-[320px] flex-shrink-0">
          <div class="aspect-[4/5] rounded overflow-hidden">
            <img :src="image" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- 右侧文字 -->
        <div class="flex-1 flex items-center">
          <p class="text-[15px] text-[#C5BDD4] leading-[1.8]">
            <span v-for="(paragraph, idx) in story" :key="idx">
              {{ paragraph }}<br v-if="idx < story.length - 1" /><br v-if="idx < story.length - 1" />
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
```

---

### 2.4 CovenSection - 成员阵列

```typescript
// 成员数据结构
interface Member {
  name: string       // 艺名
  role: string       // 担当（Vocal/Guitar/Drum等）
  image: string      // 照片URL
  isFormer?: boolean // 是否为历史成员
  height?: number    // 历史成员自定义高度
}

// 当前成员
const currentMembers: Member[] = [
  { name: '妖精', role: 'Vocal', image: '...' },
  { name: '谎言', role: 'Guitar', image: '...' },
  { name: '梦魇', role: 'Drum', image: '...' },
  { name: '深渊', role: 'Bass', image: '...' },
]

// 历史成员
const formerMembers: Member[] = [
  { name: '旧梦', role: 'Former Guitar', image: '...', height: 130, isFormer: true },
  { name: '夜鸦', role: 'Former Bass', image: '...', height: 152, isFormer: true },
  { name: '祈祷者', role: 'Former Keys', image: '...', height: 130, isFormer: true },
  { name: '迷雾', role: 'Former Violin', image: '...', height: 130, isFormer: true },
]
```

**布局结构：**
```vue
<template>
  <section id="coven" class="py-20 bg-[#07070C]">
    <div class="px-8 md:px-[120px]">
      <!-- 章节标题 -->
      <SectionTitle title="The Coven 成员阵列" subtitle="Current Lineup" />

      <!-- 当前成员 - 4列网格 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <MemberCard
          v-for="member in currentMembers"
          :key="member.name"
          v-bind="member"
          :isFormer="false"
        />
      </div>

      <!-- 历史成员标题 -->
      <h3 class="text-[#D8A1BA] text-sm mb-4">Former Members</h3>

      <!-- 历史成员 - 不同高度 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MemberCard
          v-for="member in formerMembers"
          :key="member.name"
          v-bind="member"
          :isFormer="true"
        />
      </div>
    </div>
  </section>
</template>
```

---

### 2.5 MemberCard - 成员卡片（核心组件）

```typescript
// 组件 Props
interface MemberCardProps {
  name: string
  role: string
  image: string
  isFormer: boolean
  height?: number
}

// 4态样式映射
const memberCardStyles = {
  // 当前成员 - 默认
  currentDefault: {
    image: 'object-cover',           // 彩色
    mask: 'bg-black/40',             // #00000066
    border: 'border-[#A22A55]',      // 1px
    textRole: 'text-[#D6CCEA]',
    textName: 'text-[#F2EEF8]',
  },
  // 当前成员 - Hover
  currentHover: {
    image: 'object-cover scale-105', // 彩色 + 放大
    mask: 'bg-transparent',          // 无遮罩
    border: 'border-[#FF2F7D] border-[3px]', // 3px
    textRole: 'text-[#D6CCEA]',
    textName: 'text-[#F2EEF8]',
  },
  // 历史成员 - 默认
  formerDefault: {
    image: 'object-cover grayscale', // 黑白
    mask: 'bg-black/[0.47]',         // #00000077
    border: 'border-white/20',
    textRole: 'text-[#9F99AD]',
    textName: 'text-[#9F99AD]',
  },
  // 历史成员 - Hover
  formerHover: {
    image: 'object-cover grayscale',
    mask: 'bg-black/40',             // #00000066
    border: 'border-white/30',
    textRole: 'text-[#B7B0C8]',
    textName: 'text-[#B7B0C8]',
  },
}
```

**完整实现：**
```vue
<template>
  <div
    :class="[
      'group relative overflow-hidden rounded-xl cursor-pointer',
      'transition-all duration-180',
      isFormer ? '' : 'hover:scale-[1.02]'
    ]"
    :style="{ height: height ? `${height}px` : '150px' }"
    :aria-label="isFormer ? `Former Member - ${role} - ${name}` : `Current Member - ${role} - ${name}`"
    tabindex="0"
  >
    <!-- 图片 -->
    <img
      :src="image"
      :alt="name"
      :class="[
        'w-full h-full transition-all duration-180',
        isFormer ? 'grayscale' : 'group-hover:scale-105'
      ]"
    />

    <!-- 遮罩层 - 4态 -->
    <div
      :class="[
        'absolute inset-0 transition-colors duration-180',
        isFormer
          ? 'bg-black/[0.47] group-hover:bg-black/40'  // 历史成员
          : 'bg-black/40 group-hover:bg-transparent'   // 当前成员
      ]"
    />

    <!-- 边框 - 4态 -->
    <div
      v-if="!isFormer"
      :class="[
        'absolute inset-0 rounded-xl transition-all duration-180',
        'border border-[#A22A55]',
        'group-hover:border-[#FF2F7D] group-hover:border-[3px]'
      ]"
    />

    <!-- FORMER 标签 -->
    <div
      v-if="isFormer"
      class="absolute top-2 right-2 px-2 py-1 bg-[#2A1118] rounded text-[10px] font-bold text-[#FF9BB8]"
    >
      FORMER
    </div>

    <!-- 信息 -->
    <div class="absolute left-0 right-0 p-3 bottom-0 z-10">
      <p :class="[
        'text-xs transition-colors duration-180',
        isFormer
          ? 'text-[#9F99AD] group-hover:text-[#B7B0C8]'
          : 'text-[#D6CCEA]'
      ]">
        {{ role }}
      </p>
      <h3 :class="[
        'text-sm font-bold transition-colors duration-180',
        isFormer
          ? 'text-[#9F99AD] group-hover:text-[#B7B0C8]'
          : 'text-[#F2EEF8]'
      ]">
        {{ name }}
      </h3>
    </div>
  </div>
</template>
```

---

### 2.6 DiscographySection - 作品区块

```typescript
// 专辑数据结构
interface Album {
  title: string       // 专辑名
  year: string        // 年份
  cover: string       // 封面URL
  tracks?: string[]   // 曲目列表
  streamingLinks?: StreamingLink[]
}

interface StreamingLink {
  platform: 'spotify' | 'netease' | 'apple'
  url: string
  icon: string
}

// 示例数据
const albums: Album[] = [
  {
    title: 'Shadows & Vows',
    year: '2026',
    cover: '...',
    tracks: ['Track 1', 'Track 2', 'Track 3'],
    streamingLinks: [
      { platform: 'spotify', url: '#', icon: 'simple-icons:spotify' },
      { platform: 'netease', url: '#', icon: 'simple-icons:neteasecloudmusic' },
    ]
  },
  {
    title: 'Cathedral of Ashes',
    year: '2024',
    cover: '...',
    tracks: ['Track 1', 'Track 2', 'Track 3'],
  },
]
```

**布局结构：**
```vue
<template>
  <section id="discography" class="py-[72px] bg-[#07070A]">
    <div class="px-8 md:px-[140px]">
      <SectionTitle title="Discography 作品" />

      <!-- 专辑列表 -->
      <div class="space-y-4 mt-8">
        <AlbumCard
          v-for="album in albums"
          :key="album.title"
          :album="album"
        />
      </div>
    </div>
  </section>
</template>
```

---

### 2.7 AlbumCard - 专辑卡片

```vue
<template>
  <div class="flex flex-col md:flex-row gap-[18px] p-[14px] bg-[#1F0F17] rounded">
    <!-- 封面 -->
    <div class="w-full md:w-[180px] h-[180px] flex-shrink-0 rounded overflow-hidden">
      <img :src="album.cover" :alt="album.title" class="w-full h-full object-cover" />
    </div>

    <!-- 信息 -->
    <div class="flex-1 flex flex-col justify-center">
      <h3 class="text-[#CAC1DB] text-lg font-medium">
        {{ album.title }} ({{ album.year }})
      </h3>

      <!-- 展开/收起的曲目列表 -->
      <div v-if="expanded" class="mt-4">
        <ul class="text-[#9F99AD] text-sm space-y-1">
          <li v-for="(track, idx) in album.tracks" :key="idx">
            {{ idx + 1 }}. {{ track }}
          </li>
        </ul>
      </div>

      <!-- 平台链接 -->
      <div class="flex gap-4 mt-4">
        <a
          v-for="link in album.streamingLinks"
          :key="link.platform"
          :href="link.url"
          class="text-[#FF2F7D] hover:text-[#FF6A95] transition-colors duration-180"
        >
          <Icon :name="link.icon" class="w-5 h-5" />
        </a>
      </div>

      <!-- 展开按钮 -->
      <button
        @click="expanded = !expanded"
        class="mt-4 text-[#9F99AD] text-sm hover:text-[#D6CCEA] transition-colors"
      >
        {{ expanded ? '收起' : '查看曲目' }}
      </button>
    </div>
  </div>
</template>
```

---

### 2.8 TourSection - 巡演区块

```typescript
// 巡演数据结构
interface TourDate {
  date: string      // 日期 2026.05.10
  city: string      // 城市
  venue: string     // 场地
  status: 'available' | 'soldout' | 'upcoming'
  ticketUrl?: string
}

const tourDates: TourDate[] = [
  { date: '2026.05.10', city: '上海', venue: 'MAO Livehouse', status: 'available', ticketUrl: '#' },
  { date: '2026.05.18', city: '北京', venue: '疆进酒', status: 'available', ticketUrl: '#' },
  { date: '2026.06.01', city: '广州', venue: '声音共和', status: 'soldout' },
]

// 筛选选项
const filters = ['全部', '华东', '华北', '华南']
```

**布局结构：**
```vue
<template>
  <section id="tour" class="py-[72px] bg-[#060609]">
    <div class="px-8 md:px-[140px]">
      <SectionTitle title="On Tour 巡演" />

      <!-- 筛选器 -->
      <div class="flex gap-4 mt-6 mb-4">
        <button
          v-for="filter in filters"
          :key="filter"
          :class="['filter-btn', { active: currentFilter === filter }]"
          @click="currentFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <!-- 巡演列表 -->
      <div class="space-y-3">
        <TourRow
          v-for="show in filteredTourDates"
          :key="show.date"
          :show="show"
        />
      </div>
    </div>
  </section>
</template>
```

---

### 2.9 TourRow - 巡演日期行

```vue
<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between px-[14px] py-[10px] bg-[#241019] rounded">
    <!-- 左侧信息 -->
    <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
      <span class="text-[#D4CBDD] text-[13px] w-[100px]">{{ show.date }}</span>
      <span class="text-[#D4CBDD] text-[13px] w-[60px]">{{ show.city }}</span>
      <span class="text-[#9F99AD] text-[13px]">{{ show.venue }}</span>
    </div>

    <!-- 右侧购票按钮 -->
    <a
      v-if="show.status === 'available' && show.ticketUrl"
      :href="show.ticketUrl"
      class="mt-2 md:mt-0 text-[#FF2F7D] text-[13px] font-bold hover:text-[#FF6A95] transition-colors duration-180"
    >
      TICKETS →
    </a>
    <span
      v-else-if="show.status === 'soldout'"
      class="mt-2 md:mt-0 text-[#9F99AD] text-[13px]"
    >
      售罄
    </span>
  </div>
</template>
```

---

### 2.10 GallerySection - 图集区块

```typescript
// 图片数据结构
interface GalleryImage {
  id: string
  url: string
  alt: string
  width?: number
  height?: number
}

const galleryImages: GalleryImage[] = [
  { id: '1', url: '...', alt: '演出照片1' },
  { id: '2', url: '...', alt: '演出照片2' },
  { id: '3', url: '...', alt: '演出照片3' },
  // ...
]
```

**布局结构：**
```vue
<template>
  <section id="gallery" class="py-[72px] bg-[#07070A]">
    <div class="px-8 md:px-[140px]">
      <SectionTitle title="Gallery 图集" />

      <!-- 图片网格 - 3列(桌面) / 2列(移动) -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5 mt-8">
        <div
          v-for="(image, index) in galleryImages"
          :key="image.id"
          class="group relative h-[140px] overflow-hidden rounded cursor-pointer"
          @click="openLightbox(index)"
        >
          <img
            :src="image.url"
            :alt="image.alt"
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-180 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-180" />
        </div>
      </div>
    </div>

    <!-- 灯箱组件 -->
    <ImageLightbox
      v-model="lightboxOpen"
      :images="galleryImages"
      :initial-index="lightboxIndex"
    />
  </section>
</template>
```

---

### 2.11 ContactSection - 联系区块

```typescript
// 联系数据
const contactInfo = {
  management: 'management@fairylied.com',
  booking: 'booking@fairylied.com',
  socials: [
    { platform: 'weibo', url: '#', icon: 'simple-icons:sinaweibo' },
    { platform: 'bilibili', url: '#', icon: 'simple-icons:bilibili' },
    { platform: 'netease', url: '#', icon: 'simple-icons:neteasecloudmusic' },
  ]
}
```

**布局结构：**
```vue
<template>
  <section id="contact" class="py-20 bg-[#060609]">
    <div class="px-8 md:px-[140px]">
      <SectionTitle title="Contact 联系" />

      <div class="mt-8 space-y-2 text-[#BEB3CF] text-sm leading-[1.8]">
        <p>
          Management:
          <a :href="`mailto:${contactInfo.management}`" class="hover:text-[#FF174F] transition-colors">
            {{ contactInfo.management }}
          </a>
        </p>
        <p>
          Booking:
          <a :href="`mailto:${contactInfo.booking}`" class="hover:text-[#FF174F] transition-colors">
            {{ contactInfo.booking }}
          </a>
        </p>

        <!-- 社交链接 -->
        <div class="flex gap-4 mt-6">
          <a
            v-for="social in contactInfo.socials"
            :key="social.platform"
            :href="social.url"
            class="text-[#9F99AD] hover:text-[#FF174F] transition-colors"
          >
            <Icon :name="social.icon" class="w-5 h-5" />
          </a>
        </div>

        <p class="text-[#9F95B2] text-xs mt-8">© 2026 Fairy Lied</p>
      </div>
    </div>
  </section>
</template>
```

---

### 2.12 SectionTitle - 章节标题（可复用组件）

```vue
<template>
  <div class="section-title">
    <h2 class="font-metal text-[28px] md:text-[38px] font-bold text-[#F2EEF8] mb-3">
      {{ title }}
    </h2>
    <div class="w-[110px] h-0.5 bg-[#FF174F]" />
    <p v-if="subtitle" class="text-sm text-[#AFA4C4] mt-4">
      {{ subtitle }}
    </p>
  </div>
</template>
```

---

## 3. 数据结构汇总

### 3.1 完整数据模型

```typescript
// types/index.ts

export interface Member {
  name: string
  role: string
  image: string
  isFormer?: boolean
  height?: number
}

export interface Album {
  title: string
  year: string
  cover: string
  tracks?: string[]
  streamingLinks?: StreamingLink[]
}

export interface StreamingLink {
  platform: 'spotify' | 'netease' | 'apple'
  url: string
  icon: string
}

export interface TourDate {
  date: string
  city: string
  venue: string
  status: 'available' | 'soldout' | 'upcoming'
  ticketUrl?: string
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
}

export interface NavItem {
  id: string
  label: string
  href: string
}

export interface ContactInfo {
  management: string
  booking: string
  socials: SocialLink[]
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}
```

---

## 4. 页面级组件（pages/index.vue）

### 4.1 完整结构

```vue
<script setup lang="ts">
// ===== 类型导入 =====
import type { Member, Album, TourDate, GalleryImage, NavItem } from '~/types'

// ===== 数据定义 =====
const navItems: NavItem[] = [
  { id: 'legend', label: 'The Legend', href: '#legend' },
  { id: 'coven', label: 'The Coven', href: '#coven' },
  { id: 'discography', label: 'Discography', href: '#discography' },
  { id: 'tour', label: 'On Tour', href: '#tour' },
  { id: 'gallery', label: 'Gallery', href: '#gallery' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

const currentMembers: Member[] = [
  { name: '妖精', role: 'Vocal', image: '...' },
  { name: '谎言', role: 'Guitar', image: '...' },
  { name: '梦魇', role: 'Drum', image: '...' },
  { name: '深渊', role: 'Bass', image: '...' },
]

const formerMembers: Member[] = [
  { name: '旧梦', role: 'Former Guitar', image: '...', height: 130, isFormer: true },
  { name: '夜鸦', role: 'Former Bass', image: '...', height: 152, isFormer: true },
  { name: '祈祷者', role: 'Former Keys', image: '...', height: 130, isFormer: true },
  { name: '迷雾', role: 'Former Violin', image: '...', height: 130, isFormer: true },
]

const albums: Album[] = [
  { title: 'Shadows & Vows', year: '2026', cover: '...' },
  { title: 'Cathedral of Ashes', year: '2024', cover: '...' },
]

const tourDates: TourDate[] = [
  { date: '2026.05.10', city: '上海', venue: 'MAO Livehouse', status: 'available' },
  { date: '2026.05.18', city: '北京', venue: '疆进酒', status: 'available' },
]

const galleryImages: GalleryImage[] = [
  { id: '1', url: '...', alt: '演出照片1' },
  { id: '2', url: '...', alt: '演出照片2' },
  { id: '3', url: '...', alt: '演出照片3' },
]

// ===== SEO =====
useHead({
  title: 'Fairy Lied 妖精说了谎 | Gothic Metal Band',
  meta: [
    { name: 'description', content: 'Fairy Lied 妖精说了谎 - 融合哥特金属与交响金属的黑暗之旅。' },
  ],
})

// ===== 滚动监听 =====
const { activeSection } = useScrollSpy(navItems.map(n => n.id))
</script>

<template>
  <div class="bg-[#060609] min-h-screen">
    <!-- 导航 -->
    <AppHeader
      :nav-items="navItems"
      :active-section="activeSection"
    />

    <!-- 各区块 -->
    <HeroSection />
    <LegendSection />
    <CovenSection
      :current-members="currentMembers"
      :former-members="formerMembers"
    />
    <DiscographySection :albums="albums" />
    <TourSection :tour-dates="tourDates" />
    <GallerySection :images="galleryImages" />
    <ContactSection />
  </div>
</template>
```

---

## 5. 响应式断点实现

### 5.1 Tailwind 断点使用

| 断点 | Tailwind 前缀 | 使用场景 |
|------|---------------|----------|
| < 640px | 默认 | 移动端基础样式 |
| >= 640px | `sm:` | 大屏手机 |
| >= 768px | `md:` | 平板、导航切换 |
| >= 1024px | `lg:` | 小桌面 |
| >= 1280px | `xl:` | 标准桌面 |

### 5.2 关键响应式类

```css
/* 容器内边距 */
.px-8.md:px-[140px]

/* 成员网格 */
.grid-cols-2.md:grid-cols-4

/* 专辑卡片布局 */
.flex-col.md:flex-row

/* 巡演行布局 */
.flex-col.md:flex-row.md:items-center

/* 图集网格 */
.grid-cols-2.md:grid-cols-3

/* 导航显示 */
.hidden.md:flex / .md:hidden
```

---

*文档版本: v1.0*
*更新日期: 2026-03-07*
*维护者: Fairy Lied Dev Team*
