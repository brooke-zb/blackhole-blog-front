import type { MarkdownItAsync } from 'markdown-it-async'
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import { transformerMetaHighlight, transformerMetaWordHighlight, transformerNotationDiff } from '@shikijs/transformers'
import { customAlphabet } from 'nanoid'
import { codeToHtml } from 'shiki'
import { addMermaid } from './mermaid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

const defaultTheme = {
  light: 'github-light',
  dark: 'dracula',
}

export function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    // eslint-disable-next-line regexp/optimal-quantifier-concatenation
    .replace(/:(no-)?line-numbers(\{| |$|=\d*).*/, '')
    .replace(/(-vue|\{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '')
}

export function preWrapperPlugin(md: MarkdownItAsync) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, '')

    // eslint-disable-next-line regexp/no-unused-capturing-group
    const active = / active( |$)/.test(token.info) ? ' active' : ''
    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

    const id = nanoid()
    const lang = extractLang(token.info)
    if (lang === 'mermaid') {
      addMermaid(id, token.content)
      return `<div class="bh-mermaid-wrapper" id="${id}"></div>`
    }
    return `<div class="bh-pre${active}" id="${id}">
${fence(tokens, idx, options, env, self)}
<button class="bh-copy z-10" title="Copy" data-target-id="${id}" data-copy-code></button>
<div class="bh-lang z-5">${lang}</div></div>`
  }
}

export function highlightPlugin() {
  return fromAsyncCodeToHtml(
    codeToHtml,
    {
      themes: defaultTheme,
      transformers: [
        transformerNotationDiff({
          matchAlgorithm: 'v3',
        }),
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
      ],
    },
  )
}
