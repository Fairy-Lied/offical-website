import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 获取专辑列表
  const { data: albums, error: albumsError } = await supabase
    .from('albums')
    .select('*')
    .order('sort_order')

  if (albumsError) {
    console.error('获取专辑列表失败:', albumsError)
    return []
  }

  // 获取每个专辑的曲目
  const albumsData = await Promise.all(
    (albums || []).map(async (album) => {
      const { data: tracks, error: tracksError } = await supabase
        .from('album_tracks')
        .select('id, title, track_number, audio_url')
        .eq('album_id', album.id)
        .order('track_number')

      if (tracksError) {
        console.error(`获取专辑 ${album.id} 曲目失败:`, tracksError)
        return { ...album, tracks: [] }
      }

      return {
        ...album,
        tracks: tracks || []
      }
    })
  )

  return albumsData
})
