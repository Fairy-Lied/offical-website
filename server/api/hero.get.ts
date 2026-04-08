import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('hero')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('获取 Hero 数据失败:', error)
    return {}
  }

  return data || {}
})
