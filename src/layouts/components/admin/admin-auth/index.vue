<script setup lang="ts">
const props = defineProps<{
  permission?: string
}>()

const userStore = useUserStore()

const show = computed(() => {
  if (props.permission) {
    return userStore.hasPermission(props.permission)
  }
  return true
})
</script>

<template>
  <template v-if="show">
    <slot />
  </template>
</template>
