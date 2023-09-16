<template>
  <div class="flex">
    <admin-side-bar />
    <div class="h-screen overflow-y-auto grow">
      <admin-nav-bar />
      <div class="p-3">
        <router-view />
      </div>
    </div>
  </div>
</template>
