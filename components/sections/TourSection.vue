<script setup lang="ts">
/**
 * TourSection - 巡演区块
 *
 * 响应式适配：
 * - 桌面端：横向行布局（日期 | 城市 | 场地 | 购票按钮）
 * - 移动端：卡片列表（信息堆叠 + 底部按钮）
 */

interface TourDate {
  date: string
  city: string
  venue: string
  status: 'onsale' | 'soldout' | 'upcoming'
  ticketUrl?: string
}

interface TourSectionProps {
  tourDates: TourDate[]
}

const props = defineProps<TourSectionProps>()

// 获取状态文本
function getStatusText(status: TourDate['status']): string {
  const statusMap: Record<string, string> = {
    onsale: '购票',
    soldout: '售罄',
    upcoming: '即将开售',
  }
  return statusMap[status] || ''
}

// 获取状态样式
function getStatusClasses(status: TourDate['status']): string {
  if (status === 'soldout') {
    return 'text-[#9F99AD] cursor-not-allowed'
  }
  if (status === 'upcoming') {
    return 'text-[#9F95B2]'
  }
  return 'text-[#FF2F7D] hover:text-[#FF6A95] cursor-pointer'
}
</script>

<template>
  <section
    id="tour"
    class="tour-section"
    aria-labelledby="tour-title"
  >
    <div class="container">
      <!-- 章节标题 -->
      <div class="section-header">
        <h2 id="tour-title" class="section-title">
          On Tour 演出
        </h2>
        <div class="red-line" />
      </div>

      <!-- 巡演列表 -->
      <div class="tour-list">
        <div
          v-for="show in tourDates"
          :key="show.date"
          class="tour-item"
        >
          <!-- 左侧信息 -->
          <div class="tour-info">
            <span class="tour-date">
              {{ show.date }}
            </span>
            <span class="tour-city">
              {{ show.city }}
            </span>
            <span class="tour-venue">
              {{ show.venue }}
            </span>
          </div>

          <!-- 购票按钮 -->
          <a
            v-if="show.status === 'onsale' && show.ticketUrl"
            :href="show.ticketUrl"
            class="ticket-btn"
            :class="getStatusClasses(show.status)"
          >
            {{ getStatusText(show.status) }}
          </a>
          <span
            v-else
            class="ticket-status"
            :class="getStatusClasses(show.status)"
          >
            {{ getStatusText(show.status) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Tour区设计规范: padding: [72, 140]
.tour-section {
  padding: 72px 0;
  background-color: #060609;
}

.container {
  padding: 0 140px;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 30px;
  font-weight: 700;
  color: #F2EEF8;
  margin-bottom: 12px;
}

.red-line {
  width: 110px;
  height: 2px;
  background-color: #FF174F;
}

.tour-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tour-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background-color: #241019;
  border-radius: 4px;
  gap: 0;
}

.tour-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
}

.tour-date {
  color: #D4CBDD;
  font-size: 13px;
  width: 100px;
}

.tour-city {
  color: #D4CBDD;
  font-size: 13px;
  width: 60px;
}

.tour-venue {
  color: #9F99AD;
  font-size: 13px;
}

.ticket-btn,
.ticket-status {
  font-size: 13px;
  font-weight: 700;
  transition: color 180ms ease;
}

// 响应式 - 平板
@media (max-width: 1024px) {
  .container {
    padding: 0 80px;
  }
}

// 响应式 - 移动端
@media (max-width: 768px) {
  .container {
    padding: 0 32px;
  }

  .section-title {
    font-size: 26px;
  }

  .tour-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 16px;
    gap: 8px;
  }

  .tour-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .tour-date,
  .tour-city {
    width: auto;
    font-size: 14px;
  }

  .tour-venue {
    font-size: 13px;
  }

  .ticket-btn,
  .ticket-status {
    margin-top: 4px;
    font-size: 14px;
  }
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .ticket-btn,
  .ticket-status {
    transition: none;
  }
}
</style>
