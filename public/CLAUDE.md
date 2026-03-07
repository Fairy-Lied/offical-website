[根目录](../../CLAUDE.md) > **public**

---

# public 模块

> 公开静态资源模块，文件将被直接复制到输出目录的根路径。

## 模块职责

- 存储不需要构建处理的静态文件
- 提供可通过根路径直接访问的资源
- 包含 favicon、robots.txt、图片等资源

## 文件结构

```
public/
├── favicon.ico           # 网站图标
├── robots.txt            # 搜索引擎爬虫配置
└── images/
    ├── hero-bg.svg       # 首页 Hero 区域背景
    └── noise.svg         # 噪点纹理（用于背景叠加）
```

## 文件说明

### favicon.ico
网站标签页图标，标准 ICO 格式。

### robots.txt
搜索引擎爬虫配置：
```
User-Agent: *
Disallow:
```
允许所有搜索引擎爬虫访问所有页面。

### images/hero-bg.svg
首页 Hero 区域的背景图片。

**内容**:
- 尺寸: 1920x1080
- 径向渐变: 从中心红色调向外渐变到黑色
- 噪点滤镜叠加

**代码结构**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <defs>
    <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:rgb(30,0,0)" />
      <stop offset="100%" style="stop-color:rgb(0,0,0)" />
    </radialGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
    </filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#grad1)"/>
  <rect width="1920" height="1080" fill="#000" opacity="0.5" filter="url(#noise)"/>
</svg>
```

### images/noise.svg
噪点纹理，用于背景叠加效果。

**用途**:
- 在 `app.vue` 中作为全局背景叠加
- 在 `pages/index.vue` 中多个区块使用
- 创建复古/颗粒质感

**代码结构**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
  </filter>
  <rect width="500" height="500" filter="url(#noise)" opacity="0.5"/>
</svg>
```

**使用示例**:
```vue
<template>
  <div class="bg-[url('/images/noise.svg')] opacity-5"></div>
</template>
```

---

## 访问方式

public 目录下的文件可直接通过根路径访问：

| 文件路径 | 访问 URL |
|----------|----------|
| `public/favicon.ico` | `/favicon.ico` |
| `public/robots.txt` | `/robots.txt` |
| `public/images/hero-bg.svg` | `/images/hero-bg.svg` |
| `public/images/noise.svg` | `/images/noise.svg` |

---

## 添加新资源

1. 将文件放入 `public/` 目录（保持目录结构）
2. 通过绝对路径引用：`/path/to/file.ext`

**注意**:
- 不要使用 `~/` 或 `@/` 别名
- 不要放入需要构建处理的文件（如 SCSS、TypeScript）
- 大文件建议压缩后使用

---

## 与 assets 目录的区别

| 特性 | public | assets |
|------|--------|--------|
| 构建处理 | 否（直接复制） | 是（可能被处理/内联） |
| 访问方式 | 绝对路径 `/` | 通过导入或 `~/assets/` |
| 适用场景 | favicon、robots.txt、大图片 | CSS、字体、需要构建的资源 |
| URL 哈希 | 无 | 有（用于缓存清除） |

---

## 常见问题 (FAQ)

### Q: 图片应该放在 public 还是 assets？
- **public**: 大图片、不经常变动的图片、需要直接 URL 访问的图片
- **assets**: 小图标、CSS 中引用的图片、需要构建优化的图片

### Q: 如何引用 public 中的图片？
```vue
<!-- 正确 -->
<img src="/images/hero-bg.svg" />

<!-- 错误 -->
<img src="~/public/images/hero-bg.svg" />
```

### Q: robots.txt 如何配置？
当前配置允许所有爬虫访问所有页面。如需限制：
```
User-Agent: *
Disallow: /private/
Disallow: /admin/
```

---

## 相关文件清单

```
public/
├── favicon.ico
├── robots.txt
└── images/
    ├── hero-bg.svg
    └── noise.svg
```

---

## 变更记录 (Changelog)

### 2026-03-07 - 模块文档初始化
- 创建 public 模块 CLAUDE.md 文档
- 记录所有静态资源文件及其用途
