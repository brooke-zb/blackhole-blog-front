<script setup lang="ts">
import { tooltipImpl } from '@/utils/tooltip'

const tooltipQueue = ref<BhTooltip.Props[]>([])

tooltipImpl.add = function (tooltip: BhTooltip.Props) {
  for (let i = 0; i < tooltipQueue.value.length; i++) {
    if (tooltipQueue.value[i].id === tooltip.id) {
      return
    }
  }
  tooltipQueue.value.push(tooltip)
}

tooltipImpl.remove = function (id: number) {
  for (let i = 0; i < tooltipQueue.value.length; i++) {
    if (tooltipQueue.value[i].id === id) {
      tooltipQueue.value.splice(i, 1)
      break
    }
  }
}
</script>

<template>
  <teleport to="body">
    <transition-group name="tooltip">
      <bh-tooltip
        v-for="item in tooltipQueue" :key="item.id"
        :el="item.el" :text="item.content"
      />
    </transition-group>
  </teleport>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition-property: opacity, transform;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale3d(0.8, 0.8, 1);
}

.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
  transform: scale3d(1, 1, 1);
}
</style>
