<!--
 * @Author: 美兰十三 luna_yj@hotmail.com
 * @Date: 2025-06-27 13:41:26
 * @LastEditors: 美兰十三 luna_yj@hotmail.com
 * @LastEditTime: 2025-06-27 13:53:09
 * @FilePath: /fairy-lied_offical-website/pages/music.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
const albums = [
  {
    title: "永恒的摇篮曲",
    year: "2023",
    cover: "/images/album-1.svg",
    tracks: [
      "序曲：月光下的低语",
      "黑玫瑰的哀歌",
      "血色黎明",
      "被遗忘的交响曲",
      "终章：星辰的陨落",
    ],
  },
  {
    title: "钢铁之心",
    year: "2021",
    cover: "/images/album-2.svg",
    tracks: ["战歌", "荣耀之路", "风暴之眼", "不屈的意志", "胜利的赞歌"],
  },
];
</script>

<template>
  <div class="py-20 px-4">
    <UContainer>
      <h1
        class="text-5xl font-serif mb-16 text-center section-title gradient-text"
      >
        音乐作品
      </h1>

      <div class="grid gap-16">
        <div
          v-for="(album, index) in albums"
          :key="index"
          class="md:flex gap-8 items-center glass-effect p-8 rounded-2xl hover-scale"
        >
          <div class="md:w-1/3 mb-8 md:mb-0">
            <div
              class="aspect-square bg-gray-800 rounded-lg shadow-lg hover-scale"
            />
          </div>
          <div class="md:w-2/3">
            <h2 class="text-3xl font-bold mb-2 gradient-text">
              {{ album.title }}
            </h2>
            <p class="text-gray-400 mb-6">{{ album.year }}</p>
            <ul class="space-y-2 mb-6">
              <li
                v-for="(track, i) in album.tracks"
                :key="i"
                class="flex items-center hover:bg-black hover:bg-opacity-30 p-2 rounded transition-colors"
              >
                <span class="text-gray-500 mr-4">{{ i + 1 }}.</span>
                <span class="text-gray-300">{{ track }}</span>
              </li>
            </ul>
            <UButton color="error" class="font-semibold custom-button"
              >在 Spotify 上收听</UButton
            >
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
