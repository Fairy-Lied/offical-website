[根目录](../../CLAUDE.md) > **pages**

---

# pages 模块

> 页面路由组件模块，基于 Nuxt 3 的文件系统自动生成路由。

## 模块职责

- 定义网站的所有页面路由
- 实现各页面的 UI 和交互逻辑
- 管理页面级别的数据（目前为静态数据）

## 入口与路由

Nuxt 3 自动根据文件系统生成路由：

| 文件 | 路由路径 | 页面描述 |
|------|----------|----------|
| `index.vue` | `/` | 首页 - 乐队主展示页面 |
| `news.vue` | `/news` | 新闻动态页 |
| `tour.vue` | `/tour` | 巡演日程页 |
| `music.vue` | `/music` | 音乐作品页 |
| `about.vue` | `/about` | 关于我们页 |

## 页面详细说明

### index.vue - 首页

**职责**: 网站主入口，展示乐队形象、成员、新闻、音乐、视频和评价。

**主要区块**:
1. **Hero 区域** - 全屏背景、乐队 Logo、标语、CTA 按钮
2. **乐队成员** - 4 位成员卡片展示（月影、星辰、雷音、风华）
3. **最新动态** - 3 条新闻预览
4. **精选音乐** - 3 张专辑/单曲展示
5. **视频展示** - 3 个视频缩略图
6. **粉丝评价** - 3 条评价展示
7. **邮件订阅** - 订阅表单和社交媒体链接

**数据定义**:
```typescript
// 乐队成员
const bandMembers = [
  { name: '月影', role: '主唱/吉他手', image: '...', description: '...', socialLinks: {...} },
  // ...
]

// 新闻
const news = [
  { title: '...', date: '...', content: '...', image: '...', tags: [...] },
  // ...
]

// 精选音乐
const featuredMusic = [
  { title: '...', type: '专辑/单曲', releaseDate: '...', description: '...', image: '...' },
  // ...
]

// 视频
const videos = [
  { title: '...', thumbnail: '...', url: '#', duration: '...' },
  // ...
]

// 评价
const testimonials = [
  { content: '...', author: '...', rating: 5 },
  // ...
]
```

**特殊样式**:
- 金属质感文字 `.font-metal`
- 渐变文字 `.gradient-text`
- 金属按钮 `.metal-button`、`.metal-button-outline`
- 标题动画 `.animate-title`
- 淡入动画 `.animate-fade-in-up`

---

### news.vue - 新闻动态

**职责**: 展示乐队新闻列表。

**数据结构**:
```typescript
const news = [
  {
    id: 1,
    title: "新专辑制作中",
    date: "2024-02-15",
    image: "/images/news-1.svg",
    summary: "...",
    content: "...",
  },
  // ...
];
```

---

### tour.vue - 巡演日程

**职责**: 展示乐队演出日程和购票状态。

**数据结构**:
```typescript
const tourDates = [
  {
    date: "2024-04-15",
    city: "北京",
    venue: "MAO Livehouse",
    status: "售罄", // 或 "售票中"、"即将开售"
  },
  // ...
];
```

**UI 特点**:
- 玻璃效果卡片 `glass-effect`
- 状态按钮颜色根据 `status` 变化
- 售罄状态按钮禁用

---

### music.vue - 音乐作品

**职责**: 展示乐队专辑和单曲。

**数据结构**:
```typescript
const albums = [
  {
    title: "永恒的摇篮曲",
    year: "2023",
    cover: "/images/album-1.svg",
    tracks: [
      "序曲：月光下的低语",
      "黑玫瑰的哀歌",
      // ...
    ],
  },
  // ...
];
```

---

### about.vue - 关于我们

**职责**: 介绍乐队历史和成员。

**数据结构**:
```typescript
const members = [
  {
    name: "林雨",
    role: "主唱",
    instrument: "Vocals",
    image: "/images/member-1.svg",
    description: "...",
  },
  // ...
];
```

---

## 关键依赖与配置

### 使用的 Nuxt UI 组件
- `<UContainer>` - 内容容器
- `<UButton>` - 按钮
- `<UInput>` - 输入框（未来使用）

### 图标
- 使用 Iconify Simple Icons：`i-simple-icons-*`
- 使用 Heroicons：`i-heroicons-*`

### 样式依赖
- 全局样式：`~/assets/css/main.css`
- Tailwind CSS 工具类

---

## 数据模型

当前所有数据为硬编码的静态数据，存储在各自页面的 `<script setup>` 中。

未来如需后端集成，建议：
1. 将数据移至 `server/api/` 目录的 API 端点
2. 使用 `useFetch` 或 `useAsyncData` 获取数据
3. 考虑使用 Nuxt Content 管理内容

---

## 测试与质量

### 当前状态
- 暂无自动化测试

### 建议测试
- 页面渲染测试
- 导航链接测试
- 响应式布局测试

---

## 常见问题 (FAQ)

### Q: 如何修改页面内容？
直接编辑对应 `.vue` 文件中的数据数组即可。

### Q: 如何添加新页面？
在 `pages/` 目录下创建新的 `.vue` 文件，Nuxt 会自动生成路由。

### Q: 如何修改全局导航？
导航在 `app.vue` 中定义，不在 pages 模块中。

---

## 相关文件清单

```
pages/
├── index.vue          # 首页（约 828 行）
├── news.vue           # 新闻页（约 90 行）
├── tour.vue           # 巡演页（约 66 行）
├── music.vue          # 音乐页（约 76 行）
└── about.vue          # 关于页（约 89 行）
```

---

## 变更记录 (Changelog)

### 2026-03-07 - 模块文档初始化
- 创建 pages 模块 CLAUDE.md 文档
- 梳理所有页面文件和路由关系
- 记录数据结构和关键依赖
