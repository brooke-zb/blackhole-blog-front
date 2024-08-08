declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it'

  const taskLists: MarkdownIt.PluginSimple
  export default taskLists
}

declare module '*?raw&inline' {
  const src: string
  export default src
}
