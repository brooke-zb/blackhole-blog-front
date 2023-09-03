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
      el.removeEventListener('mouseenter', binding.instance.bhtooltip.addTooltip)
      el.removeEventListener('mouseleave', binding.instance.bhtooltip.removeTooltip)
      el.removeEventListener('blur', binding.instance.bhtooltip.removeTooltip)
      binding.instance.bhtooltip.removeTooltip()

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
  beforeUnmount(el: Element, binding: any) {
    el.removeEventListener('mouseenter', binding.instance.bhtooltip.addTooltip)
    el.removeEventListener('mouseleave', binding.instance.bhtooltip.removeTooltip)
    el.removeEventListener('blur', binding.instance.bhtooltip.removeTooltip)
    binding.instance.bhtooltip.removeTooltip()
  },
}

export {
  tooltipImpl,
  vTooltip,
}
