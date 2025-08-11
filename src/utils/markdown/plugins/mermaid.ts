import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
})

const id2MermaidMap = new Map<string, string>()

export function clearMermaid() {
  id2MermaidMap.clear()
}

export function addMermaid(id: string, content: string) {
  id2MermaidMap.set(id, content)
}

watch(isDark, renderMermaid)

export function renderMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark.value ? 'dark' : 'default',
  })
  return Promise.all(
    Array.from(id2MermaidMap.entries()).map(([id, content]) =>
      mermaid.render(`${id}-m`, content).then((result) => {
        const el = document.getElementById(id)
        if (el) {
          el.innerHTML = result.svg
          el.classList.add('mermaid')
        }
      }),
    ),
  )
}
