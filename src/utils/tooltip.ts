import type { Directive } from 'vue'

let nextTooltipId = 0

const tooltipImpl = {
  add: (_tooltip: TooltipProps) => {},
  remove: (_id: number) => {},
}

const vTooltip: Directive = {
  mounted(el: Element, binding) {
    const tooltip = {
      id: nextTooltipId++,
      el,
      content: binding.value,
    }
    el.addEventListener('mouseenter', () => {
      tooltipImpl.add(tooltip)
    })
    el.addEventListener('mouseleave', () => {
      tooltipImpl.remove(tooltip.id)
    })
    el.addEventListener('blur', () => {
      tooltipImpl.remove(tooltip.id)
    })
  },
}

export {
  tooltipImpl,
  vTooltip,
}
