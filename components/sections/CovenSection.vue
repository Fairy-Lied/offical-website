<script setup lang="ts">
/**
 * CovenSection - 成员阵列区块
 *
 * The Coven - 展示当前成员和历史成员
 * 响应式布局：移动端2列，桌面端4列
 */

interface Member {
  name: string
  role: string
  image: string
  isFormer?: boolean
  height?: number
}

interface CovenSectionProps {
  /** 当前成员列表 */
  currentMembers: Member[]
  /** 历史成员列表 */
  formerMembers: Member[]
}

const props = defineProps<CovenSectionProps>()
</script>

<template>
  <section
    id="coven"
    class="coven-section"
    aria-labelledby="coven-title"
  >
    <div class="section-container" style="padding: 0 120px;">
      <!-- 章节标题 -->
      <div class="section-header">
        <h2 id="coven-title" class="section-title">
          The Coven 成员
        </h2>
        <div class="red-line" />
      </div>
      <p class="section-subtitle">Current Lineup</p>
      <!-- 当前成员 - 4列网格 -->
      <div
        class="members-grid"
        role="list"
        aria-label="Current Band Members"
      >
        <div
          v-for="member in currentMembers"
          :key="member.name"
          role="listitem"
          class="member-item"
        >
          <MemberCard
            :name="member.name"
            :role="member.role"
            :image="member.image"
            :is-former="false"
          />
        </div>
      </div>

      <!-- 历史成员标题 -->
<!--      <h3 class="former-title">Former Members</h3>-->
      <p class="section-subtitle">Former Members</p>

      <!-- 历史成员 - 4列，不同高度 -->
      <div
        class="members-grid"
        role="list"
        aria-label="Former Band Members"
      >
        <div
          v-for="member in formerMembers"
          :key="member.name"
          role="listitem"
          class="member-item"
        >
          <MemberCard
            :name="member.name"
            :role="member.role"
            :image="member.image"
            :is-former="true"
            :height="member.height || 150"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Coven区设计规范: padding: [80, 120]
.coven-section {
  padding: 80px 0;
  background-color: #07070C;
}

/* 使用全局 .section-container，但 Coven 使用 120px padding */

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 38px;
  font-weight: 700;
  color: #F2EEF8;
  margin-bottom: 12px;
}

.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 14px;
  color: #AFA4C4;
}

// 成员网格: gap 16px, margin-bottom 24px
.members-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.member-item {
  display: flex;
}

// Former Members 标题: margin-top 24px, margin-bottom 16px
.former-title {
  font-size: 14px;
  //color: #D8A1BA;
  margin-top: 24px;
  margin-bottom: 16px;
}

// 响应式 - 平板: Coven区设计稿 120px -> 80px
@media (max-width: 1024px) {
  .section-container {
    padding: 0 80px !important;
  }
}

// 响应式 - 移动端: 统一 32px
@media (max-width: 768px) {
  .section-container {
    padding: 0 32px !important;
  }

  .section-title {
    font-size: 26px;
  }

  .members-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// 章节标题动画
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  animation: fadeInUp 0.6s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  section {
    animation: none;
  }
}
</style>
