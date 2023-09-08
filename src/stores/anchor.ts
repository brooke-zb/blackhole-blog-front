import { defineStore } from 'pinia'

interface Anchor {
  id: string
  title: string
  level: number
}

interface AnchorState {
  anchors: Anchor[]
}

export const useAnchorStore = defineStore('anchor', () => {
  // state
  const state = ref<AnchorState>({
    anchors: [],
  })

  // actions
  function add(anchor: Anchor) {
    state.value.anchors.push(anchor)
  }
  function clear() {
    state.value.anchors = []
  }

  return {
    state,
    add,
    clear,
  }
})
