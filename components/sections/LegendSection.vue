<script setup lang="ts">
/**
 * LegendSection - 传说介绍区块
 *
 * 特性：
 * - 图片视差滚动效果
 * - 滚动触发的淡入动画
 * - 图片懒加载
 * - 响应式布局（移动端堆叠）
 */

interface LegendSectionProps {
  /** 乐队介绍图片 */
  image: string
  /** 介绍文字内容 */
  content: string
  /** 章节标题 */
  title?: string
  /** 章节副标题 */
  subtitle?: string
}

const props = withDefaults(defineProps<LegendSectionProps>(), {
  title: 'The Legend',
  subtitle: '传说',
})

// 视差效果
const imageParallax = ref(0)
const sectionRef = ref<HTMLElement | null>(null)
const isReducedMotion = ref(false)
let rafId: number | null = null

// 检查动画偏好
const checkMotionPreference = () => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 视差和可见性处理
const isVisible = ref(false)
const hasAnimated = ref(false)

const handleScroll = () => {
  if (!sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // 检查是否在视口内
  const isInViewport = rect.top < windowHeight && rect.bottom > 0

  if (isInViewport && !hasAnimated.value) {
    isVisible.value = true
    hasAnimated.value = true
  }

  // 图片视差效果
  if (!isReducedMotion.value && isInViewport) {
    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height)
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress))
    imageParallax.value = (clampedProgress - 0.5) * 30 // -15px 到 +15px 的偏移
  }

  rafId = null
}

// 使用 RAF 节流
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(handleScroll)
}

onMounted(() => {
  checkMotionPreference()

  // 初始检查
  handleScroll()

  // 监听滚动
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <section
    id="legend"
    ref="sectionRef"
    class="legend-section"
  >
    <div class="container">
      <!-- 章节标题 -->
      <div
        class="section-header"
        :class="isVisible ? 'is-visible' : ''"
      >
        <h2 class="section-title">
          {{ title }} {{ subtitle }}
        </h2>
        <div class="red-line" :class="isVisible ? 'is-visible' : ''" />
      </div>

      <!-- 内容区 - 左图右文 -->
      <div class="content-wrapper" :class="isVisible ? 'is-visible' : ''">
        <!-- 左侧图片 - 带视差效果 -->
        <div class="image-wrapper" :class="isVisible ? 'is-visible' : ''">
          <div class="image-container">
            <div
              class="parallax-image"
              :style="{
                transform: `translateY(${imageParallax}px)`,
                '--bg-img': `url(${image})`
              }"
            />
          </div>
        </div>

        <!-- 右侧文字 - #C5BDD4 -->
        <div class="text-wrapper" :class="isVisible ? 'is-visible' : ''">
          <p class="legend-text">
            {{ content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Legend区设计规范: padding: [72, 140]
.legend-section {
  padding: 72px 0;
  background-color: #07070A;
}

.container {
  padding: 0 140px;
}

.section-header {
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(24px);
  transition: all 700ms ease-out;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 34px;
  font-weight: 700;
  color: #F2EEF8;
  margin-bottom: 12px;
}

.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
  transform-origin: left;
  transform: scaleX(0);
  transition: transform 700ms ease-out 200ms;

  &.is-visible {
    transform: scaleX(1);
  }
}

.content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
  opacity: 0;
  transform: translateY(24px);
  transition: all 700ms ease-out 200ms;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-wrapper {
  flex-shrink: 0;
  opacity: 0;
  transform: translateX(-32px);
  transition: all 700ms ease-out 200ms;

  &.is-visible {
    opacity: 1;
    transform: translateX(0);
  }
}

.image-container {
  width: 400px;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.parallax-image {
  width: 100%;
  height: 120%;
  will-change: transform;
  background: var(--bg-img) scroll center center transparent;
  background-size: cover;
}

.text-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  opacity: 0;
  transform: translateX(32px);
  transition: all 700ms ease-out 300ms;
  border-left: 2px solid #FF174F;
  padding-left: 15px;

  &.is-visible {
    opacity: 1;
    transform: translateX(0);
  }
}

.legend-text {
  font-size: 14px;
  color: #C5BDD4;
  line-height: 1.8;
  white-space: pre-line;
}

// 响应式 - 平板
@media (max-width: 1024px) {
  .container {
    padding: 0 80px;
  }
}

// 响应式 - 移动端
@media (max-width: 768px) {
  .container {
    padding: 0 32px;
  }

  .section-title {
    font-size: 26px;
  }

  .content-wrapper {
    flex-direction: column;
    gap: 24px;
  }

  .image-wrapper {
    width: 100%;
  }

  .image-container {
    width: 100%;
    height: 280px;
  }
}

// 减少动画偏好支持
@media (prefers-reduced-motion: reduce) {
  .section-header,
  .red-line,
  .content-wrapper,
  .image-wrapper,
  .text-wrapper {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
