import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  return db.prepare('SELECT * FROM tours ORDER BY sort_order').all()
})
