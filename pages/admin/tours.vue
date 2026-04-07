<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const toast = useToast()
const { data: tours, refresh } = await useFetch('/api/tours')

const isOpen = ref(false)
const editingTour = ref<any>(null)

const form = reactive({
  id: null as number | null,
  date: '',
  city: '',
  venue: '',
  status: 'onsale' as 'onsale' | 'soldout' | 'upcoming',
  ticket_url: ''
})

const statusOptions = [
  { label: '售票中', value: 'onsale' },
  { label: '已售罄', value: 'soldout' },
  { label: '即将开售', value: 'upcoming' }
]

function openModal(tour?: any) {
  if (tour) {
    editingTour.value = tour
    form.id = tour.id
    form.date = tour.date
    form.city = tour.city
    form.venue = tour.venue
    form.status = tour.status
    form.ticket_url = tour.ticket_url || ''
  } else {
    editingTour.value = null
    form.id = null
    form.date = ''
    form.city = ''
    form.venue = ''
    form.status = 'onsale'
    form.ticket_url = ''
  }
  isOpen.value = true
}

const saving = ref(false)

async function save() {
  saving.value = true
  try {
    await $fetch('/api/tours', {
      method: 'POST',
      body: form
    })
    toast.add({
      title: editingTour.value ? '更新成功' : '添加成功',
      color: 'green'
    })
    isOpen.value = false
    refresh()
  } catch (error) {
    toast.add({
      title: '操作失败',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

async function deleteTour(tour: any) {
  if (!confirm(`确定要删除 "${tour.city} - ${tour.venue}" 的演出吗？`)) return

  try {
    await $fetch(`/api/tours/${tour.id}`, {
      method: 'DELETE'
    })
    toast.add({
      title: '删除成功',
      color: 'green'
    })
    refresh()
  } catch (error) {
    toast.add({
      title: '删除失败',
      color: 'red'
    })
  }
}

function getStatusLabel(status: string) {
  const option = statusOptions.find(o => o.value === status)
  return option?.label || status
}

function getStatusColor(status: string) {
  switch (status) {
    case 'onsale': return 'green'
    case 'soldout': return 'red'
    case 'upcoming': return 'blue'
    default: return 'gray'
  }
}
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">巡演管理</h2>
        <p class="text-gray-400 mt-1">管理乐队演出日程和票务信息</p>
      </div>
      <UButton color="red" icon="i-heroicons-plus" @click="openModal()">
        添加演出
      </UButton>
    </div>

    <div class="space-y-4">
      <AdminCard v-for="tour in tours" :key="tour.id" class="group">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-6">
            <div class="text-center min-w-[100px]">
              <p class="text-lg font-bold text-white">{{ tour.date.split('.')[1] }}.{{ tour.date.split('.')[2] }}</p>
              <p class="text-sm text-gray-400">{{ tour.date.split('.')[0] }}</p>
            </div>

            <div class="w-px h-12 bg-gray-600"></div>

            <div>
              <h4 class="font-semibold text-white">{{ tour.city }}</h4>
              <p class="text-sm text-gray-400">{{ tour.venue }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <UBadge :color="getStatusColor(tour.status)">
              {{ getStatusLabel(tour.status) }}
            </UBadge>

            <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-pencil"
                size="sm"
                @click="openModal(tour)"
              />
              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                size="sm"
                @click="deleteTour(tour)"
              />
            </div>
          </div>
        </div>
      </AdminCard>
    </div>

    <!-- 编辑弹窗 -->
    <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-lg' }">
      <AdminCard class="w-full">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-white mb-4">
            {{ editingTour ? '编辑演出' : '添加演出' }}
          </h3>

          <form @submit.prevent="save" class="space-y-4">
            <UFormGroup label="演出日期" required>
              <UInput v-model="form.date" placeholder="如：2026.01.02" />
            </UFormGroup>

            <UFormGroup label="城市" required>
              <UInput v-model="form.city" placeholder="如：上海" />
            </UFormGroup>

            <UFormGroup label="场地" required>
              <UInput v-model="form.venue" placeholder="如：奶油俱乐部" />
            </UFormGroup>

            <UFormGroup label="票务状态" required>
              <USelect
                v-model="form.status"
                :options="statusOptions"
                option-attribute="label"
              />
            </UFormGroup>

            <UFormGroup label="购票链接">
              <UInput v-model="form.ticket_url" placeholder="https://..." />
            </UFormGroup>
          </form>

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
    </UModal>
  </div>
</template>
