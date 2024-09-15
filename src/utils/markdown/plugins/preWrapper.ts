import type { BundledLanguage } from 'shiki'
import { bundledLanguages } from 'shiki'
import { transformerMetaHighlight, transformerNotationDiff } from '@shikijs/transformers'
import Shiki from '@shikijs/markdown-it'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 10)

const defaultTheme = {
  light: 'github-light',
  dark: 'dracula',
}

function parseLang(lang: string | number | null | (number | string)[] | boolean | undefined): string {
  if (typeof lang === 'string' && lang.startsWith('language-'))
    return lang.replace(/language-/, '')
  if (Array.isArray(lang)) {
    return lang.filter(l => typeof l === 'string')
      .filter(l => l.startsWith('language-'))
      .map(l => l.replace(/language-/, ''))[0] ?? ''
  }
  return ''
}

export async function preWrapper() {
  return Shiki({
    themes: defaultTheme,
    langs: Object.keys(bundledLanguages) as BundledLanguage[],
    transformers: [
      transformerNotationDiff(),
      transformerMetaHighlight(),
      {
        name: 'bhblog:add-copy-btn',
        pre(node) {
          const codeNode = node.children[0]

          // 支持显示语言
          if (codeNode.type !== 'element' || codeNode.tagName !== 'code')
            return
          const lang = parseLang(codeNode.properties.class)
          if (!lang)
            return
          const langNode = {
            type: 'element' as const,
            tagName: 'div',
            properties: {
              class: ['bh-lang z-5'],
            },
            children: [{ type: 'text' as const, value: lang }],
          }
          node.children.unshift(langNode)

          // 支持代码复制
          const id = nanoid()
          node.properties.id = id

          const copyBtn = {
            type: 'element' as const,
            tagName: 'button',
            properties: {
              title: 'Copy',
              class: ['bh-copy z-10'],
              dataTargetId: id,
              dataCopyCode: true,
            },
            children: [],
          }
          node.children.unshift(copyBtn)
        },
      },
    ],
  })
}
