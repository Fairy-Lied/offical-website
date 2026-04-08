<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const {data: gallery, refresh} = await useFetch('/api/gallery')

const isOpen = ref(false)
const editingImage = ref<any>(null)

const form = reactive({
  id: null as number | null,
  url: '',
  alt: ''
})

function openModal(image?: any) {
  if (image) {
    editingImage.value = image
    form.id = image.id
    form.url = image.url
    form.alt = image.alt || ''
  } else {
    editingImage.value = null
    form.id = null
    form.url = ''
    form.alt = ''
  }
  isOpen.value = true
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/gallery', {
      method: 'POST',
      body: form
    })
    toast.add({
      title: editingImage.value ? '更新成功' : '添加成功',
      color: 'success'
    })
    isOpen.value = false
    refresh()
  } catch (error) {
    toast.add({
      title: '操作失败',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

async function deleteImage(image: any) {
  if (!confirm('确定要删除这张图片吗？')) return

  try {
    await $fetch(`/api/gallery/${image.id}`, {
      method: 'DELETE'
    })
    toast.add({
      title: '删除成功',
      color: 'success'
    })
    refresh()
  } catch (error) {
    toast.add({
      title: '删除失败',
      color: 'error'
    })
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
    form.url = result.url
    toast.add({
      title: '上传成功',
      color: 'success'
    })
  } catch (error) {
    toast.add({
      title: '上传失败',
      color: 'error'
    })
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">图集管理</h2>
        <p class="text-gray-400 mt-1">管理网站图集展示的图片</p>
      </div>
      <UButton icon="i-heroicons-plus" @click="openModal()">
        添加图片
      </UButton>
    </div>

    <!-- 瀑布流布局 -->
    <div class="masonry-grid">
      <AdminCard
          v-for="image in gallery"
          :key="image.id"
          class="masonry-item group overflow-hidden"
      >
        <div class="relative overflow-hidden">
          <img
              :src="image.url"
              class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              :alt="image.alt"
              loading="lazy"
          />
          <!-- 悬停遮罩 -->
          <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <UButton
                variant="solid"
                icon="i-heroicons-pencil"
                size="sm"
                @click="openModal(image)"
            />
            <UButton
                color="error"
                variant="solid"
                icon="i-heroicons-trash"
                size="sm"
                @click="deleteImage(image)"
            />
          </div>
        </div>

        <div class="p-3">
          <p class="text-sm text-gray-400 truncate">{{ image.alt || '未命名' }}</p>
        </div>
      </AdminCard>
    </div>

    <!-- 编辑弹窗 -->
    <UModal v-model:open="isOpen" :ui="{ width: 'sm:max-w-md' }">
      <template #content>
        <AdminCard class="w-full">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ editingImage ? '编辑图片' : '添加图片' }}
            </h3>

            <UForm @submit.prevent="save" class="space-y-4">
              <UFormField label="图片" required>
                <div class="space-y-2">
                  <UInput v-model="form.url" placeholder="图片URL"/>
                  <div class="flex items-center gap-4">
                    <UButton
                        type="button"
                        color="neutral"
                        variant="soft"
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
                  </div>
                  <img
                      v-if="form.url"
                      :src="form.url"
                      class="h-32 w-auto rounded border border-gray-600"
                      alt="预览"
                  />
                </div>
              </UFormField>

              <UFormField label="描述">
                <UInput v-model="form.alt" placeholder="图片描述"/>
              </UFormField>
            </UForm>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
              <UButton color="error" variant="soft" @click="isOpen = false">
                取消
              </UButton>
              <UButton :loading="saving" @click="save">
                保存
              </UButton>
            </div>
          </div>
        </AdminCard>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
/* 瀑布流布局 */
.masonry-grid {
  column-count: 2;
  column-gap: 16px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 16px;
}

/* 平板：3列 */
@media (min-width: 768px) {
  .masonry-grid {
    column-count: 3;
  }
}

/* 桌面：4列 */
@media (min-width: 1024px) {
  .masonry-grid {
    column-count: 4;
  }
}

/* 大屏幕：5列 */
@media (min-width: 1280px) {
  .masonry-grid {
    column-count: 5;
  }
}
</style>
