import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)
  const { id, name, role, image, is_current } = body

  if (id) {
    // 更新成员
    const { error } = await supabase
      .from('members')
      .update({
        name,
        role,
        image,
        is_current: is_current ? true : false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('更新成员失败:', error)
      throw createError({ statusCode: 500, statusMessage: '更新失败' })
    }

    return { success: true, message: '成员信息已更新' }
  } else {
    // 获取最大排序号
    const { data: maxOrderData } = await supabase
      .from('members')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const maxOrder = maxOrderData?.sort_order || 0

    // 新增成员
    const { data: result, error } = await supabase
      .from('members')
      .insert({
        name,
        role,
        image,
        is_current: is_current ? true : false,
        sort_order: maxOrder + 1
      })
      .select('id')
      .single()

    if (error) {
      console.error('新增成员失败:', error)
      throw createError({ statusCode: 500, statusMessage: '新增失败' })
    }

    return { success: true, message: '成员已添加', id: result.id }
  }
})
