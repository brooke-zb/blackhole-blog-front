import { router } from '@/utils'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'

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
