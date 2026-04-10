/**
 * useAudioPlayer - 加密音频播放 composable
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

export function useAudioPlayer() {
  const audio = ref<HTMLAudioElement | null>(null)
  const state = ref<PlayerState>('idle')
  const error = ref<string | null>(null)
  let currentBlobUrl: string | null = null
  let cachedTrackId: number | null = null // 缓存当前播放的曲目 ID
  let currentRequestId: number | null = null // 当前进行中的请求 ID

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
    return currentRequestId !== null && currentRequestId !== requestId
  }

  // 清理资源（完全释放）
  function cleanup() {
    if (audio.value) {
      audio.value.pause()
      audio.value.src = ''
      audio.value = null
    }
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl)
      currentBlobUrl = null
    }
    cachedTrackId = null
  }

  // 暂停播放（保留 Blob URL，恢复时可直接播放）
  function pause() {
    if (audio.value) {
      audio.value.pause()
      state.value = 'paused'
    }
  }

  // 恢复播放（使用已缓存的 Blob URL）
  function resume(): Promise<void> {
    if (audio.value && state.value === 'paused') {
      audio.value.play()
      state.value = 'playing'
    }
    return Promise.resolve()
  }

  // 播放指定曲目
  async function play(trackId: number): Promise<void> {
    // 如果是同一首曲目且已暂停，直接恢复
    if (cachedTrackId === trackId && state.value === 'paused' && audio.value) {
      state.value = 'loading'
      try {
        await audio.value.play()
        state.value = 'playing'
        return
      } catch {
        // 如果恢复失败，走完整播放流程
      }
    }

    // 播放不同曲目或恢复失败：释放旧资源，重新请求
    cleanup()
    error.value = null
    state.value = 'loading'

    // 设置当前请求 ID，用于检测后续是否被取消
    const requestId = Date.now()
    currentRequestId = requestId
    cachedTrackId = trackId

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
      currentBlobUrl = URL.createObjectURL(blob)

      audio.value = new Audio(currentBlobUrl)
      audio.value.addEventListener('playing', () => {
        if (!isRequestCancelled(requestId)) state.value = 'playing'
      })
      audio.value.addEventListener('pause', () => { state.value = 'paused' })
      audio.value.addEventListener('ended', () => { state.value = 'idle' })
      audio.value.addEventListener('error', () => {
        if (!isRequestCancelled(requestId)) {
          error.value = '播放出错'
          state.value = 'error'
        }
      })

      await audio.value.play()
    } catch (e) {
      // 如果是被取消，静默退出
      if (isRequestCancelled(requestId)) return
      error.value = e instanceof Error ? e.message : '播放失败'
      state.value = 'error'
      cleanup()
    }
  }

  // 停止并释放
  function stop() {
    cleanup()
    currentRequestId = null
    state.value = 'idle'
  }

  onUnmounted(() => {
    cleanup()
    currentRequestId = null
  })

  return {
    audio,
    state,
    error,
    play,
    pause,
    resume,
    stop
  }
}
