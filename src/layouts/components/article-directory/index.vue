<script setup lang="ts">
const { t } = useI18n()
const anchorStore = useAnchorStore()

const isShow = ref(false)

function toggleMenu() {
  isShow.value = !isShow.value
}

// 锚点跳转
function toAnchor(id: string) {
  const anchor = document.getElementById(id)
  if (anchor) {
    window.scrollTo({
      top: anchor.offsetTop - 56, // 减去导航栏的高度
      behavior: 'smooth',
    })
  }
}

// 点击外部关闭
function outsideClickListener() {
  toggleMenu()
}

function onAfterEnter() {
  document.addEventListener('click', outsideClickListener)
}

function onAfterLeave() {
  document.removeEventListener('click', outsideClickListener)
}
</script>

<template>
  <teleport to="body">
    <div class="fixed z-40 left-1 right-1 top-16 pointer-events-none">
      <bh-button
        v-tooltip="t('page.article.directory')" class="!absolute left-auto right-0 top-0 pointer-events-auto p-1.5 !rounded-lg
        fill-white bg-primary-500 dark:bg-dark-500 ring-primary-500 dark:ring-dark-500"
        @click="toggleMenu()"
      >
        <template #icon>
          <i-regular-list />
        </template>
      </bh-button>
      <transition name="directory" :css="true" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
        <ul
          v-show="isShow" class="bg-gray-50 dark:bg-slate-700 p-2 rounded-lg shadow-lg inline-block
          absolute left-auto right-0 top-0 pointer-events-auto origin-top-right"
          @click.stop=""
        >
          <li
            v-for="item in anchorStore.anchors" :key="item.id"
            class="directory block cursor-pointer px-1 py-0.5 hover:bg-primary-100 dark:hover:bg-slate-800"
            :data-level="item.level" @click="toAnchor(item.id)"
          >
            {{ item.title }}
          </li>
        </ul>
      </transition>
    </div>
  </teleport>
</template>

<style scoped>
.directory-enter-active,
.directory-leave-active {
  transition: all 0.3s;
}

.directory-enter-from,
.directory-leave-to {
  opacity: 0;
  transform: scale3d(0.8, 0.8, 1);
}

.directory-enter-to,
.directory-leave-from {
  opacity: 1;
  transform: scale3d(1, 1, 1);
}

.directory[data-level="2"] {
  padding-left: 1rem;
}
.directory[data-level="3"] {
  padding-left: 2rem;
}
</style>
