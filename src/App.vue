<script setup lang="ts">
// 订阅store处理标题变化
const titleStore = useTitleStore()
useTitle(computed(() => titleStore.title ? `${titleStore.title} | ${import.meta.env.BHBLOG_APP_TITLE}` : import.meta.env.BHBLOG_APP_TITLE))
</script>

<template>
  <router-view />
  <loading />
  <tooltip-container />
  <toast-container />
</template>
