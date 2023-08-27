<script setup lang="ts">
const text = '咕咕咕...'

const loading = ref<HTMLElement>()

// 使用js控制动画，避免页面切换时强制等待动画结束
watchEffect(() => {
  if (isPageLoading.value) {
    loading.value?.classList.add('loading-enter')
  }
  else {
    loading.value?.classList.remove('loading-enter')
  }
})
</script>

<template>
  <div
    ref="loading"
    class="fixed w-full h-full top-0 left-0 bg-black/60 flex justify-center items-center z-50
    transition-all duration-300 opacity-0 invisible"
  >
    <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-sm text-black dark:text-white shadow-xl">
      <div class="pb-2 text-center">
        {{ text }}
      </div>
      <div
        class="relative w-64 h-1 bg-gray-200 dark:bg-gray-600
        before:absolute before:h-1 before:bg-primary-500 dark:before:bg-dark-400 progress-bar"
      />
    </div>
  </div>
</template>

<style scoped>
.progress-bar::before {
  animation: progress-bar 1.5s linear infinite;
}

@keyframes progress-bar {
  0% {
    left: 0;
    width: 0;
  }
  50% {
    left: 64px;
    width: 128px;
  }
  100% {
    left: 256px;
    width: 0;
  }
}

.loading-enter {
  opacity: 1 !important;
  visibility: visible !important;
}
</style>
