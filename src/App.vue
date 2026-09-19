<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ThreeBackground from './components/ThreeBackground.vue'

gsap.registerPlugin(ScrollTrigger)

const headerRef = ref(null)
const heroTitleRef = ref(null)
const heroSubtitleRef = ref(null)
const cardsGridRef = ref(null)
const featuresSectionRef = ref(null)
const featuresRefs = ref([])
const footerRef = ref(null)
const heroSectionRef = ref(null)
const isHeaderVisible = ref(true)
let ctx

const setFeatureRef = (el) => {
  if (el) featuresRefs.value.push(el)
}

const heroCards = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  scale: 0.8 + Math.random() * 0.4,
  y: Math.random() * 100,
  delay: Math.random() * 2
}))

onMounted(() => {
  ctx = gsap.context(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      document.addEventListener('mousemove', onTiltMove)
    })

    ScrollTrigger.create({
      start: 'top top',
      end: 100,
      onUpdate: (self) => {
        isHeaderVisible.value = self.scroll() <= 50
      }
    })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.hero-card', {
      rotationY: 90,
      rotationX: 45,
      opacity: 0,
      scale: 0.3,
      z: -100,
      duration: 1.2,
      stagger: { amount: 1.2, from: 'center', ease: 'back.out(1.7)' },
      transformPerspective: 800,
      transformOrigin: 'center center'
    })

    .from(heroTitleRef.value, {
      rotationX: 45,
      y: 80,
      opacity: 0,
      filter: 'blur(20px)',
      duration: 1,
      transformPerspective: 1000,
    }, '-=0.8')

    .from(heroSubtitleRef.value, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')

    gsap.to(cardsGridRef.value, {
      scrollTrigger: {
        trigger: heroSectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: -300,
      x: -50,
      opacity: 0.15,
      rotationZ: -5,
      transformPerspective: 600
    })

    featuresRefs.value.forEach((el, index) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 80,
        opacity: 0,
        scale: 0.8,
        rotationX: 15,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out',
        transformPerspective: 800
      })
    })

    gsap.from(footerRef.value, {
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 90%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})

function onTiltMove(e) {
  const cards = document.querySelectorAll('.feature-card-3d')
  const rect = heroSectionRef.value?.getBoundingClientRect()
  if (!rect) return
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const mouseX = (e.clientX - centerX) / window.innerWidth
  const mouseY = (e.clientY - centerY) / window.innerHeight

  cards.forEach((card, i) => {
    const depth = (i % 3 + 1) * 20
    gsap.to(card, {
      rotationY: mouseX * 15 * (depth / 20),
      rotationX: -mouseY * 15 * (depth / 20),
      translateZ: mouseX * depth,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: true
    })
  })
}

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
  if (lenisRef) {
    lenisRef.destroy()
  }
  document.removeEventListener('mousemove', onTiltMove)
})

let lenisRef = null
</script>

