export default defineNuxtRouteMiddleware(async (to) => {
  // 登录页面不需要验证
  if (to.path === '/admin/login') {
    return
  }

  // 检查是否已登录
  try {
    const { loggedIn } = await $fetch('/api/auth/check')

    if (!loggedIn) {
      // 未登录，跳转到登录页
      return navigateTo({
        path: '/admin/login',
        query: { redirect: to.fullPath }
      })
    }
  } catch {
    // 请求失败，也跳转到登录页
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath }
    })
  }
})
