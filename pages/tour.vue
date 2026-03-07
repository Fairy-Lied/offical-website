<script setup lang="ts">
const tourDates = [
  {
    date: "2024-04-15",
    city: "北京",
    venue: "MAO Livehouse",
    status: "售罄",
  },
  {
    date: "2024-04-18",
    city: "上海",
    venue: "万代南梦宫文化中心",
    status: "售票中",
  },
  {
    date: "2024-04-21",
    city: "广州",
    venue: "太空间",
    status: "即将开售",
  },
  {
    date: "2024-04-25",
    city: "成都",
    venue: "CH8冇独空间",
    status: "即将开售",
  },
];
</script>

<template>
  <div class="py-20 px-4">
    <UContainer>
      <h1
        class="text-5xl font-serif mb-16 text-center section-title gradient-text"
      >
        巡演日程
      </h1>

      <div class="max-w-4xl mx-auto glass-effect p-8 rounded-2xl">
        <div
          v-for="(item, index) in tourDates"
          :key="index"
          class="flex items-center border-b border-gray-700 py-6 hover:bg-black hover:bg-opacity-30 transition-colors px-4 rounded-lg"
        >
          <div class="w-1/4 text-lg font-semibold text-gray-300">
            {{ item.date }}
          </div>
          <div class="w-1/4 text-lg gradient-text font-bold">
            {{ item.city }}
          </div>
          <div class="w-1/4 text-gray-400">{{ item.venue }}</div>
          <div class="w-1/4 text-right">
            <UButton
              :color="item.status === '售罄' ? 'secondary' : 'error'"
              :disabled="item.status === '售罄'"
              class="font-bold custom-button"
            >
              {{ item.status }}
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
