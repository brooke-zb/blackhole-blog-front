import { defineStore } from 'pinia'

interface Anchor {
  id: string
  title: string
  level: number
}

export const useAnchorStore = defineStore('anchor', () => {
  // state
  const anchors = ref<Anchor[]>([])

  // actions
  function add(anchor: Anchor) {
    anchors.value.push(anchor)
  }
  function clear() {
    anchors.value = []
  }

  return {
    anchors,
    add,
    clear,
  }
})
