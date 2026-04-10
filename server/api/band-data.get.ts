import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 获取 Hero 数据
  const { data: hero } = await supabase
    .from('hero')
    .select('*')
    .limit(1)
    .single()

  // 获取 Legend 数据
  const { data: legend } = await supabase
    .from('legend')
    .select('*')
    .limit(1)
    .single()

  // 获取现任成员
  const { data: currentMembers } = await supabase
    .from('members')
    .select('*')
    .eq('is_current', true)
    .order('sort_order')

  // 获取历任成员
  const { data: formerMembers } = await supabase
    .from('members')
    .select('*')
    .eq('is_current', false)
    .order('sort_order')

  // 获取专辑数据（包含曲目）
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('sort_order')

  // 获取每个专辑的曲目
  const albumsWithTracks = await Promise.all(
    (albums || []).map(async (album) => {
      const { data: tracks } = await supabase
        .from('album_tracks')
        .select('id, title, audio_url')
        .eq('album_id', album.id)
        .order('track_number')

      return {
        ...album,
        tracks: (tracks || []).map(t => ({
          id: t.id,
          title: t.title,
          audio_url: t.audio_url
        }))
      }
    })
  )

  // 获取巡演数据
  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .order('sort_order')

  // 获取图集数据
  const { data: gallery } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  // 获取联系方式
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .limit(1)
    .single()

  // 获取社交媒体链接
  const { data: socials } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order')

  return {
    hero: hero || {},
    legend: legend || {},
    members: {
      current: currentMembers || [],
      former: formerMembers || []
    },
    albums: albumsWithTracks,
    tours: tours || [],
    gallery: gallery || [],
    contacts: {
      ...(contacts || { email: '' }),
      socials: socials || []
    }
  }
})
