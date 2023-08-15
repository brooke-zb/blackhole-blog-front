import { createApp } from 'vue'
import './style.css'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@/utils'

if (isDark.value) {
  // import this value to activate dark mode
}

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
