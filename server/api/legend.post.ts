import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)

  const { title, subtitle, image, content } = body

  // 检查是否存在记录
  const { data: existing } = await supabase
    .from('legend')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // 更新现有记录
    const { error } = await supabase
      .from('legend')
      .update({
        title,
        subtitle,
        image,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) {
      console.error('更新 Legend 数据失败:', error)
      throw createError({ statusCode: 500, statusMessage: '更新失败' })
    }
  } else {
    // 插入新记录
    const { error } = await supabase
      .from('legend')
      .insert({
        title,
        subtitle,
        image,
        content
      })

    if (error) {
      console.error('插入 Legend 数据失败:', error)
      throw createError({ statusCode: 500, statusMessage: '插入失败' })
    }
  }

  return { success: true, message: 'Legend 数据已更新' }
})
