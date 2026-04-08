import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useSupabase()

  // 获取联系方式
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('*')
    .limit(1)
    .single()

  // 获取社交媒体链接
  const { data: socials, error: socialsError } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order')

  if (contactsError && contactsError.code !== 'PGRST116') {
    // PGRST116 是 "no rows returned" 错误，可以忽略
    console.error('获取联系方式失败:', contactsError)
  }

  if (socialsError) {
    console.error('获取社交媒体链接失败:', socialsError)
  }

  return {
    ...(contacts || { email: '' }),
    socials: socials || []
  }
})
