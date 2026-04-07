<script setup lang="ts">
/**
 * DiscographySection - 作品区块
 *
 * 响应式适配：
 * - 桌面端：横向卡片（封面左 + 信息右）
 * - 移动端：纵向卡片（封面上 + 信息下）
 */

interface Album {
  title: string
  year: string
  cover: string
  tracks?: string[]
}

interface DiscographySectionProps {
  albums: Album[]
}

const props = defineProps<DiscographySectionProps>()

// 展开状态管理
const expandedAlbums = ref<Set<string>>(new Set())

function toggleTracks(albumTitle: string) {
  if (expandedAlbums.value.has(albumTitle)) {
    expandedAlbums.value.delete(albumTitle)
  } else {
    expandedAlbums.value.add(albumTitle)
  }
}

function isExpanded(albumTitle: string): boolean {
  return expandedAlbums.value.has(albumTitle)
}
</script>

<template>
  <section
    id="discography"
    class="discography-section"
    aria-labelledby="discography-title"
  >
    <div class="container">
      <!-- 章节标题 -->
      <div class="section-header">
        <h2 id="discography-title" class="section-title">
          Discography 作品
        </h2>
        <div class="red-line" />
      </div>

      <!-- 专辑列表 -->
      <div class="albums-list">
        <div
          v-for="album in albums"
          :key="album.title"
          class="album-card"
        >
          <!-- 封面 -->
          <div class="album-cover">
            <img
              :src="album.cover"
              :alt="album.title"
              class="cover-image"
              loading="lazy"
            />
          </div>

          <!-- 信息 -->
          <div class="album-info">
            <h3 class="album-title">
              {{ album.title }} ({{ album.year }})
            </h3>

            <!-- 展开/收起的曲目列表 -->
            <div
              v-if="album.tracks && album.tracks.length > 0"
              v-show="isExpanded(album.title)"
              class="tracks-list"
            >
              <ul class="tracks">
                <li
                  v-for="(track, idx) in album.tracks"
                  :key="idx"
                  class="track-item"
                >
                  {{ idx + 1 }}. {{ track }}
                </li>
              </ul>
            </div>

            <!-- 展开按钮 -->
            <button
              v-if="album.tracks && album.tracks.length > 0"
              class="toggle-btn"
              @click="toggleTracks(album.title)"
            >
              {{ isExpanded(album.title) ? '收起曲目' : '查看曲目' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Discography区设计规范: padding: [72, 140]
.discography-section {
  padding: 72px 0;
  background-color: #07070A;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 140px;
}

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

.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
}

.albums-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.album-card {
  display: flex;
  flex-direction: row;
  gap: 18px;
  padding: 14px;
  background-color: #1F0F17;
  border-radius: 4px;
}

.album-cover {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.album-title {
  color: #CAC1DB;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
}

.tracks-list {
  margin-top: 16px;
}

.tracks {
  color: #9F99AD;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-btn {
  margin-top: 16px;
  color: #9F99AD;
  font-size: 14px;
  transition: color 180ms ease;
  width: fit-content;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #D6CCEA;
  }
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

  .album-card {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .album-cover {
    width: 100%;
    height: 200px;
  }

  .album-title {
    font-size: 16px;
  }

  .toggle-btn {
    margin-top: 12px;
  }
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .toggle-btn {
    transition: none;
  }
}
</style>
