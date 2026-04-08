import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 获取所有巡演
  const { data: tours, error } = await supabase
    .from('tours')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('获取巡演列表失败:', error)
    return []
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 检查并更新过期演出状态
  const updatedTours = await Promise.all(
    (tours || []).map(async (tour) => {
      // 解析日期 YYYY.MM.DD
      const [year, month, day] = tour.date.split('.').map(Number)
      const tourDate = new Date(year, month - 1, day)

      // 如果演出日期已过且状态不是 ended，自动标记为已结束
      if (tourDate < today && tour.status !== 'ended') {
        const { error: updateError } = await supabase
          .from('tours')
          .update({ status: 'ended' })
          .eq('id', tour.id)

        if (updateError) {
          console.error('更新巡演状态失败:', updateError)
        }

        return { ...tour, status: 'ended' }
      }

      return tour
    })
  )

  return updatedTours
})
