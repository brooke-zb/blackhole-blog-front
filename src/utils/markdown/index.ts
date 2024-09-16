import MarkdownIt from 'markdown-it'
import 'katex/dist/katex.min.css'
import taskLists from 'markdown-it-task-lists'
import katex from '@vscode/markdown-it-katex'
import ClipboardJs from 'clipboard'
import { highlightPlugin, preWrapperPlugin } from './plugins/preWrapper'
import { containerPlugin } from './plugins/containers'
import { gitHubAlertsPlugin } from './plugins/githubAlerts'
import type BhGallery from '@/components/bh-gallery/index.vue'

export async function createMarkdownRenderer() {
  const md = new MarkdownIt({
    html: true,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
  })
  md.use(await highlightPlugin())
    .use(containerPlugin)
    .use(preWrapperPlugin)
    .use(gitHubAlertsPlugin)

  // heading
  const headingClass = [
    'text-3xl pt-3 pb-1.5',
    'text-2xl pt-3 pb-1.5',
    'text-xl pt-3 pb-1.5',
    'text-lg pt-2 pb-1',
    'text-lg pt-1.5 pb-1',
    'text-base py-1',
  ]
  md.renderer.rules.heading_open = (tokens, idx, options, env, slf) => {
    if (!env.anchor_id) {
      env.anchor_id = 0
      env.anchor_set = new Set<string>()
    }
    env.anchor_id++

    const slug = tokens[idx + 1].content.replace(/\s+/g, '-').toLowerCase()
    const id = `${env.anchor_id}-${slug}`

    const token = tokens[idx]
    const level = Number.parseInt(token.tag.substring(1)) - 1
    token.attrSet('class', `${headingClass[level]} text-primary-700 dark:text-dark-200`)
    token.attrSet('id', id)
    if (level < 3) {
      useAnchorStore().add({
        id,
        level: level + 1,
        title: tokens[idx + 1].content,
      })
    }
    return slf.renderToken(tokens, idx, options)
  }

  // paragraph
  md.renderer.rules.paragraph_open = (tokens, idx, options, _env, slf) => {
    const token = tokens[idx]
    token.attrSet('class', 'article-paragraph text-lg')
    return slf.renderToken(tokens, idx, options)
  }

  // list
  md.renderer.rules.bullet_list_open = (tokens, idx, options, _env, slf) => {
    const token = tokens[idx]
    token.attrSet('class', 'list-disc list-inside')
    return slf.renderToken(tokens, idx, options)
  }
  md.renderer.rules.ordered_list_open = (tokens, idx, options, _env, slf) => {
    const token = tokens[idx]
    token.attrSet('class', 'list-decimal list-inside')
    return slf.renderToken(tokens, idx, options)
  }

  // link
  md.renderer.rules.link_open = (tokens, idx, options, _env, slf) => {
    const token = tokens[idx]
    token.attrSet('target', '_blank')
    token.attrSet('class', 'link')
    return slf.renderToken(tokens, idx, options)
  }

  // image
  md.renderer.rules.image = (tokens, idx, options, _env, slf) => {
    const token = tokens[idx]
    token.attrSet('class', 'min-w-0 cursor-pointer')
    token.attrSet('data-gallery', '')
    token.attrSet('data-alt', token.content)
    token.attrSet('data-src', token.attrGet('src') || '')
    return `<div class="flex flex-col items-center max-w-4xl mx-auto">${slf.renderToken(tokens, idx, options)}<h6 class=" text-gray-500">${token.content}</h6></div>`
  }

  md.use(katex)

  // task lists
  md.use(taskLists)

  return md
}

interface AfterRenderOptions {
  /**
   * 图片灯箱实例
   */
  gallery?: InstanceType<typeof BhGallery>
  /**
   * I18n函数
   */
  t: (key: string) => string
}

export function afterMarkdownRender(options: AfterRenderOptions) {
  const toast = useToast()

  // 图片灯箱
  options.gallery?.init('[data-gallery]')

  // 代码复制
  nextTick(() => {
    document.querySelectorAll('[data-copy-code]').forEach((el) => {
      if (!(el instanceof HTMLElement))
        return
      const code = document.querySelector(`#${el.dataset.targetId} code`)?.textContent
      if (code) {
        new ClipboardJs(el, {
          text: () => code,
        }).on('success', () => {
          if (el.classList.contains('copied'))
            return
          el.classList.add('copied')
          setTimeout(() => {
            el.classList.remove('copied')
          }, 3000)
        }).on('error', () => {
          toast.add({
            type: 'danger',
            message: options.t('page.article.copy-fail'),
            duration: 3000,
          })
        })
      }
    })
  }).then(() => {
    // 代码组
    document.querySelectorAll('[data-code-group]').forEach((el) => {
      if (!(el instanceof HTMLElement))
        return
      const tabs = el.querySelector('.tabs') as HTMLElement
      const blocks = el.querySelector('.blocks') as HTMLElement
      const inputs = tabs.querySelectorAll('input')

      tabs.addEventListener('change', (e) => {
        if (!(e.target instanceof HTMLInputElement))
          return
        const index = Array.from(inputs).indexOf(e.target)
        const codeblocks = blocks.children
        for (let i = 0; i < codeblocks.length; i++) {
          if (i !== index) {
            codeblocks[i].classList.remove('active')
          }
          else if (!codeblocks[i].classList.contains('active')) {
            codeblocks[i].classList.add('active')
          }
        }
      })
    })
  })
}
