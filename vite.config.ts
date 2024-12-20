import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import glsl from 'vite-plugin-glsl'
import VueDevTools from 'vite-plugin-vue-devtools'
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
            'once',
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
          customCollections: ['regular', 'solid', 'brands', 'sharp-regular', 'sharp-solid'],
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
        'regular': FileSystemIconLoader('./src/icons/regular'),
        'solid': FileSystemIconLoader('./src/icons/solid'),
        'brands': FileSystemIconLoader('./src/icons/brands'),
        'sharp-regular': FileSystemIconLoader('./src/icons/sharp-regular'),
        'sharp-solid': FileSystemIconLoader('./src/icons/sharp-solid'),
      },
    }),
    glsl({
      compress: true,
    }),
    VueDevTools(),
  ],
  define: {
    __INTLIFY_JIT_COMPILATION__: true,
    __INTLIFY_DROP_MESSAGE_COMPILER__: true,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/proxy': {
        target: 'https://blog.brookezb.com/api/v2',
        changeOrigin: true,
        followRedirects: true,
        rewrite: path => path.replace(/^\/proxy/, ''),
      },
    },
  },
  envPrefix: 'BHBLOG_',
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunkInfo) => {
          // 防止shiki中的clarity模块被广告拦截器误判为跟踪器
          if (chunkInfo.name && chunkInfo.name.includes('clarity')) {
            return `assets/clearness-[hash].js`
          }
          return `assets/[name]-[hash].js`
        },
      },
    },
  },
})
