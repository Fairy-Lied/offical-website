<script setup lang="ts">
import {format} from 'date-fns'
import {CalendarDate} from "@internationalized/date";

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})
const toast = useToast()
const {data: toursRaw, refresh} = await useFetch('/api/tours')
const tours = computed(() => {
  if (!toursRaw.value) return []
  return [...toursRaw.value].sort((a: any, b: any) => {
    // 按日期倒序排列（最新的在前）
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const isOpen = ref(false)
const editingTour = ref<any>(null)

// 日期选择器用的 Date 对象
const selectedDate = shallowRef()

const form = reactive({
  id: null as number | null,
  date: '',
  city: '',
  venue: '',
  status: 'onsale' as 'onsale' | 'soldout' | 'upcoming' | 'ended',
  ticket_url: ''
})

const statusOptions = [
  {label: '售票中', value: 'onsale'},
  {label: '已售罄', value: 'soldout'},
  {label: '即将开售', value: 'upcoming'},
  {label: '已结束', value: 'ended'}
]

function openModal(tour?: any) {
  if (tour) {
    editingTour.value = tour
    form.id = tour.id
    form.city = tour.city
    form.venue = tour.venue
    form.status = tour.status
    form.ticket_url = tour.ticket_url || ''
    // 将 YYYY.MM.DD 转换为 Date 对象
    const _year = Number(format(tour.date, 'yyyy'))
    const _month = Number(format(tour.date, 'M'))
    const _day = Number(format(tour.date, 'd'))
    selectedDate.value = new CalendarDate(_year, _month, _day)
  } else {
    editingTour.value = null
    form.id = null
    form.city = ''
    form.venue = ''
    form.status = 'onsale'
    form.ticket_url = ''
    selectedDate.value = null
  }
  isOpen.value = true
}

const saving = ref(false)

async function save() {
  if (!selectedDate.value) {
    toast.add({
      title: '请选择演出日期',
      color: 'error'
    })
    return
  }

  saving.value = true

  try {
    const dateStr = format(selectedDate.value, 'yyyy.MM.dd')

    const submitData = {
      ...form,
      date: dateStr
    }
    await $fetch('/api/tours', {
      method: 'POST',
      body: submitData
    })
    toast.add({
      title: editingTour.value ? '更新成功' : '添加成功',
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

async function deleteTour(tour: any) {
  if (!confirm(`确定要删除 "${tour.city} - ${tour.venue}" 的演出吗？`)) return

  try {
    await $fetch(`/api/tours/${tour.id}`, {
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
const inputDate = useTemplateRef('inputDate')
function getStatusLabel(status: string) {
  const option = statusOptions.find(o => o.value === status)
  return option?.label || status
}

function getStatusColor(status: string) {
  switch (status) {
    case 'onsale':
      return 'primary'
    case 'soldout':
      return 'error'
    case 'upcoming':
      return 'info'
    case 'ended':
      return 'neutral'
    default:
      return 'info'
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
      <UButton icon="i-heroicons-plus" @click="openModal()">
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
                  variant="ghost"
                  icon="i-heroicons-pencil"
                  size="sm"
                  @click="openModal(tour)"
              />
              <UButton
                  color="error"
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
    <UModal v-model:open="isOpen" :ui="{ width: 'sm:max-w-md' }">
      <template #content>
        <AdminCard class="w-full">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-white mb-4">
              {{ editingTour ? '编辑演出' : '添加演出' }}
            </h3>

            <UForm @submit.prevent="save" class="space-y-4">
              <UFormField label="演出日期" required class="w-full">
                <UInputDate ref="inputDate" v-model="selectedDate">
                  <template #trailing>
                    <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                      <UButton
                          color="neutral"
                          variant="link"
                          size="sm"
                          icon="i-lucide-calendar"
                          aria-label="Select a date"
                          class="px-0"
                      />

                      <template #content>
                        <UCalendar v-model="selectedDate" variant="subtle" class="p-2" />
                      </template>
                    </UPopover>
                  </template>
                </UInputDate>
              </UFormField>

              <UFormField label="城市" required class="w-full">
                <UInput v-model="form.city" placeholder="如：上海" class="w-full" />
              </UFormField>

              <UFormField label="场地" required class="w-full">
                <UInput v-model="form.venue" placeholder="如：奶油俱乐部" class="w-full"/>
              </UFormField>

              <UFormField label="票务状态" required class="w-full">
                <USelect
                    v-model="form.status"
                    :items="statusOptions"
                    option-attribute="label"
                    class="w-full"
                />
              </UFormField>

              <UFormField label="购票链接" class="w-full">
                <UInput v-model="form.ticket_url" placeholder="https://..." class="w-full" />
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
