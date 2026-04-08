import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少专辑ID' })
  }

  // 删除专辑（album_tracks 会因为外键约束自动删除）
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    console.error('删除专辑失败:', error)
    throw createError({ statusCode: 500, statusMessage: '删除失败' })
  }

  return { success: true, message: '专辑已删除' }
})
