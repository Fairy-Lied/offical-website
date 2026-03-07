<script setup lang="ts">
/**
 * ContactSection - 联系区块
 *
 * 功能：
 * - 展示乐队联系方式（管理、演出预订）
 * - 版权信息
 * - 响应式适配
 * - 支持 prefers-reduced-motion
 */

interface ContactInfo {
  label: string
  email: string
}

interface SocialLink {
  platform: string
  url: string
  icon: string
}

interface ContactSectionProps {
  contacts: ContactInfo[]
  socials?: SocialLink[]
  copyright?: string
}

const props = withDefaults(defineProps<ContactSectionProps>(), {
  copyright: '© 2026 Fairy Lied',
  socials: () => [],
})
</script>

<template>
  <section
    id="contact"
    class="contact-section"
    aria-labelledby="contact-title"
  >
    <div class="container">
      <!-- 章节标题 -->
      <div class="section-header">
        <h2 id="contact-title" class="section-title">
          Contact 联系
        </h2>
        <div class="red-line" />
      </div>

      <!-- 联系信息 -->
      <div class="contact-content">
        <p
          v-for="contact in contacts"
          :key="contact.label"
          class="contact-item"
        >
          {{ contact.label }}:
          <a
            :href="`mailto:${contact.email}`"
            class="contact-link"
          >
            {{ contact.email }}
          </a>
        </p>

        <!-- 社交媒体链接 -->
        <div
          v-if="socials.length > 0"
          class="social-links"
        >
          <a
            v-for="social in socials"
            :key="social.platform"
            :href="social.url"
            class="social-link"
            :aria-label="social.platform"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon
              :name="social.icon"
              class="social-icon"
            />
          </a>
        </div>

        <!-- 版权信息 -->
        <p class="copyright">
          {{ copyright }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// Contact区设计规范: padding: [80, 140]
.contact-section {
  padding: 80px 0;
  background-color: #060609;
}

.container {
  padding: 0 140px;
}

// 标题区: margin-bottom 8px (设计稿 gap: 8)
.section-header {
  margin-bottom: 8px;
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

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #BEB3CF;
  font-size: 14px;
  line-height: 1.8;
}

.contact-item {
  margin: 0;
}

.contact-link {
  color: #BEB3CF;
  text-decoration: none;
  transition: color 180ms ease;

  &:hover {
    color: #FF2F7D;
  }
}

.social-links {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.social-link {
  color: #9F99AD;
  text-decoration: none;
  transition: color 180ms ease;

  &:hover {
    color: #FF174F;
  }
}

.social-icon {
  width: 20px;
  height: 20px;
}

.copyright {
  color: #9F95B2;
  font-size: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #241019;
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
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .contact-link,
  .social-link {
    transition: none;
  }
}
</style>
