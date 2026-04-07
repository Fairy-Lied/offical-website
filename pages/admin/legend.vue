<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const { data: legend, refresh } = await useFetch('/api/legend')

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
      <h2 class="text-2xl font-bold text-white">Legend 传说介绍</h2>
      <p class="text-gray-400 mt-1">配置乐队传说介绍区块的内容</p>
    </div>

    <AdminCard class="max-w-3xl">
      <div class="p-6">
        <form @submit.prevent="save" class="space-y-6">
          <UFormGroup label="英文标题" required>
            <UInput v-model="form.title" placeholder="The Legend" />
          </UFormGroup>

          <UFormGroup label="中文副标题" required>
            <UInput v-model="form.subtitle" placeholder="传说" />
          </UFormGroup>

          <UFormGroup label="配图">
            <div class="space-y-2">
              <UInput v-model="form.image" placeholder="/images/legend.png" />
              <div class="flex items-center gap-4">
                <UButton
                  type="button"
                  color="gray"
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
          </UFormGroup>

          <UFormGroup label="介绍内容" required>
            <UTextarea
              v-model="form.content"
              :rows="12"
              placeholder="输入乐队介绍内容..."
            />
            <p class="text-xs text-gray-400 mt-1">支持换行，每段之间空一行</p>
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
