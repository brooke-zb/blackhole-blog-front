<script setup lang="ts">
const sourceImage = ref<HTMLImageElement>()
const isShow = ref(false)
let InOutRatios = 1
let InOutTranslateX = 0
let InOutTranslateY = 0
const refImage = ref<HTMLImageElement>()

const canZoom = ref(false)
const isZooming = ref(false)
const currentZoomRatios = ref(1)
const maxZoomRatios = ref(1)
const maxTranslateDistance = reactive({
  x: 0,
  y: 0,
})

// 图片灯箱功能
const image = ref()
const overlay = ref()

const isDragging = ref(false)
const startElement = ref<Element>()
const startPos = reactive({
  x: 0,
  y: 0,
})
const lastPos = reactive({
  x: 0,
  y: 0,
})
const distance = reactive({
  x: 0,
  y: 0,
})

const currentTranslate = computed(() => {
  let x = distance.x + lastPos.x - startPos.x
  let y = distance.y + lastPos.y - startPos.y
  if (x > maxTranslateDistance.x) {
    x = maxTranslateDistance.x + (x - maxTranslateDistance.x) * 0.1
  }
  else if (x < -maxTranslateDistance.x) {
    x = -maxTranslateDistance.x + (x + maxTranslateDistance.x) * 0.1
  }
  if (y > maxTranslateDistance.y) {
    y = maxTranslateDistance.y + (y - maxTranslateDistance.y) * 0.1
  }
  else if (y < -maxTranslateDistance.y) {
    y = -maxTranslateDistance.y + (y + maxTranslateDistance.y) * 0.1
  }
  return {
    x,
    y,
  }
})

// 动画
function onBeforeEnter(el: Element) {
  gsap.set(el, {
    '--tw-bg-opacity': 0,
  })
}

function onEnter(el: Element, done: () => void) {
  resetData()
  gsap.set(image.value, {
    scale: InOutRatios,
    translateX: InOutTranslateX,
    translateY: InOutTranslateY,
    onComplete: () => {
      gsap.to(el, {
        '--tw-bg-opacity': 0.9,
        'duration': 0.2,
        'onComplete': done,
      })
      gsap.to(image.value, {
        scale: 1,
        translateX: 0,
        translateY: 0,
        duration: 0.2,
      })
    },
  })
}

function onLeave(el: Element, done: () => void) {
  resetData()
  gsap.to(image.value, {
    scale: InOutRatios,
    translateX: InOutTranslateX,
    translateY: InOutTranslateY,
    duration: 0.2,
  })
  gsap.to(el, {
    '--tw-bg-opacity': 0,
    'duration': 0.2,
    'onComplete': () => {
      // 显示原图片
      sourceImage.value!.style.visibility = 'visible'

      done()
    },
  })
}

// init
const pictures = ref<HTMLImageElement[]>([])
const currentIndex = ref(0)
const currentPicture = ref('')
const currentAlt = ref('')
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target)
      const img = entry.target as HTMLImageElement
      if (img.dataset.src) {
        img.src = img.dataset.src
      }
    }
  })
})

function init(selector: string) {
  pictures.value = Array.from(document.querySelectorAll(selector))
  pictures.value.forEach((el, i) => {
    // init lazyload
    observer.observe(el)

    // bind gallery event
    el.addEventListener('click', () => {
      onGalleryEnter(el, i)
    })
  })
}

// 图片灯箱生命周期
function onGalleryEnter(el: HTMLImageElement, i: number) {
  if (el.complete) {
    sourceImage.value = el
    currentIndex.value = i + 1
    currentPicture.value = el.src
    currentAlt.value = el.dataset.alt || ''
    isShow.value = true
    refImage.value = el

    // 隐藏原图片
    el.style.visibility = 'hidden'

    // 绑定灯箱事件
    document.addEventListener('keyup', preventKeyListener)
    document.addEventListener('keydown', preventKeyListener)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('touchstart', onTouchStart, { passive: false })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd, { passive: false })
  }
}

function onGalleryClose() {
  isShow.value = false
  resetData()

  // 解绑灯箱事件
  document.removeEventListener('keyup', preventKeyListener)
  document.removeEventListener('keydown', preventKeyListener)
  document.removeEventListener('mousedown', onMouseDown)
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
}

