import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少巡演ID' })
  }

  db.prepare('DELETE FROM tours WHERE id = ?').run(id)
  return { success: true, message: '巡演已删除' }
})
