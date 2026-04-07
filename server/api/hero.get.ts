import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  const hero = db.prepare('SELECT * FROM hero LIMIT 1').get()
  return hero || {}
})
