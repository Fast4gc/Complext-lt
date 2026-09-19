<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const headerRef = ref(null)
const heroTitleRef = ref(null)
const heroSubtitleRef = ref(null)
const cardsGridRef = ref(null)
const featuresRefs = ref([])
const footerRef = ref(null)
const isHeaderVisible = ref(true)

const setFeatureRef = (el) => {
  if (el) featuresRefs.value.push(el)
}

// Cards for the Hero Grid background (simulating the media wall)
const heroCards = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  scale: 0.8 + Math.random() * 0.4,
  y: Math.random() * 100,
  delay: Math.random() * 2
}))

onMounted(() => {
  // 1. Initialize Lenis (Smooth Scroll)
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // 2. Header Visibility Logic (Top only)
  ScrollTrigger.create({
    start: 'top top',
    end: 100,
    onUpdate: (self) => {
      isHeaderVisible.value = self.scroll() <= 50
    }
  })

  // 3. Hero Animations
  const tl = gsap.timeline()
  
  // Stagger cards in the background
  tl.from('.hero-card', {
    scale: 0.5,
    opacity: 0,
    y: 50,
    duration: 1.5,
    stagger: { amount: 1, from: 'center' },
    ease: 'expo.out'
  })
  
  // Title reveal
  .from(heroTitleRef.value, {
    y: 100,
    opacity: 0,
    filter: 'blur(20px)',
    duration: 1.2,
    ease: 'expo.out'
  }, '-=0.8')
  
  // Subtitle reveal
  .from(heroSubtitleRef.value, {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'expo.out'
  }, '-=0.6')

  // 4. Parallax effect for cards grid on scroll
  gsap.to(cardsGridRef.value, {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: -200,
    opacity: 0.2
  })

  // 5. Features Grid Scroll Animations
  featuresRefs.value.forEach((el, index) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 1.2,
      delay: index * 0.1,
      ease: 'expo.out'
    })
  })

  // 6. Footer Animation
  gsap.from(footerRef.value, {
    scrollTrigger: {
      trigger: footerRef.value,
      start: 'top 95%'
    },
    y: 50,
    opacity: 0,
    duration: 1.2,
    ease: 'expo.out'
  })
})
</script>