function resetData() {
  // in out data
  if (refImage.value) {
    const rect = refImage.value.getBoundingClientRect()

    const scaleHeight = rect.height / Math.min(refImage.value.naturalHeight, window.innerHeight)
    const scaleWidth = rect.width / Math.min(refImage.value.naturalWidth, window.innerWidth)
    InOutRatios = Math.max(scaleHeight, scaleWidth)

    InOutTranslateX = -document.documentElement.clientWidth / 2 + (rect.left + rect.width / 2)
    InOutTranslateY = -document.documentElement.clientHeight / 2 + (rect.top + rect.height / 2)
  }

  // zoom data
  isZooming.value = false
  maxZoomRatios.value = image.value.naturalWidth / image.value.width
  canZoom.value = maxZoomRatios.value > 1

  // distance data
  distance.x = 0
  distance.y = 0
}

function onWheel(e: WheelEvent) {
  currentZoomRatios.value -= e.deltaY * currentZoomRatios.value / 1000
  computeMaxTranslate()
  if (canZoom.value) {
    // 放大
    if (currentZoomRatios.value > 1 && currentZoomRatios.value <= maxZoomRatios.value) {
      isZooming.value = true
      gsap.to(image.value, {
        scale: currentZoomRatios.value,
        duration: 0.2,
      })
    }
    // 放大超过最大值
    else if (currentZoomRatios.value > maxZoomRatios.value) {
      isZooming.value = true

      // 限制缩放
      currentZoomRatios.value = maxZoomRatios.value + (currentZoomRatios.value - maxZoomRatios.value) * 0.2
      gsap.to(image.value, {
        scale: currentZoomRatios.value,
        duration: 0.2,
        onComplete: () => {
          currentZoomRatios.value = maxZoomRatios.value
          gsap.to(image.value, {
            scale: currentZoomRatios.value,
            duration: 0.2,
          })
        },
      })
    }
    // 复原
    else {
      isZooming.value = false

      // 限制缩放
      currentZoomRatios.value = 1 - (1 - currentZoomRatios.value) * 0.2
      gsap.to(image.value, {
        scale: currentZoomRatios.value,
        duration: 0.2,
        onComplete: () => {
          currentZoomRatios.value = 1
          distance.x = 0
          distance.y = 0
          gsap.to(image.value, {
            scale: currentZoomRatios.value,
            translateX: 0,
            translateY: 0,
            duration: 0.2,
          })
        },
      })
    }
  }
  else {
    // 限制缩放
    currentZoomRatios.value = currentZoomRatios.value > 1 ? 1 + (currentZoomRatios.value - 1) * 0.2 : currentZoomRatios.value
    currentZoomRatios.value = currentZoomRatios.value < 1 ? 1 - (1 - currentZoomRatios.value) * 0.2 : currentZoomRatios.value
    gsap.to(image.value, {
      scale: currentZoomRatios.value,
      duration: 0.2,
      onComplete: () => {
        currentZoomRatios.value = 1
        gsap.to(image.value, {
          scale: maxZoomRatios.value,
          duration: 0.2,
        })
      },
    })
  }
}

function onMouseDown(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (e.button === 0) {
    isDragging.value = true
    startElement.value = e.target as Element

    startPos.x = e.clientX
    startPos.y = e.clientY
    lastPos.x = e.clientX
    lastPos.y = e.clientY
  }
}

function onMouseMove(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (isDragging.value) {
    // 缩放情况
    lastPos.x = e.clientX
    lastPos.y = e.clientY

    movePointerHandler()
  }
}

function onMouseUp(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (e.button === 0) {
    ReleasePointerHandler()
  }
}

function onTouchStart(e: TouchEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (e.touches.length === 1) {
    isDragging.value = true
    startElement.value = e.target as Element

    startPos.x = e.touches[0].clientX
    startPos.y = e.touches[0].clientY
    lastPos.x = e.touches[0].clientX
    lastPos.y = e.touches[0].clientY
  }
}

function onTouchMove(e: TouchEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (isDragging.value) {
    lastPos.x = e.touches[0].clientX
    lastPos.y = e.touches[0].clientY

    movePointerHandler()
  }
}

function onTouchEnd(e: TouchEvent) {
  e.stopPropagation()
  e.preventDefault()
  if (e.touches.length === 0) {
    ReleasePointerHandler()
  }
}

function movePointerHandler() {
  if (isZooming.value) {
    gsap.set(image.value, {
      translateX: currentTranslate.value.x,
      translateY: currentTranslate.value.y,
    })
  }
  else {
    gsap.set(image.value, {
      translateX: (lastPos.x - startPos.x) * 0.1,
      translateY: lastPos.y - startPos.y,
    })
  }
}

