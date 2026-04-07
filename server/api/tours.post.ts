import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)
  const { id, date, city, venue, status, ticket_url } = body

  if (id) {
    db.prepare(`
      UPDATE tours SET
        date = ?,
        city = ?,
        venue = ?,
        status = ?,
        ticket_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(date, city, venue, status, ticket_url, id)
    return { success: true, message: '巡演信息已更新' }
  } else {
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM tours').get() as { max: number }
    const result = db.prepare(`
      INSERT INTO tours (date, city, venue, status, ticket_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(date, city, venue, status, ticket_url, (maxOrder?.max || 0) + 1)
    return { success: true, message: '巡演已添加', id: result.lastInsertRowid }
  }
})
