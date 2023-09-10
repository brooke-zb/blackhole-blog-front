<script setup lang="ts">
import * as twgl from 'twgl.js'
import vs from '@/assets/shaders/vertex.glsl?raw&inline'
import fs from '@/assets/shaders/fragment.glsl?raw&inline'

const canvasEl = ref<HTMLCanvasElement>()

function getContext(el: HTMLCanvasElement): WebGLRenderingContext {
  const contextTypes = ['webgl2', 'webgl', 'experimental-webgl']
  for (const contextType of contextTypes) {
    const context = el.getContext(contextType)
    if (context) {
      return context as WebGLRenderingContext
    }
  }
  throw new Error('WebGL is not supported')
}

// 背景渲染颜色
const Colors = {
  light: {
    c1: [0.87, 1, 0.97],
    c2: [0.99, 0.89, 1],
    background: [0.98, 0.98, 0.98],
  },
  dark: {
    c1: [0, 0.16, 0.40],
    c2: [0.33, 0, 0.4],
    background: [0.04, 0.04, 0.10],
  },
}

onMounted(() => {
  const gl = getContext(canvasEl.value!)

  // render 2d
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)
  gl.clearColor(15 / 255, 23 / 255, 42 / 255, 1)
  const programInfo = twgl.createProgramInfo(gl, [vs, fs])
  const arrays = {
    position: [
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
    ],
  }
  const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

  let centerX = Math.random()
  let lastTime = 0
  const HALF_PI = Math.PI * 0.5
  const render = (time: number) => {
    twgl.resizeCanvasToDisplaySize(canvasEl.value!)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const delta = time - lastTime
    const slowTime = time * 0.0003
    lastTime = time

    centerX = centerX + delta * 0.0002

    const uniforms = {
      resolution: [canvasEl.value!.width, canvasEl.value!.height],
      c1Center: [Math.sin(centerX) * 0.5 + 0.5, Math.sin(slowTime) * 0.3 + 0.5],
      c2Center: [Math.cos(centerX + HALF_PI) * 0.5 + 0.5, Math.cos(slowTime + HALF_PI) * 0.3 + 0.5],
      c1Color: isDark.value ? Colors.dark.c1 : Colors.light.c1,
      c2Color: isDark.value ? Colors.dark.c2 : Colors.light.c2,
      backgroundColor: isDark.value ? Colors.dark.background : Colors.light.background,
    }
    gl.useProgram(programInfo.program)
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
    twgl.setUniforms(programInfo, uniforms)
    gl.clear(gl.COLOR_BUFFER_BIT)
    twgl.drawBufferInfo(gl, bufferInfo)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
})
</script>

<template>
  <canvas ref="canvasEl" class="fixed -z-50 top-0 left-0 w-full h-full pointer-events-none" />
</template>
