import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)

  const { title, subtitle, description, background_image, video } = body

  const existing = db.prepare('SELECT id FROM hero LIMIT 1').get() as { id: number } | undefined

  if (existing) {
    db.prepare(`
      UPDATE hero SET
        title = ?,
        subtitle = ?,
        description = ?,
        background_image = ?,
        video = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, subtitle, description, background_image, video, existing.id)
  } else {
    db.prepare(`
      INSERT INTO hero (title, subtitle, description, background_image, video)
      VALUES (?, ?, ?, ?, ?)
    `).run(title, subtitle, description, background_image, video)
  }

  return { success: true, message: 'Hero 数据已更新' }
})
