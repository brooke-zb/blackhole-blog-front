<!-- eslint-disable antfu/consistent-list-newline -->
<script setup lang="ts">
import fs from '@/assets/shaders/fragment.glsl'
import vs from '@/assets/shaders/vertex.glsl'
import * as twgl from 'twgl.js'

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
    background: [0.98, 0.98, 0.98],
    mixColorRatio: 0.4,
  },
  dark: {
    background: [0.058, 0.090, 0.164],
    mixColorRatio: 0.7,
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
    // eslint-disable antfu/consistent-list-newline
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
  const render = (time: number) => {
    twgl.resizeCanvasToDisplaySize(canvasEl.value!)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const delta = time - lastTime
    const slowTime = time * 0.0003
    lastTime = time

    centerX = centerX + delta * 0.0002

    const uniforms = {
      resolution: [canvasEl.value!.width, canvasEl.value!.height],
      bgColor: isDark.value ? Colors.dark.background : Colors.light.background,
      mixColorRatio: isDark.value ? Colors.dark.mixColorRatio : Colors.light.mixColorRatio,
      // 这里更改颜色数量后记得修改fragment.glsl中的COLOR_COUNT
      uTime: slowTime,
      colors: [
        0.31593, 0.03235, 0.72251, // purple
        0.83077, 0.00662, 0.20932, // pink
        0.86558, 0.38955, 0.01461, // orange
        0.21993, 0.49608, 0.39866, // teal
      ],
      colorCenter: [
        0.25, 0.25, // left bottom
        0.25, 0.75, // left top
        0.75, 0.75, // right top
        0.65, 0.35, // right bottom
      ],
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
