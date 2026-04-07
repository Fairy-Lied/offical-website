<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 侧边栏 -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
      <div class="p-6 border-b border-gray-800">
        <h1 class="text-xl font-bold">Fairy Lied 管理后台</h1>
        <p class="text-sm text-gray-400 mt-1">内容管理系统</p>
      </div>

      <nav class="p-4 space-y-2">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" exact-active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-home" class="w-5 h-5" />
          <span>首页概览</span>
        </NuxtLink>

        <NuxtLink to="/admin/hero" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
          <span>Hero 首屏</span>
        </NuxtLink>

        <NuxtLink to="/admin/legend" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
          <span>传说介绍</span>
        </NuxtLink>

        <NuxtLink to="/admin/members" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-users" class="w-5 h-5" />
          <span>成员管理</span>
        </NuxtLink>

        <NuxtLink to="/admin/albums" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-musical-note" class="w-5 h-5" />
          <span>专辑管理</span>
        </NuxtLink>

        <NuxtLink to="/admin/tours" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
          <span>巡演管理</span>
        </NuxtLink>

        <NuxtLink to="/admin/gallery" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-photo" class="w-5 h-5" />
          <span>图集管理</span>
        </NuxtLink>

        <NuxtLink to="/admin/contacts" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors" active-class="bg-red-600 hover:bg-red-700">
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          <span>联系方式</span>
        </NuxtLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <NuxtLink to="/" target="_blank" class="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
          <span>查看网站</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="ml-64 p-8">
      <NuxtPage />
    </main>
  </div>
</template>
