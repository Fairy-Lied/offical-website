<script setup lang="ts">
// ===== V2 设计数据 =====
import heroBgImg from "@/images/hero_bg.png";
import memberGuitar from "@/images/member/13.jpeg";
import memberKey from "@/images/member/keyboard.jpeg";
import memberBass from "@/images/member/bass.jpeg";
import memberVocal from "@/images/member/vocal.jpeg";
import memberDrum from "@/images/member/drum.jpeg";
import legendImg from "@/images/legend.png";



// 当前成员数据
const currentMembers = [
  { name: '猫头', role: 'Vocal', image: memberVocal },
  { name: '千雪', role: 'Keyboard', image: memberKey },
  { name: '十三', role: 'Guitar', image: memberGuitar },
  { name: '伯言', role: 'Bass', image: memberBass },
  { name: 'Sherman', role: 'Drum', image: memberDrum },
];

// 历史成员数据
const formerMembers = [
  { name: '达达', role: 'Bass', image: '' },
  { name: '福老师', role: 'Keyboard', image: ''},
  { name: '九九', role: 'Vocal', image: ''},
  { name: 'Viki', role: 'Vocal', image: '' },
];

// 专辑数据
const albums = [
  {
    title: 'Shadows & Vows',
    year: '2026',
    cover: 'https://images.unsplash.com/photo-1671509774803-1640e8853b50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzJ8&ixlib=rb-4.1.0&q=80&w=1080',
    tracks: ['Prologue: The Fallen', 'Shadows & Vows', 'Cathedral of Lies', 'Eternal Night', 'Whispers in the Dark']
  },
];

// 巡演数据
const tourDates = [
  { date: '2026.01.02', city: '上海', venue: '奶油俱乐部', /*status: 'onsale' as const, ticketUrl: '#' */},
  { date: '2025.09.06', city: '上海', venue: '奶油俱乐部', /*status: 'soldout' as const */},
];

// 图集数据
const galleryImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1610948843744-7438ca96811a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzR8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片1' },
  { id: '2', url: 'https://images.unsplash.com/photo-1566291178978-559709ebeece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片2' },
  { id: '3', url: 'https://images.unsplash.com/photo-1513180950021-b9ff91bb5e5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzI3OTI5NzV8&ixlib=rb-4.1.0&q=80&w=1080', alt: '演出照片3' },
];

// 联系信息数据
const contacts = [
  { label: 'Contact Us', email: '' },
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
      subtitle="妖精说了谎 · Gothic / Symphonic Metal"
      description=""
      next-section-id="legend"
    />

    <!-- ===== THE LEGEND 传说 ===== -->
    <LegendSection
      :image="legendImg"
      title="The Legend"
      subtitle="传说"
      content="Fairy Lied「妖精说了谎」，2024年组建于上海，一群风格迥异的人类(?)打着哥特金属的旗号暗地里融合自己
喜欢的曲风私货。

Fairy Lied「妖精说了谎」，一支建构残酷故事世界的金属(?)乐队。
我们讲的不是美梦，而是梦里的裂缝；我们唱的不一定是真的，但也许能动摇你相信的东西。

我们的声音保持着“美女与野兽”式的对位张力：清亮女声如祷告般吟唱幻象，极端嗓音则在一瞬间击碎信仰。
从哥特金属的冷峻氛围中汲取情绪的阴影，借助力量金属的狂野和交响金属的史诗，将这些幻梦铸造成咒语。
每一首歌都是一则寓言，但都掺了谎言的毒。

我们不相信真相。“妖精说了谎”不是修辞，是信条。 如果声音能构建梦境，那我们就负责让梦境本身开始说谎。

嘘～，来，听我们说谎"
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
