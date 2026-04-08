<script setup lang="ts">
definePageMeta({
  layout: false
})

const toast = useToast()
const router = useRouter()
const route = useRoute()

const password = ref('')
const loading = ref(false)

// 如果已登录，跳转到后台首页
onMounted(async () => {
  const { loggedIn } = await $fetch('/api/auth/check')
  if (loggedIn) {
    router.push('/admin')
  }
})
const show=ref(false);
async function login() {
  if (!password.value.trim()) {
    toast.add({
      title: '请输入密码',
      color: 'error'
    })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: password.value }
    })
    toast.add({
      title: '登录成功',
      color: 'success'
    })
    // 跳转到之前尝试访问的页面或后台首页
    const redirect = route.query.redirect as string || '/admin'
    router.push(redirect)
  } catch (error: any) {
    toast.add({
      title: error.data?.message || '登录失败',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[9999] bg-[#060609] flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow border border-gray-700 overflow-hidden">
      <div class="p-8">
        <!-- Logo -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white">Fairy Lied</h1>
          <p class="text-gray-400 mt-2">管理后台登录</p>
        </div>

        <!-- 登录表单 -->
        <UForm @submit.prevent="login" class="space-y-6 w-1/2 m-auto">
          <UFormField label="密码" required class="w-full">
            <UInput
              v-model="password"
              :type="show ? 'text' : 'password'"
              placeholder="请输入管理密码"
              icon="i-heroicons-lock-closed"
              class="w-full"
              @keyup.enter="login"
            >
              <template #trailing>
                <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show ? 'Hide password' : 'Show password'"
                    :aria-pressed="show"
                    aria-controls="password"
                    @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>
          <UFormField class="w-full">
            <UButton
                type="submit"
                block
                :loading="loading"
                icon="i-heroicons-arrow-right-on-rectangle"
            >
              登录
            </UButton>
          </UFormField>
        </UForm>

        <!-- 返回前台 -->
        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-sm text-gray-400 hover:text-[#FF174F] transition-colors">
            ← 返回前台
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
