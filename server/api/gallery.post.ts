import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)
  const { id, url, alt } = body

  if (id) {
    db.prepare(`
      UPDATE gallery SET
        url = ?,
        alt = ?
      WHERE id = ?
    `).run(url, alt, id)
    return { success: true, message: '图片信息已更新' }
  } else {
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM gallery').get() as { max: number }
    const result = db.prepare(`
      INSERT INTO gallery (url, alt, sort_order)
      VALUES (?, ?, ?)
    `).run(url, alt, (maxOrder?.max || 0) + 1)
    return { success: true, message: '图片已添加', id: result.lastInsertRowid }
  }
})
