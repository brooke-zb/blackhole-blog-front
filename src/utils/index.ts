import type { MarkdownItAsync } from 'markdown-it-async'
import { isDark, toggleDark } from './dark'
import { isPageLoading, setPageLoading } from './loading'
import { afterMarkdownRender, createMarkdownRenderer } from './markdown'
import request from './request'
import { router } from './router'
import { useToast } from './toast'

let md: MarkdownItAsync

async function getMarkdownRenderer() {
  if (!md) {
    md = await createMarkdownRenderer()
  }
  return md
}

export {
  afterMarkdownRender,
  getMarkdownRenderer,
  isDark,
  isPageLoading,
  request,
  router,
  setPageLoading,
  toggleDark,
  useToast,
}
