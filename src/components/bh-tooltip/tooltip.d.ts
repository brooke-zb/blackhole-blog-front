declare type TooltipProps = {
  id: number,
  el: Element,
  content: string,
}

declare type TooltipInstance = {
  add: (props: TooltipProps) => void,
  remove: (id: number) => void,
}