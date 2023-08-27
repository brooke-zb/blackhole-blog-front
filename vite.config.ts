import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import MetaLayouts from 'vite-plugin-vue-meta-layouts'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      dts: 'src/types/router.d.ts',
    }),
    vue({
      script: {
        defineModel: true,
      },
    }),
    MetaLayouts(),
    VueI18n({
      include: path.resolve(__dirname, 'locales/**'),
    }),
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        'vue-i18n',
        '@vueuse/core',
        {
          '@/utils': [
            'isDark',
            'toggleDark',
            'useToast',
            'setPageLoading',
            'isPageLoading',
          ],
          '@/api': [
            ['default', 'api'],
          ],
          'lodash-es': [
            'throttle',
            'debounce',
          ],
          'dayjs': [
            ['default', 'dayjs'],
          ],
          'vue': [
            'defineModel',
          ],
          'gsap': [
            'gsap',
          ],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/stores',
        'src/utils/validation',
      ],
      vueTemplate: true,
    }),
    Components({
      dirs: [
        'src/components',
        'src/layouts',
        'src/layouts/components',
      ],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        IconsResolver({
          customCollections: ['regular', 'solid', 'brands'],
        }),
        {
          type: 'directive',
          resolve: (name: string) => {
            if (name === 'Tooltip') {
              return {
                name: 'vTooltip',
                from: '@/utils/tooltip',
              }
            }
          },
        },
      ],
      dts: 'src/types/components.d.ts',
    }),
    Icons({
      compiler: 'vue3',
      customCollections: {
        regular: FileSystemIconLoader('./src/icons/regular'),
        solid: FileSystemIconLoader('./src/icons/solid'),
        brands: FileSystemIconLoader('./src/icons/brands'),
      },
    }),
    VueDevTools(),
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/proxy': {
        target: 'http://127.0.0.1:80',
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(/^\/proxy/, ''),
      },
    },
  },
  envPrefix: 'BHBLOG_',
})
