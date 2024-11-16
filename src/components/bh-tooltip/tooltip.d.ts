declare namespace BhTooltip {
  export interface Props {
    id: number
    el: Element
    content: string
  }
  export interface Instance {
    add: (props: Props) => void
    remove: (id: number) => void
  }
}
