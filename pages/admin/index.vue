<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const { data: bandData, pending } = await useFetch('/api/band-data')

const stats = computed(() => {
  if (!bandData.value) return []
  return [
    { label: '现任成员', value: bandData.value.members?.current?.length || 0, icon: 'i-heroicons-users', color: 'bg-blue-500' },
    { label: '历史成员', value: bandData.value.members?.former?.length || 0, icon: 'i-heroicons-user-group', color: 'bg-gray-500' },
    { label: '专辑', value: bandData.value.albums?.length || 0, icon: 'i-heroicons-musical-note', color: 'bg-purple-500' },
    { label: '巡演', value: bandData.value.tours?.length || 0, icon: 'i-heroicons-calendar', color: 'bg-red-500' },
    { label: '图集', value: bandData.value.gallery?.length || 0, icon: 'i-heroicons-photo', color: 'bg-green-500' },
  ]
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-white">首页概览</h2>
      <p class="text-gray-400 mt-1">欢迎回来，这里是 Fairy Lied 网站的内容管理中心</p>
    </div>

    <div v-if="pending" class="flex items-center justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-red-600" />
    </div>

    <template v-else>
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <AdminCard v-for="stat in stats" :key="stat.label" class="hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-4 p-4">
            <div :class="[stat.color, 'w-12 h-12 rounded-lg flex items-center justify-center']">
              <UIcon :name="stat.icon" class="w-6 h-6 text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
              <p class="text-sm text-gray-400">{{ stat.label }}</p>
            </div>
          </div>
        </AdminCard>
      </div>

      <!-- 快速操作 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard>
          <div class="px-4 py-3 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">快速操作</h3>
          </div>
          <div class="p-4 space-y-3">
            <NuxtLink to="/admin/members" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-500" />
              <span>管理乐队成员</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 ml-auto text-gray-400" />
            </NuxtLink>
            <NuxtLink to="/admin/tours" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-red-500" />
              <span>更新巡演日程</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 ml-auto text-gray-400" />
            </NuxtLink>
            <NuxtLink to="/admin/albums" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors text-gray-300">
              <UIcon name="i-heroicons-musical-note" class="w-5 h-5 text-purple-500" />
              <span>编辑专辑信息</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 ml-auto text-gray-400" />
            </NuxtLink>
          </div>
        </AdminCard>

        <AdminCard>
          <div class="px-4 py-3 border-b border-gray-700">
            <h3 class="text-lg font-semibold text-white">最新动态</h3>
          </div>
          <div class="p-4 space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p class="text-sm text-gray-300">系统运行正常</p>
                <p class="text-xs text-gray-400">数据库连接正常，API 服务可用</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p class="text-sm text-gray-300">内容管理后台已就绪</p>
                <p class="text-xs text-gray-400">所有模块均可正常编辑</p>
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </template>
  </div>
</template>
