<script setup lang="ts">
// 从 API 获取所有数据
const { data: bandData, pending } = await useFetch('/api/band-data')

// 计算属性：处理 API 数据
const hero = computed(() => bandData.value?.hero || {})
const legend = computed(() => bandData.value?.legend || {})
const currentMembers = computed(() => bandData.value?.members?.current || [])
const formerMembers = computed(() => bandData.value?.members?.former || [])
const albums = computed(() => bandData.value?.albums || [])
const tourDates = computed(() => bandData.value?.tours || [])
const galleryImages = computed(() => bandData.value?.gallery || [])
const contacts = computed(() => bandData.value?.contacts || {})

// 社交媒体链接
const socialLinks = computed(() => {
  const socials = bandData.value?.contacts?.socials || []
  return socials.map((s: any) => ({
    platform: s.platform,
    url: s.url,
    icon: s.icon
  }))
})

useHead({
  title: 'Fairy Lied 妖精说了谎 | Gothic Metal Band',
  meta: [{ name: 'description', content: 'Fairy Lied 妖精说了谎 - 融合哥特金属与交响金属的黑暗之旅。' }],
});
</script>

<template>
  <div class="bg-[#060609] min-h-screen">
    <!-- 加载状态 -->
    <div v-if="pending" class="fixed inset-0 bg-[#060609] flex items-center justify-center z-50">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-[#FF174F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-400">加载中...</p>
      </div>
    </div>

    <!-- ===== HERO 首屏 ===== -->
    <HeroSection
      :background-image="hero.background_image || '/images/hero-bg.svg'"
      :title="hero.title || 'Fairy Lied'"
      :subtitle="hero.subtitle || '妖精说了谎'"
      :description="hero.description || '· Gothic / Symphonic Metal'"
      next-section-id="legend"
      :video="hero.video || ''"
    />

    <!-- ===== THE LEGEND 传说 ===== -->
    <LegendSection
      :image="legend.image || '/images/legend.png'"
      :title="legend.title || 'The Legend'"
      :subtitle="legend.subtitle || '传说'"
      :content="legend.content || ''"
    />

    <!-- ===== THE COVEN 成员阵列 ===== -->
    <CovenSection
      :current-members="currentMembers"
      :former-members="formerMembers"
    />

    <!-- ===== DISCOGRAPHY 作品 ===== -->
    <DiscographySection :albums="albums" />

    <!-- ===== ON TOUR 巡演 ===== -->
    <TourSection :tour-dates="tourDates" />

    <!-- ===== GALLERY 图集 ===== -->
    <GallerySection :images="galleryImages" />

    <!-- ===== CONTACT 联系 ===== -->
    <ContactSection
      :contacts="[{ label: 'Contact Us', email: contacts.email || '' }]"
      :socials="socialLinks"
    />
<!--    <div class="filter-mask" />-->
  </div>
</template>

<style scoped>
/* 选中文字颜色 */
::selection {
  background-color: #FF174F;
  color: white;
}
</style>
