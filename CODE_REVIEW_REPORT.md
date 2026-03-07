# Fairy Lied 官网 v2 代码审查报告

> 审查日期: 2026-03-07
> 审查人: 质量工程师 (team-lead)
> 版本: develop 分支

---

## 审查清单总览

| 类别 | 通过 | 问题数 | 状态 |
|------|------|--------|------|
| 设计规范符合性 | ❌ | 5 | 需要修复 |
| A11y 可访问性 | ⚠️ | 6 | 需要改进 |
| 性能优化 | ⚠️ | 3 | 建议优化 |
| 代码质量 | ⚠️ | 4 | 需要整理 |
| **总计** | - | **18** | - |

---

## 一、设计规范符合性

### ❌ [P1] 颜色硬编码问题

**位置**: `pages/index.vue` 多处

**问题**: 颜色值直接硬编码在模板中，未使用 CSS 变量

```vue
<!-- 第 64 行 -->
<h1 class="... text-[#FF6A95] ...">

<!-- 第 68 行 -->
<div class="... bg-[#FF174F] ...">

<!-- 第 70 行 -->
<p class="... text-[#D6CCEA] ...">
```

**建议**: 统一使用 Tailwind 配置中的颜色类
```vue
<h1 class="... text-primary-accent-hover ...">
<div class="... bg-primary-accent ...">
```

**影响**: 高 - 违反设计令牌规范，不利于主题切换

---

### ❌ [P2] 成员卡片 4 态不完整

**位置**: `pages/index.vue` 第 136-156 行

**问题**: 成员卡片只实现了 2 态（default/hover），缺少 pressed 和 disabled 态

**当前实现**:
```vue
<div class="... group-hover:scale-105 ... group-hover:border-[3px] ...">
```

**规范要求**:
- Default: 1px 边框 #A22A55
- Hover: 3px 边框 #FF2F7D
- Pressed: 缩小 2%
- Disabled: 50% 透明度

**建议**: 添加完整的 4 态样式
```vue
<div class="
  ...
  active:scale-[0.98]
  disabled:opacity-50
">
```

---

### ❌ [P3] 章节标题字号不统一

**位置**: `pages/index.vue`

**问题**: 各章节标题字号不一致

| 章节 | 当前字号 |
|------|----------|
| The Legend | text-[34px] |
| The Coven | text-[38px] |
| Discography | text-[30px] |
| On Tour | text-[30px] |
| Gallery | text-[30px] |
| Contact | text-[28px] |

**规范要求**: 统一使用 32px (text-[32px] 或 section-title 类)

**建议**: 统一使用 `section-title` 类

---

### ❌ [P4] 内联样式使用

**位置**: `pages/index.vue` 第 152, 183 行

**问题**: 使用内联样式 `style="bottom: 0;"`

```vue
<div class="..." style="bottom: 0;">
```

**建议**: 使用 Tailwind 类 `bottom-0`

---

### ❌ [P5] CSS 变量重复定义

**位置**: `assets/css/main.css`

**问题**: `glass-effect` 类定义了两次（第 85-89 行和第 217-222 行），且定义不一致

```css
/* 第一次定义 */
.glass-effect {
  background: rgba(36, 16, 25, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 第二次定义 - 覆盖了第一次 */
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

**建议**: 删除重复定义，保留 V2 设计规范版本

---

## 二、A11y 可访问性

### ⚠️ [A1] FORMER 标签缺少 aria-label

**位置**: `pages/index.vue` 第 179 行

**问题**: FORMER 标签只是一个视觉标识，屏幕阅读器用户无法获取其含义

```vue
<div class="...">FORMER</div>
```

**建议**: 添加语义化信息
```vue
<div class="..." role="status" aria-label="历史成员">FORMER</div>
```

**影响**: 中 - 影响屏幕阅读器用户体验

---

### ⚠️ [A2] Gallery 图片缺少焦点状态

**位置**: `pages/index.vue` 第 270-281 行

**问题**: Gallery 图片可点击但无焦点指示器

```vue
<div class="... cursor-pointer">
```

**建议**: 添加焦点环
```vue
<div class="... cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-accent">
```

---

### ⚠️ [A3] 滚动提示按钮不可聚焦

**位置**: `pages/index.vue` 第 81-87 行

**问题**: 向下滚动提示使用 `div` 而非 `button`，键盘用户无法操作

```vue
<div class="... cursor-pointer">
```

**建议**: 使用 `<button>` 元素或添加 `role="button" tabindex="0"`

---

### ⚠️ [A4] 缺少 prefers-reduced-motion 支持

**位置**: `assets/css/main.css`

**问题**: 动画未考虑用户对减少动画的偏好

**建议**: 添加媒体查询
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-fade-in-up,
  .animate-title {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .group-hover\:scale-105:hover {
    transform: none;
  }
}
```

