import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import { nanoid } from 'nanoid'
import { extractLang } from './preWrapper'

export function containerPlugin(md: MarkdownIt) {
  md.use(container, 'code-group', createCodeGroup(md))
    .use(container, 'details', createDetails(md))
}

interface ContainerRender { render: RenderRule }

function extractTitle(info: string, html = false) {
  if (html) {
    return (
      info.replace(/<!--[\s\S]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || ''
    )
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt'
}

// 带标题的代码组
function createCodeGroup(md: MarkdownIt): ContainerRender {
  return {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const name = nanoid(5)
        let tabs = ''
        let checked = 'checked'

        for (
          let i = idx + 1;
          !(
            tokens[i].nesting === -1
            && tokens[i].type === 'container_code-group_close'
          );
          ++i
        ) {
          const isHtml = tokens[i].type === 'html_block'

          if (
            (tokens[i].type === 'fence' && tokens[i].tag === 'code')
            || isHtml
          ) {
            const title = extractTitle(
              isHtml ? tokens[i].content : tokens[i].info,
              isHtml,
            )

            if (title) {
              const id = nanoid(7)
              tabs += `<input type="radio" name="group-${name}" id="tab-${id}" ${checked}><label data-title="${md.utils.escapeHtml(title)}" for="tab-${id}">${title}</label>`

              if (checked && !isHtml)
                tokens[i].info += ' active'
              checked = ''
            }
          }
        }

        return `<div data-code-group class="bh-code-group"><div class="tabs">${tabs}</div><div class="blocks">\n`
      }
      return `</div></div>\n`
    },
  }
}

// 详情块
function createDetails(md: MarkdownIt): ContainerRender {
  return {
    render(tokens, idx, _options, env) {
      const token = tokens[idx]
      const info = token.info.trim().slice('details'.length).trim()
      const attrs = md.renderer.renderAttrs(token)
      if (token.nesting === 1) {
        const title = md.renderInline(info || 'Details', {
          references: env.references,
        })
        return `<details class="bh-details"${attrs}><summary>${title}</summary>\n`
      }
      else {
        return `</details>\n`
      }
    },
  }
}
