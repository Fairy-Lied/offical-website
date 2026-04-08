import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 获取现任成员
  const { data: currentMembers, error: currentError } = await supabase
    .from('members')
    .select('*')
    .eq('is_current', true)
    .order('sort_order')

  // 获取历任成员
  const { data: formerMembers, error: formerError } = await supabase
    .from('members')
    .select('*')
    .eq('is_current', false)
    .order('sort_order')

  if (currentError || formerError) {
    console.error('获取成员数据失败:', currentError || formerError)
    return { current: [], former: [] }
  }

  return {
    current: currentMembers || [],
    former: formerMembers || []
  }
})
