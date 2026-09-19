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
const heroBtnRef = ref(null)
const featureRefs = ref([])
const featuresSectionRef = ref(null)
const footerRef = ref(null)
const heroSectionRef = ref(null)
const isHeaderVisible = ref(true)
let ctx, lenis

const setFeatureRef = (el) => {
  if (el && !featureRefs.value.includes(el)) featureRefs.value.push(el)
}

const features = [
  { title: 'Python Core', desc: 'Robust backend using 3.11+ for intelligent processing.', icon: 'rocket' },
  { title: 'Vue 3 UI', desc: 'Granular reactivity for a seamless user experience.', icon: 'code' },
  { title: 'GSAP Motion', desc: 'High-performance animations that guide the eye.', icon: 'star' }
]

onMounted(() => {
  ctx = gsap.context(() => {
    lenis = new Lenis({
      duration: 1.2,
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

    ScrollTrigger.create({
      start: 'top top',
      end: 100,
      onUpdate: (self) => {
        isHeaderVisible.value = self.scroll() <= 50
      }
    })

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    heroTl.from(heroTitleRef.value, {
      y: 60,
      opacity: 0,
      duration: 1.2,
    })
    .from(heroSubtitleRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.9,
    }, '-=0.6')
    .from(heroBtnRef.value, {
      y: 20,
      opacity: 0,
      scale: 0.95,
      duration: 0.7,
    }, '-=0.4')
    .from('.hero-hand', {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      stagger: 0.1,
    }, '-=1.2')
    .from('.hero-centerpiece', {
      scale: 0.5,
      opacity: 0,
      rotation: -20,
      duration: 1.4,
      ease: 'back.out(1.4)',
    }, '-=1.5')
    .from('.hero-glow', {
      scale: 0.3,
      opacity: 0,
      duration: 1.2,
    }, '-=1.2')

    featureRefs.value.forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power2.out',
      })
    })

    gsap.from('.features-title', {
      scrollTrigger: {
        trigger: featuresSectionRef.value,
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })

    gsap.from(footerRef.value, {
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 95%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  })
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
  if (lenis) lenis.destroy()
})
</script>

