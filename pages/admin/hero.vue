<script setup lang="ts">
import { uploadImage, uploadVideo } from '~/utils/upload'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const {data: hero, refresh} = await useFetch('/api/hero')

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
      color: 'success'
    })
    refresh()
  } catch (error) {
    toast.add({
      title: '保存失败',
      description: '请稍后重试',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

async function handleFileUpload(field: 'background_image' | 'video', event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = field === 'video'
      ? await uploadVideo(file)
      : await uploadImage(file)

    if (!result.success) {
      throw new Error(result.error)
    }

    form[field] = result.url
    toast.add({
      title: '上传成功',
      color: 'success'
    })
  } catch (error: any) {
    toast.add({
      title: '上传失败',
      description: error.message || '请检查文件格式和大小',
      color: 'error'
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
        <UForm @submit.prevent="save" class="space-y-6">
          <UFormField label="主标题" required class="w-full">
            <UInput v-model="form.title" placeholder="Fairy Lied" class="w-full"/>
          </UFormField>

          <UFormField label="副标题" required class="w-full">
            <UInput v-model="form.subtitle" placeholder="妖精说了谎" class="w-full"/>
          </UFormField>

          <UFormField label="描述文字" required class="w-full">
            <UInput v-model="form.description" placeholder="· Gothic / Symphonic Metal" class="w-full"/>
          </UFormField>

          <UFormField label="背景图片" class="w-full">
            <div class="space-y-2">
              <UInput v-model="form.background_image" placeholder="/images/hero_bg.png" class="w-full"/>
              <div class="flex items-center gap-4">
                <UButton
                    type="button"
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
                    @change="handleFileUpload('background_image', $event)"
                />
                <img
                    v-if="form.background_image"
                    :src="form.background_image"
                    class="h-16 w-auto rounded border border-gray-600"
                    alt="预览"
                />
              </div>
            </div>
          </UFormField>

          <UFormField label="背景视频" class="w-full">
            <div class="space-y-2">
              <UInput v-model="form.video" placeholder="/images/vj_1-2.mp4" class="w-full"/>
              <UButton
                  type="button"
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
                  @change="handleFileUpload('video', $event)"
              />
            </div>
          </UFormField>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <UButton
                type="button"
                variant="soft"
                color="error"
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
        </UForm>
      </div>
    </AdminCard>
  </div>
</template>