function ReleasePointerHandler() {
  // 非缩放情况
  if (!isZooming.value) {
    // 到达关闭临界点
    if (isDragToClose()) {
      onGalleryClose()
    }
    else {
      // 始于其他区域
      if (startElement.value?.tagName !== 'IMG') {
        if (isOnlyClick()) {
          onGalleryClose()
        }
        else {
          gsap.to(image.value, {
            translateX: 0,
            translateY: 0,
            duration: 0.2,
          })
        }
      }
      // 始于图片
      else {
        // 满足缩放条件
        if (isOnlyClick() && canZoom.value) {
          isZooming.value = true
          currentZoomRatios.value = maxZoomRatios.value
          computeMaxTranslate()
          gsap.to(image.value, {
            scale: currentZoomRatios.value,
            translateX: 0,
            translateY: 0,
            duration: 0.2,
          })
        }
        else {
          gsap.to(image.value, {
            translateX: 0,
            translateY: 0,
            duration: 0.2,
          })
        }
      }
    }
  }
  // 缩放情况
  else {
    // 取消缩放
    if (isOnlyClick()) {
      isZooming.value = false
      currentZoomRatios.value = 1
      distance.x = 0
      distance.y = 0
      gsap.to(image.value, {
        scale: currentZoomRatios.value,
        translateX: 0,
        translateY: 0,
        duration: 0.2,
      })
    }
    // 计算移动距离
    else {
      computeDistance()
      gsap.to(image.value, {
        translateX: distance.x,
        translateY: distance.y,
        duration: 0.2,
      })
    }
  }
  isDragging.value = false
  startElement.value = undefined
}

// 杂项
const closeKeys = new Set(['Escape', 'Backspace', 'Delete'])
const preventKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])

function preventKeyListener(e: KeyboardEvent) {
  if (closeKeys.has(e.key)) {
    onGalleryClose()
  }
  if (preventKeys.has(e.key)) {
    e.preventDefault()
  }
}

function computeMaxTranslate() {
  const x = image.value.naturalWidth - document.documentElement.clientWidth
  const y = image.value.naturalHeight - document.documentElement.clientHeight
  maxTranslateDistance.x = x > 0 ? x / 2 : 0
  maxTranslateDistance.y = y > 0 ? y / 2 : 0
}

function computeDistance() {
  distance.x = currentTranslate.value.x
  distance.y = currentTranslate.value.y
  if (currentTranslate.value.x > maxTranslateDistance.x) {
    distance.x = maxTranslateDistance.x
  }
  else if (currentTranslate.value.x < -maxTranslateDistance.x) {
    distance.x = -maxTranslateDistance.x
  }
  if (currentTranslate.value.y > maxTranslateDistance.y) {
    distance.y = maxTranslateDistance.y
  }
  else if (currentTranslate.value.y < -maxTranslateDistance.y) {
    distance.y = -maxTranslateDistance.y
  }
}

function isOnlyClick() {
  return Math.abs(lastPos.x - startPos.x) + Math.abs(lastPos.y - startPos.y) < 6
}

function isDragToClose() {
  return Math.abs(lastPos.y - startPos.y) > 100
}

const classAppend = computed(() => ({
  'max-h-full max-w-full': true,
  'cursor-zoom-in': canZoom.value && !isZooming.value,
  'cursor-grab': !canZoom.value || isZooming.value,
  'cursor-grabbing': isDragging.value,
}))

defineExpose({
  init,
})

onUnmounted(() => {
  observer.disconnect()
})
</script>

<template>
  <teleport to="body">
    <transition :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave">
      <div
        v-show="isShow" class="fixed top-0 left-0 w-full h-full overflow-hidden
        bg-gray-900 z-30 select-none flex flex-col justify-between"
        @wheel.stop.prevent="onWheel"
      >
        <!-- 提示栏 -->
        <div class="flex justify-between z-30">
          <div class="px-3 text-xs text-gray-200 flex justify-center items-center">
            {{ currentIndex }} / {{ pictures.length }}
          </div>
          <div
            class="p-3 cursor-pointer fill-gray-300 hover:fill-gray-50 transition-colors"
            @click="onGalleryClose"
          >
            <i-solid-xmark class="w-5 h-5" />
          </div>
        </div>

        <!-- 图片 -->
        <div ref="overlay" class="picture-container flex justify-center items-center">
          <img ref="image" :src="currentPicture" alt="" :class="classAppend">
        </div>

        <!-- alt信息 -->
        <div
          class="p-3 text-sm text-gray-200 flex justify-center items-center
          bg-gradient-to-b from-transparent to-black/60 z-30"
        >
          {{ currentAlt }}
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.picture-container {
  height: calc(100vh - 6.5rem);
}
</style>
