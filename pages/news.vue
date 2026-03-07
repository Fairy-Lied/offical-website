<script setup lang="ts">
const news = [
  {
    id: 1,
    title: "新专辑制作中",
    date: "2024-02-15",
    image: "/images/news-1.svg",
    summary:
      "我们正在录制新专辑，这张专辑将融合更多交响元素，带来前所未有的听觉体验。",
    content: "敬请期待更多详情...",
  },
  {
    id: 2,
    title: "2024巡演计划公布",
    date: "2024-02-10",
    image: "/images/news-2.svg",
    summary: "2024年春季巡演即将开始，我们将带着新作品走访全国多个城市。",
    content: "具体日期和城市将在近期公布...",
  },
  {
    id: 3,
    title: "新成员加入",
    date: "2024-02-01",
    image: "/images/news-3.svg",
    summary:
      "我们很高兴地宣布，著名小提琴手加入乐队，为我们的音乐带来新的维度。",
    content: "期待在新专辑中呈现...",
  },
];
</script>

<template>
  <div class="py-20 px-4">
    <UContainer>
      <h1
        class="text-5xl font-serif mb-16 text-center section-title gradient-text"
      >
        新闻动态
      </h1>

      <div class="grid gap-12">
        <article v-for="item in news" :key="item.id" class="card glass-effect">
          <div class="md:flex">
            <div class="md:w-1/3">
              <div
                class="aspect-video md:aspect-square bg-gray-700 hover-scale"
              />
            </div>
            <div class="p-8 md:w-2/3">
              <div class="text-gray-400 mb-2">{{ item.date }}</div>
              <h2 class="text-2xl font-bold mb-4 gradient-text">
                {{ item.title }}
              </h2>
              <p class="text-gray-300 mb-6">{{ item.summary }}</p>
              <UButton
                color="error"
                variant="link"
                class="font-semibold text-lg custom-button"
              >
                阅读更多
              </UButton>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-12 text-center">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="font-semibold custom-button"
        >
          加载更多
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
