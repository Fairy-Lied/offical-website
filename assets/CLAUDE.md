[根目录](../CLAUDE.md) > **assets**

---

# assets 模块

> 静态资源模块，包含全局样式文件和CSS配置。

## 模块职责

- 管理全局 CSS 样式
- 定义 CSS 变量（主题色）
- 提供通用动画和效果类
- 设置基础字体和排版样式
- 统一组件样式规范

## 文件结构

```
assets/
└── css/
    ├── main.css           # 全局样式、CSS 变量、动画
    └── sections.css       # 页面区块统一样式
```

---

## main.css 详解

### 1. Tailwind 和 Nuxt UI 导入
```css
@import "tailwindcss";
@import "@nuxt/ui";
```

### 2. 样式导入
```css
/* Section 统一样式 */
@import './sections.css';
```

### 3. 全局盒模型设置
```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

### 4. CSS 变量定义 (:root)

#### 主要颜色
- `--primary-accent`: #FF174F - 主红色强调
- `--primary-accent-hover`: #FF2F7D - 悬停红色
- `--primary-dark`: #cc0000 - 深红色

#### 背景颜色 - V2 黑暗主题
- `--bg-primary`: #060609 - 主背景
- `--bg-secondary`: #07070A - 次要背景
- `--bg-tertiary`: #07070C - 第三背景
- `--bg-card`: #241019 - 卡片背景
- `--bg-card-hover`: #2D233A - 卡片悬停背景

#### 文本颜色
- `--text-title`: #F2EEF8 - 标题颜色
- `--text-body`: #正文颜色
- `--text-secondary`: #D6CCEA - 次要文本
- `--text-muted`: #B7ABC8 - 弱化文本
- `--text-subtle`: #9F95B2 - 微弱文本

#### 边框颜色
- `--border-dark`: #1A1424 - 深色边框
- `--border-light`: rgba(255, 255, 255, 0.1) - 浅色边框
- `--border-accent`: #A22A55 - 强调边框

#### 阴影
- `--shadow-red`: 0 5px 15px rgba(255, 23, 79, 0.3) - 红色阴影
- `--shadow-dark`: 0 5px 15px rgba(0, 0, 0, 0.5) - 深色阴影

#### 历史成员遮罩
- `--mask-former`: rgba(0, 0, 0, 0.47) - 历任成员遮罩
- `--mask-former-hover`: rgba(0, 0, 0, 0.4) - 悬停遮罩

#### 动效时间
- `--transition-hover`: 180ms - 悬停过渡
- `--transition-press`: 120ms - 按压过渡
- `--transition-scroll`: 400ms - 滚动过渡

### 5. 基础样式

#### body
```css
body {
  font-family: "Inter", "Roboto", "Noto Sans SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-primary);
  color: var(--text-body);
}
```

### 6. 自定义工具类

#### 金属质感文字 - V2
```css
.font-metal {
  font-family: "Cinzel", serif;
  font-weight: 700;
  letter-spacing: 0.5px;
}
```

#### 章节标题下划线 - V2 规范
```css
.section-title {
  font-family: "Cinzel", serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-title);
  margin-bottom: 12px;
}

.section-accent {
  width: 110px;
  height: 2px;
  background-color: var(--primary-accent);
}
```

#### 渐变色文字 - V2 版本
```css
.gradient-text {
  background: linear-gradient(135deg, var(--primary-accent), var(--primary-accent-hover));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

#### V2 玻璃效果
```css
.glass-effect {
  background: rgba(36, 16, 25, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

#### 导航链接效果 - V2
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-accent);
  transition: width var(--transition-hover) ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link {
  color: var(--text-secondary);
  transition: color var(--transition-hover) ease;
}

.nav-link:hover {
  color: var(--text-title);
}
```

### 7. 页面过渡动画

```css
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
```

### 8. 动画类

#### 淡入动画
```css
.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 动画延迟类
```css
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
```

#### 标题动画
```css
.animate-title {
  animation: titleReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes titleReveal {
  0% {
    opacity: 0;
    transform: translateY(50px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

#### 渐变动画
```css
.animate-gradient {
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1) rotate(5deg);
  }
}
```

### 9. 通用效果类

#### 玻璃效果
```css
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

#### 悬停缩放效果
```css
.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(255, 51, 51, 0.2);
}
```

#### 文本阴影
```css
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
```

#### 卡片样式
```css
.card {
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}
```

---

## sections.css 详解

### 1. 容器样式

```css
.section-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 140px;
}
```

### 2. 章节标题样式

```css
.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 30px;
  font-weight: 700;
  color: #F2EEF8;
  margin-bottom: 12px;
}

/* 红色分隔线 */
.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
}
```

### 3. 响应式设计

#### 平板 (max-width: 1024px)
```css
@media (max-width: 1024px) {
  .section-container {
    padding: 0 80px;
  }
}
```

#### 移动端 (max-width: 768px)
```css
@media (max-width: 768px) {
  .section-container {
    padding: 0 32px;
  }

  .section-title {
    font-size: 26px;
  }
}
```

---

## 使用方式

### 在 nuxt.config.ts 中注册
```typescript
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  // ...
})
```

### 在 Vue 组件中使用
```vue
<template>
  <div class="glass-effect hover-scale">
    <h1 class="font-metal gradient-text">标题</h1>
  </div>
</template>
```

---

## Tailwind 配置关联

`tailwind.config.js` 中引用了 `main.css` 中的 CSS 变量：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'primary-accent': 'var(--primary-accent)',
        'primary-accent-hover': 'var(--primary-accent-hover)',
        'bg-primary': 'var(--bg-primary)',
        'text-title': 'var(--text-title)',
        'text-body': 'var(--text-body)',
        // ...
      },
      boxShadow: {
        'red': 'var(--shadow-red)',
        'dark': 'var(--shadow-dark)',
      },
      fontFamily: {
        'metal': ['Cinzel', 'serif'],
        'sans': ['Inter', 'Roboto', 'Noto Sans SC', 'sans-serif'],
      },
      transitionDuration: {
        'hover': '180ms',
        'press': '120ms',
      },
    },
  },
}
```

---

## 常见问题 (FAQ)

### Q: 如何修改主题色？
编辑 `main.css` 中的 `:root` 变量，Tailwind 配置会自动同步。

### Q: 如何添加新动画？
1. 在 `main.css` 中定义 `@keyframes`
2. 创建对应的 `.animate-*` 类
3. 在组件中使用该类

### Q: 为什么某些样式不生效？
确保 `nuxt.config.ts` 中正确引用了 `~/assets/css/main.css`。

### Q: sections.css 和 main.css 的区别？
- `main.css`: 全局基础样式、变量、动画
- `sections.css`: 页面区块的统一布局和标题样式

---

## 相关文件清单

```
assets/
└── css/
    ├── main.css           # 全局样式（约 243 行）
    └── sections.css       # 区块样式（约 50 行）
```

---

## 变更记录 (Changelog)

### 2026-04-08 - 模块文档更新
- 更新 main.css 内容，反映 V2 设计系统
- 添加 sections.css 文档
- 更新 CSS 变量说明
- 添加 Tailwind 配置关联说明

### 2026-03-07 - 模块文档初始化
- 创建 assets 模块 CLAUDE.md 文档
- 详细记录 main.css 的结构和内容
