<route lang="yaml">
name: index
</route>

<script setup lang="ts">
const { t } = useI18n()
setTitle(t('title.index'))
</script>

<template>
  <div class="text-indigo-500">
    This is index
  </div>
</template>
