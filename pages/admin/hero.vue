<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const { data: hero, refresh } = await useFetch('/api/hero')

const form = reactive({
  title: '',
  subtitle: '',
  description: '',
  background_image: '',
  video: ''
})

watchEffect(() => {
  if (hero.value) {
    form.title = hero.value.title || ''
    form.subtitle = hero.value.subtitle || ''
    form.description = hero.value.description || ''
    form.background_image = hero.value.background_image || ''
    form.video = hero.value.video || ''
  }
})

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/hero', {
      method: 'POST',
      body: form
    })
    toast.add({
      title: '保存成功',
      description: 'Hero 首屏信息已更新',
      color: 'green'
    })
    refresh()
  } catch (error) {
    toast.add({
      title: '保存失败',
      description: '请稍后重试',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

async function uploadImage(field: 'background_image' | 'video', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const result = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    form[field] = result.url
    toast.add({
      title: '上传成功',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: '上传失败',
      description: '请检查文件格式和大小',
      color: 'red'
    })
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white">Hero 首屏配置</h2>
      <p class="text-gray-400 mt-1">配置网站首页首屏的标题、背景图片和视频</p>
    </div>

    <AdminCard class="max-w-2xl">
      <div class="p-6">
        <form @submit.prevent="save" class="space-y-6">
          <UFormGroup label="主标题" required>
            <UInput v-model="form.title" placeholder="Fairy Lied" />
          </UFormGroup>

          <UFormGroup label="副标题" required>
            <UInput v-model="form.subtitle" placeholder="妖精说了谎" />
          </UFormGroup>

          <UFormGroup label="描述文字" required>
            <UInput v-model="form.description" placeholder="· Gothic / Symphonic Metal" />
          </UFormGroup>

          <UFormGroup label="背景图片">
            <div class="space-y-2">
              <UInput v-model="form.background_image" placeholder="/images/hero_bg.png" />
              <div class="flex items-center gap-4">
                <UButton
                  type="button"
                  color="gray"
                  variant="soft"
                  icon="i-heroicons-photo"
                  @click="$refs.bgInput?.click()"
                >
                  上传图片
                </UButton>
                <input
                  ref="bgInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="uploadImage('background_image', $event)"
                />
                <img
                  v-if="form.background_image"
                  :src="form.background_image"
                  class="h-16 w-auto rounded border border-gray-600"
                  alt="预览"
                />
              </div>
            </div>
          </UFormGroup>

          <UFormGroup label="背景视频">
            <div class="space-y-2">
              <UInput v-model="form.video" placeholder="/images/vj_1-2.mp4" />
              <UButton
                type="button"
                color="gray"
                variant="soft"
                icon="i-heroicons-video-camera"
                @click="$refs.videoInput?.click()"
              >
                上传视频
              </UButton>
              <input
                ref="videoInput"
                type="file"
                accept="video/*"
                class="hidden"
                @change="uploadImage('video', $event)"
              />
            </div>
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <UButton
              type="button"
              color="gray"
              variant="soft"
              @click="refresh()"
            >
              重置
            </UButton>
            <UButton
              type="submit"
              color="red"
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
