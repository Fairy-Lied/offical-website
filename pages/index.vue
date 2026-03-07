<script setup lang="ts">
// ===== V2 设计数据 =====
import heroBgImg from "@/images/hero_bg.png";

// 当前成员数据
const currentMembers = [
  { name: '妖精', role: 'Vocal', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTA1MTR8&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: '谎言', role: 'Guitar', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTA1MTV8&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: '梦魇', role: 'Drum', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5Njl8&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: '深渊', role: 'Bass', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzB8&ixlib=rb-4.1.0&q=80&w=1080' },
];

// 历史成员数据
const formerMembers = [
  { name: '旧梦', role: 'Former Guitar', image: 'https://images.unsplash.com/photo-1593202301839-1fda01b38456?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI3NDV8&ixlib=rb-4.1.0&q=80&w=1080', height: 130 },
  { name: '夜鸦', role: 'Former Bass', image: 'https://images.unsplash.com/photo-1574626550228-3fac41f33008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI3NDV8&ixlib=rb-4.1.0&q=80&w=1080', height: 152 },
  { name: '祈祷者', role: 'Former Keys', image: 'https://images.unsplash.com/photo-1602408960011-61d979be537e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI3NDZ8&ixlib=rb-4.1.0&q=80&w=1080', height: 130 },
  { name: '迷雾', role: 'Former Violin', image: 'https://images.unsplash.com/photo-1654048210701-aad73a07cbc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI3NDd8&ixlib=rb-4.1.0&q=80&w=1080', height: 130 },
];

// 专辑数据
const albums = [
  {
    title: 'Shadows & Vows',
    year: '2026',
    cover: 'https://images.unsplash.com/photo-1671509774803-1640e8853b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzJ8&ixlib=rb-4.1.0&q=80&w=1080',
    tracks: ['Prologue: The Fallen', 'Shadows & Vows', 'Cathedral of Lies', 'Eternal Night', 'Whispers in the Dark']
  },
  {
    title: 'Cathedral of Ashes',
    year: '2024',
    cover: 'https://images.unsplash.com/photo-1659904197464-7aa86fcdad9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzN8&ixlib=rb-4.1.0&q=80&w=1080',
    tracks: ['Ashes to Ashes', 'Gothic Rose', 'Symphony of Sorrow', 'The Last Prayer']
  },
];

// 巡演数据
const tourDates = [
  { date: '2026.05.10', city: '上海', venue: 'MAO Livehouse', status: 'onsale' as const, ticketUrl: '#' },
  { date: '2026.05.18', city: '北京', venue: '疆进酒', status: 'soldout' as const },
  { date: '2026.06.01', city: '广州', venue: '声音共和', status: 'upcoming' as const },
];

// 图集数据
const galleryImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1610948843744-7438ca96811a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzR8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片1' },
  { id: '2', url: 'https://images.unsplash.com/photo-1566291178978-559709ebeece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1513180950021-b9ff91bb5e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片3' },
];

// 联系信息数据
const contacts = [
  { label: 'Management', email: 'management@fairylied.com' },
  { label: 'Booking', email: 'booking@fairylied.com' },
];

// 社交媒体链接
const socialLinks = [
  { platform: 'Weibo', url: '#', icon: 'simple-icons:sinaweibo' },
  { platform: 'Bilibili', url: '#', icon: 'simple-icons:bilibili' },
  { platform: 'NetEase', url: '#', icon: 'simple-icons:neteasecloudmusic' },
];

useHead({
  title: 'Fairy Lied 妖精说了谎 | Gothic Metal Band',
  meta: [{ name: 'description', content: 'Fairy Lied 妖精说了谎 - 融合哥特金属与交响金属的黑暗之旅。' }],
});
</script>

<template>
  <div class="bg-[#060609] min-h-screen">
    <!-- ===== HERO 首屏 ===== -->
    <HeroSection
      :background-image="heroBgImg"
      title="Fairy Lied"
      subtitle="妖精说了谎 · Gothic Metal / Symphonic Metal"
      description="A dark symphonic journey through lies, fate and salvation."
      next-section-id="legend"
    />

    <!-- ===== THE LEGEND 传说 ===== -->
    <LegendSection
      image="https://images.unsplash.com/photo-1710050776794-a8d0e35e408b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5Njl8&ixlib=rb-4.1.0&q=80&w=1080"
      title="The Legend"
      subtitle="传说"
      content="妖精说了谎成立于夜色最深处。
我们以哥特金属的冷峻骨架，叠加交响金属的史诗织体，
在每一首歌中讲述关于谎言、命运与自我救赎的故事。

此处为乐队长文介绍占位，建议 100~160 字。"
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
    <ContactSection :contacts="contacts" :socials="socialLinks" />
  </div>
</template>

<style scoped>
/* 选中文字颜色 */
::selection {
  background-color: #FF174F;
  color: white;
}
</style>
