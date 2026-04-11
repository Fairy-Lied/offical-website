<script setup lang="ts">
/**
 * DiscographySection - 作品区块
 *
 * 响应式适配：
 * - 桌面端：横向卡片（封面左 + 信息右）
 * - 移动端：纵向卡片（封面上 + 信息下）
 *
 * 新增：加密音频播放功能
 */

interface Track {
  title: string
  audio_url?: string | null
  lyrics?: string | null
  id?: number
}

interface Album {
  title: string
  year: string
  cover: string
  tracks?: Track[]
}

interface DiscographySectionProps {
  albums: Album[]
}

const props = defineProps<DiscographySectionProps>()

// 展开状态管理
const expandedAlbums = ref<Set<string>>(new Set())

// 分页状态
const visibleCount = ref(2)
const showMore = computed(() => props.albums.length > visibleCount.value)
const visibleAlbums = computed(() => props.albums.slice(0, visibleCount.value))

// 加载更多
function loadMore() {
  visibleCount.value += 2
}

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

// 音频播放
const { state: playerState, play: playTrack, pause: pauseTrack, resume: resumeTrack, stop: stopTrack } = useAudioPlayer()
const playingTrackId = ref<number | null>(null)

// 歌词弹窗
const isLyricsModalOpen = ref(false)
const currentLyrics = ref('')
const currentLyricsTitle = ref('')

function openLyrics(trackTitle: string, lyrics: string) {
  currentLyricsTitle.value = trackTitle
  currentLyrics.value = lyrics
  isLyricsModalOpen.value = true
}

function getTrackId(track: Track, albumTitle: string, trackIndex: number): number {
  if (track.id) return track.id
  // fallback: 生成一个伪 ID（实际播放需要真实 ID）
  return parseInt(`${albumTitle.charCodeAt(0)}${trackIndex}`)
}

async function handlePlay(albumTitle: string, trackIndex: number, track: Track) {
  const trackId = getTrackId(track, albumTitle, trackIndex)

  // 同一首曲目：切换播放/暂停
  if (playingTrackId.value === trackId) {
    if (playerState.value === 'playing') {
      pauseTrack()
      return
    }
    if (playerState.value === 'paused') {
      await resumeTrack()
      return
    }
  }

  // 不同曲目：重新播放
  playingTrackId.value = trackId
  await playTrack(trackId, track.title)
}

function isTrackPlaying(albumTitle: string, trackIndex: number, track: Track): boolean {
  return playingTrackId.value === getTrackId(track, albumTitle, trackIndex) && playerState.value === 'playing'
}

// 检查专辑是否有歌曲正在播放（仅播放中状态）
function isAlbumActive(albumTitle: string, albumTracks?: Track[]): boolean {
  if (!albumTracks || playingTrackId.value === null) return false
  if (playerState.value !== 'playing') return false
  return albumTracks.some((track, idx) => {
    const trackId = getTrackId(track, albumTitle, idx)
    return trackId === playingTrackId.value
  })
}
</script>

<template>
  <section
    id="discography"
    class="discography-section"
    aria-labelledby="discography-title"
  >
    <div class="section-container">
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
          v-for="album in visibleAlbums"
          :key="album.title"
          class="album-card"
          :class="{ 'album-playing': isAlbumActive(album.title, album.tracks) }"
        >
          <!-- 封面 -->
          <div class="album-cover">
            <img
              :src="album.cover"
              :alt="album.title"
              class="cover-image"
              loading="lazy"
              decoding="async"
              width="180"
              height="180"
            />
            <!-- 播放中遮罩指示器 -->
            <div
              v-if="isAlbumActive(album.title, album.tracks)"
              class="playing-indicator"
            >
              <div class="equalizer">
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>

          <!-- 信息 -->
          <div class="album-info">
            <h3 class="album-title">
              {{ album.title }}<template v-if="album.year"> ({{ album.year }})</template>
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
                  <span class="track-title">
                    <span>{{ idx + 1 }}. {{ track.title }}</span>
                    <!-- 歌词按钮 - 紧贴歌名 -->
                    <button
                      v-if="track.lyrics"
                      class="lyrics-btn"
                      @click="openLyrics(track.title, track.lyrics)"
                    >
                      📝
                    </button>
                  </span>
                  <template v-if="track.audio_url">
                    <!-- 加载中 -->
                    <span
                      v-if="playerState === 'loading' && playingTrackId === getTrackId(track, album.title, idx)"
                      class="loading-text"
                    >
                      加载中...
                    </span>
                    <!-- 播放/暂停按钮 -->
                    <button
                      v-else
                      class="play-btn"
                      :class="{ playing: isTrackPlaying(album.title, idx, track) }"
                      @click="handlePlay(album.title, idx, track)"
                    >
                      {{ isTrackPlaying(album.title, idx, track) ? '⏸' : '▶' }}
                    </button>
                  </template>
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

      <!-- 加载更多按钮 -->
      <div
        v-if="showMore"
        class="load-more-container"
      >
        <button
          class="load-more-btn"
          @click="loadMore"
        >
          加载更多
        </button>
      </div>
    </div>

    <!-- 歌词弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isLyricsModalOpen"
          class="lyrics-overlay"
          @click="isLyricsModalOpen = false"
        >
          <div
            class="lyrics-modal"
            @click.stop
          >
            <div class="lyrics-header">
              <h3 class="lyrics-title">{{ currentLyricsTitle }}</h3>
              <button
                class="lyrics-close"
                @click="isLyricsModalOpen = false"
              >
                ✕
              </button>
            </div>
            <pre class="lyrics-content">{{ currentLyrics }}</pre>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped lang="scss">
