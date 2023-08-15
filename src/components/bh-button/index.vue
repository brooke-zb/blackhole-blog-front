<script setup lang="ts">

</script>

<template>
  <button
    class="select-none cursor-pointer p-1
    relative inline-flex justify-center items-center transition-bg"
  >
    <slot name="icon" />
    <div v-if="$slots.default" :class="{ 'ml-1': $slots.icon && $slots.default }">
      <slot />
    </div>
  </button>
</template>
