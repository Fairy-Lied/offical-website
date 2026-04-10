/**
 * 加密音频流 API
 *
 * 从 Supabase 读取原始 MP3，使用传入的密钥进行 XOR 加密后返回
 * 前端必须先用 key.post.ts 获取密钥，然后用同一密钥请求此接口
 *
 * 使用方式：
 * 1. POST /api/music/key 获取密钥
 * 2. GET /api/music/stream/{trackId}?key=xxx 获取加密流
 * 3. 前端用密钥解密
 *
 * 优化：使用流式处理，边下载边加密边返回，无需等待完整下载
 */
import { createReadStream } from 'node:fs'

export default defineEventHandler(async (event) => {
  const trackId = getRouterParam(event, 'trackId')
  const query = getQuery(event)

  if (!trackId) {
    throw createError({ statusCode: 400, statusMessage: '缺少 trackId 参数' })
  }

  const keyStr = query.key as string

  if (!keyStr) {
    throw createError({ statusCode: 400, statusMessage: '缺少 key 参数' })
  }

  const supabase = useSupabase()

  // 获取曲目信息
  const { data: track } = await supabase
    .from('album_tracks')
    .select('id, audio_url')
    .eq('id', parseInt(trackId))
    .single()

  if (!track || !track.audio_url) {
    throw createError({ statusCode: 404, statusMessage: '曲目不存在或没有音频' })
  }

  // 解析密钥
  const key = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0))
  const keyLen = key.length

  // XOR 加密（流式分块处理）
  function xorEncryptChunk(input: Uint8Array, offset: number): Uint8Array {
    const output = new Uint8Array(input.length)
    for (let i = 0; i < input.length; i++) {
      const di = Number(input[i])
      const ki = Number(key[(offset + i) % keyLen])
      output[i] = di ^ ki
    }
    return output
  }

  // 流式下载 + 加密
  const response = await fetch(track.audio_url)
  if (!response.ok) {
    throw createError({ statusCode: 500, statusMessage: '无法获取音频文件' })
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw createError({ statusCode: 500, statusMessage: '无法读取音频流' })
  }

  setHeader(event, 'Content-Type', 'audio/mpeg')
  setHeader(event, 'Cache-Control', 'no-store')
  setHeader(event, 'Transfer-Encoding', 'chunked')

  // 返回流式响应
  return sendStream(event, new ReadableStream({
    async start(controller) {
      let offset = 0
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          if (value) {
            const encrypted = xorEncryptChunk(value, offset)
            controller.enqueue(encrypted)
            offset += value.length
          }
        }
        controller.close()
      } catch (e) {
        controller.error(e)
      }
    }
  }))
})