// Discography区设计规范: padding: [72, 140]
.discography-section {
  padding: 72px 0;
  background-color: #07070A;
}

/* 使用全局 .section-container */

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

.album-card {
  display: flex;
  flex-direction: row;
  gap: 18px;
  padding: 14px;
  background-color: #1F0F17;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &.album-playing {
    border-color: rgba(255, 23, 79, 0.4);
    box-shadow: 0 0 20px rgba(255, 23, 79, 0.15);
  }
}

.album-cover {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// 封面播放中指示器
.playing-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 10px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  display: flex;
  align-items: flex-end;
}

.equalizer {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 16px;

  span {
    display: block;
    width: 3px;
    background-color: #FF174F;
    border-radius: 1px;
    animation: equalize 1s ease-in-out infinite;

    &:nth-child(1) { animation-delay: 0s; height: 6px; }
    &:nth-child(2) { animation-delay: 0.2s; height: 12px; }
    &:nth-child(3) { animation-delay: 0.4s; height: 8px; }
    &:nth-child(4) { animation-delay: 0.1s; height: 14px; }
  }
}

@keyframes equalize {
  0%, 100% { height: 4px; }
  25% { height: 16px; }
  50% { height: 8px; }
  75% { height: 12px; }
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

.track-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.track-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.track-title > span:first-child {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.play-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9F99AD;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 180ms ease;
  flex-shrink: 0;

  &:hover {
    color: #FF2F7D;
    background-color: rgba(255, 23, 79, 0.1);
  }

  &.playing {
    color: #FF174F;
  }
}

.loading-text {
  color: #FF2F7D;
  font-size: 12px;
  flex-shrink: 0;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
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

// 加载更多按钮
.load-more-container {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.load-more-btn {
  padding: 10px 32px;
  background: transparent;
  border: 1px solid #9F99AD;
  border-radius: 4px;
  color: #9F99AD;
  font-size: 14px;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    border-color: #FF2F7D;
    color: #FF2F7D;
  }
}

// 歌词按钮
.lyrics-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  padding: 0 2px;
  border-radius: 4px;
  transition: all 180ms ease;
  flex-shrink: 0;
  line-height: 1;

  &:hover {
    background-color: rgba(255, 23, 79, 0.1);
    transform: scale(1.15);
  }
}

// 歌词弹窗
.lyrics-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lyrics-modal {
  background: #1F0F17;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 23, 79, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lyrics-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lyrics-title {
  color: #F2EEF8;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.lyrics-close {
  background: none;
  border: none;
  color: #9F99AD;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 180ms ease;

  &:hover {
    color: #FF2F7D;
    background-color: rgba(255, 23, 79, 0.1);
  }
}

.lyrics-content {
  padding: 24px;
  color: #CAC1DB;
  font-size: 14px;
  line-height: 1.8;
  font-family: inherit;
  white-space: pre-wrap;
  overflow-y: auto;
  margin: 0;
}

// 歌词弹窗动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式 - 平板
@media (max-width: 1024px) {
  // 使用全局响应式
}

// 响应式 - 移动端
@media (max-width: 768px) {
  // 使用全局响应式
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
