<template>
  <admin-side-bar />
  <div class="h-full w-full ps-16">
    <admin-nav-bar />
    <div class="m-3 p-2 bg-gray-50 dark:bg-slate-800 overflow-x-auto">
      <router-view />
    </div>
  </div>
</template>
