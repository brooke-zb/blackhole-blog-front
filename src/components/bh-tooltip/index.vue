<script lang="ts" setup>
const props = defineProps<{
  text: string
}>()

const reference = ref<HTMLElement>()
const tooltip = ref<HTMLElement>()
const { x, y } = useFloating(reference, tooltip, {
  middleware: [shift(), flip(), offset(5)],
  whileElementsMounted: autoUpdate,
})

const pos = computed(() => ({
  x: `${x.value}px`,
  y: `${y.value}px`,
}))
const show = ref(false)

function onEnter() {
  show.value = true
}

function onLeave() {
  show.value = false
}
</script>

<template>
  <span ref="reference" @mouseenter="onEnter()" @mouseleave="onLeave()" @blur="onLeave()">
    <slot />
  </span>
  <teleport to="#bh-tooltip-container">
    <div
      ref="tooltip" :class="{ show }"
      class="bh-tooltip z-50 px-1.5 py-0.5 rounded text-sm
        bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900
        absolute left-0 top-0 transition-all duration-200"
    >
      {{ props.text }}
    </div>
  </teleport>
</template>

<style scoped>
.bh-tooltip {
  --translate-x: v-bind('pos.x');
  --translate-y: v-bind('pos.y');
  visibility: hidden;
  --scale-x: 0.75;
  --scale-y: 0.75;
  opacity: 0;
  transform: translate3d(var(--translate-x), var(--translate-y), 0) scale3d(var(--scale-x), var(--scale-y), 1);
}

.bh-tooltip.show {
  visibility: visible;
  --scale-x: 1;
  --scale-y: 1;
  opacity: 1;
}
</style>
