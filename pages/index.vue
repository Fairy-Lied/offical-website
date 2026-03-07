<script setup lang="ts">
// 乐队成员数据
const bandMembers = [
  {
    name: '月影',
    role: '主唱/吉他手',
    image: 'https://picsum.photos/400/600',
    description: '乐队的灵魂人物，独特的声线和精湛的吉他技巧让她成为金属乐坛的新星。',
    socialLinks: {
      instagram: '#',
      twitter: '#',
    }
  },
  {
    name: '星辰',
    role: '吉他手',
    image: 'https://picsum.photos/400/601',
    description: '技术派吉他手，擅长复杂的旋律编排和即兴演奏。',
    socialLinks: {
      instagram: '#',
      twitter: '#',
    }
  },
  {
    name: '雷音',
    role: '贝斯手',
    image: 'https://picsum.photos/400/602',
    description: '乐队的节奏核心，强劲的贝斯线条为音乐注入力量。',
    socialLinks: {
      instagram: '#',
      twitter: '#',
    }
  },
  {
    name: '风华',
    role: '鼓手',
    image: 'https://picsum.photos/400/603',
    description: '精准的节奏掌控者，复杂的鼓点编排令人印象深刻。',
    socialLinks: {
      instagram: '#',
      twitter: '#',
    }
  }
];

// 新闻数据
const news = [
  {
    title: "新专辑《永恒之泪》即将发行",
    date: "2024-02-01",
    content: "我们很高兴地宣布，新专辑《永恒之泪》将于2024年3月发行。这张专辑包含12首全新创作的歌曲，展现了我们在音乐风格上的突破与创新。",
    image: "https://picsum.photos/800/400",
    tags: ["新专辑", "公告"],
  },
  {
    title: "2024年全国巡演计划公布",
    date: "2024-01-15",
    content: "2024年春季，我们将展开全国巡演。此次巡演将覆盖20个主要城市，带来全新专辑的现场演绎。",
    image: "https://picsum.photos/800/401",
    tags: ["巡演", "公告"],
  },
  {
    title: "新单曲《星光之梦》MV发布",
    date: "2024-01-01",
    content: "我们的最新单曲《星光之梦》MV已经发布。这首歌展现了乐队对于梦想与希望的独特诠释。",
    image: "https://picsum.photos/800/402",
    tags: ["新歌", "MV"],
  },
];

// 精选音乐数据
const featuredMusic = [
  {
    title: "永恒之泪",
    type: "专辑",
    releaseDate: "2024-03",
    description: "这张专辑融合了歌特金属的黑暗气质和交响金属的宏大格局，是我们音乐风格的一次重要突破。",
    image: "https://picsum.photos/400/400",
  },
  {
    title: "星光之梦",
    type: "单曲",
    releaseDate: "2024-01",
    description: "这首单曲以梦幻的旋律和力量金属的激情，诉说着对理想的永恒追求。",
    image: "https://picsum.photos/400/401",
  },
  {
    title: "黑暗中的华尔兹",
    type: "单曲",
    releaseDate: "2023-12",
    description: "一首融合了古典音乐元素的歌特金属作品，展现了我们对音乐多样性的追求。",
    image: "https://picsum.photos/400/402",
  },
];

// 粉丝评价数据
const testimonials = [
  {
    content: "Fairy Lied的音乐完美融合了力量与优雅，每一首歌都是一场震撼心灵的旅程。",
    author: "音乐评论家 - 星空",
    rating: 5,
  },
  {
    content: "他们的现场演出令人难忘，强大的舞台张力和精湛的演奏技巧让人印象深刻。",
    author: "金属音乐杂志主编 - 雷鸣",
    rating: 5,
  },
  {
    content: "《永恒之泪》是一张突破性的专辑，展现了乐队在音乐创作上的巨大进步。",
    author: "资深乐评人 - 夜语",
    rating: 5,
  },
];

// 视频数据
const videos = [
  {
    title: "星光之梦 - Official MV",
    thumbnail: "https://picsum.photos/800/450",
    url: "#",
    duration: "04:32",
  },
  {
    title: "2023年末特别演出精彩片段",
    thumbnail: "https://picsum.photos/800/451",
    url: "#",
    duration: "08:15",
  },
  {
    title: "新专辑《永恒之泪》制作花絮",
    thumbnail: "https://picsum.photos/800/452",
    url: "#",
    duration: "12:45",
  },
];

// 页面滚动处理
const isScrolled = ref(false);
onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50;
  });
});
</script>

