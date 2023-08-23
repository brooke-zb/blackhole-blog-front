import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'
import 'prismjs/components/prism-c.min.js'
import 'prismjs/components/prism-cpp.min.js'
import 'prismjs/components/prism-java.min.js'
import 'prismjs/components/prism-go.min.js'
import 'prismjs/components/prism-sql.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-typescript.min.js'
import 'prismjs/components/prism-python.min.js'
import 'prismjs/components/prism-glsl.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import taskLists from 'markdown-it-task-lists'

// line numbers
const NEW_LINE_EXP = /\n(?!$)/g
let lineNumbersWrapper = ''
Prism.hooks.add('after-tokenize', (env) => {
  const match = env.code.match(NEW_LINE_EXP)
  const linesNum = match ? match.length + 1 : 1
  const lines = Array.from({ length: linesNum + 1 }).join('<span></span>')

  lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`
})

const md = new MarkdownIt({
  html: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
})
md.options.highlight = function (str, lang, _attrs) {
  if (lang && Prism.languages[lang]) {
    return Prism.highlight(str, Prism.languages[lang], lang) + lineNumbersWrapper
  }
  return md.utils.escapeHtml(str) + lineNumbersWrapper
}

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
  return slf.renderToken(tokens, idx, options)
}

// paragraph
md.renderer.rules.paragraph_open = (tokens, idx, options, _env, slf) => {
  const token = tokens[idx]
  token.attrSet('class', 'article-paragraph text-lg')
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
  token.attrSet('class', 'min-w-0')
  token.attrSet('data-gallery', '')
  token.attrSet('data-src', token.attrGet('src') || '')
  return `<div class="flex flex-col items-center max-w-4xl mx-auto">${slf.renderToken(tokens, idx, options)}<h6 class=" text-gray-500">${token.content}</h6></div>`
}

// fence
md.renderer.rules.fence = (tokens, idx, options, _env, slf) => {
  const token = tokens[idx]
  const info = token.info ? md.utils.unescapeAll(token.info).trim() : ''
  let langName = ''
  let langAttrs = ''
  let highlighted
  let i
  let arr
  let tmpAttrs
  let tmpToken: any

  if (info) {
    arr = info.split(/(\s+)/g)
    langName = arr[0]
    langAttrs = arr.slice(2).join('')
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName, langAttrs) || md.utils.escapeHtml(token.content)
  }
  else {
    highlighted = md.utils.escapeHtml(token.content)
  }

  if (highlighted.indexOf('<pre') === 0) {
    return `${highlighted}\n`
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .deepClone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i = token.attrIndex('class')
    tmpAttrs = token.attrs ? token.attrs.slice() : []
    const langClass = options.langPrefix + langName

    if (i < 0) {
      tmpAttrs.push(['class', langClass])
    }
    else {
      tmpAttrs[i] = tmpAttrs[i].slice() as [string, string]
      tmpAttrs[i][1] += ` ${langClass}`
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs,
    }

    return `<div class="code-block"><div class="code-lang">${langName}</div>
    <pre class="line-numbers ${langClass}"><code${slf.renderAttrs(tmpToken)}>${highlighted}</code></pre>
    </div>\n`
  }

  return `<pre><code${slf.renderAttrs(token)}>${highlighted}</code></pre>\n`
}

// katex
md.use((md2) => {
  function isValidDelim(state: any, pos: number) {
    const max = state.posMax
    let can_open = true
    let can_close = true

    const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
    const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1

    // Check non-whitespace conditions for opening and closing, and
    // check that closing delimeter isn't followed by a number
    if (prevChar === 0x20/* " " */ || prevChar === 0x09
            ||/* \t */ (nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
      can_close = false
    }
    if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
      can_open = false
    }

    return {
      can_open,
      can_close,
    }
  }
  md2.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    let token, res, pos

    if (state.src[state.pos] !== '$') {
      return false
    }

    res = isValidDelim(state, state.pos)
    if (!res.can_open) {
      if (!silent) {
        state.pending += '$'
      }
      state.pos += 1
      return true
    }

    // First check for and bypass all properly escaped delimieters
    // This loop will assume that the first leading backtick can not
    // be the first character in state.src, which is known since
    // we have found an opening delimieter already.
    const start = state.pos + 1
    let match = state.src.indexOf('$', start)
    for (; match !== -1; match = state.src.indexOf('$', match)) {
      // Found potential $, look for escapes, pos will point to
      // first non escape when complete
      pos = match - 1
      while (state.src[pos] === '\\') {
        pos -= 1
      }

      // Even number of escapes, potential closing delimiter found
      if (((match - pos) % 2) === 1) {
        break
      }
      match += 1
    }

    // No closing delimter found.  Consume $ and continue.
    if (match === -1) {
      if (!silent) {
        state.pending += '$'
      }
      state.pos = start
      return true
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
      if (!silent) {
        state.pending += '$$'
      }
      state.pos = start + 1
      return true
    }

    // Check for valid closing delimiter
    res = isValidDelim(state, match)
    if (!res.can_close) {
      if (!silent) {
        state.pending += '$'
      }
      state.pos = start
      return true
    }

    if (!silent) {
      token = state.push('math_inline', 'math', 0)
      token.markup = '$'
      token.content = state.src.slice(start, match)
    }

    state.pos = match + 1
    return true
  })

  md2.block.ruler.after('blockquote', 'math_block', (state, start, end, silent) => {
    let firstLine, lastLine, next, lastPos
    let found = false
    let pos = state.bMarks[start] + state.tShift[start]
    let max = state.eMarks[start]

    if (pos + 2 > max) {
      return false
    }
    if (state.src.slice(pos, pos + 2) !== '$$') {
      return false
    }

    pos += 2
    firstLine = state.src.slice(pos, max)

    if (silent) {
      return true
    }
    if (firstLine.trim().slice(-2) === '$$') {
      // Single line expression
      firstLine = firstLine.trim().slice(0, -2)
      found = true
    }

    for (next = start; !found;) {
      next++

      if (next >= end) {
        break
      }

      pos = state.bMarks[next] + state.tShift[next]
      max = state.eMarks[next]

      if (pos < max && state.tShift[next] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        break
      }

      if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
        lastPos = state.src.slice(0, max).lastIndexOf('$$')
        lastLine = state.src.slice(pos, lastPos)
        found = true
      }
    }

    state.line = next + 1

    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = (firstLine && firstLine.trim() ? `${firstLine}\n` : '')
      + state.getLines(start + 1, next, state.tShift[start], true)
      + (lastLine && lastLine.trim() ? lastLine : '')
    token.map = [start, state.line]
    token.markup = '$$'
    return true
  }, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })

  // render
  function renderKatex(tokens: any, idx: number) {
    const latex = tokens[idx].content
    try {
      return katex.renderToString(latex)
    }
    catch (error: any) {
      console.error(error)
      return `<span class='katex-error' title='${md2.utils.escapeHtml(error.toString())}'>${md2.utils.escapeHtml(latex)}</span>`
    }
  }
  md2.renderer.rules.math_inline = function (tokens, idx) {
    return renderKatex(tokens, idx)
  }
  md2.renderer.rules.math_block = function (tokens, idx) {
    return `<p class="flex justify-center">${renderKatex(tokens, idx)}</p>`
  }
})

// task lists
md.use(taskLists)

export default md
