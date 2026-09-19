<template>
  <div ref="containerRef" class="three-bg"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const containerRef = ref(null)
let scene, camera, renderer, animationId, mouse

onMounted(() => {
  if (!containerRef.value) return

  const container = containerRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  mouse = { x: 0, y: 0 }

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035)

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 30

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x0a0a0a, 0)
  container.appendChild(renderer.domElement)

  const geometry = new THREE.IcosahedronGeometry(1, 0)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.08,
  })

  const particles = []
  const particleCount = 200

  for (let i = 0; i < particleCount; i++) {
    const pGeometry = new THREE.IcosahedronGeometry(Math.max(0.01, Math.random() * 0.5), 0)
    const pMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: Math.random() * 0.3 + 0.05,
    })
    const particle = new THREE.Mesh(pGeometry, pMaterial)
    particle.position.x = (Math.random() - 0.5) * 80
    particle.position.y = (Math.random() - 0.5) * 80
    particle.position.z = (Math.random() - 0.5) * 80
    particle.rotation.x = Math.random() * Math.PI * 2
    particle.rotation.y = Math.random() * Math.PI * 2
    scene.add(particle)
    particles.push(particle)
  }

  const icosahedron = new THREE.Mesh(geometry, material)
  icosahedron.position.z = -10
  scene.add(icosahedron)

  const icosahedron2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(Math.max(0.01, 0.8), 0),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 })
  )
  icosahedron2.position.z = -20
  scene.add(icosahedron2)

  const icosahedron3 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(Math.max(0.01, 1.2), 1),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.03 })
  )
  icosahedron3.position.z = 5
  scene.add(icosahedron3)

  function animate() {
    animationId = requestAnimationFrame(animate)

    const time = Date.now() * 0.001

    icosahedron.rotation.x = time * 0.1
    icosahedron.rotation.y = time * 0.15
    icosahedron2.rotation.x = -time * 0.08
    icosahedron2.rotation.y = time * 0.1
    icosahedron3.rotation.x = time * 0.05
    icosahedron3.rotation.y = -time * 0.07

    particles.forEach((p, i) => {
      p.rotation.x += 0.001
      p.rotation.y += 0.001
      p.position.y += Math.sin(time + i) * 0.002
    })

    const targetX = mouse.x * 0.5
    const targetY = mouse.y * 0.5
    camera.position.x += (targetX - camera.position.x) * 0.02
    camera.position.y += (-targetY - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }

  animate()

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
})

function onMouseMove(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1
}

function onResize() {
  if (!containerRef.value || !camera || !renderer) return
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  if (renderer && renderer.domElement && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
})
</script>

<style scoped>
.three-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.three-bg :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
