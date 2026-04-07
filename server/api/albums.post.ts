import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)
  const { id, title, year, cover, tracks } = body

  if (id) {
    // 更新专辑
    db.prepare(`
      UPDATE albums SET
        title = ?,
        year = ?,
        cover = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, year, cover, id)

    // 删除旧曲目并重新插入
    db.prepare('DELETE FROM album_tracks WHERE album_id = ?').run(id)
    const trackStmt = db.prepare('INSERT INTO album_tracks (album_id, title, track_number) VALUES (?, ?, ?)')
    tracks.forEach((track: string, index: number) => {
      trackStmt.run(id, track, index + 1)
    })

    return { success: true, message: '专辑已更新' }
  } else {
    // 新增专辑
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM albums').get() as { max: number }
    const result = db.prepare(`
      INSERT INTO albums (title, year, cover, sort_order)
      VALUES (?, ?, ?, ?)
    `).run(title, year, cover, (maxOrder?.max || 0) + 1)

    const albumId = result.lastInsertRowid
    const trackStmt = db.prepare('INSERT INTO album_tracks (album_id, title, track_number) VALUES (?, ?, ?)')
    tracks.forEach((track: string, index: number) => {
      trackStmt.run(albumId, track, index + 1)
    })

    return { success: true, message: '专辑已添加', id: albumId }
  }
})
