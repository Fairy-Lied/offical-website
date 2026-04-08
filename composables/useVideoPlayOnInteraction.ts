/**
 * useVideoPlayOnInteraction - 用户交互后自动播放视频
 *
 * 解决浏览器自动播放策略问题：
 * - 监听首次用户交互（点击、触摸、键盘）
 * - 交互后自动播放指定视频元素
 * - 支持多个视频元素
 * - 自动清理事件监听
 */
export function useVideoPlayOnInteraction() {
  const videoElements = ref<HTMLVideoElement[]>([])
  const hasInteracted = ref(false)
  const isPlaying = ref(false)

  /**
   * 注册视频元素
   */
  const registerVideo = (video: HTMLVideoElement) => {
    if (!videoElements.value.includes(video)) {
      videoElements.value.push(video)
    }

    // 如果用户已经交互过，立即尝试播放
    if (hasInteracted.value) {
      playVideo(video)
    }
  }

  /**
   * 移除视频元素
   */
  const unregisterVideo = (video: HTMLVideoElement) => {
    const index = videoElements.value.indexOf(video)
    if (index > -1) {
      videoElements.value.splice(index, 1)
    }
  }

  /**
   * 播放单个视频
   */
  const playVideo = async (video: HTMLVideoElement) => {
    try {
      await video.play()
      isPlaying.value = true
    } catch (error) {
      // 自动播放被阻止，静默处理
      console.warn('视频播放失败:', error)
    }
  }

  /**
   * 播放所有已注册的视频
   */
  const playAllVideos = () => {
    videoElements.value.forEach(playVideo)
  }

  /**
   * 处理用户交互
   */
  const handleInteraction = () => {
    if (hasInteracted.value) return

    hasInteracted.value = true
    playAllVideos()

    // 移除事件监听器
    removeEventListeners()
  }

  /**
   * 添加事件监听器
   */
  const addEventListeners = () => {
    const options: AddEventListenerOptions = { once: true, passive: true }

    document.addEventListener('click', handleInteraction, options)
    document.addEventListener('touchstart', handleInteraction, options)
    document.addEventListener('keydown', handleInteraction, options)
    document.addEventListener('wheel', handleInteraction, options)
    document.addEventListener('scroll', handleInteraction, options)
  }

  /**
   * 移除事件监听器
   */
  const removeEventListeners = () => {
    document.removeEventListener('click', handleInteraction)
    document.removeEventListener('touchstart', handleInteraction)
    document.removeEventListener('keydown', handleInteraction)
    document.removeEventListener('wheel', handleInteraction)
    document.removeEventListener('scroll', handleInteraction)
  }

  onMounted(() => {
    addEventListeners()
  })

  onUnmounted(() => {
    removeEventListeners()
  })

  return {
    registerVideo,
    unregisterVideo,
    hasInteracted: readonly(hasInteracted),
    isPlaying: readonly(isPlaying)
  }
}
