<script setup lang="ts">

</script>

<template>
  <!-- arrow -->
  <div class="relative group/menu cursor-pointer">
    <slot />
    <div
      class="absolute top-full left-0 text-sm bg-gray-50 dark:bg-slate-800 shadow py-1
      border dark:border-slate-700 rounded invisible group-hover/menu:visible z-30
      scale-y-50 group-hover/menu:scale-y-100 opacity-0 group-hover/menu:opacity-100
      transition-all origin-top delay-150 text-gray-600 dark:text-gray-200 fill-gray-600 dark:fill-gray-200"
    >
      <slot name="menu" />
    </div>
  </div>
</template>
