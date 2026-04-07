import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const db = getDB()
  const body = await readBody(event)
  const { email, socials } = body

  // 更新邮箱
  const existing = db.prepare('SELECT id FROM contacts LIMIT 1').get() as { id: number } | undefined
  if (existing) {
    db.prepare('UPDATE contacts SET email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(email, existing.id)
  } else {
    db.prepare('INSERT INTO contacts (email) VALUES (?)').run(email)
  }

  // 更新社交媒体
  db.prepare('DELETE FROM social_links').run()
  const stmt = db.prepare('INSERT INTO social_links (platform, url, icon, sort_order) VALUES (?, ?, ?, ?)')
  socials.forEach((s: any, index: number) => {
    stmt.run(s.platform, s.url, s.icon, index)
  })

  return { success: true, message: '联系方式已更新' }
})
