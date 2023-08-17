<script setup lang="ts">
import beianImg from '@/assets/images/beian.png?url'

const beianNumber = import.meta.env.BHBLOG_BEIAN_NUMBER
const ownerName = import.meta.env.BHBLOG_OWNER_NAME
const startYear = import.meta.env.BHBLOG_START_YEAR
const currentYear = dayjs().year()
</script>

<template>
  <footer class="absolute bottom-0 h-20 w-full bg-gray-50/50 dark:bg-gray-900/50 flex justify-center">
    <div class="max-w-5xl grow grid grid-rows-1 grid-cols-3 sm:grid-cols-4 gap-2 p-2">
      <div class="hidden sm:block col-span-1" />
      <div class="text-left sm:text-center col-span-2">
        <div>
          © {{ startYear === currentYear ? currentYear : `${startYear} - ${currentYear}` }}
          by {{ ownerName }}
        </div>
        <div class="mt-2">
          <a class="link" target="_blank" href="https://beian.miit.gov.cn">
            <img alt="备案" class="inline align-text-bottom" :src="beianImg">{{ beianNumber }}
          </a>
        </div>
      </div>
      <div class="text-right col-span-1">
        <div>
          Power by
          <bh-tooltip text="BlackHole Blog">
            <a class="link" target="_blank" href="https://github.com/brooke-zb/blackhole-blog">BHBlog</a>
          </bh-tooltip>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
#app {
  @apply pb-20;
}
</style>
