import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  const legend = db.prepare('SELECT * FROM legend LIMIT 1').get()
  return legend || {}
})
