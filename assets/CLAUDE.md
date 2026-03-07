[根目录](../../CLAUDE.md) > **assets**

---

# assets 模块

> 静态资源模块，包含全局样式文件。

## 模块职责

- 管理全局 CSS 样式
- 定义 CSS 变量（主题色）
- 提供通用动画和效果类
- 设置基础字体和排版样式

## 文件结构

```
assets/
└── css/
    └── main.css           # 全局样式文件
```

## main.css 详解

### 1. Tailwind 指令
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. CSS 变量定义 (:root)

#### 主要颜色
- `--primary-red`: #ff3333 - 主红色
- `--primary-dark`: #cc0000 - 深红色
- `--accent-gold`: #ffcc33 - 金色强调
- `--accent-orange`: #ff9966 - 橙色强调

#### 背景颜色
- `--bg-black`: #000000 - 纯黑背景
- `--bg-dark`: #0a0a0a - 深色背景
- `--bg-card`: rgba(255, 255, 255, 0.05) - 卡片背景

#### 文本颜色
- `--text-white`: #ffffff - 白色文本
- `--text-light`: #e0e0e0 - 浅灰文本
- `--text-gray`: #a0a0a0 - 灰色文本
- `--text-dark`: #505050 - 深灰文本

#### 边框颜色
- `--border-dark`: #333333 - 深色边框
- `--border-light`: rgba(255, 255, 255, 0.1) - 浅色边框

#### 阴影
- `--shadow-red`: 0 5px 15px rgba(255, 51, 51, 0.3) - 红色阴影
- `--shadow-dark`: 0 5px 15px rgba(0, 0, 0, 0.5) - 深色阴影

### 3. 基础样式

#### body
```css
body {
  font-family: "Roboto", "Noto Sans SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-black);
  color: var(--text-white);
}
```

### 4. 自定义工具类

#### 金属质感文字
```css
.font-metal {
  font-family: "Cinzel", serif;
  font-weight: 700;
  letter-spacing: 1px;
}
```

#### 渐变文字
```css
.gradient-text {
  background: linear-gradient(to right, var(--primary-red), var(--accent-orange), var(--accent-gold));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
}
```

#### 导航链接效果
```css
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-red), var(--accent-gold));
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
```

### 5. 页面过渡动画

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

### 6. 滚动条样式

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 51, 51, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 51, 51, 0.7);
}
```

### 7. 动画类

#### 淡入动画
```css
.animate-fade-in {
  animation: fadeIn 1s ease forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease forwards;
}
```

#### 动画延迟
```css
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
/* ... 到 delay-600 */
```

#### 标题动画
```css
.animate-title {
  animation: titleReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

#### 渐变动画
```css
.animate-gradient {
  animation: gradientShift 15s ease infinite;
}
```

### 8. 玻璃效果

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

### 9. 悬停效果

```css
.hover-scale {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(255, 51, 51, 0.2);
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
        'primary-red': 'var(--primary-red)',
        'primary-dark': 'var(--primary-dark)',
        // ...
      },
      boxShadow: {
        'red': 'var(--shadow-red)',
        'dark': 'var(--shadow-dark)',
      },
      fontFamily: {
        'metal': ['Cinzel', 'serif'],
        'sans': ['Roboto', 'Noto Sans SC', 'sans-serif'],
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

---

## 相关文件清单

```
assets/
└── css/
    └── main.css           # 全局样式（约 199 行）
```

---

## 变更记录 (Changelog)

### 2026-03-07 - 模块文档初始化
- 创建 assets 模块 CLAUDE.md 文档
- 详细记录 main.css 的结构和内容
