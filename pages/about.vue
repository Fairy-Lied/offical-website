<script setup lang="ts">
const members = [
  {
    name: "林雨",
    role: "主唱",
    instrument: "Vocals",
    image: "/images/member-1.svg",
    description: "乐队的灵魂人物，拥有令人惊叹的声线和舞台魅力。"
  },
  {
    name: "张天",
    role: "吉他手",
    instrument: "Guitar",
    image: "/images/member-2.svg",
    description: "技术精湛的吉他手，擅长创作复杂而富有情感的旋律。"
  },
  {
    name: "李明",
    role: "贝斯手",
    instrument: "Bass",
    image: "/images/member-3.svg",
    description: "乐队的节奏基础，为音乐提供稳定而有力的低音支持。"
  },
  {
    name: "王强",
    role: "鼓手",
    instrument: "Drums",
    image: "/images/member-4.svg",
    description: "精力充沛的鼓手，以精准的节奏和创新的打击技巧著称。"
  },
  {
    name: "陈悦",
    role: "小提琴手",
    instrument: "Violin",
    image: "/images/member-5.svg",
    description: "古典音乐背景出身，为乐队带来独特的交响元素。"
  },
];
</script>

<template>
  <div class="py-20 px-4">
    <UContainer>
      <h1
        class="text-5xl font-serif mb-16 text-center section-title gradient-text"
      >
        关于我们
      </h1>

      <div class="max-w-3xl mx-auto">
        <div
          class="prose prose-invert mx-auto mb-16 glass-effect p-8 rounded-2xl"
        >
          <p class="text-xl text-gray-300 text-shadow">
            Fairy Lied
            妖精说了谎是一支来自中国的哥特金属、交响金属和力量金属乐队。乐队成立于2023年，致力于将东方神秘主义与西方金属音乐完美融合。
          </p>
          <p class="text-lg text-gray-300 mt-4">
            我们的音乐融合了强劲的金属元素、交响乐的宏大与东方文化的神秘，创造出独特的音乐风格。乐队的歌词灵感来源于东方神话、民间传说和现代社会议题，通过音乐讲述引人深思的故事。
          </p>
          <p class="text-lg text-gray-300 mt-4">
            自成立以来，Fairy Lied 已在国内多个城市举办了巡回演出，并计划在未来拓展国际市场，将中国的金属音乐带向世界舞台。
          </p>
        </div>

        <h2 class="text-3xl font-bold mb-8 text-center gradient-text">
          乐队成员
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="member in members"
            :key="member.name"
            class="card glass-effect hover-scale"
          >
            <div
              class="aspect-square bg-gray-700 rounded-lg mb-4 hover-scale"
            />
            <h3 class="text-xl font-bold mb-2 gradient-text">
              {{ member.name }} <span class="text-gray-400">({{ member.role }})</span>
            </h3>
            <p class="text-gray-400 mb-2">{{ member.instrument }}</p>
            <p class="text-gray-300 text-shadow">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
