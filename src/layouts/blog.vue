<template>
  <nav-bar />
  <div class="container mx-auto px-1 pb-20">
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="page">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
  </div>
  <bottom-bar />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition-property: opacity, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.page-enter-active {
  transition-delay: 0.1s;
}
</style>
