import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)

  const { title, subtitle, description, background_image, video } = body

  // 检查是否存在记录
  const { data: existing } = await supabase
    .from('hero')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // 更新现有记录
    const { error } = await supabase
      .from('hero')
      .update({
        title,
        subtitle,
        description,
        background_image,
        video,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) {
      console.error('更新 Hero 数据失败:', error)
      throw createError({ statusCode: 500, statusMessage: '更新失败' })
    }
  } else {
    // 插入新记录
    const { error } = await supabase
      .from('hero')
      .insert({
        title,
        subtitle,
        description,
        background_image,
        video
      })

    if (error) {
      console.error('插入 Hero 数据失败:', error)
      throw createError({ statusCode: 500, statusMessage: '插入失败' })
    }
  }

  return { success: true, message: 'Hero 数据已更新' }
})
