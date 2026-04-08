import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const body = await readBody(event)
  const { email, socials } = body

  // 更新或插入邮箱
  const { data: existing } = await supabase
    .from('contacts')
    .select('id')
    .limit(1)
    .single()

  if (existing) {
    // 更新现有记录
    const { error } = await supabase
      .from('contacts')
      .update({
        email,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)

    if (error) {
      console.error('更新联系方式失败:', error)
      throw createError({ statusCode: 500, statusMessage: '更新失败' })
    }
  } else {
    // 插入新记录
    const { error } = await supabase
      .from('contacts')
      .insert({ email })

    if (error) {
      console.error('插入联系方式失败:', error)
      throw createError({ statusCode: 500, statusMessage: '插入失败' })
    }
  }

  // 删除所有旧的社交媒体链接
  const { error: deleteError } = await supabase
    .from('social_links')
    .delete()
    .neq('id', 0) // 删除所有记录

  if (deleteError) {
    console.error('删除旧社交媒体链接失败:', deleteError)
    throw createError({ statusCode: 500, statusMessage: '更新社交媒体链接失败' })
  }

  // 插入新的社交媒体链接
  if (socials && socials.length > 0) {
    const socialData = socials.map((s: any, index: number) => ({
      platform: s.platform,
      url: s.url,
      icon: s.icon,
      sort_order: index
    }))

    const { error: insertError } = await supabase
      .from('social_links')
      .insert(socialData)

    if (insertError) {
      console.error('插入社交媒体链接失败:', insertError)
      throw createError({ statusCode: 500, statusMessage: '插入社交媒体链接失败' })
    }
  }

  return { success: true, message: '联系方式已更新' }
})
