import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)

  const { title, subtitle, image, content } = body

  const existing = db.prepare('SELECT id FROM legend LIMIT 1').get() as { id: number } | undefined

  if (existing) {
    db.prepare(`
      UPDATE legend SET
        title = ?,
        subtitle = ?,
        image = ?,
        content = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, subtitle, image, content, existing.id)
  } else {
    db.prepare(`
      INSERT INTO legend (title, subtitle, image, content)
      VALUES (?, ?, ?, ?)
    `).run(title, subtitle, image, content)
  }

  return { success: true, message: 'Legend 数据已更新' }
})
