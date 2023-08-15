import { createApp } from 'vue'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:meta-layouts'
import { routes } from 'vue-router/auto/routes'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createPinia } from 'pinia'
import App from './App.vue'

if (isDark.value) {
  // import this value to activate dark mode
}

const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHistory(),
})

const i18n = createI18n({
  messages,
  locale: navigator.language,
  fallbackLocale: 'en',
})

createApp(App)
  .use(router)
  .use(createPinia())
  .use(i18n)
  .mount('#app')
