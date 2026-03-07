<script setup lang="ts">
/**
 * ImageLightbox - 图片灯箱组件
 *
 * 功能：
 * - 图片放大查看
 * - 左右切换（按钮 + 键盘左右箭头）
 * - 关闭（点击背景 / 点击关闭按钮 / ESC键）
 * - 支持 prefers-reduced-motion
 * - A11y：焦点管理、ARIA属性
 */

import { useEventListener, useScrollLock } from '@vueuse/core'

interface GalleryImage {
  id: string
  url: string
  alt: string
}

interface ImageLightboxProps {
  modelValue: boolean
  images: GalleryImage[]
  initialIndex?: number
}

const props = withDefaults(defineProps<ImageLightboxProps>(), {
  initialIndex: 0,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

// 当前显示的图片索引
const currentIndex = ref(props.initialIndex)

// 监听 initialIndex 变化
watch(() => props.initialIndex, (newIndex) => {
  currentIndex.value = newIndex
})

// 是否打开
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 当前图片
const currentImage = computed(() => {
  return props.images[currentIndex.value]
})

// 是否有上一张/下一张
const hasPrev = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.images.length - 1)

// 切换图片
function goToPrev() {
  if (hasPrev.value) {
    currentIndex.value--
  }
}

function goToNext() {
  if (hasNext.value) {
    currentIndex.value++
  }
}

// 关闭灯箱
function close() {
  isOpen.value = false
}

// 键盘导航
useEventListener('keydown', (e: KeyboardEvent) => {
  if (!isOpen.value) return

  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      goToPrev()
      break
    case 'ArrowRight':
      goToNext()
      break
  }
})

// 锁定背景滚动
const body = ref<HTMLElement | null>(null)
onMounted(() => {
  body.value = document.body
})
const isLocked = useScrollLock(body)
watch(isOpen, (open) => {
  isLocked.value = open
})

// 图片加载状态
const isLoading = ref(true)
watch(currentIndex, () => {
  isLoading.value = true
})

function onImageLoad() {
  isLoading.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="图片浏览"
      >
        <!-- 背景遮罩 -->
        <div
          class="absolute inset-0 bg-black/90 backdrop-blur-sm"
          @click="close"
        />

        <!-- 关闭按钮 -->
        <button
          class="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors duration-180 rounded-full hover:bg-white/10"
          aria-label="关闭"
          @click="close"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 上一张按钮 -->
        <button
          v-if="hasPrev"
          class="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-colors duration-180 rounded-full hover:bg-white/10"
          aria-label="上一张"
          @click="goToPrev"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- 下一张按钮 -->
        <button
          v-if="hasNext"
          class="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white transition-colors duration-180 rounded-full hover:bg-white/10"
          aria-label="下一张"
          @click="goToNext"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- 图片容器 -->
        <div class="relative z-10 max-w-[90vw] max-h-[85vh] flex flex-col items-center">
          <!-- 加载指示器 -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>

          <!-- 图片 -->
          <img
            v-if="currentImage"
            :src="currentImage.url"
            :alt="currentImage.alt"
            class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
            @load="onImageLoad"
          >

          <!-- 图片计数 -->
          <div class="mt-4 text-white/60 text-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <!-- 图片描述 -->
          <p
            v-if="currentImage?.alt"
            class="mt-2 text-white/80 text-sm max-w-md text-center"
          >
            {{ currentImage.alt }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* 尊重用户偏好：减少动画 */
@media (prefers-reduced-motion: reduce) {
  .transition,
  .transition-transform,
  .duration-300,
  .duration-200,
  .duration-180 {
    transition-duration: 0.01ms !important;
  }
}
</style>
