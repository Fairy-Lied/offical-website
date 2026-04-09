import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('获取图集列表失败:', error)
    return []
  }

  return data || []
})
