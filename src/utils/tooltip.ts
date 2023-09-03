import type { Directive } from 'vue'

let nextTooltipId = 0

const tooltipImpl = {
  add: (_tooltip: BhTooltip.Props) => {},
  remove: (_id: number) => {},
}

const vTooltip: Directive = {
  mounted(el: Element, binding: any) {
    const tooltip = {
      id: nextTooltipId++,
      el,
      content: binding.value,
    }
    const addTooltip = () => tooltipImpl.add(tooltip)
    const removeTooltip = () => tooltipImpl.remove(tooltip.id)

    // bind tooltip
    el.addEventListener('mouseenter', addTooltip)
    el.addEventListener('mouseleave', removeTooltip)
    el.addEventListener('blur', removeTooltip)

    // bind tooltip props to instance
    binding.instance.bhtooltip = {
      tooltip,
      addTooltip,
      removeTooltip,
    }
  },
  updated(el: Element, binding: any) {
    if (binding.value !== binding.oldValue) {
      const tooltip = {
        id: nextTooltipId++,
        el,
        content: binding.value,
      }
      const addTooltip = () => tooltipImpl.add(tooltip)
      const removeTooltip = () => tooltipImpl.remove(tooltip.id)

      // unbind old tooltip
      el.removeEventListener('mouseenter', binding.instance.addTooltip)
      el.removeEventListener('mouseleave', binding.instance.removeTooltip)
      el.removeEventListener('blur', binding.instance.removeTooltip)

      // bind new tooltip
      el.addEventListener('mouseenter', addTooltip)
      el.addEventListener('mouseleave', removeTooltip)
      el.addEventListener('blur', removeTooltip)

      // bind tooltip props to instance
      binding.instance.bhtooltip = {
        tooltip,
        addTooltip,
        removeTooltip,
      }
    }
  },
}

export {
  tooltipImpl,
  vTooltip,
}
