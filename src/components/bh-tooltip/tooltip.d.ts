declare namespace BhTooltip {
  import type { MaybeRef } from 'vue'
  export type Props = {
    id: number,
    el: Element,
    content: string,
  }
  export type Instance = {
    add: (props: Props) => void,
    remove: (id: number) => void,
  }
}