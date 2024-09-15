import type markdownIt from 'markdown-it'
import { isDark, toggleDark } from './dark'
import { isPageLoading, setPageLoading } from './loading'
import { router } from './router'
import request from './request'
import { createMarkdownRenderer } from './markdown'
import { useToast } from './toast'

let md: markdownIt

async function getMarkdownRenderer() {
  if (!md) {
    md = await createMarkdownRenderer()
  }
  return md
}

export {
  toggleDark,
  isDark,
  setPageLoading,
  isPageLoading,
  router,
  request,
  getMarkdownRenderer,
  useToast,
}
