import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  const albums = db.prepare('SELECT * FROM albums ORDER BY sort_order').all()

  return albums.map((album: any) => {
    const tracks = db.prepare('SELECT id, title, track_number FROM album_tracks WHERE album_id = ? ORDER BY track_number').all(album.id)
    return {
      ...album,
      tracks
    }
  })
})
