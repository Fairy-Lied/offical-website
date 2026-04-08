<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const {data: legend, refresh} = await useFetch('/api/legend')

const form = reactive({
  title: '',
  subtitle: '',
  image: '',
  content: ''
})

watchEffect(() => {
  if (legend.value) {
    form.title = legend.value.title || ''
    form.subtitle = legend.value.subtitle || ''
    form.image = legend.value.image || ''
    form.content = legend.value.content || ''
  }
})

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/legend', {
      method: 'POST',
      body: form
    })
    toast.add({
      title: '保存成功',
      description: 'Legend 传说信息已更新',
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

async function uploadImage(event: Event) {
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
    form.image = result.url
    toast.add({
      title: '上传成功',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: '上传失败',
      description: '请检查文件格式和大小',
      color: 'error'
    })
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-white">Legend 传说介绍</h2>
      <p class="text-gray-400 mt-1">配置乐队传说介绍区块的内容</p>
    </div>

    <AdminCard class="max-w-3xl">
      <div class="p-6">
        <UForm @submit.prevent="save" class="space-y-6">
          <UFormField label="英文标题" required class="w-full">
            <UInput v-model="form.title" placeholder="The Legend" class="w-full"/>
          </UFormField>

          <UFormField label="中文副标题" required class="w-full">
            <UInput v-model="form.subtitle" placeholder="传说" class="w-full"/>
          </UFormField>

          <UFormField label="配图" class="w-full">
            <div class="space-y-2">
              <UInput v-model="form.image" placeholder="/images/legend.png" class="w-full"/>
              <div class="flex items-center gap-4">
                <UButton
                    type="button"
                    variant="soft"
                    icon="i-heroicons-photo"
                    @click="$refs.imageInput?.click()"
                >
                  上传图片
                </UButton>
                <input
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="uploadImage"
                />
                <img
                    v-if="form.image"
                    :src="form.image"
                    class="h-20 w-auto rounded border border-gray-600"
                    alt="预览"
                />
              </div>
            </div>
          </UFormField>

          <UFormField label="介绍内容" required class="w-full">
            <UTextarea
                v-model="form.content"
                :rows="12"
                placeholder="输入乐队介绍内容..."
                class="w-full"
            >
            </UTextarea>
            <p class="text-xs text-gray-400 mt-1">支持换行，每段之间空一行</p>
          </UFormField>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-700 w-full">
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
        </UForm>
      </div>
    </AdminCard>
  </div>
</template>