<template>
  <div class="site">
    <ThreeBackground />

    <!-- HEADER -->
    <header ref="headerRef" class="header" :class="{ 'header--hidden': !isHeaderVisible }">
      <div class="header-inner">
        <a href="/" class="header-logo">
          <img src="/src/assets/imgs/logo/complext-logo.webp" alt="Complext" class="header-logo-img">
          <span>Complext</span>
        </a>
        <nav class="header-nav">
          <a href="#features">Features</a>
          <a href="https://github.com/Fast4gc/Complext">GitHub</a>
        </nav>
        <a href="keys" class="header-cta">Get started</a>
      </div>
    </header>

    <main>
      <!-- HERO -->
      <section id="hero" ref="heroSectionRef" class="hero">
        <!-- Halftone Hands -->
        <div class="hero-hand hero-hand--left">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.35">
              <circle cx="50" cy="180" r="2" fill="white"/>
              <circle cx="55" cy="175" r="2" fill="white"/>
              <circle cx="60" cy="170" r="2" fill="white"/>
              <circle cx="65" cy="165" r="2" fill="white"/>
              <circle cx="70" cy="160" r="2" fill="white"/>
              <circle cx="75" cy="155" r="2" fill="white"/>
              <circle cx="80" cy="150" r="2" fill="white"/>
              <circle cx="85" cy="145" r="2" fill="white"/>
              <circle cx="90" cy="140" r="2" fill="white"/>
              <circle cx="95" cy="135" r="2" fill="white"/>
              <circle cx="100" cy="130" r="2" fill="white"/>
              <circle cx="105" cy="125" r="2" fill="white"/>
              <circle cx="110" cy="120" r="2" fill="white"/>
              <circle cx="115" cy="118" r="2" fill="white"/>
              <circle cx="120" cy="116" r="2" fill="white"/>
              <circle cx="125" cy="115" r="2" fill="white"/>
              <circle cx="130" cy="116" r="2" fill="white"/>
              <circle cx="135" cy="118" r="2" fill="white"/>
              <circle cx="140" cy="120" r="2" fill="white"/>
              <circle cx="145" cy="122" r="2" fill="white"/>
              <circle cx="150" cy="125" r="2" fill="white"/>
              <circle cx="155" cy="128" r="2" fill="white"/>
              <circle cx="160" cy="130" r="2" fill="white"/>
              <circle cx="165" cy="132" r="2" fill="white"/>
              <circle cx="170" cy="135" r="2" fill="white"/>
              <circle cx="175" cy="138" r="2" fill="white"/>
              <circle cx="180" cy="140" r="2" fill="white"/>
              <circle cx="185" cy="142" r="2" fill="white"/>
              <circle cx="190" cy="145" r="2" fill="white"/>
              <circle cx="195" cy="148" r="2" fill="white"/>
              <circle cx="200" cy="150" r="2" fill="white"/>
              <circle cx="205" cy="152" r="2" fill="white"/>
              <circle cx="210" cy="154" r="2" fill="white"/>
              <circle cx="215" cy="156" r="2" fill="white"/>
              <circle cx="220" cy="158" r="2" fill="white"/>
              <circle cx="225" cy="160" r="2" fill="white"/>
              <circle cx="230" cy="162" r="2" fill="white"/>
              <circle cx="235" cy="164" r="2" fill="white"/>
              <circle cx="240" cy="166" r="2" fill="white"/>
              <circle cx="245" cy="168" r="2" fill="white"/>
              <circle cx="250" cy="170" r="2" fill="white"/>
              <circle cx="255" cy="172" r="2" fill="white"/>
              <circle cx="260" cy="175" r="2" fill="white"/>
              <circle cx="265" cy="178" r="2" fill="white"/>
              <circle cx="270" cy="180" r="2" fill="white"/>
              <circle cx="275" cy="182" r="2" fill="white"/>
              <circle cx="280" cy="185" r="2" fill="white"/>
              <circle cx="285" cy="188" r="2" fill="white"/>
              <circle cx="290" cy="190" r="2" fill="white"/>
              <circle cx="295" cy="192" r="2" fill="white"/>
              <circle cx="300" cy="195" r="2" fill="white"/>
              <circle cx="305" cy="198" r="2" fill="white"/>
              <circle cx="310" cy="200" r="2" fill="white"/>
              <circle cx="315" cy="202" r="2" fill="white"/>
              <circle cx="320" cy="205" r="2" fill="white"/>
              <circle cx="325" cy="208" r="2" fill="white"/>
              <circle cx="330" cy="210" r="2" fill="white"/>
              <circle cx="335" cy="212" r="2" fill="white"/>
              <circle cx="340" cy="215" r="2" fill="white"/>
              <circle cx="345" cy="218" r="2" fill="white"/>
              <circle cx="350" cy="220" r="2" fill="white"/>
              <circle cx="355" cy="222" r="2" fill="white"/>
              <circle cx="360" cy="225" r="2" fill="white"/>
              <circle cx="365" cy="228" r="2" fill="white"/>
              <circle cx="370" cy="230" r="2" fill="white"/>
              <circle cx="375" cy="232" r="2" fill="white"/>
              <circle cx="380" cy="235" r="2" fill="white"/>
              <circle cx="385" cy="238" r="2" fill="white"/>
              <circle cx="390" cy="240" r="2" fill="white"/>
              <circle cx="80" cy="200" r="2" fill="white"/>
              <circle cx="90" cy="195" r="2" fill="white"/>
              <circle cx="100" cy="190" r="2" fill="white"/>
              <circle cx="110" cy="185" r="2" fill="white"/>
              <circle cx="120" cy="180" r="2" fill="white"/>
              <circle cx="130" cy="175" r="2" fill="white"/>
              <circle cx="140" cy="170" r="2" fill="white"/>
              <circle cx="150" cy="168" r="2" fill="white"/>
              <circle cx="160" cy="166" r="2" fill="white"/>
              <circle cx="170" cy="164" r="2" fill="white"/>
              <circle cx="180" cy="162" r="2" fill="white"/>
              <circle cx="190" cy="160" r="2" fill="white"/>
              <circle cx="200" cy="158" r="2" fill="white"/>
              <circle cx="210" cy="156" r="2" fill="white"/>
              <circle cx="220" cy="154" r="2" fill="white"/>
              <circle cx="230" cy="152" r="2" fill="white"/>
              <circle cx="240" cy="150" r="2" fill="white"/>
              <circle cx="250" cy="148" r="2" fill="white"/>
              <circle cx="260" cy="146" r="2" fill="white"/>
              <circle cx="270" cy="144" r="2" fill="white"/>
              <circle cx="280" cy="142" r="2" fill="white"/>
              <circle cx="290" cy="140" r="2" fill="white"/>
              <circle cx="300" cy="138" r="2" fill="white"/>
              <circle cx="310" cy="136" r="2" fill="white"/>
              <circle cx="320" cy="135" r="2" fill="white"/>
              <circle cx="330" cy="135" r="2" fill="white"/>
              <circle cx="340" cy="136" r="2" fill="white"/>
              <circle cx="350" cy="138" r="2" fill="white"/>
              <circle cx="360" cy="140" r="2" fill="white"/>
              <circle cx="100" cy="210" r="2" fill="white"/>
              <circle cx="120" cy="200" r="2" fill="white"/>
              <circle cx="140" cy="195" r="2" fill="white"/>
              <circle cx="160" cy="190" r="2" fill="white"/>
              <circle cx="180" cy="185" r="2" fill="white"/>
              <circle cx="200" cy="180" r="2" fill="white"/>
              <circle cx="220" cy="175" r="2" fill="white"/>
              <circle cx="240" cy="170" r="2" fill="white"/>
              <circle cx="260" cy="168" r="2" fill="white"/>
              <circle cx="280" cy="166" r="2" fill="white"/>
              <circle cx="300" cy="165" r="2" fill="white"/>
              <circle cx="320" cy="165" r="2" fill="white"/>
              <circle cx="340" cy="166" r="2" fill="white"/>
              <circle cx="360" cy="168" r="2" fill="white"/>
              <circle cx="110" cy="220" r="2" fill="white"/>
              <circle cx="130" cy="215" r="2" fill="white"/>
              <circle cx="150" cy="210" r="2" fill="white"/>
              <circle cx="170" cy="205" r="2" fill="white"/>
              <circle cx="190" cy="200" r="2" fill="white"/>
              <circle cx="210" cy="195" r="2" fill="white"/>
              <circle cx="230" cy="190" r="2" fill="white"/>
              <circle cx="250" cy="188" r="2" fill="white"/>
              <circle cx="270" cy="186" r="2" fill="white"/>
              <circle cx="290" cy="185" r="2" fill="white"/>
              <circle cx="310" cy="185" r="2" fill="white"/>
              <circle cx="330" cy="186" r="2" fill="white"/>
              <circle cx="350" cy="188" r="2" fill="white"/>
              <circle cx="370" cy="190" r="2" fill="white"/>
            </g>
          </svg>
        </div>

        <div class="hero-hand hero-hand--right">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.35">
              <circle cx="350" cy="180" r="2" fill="white"/>
              <circle cx="345" cy="175" r="2" fill="white"/>
              <circle cx="340" cy="170" r="2" fill="white"/>
              <circle cx="335" cy="165" r="2" fill="white"/>
              <circle cx="330" cy="160" r="2" fill="white"/>
              <circle cx="325" cy="155" r="2" fill="white"/>
              <circle cx="320" cy="150" r="2" fill="white"/>
              <circle cx="315" cy="145" r="2" fill="white"/>
              <circle cx="310" cy="140" r="2" fill="white"/>
              <circle cx="305" cy="135" r="2" fill="white"/>
              <circle cx="300" cy="130" r="2" fill="white"/>
              <circle cx="295" cy="125" r="2" fill="white"/>
              <circle cx="290" cy="120" r="2" fill="white"/>
              <circle cx="285" cy="118" r="2" fill="white"/>
              <circle cx="280" cy="116" r="2" fill="white"/>
              <circle cx="275" cy="115" r="2" fill="white"/>
              <circle cx="270" cy="116" r="2" fill="white"/>
              <circle cx="265" cy="118" r="2" fill="white"/>
              <circle cx="260" cy="120" r="2" fill="white"/>
              <circle cx="255" cy="122" r="2" fill="white"/>
              <circle cx="250" cy="125" r="2" fill="white"/>
              <circle cx="245" cy="128" r="2" fill="white"/>
              <circle cx="240" cy="130" r="2" fill="white"/>
              <circle cx="235" cy="132" r="2" fill="white"/>
              <circle cx="230" cy="135" r="2" fill="white"/>
              <circle cx="225" cy="138" r="2" fill="white"/>
              <circle cx="220" cy="140" r="2" fill="white"/>
              <circle cx="215" cy="142" r="2" fill="white"/>
              <circle cx="210" cy="145" r="2" fill="white"/>
              <circle cx="205" cy="148" r="2" fill="white"/>
              <circle cx="200" cy="150" r="2" fill="white"/>
              <circle cx="195" cy="152" r="2" fill="white"/>
              <circle cx="190" cy="154" r="2" fill="white"/>
              <circle cx="185" cy="156" r="2" fill="white"/>
              <circle cx="180" cy="158" r="2" fill="white"/>
              <circle cx="175" cy="160" r="2" fill="white"/>
              <circle cx="170" cy="162" r="2" fill="white"/>
              <circle cx="165" cy="164" r="2" fill="white"/>
              <circle cx="160" cy="166" r="2" fill="white"/>
              <circle cx="155" cy="168" r="2" fill="white"/>
              <circle cx="150" cy="170" r="2" fill="white"/>
              <circle cx="145" cy="172" r="2" fill="white"/>
              <circle cx="140" cy="175" r="2" fill="white"/>
              <circle cx="135" cy="178" r="2" fill="white"/>
              <circle cx="130" cy="180" r="2" fill="white"/>
              <circle cx="125" cy="182" r="2" fill="white"/>
              <circle cx="120" cy="185" r="2" fill="white"/>
              <circle cx="115" cy="188" r="2" fill="white"/>
              <circle cx="110" cy="190" r="2" fill="white"/>
              <circle cx="105" cy="192" r="2" fill="white"/>
              <circle cx="100" cy="195" r="2" fill="white"/>
              <circle cx="95" cy="198" r="2" fill="white"/>
              <circle cx="90" cy="200" r="2" fill="white"/>
              <circle cx="85" cy="202" r="2" fill="white"/>
              <circle cx="80" cy="205" r="2" fill="white"/>
              <circle cx="75" cy="208" r="2" fill="white"/>
              <circle cx="70" cy="210" r="2" fill="white"/>
              <circle cx="65" cy="212" r="2" fill="white"/>
              <circle cx="60" cy="215" r="2" fill="white"/>
              <circle cx="55" cy="218" r="2" fill="white"/>
              <circle cx="50" cy="220" r="2" fill="white"/>
              <circle cx="45" cy="222" r="2" fill="white"/>
              <circle cx="40" cy="225" r="2" fill="white"/>
              <circle cx="35" cy="228" r="2" fill="white"/>
              <circle cx="30" cy="230" r="2" fill="white"/>
              <circle cx="25" cy="232" r="2" fill="white"/>
              <circle cx="20" cy="235" r="2" fill="white"/>
              <circle cx="15" cy="238" r="2" fill="white"/>
              <circle cx="10" cy="240" r="2" fill="white"/>
              <circle cx="320" cy="200" r="2" fill="white"/>
              <circle cx="310" cy="195" r="2" fill="white"/>
              <circle cx="300" cy="190" r="2" fill="white"/>
              <circle cx="290" cy="185" r="2" fill="white"/>
              <circle cx="280" cy="180" r="2" fill="white"/>
              <circle cx="270" cy="175" r="2" fill="white"/>
              <circle cx="260" cy="170" r="2" fill="white"/>
              <circle cx="250" cy="168" r="2" fill="white"/>
              <circle cx="240" cy="166" r="2" fill="white"/>
              <circle cx="230" cy="164" r="2" fill="white"/>
              <circle cx="220" cy="162" r="2" fill="white"/>
              <circle cx="210" cy="160" r="2" fill="white"/>
              <circle cx="200" cy="158" r="2" fill="white"/>
              <circle cx="190" cy="156" r="2" fill="white"/>
              <circle cx="180" cy="154" r="2" fill="white"/>
              <circle cx="170" cy="152" r="2" fill="white"/>
              <circle cx="160" cy="150" r="2" fill="white"/>
              <circle cx="150" cy="148" r="2" fill="white"/>
              <circle cx="140" cy="146" r="2" fill="white"/>
              <circle cx="130" cy="144" r="2" fill="white"/>
              <circle cx="120" cy="142" r="2" fill="white"/>
              <circle cx="110" cy="140" r="2" fill="white"/>
              <circle cx="100" cy="138" r="2" fill="white"/>
              <circle cx="90" cy="136" r="2" fill="white"/>
              <circle cx="80" cy="135" r="2" fill="white"/>
              <circle cx="70" cy="135" r="2" fill="white"/>
              <circle cx="60" cy="136" r="2" fill="white"/>
              <circle cx="50" cy="138" r="2" fill="white"/>
              <circle cx="40" cy="140" r="2" fill="white"/>
              <circle cx="300" cy="210" r="2" fill="white"/>
              <circle cx="280" cy="200" r="2" fill="white"/>
              <circle cx="260" cy="195" r="2" fill="white"/>
              <circle cx="240" cy="190" r="2" fill="white"/>
              <circle cx="220" cy="185" r="2" fill="white"/>
              <circle cx="200" cy="180" r="2" fill="white"/>
              <circle cx="180" cy="175" r="2" fill="white"/>
              <circle cx="160" cy="170" r="2" fill="white"/>
              <circle cx="140" cy="168" r="2" fill="white"/>
              <circle cx="120" cy="166" r="2" fill="white"/>
              <circle cx="100" cy="165" r="2" fill="white"/>
              <circle cx="80" cy="165" r="2" fill="white"/>
              <circle cx="60" cy="166" r="2" fill="white"/>
              <circle cx="40" cy="168" r="2" fill="white"/>
              <circle cx="290" cy="220" r="2" fill="white"/>
              <circle cx="270" cy="215" r="2" fill="white"/>
              <circle cx="250" cy="210" r="2" fill="white"/>
              <circle cx="230" cy="205" r="2" fill="white"/>
              <circle cx="210" cy="200" r="2" fill="white"/>
              <circle cx="190" cy="195" r="2" fill="white"/>
              <circle cx="170" cy="190" r="2" fill="white"/>
              <circle cx="150" cy="188" r="2" fill="white"/>
              <circle cx="130" cy="186" r="2" fill="white"/>
              <circle cx="110" cy="185" r="2" fill="white"/>
              <circle cx="90" cy="185" r="2" fill="white"/>
              <circle cx="70" cy="186" r="2" fill="white"/>
              <circle cx="50" cy="188" r="2" fill="white"/>
              <circle cx="30" cy="190" r="2" fill="white"/>
            </g>
          </svg>
        </div>

        <!-- Centerpiece -->
        <div class="hero-centerpiece">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="crystal-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stop-color="#a855f7"/>
                <stop offset="50%" stop-color="#c084fc"/>
                <stop offset="100%" stop-color="#7c3aed"/>
              </linearGradient>
              <filter id="crystal-glow">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M100 20 L130 60 L100 180 L70 60 Z" fill="url(#crystal-grad)" opacity="0.9" filter="url(#crystal-glow)"/>
            <path d="M100 20 L180 70 L100 180 L20 70 Z" fill="url(#crystal-grad)" opacity="0.4" filter="url(#crystal-glow)"/>
            <path d="M60 50 L140 50 L130 60 L70 60 Z" fill="white" opacity="0.15"/>
            <line x1="100" y1="20" x2="100" y2="180" stroke="white" stroke-width="0.5" opacity="0.3"/>
            <line x1="20" y1="70" x2="180" y2="70" stroke="white" stroke-width="0.5" opacity="0.2"/>
          </svg>
        </div>

        <!-- Glow -->
        <div class="hero-glow"></div>

        <!-- Text -->
        <div class="hero-content">
          <h1 ref="heroTitleRef" class="hero-title">
            When intelligence reaches out to instinct, the future takes shape
          </h1>
          <p ref="heroSubtitleRef" class="hero-subtitle">
            an unlikely alliance — where human intuition and algorithmic precision move as one
          </p>
          <div ref="heroBtnRef" class="hero-actions">
            <a href="keys" class="btn-cta">
              See it in action
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="8" x2="13" y2="8"/>
                <polyline points="9,4 13,8 9,12"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="scroll-hint">
          <div class="scroll-hint-line"></div>
        </div>
      </section>

      <!-- FEATURES -->
      <section id="features" ref="featuresSectionRef" class="features">
        <div class="features-inner">
          <h2 class="features-title">
            Built for the <span class="features-highlight">future</span>
          </h2>
          <p class="features-subtitle">
            Our core architecture is built on the most advanced models to deliver speed and reliability.
          </p>

          <div class="features-grid">
            <div
              v-for="(feature, i) in features"
              :key="i"
              :ref="setFeatureRef"
              class="feature-card"
            >
              <div class="feature-card-icon">
                <font-awesome-icon :icon="feature.icon" />
              </div>
              <h3 class="feature-card-title">{{ feature.title }}</h3>
              <p class="feature-card-desc">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer ref="footerRef" class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="/src/assets/imgs/logo/complext-logo.webp" alt="Complext" class="footer-logo">
          <span>Complext</span>
        </div>
        <div class="footer-links">
          <a href="https://github.com/Fast4gc/Complext" class="footer-link">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <a href="https://discord.gg/gZhnBrxWqA" class="footer-link">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
        </div>
        <p class="footer-copy">&copy; 2026 Complext Studio</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site {
  position: relative;
  min-height: 100vh;
}

/* Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.header--hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.header-logo-img {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.header-nav {
  display: flex;
  gap: 32px;
}

.header-nav a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.25s ease;
}

.header-nav a:hover {
  color: white;
}

.header-cta {
  padding: 8px 20px;
  border-radius: 100px;
  background: white;
  color: black;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.header-cta:hover {
  transform: scale(1.04);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
}

/* Hero */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 120px 24px 80px;
}

