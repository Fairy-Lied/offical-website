import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)
  const { id, date, city, venue, status, ticket_url } = body

  if (id) {
    // 更新巡演
    const { error } = await supabase
      .from('tours')
      .update({
        date,
        city,
        venue,
        status,
        ticket_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('更新巡演失败:', error)
      throw createError({ statusCode: 500, statusMessage: '更新失败' })
    }

    return { success: true, message: '巡演信息已更新' }
  } else {
    // 获取最大排序号
    const { data: maxOrderData } = await supabase
      .from('tours')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const maxOrder = maxOrderData?.sort_order || 0

    // 新增巡演
    const { data: result, error } = await supabase
      .from('tours')
      .insert({
        date,
        city,
        venue,
        status,
        ticket_url,
        sort_order: maxOrder + 1
      })
      .select('id')
      .single()

    if (error) {
      console.error('新增巡演失败:', error)
      throw createError({ statusCode: 500, statusMessage: '新增失败' })
    }

    return { success: true, message: '巡演已添加', id: result.id }
  }
})
