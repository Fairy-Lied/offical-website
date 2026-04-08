<script setup lang="ts">
/**
 * MemberCard - 成员卡片组件
 *
 * 实现 V2 设计的4态交互效果：
 * 1. 当前成员-默认：彩色图 + mask #00000066，边框 #A22A55 / 1px
 * 2. 当前成员-Hover：彩色图（无mask），边框 #FF2F7D / 3px
 * 3. 历史成员-默认：黑白图 + mask #00000077，文本 #9F99AD
 * 4. 历史成员-Hover：黑白图 + mask #00000066，文本 #B7B0C8
 *
 * 动效：颜色/边框过渡 180ms
 * A11y：支持 prefers-reduced-motion，键盘导航，screen reader
 */

interface MemberCardProps {
  /** 成员姓名 */
  name: string
  /** 角色/乐器 */
  role: string
  /** 头像图片URL */
  image: string
  /** 是否为历史成员 */
  isFormer?: boolean
  /** 自定义高度（历史成员用） */
  height?: number
}

const props = withDefaults(defineProps<MemberCardProps>(), {
  isFormer: false,
  height: 150,
})

// 生成 A11y 标签
const ariaLabel = computed(() => {
  return props.isFormer
      ? `Former Member - ${props.name}, ${props.role}`
      : `Current Member - ${props.name}, ${props.role}`
})
</script>

<template>
  <!-- 当前成员卡片 -->
  <div
      v-if="!isFormer"
      role="article"
      :aria-label="ariaLabel"
      class="member-card current-member"
  >
    <!-- 彩色图片 -->
    <img
        v-if="image"
        :src="image"
        :alt="name"
        class="card-image"
    />
    <!-- 默认头像 -->
    <div
        v-else
        class="card-image default-avatar"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
    <!-- 成员信息 - 始终在底部 -->
    <div class="member-info">
      <p class="role-text">{{ role }}</p>
      <h3 class="name-text">{{ name }}</h3>
    </div>
    <!-- 遮罩层: 默认 #00000066, Hover 时透明 -->
    <div class="mask-layer"/>

    <!-- 边框: 默认 #A22A55/1px, Hover #FF2F7D/3px -->
    <div class="border-layer"/>


  </div>

  <!-- 历史成员卡片 -->
  <div
      v-else
      role="article"
      :aria-label="ariaLabel"
      class="member-card former-member"
  >
    <!-- 黑白图片 -->
    <img
        v-if="image"
        :src="image"
        :alt="name"
        class="card-image grayscale"
    />
    <!-- 默认头像 -->
    <div
        v-else
        class="card-image grayscale default-avatar"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>

    <!-- 遮罩层: 默认 #00000077, Hover #00000066 -->
    <div class="former-mask"/>

    <!-- FORMER 标签 -->
    <div class="former-tag" aria-hidden="true">
      FORMER
    </div>

    <!-- 成员信息 - 底部显示 -->
    <div class="member-info">
      <p class="former-role">{{ role }}</p>
      <h4 class="former-name">{{ name }}</h4>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 成员卡片基础样式 - 使用 padding-bottom 技巧实现 4:3 宽高比
.member-card {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  transition: all 180ms ease-out;
  width: 100%;
  aspect-ratio: 3/4;
}

// 当前成员卡片
.current-member {
  .card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 180ms ease-out;
  }

  // 遮罩层: 默认 #00000066
  .mask-layer {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.7);
    transition: background-color 180ms ease;
  }

  // 边框: 默认 #A22A55/1px
  .border-layer {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 23, 79, 0.7);
    border-radius: 4px;
    transition: all 180ms ease;
    pointer-events: none;
  }

  // 默认头像样式
  .default-avatar {
    background: linear-gradient(135deg, #2A1118 0%, #1a0a0f 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FF9BB8;

    svg {
      width: 40%;
      height: 40%;
      opacity: 0.6;
    }
  }

  // 成员信息
  .member-info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));

    .role-text {
      color: #D6CCEA;
      font-size: 12px;
      margin: 0 0 2px 0;
    }

    .name-text {
      color: #F2EEF8;
      font-size: 14px;
      font-weight: 700;
      margin: 0;
    }
  }

  // Hover 状态
  &:hover {
    .card-image {
      transform: scale(1.05);
    }

    .mask-layer {
      background-color: transparent;
    }

    .border-layer {
      border-color: #FF174F;
      border-width: 3px;
    }
  }
}

// 历史成员卡片
.former-member {
  .card-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .grayscale {
    filter: grayscale(100%);
  }

  // 遮罩层: 默认 #00000077
  .former-mask {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.47);
    transition: background-color 180ms ease;
  }

  // FORMER 标签
  .former-tag {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    background-color: #2A1118;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    color: #FF9BB8;
  }

  // 成员信息
  .member-info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px;
    z-index: 10;

    .former-role {
      color: #9F99AD;
      font-size: 10px;
      margin: 0 0 2px 0;
      transition: color 180ms ease;
    }

    .former-name {
      color: #9F99AD;
      font-size: 12px;
      font-weight: 500;
      margin: 0;
      transition: color 180ms ease;
    }
  }

  // Hover 状态
  &:hover {
    .former-mask {
      background-color: rgba(0, 0, 0, 0.4);
    }

    .former-role,
    .former-name {
      color: #B7B0C8;
    }
  }
}

// 尊重用户偏好：减少动画
@media (prefers-reduced-motion: reduce) {
  .member-card,
  .member-card * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  .current-member:hover .card-image {
    transform: none;
  }
}

// 默认头像样式
.default-avatar {
  background: linear-gradient(135deg, #2A1118 0%, #1a0a0f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF9BB8;

  svg {
    width: 40%;
    height: 40%;
    opacity: 0.6;
  }
}

// 键盘焦点样式
[role="article"]:focus-visible {
  outline: 2px solid #FF2F7D;
  outline-offset: 2px;
}

// 触摸设备优化：禁用 hover 效果
@media (hover: none) {
  .current-member:active .card-image {
    transform: scale(0.98);
  }
}
</style>
