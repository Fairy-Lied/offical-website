<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const {data: albums, refresh} = await useFetch('/api/albums')

const isOpen = ref(false)
const editingAlbum = ref<any>(null)
const newTrack = ref('')

const form = reactive({
  id: null as number | null,
  title: '',
  year: '',
  cover: '',
  tracks: [] as string[]
})

function openModal(album?: any) {
  if (album) {
    editingAlbum.value = album
    form.id = album.id
    form.title = album.title
    form.year = album.year
    form.cover = album.cover || ''
    form.tracks = [...(album.tracks || [])]
  } else {
    editingAlbum.value = null
    form.id = null
    form.title = ''
    form.year = ''
    form.cover = ''
    form.tracks = []
  }
  newTrack.value = ''
  isOpen.value = true
}

function addTrack() {
  if (newTrack.value.trim()) {
    form.tracks.push(newTrack.value.trim())
    newTrack.value = ''
  }
}

function removeTrack(index: number) {
  form.tracks.splice(index, 1)
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/albums', {
      method: 'POST',
      body: {
        id: form.id,
        title: form.title,
        year: form.year,
        cover: form.cover,
        tracks: form.tracks
      }
    })
    toast.add({
      title: editingAlbum.value ? '更新成功' : '添加成功',
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

async function deleteAlbum(album: any) {
  if (!confirm(`确定要删除专辑 "${album.title}" 吗？`)) return

  try {
    await $fetch(`/api/albums/${album.id}`, {
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

async function uploadCover(event: Event) {
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
    form.cover = result.url
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
        <h2 class="text-2xl font-bold text-white">专辑管理</h2>
        <p class="text-gray-400 mt-1">管理乐队的专辑和曲目</p>
      </div>
      <UButton icon="i-heroicons-plus" @click="openModal()">
        添加专辑
      </UButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCard v-for="album in albums" :key="album.id" class="group p-4">
        <div class="flex gap-4">
          <img
              :src="album.cover || '/images/default-album.png'"
              class="w-24 h-24 rounded-lg object-cover border"
              :alt="album.title"
          />
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-white truncate">{{ album.title }}</h4>
            <p class="text-sm text-gray-400">{{ album.year }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ album.tracks?.length || 0 }} 首曲目</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <UButton
              variant="soft"
              icon="i-heroicons-pencil"
              size="sm"
              @click="openModal(album)"
          >
            编辑
          </UButton>
          <UButton
              color="error"
              variant="soft"
              icon="i-heroicons-trash"
              size="sm"
              @click="deleteAlbum(album)"
          >
            删除
          </UButton>
        </div>
      </AdminCard>
    </div>

    <!-- 编辑弹窗 -->
    <UModal v-model:open="isOpen">
      <template #content>
        <AdminCard class="w-full max-w-lg">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ editingAlbum ? '编辑专辑' : '添加专辑' }}
            </h3>

            <UForm @submit.prevent="save" class="space-y-4">
              <UFormField label="专辑名称" required class="w-full">
                <UInput v-model="form.title" placeholder="专辑名称" class="w-full"/>
              </UFormField>

              <UFormField label="发行年份" required class="w-full">
                <UInput v-model="form.year" placeholder="如：2026" class="w-full"/>
              </UFormField>

              <UFormField label="封面图片" class="w-full">
                <div class="space-y-2">
                  <UInput v-model="form.cover" placeholder="封面图片URL" class="w-full"/>
                  <div class="flex items-center gap-4">
                    <UButton
                        type="button"
                        variant="soft"
                        size="sm"
                        @click="$refs.coverInput?.click()"
                    >
                      上传封面
                    </UButton>
                    <input
                        ref="coverInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="uploadCover"
                    />
                    <img
                        v-if="form.cover"
                        :src="form.cover"
                        class="h-16 w-16 rounded object-cover border"
                        alt="预览"
                    />
                  </div>
                </div>
              </UFormField>

              <UFormField label="曲目列表">
                <div class="space-y-2">
                  <div class="flex gap-2">
                    <UInput
                        v-model="newTrack"
                        placeholder="输入曲目名称"
                        class="flex-1"
                        @keyup.enter="addTrack"
                    />
                    <UButton color="neutral" type="button" @click="addTrack">
                      添加
                    </UButton>
                  </div>
                  <div class="space-y-1 max-h-40 overflow-y-auto">
                    <div
                        v-for="(track, index) in form.tracks"
                        :key="index"
                        class="flex items-center justify-between p-2 bg-gray-700 rounded"
                    >
                      <span class="text-sm text-white">{{ index + 1 }}. {{ track }}</span>
                      <UButton
                          color="error"
                          variant="ghost"
                          icon="i-heroicons-x-mark"
                          size="xs"
                          @click="removeTrack(index)"
                      />
                    </div>
                  </div>
                </div>
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
