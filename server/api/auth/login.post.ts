import { useSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      message: '请输入密码'
    })
  }

  const supabase = useSupabase()

  // 验证密码
  const { data: setting, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'admin_password')
    .single()

  // 默认密码: fairylied2024
  const correctPassword = setting?.value || 'fairylied2024'

  if (password !== correctPassword) {
    throw createError({
      statusCode: 401,
      message: '密码错误'
    })
  }

  // 设置 session
  await setUserSession(event, {
    user: {
      role: 'admin'
    },
    loggedInAt: Date.now()
  })

  return { success: true }
})
