<script setup lang="ts">
/**
 * AudioPlayerBar - 底部播放控制条
 *
 * 固定在页面底部，显示当前播放曲目信息、播放/暂停、进度条和时间
 */

const {
  state: playerState,
  currentTime,
  duration,
  currentTrackTitle,
  play,
  pause,
  resume,
  stop,
  seek
} = useAudioPlayer()

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function handleSeek(value: number) {
  seek(value)
}

function togglePlayPause() {
  if (playerState.value === 'playing') {
    pause()
  } else if (playerState.value === 'paused') {
    resume()
  }
}

function handleClose() {
  stop()
}

const isVisible = computed(() => playerState.value !== 'idle')
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="player-bar"
      >
        <!-- 曲目信息 -->
        <div class="player-track-info">
          <div class="player-track-icon">
            <div class="mini-equalizer">
              <span />
              <span />
              <span />
            </div>
          </div>
          <span class="player-track-name">{{ currentTrackTitle || 'Unknown Track' }}</span>
        </div>

        <!-- 播放控制 -->
        <div class="player-controls">
          <button
            class="player-play-btn"
            @click="togglePlayPause"
          >
            {{ playerState === 'playing' ? '⏸' : '▶' }}
          </button>
        </div>

        <!-- 进度条 -->
        <div class="player-progress">
          <span class="player-time">{{ formatTime(currentTime) }}</span>
          <input
            type="range"
            :min="0"
            :max="duration || 100"
            :step="0.1"
            :value="currentTime"
            @input="handleSeek(Number(($event.target as HTMLInputElement).value))"
            class="player-slider"
          />
          <span class="player-time">{{ formatTime(duration) }}</span>
        </div>

        <!-- 关闭按钮 -->
        <button
          class="player-close-btn"
          @click="handleClose"
        >
          ✕
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  height: 64px;
  background: #1F0F17;
  border-top: 1px solid rgba(255, 23, 79, 0.4);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

.player-track-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 180px;
  max-width: 240px;
  flex-shrink: 0;
}

.player-track-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: rgba(255, 23, 79, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mini-equalizer {
  display: flex;
  align-items: flex-end;
  gap: 1.5px;
  height: 12px;

  span {
    display: block;
    width: 2px;
    background-color: #FF174F;
    border-radius: 1px;
    animation: equalize 0.8s ease-in-out infinite;

    &:nth-child(1) { animation-delay: 0s; height: 4px; }
    &:nth-child(2) { animation-delay: 0.15s; height: 8px; }
    &:nth-child(3) { animation-delay: 0.3s; height: 6px; }
  }
}

@keyframes equalize {
  0%, 100% { height: 3px; }
  50% { height: 12px; }
}

.player-track-name {
  color: #CAC1DB;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.player-play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 23, 79, 0.5);
  background: rgba(255, 23, 79, 0.1);
  color: #FF174F;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease;

  &:hover {
    background: rgba(255, 23, 79, 0.2);
    border-color: #FF174F;
  }
}

.player-progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.player-time {
  color: #9F99AD;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  min-width: 36px;
  text-align: center;
}

.player-slider {
  flex: 1;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(159, 153, 173, 0.3);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  transition: height 150ms ease;

  &:hover {
    height: 6px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF174F;
    cursor: pointer;
    box-shadow: 0 0 6px rgba(255, 23, 79, 0.4);
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF174F;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 6px rgba(255, 23, 79, 0.4);
  }

  &::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #FF174F 0%, #FF174F var(--progress, 0%), rgba(159, 153, 173, 0.3) var(--progress, 0%));
    height: 4px;
    border-radius: 2px;
  }
}

.player-close-btn {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: none;
  background: none;
  color: #9F99AD;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 180ms ease;
  flex-shrink: 0;

  &:hover {
    color: #FF2F7D;
    background-color: rgba(255, 23, 79, 0.1);
  }
}

// 动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 300ms ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

// 响应式
@media (max-width: 768px) {
  .player-bar {
    height: 56px;
    padding: 0 12px;
    gap: 8px;
  }

  .player-track-info {
    min-width: 100px;
    max-width: 140px;
  }

  .player-track-icon {
    width: 28px;
    height: 28px;
  }

  .player-track-name {
    font-size: 12px;
  }

  .player-play-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .player-time {
    font-size: 10px;
    min-width: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
  }

  .mini-equalizer span {
    animation: none;
    height: 8px;
  }
}
</style>
