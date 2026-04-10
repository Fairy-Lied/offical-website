import { useSupabase } from '~/server/utils/supabase'

/**
 * 音乐播放密钥 API
 *
 * 生成一次性随机密钥，不存储到数据库
 * 每次请求返回不同的密钥，用于前端解密加密音频流
 */
export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)
  const { trackId } = body as { trackId: number }

  if (!trackId) {
    throw createError({ statusCode: 400, statusMessage: '缺少 trackId 参数' })
  }

  // 验证曲目存在
  const { data: track } = await supabase
    .from('album_tracks')
    .select('id, audio_url')
    .eq('id', trackId)
    .single()

  if (!track || !track.audio_url) {
    throw createError({ statusCode: 404, statusMessage: '曲目不存在或没有音频' })
  }

  // 生成 16 字节随机密钥
  const key = crypto.getRandomValues(new Uint8Array(16))

  return {
    trackId,
    key: Array.from(key) // 返回数字数组，前端可直接使用
  }
})
