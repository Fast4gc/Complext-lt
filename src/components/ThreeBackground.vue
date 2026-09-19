<template>
  <div ref="containerRef" class="three-bg" aria-hidden="true"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let renderer = null
let animationId = 0
let disposed = false
let cleanup = () => {}
onBeforeUnmount(() => cleanup())

function makeCircleTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

onMounted(() => {
  if (!containerRef.value) return
  disposed = false

  const container = containerRef.value
  const width = container.clientWidth || window.innerWidth
  const height = container.clientHeight || window.innerHeight

  const mouse = { x: 0, y: 0 }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 50

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  } catch {
    return
  }
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  const count = 120
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 110
    positions[i * 3 + 1] = (Math.random() - 0.5) * 110
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.9,
    map: makeCircleTexture(),
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')

  function animate() {
    if (disposed) return
    if (!motion.matches) animationId = requestAnimationFrame(animate)
    const time = Date.now() * 0.0003
    const pos = geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(time + i * 0.5) * 0.008
      pos[i * 3] += Math.cos(time + i * 0.3) * 0.004
    }
    geometry.attributes.position.needsUpdate = true
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01
    camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.01
    camera.lookAt(0, 0, 0)
    renderer.render(scene, camera)
  }
  animate()
  const onMotionChange = () => {
    cancelAnimationFrame(animationId)
    animate()
  }
  motion.addEventListener('change', onMotionChange)

  const onMouseMove = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  const onResize = () => {
    if (!containerRef.value || !renderer) return
    const w = containerRef.value.clientWidth || window.innerWidth
    const h = containerRef.value.clientHeight || window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    if (motion.matches) renderer.render(scene, camera)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  cleanup = () => {
    disposed = true
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
    motion.removeEventListener('change', onMotionChange)
    geometry.dispose()
    material.map?.dispose()
    material.dispose()
    if (renderer) {
      renderer.dispose()
      if (renderer.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer = null
    }
  }
})
</script>

<style scoped>
.three-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
.three-bg :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
