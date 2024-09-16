import type { BundledLanguage } from 'shiki'
import { bundledLanguages } from 'shiki'
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers'
import Shiki from '@shikijs/markdown-it'
import { customAlphabet } from 'nanoid'
import type MarkdownIt from 'markdown-it'

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

export function preWrapperPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    // remove title from info
    token.info = token.info.replace(/\[.*\]/, '')

    // eslint-disable-next-line regexp/no-unused-capturing-group
    const active = / active( |$)/.test(token.info) ? ' active' : ''
    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ')

    const id = nanoid()

    return `<div class="bh-pre${active}" id="${id}">
${fence(tokens, idx, options, env, self)}
<button class="bh-copy z-10" title="Copy" data-target-id="${id}" data-copy-code></button>
<div class="bh-lang z-5">${extractLang(token.info)}</div></div>`
  }
}

export async function highlightPlugin() {
  return Shiki({
    themes: defaultTheme,
    langs: Object.keys(bundledLanguages) as BundledLanguage[],
    transformers: [
      transformerNotationDiff({

      }),
      transformerMetaHighlight(),
    ],
  })
}
