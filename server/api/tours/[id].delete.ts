import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少巡演ID' })
  }

  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    console.error('删除巡演失败:', error)
    throw createError({ statusCode: 500, statusMessage: '删除失败' })
  }

  return { success: true, message: '巡演已删除' }
})
