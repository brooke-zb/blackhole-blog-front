<script setup lang="ts">
const props = defineProps<{
  noRing?: boolean
  disabled?: boolean
}>()

const ringClass = 'button-ring hover:ring-2 focus:ring-2 ring-offset-2 dark:ring-offset-slate-800 after:absolute after:transition-opacity after:inset-0 after:bg-black after:rounded-md after:opacity-0 active:after:opacity-30 outline-0'
const disabledClass = 'opacity-50 !cursor-not-allowed'
</script>

<template>
  <button
    class="select-none cursor-pointer p-1 relative inline-flex justify-center items-center rounded-md transition-shadow"
    :class="[props.noRing || props.disabled ? '' : ringClass, props.disabled ? disabledClass : '']"
    :disabled="props.disabled"
  >
    <slot name="icon" />
    <div v-if="$slots.default" :class="{ 'ml-1': $slots.icon && $slots.default }">
      <slot />
    </div>
  </button>
</template>

<style scoped>
.button-ring:focus {
  --tw-ring-opacity: 0.5;
}

.button-ring:hover {
  --tw-ring-opacity: 1;
}
</style>