---

### ⚠️ [A5] 链接文本语义不明

**位置**: `pages/index.vue` 第 251 行

**问题**: "TICKETS" 链接缺少上下文

```vue
<a href="#" class="...">TICKETS</a>
```

**建议**: 添加 aria-label 提供完整上下文
```vue
<a href="#" class="..." :aria-label="`购买 ${show.city} 演出门票`">TICKETS</a>
```

---

### ⚠️ [A6] 图片懒加载缺失

**位置**: `pages/index.vue` 多处

**问题**: 所有图片都使用标准 `<img>` 标签，没有懒加载

**建议**:
1. 使用 Nuxt Image 组件 `<NuxtImg>`
2. 或添加 `loading="lazy"` 属性

```vue
<!-- 方案 1 -->
<NuxtImg :src="member.image" :alt="member.name" loading="lazy" />

<!-- 方案 2 -->
<img :src="member.image" :alt="member.name" loading="lazy" />
```

---

## 三、性能优化

### ⚠️ [PF1] 缺少图片优化

**位置**: `pages/index.vue`

**问题**:
1. 使用外部 Unsplash 图片，无尺寸控制
2. 未使用 Nuxt Image 模块进行优化

**建议**:
```vue
<NuxtImg
  :src="member.image"
  :alt="member.name"
  width="400"
  height="300"
  loading="lazy"
  placeholder
/>
```

---

### ⚠️ [PF2] 动画性能优化

**位置**: `pages/index.vue` 第 145 行

**问题**: `transition-transform` 已使用，但部分动画可能影响性能

**建议**: 确保所有动画元素添加 `will-change-transform`

---

### ⚠️ [PF3] 字体加载策略

**位置**: `app.vue` 第 23-38 行

**问题**: Google Fonts 使用 `display=swap`，但可能产生 FOUT

**建议**: 考虑使用 `display=optional` 或预加载关键字体

---

## 四、代码质量

### ⚠️ [Q1] TypeScript 类型缺失

**位置**: `pages/index.vue`

**问题**: 所有数据数组缺少类型定义

**当前代码**:
```typescript
const currentMembers = [
  { name: '妖精', role: 'Vocal', image: '...' },
  // ...
];
```

**建议**: 定义接口
```typescript
interface Member {
  name: string;
  role: string;
  image: string;
  height?: number;
}

const currentMembers: Member[] = [
  // ...
];
```

---

### ⚠️ [Q2] 硬编码的占位符内容

**位置**: `pages/index.vue` 第 114-118 行

**问题**: 存在占位符文本

```vue
此处为乐队长文介绍占位，建议 100~160 字。
```

**建议**: 替换为实际内容或添加 TODO 注释

---

### ⚠️ [Q3] 重复的颜色定义

**位置**: `assets/css/main.css`

**问题**: 第 84 行后缺少空行，且存在重复定义

---

### ⚠️ [Q4] 魔法数字

**位置**: `pages/index.vue`

**问题**: 多处使用硬编码的像素值

```vue
class="w-[320px] h-[420px]"
class="py-[72px]"
class="px-[140px]"
```

**建议**: 将常用尺寸提取到 Tailwind 配置或 CSS 变量

---

## 五、改进建议总结

### 高优先级（P1）

1. **统一使用 CSS 变量/设计令牌** - 替换所有硬编码颜色
2. **添加 TypeScript 类型定义** - 为所有数据接口添加类型
3. **修复 CSS 重复定义** - 清理 glass-effect 重复定义

### 中优先级（P2）

1. **完善 A11y 支持** - 添加 aria-label、焦点状态、键盘导航
2. **实现完整 4 态交互** - 成员卡片添加 pressed/disabled 态
3. **添加图片懒加载** - 使用 NuxtImg 或 loading="lazy"

### 低优先级（P3）

1. **统一标题字号** - 规范章节标题样式
2. **添加 prefers-reduced-motion** - 支持用户动画偏好
3. **清理占位符内容** - 替换为实际内容

---

## 六、正面评价

✅ **动效时长符合规范** - `--transition-hover: 180ms` 和 `--transition-press: 120ms` 已正确配置

✅ **CSS 变量定义完整** - V2 设计配色已全部定义

✅ **Tailwind 配置扩展良好** - 颜色和字体配置符合项目需求

✅ **使用 transform 动画** - 性能友好的动画实现

✅ **图片 alt 文本** - 大部分图片已添加 alt 属性

---

## 七、附录：关键文件清单

| 文件 | 行数 | 问题数 |
|------|------|--------|
| `pages/index.vue` | 313 | 14 |
| `assets/css/main.css` | 245 | 3 |
| `app.vue` | 59 | 1 |
| `tailwind.config.js` | 53 | 0 |

---

*报告生成时间: 2026-03-07*
