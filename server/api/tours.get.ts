import { getDB } from '~/server/utils/db'

export default defineEventHandler(() => {
  const db = getDB()

  // 获取所有巡演
  const tours = db.prepare('SELECT * FROM tours ORDER BY date ASC').all() as any[]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 检查并更新过期演出状态
  const updatedTours = tours.map((tour: any) => {
    // 解析日期 YYYY.MM.DD
    const [year, month, day] = tour.date.split('.').map(Number)
    const tourDate = new Date(year, month - 1, day)

    // 如果演出日期已过且状态不是 ended，自动标记为已结束
    if (tourDate < today && tour.status !== 'ended') {
      db.prepare('UPDATE tours SET status = ? WHERE id = ?').run('ended', tour.id)
      return { ...tour, status: 'ended' }
    }

    return tour
  })

  return updatedTours
})
