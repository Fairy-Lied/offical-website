<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const { data: contacts, refresh } = await useFetch('/api/contacts')

const email = ref('')
const socials = ref<any[]>([])

watchEffect(() => {
  if (contacts.value) {
    email.value = contacts.value.email || ''
    socials.value = [...(contacts.value.socials || [])]
  }
})

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/contacts', {
      method: 'POST',
      body: {
        email: email.value,
        socials: socials.value
      }
    })
    toast.add({
      title: '保存成功',
      color: 'success'
    })
    refresh()
  } catch (error) {
    toast.add({
      title: '保存失败',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

function addSocial() {
  socials.value.push({
    platform: '',
    url: '',
    icon: ''
  })
}

function removeSocial(index: number) {
  socials.value.splice(index, 1)
}

const iconOptions = [
  { label: '微博', value: 'simple-icons:sinaweibo' },
  { label: 'Bilibili', value: 'simple-icons:bilibili' },
  { label: '网易云音乐', value: 'simple-icons:neteasecloudmusic' },
  { label: '微信', value: 'simple-icons:wechat' },
  { label: 'QQ音乐', value: 'simple-icons:qqmusic' },
  { label: '抖音', value: 'simple-icons:tiktok' },
  { label: '小红书', value: 'simple-icons:xiaohongshu' },
  { label: 'GitHub', value: 'simple-icons:github' },
  { label: 'Twitter/X', value: 'simple-icons:x' },
  { label: 'Instagram', value: 'simple-icons:instagram' },
  { label: 'YouTube', value: 'simple-icons:youtube' },
  { label: 'Spotify', value: 'simple-icons:spotify' },
  { label: 'Bandcamp', value: 'simple-icons:bandcamp' }
]
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white">联系方式</h2>
      <p class="text-gray-400 mt-1">管理联系邮箱和社交媒体链接</p>
    </div>

    <AdminCard class="max-w-2xl">
      <div class="p-6">
        <form @submit.prevent="save" class="space-y-6">
          <UFormField label="联系邮箱">
            <UInput
              v-model="email"
              type="email"
              placeholder="contact@fairylied.com"
            />
          </UFormField>

          <UFormField label="社交媒体">
            <div class="space-y-4">
              <div
                v-for="(social, index) in socials"
                :key="index"
                class="flex items-start gap-3 p-4 bg-gray-700 rounded-lg"
              >
                <div class="flex-1 grid grid-cols-3 gap-3">
                  <UInput
                    v-model="social.platform"
                    placeholder="平台名称"
                  />
                  <USelect
                    v-model="social.icon"
                    :items="iconOptions"
                    placeholder="选择图标"
                  />
                  <UInput
                    v-model="social.url"
                    placeholder="链接地址"
                  />
                </div>
                <UButton
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="removeSocial(index)"
                />
              </div>

              <UButton
                type="button"
                variant="soft"
                icon="i-heroicons-plus"
                @click="addSocial"
              >
                添加社交媒体
              </UButton>
            </div>
          </UFormField>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <UButton
              type="button"
              color="error"
              variant="soft"
              @click="refresh()"
            >
              重置
            </UButton>
            <UButton
              type="submit"
              :loading="saving"
              icon="i-heroicons-check"
            >
              保存更改
            </UButton>
          </div>
        </form>
      </div>
    </AdminCard>
  </div>
</template>
