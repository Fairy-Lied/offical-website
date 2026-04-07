<script setup lang="ts">
/**
 * GallerySection - 图集区块
 *
 * 功能：
 * - 响应式图片网格（桌面3列 / 移动2列）
 * - 点击打开灯箱浏览
 * - 图片懒加载
 * - 优先黑白/低饱和色调
 */

interface GalleryImage {
  id: string
  url: string
  alt: string
}

interface GallerySectionProps {
  images: GalleryImage[]
}

const props = defineProps<GallerySectionProps>()

// 灯箱状态
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

// 打开灯箱
function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <section
    id="gallery"
    class="gallery-section"
    aria-labelledby="gallery-title"
  >
    <div class="container">
      <!-- 章节标题 -->
      <div class="section-header">
        <h2 id="gallery-title" class="section-title">
          Gallery 图集
        </h2>
        <div class="red-line" />
      </div>

      <!-- 图片网格 -->
      <div
        class="gallery-grid"
        role="list"
        aria-label="演出照片"
      >
        <div
          v-for="(image, index) in images"
          :key="image.id"
          role="listitem"
          class="gallery-item"
          tabindex="0"
          :aria-label="`查看图片: ${image.alt}`"
          @click="openLightbox(index)"
          @keydown.enter="openLightbox(index)"
        >
          <!-- 图片 - 低饱和/黑白风格 -->
          <img
            :src="image.url"
            :alt="image.alt"
            loading="lazy"
            class="gallery-image"
          />

          <!-- 悬停遮罩 -->
          <div
            class="image-overlay"
            aria-hidden="true"
          />

          <!-- 查看图标 -->
          <div
            class="view-icon"
            aria-hidden="true"
          >
            <svg
              class="icon-svg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱组件 -->
    <ImageLightbox
      v-model="lightboxOpen"
      :images="images"
      :initial-index="lightboxIndex"
    />
  </section>
</template>

<style scoped lang="scss">
// Gallery区设计规范: padding: [72, 140]
.gallery-section {
  padding: 72px 0;
  background-color: #07070A;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 140px;
}

// 标题区: margin-bottom 12px (设计稿 gap: 12)
.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 30px;
  font-weight: 700;
  color: #F2EEF8;
  margin-bottom: 12px;
}

.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.gallery-item {
  position: relative;
  height: 140px;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(30%);
  transition: all 180ms ease;

  .gallery-item:hover & {
    filter: grayscale(0%);
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 180ms ease;

  .gallery-item:hover & {
    opacity: 1;
  }
}

.view-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 180ms ease;

  .gallery-item:hover & {
    opacity: 1;
  }
}

.icon-svg {
  width: 32px;
  height: 32px;
  color: rgba(255, 255, 255, 0.8);
}

// 键盘焦点样式
.gallery-item:focus-visible {
  outline: 2px solid #FF2F7D;
  outline-offset: 2px;
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

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .gallery-image,
  .image-overlay,
  .view-icon {
    transition: none !important;

    .gallery-item:hover & {
      transform: none;
    }
  }
}
</style>
