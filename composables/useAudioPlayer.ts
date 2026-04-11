/**
 * useAudioPlayer - 加密音频播放 composable
 *
 * 使用单例模式：所有组件调用 useAudioPlayer() 共享同一份状态，
 * 保证 DiscographySection 和 AudioPlayerBar 之间的状态同步。
 *
 * 流程：
 * 1. 请求服务端获取一次性随机密钥
 * 2. 使用密钥请求加密音频流
 * 3. XOR 解密音频数据
 * 4. 转为 Blob URL 通过 <audio> 播放
 * 5. 暂停后恢复直接从 Blob URL 继续播放（无需重新加密）
 * 6. 停止时释放内存
 *
 * 缓存策略：
 * - 暂停(pause)：保留 Blob URL 和 audio 元素，恢复时直接 play()
 * - 停止(stop)：释放 Blob URL 和 audio 元素
 * - 播放新曲目：自动释放旧资源，重新请求+解密
 */

type PlayerState = 'idle' | 'loading' | 'playing' | 'error' | 'paused'

// ===== 单例共享状态（模块级别，所有组件实例共享）=====
const sharedAudio = ref<HTMLAudioElement | null>(null)
const sharedState = ref<PlayerState>('idle')
const sharedError = ref<string | null>(null)
const sharedCurrentTime = ref(0)
const sharedDuration = ref(0)
const sharedCurrentTrackTitle = ref('')
let sharedBlobUrl: string | null = null
let sharedCachedTrackId: number | null = null
let sharedCachedTrackTitle: string | null = null
let sharedCurrentRequestId: number | null = null
let sharedInstanceCount = 0

// 命名事件处理器，用于 cleanup 时正确移除
let onTimeUpdateHandler: (() => void) | null = null
let onPlayingHandler: (() => void) | null = null
let onPauseHandler: (() => void) | null = null
let onEndedHandler: (() => void) | null = null
let onErrorHandler: (() => void) | null = null

// XOR 解密（与服务端加密对称）
function xorDecrypt(data: Uint8Array, key: Uint8Array): Uint8Array {
  const output = new Uint8Array(data.length)
  const keyLen = key.length
  for (let i = 0; i < data.length; i++) {
    const di = Number(data[i])
    const ki = Number(key[i % keyLen])
    output[i] = di ^ ki
  }
  return output
}

// 检查当前请求是否已被取消（用户点了其他歌曲）
function isRequestCancelled(requestId: number): boolean {
  return sharedCurrentRequestId !== null && sharedCurrentRequestId !== requestId
}

// 清理资源（完全释放）
function cleanup() {
  if (sharedAudio.value) {
    const el = sharedAudio.value
    // 先移除所有事件监听器，防止后续 pause/error 事件回调覆盖状态
    if (onTimeUpdateHandler) el.removeEventListener('timeupdate', onTimeUpdateHandler)
    if (onPlayingHandler) el.removeEventListener('playing', onPlayingHandler)
    if (onPauseHandler) el.removeEventListener('pause', onPauseHandler)
    if (onEndedHandler) el.removeEventListener('ended', onEndedHandler)
    if (onErrorHandler) el.removeEventListener('error', onErrorHandler)
    onTimeUpdateHandler = null
    onPlayingHandler = null
    onPauseHandler = null
    onEndedHandler = null
    onErrorHandler = null
    sharedAudio.value = null
    el.pause()
    el.src = ''
  }
  if (sharedBlobUrl) {
    URL.revokeObjectURL(sharedBlobUrl)
    sharedBlobUrl = null
  }
  sharedCachedTrackId = null
  sharedCachedTrackTitle = null
  sharedCurrentTime.value = 0
  sharedDuration.value = 0
}

// 暂停播放（保留 Blob URL，恢复时可直接播放）
function pause() {
  if (sharedAudio.value) {
    sharedAudio.value.pause()
    sharedState.value = 'paused'
  }
}

// 恢复播放（使用已缓存的 Blob URL）
function resume(): Promise<void> {
  if (sharedAudio.value && sharedState.value === 'paused') {
    sharedAudio.value.play()
    sharedState.value = 'playing'
  }
  return Promise.resolve()
}

