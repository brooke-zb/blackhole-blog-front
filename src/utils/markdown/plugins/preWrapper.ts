import type MarkdownIt from 'markdown-it'
import type { BundledLanguage } from 'shiki'
import Shiki from '@shikijs/markdown-it'
import { transformerMetaHighlight, transformerMetaWordHighlight, transformerNotationDiff } from '@shikijs/transformers'
import { customAlphabet } from 'nanoid'

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

const myBundleLangs: BundledLanguage[] = ['bash', 'bat', 'c', 'c#', 'c++', 'cmd', 'cpp', 'csharp', 'css', 'csv', 'diff', 'docker', 'dockerfile', 'dotenv', 'git-commit', 'git-rebase', 'glsl', 'go', 'groovy', 'html', 'ini', 'java', 'javascript', 'js', 'json', 'json5', 'jsonc', 'jsonl', 'jsx', 'kotlin', 'kql', 'kt', 'kts', 'log', 'lua', 'make', 'makefile', 'markdown', 'md', 'nginx', 'php', 'powershell', 'properties', 'proto', 'protobuf', 'ps', 'ps1', 'py', 'python', 'reg', 'regex', 'regexp', 'rs', 'ruby', 'rust', 'sass', 'scala', 'scss', 'sh', 'shader', 'shell', 'sql', 'svelte', 'swift', 'systemd', 'tex', 'toml', 'ts', 'tsx', 'typescript', 'vue', 'vue-html', 'wasm', 'wgsl', 'xml', 'yaml', 'yml', 'zig']

export async function highlightPlugin() {
  return Shiki({
    themes: defaultTheme,
    langs: myBundleLangs,
    transformers: [
      transformerNotationDiff({
        matchAlgorithm: 'v3',
      }),
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
    ],
  })
}
