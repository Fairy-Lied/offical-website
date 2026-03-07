<script setup lang="ts">
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
    class: "bg-black text-white overflow-x-hidden",
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

// 导航滚动效果
const scrolled = ref(false);
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50;
  });
});

// 社交媒体链接
const socialLinks = [
  {
    name: 'Spotify',
    icon: 'i-simple-icons-spotify',
    url: '#',
  },
  {
    name: 'YouTube',
    icon: 'i-simple-icons-youtube',
    url: '#',
  },
  {
    name: 'Instagram',
    icon: 'i-simple-icons-instagram',
    url: '#',
  },
  {
    name: 'Bandcamp',
    icon: 'i-simple-icons-bandcamp',
    url: '#',
  },
];

// 页脚链接
const footerLinks = [
  {
    title: '音乐',
    links: [
      { name: '专辑', url: '/music/albums' },
      { name: '单曲', url: '/music/singles' },
      { name: '视频', url: '/music/videos' },
    ],
  },
  {
    title: '巡演',
    links: [
      { name: '演出日程', url: '/tour' },
      { name: '购票', url: '/tour/tickets' },
      { name: '照片', url: '/tour/photos' },
    ],
  },
  {
    title: '关于',
    links: [
      { name: '乐队介绍', url: '/about' },
      { name: '联系我们', url: '/contact' },
      { name: '加入邮件列表', url: '/newsletter' },
    ],
  },
];
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 背景效果 -->
    <div class="fixed inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
    </div>

    <!-- 导航栏 -->
    <header class="sticky top-0 z-50 transition-all duration-300" :class="{'bg-black/80 backdrop-blur-lg shadow-lg': scrolled}">
      <UContainer class="py-6">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <NuxtLink to="/" class="group relative">
            <span class="text-2xl md:text-3xl font-metal gradient-text inline-block transform transition-transform duration-300 group-hover:scale-105">
              Fairy Lied
            </span>
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 transition-all duration-300 group-hover:w-full"></span>
          </NuxtLink>

          <!-- 导航链接 -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink v-for="(link, index) in ['新闻', '巡演', '音乐', '关于']"
                     :key="index"
                     :to="'/' + ['news', 'tour', 'music', 'about'][index]"
                     class="nav-link relative text-lg font-medium text-gray-300 hover:text-white transition-colors duration-300">
              {{ link }}
            </NuxtLink>
          </nav>

          <!-- 移动端菜单按钮 -->
          <button class="md:hidden p-2 text-gray-400 hover:text-white transition-colors">
            <span class="sr-only">打开菜单</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </UContainer>
    </header>

    <!-- 主要内容 -->
    <main class="flex-grow relative z-10">
      <NuxtPage />
    </main>

    <!-- 页脚 -->
    <footer class="relative z-10 bg-black/80 backdrop-blur-lg border-t border-gray-800">
      <UContainer class="py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <!-- 品牌区域 -->
          <div class="space-y-4">
            <h3 class="text-2xl font-metal gradient-text">Fairy Lied</h3>
            <p class="text-gray-400">妖精说了谎 - 融合歌特金属、交响金属与力量金属的音乐新境界</p>
            <!-- 社交媒体图标 -->
            <div class="flex space-x-4">
              <a v-for="social in socialLinks"
                 :key="social.name"
                 :href="social.url"
                 class="text-gray-400 hover:text-white transition-colors"
                 :title="social.name">
                <div :class="social.icon" class="w-6 h-6"></div>
              </a>
            </div>
          </div>

          <!-- 页脚链接 -->
          <div v-for="section in footerLinks" :key="section.title" class="space-y-4">
            <h4 class="text-lg font-bold text-white">{{ section.title }}</h4>
            <ul class="space-y-2">
              <li v-for="link in section.links" :key="link.name">
                <NuxtLink :to="link.url"
                         class="text-gray-400 hover:text-white transition-colors">
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Fairy Lied 妖精说了谎. All Rights Reserved.</p>
        </div>
      </UContainer>
    </footer>
  </div>
</template>

<style>
/* All global styles are now in assets/css/main.css */
</style>
