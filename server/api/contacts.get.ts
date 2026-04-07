import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()
  const contacts = db.prepare('SELECT * FROM contacts LIMIT 1').get() || { email: '' }
  const socials = db.prepare('SELECT * FROM social_links ORDER BY sort_order').all()

  return {
    ...contacts,
    socials
  }
})
