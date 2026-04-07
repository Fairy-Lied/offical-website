import { getDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  if (!password) {
    throw createError({
      statusCode: 400,
      message: '请输入密码'
    })
  }

  const db = getDB()

  // 验证密码
  const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_password') as { value: string } | undefined

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