<template>
  <div>
    <!-- Hero部分 -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- 背景视频/图片 -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
        <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-10"></div>
        <!-- 动态背景效果 -->
        <div class="absolute inset-0">
          <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/30 via-transparent to-purple-500/30 animate-gradient"></div>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="relative z-10 text-center space-y-10 px-4 max-w-6xl mx-auto">
        <div class="inline-block p-1 bg-gradient-to-r from-red-500 via-accent-gold to-red-500 rounded-lg animate-fade-in">
          <div class="px-6 py-2 bg-black/80 rounded-md">
            <span class="text-sm md:text-base uppercase tracking-widest text-accent-gold font-bold">中国交响金属乐队</span>
          </div>
        </div>
        <h1 class="text-7xl md:text-9xl font-metal gradient-text animate-title drop-shadow-lg">
          Fairy Lied
        </h1>
        <p class="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up animation-delay-300 font-light">
          融合歌特金属、交响金属与力量金属的音乐新境界
        </p>
        <div class="flex flex-wrap justify-center gap-6 animate-fade-in-up animation-delay-600">
          <UButton
            color="red"
            variant="solid"
            size="xl"
            class="min-w-[200px] metal-button"
            to="/music"
          >
            最新音乐
          </UButton>
          <UButton
            color="white"
            variant="outline"
            size="xl"
            class="min-w-[200px] metal-button-outline"
            to="/tour"
          >
            演出日程
          </UButton>
        </div>
      </div>

      <!-- 向下滚动指示器 -->
      <div
        class="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce"
        @click="() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })"
      >
        <div class="w-10 h-10 rounded-full border-2 border-red-500/70 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <svg
            class="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>

    <!-- 乐队成员部分 -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
      <UContainer>
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">THE BAND</span>
          <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">乐队成员</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div
            v-for="(member, index) in bandMembers"
            :key="member.name"
            class="group relative overflow-hidden rounded-lg animate-fade-in-up glass-effect border border-white/5 hover:border-red-500/30 transition-all duration-500"
            :class="[
              { 'animation-delay-300': index === 1 },
              { 'animation-delay-600': index === 2 },
              { 'animation-delay-900': index === 3 },
            ]"
          >
            <!-- 成员图片 -->
            <div class="relative aspect-[3/4] overflow-hidden">
              <img
                :src="member.image"
                :alt="member.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              <!-- 角色标签 -->
              <div class="absolute top-4 right-4 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-xs font-bold">
                {{ member.role }}
              </div>
            </div>

            <!-- 成员信息 -->
            <div class="p-6 text-white">
              <h3 class="text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">{{ member.name }}</h3>
              <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ member.description }}</p>

              <!-- 社交媒体链接 -->
              <div class="flex gap-4 pt-2 border-t border-white/10">
                <a
                  v-for="(link, platform) in member.socialLinks"
                  :key="platform"
                  :href="link"
                  class="text-white/70 hover:text-red-400 transition-colors"
                >
                  <div :class="`i-simple-icons-${platform}`" class="w-5 h-5"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- 新闻部分 -->
    <section class="py-24 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm relative">
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
      <UContainer>
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">LATEST NEWS</span>
          <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">最新动态</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(item, index) in news"
            :key="index"
            class="group glass-effect rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 hover:shadow-red transition-all duration-500 animate-fade-in-up"
            :class="[
              { 'animation-delay-300': index === 1 },
              { 'animation-delay-600': index === 2 },
            ]"
          >
            <div class="relative overflow-hidden aspect-video">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              <!-- 日期标签 -->
              <div class="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded text-sm font-medium text-white/80">
                {{ item.date }}
              </div>
            </div>

            <div class="p-6">
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs font-medium"
                >
                  {{ tag }}
                </span>
              </div>
              <h3 class="text-xl font-bold mb-4 group-hover:text-red-400 transition-colors line-clamp-2">{{ item.title }}</h3>
              <p class="text-gray-300 text-sm line-clamp-3">{{ item.content }}</p>

              <div class="mt-6 pt-4 border-t border-white/10">
                <UButton
                  color="white"
                  variant="ghost"
                  size="sm"
                  class="group-hover:text-red-400 transition-colors"
                  icon="i-heroicons-arrow-right"
                  trailing
                >
                  阅读更多
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-12">
          <UButton
            color="white"
            variant="outline"
            size="lg"
            class="metal-button-outline"
            to="/news"
          >
            查看全部新闻
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- 精选音乐部分 -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
      <!-- 装饰元素 -->
      <div class="absolute -left-20 top-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -right-20 bottom-1/4 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl"></div>

      <UContainer class="relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">FEATURED MUSIC</span>
          <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">精选音乐</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            v-for="(item, index) in featuredMusic"
            :key="index"
            class="group glass-effect rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 hover:shadow-red transition-all duration-500 animate-fade-in-up"
            :class="[
              { 'animation-delay-300': index === 1 },
              { 'animation-delay-600': index === 2 },
            ]"
          >
            <div class="relative aspect-square overflow-hidden">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              <!-- 播放按钮 -->
              <button
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                  <svg
                    class="w-8 h-8 text-white ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                </div>
              </button>

              <!-- 类型标签 -->
              <div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs font-medium">
                {{ item.type }}
              </div>
            </div>

            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold group-hover:text-red-400 transition-colors">{{ item.title }}</h3>
                <span class="text-gray-400 text-sm">{{ item.releaseDate }}</span>
              </div>
              <p class="text-gray-300 text-sm line-clamp-3">{{ item.description }}</p>

              <div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                <UButton
                  color="white"
                  variant="ghost"
                  size="sm"
                  class="group-hover:text-red-400 transition-colors"
                >
                  试听
                </UButton>

                <UButton
                  color="white"
                  variant="ghost"
                  size="sm"
                  class="group-hover:text-red-400 transition-colors"
                  icon="i-heroicons-shopping-cart"
                  leading
                >
                  购买
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-12">
          <UButton
            color="white"
            variant="outline"
            size="lg"
            class="metal-button-outline"
            to="/music"
          >
            浏览全部音乐
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- 视频部分 -->
    <section class="py-24 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm relative">
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
      <!-- 装饰元素 -->
      <div class="absolute -right-20 top-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -left-20 bottom-1/3 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl"></div>

      <UContainer class="relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">WATCH & LISTEN</span>
          <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">视频展示</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            v-for="(video, index) in videos"
            :key="index"
            class="group glass-effect rounded-xl overflow-hidden border border-white/5 hover:border-red-500/30 hover:shadow-red transition-all duration-500 animate-fade-in-up"
            :class="[
              { 'animation-delay-300': index === 1 },
              { 'animation-delay-600': index === 2 },
            ]"
          >
            <div class="relative aspect-video overflow-hidden">
              <img
                :src="video.thumbnail"
                :alt="video.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              <!-- 播放按钮 -->
              <button class="absolute inset-0 flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                  <svg
                    class="w-8 h-8 text-white ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                </div>
              </button>

              <!-- 视频时长 -->
              <div class="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded text-sm font-medium">
                {{ video.duration }}
              </div>
            </div>

            <div class="p-6">
              <h3 class="text-lg font-bold group-hover:text-red-400 transition-colors line-clamp-2">{{ video.title }}</h3>

              <div class="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <UButton
                  color="white"
                  variant="ghost"
                  size="sm"
                  class="group-hover:text-red-400 transition-colors"
                  icon="i-heroicons-share"
                  leading
                >
                  分享
                </UButton>

                <UButton
                  color="white"
                  variant="ghost"
                  size="sm"
                  class="group-hover:text-red-400 transition-colors"
                  icon="i-heroicons-arrow-top-right-on-square"
                  leading
                >
                  全屏
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-12">
          <UButton
            color="white"
            variant="outline"
            size="lg"
            class="metal-button-outline"
            to="/videos"
          >
            查看全部视频
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- 粉丝评价部分 -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>
      <!-- 装饰元素 -->
      <div class="absolute -left-20 top-1/3 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -right-20 bottom-1/3 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl"></div>

      <UContainer class="relative z-10">
        <div class="text-center mb-20">
          <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">TESTIMONIALS</span>
          <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">粉丝评价</h2>
          <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="glass-effect rounded-xl p-8 border border-white/5 hover:border-red-500/30 hover:shadow-red transition-all duration-500 animate-fade-in-up relative"
            :class="[
              { 'animation-delay-300': index === 1 },
              { 'animation-delay-600': index === 2 },
            ]"
          >
            <!-- 引号装饰 -->
            <div class="absolute -top-4 -left-2 text-6xl text-red-500/20 font-serif">"</div>
            <div class="absolute -bottom-10 -right-2 text-6xl text-red-500/20 font-serif rotate-180">"</div>

            <!-- 星级评分 -->
            <div class="flex gap-1 mb-6">
              <div v-for="i in testimonial.rating" :key="i" class="text-accent-gold text-xl">★</div>
            </div>

            <!-- 评价内容 -->
            <p class="text-gray-200 italic mb-8 text-lg relative z-10">"{{ testimonial.content }}"</p>

            <!-- 分隔线 -->
            <div class="w-12 h-0.5 bg-red-500/30 mb-4"></div>

            <!-- 作者 -->
            <p class="text-accent-gold font-medium">{{ testimonial.author }}</p>
          </div>
        </div>

        <!-- 更多评价按钮 -->
        <div class="flex justify-center mt-16">
          <UButton
            color="white"
            variant="outline"
            size="lg"
            class="metal-button-outline"
            to="/testimonials"
          >
            查看更多评价
          </UButton>
        </div>
      </UContainer>
    </section>

    <!-- 订阅部分 -->
    <section class="py-32 relative">
      <!-- 背景效果 -->
      <div class="absolute inset-0 bg-gradient-to-r from-red-900/40 via-black/60 to-black/40"></div>
      <div class="absolute inset-0 bg-[url('/images/noise.svg')] opacity-5"></div>

      <!-- 装饰元素 -->
      <div class="absolute -left-20 top-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -right-20 bottom-1/4 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl"></div>

      <UContainer class="relative z-10">
        <div class="max-w-4xl mx-auto">
          <!-- 卡片容器 -->
          <div class="glass-effect rounded-2xl p-10 border border-white/10 shadow-red">
            <div class="text-center mb-10">
              <span class="inline-block px-4 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold tracking-wider mb-4">STAY CONNECTED</span>
              <h2 class="text-4xl md:text-6xl font-metal gradient-text mb-6">加入我们的邮件列表</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-6"></div>
              <p class="text-xl text-gray-300 max-w-2xl mx-auto">获取最新的乐队动态、巡演信息和独家内容</p>
            </div>

            <form class="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div class="flex-grow relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div class="i-heroicons-envelope text-red-400 w-5 h-5"></div>
                </div>
                <input
                  type="email"
                  placeholder="输入您的邮箱地址"
                  class="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white transition-all duration-300"
                />
              </div>
              <UButton
                color="red"
                variant="solid"
                size="xl"
                class="metal-button min-w-[120px]"
              >
                订阅
              </UButton>
            </form>

            <div class="mt-8 text-center text-gray-400 text-sm">
              我们尊重您的隐私，不会向第三方分享您的信息
            </div>

            <!-- 社交媒体链接 -->
            <div class="mt-10 pt-8 border-t border-white/10">
              <div class="flex justify-center gap-6">
                <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300">
                  <div class="i-simple-icons-instagram w-5 h-5 text-white/80 hover:text-white"></div>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300">
                  <div class="i-simple-icons-twitter w-5 h-5 text-white/80 hover:text-white"></div>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300">
                  <div class="i-simple-icons-youtube w-5 h-5 text-white/80 hover:text-white"></div>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300">
                  <div class="i-simple-icons-spotify w-5 h-5 text-white/80 hover:text-white"></div>
                </a>
                <a href="#" class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors duration-300">
                  <div class="i-simple-icons-bilibili w-5 h-5 text-white/80 hover:text-white"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
/* 金属质感文字 */
.font-metal {
  font-family: "Cinzel", serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.gradient-text {
  background: linear-gradient(to right, #ff3333, #ff9966, #ffcc33);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 10px rgba(255, 51, 51, 0.3);
}

/* 金属按钮效果 */
.metal-button {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #ff3333, #cc0000);
  border: none;
  box-shadow: 0 4px 15px rgba(255, 51, 51, 0.4);
  transition: all 0.3s ease;
}

.metal-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 51, 51, 0.6);
}

.metal-button::before {
  content: '';
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  transition: all 0.6s;
}

.metal-button:hover::before {
  top: 100%;
  left: 100%;
}

.metal-button-outline {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: transparent;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.metal-button-outline:hover {
  border-color: #ff3333;
  box-shadow: 0 8px 20px rgba(255, 51, 51, 0.3);
  transform: translateY(-2px);
}

/* 动画效果 */
.animate-title {
  animation: titleReveal 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes titleReveal {
  0% {
    opacity: 0;
    transform: translateY(50px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-900 {
  animation-delay: 900ms;
}

/* 渐变动画 */
.animate-gradient {
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1) rotate(5deg);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .gradient-text {
    background-size: 200% auto;
  }
}
</style>
