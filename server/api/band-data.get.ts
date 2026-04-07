import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()

  // 获取 Hero 数据
  const hero = db.prepare('SELECT * FROM hero LIMIT 1').get()

  // 获取 Legend 数据
  const legend = db.prepare('SELECT * FROM legend LIMIT 1').get()

  // 获取成员数据
  const currentMembers = db.prepare('SELECT * FROM members WHERE is_current = 1 ORDER BY sort_order').all()
  const formerMembers = db.prepare('SELECT * FROM members WHERE is_current = 0 ORDER BY sort_order').all()

  // 获取专辑数据（包含曲目）
  const albums = db.prepare('SELECT * FROM albums ORDER BY sort_order').all()
  const albumsWithTracks = albums.map((album: any) => {
    const tracks = db.prepare('SELECT title FROM album_tracks WHERE album_id = ? ORDER BY track_number').all(album.id)
    return {
      ...album,
      tracks: tracks.map((t: any) => t.title)
    }
  })

  // 获取巡演数据
  const tours = db.prepare('SELECT * FROM tours ORDER BY sort_order').all()

  // 获取图集数据
  const gallery = db.prepare('SELECT * FROM gallery ORDER BY sort_order').all()

  // 获取联系方式
  const contacts = db.prepare('SELECT * FROM contacts LIMIT 1').get() || { email: '' }
  const socials = db.prepare('SELECT * FROM social_links ORDER BY sort_order').all()

  return {
    hero: hero || {},
    legend: legend || {},
    members: {
      current: currentMembers,
      former: formerMembers
    },
    albums: albumsWithTracks,
    tours,
    gallery,
    contacts: {
      ...contacts,
      socials
    }
  }
})
