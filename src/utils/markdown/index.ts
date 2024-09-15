import MarkdownIt from 'markdown-it'
import 'katex/dist/katex.min.css'
import taskLists from 'markdown-it-task-lists'
import katex from '@vscode/markdown-it-katex'
import { preWrapper } from './plugins/preWrapper'

export async function createMarkdownRenderer() {
  const md = new MarkdownIt({
    html: true,
    langPrefix: 'language-',
    linkify: false,
    typographer: false,
  })
  md.use(await preWrapper())

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
