<route lang="yaml">
name: about
</route>

<script setup lang="ts">
const titleStore = useTitleStore()
const { t } = useI18n()
titleStore.title = t('link.about')
</script>

<template>
  <div class="py-2">
    <h2 class="text-2xl text-primary-700 dark:text-dark-200 tracking-wide py-2">
      关于本站
    </h2>
    <p class="my-1">
      一个分享技术的博客，一开始给自己挖了很多坑，后面发现填不上了也就随缘更新了。
    </p>
    <p class="my-1">
      博客系统和前端主题是自己编写的，自用为主，<a class="link" target="_blank" href="https://github.com/brooke-zb/blackhole-blog">后端代码地址</a>
    </p>
    <h2 class="text-2xl text-primary-700 dark:text-dark-200 tracking-wide py-2">
      关于博主
    </h2>
    <img class="max-h-36 my-1" src="@/assets/images/avatar.png">
    <p class="my-1">
      24岁，是学生，也是一名程序猿，主后端开发，前端也有所涉猎，甚至还是个半吊子美工。
    </p>
    <p class="my-1">
      博主的学习动力基本上来源于视觉驱动和<a class="link" target="_blank" href="https://antfu.me/posts/about-yak-shaving-zh">Yak Shaving</a>，有时候看到一个不错的项目，可以是一个好看的页面设计，或者是一个实用的功能，就会尝试自己去复现出来，在这个过程可能会考虑到各种问题，比如性能、安全、用户体验等，又会去查阅相关资料，思考解决方案，通过这种Yak Shaving的方式，不知不觉就丰富了自己的技术栈。<span class="bg-black text-black hover:text-white">如果你通过链接去了解了Yak Shaving，这又何尝不是一种Yak Shaving呢？</span>
    </p>
    <h2 class="text-2xl text-primary-700 dark:text-dark-200 tracking-wide py-2">
      联系我
    </h2>
    <ul class="my-1">
      <li>
        <div v-tooltip="'Github'" class="inline-flex items-center gap-2">
          <i-brands-github class="inline" />
          <a class="link" target="_blank" href="https://github.com/brooke-zb">brooke-zb</a>
        </div>
      </li>
      <li class="flex items-center gap-2">
        <div v-tooltip="'Bilibili'" class="inline-flex items-center gap-2">
          <i-brands-bilibili class="inline" />
          <a class="link" target="_blank" href="https://space.bilibili.com/14910487">brooke_zb</a>
        </div>
      </li>
      <li class="flex items-center gap-2">
        <div v-tooltip="t('page.about.email')" class="inline-flex items-center gap-2">
          <i-regular-envelope class="inline" />
          <a class="link" href="mailto:me@brookezb.com">me@brookezb.com</a>
        </div>
      </li>
    </ul>
  </div>
</template>
