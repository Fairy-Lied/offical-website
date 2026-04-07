import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  const currentMembers = db.prepare('SELECT * FROM members WHERE is_current = 1 ORDER BY sort_order').all()
  const formerMembers = db.prepare('SELECT * FROM members WHERE is_current = 0 ORDER BY sort_order').all()

  return {
    current: currentMembers,
    former: formerMembers
  }
})
