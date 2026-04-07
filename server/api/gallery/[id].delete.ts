import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少图片ID' })
  }

  db.prepare('DELETE FROM gallery WHERE id = ?').run(id)
  return { success: true, message: '图片已删除' }
})
