<script setup lang="ts">
/**
 * HeroSection - 首屏 Hero 区块
 *
 * 特性：
 * - 背景视差滚动效果
 * - 内容入场动画
 * - 向下滚动提示（可点击）
 * - 图片懒加载
 * - 支持 prefers-reduced-motion
 */

interface HeroSectionProps {
  /** Hero 背景图片 URL */
  backgroundImage: string
  /** 乐队名称 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 英文简介 */
  description?: string
  /** 下一章节 ID */
  nextSectionId?: string
}

const props = withDefaults(defineProps<HeroSectionProps>(), {
  title: 'Fairy Lied',
  subtitle: '妖精说了谎 · Gothic Metal / Symphonic Metal',
  description: 'A dark symphonic journey through lies, fate and salvation.',
  nextSectionId: 'legend',
})

// 视差效果
const parallaxOffset = ref(0)
const isReducedMotion = ref(false)
let rafId: number | null = null

// 检查动画偏好
const checkMotionPreference = () => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 视差滚动处理
const handleParallax = () => {
  if (isReducedMotion.value) return

  const scrollY = window.scrollY
  const windowHeight = window.innerHeight

  // 只在 Hero 区域可见时计算视差
  if (scrollY < windowHeight) {
    parallaxOffset.value = scrollY * 0.4 // 40% 滚动速度
  }

  rafId = null
}

// 使用 requestAnimationFrame 节流
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(handleParallax)
}

// 平滑滚动到下一章节
const scrollToNext = () => {
  const element = document.getElementById(props.nextSectionId)
  if (!element) return

  const offset = 80 // 导航栏高度
  const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset

  if (isReducedMotion.value) {
    window.scrollTo(0, targetPosition)
  } else {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })
  }
}

// 内容可见性动画
const isVisible = ref(false)

onMounted(() => {
  checkMotionPreference()

  // 触发动画
  nextTick(() => {
    isVisible.value = true
  })

  // 监听滚动（用于视差）
  if (!isReducedMotion.value) {
    window.addEventListener('scroll', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <section class="hero-section">
    <!-- 背景图 - 视差效果 -->
    <div class="hero-background">
      <div
        class="parallax-wrapper"
        :style="{ transform: `translateY(${parallaxOffset}px)`, '--heroBgImg': `url(${backgroundImage})` }"
      >
      </div>

      <!-- 渐变遮罩 -->
      <div class="gradient-overlay gradient-overlay-top" />
      <div class="gradient-overlay gradient-overlay-left" />
    </div>

    <!-- Hero 内容 - 底部对齐 -->
    <div class="hero-content">
      <div
        class="content-wrapper"
        :class="isVisible ? 'is-visible' : ''"
      >
        <!-- 主标题 - 粉色 #FF6A95 -->
        <h1 class="hero-title">
          {{ title }}
        </h1>

        <!-- 装饰线 - #FF174F -->
        <div
          class="accent-line"
          :class="isVisible ? 'is-visible' : ''"
        />

        <!-- 副标题 - #D6CCEA -->
        <p class="hero-subtitle">
          {{ subtitle }}
        </p>

        <!-- 英文简介 - #B7ABC8 -->
        <p class="hero-description">
          {{ description }}
        </p>
      </div>
    </div>

    <!-- 向下滚动提示 - 可点击 -->
    <button
      class="scroll-indicator"
      :class="{ 'animate-bounce': !isReducedMotion }"
      aria-label="Scroll to next section"
      @click="scrollToNext"
    >
      <div class="scroll-button">
        <svg
          class="scroll-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </button>
  </section>
</template>

<style scoped lang="scss">
// 设计稿规范: padding: [560, 110] (上560px, 左右110px)
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
}

// 背景层
.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.parallax-wrapper {
  position: absolute;
  will-change: transform;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-image: var(--heroBgImg);
}

// 渐变遮罩
.gradient-overlay {
  position: absolute;
  inset: 0;

  &-top {
    background: linear-gradient(to top, #060609, rgba(6, 6, 9, 0.5), transparent);
  }

  &-left {
    background: linear-gradient(to right, rgba(6, 6, 9, 0.6), transparent);
  }
}

// Hero 内容区 - 设计稿: padding: [560, 110]
.hero-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 560px 110px 112px; // 上560, 左右110, 下112(7rem)
}

.content-wrapper {
  opacity: 0;
  transform: translateY(32px);
  transition: all 1000ms ease-out;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

// 主标题
.hero-title {
  font-family: 'Cinzel', serif;
  font-size: 86px;
  font-weight: 700;
  color: #FF6A95;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
  line-height: 1;
}

// 装饰线
.accent-line {
  width: 128px;
  height: 2px;
  background-color: #FF174F;
  margin-bottom: 24px;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 1000ms ease-out 300ms;

  &.is-visible {
    transform: scaleX(1);
  }
}

// 副标题
.hero-subtitle {
  font-size: 22px;
  color: #D6CCEA;
  font-weight: 500;
  margin-bottom: 12px;
}

// 英文简介
.hero-description {
  font-size: 16px;
  color: #B7ABC8;
}

// 滚动提示按钮
.scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;

  &.animate-bounce {
    animation: bounce 2s infinite;
  }
}

.scroll-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 23, 79, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(6, 6, 9, 0.5);
  backdrop-filter: blur(4px);
  transition: all 180ms ease;

  &:hover {
    border-color: #FF174F;
    background-color: rgba(6, 6, 9, 0.7);
    transform: scale(1.1);
  }
}

.scroll-icon {
  width: 20px;
  height: 20px;
  color: #FF174F;
  transition: transform 180ms ease;

  .scroll-button:hover & {
    transform: translateY(2px);
  }
}

// 弹跳动画
@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}

// 响应式 - 平板
@media (max-width: 1024px) {
  .hero-content {
    padding: 400px 80px 80px;
  }

  .hero-title {
    font-size: 64px;
  }
}

// 响应式 - 移动端
@media (max-width: 768px) {
  .hero-content {
    padding: 300px 32px 64px;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .accent-line {
    width: 100px;
  }
}

// 减少动画偏好支持
@media (prefers-reduced-motion: reduce) {
  .content-wrapper,
  .accent-line {
    transition: none;
    opacity: 1;
    transform: none;
  }

  .scroll-indicator {
    animation: none;
  }
}
</style>
