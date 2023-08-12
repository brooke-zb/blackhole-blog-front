<route lang="yaml">
name: not-found
meta:
  layout: 404
</route>

<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    <h1>{{ t('not-found') }}</h1>
  </div>
</template>
