<script setup lang="ts">
// 获取当前路由
const route = useRoute()

// 判断是否为 admin 页面
const isAdminPage = computed(() => route.path.startsWith('/admin'))

// 页面元数据
useHead({
  title: "Fairy Lied 妖精说了谎",
  meta: [
    {
      name: "description",
      content:
        "Fairy Lied 妖精说了谎 - 歌特金属、交响金属、力量金属乐队官方网站。",
    },
    {
      name: "keywords",
      content:
        "Fairy Lied, 妖精说了谎, 歌特金属, 交响金属, 力量金属, band, music",
    },
  ],
  htmlAttrs: {
    lang: "zh-CN",
  },
  bodyAttrs: {
    class: "bg-bg-primary text-text-body overflow-x-hidden",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Noto+Sans+SC:wght@400;500;700&family=Roboto:wght@300;400;500;700&display=swap",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <div class="min-h-screen">
      <!-- 背景效果 - 仅前台页面显示 -->
      <template v-if="!isAdminPage">
        <div class="fixed inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
          <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
        </div>

        <!-- 导航栏 - 仅前台页面显示 -->
        <AppNavigation />
      </template>

      <!-- 主要内容 -->
      <main :class="isAdminPage ? '' : 'relative z-10'">
        <NuxtPage />
      </main>
    </div>
  </NuxtLayout>
</template>

<style>
/* All global styles are now in assets/css/main.css */
</style>
