<script setup lang="ts">
import { uploadImage } from '~/utils/upload'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const toast = useToast()
const {data: members, refresh} = await useFetch('/api/members')

const isOpen = ref(false)
const editingMember = ref<any>(null)

const form = reactive({
  id: null as number | null,
  name: '',
  role: '',
  image: '',
  is_current: true
})

function openModal(member?: any) {
  if (member) {
    editingMember.value = member
    form.id = member.id
    form.name = member.name
    form.role = member.role
    form.image = member.image || ''
    form.is_current = Boolean(member.is_current)
  } else {
    editingMember.value = null
    form.id = null
    form.name = ''
    form.role = ''
    form.image = ''
    form.is_current = true
  }
  isOpen.value = true
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/members', {
      method: 'POST',
      body: {
        ...form,
        is_current: form.is_current ? 1 : 0
      }
    })
    toast.add({
      title: editingMember.value ? '更新成功' : '添加成功',
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

async function deleteMember(member: any) {
  if (!confirm(`确定要删除成员 "${member.name}" 吗？`)) return

  try {
    await $fetch(`/api/members/${member.id}`, {
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

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const result = await uploadImage(file)

    if (!result.success) {
      throw new Error(result.error)
    }

    form.image = result.url
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

const currentMembers = computed(() => members.value?.current || [])
const formerMembers = computed(() => members.value?.former || [])
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">成员管理</h2>
        <p class="text-gray-400 mt-1">管理乐队现任成员和历史成员</p>
      </div>
      <UButton icon="i-heroicons-plus" @click="openModal()">
        添加成员
      </UButton>
    </div>

    <!-- 现任成员 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4">现任成员</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard v-for="member in currentMembers" :key="member.id" class="group p-4">
          <div class="flex items-start gap-4">
            <img
                :src="member.image || '/images/default-avatar.png'"
                class="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                :alt="member.name"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-white">{{ member.name }}</h4>
              <p class="text-sm text-gray-400">{{ member.role }}</p>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  size="xs"
                  @click="openModal(member)"
              />
              <UButton
                  color="error"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  size="xs"
                  @click="deleteMember(member)"
              />
            </div>
          </div>
        </AdminCard>
      </div>
    </div>

    <!-- 历史成员 -->
    <div>
      <h3 class="text-lg font-semibold mb-4">历史成员</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard v-for="member in formerMembers" :key="member.id" class="group opacity-75 p-4">
          <div class="flex items-start gap-4">
            <img
                :src="member.image || '/images/default-avatar.png'"
                class="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                :alt="member.name"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-white">{{ member.name }}</h4>
              <p class="text-sm text-gray-400">{{ member.role }}</p>
            </div>
            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  size="xs"
                  @click="openModal(member)"
              />
              <UButton
                  variant="ghost"
                  icon="i-heroicons-trash"
                  color="error"
                  size="xs"
                  @click="deleteMember(member)"
              />
            </div>
          </div>

        </AdminCard>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <UModal v-model:open="isOpen" :ui="{ width: 'sm:max-w-md' }">
      <template #content>
        <AdminCard class="w-full">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ editingMember ? '编辑成员' : '添加成员' }}
            </h3>

            <UForm @submit.prevent="save" class="space-y-4">
              <UFormField label="姓名" required class="w-full">
                <UInput v-model="form.name" placeholder="成员姓名" class="w-full"/>
              </UFormField>

              <UFormField label="角色/职位" required class="w-full">
                <UInput v-model="form.role" placeholder="如：Vocal, Guitar, Drum" class="w-full"/>
              </UFormField>

              <UFormField label="照片" class="w-full">
                <div class="space-y-2">
                  <UInput v-model="form.image" placeholder="图片URL" class="w-full"/>
                  <div class="flex items-center gap-4">
                    <UButton
                        type="button"
                        variant="soft"
                        size="sm"
                        @click="$refs.memberImageInput?.click()"
                    >
                      上传照片
                    </UButton>
                    <input
                        ref="memberImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleImageUpload"
                    />
                    <img
                        v-if="form.image"
                        :src="form.image"
                        class="h-12 w-12 rounded-full object-cover border border-gray-600"
                        alt="预览"
                    />
                  </div>
                </div>
              </UFormField>

              <UFormField class="w-full">
                <UCheckbox v-model="form.is_current" label="现任成员"/>
              </UFormField>
            </UForm>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
              <UButton color="gray" variant="soft" @click="isOpen = false">
                取消
              </UButton>
              <UButton color="red" :loading="saving" @click="save">
                保存
              </UButton>
            </div>
          </div>
        </AdminCard>
      </template>
    </UModal>
  </div>
</template>
