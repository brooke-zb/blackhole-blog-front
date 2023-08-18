<route lang="yaml">
name: category-articles
  </route>

<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>{{ route.params.name }}</div>
</template>
