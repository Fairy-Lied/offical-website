<script setup lang="ts">
// ===== 导航组件 =====
import { useEventListener } from '@vueuse/core'

interface NavItem {
  id: string
  label: string
  labelEn: string
}

// 导航项配置
const navItems: NavItem[] = [
  { id: 'legend', label: '传说', labelEn: 'The Legend ' },
  { id: 'coven', label: '成员', labelEn: 'The Coven ' },
  { id: 'discography', label: '作品', labelEn: 'Discography ' },
  { id: 'tour', label: '演出', labelEn: 'On Tour ' },
  { id: 'gallery', label: '图集', labelEn: 'Gallery ' },
  { id: 'contact', label: '联系', labelEn: 'Contact ' },
]

// 响应式状态
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const activeSection = ref('')
const isReducedMotion = ref(false)

// 滚动偏移量（导航栏高度 + 间距）
const SCROLL_OFFSET = 80

// 监听滚动 - 导航栏背景
const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

// 平滑滚动到锚点
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  const offsetPosition = elementPosition - SCROLL_OFFSET

  // 检查用户是否偏好减少动画
  if (isReducedMotion.value) {
    window.scrollTo(0, offsetPosition)
  } else {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }

  // 关闭移动端菜单
  isMobileMenuOpen.value = false
}

// IntersectionObserver 监听章节可见性
let observer: IntersectionObserver | null = null

const setupIntersectionObserver = () => {
  // 清理旧 observer
  if (observer) {
    observer.disconnect()
  }

  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: `-${SCROLL_OFFSET}px 0px -60% 0px`,
    threshold: 0,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  // 观察所有章节
  navItems.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer?.observe(element)
    }
  })
}

// 检查用户动画偏好
const checkMotionPreference = () => {
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 生命周期
onMounted(() => {
  checkMotionPreference()
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 等待 DOM 渲染完成后设置 observer
  nextTick(() => {
    setupIntersectionObserver()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})

// 监听窗口大小变化，重置移动端菜单
const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMobileMenuOpen.value = false
  }
}

useEventListener(window, 'resize', handleResize)
</script>

<template>
  <!-- 导航栏 -->
  <header
    class="app-header"
    :class="{
      'is-scrolled': isScrolled,
    }"
  >
    <nav class="nav-container">
      <div class="nav-inner">
        <!-- 左侧：队名 -->
        <a
          href="#"
          class="nav-logo"
          @click.prevent="scrollToSection('')"
        >
          Fairy Lied
        </a>

        <!-- 右侧：桌面端导航菜单 -->
        <div class="desktop-menu">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="nav-link"
            :class="{ 'is-active': activeSection === item.id }"
            @click="scrollToSection(item.id)"
          >
            <span>{{ item.labelEn }}{{item.label}}</span>
            <!-- 激活指示器 -->
            <span class="nav-indicator" />
          </button>
        </div>

        <!-- 移动端汉堡菜单按钮 -->
        <button
          class="mobile-menu-btn"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <div class="hamburger">
            <span :class="{ 'is-open': isMobileMenuOpen }" />
            <span :class="{ 'is-open': isMobileMenuOpen }" />
            <span :class="{ 'is-open': isMobileMenuOpen }" />
          </div>
        </button>
      </div>
    </nav>

    <!-- 移动端菜单 -->
    <Transition
      enter-active-class="transition-all duration-[400ms] ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-[400ms] ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-show="isMobileMenuOpen"
        class="mobile-menu"
      >
        <div class="mobile-menu-inner">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="mobile-nav-link"
            :class="{ 'is-active': activeSection === item.id }"
            @click="scrollToSection(item.id)"
          >
            <span class="mobile-nav-label">{{ item.labelEn }}</span>
            <span class="mobile-nav-sublabel">{{ item.label }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
// 导航栏
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 400ms ease;
  background-color: transparent;
  &.is-scrolled {
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

// 导航容器
.nav-container {
  padding: 0 110px;

  @media (max-width: 1024px) {
    padding: 0 80px;
  }

  @media (max-width: 768px) {
    padding: 0 32px;
  }
}

// 导航内部 - 左右布局
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;

  @media (max-width: 768px) {
    height: 64px;
  }
}

// 队名 Logo
.nav-logo {
  font-family: 'Cinzel', serif;
  font-size: 24px;
  font-weight: 700;
  color: #FF6A95;
  text-decoration: none;
  transition: color 180ms ease;

  &:hover {
    color: #FF2F7D;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
}

// 桌面端菜单
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
  }
}

// 导航链接
.nav-link {
  position: relative;
  padding: 8px 0;
  font-size: 14px;
  color: #D6CCEA;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 180ms ease;

  &:hover {
    color: #F2EEF8;
  }

  &.is-active {
    color: #FF6A95;

    .nav-indicator {
      transform: scaleX(1);
    }
  }
}

// 导航指示器（下划线）
.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FF174F;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
}

// 移动端菜单按钮
.mobile-menu-btn {
  display: none;
  position: relative;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: #D6CCEA;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 180ms ease;

  &:hover {
    color: #F2EEF8;
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

// 汉堡菜单图标
.hamburger {
  position: relative;
  width: 24px;
  height: 20px;

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transition: all 180ms ease;

    &:nth-child(1) {
      top: 0;

      &.is-open {
        top: 9px;
        transform: rotate(45deg);
      }
    }

    &:nth-child(2) {
      top: 9px;

      &.is-open {
        opacity: 0;
      }
    }

    &:nth-child(3) {
      top: 18px;

      &.is-open {
        top: 9px;
        transform: rotate(-45deg);
      }
    }
  }
}

// 移动端菜单
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: rgba(6, 6, 9, 0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid #1A1424;

  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-menu-inner {
  padding: 16px 32px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 4px;
  color: #D6CCEA;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    color: #F2EEF8;
    background-color: #1F0F17;
  }

  &.is-active {
    color: #FF6A95;
    background-color: #1F0F17;
  }
}

.mobile-nav-label {
  font-size: 14px;
  font-weight: 500;
}

.mobile-nav-sublabel {
  margin-left: 8px;
  font-size: 12px;
  color: #9F95B2;
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .app-header,
  .nav-link,
  .nav-indicator,
  .mobile-menu-btn,
  .hamburger span,
  .mobile-nav-link {
    transition-duration: 0.01ms !important;
  }
}
</style>
