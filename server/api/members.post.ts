import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)
  const { id, name, role, image, is_current } = body

  if (id) {
    // 更新
    db.prepare(`
      UPDATE members SET
        name = ?,
        role = ?,
        image = ?,
        is_current = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, role, image, is_current ? 1 : 0, id)
    return { success: true, message: '成员信息已更新' }
  } else {
    // 新增
    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM members').get() as { max: number }
    const result = db.prepare(`
      INSERT INTO members (name, role, image, is_current, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, role, image, is_current ? 1 : 0, (maxOrder?.max || 0) + 1)
    return { success: true, message: '成员已添加', id: result.lastInsertRowid }
  }
})
