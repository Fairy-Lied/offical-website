import { useSupabase } from '~/server/utils/supabase'

interface TrackData {
  title: string
  audio_url?: string
}

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)
  const { id, title, year, cover, tracks } = body as {
    id?: number
    title: string
    year: string
    cover: string
    tracks: TrackData[]
  }

  if (id) {
    // 更新专辑
    const { error: albumError } = await supabase
      .from('albums')
      .update({
        title,
        year,
        cover,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (albumError) {
      console.error('更新专辑失败:', albumError)
      throw createError({ statusCode: 500, statusMessage: '更新专辑失败' })
    }

    // 删除旧曲目
    const { error: deleteError } = await supabase
      .from('album_tracks')
      .delete()
      .eq('album_id', id)

    if (deleteError) {
      console.error('删除旧曲目失败:', deleteError)
      throw createError({ statusCode: 500, statusMessage: '删除旧曲目失败' })
    }

    // 插入新曲目
    if (tracks && tracks.length > 0) {
      const trackData = tracks.map((track: TrackData, index: number) => ({
        album_id: id,
        title: track.title,
        track_number: index + 1,
        audio_url: track.audio_url || null
      }))

      const { error: trackError } = await supabase
        .from('album_tracks')
        .insert(trackData)

      if (trackError) {
        console.error('插入曲目失败:', trackError)
        throw createError({ statusCode: 500, statusMessage: '插入曲目失败' })
      }
    }

    return { success: true, message: '专辑已更新' }
  } else {
    // 获取最大排序号
    const { data: maxOrderData } = await supabase
      .from('albums')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const maxOrder = maxOrderData?.sort_order || 0

    // 新增专辑
    const { data: result, error: albumError } = await supabase
      .from('albums')
      .insert({
        title,
        year,
        cover,
        sort_order: maxOrder + 1
      })
      .select('id')
      .single()

    if (albumError) {
      console.error('新增专辑失败:', albumError)
      throw createError({ statusCode: 500, statusMessage: '新增专辑失败' })
    }

    const albumId = result.id

    // 插入曲目
    if (tracks && tracks.length > 0) {
      const trackData = tracks.map((track: TrackData, index: number) => ({
        album_id: albumId,
        title: track.title,
        track_number: index + 1,
        audio_url: track.audio_url || null
      }))

      const { error: trackError } = await supabase
        .from('album_tracks')
        .insert(trackData)

      if (trackError) {
        console.error('插入曲目失败:', trackError)
        throw createError({ statusCode: 500, statusMessage: '插入曲目失败' })
      }
    }

    return { success: true, message: '专辑已添加', id: albumId }
  }
})
