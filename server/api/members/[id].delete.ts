import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = useSupabase()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少成员ID' })
  }

  const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', parseInt(id))

  if (error) {
    console.error('删除成员失败:', error)
    throw createError({ statusCode: 500, statusMessage: '删除失败' })
  }

  return { success: true, message: '成员已删除' }
})
