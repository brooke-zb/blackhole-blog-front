<script lang="ts" setup>
const props = defineProps<{
  text: string
  el: Element
}>()

onMounted(() => {
  window.addEventListener('scroll', updatePos)
  updatePos()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePos)
})

const tooltip = ref<HTMLElement>()

function updatePos() {
  const rect = props.el.getBoundingClientRect()

  if (!rect || !tooltip.value) {
    return
  }
  const pos: Record<string, any> = {}

  const windowRect = {
    height: window.innerHeight,
    width: document.body.clientWidth - 1, // 防止精度问题导致进位
  }

  // y
  if (rect.bottom + tooltip.value.clientHeight + 5 < windowRect.height) {
    pos.top = rect.bottom + 5
  }
  else {
    pos.top = rect.top - tooltip.value.clientHeight - 5
  }

  // x
  const posX = rect.left + rect.width / 2 - tooltip.value.clientWidth / 2
  if (posX + tooltip.value.clientWidth > windowRect.width) {
    pos.left = windowRect.width - tooltip.value.clientWidth
  }
  else if (posX < 0) {
    pos.left = 0
  }
  else {
    pos.left = posX
  }

  gsap.set(tooltip.value, pos)
}
</script>

<template>
  <div
    ref="tooltip" class="fixed z-50 px-1.5 py-0.5 rounded text-sm
    bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
  >
    {{ props.text }}
  </div>
</template>