<template>
  <div class="site-container bg-black text-white selection:bg-white selection:text-black">
    
    <!-- HEADER -->
    <header 
      ref="headerRef"
      class="fixed-top p-4 transition-slow"
      :class="{ 'opacity-0 -translate-y-full pointer-events-none': !isHeaderVisible }"
    >
      <nav class="container-fluid d-flex justify-content-between align-items-center glass-dark rounded-flow p-3 px-4 max-w-7xl mx-auto shadow-2xl">
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
      <section id="hero" class="min-h-screen position-relative d-flex flex-column align-items-center justify-content-center overflow-hidden pt-20">
        
        <!-- Animated Background Cards Grid -->
        <div ref="cardsGridRef" class="position-absolute top-0 start-0 w-100 h-100 d-grid grid-cols-4 md:grid-cols-6 gap-4 p-4 opacity-20 pointer-events-none">
          <div 
            v-for="card in heroCards" 
            :key="card.id" 
            class="hero-card glass rounded-4 aspect-square d-flex align-items-center justify-content-center"
            :style="{ transform: `scale(${card.scale}) translateY(${card.y}px)` }"
          >
            <font-awesome-icon icon="code" class="text-white text-opacity-10 fs-1" />
          </div>
        </div>

        <div class="container text-center position-relative z-1 py-20">
          <div ref="heroTitleRef" class="hero-svg-container mb-4">
            <svg viewBox="0 0 800 200" class="complext-svg">
              <defs>
                <!-- Liquid Blur Filter -->
                <filter id="liquid-blur">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="gooey" />
                </filter>
                
                <!-- Mask for the liquid effect -->
                <mask id="text-mask">
                  <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base">COMPLEXT</text>
                </mask>

                <!-- Gradient for the liquid "blob" -->
                <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="white" stop-opacity="0" />
                  <stop offset="50%" stop-color="white" stop-opacity="0.8" />
                  <stop offset="100%" stop-color="white" stop-opacity="0" />
                </linearGradient>
              </defs>

              <!-- Base Text -->
              <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base opacity-20">COMPLEXT</text>

              <!-- Liquid Blob passing over -->
              <rect x="-200" y="0" width="200" height="200" fill="url(#liquid-gradient)" mask="url(#text-mask)" class="liquid-blob" filter="url(#liquid-blur)" />
              
              <!-- Highlight Text -->
              <text x="50%" y="50%" dy=".35em" text-anchor="middle" class="svg-text-base">COMPLEXT</text>
            </svg>
          </div>
          <p ref="heroSubtitleRef" class="lead-huge text-white text-opacity-50 max-w-3xl mx-auto mb-5 fw-medium">
            Where performance meets simplicity. Reimagining Steam promotions with high-fidelity automation and sleek design.
          </p>
          
          <div class="d-flex flex-column flex-sm-row justify-content-center gap-4 mt-10">
            <a href="keys" class="btn btn-white-pill glow-on-hover d-flex align-items-center justify-content-center gap-2">
              <font-awesome-icon icon="key" />
              Get Started
            </a>
            <a href="#subthemes" class="btn btn-outline-pill d-flex align-items-center justify-content-center gap-2">
              Learn More
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="position-absolute bottom-0 mb-10 text-center opacity-30 bounce-animation">
          <span class="small uppercase tracking-widest fw-bold mb-2 d-block">Scroll to explore</span>
          <div class="mx-auto bg-white" style="width: 1px; height: 60px;"></div>
        </div>
      </section>

      <!-- FEATURES SECTION -->
      <section id="subthemes" class="py-40 position-relative">
        <div class="container max-w-7xl mx-auto px-4">
          <div class="mb-20 text-center">
            <h2 class="display-3 fw-black tracking-tighter mb-4">ENGINEERED FOR <span class="text-stroke-white">FLOW</span></h2>
            <p class="lead text-white text-opacity-50 max-w-2xl mx-auto">
              Our core architecture is built on the most advanced models to deliver speed and reliability.
            </p>
          </div>

          <div class="row g-4 justify-content-center">
            <div 
              v-for="(feature, index) in [
                { title: 'Python Core', desc: 'Robust backend using 3.11+ for intelligent processing.', icon: 'rocket' },
                { title: 'Vue 3 UI', desc: 'Granular reactivity for a seamless user experience.', icon: 'code' },
                { title: 'GSAP Motion', desc: 'High-performance animations that guide the eye.', icon: 'star' }
              ]" 
              :key="index"
              :ref="setFeatureRef"
              class="col-lg-4 col-md-6"
            >
              <div class="glass rounded-flow p-5 h-100 transition-slow hover:bg-white hover:text-black group glow-on-hover overflow-hidden position-relative">
                <div class="position-absolute top-0 end-0 p-5 opacity-5 group-hover:opacity-10 transition-slow">
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
    <footer ref="footerRef" class="py-5 border-top border-white border-opacity-5">
      <div class="container max-w-7xl mx-auto text-center">
        <div class="d-flex align-items-center justify-content-center fw-black text-white mb-4 tracking-tighter gap-2 py-2 pt-4">
          <img src="/src/assets/imgs/logo/complext-logo.webp" alt="Complext Logo" class="logo">
          <span class="fs-2 uppercase">Complext</span>
        </div>
        
        <div class="d-flex justify-content-center gap-3 mb-10">
          <a href="https://github.com/Fast4gc/Complext" class="text-white text-opacity-30 hover:text-opacity-100 transition-slow fs-3">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <a href="https://discord.gg/gZhnBrxWqA" class="text-white text-opacity-30 hover:text-opacity-100 transition-slow fs-3">
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
  transition: all 0.4s ease;
  text-decoration: none;
}

.btn-white-pill:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
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
  transition: all 0.4s ease;
  text-decoration: none;
}

.btn-outline-pill:hover {
  border-color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  transform: scale(1.05);
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

/* Custom Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #0a0a0a; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #555; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .display-huge { font-size: 5rem; }
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .md\:grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
}
</style>