.hero-hand {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-width: 500px;
  pointer-events: none;
}

.hero-hand--left {
  left: -5%;
}

.hero-hand--right {
  right: -5%;
}

.hero-hand svg {
  width: 100%;
  height: auto;
}

.hero-centerpiece {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  animation: centerpiece-float 6s ease-in-out infinite;
}

@keyframes centerpiece-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
  50% { transform: translate(-50%, -50%) translateY(-15px); }
}

.hero-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 720px;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 24px;
}

.hero-subtitle {
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  justify-content: center;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-cta:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.06);
  transform: scale(1.04);
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-hint-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
  animation: scroll-bounce 2s ease-in-out infinite;
}

@keyframes scroll-bounce {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 0.7; transform: scaleY(1.2); }
}

/* Features */
.features {
  position: relative;
  z-index: 2;
  padding: 100px 24px 120px;
}

.features-inner {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.features-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: white;
  margin-bottom: 16px;
}

.features-highlight {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-subtitle {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.45);
  max-width: 480px;
  margin: 0 auto 60px;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.feature-card {
  text-align: left;
  padding: 36px 32px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(168,85,247,0.08), transparent 60%);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.feature-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-4px);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.feature-card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: white;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.feature-card-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
}

/* Footer */
.footer {
  position: relative;
  z-index: 2;
  padding: 40px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: white;
}

.footer-logo {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.3);
  font-size: 1.2rem;
  transition: color 0.25s ease;
}

.footer-link:hover {
  color: white;
}

.footer-copy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    gap: 16px;
  }

  .header-nav {
    display: none;
  }

  .hero-hand {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-centerpiece,
  .hero-glow,
  .scroll-hint-line {
    animation: none !important;
  }
}
</style>