<template>
  <div class="site-container bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
    <ThreeBackground />

    <!-- HEADER -->
    <header
      ref="headerRef"
      class="fixed-top p-4 transition-slow z-50"
      :class="{ 'opacity-0 -translate-y-full pointer-events-none': !isHeaderVisible }"
      style="transform-style: preserve-3d;"
    >
      <nav class="container-fluid d-flex justify-content-between align-items-center glass-dark rounded-flow p-3 px-4 max-w-7xl mx-auto shadow-2xl" style="transform-style: preserve-3d;">
        <a href="/" class="d-flex align-items-center text-decoration-none text-white fw-black tracking-tighter gap-2 hover:opacity-70 transition-slow">
          <img src="/src/assets/imgs/logo/complext-logo.webp" alt="Complext Logo" class="logo">
          <span class="fs-4 uppercase">Complext</span>
        </a>
        <div class="d-flex gap-4">
          <a href="#subthemes" class="text-white text-opacity-50 hover:text-opacity-100 text-decoration-none fw-bold small transition-slow uppercase tracking-widest">Explore</a>
          <a href="https://github.com/Fast4gc/Complext" class="text-white text-opacity-50 hover:text-opacity-100 text-decoration-none fw-bold small transition-slow uppercase tracking-widest">Github</a>
        </div>
      </nav>
    </header>

    <main>
      <!-- HERO SECTION -->
      <section id="hero" ref="heroSectionRef" class="min-h-screen position-relative d-flex flex-column align-items-center justify-content-center overflow-hidden pt-20" style="perspective: 1000px; transform-style: preserve-3d;">

        <!-- Ambient 3D Glows -->
        <div class="ambient-glow glow-1 parallax-back" style="transform-style: preserve-3d;"></div>
        <div class="ambient-glow glow-2 parallax-back" style="transform-style: preserve-3d;"></div>
        <div class="ambient-glow glow-3 pulse-glow" style="transform-style: preserve-3d;"></div>

        <!-- Animated Background Cards Grid -->
        <div ref="cardsGridRef" class="position-absolute top-0 start-0 w-100 h-100 d-grid grid-cols-4 md:grid-cols-6 gap-3 p-3 opacity-15 pointer-events-none" style="transform-style: preserve-3d;">
          <div
            v-for="(card, i) in heroCards"
            :key="card.id"
            class="hero-card glass rounded-3 aspect-square d-flex align-items-center justify-content-center tilt-effect"
            :style="{ transform: `scale(${card.scale}) translateY(${card.y}px)`, transformStyle: 'preserve-3d' }"
            :class="{ 'feature-card-3d': true }"
          >
            <font-awesome-icon icon="code" class="text-white text-opacity-10 fs-1" />
          </div>
        </div>

        <div class="container text-center position-relative z-1 py-20" style="transform-style: preserve-3d;">
          <div ref="heroTitleRef" class="hero-svg-container mb-4 hero-title-3d" style="transform-style: preserve-3d;">
            <svg viewBox="0 0 800 200" class="complext-svg" style="transform-style: preserve-3d;">
              <defs>
                <filter id="liquid-blur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
                </filter>
                <mask id="text-mask">
                  <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base">COMPLEXT</text>
                </mask>
                <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="white" stop-opacity="0" />
                  <stop offset="50%" stop-color="white" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="white" stop-opacity="0" />
                </linearGradient>
              </defs>
              <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base opacity-20">COMPLEXT</text>
              <rect x="-200" y="0" width="200" height="200" fill="url(#liquid-gradient)" mask="url(#text-mask)" class="liquid-blob" filter="url(#liquid-blur)" />
              <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base">COMPLEXT</text>
            </svg>
          </div>
          <p ref="heroSubtitleRef" class="lead-huge text-white text-opacity-50 max-w-3xl mx-auto mb-5 fw-medium">
            Where performance meets simplicity. Reimagining Steam promotions with high-fidelity automation and sleek design.
          </p>

          <div class="d-flex flex-column flex-sm-row justify-content-center gap-4 mt-10">
            <a href="keys" class="btn btn-white-pill glow-on-hover d-flex align-items-center justify-content-center gap-2 tilt-effect">
              <font-awesome-icon icon="key" />
              Get Started
            </a>
            <a href="#subthemes" class="btn btn-outline-pill d-flex align-items-center justify-content-center gap-2 tilt-effect">
              Learn More
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="position-absolute bottom-0 mb-10 text-center opacity-30 bounce-animation" style="transform-style: preserve-3d;">
          <span class="small uppercase tracking-widest fw-bold mb-2 d-block">Scroll to explore</span>
          <div class="mx-auto bg-white" style="width: 1px; height: 60px;"></div>
        </div>
      </section>

      <!-- FEATURES SECTION -->
      <section id="subthemes" ref="featuresSectionRef" class="py-5 position-relative" style="perspective: 1000px; transform-style: preserve-3d;">
        <div class="ambient-glow glow-1" style="top: 20%; right: -100px; transform-style: preserve-3d;"></div>
        <div class="ambient-glow glow-2" style="bottom: 20%; left: -100px; transform-style: preserve-3d;"></div>

        <div class="container max-w-7xl mx-auto px-4">
          <div class="mb-5 text-center" style="transform-style: preserve-3d;">
            <h2 class="display-3 fw-black tracking-tighter mb-4" style="transform-style: preserve-3d;">ENGINEERED FOR <span class="text-stroke-white">FLOW</span></h2>
            <p class="lead text-white text-opacity-50 max-w-2xl mx-auto">
              Our core architecture is built on the most advanced models to deliver speed and reliability.
            </p>
          </div>

          <div class="row g-4 justify-content-center" style="transform-style: preserve-3d;">
            <div
              v-for="(feature, index) in [
                { title: 'Python Core', desc: 'Robust backend using 3.11+ for intelligent processing.', icon: 'rocket' },
                { title: 'Vue 3 UI', desc: 'Granular reactivity for a seamless user experience.', icon: 'code' },
                { title: 'GSAP Motion', desc: 'High-performance animations that guide the eye.', icon: 'star' }
              ]"
              :key="index"
              :ref="setFeatureRef"
              class="col-lg-4 col-md-6"
              style="transform-style: preserve-3d;"
            >
              <div
                class="glass-3d rounded-flow p-5 h-100 transition-slow hover:bg-white hover:text-black group glow-on-hover overflow-hidden position-relative card-3d feature-card-3d"
                :style="{ transformStyle: 'preserve-3d' }"
              >
                <div class="position-absolute top-0 end-0 p-5 opacity-5 group-hover:opacity-10 transition-slow" style="transform-style: preserve-3d;">
                  <font-awesome-icon :icon="feature.icon" style="font-size: 8rem;" />
                </div>
                <div class="fs-1 fw-black mb-4 opacity-10 group-hover:opacity-100 transition-slow">0{{ index + 1 }}</div>
                <h3 class="h2 fw-black mb-3 tracking-tighter uppercase">{{ feature.title }}</h3>
                <p class="fw-medium text-opacity-60 group-hover:text-opacity-100 transition-slow">{{ feature.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer ref="footerRef" class="py-5 border-top border-white border-opacity-5" style="transform-style: preserve-3d;">
      <div class="container max-w-7xl mx-auto text-center">
        <div class="d-flex align-items-center justify-content-center fw-black text-white mb-4 tracking-tighter gap-2 py-2 pt-4">
          <img src="/src/assets/imgs/logo/complext-logo.webp" alt="Complext Logo" class="logo">
          <span class="fs-2 uppercase">Complext</span>
        </div>

        <div class="d-flex justify-content-center gap-3 mb-10">
          <a href="https://github.com/Fast4gc/Complext" class="text-white text-opacity-30 hover:text-opacity-100 transition-slow fs-3 tilt-effect">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <a href="https://discord.gg/gZhnBrxWqA" class="text-white text-opacity-30 hover:text-opacity-100 transition-slow fs-3 tilt-effect">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
        </div>

        <p class="text-white text-opacity-10 mb-1 fw-black small tracking-widest uppercase pt-4">&copy; 2026 Complext Studio. Reimagining Automation.</p>
      </div>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

:root {
  --font-main: 'Inter', sans-serif;
}

body {
  font-family: var(--font-main);
  background-color: #0a0a0a;
  color: #fff;
}

.display-huge {
  font-size: clamp(4rem, 15vw, 12rem);
  font-weight: 900;
  line-height: 0.85;
}

.hero-svg-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.complext-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.svg-text-base {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 150px;
  letter-spacing: -0.05em;
  fill: #ffffff;
}

.liquid-blob {
  animation: liquid-pass 6s infinite ease-in-out;
}

@keyframes liquid-pass {
  0% { transform: translateX(-1000px); }
  100% { transform: translateX(1000px); }
}

.lead-huge {
  font-size: clamp(1.2rem, 3vw, 2rem);
  line-height: 1.4;
}

.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }

.max-w-7xl { max-width: 1280px; }
.max-w-3xl { max-width: 48rem; }
.max-w-2xl { max-width: 42rem; }

.btn-white-pill {
  background-color: #fff;
  color: #000;
  border-radius: 50rem;
  padding: 1rem 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  transform-style: preserve-3d;
}

.btn-white-pill:hover {
  background-color: #f0f0f0;
  transform: scale(1.05) translateZ(10px);
}

.btn-outline-pill {
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50rem;
  padding: 1rem 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none;
  transform-style: preserve-3d;
}

.btn-outline-pill:hover {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  transform: scale(1.05) translateZ(10px);
}

.text-stroke-white {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  color: transparent;
}

.bounce-animation {
  animation: bounce-vertical 2s infinite ease-in-out;
}

@keyframes bounce-vertical {
  0%, 100% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-10px); opacity: 0.6; }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #555; }

@media (max-width: 768px) {
  .display-huge { font-size: 5rem; }
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .md\:grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
}
</style>
