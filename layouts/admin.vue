<script setup lang="ts">
// 强制使用浅色模式
definePageMeta({
  colorMode: 'light'
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <slot />
  </div>
</template>
