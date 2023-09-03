<route lang="yaml">
name: not-found
meta:
  layout: blog
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <bh-not-found code="404" :title="t('title.not-found')" />
</template>
