[根目录](../CLAUDE.md) > **public**

---

# public 模块

> 公开静态资源模块，文件将被直接复制到输出目录的根路径，支持用户上传的文件。

## 模块职责

- 存储不需要构建处理的静态文件
- 提供可通过根路径直接访问的资源
- 管理用户上传的文件（图片、视频等）
- 包含 favicon、robots.txt、图片等资源

## 文件结构

```
public/
├── favicon.ico               # 网站图标
├── robots.txt                # 搜索引擎爬虫配置
├── images/                   # 默认图片资源
│   ├── hero-bg.svg           # 首页 Hero 区域背景
│   └── noise.svg             # 噪点纹理（用于背景叠加）
└── uploads/                  # 用户上传文件目录
    ├── 1775552016625-shareLogo.jpg  # 上传的图片
    ├── 1775556273117-vj_1-2.mp4     # 上传的视频
    ├── 1775556300052-legend.png     # 传说背景图
    ├── 1775556316728-vocal.jpeg     # 成员头像
    ├── 1775556324687-keyboard.jpeg  # 成员头像
    ├── 1775556332744-13.jpeg        # 成员头像
    ├── 1775556341074-bass.jpeg      # 成员头像
    └── 1775556348160-drum.jpeg      # 成员头像
```

---

## 文件详细说明

### favicon.ico
网站标签页图标，标准 ICO 格式。

### robots.txt
搜索引擎爬虫配置：
```
User-Agent: *
Disallow:
```
允许所有搜索引擎爬虫访问所有页面。

---

## 静态图片资源

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

## 上传文件管理

### uploads/ 目录

**用途**: 存储通过管理后台上传的文件。

**文件命名规范**:
```
[时间戳]-[原始文件名].[扩展名]
```

**示例**:
- `1775552016625-shareLogo.jpg`
- `1775556273117-vj_1-2.mp4`

### 支持的文件类型

#### 图片格式
- JPG/JPEG
- PNG
- GIF
- WebP

#### 视频格式
- MP4
- WebM

### 文件访问

所有上传文件可通过根路径直接访问：

```
https://your-domain.com/uploads/[filename]
```

**示例**:
```html
<img src="/uploads/1775556316728-vocal.jpeg" alt="成员头像" />
<video src="/uploads/1775556273117-vj_1-2.mp4" controls></video>
```

---

## 访问方式

public 目录下的文件可直接通过根路径访问：

| 文件路径 | 访问 URL | 用途 |
|----------|----------|------|
| `public/favicon.ico` | `/favicon.ico` | 网站图标 |
| `public/robots.txt` | `/robots.txt` | 爬虫配置 |
| `public/images/hero-bg.svg` | `/images/hero-bg.svg` | Hero 背景 |
| `public/images/noise.svg` | `/images/noise.svg` | 噪点纹理 |
| `public/uploads/*` | `/uploads/*` | 用户上传文件 |

---

## 添加新资源

### 静态资源
1. 将文件放入 `public/` 目录（保持目录结构）
2. 通过绝对路径引用：`/path/to/file.ext`

### 用户上传文件
通过管理后台的上传功能自动处理：

```typescript
// 上传 API
const formData = new FormData()
formData.append('file', file)

const { url } = await $fetch('/api/upload', {
  method: 'POST',
  body: formData
})

// url: "/uploads/1775552016625-filename.jpg"
```

---

## 文件管理最佳实践

### 文件命名
- 使用时间戳前缀避免重名
- 保留原始文件名便于识别
- 使用小写字母和连字符

### 文件大小
- 图片建议压缩后上传
- 视频文件建议使用外部托管（如 CDN）
- 定期清理无用文件

### 安全考虑
- 验证上传文件类型
- 限制文件大小
- 扫描恶意文件
- 设置适当的访问权限

---

## 与 assets 目录的区别

| 特性 | public | assets |
|------|--------|--------|
| 构建处理 | 否（直接复制） | 是（可能被处理/内联） |
| 访问方式 | 绝对路径 `/` | 通过导入或 `~/assets/` |
| 适用场景 | favicon、robots.txt、大图片、上传文件 | CSS、字体、需要构建的资源 |
| URL 哈希 | 无 | 有（用于缓存清除） |
| 文件管理 | 用户可上传 | 仅开发时添加 |

---

## 常见问题 (FAQ)

### Q: 图片应该放在 public 还是 assets？
- **public**: 大图片、不经常变动的图片、需要直接 URL 访问的图片、用户上传的图片
- **assets**: 小图标、CSS 中引用的图片、需要构建优化的图片

### Q: 如何引用 public 中的图片？
```vue
<!-- 正确 -->
<img src="/images/hero-bg.svg" />
<img src="/uploads/1775556316728-vocal.jpeg" />

<!-- 错误 -->
<img src="~/public/images/hero-bg.svg" />
```

### Q: 如何管理上传文件？
- 通过管理后台上传
- 定期备份重要文件
- 监控磁盘空间使用

### Q: 上传文件的大小限制？
当前实现未设置硬性限制，但建议：
- 图片：< 5MB
- 视频：< 100MB（建议使用外部托管）

---

## 相关文件清单

```
public/
├── favicon.ico               # 网站图标
├── robots.txt                # 爬虫配置
├── images/
│   ├── hero-bg.svg           # Hero 背景（1920x1080）
│   └── noise.svg             # 噪点纹理（500x500）
└── uploads/
    ├── 1775552016625-shareLogo.jpg  # 上传图片
    ├── 1775556273117-vj_1-2.mp4     # 上传视频
    ├── 1775556300052-legend.png     # 上传图片
    ├── 1775556316728-vocal.jpeg     # 上传图片
    ├── 1775556324687-keyboard.jpeg  # 上传图片
    ├── 1775556332744-13.jpeg        # 上传图片
    ├── 1775556341074-bass.jpeg      # 上传图片
    └── 1775556348160-drum.jpeg      # 上传图片
```

---

## 变更记录 (Changelog)

### 2026-04-08 - 模块文档更新
- 更新 public 模块文档，添加 uploads 目录说明
- 添加用户上传文件管理说明
- 添加文件类型和访问方式文档
- 添加最佳实践和安全建议

### 2026-03-07 - 模块文档初始化
- 创建 public 模块 CLAUDE.md 文档
- 记录所有静态资源文件及其用途