// 播放指定曲目
async function play(trackId: number, trackTitle = ''): Promise<void> {
  // 如果是同一首曲目且已暂停，直接恢复
  if (sharedCachedTrackId === trackId && sharedState.value === 'paused' && sharedAudio.value) {
    sharedState.value = 'loading'
    try {
      await sharedAudio.value.play()
      sharedState.value = 'playing'
      return
    } catch {
      // 如果恢复失败，走完整播放流程
    }
  }

  // 播放不同曲目或恢复失败：释放旧资源，重新请求
  cleanup()
  sharedError.value = null
  sharedState.value = 'loading'
  sharedCurrentTrackTitle.value = trackTitle

  // 设置当前请求 ID，用于检测后续是否被取消
  const requestId = Date.now()
  sharedCurrentRequestId = requestId
  sharedCachedTrackId = trackId
  sharedCachedTrackTitle = trackTitle

  try {
    // 1. 获取密钥
    const { key } = await $fetch<{ key: number[] }>('/api/music/key', {
      method: 'POST',
      body: { trackId }
    })

    // 检查是否被取消
    if (isRequestCancelled(requestId)) return

    // 2. 下载加密流
    const keyStr = btoa(String.fromCharCode(...key))
    const response = await fetch(`/api/music/stream/${trackId}?key=${encodeURIComponent(keyStr)}`)

    if (!response.ok) {
      throw new Error(`获取音频失败: ${response.status}`)
    }

    // 再次检查是否被取消
    if (isRequestCancelled(requestId)) return

    // 3. 解密
    const encryptedBuffer = await response.arrayBuffer()
    const encryptedData = new Uint8Array(encryptedBuffer)
    const decrypted = xorDecrypt(encryptedData, new Uint8Array(key))

    // 最终检查
    if (isRequestCancelled(requestId)) return

    // 4. 创建 Blob URL 并播放
    const arrayBuffer = decrypted.buffer.slice(0, decrypted.byteLength) as ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' })
    sharedBlobUrl = URL.createObjectURL(blob)

    sharedAudio.value = new Audio(sharedBlobUrl)
    const audio = sharedAudio.value

    onTimeUpdateHandler = () => {
      if (sharedAudio.value) sharedCurrentTime.value = sharedAudio.value.currentTime
    }
    onPlayingHandler = () => {
      if (!isRequestCancelled(requestId)) sharedState.value = 'playing'
    }
    onPauseHandler = () => {
      if (sharedAudio.value) sharedState.value = 'paused'
    }
    onEndedHandler = () => {
      sharedState.value = 'idle'
    }
    onErrorHandler = () => {
      if (!isRequestCancelled(requestId)) {
        sharedError.value = '播放出错'
        sharedState.value = 'error'
      }
    }

    audio.addEventListener('loadedmetadata', () => {
      sharedDuration.value = sharedAudio.value?.duration || 0
    })
    audio.addEventListener('timeupdate', onTimeUpdateHandler)
    audio.addEventListener('playing', onPlayingHandler)
    audio.addEventListener('pause', onPauseHandler)
    audio.addEventListener('ended', onEndedHandler)
    audio.addEventListener('error', onErrorHandler)

    await audio.play()
  } catch (e) {
    // 如果是被取消，静默退出
    if (isRequestCancelled(requestId)) return
    sharedError.value = e instanceof Error ? e.message : '播放失败'
    sharedState.value = 'error'
    cleanup()
  }
}

// 停止并释放
function stop() {
  cleanup()
  sharedCurrentRequestId = null
  sharedState.value = 'idle'
}

// 跳转到指定时间
function seek(time: number) {
  if (sharedAudio.value) {
    sharedAudio.value.currentTime = time
    sharedCurrentTime.value = time
  }
}

export function useAudioPlayer() {
  sharedInstanceCount++

  onUnmounted(() => {
    sharedInstanceCount--
    // 只有当没有组件在使用时才清理
    if (sharedInstanceCount === 0) {
      cleanup()
      sharedCurrentRequestId = null
    }
  })

  return {
    audio: sharedAudio,
    state: sharedState,
    error: sharedError,
    currentTime: sharedCurrentTime,
    duration: sharedDuration,
    currentTrackTitle: sharedCurrentTrackTitle,
    play,
    pause,
    resume,
    stop,
    seek
  }
}
