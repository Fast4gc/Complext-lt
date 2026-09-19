<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ThreeBackground from './components/ThreeBackground.vue'

gsap.registerPlugin(ScrollTrigger)

const headerRef = ref(null)
const heroTitleRef = ref(null)
const heroSubtitleRef = ref(null)
const heroBtnRef = ref(null)
const featuresSectionRef = ref(null)
const footerRef = ref(null)
const heroSectionRef = ref(null)
const isHeaderVisible = ref(true)
let ctx = null
let lenis = null

const features = [
  { title: 'Python Core', desc: 'Robust backend using 3.11+ for intelligent processing.', icon: 'rocket' },
  { title: 'Vue 3 UI', desc: 'Granular reactivity for a seamless user experience.', icon: 'code' },
  { title: 'GSAP Motion', desc: 'High-performance animations that guide the eye.', icon: 'star' }
]

onMounted(async () => {
  await nextTick()
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

    // Hero entrance: text first, visual after — no overlap
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .from(heroTitleRef.value, { y: 50, opacity: 0, duration: 1.1 })
      .from(heroSubtitleRef.value, { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
      .from(heroBtnRef.value, { y: 16, opacity: 0, scale: 0.97, duration: 0.6 }, '-=0.4')
      .from('.hero-visual', { y: 60, opacity: 0, duration: 1.1 }, '-=0.5')
      .from('.hero-centerpiece', { scale: 0.7, opacity: 0, duration: 1.0, ease: 'back.out(1.5)' }, '-=0.9')
      .from('.hero-side', { opacity: 0, x: (i) => (i === 0 ? -40 : 40), duration: 1.0, stagger: 0.1 }, '-=0.9')

    // Feature cards: use toArray (no ref-collection bugs), play once
    gsap.utils.toArray('.feature-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.1,
        ease: 'power2.out',
        clearProps: 'transform',
      })
    })

    gsap.from('.features-title', {
      scrollTrigger: { trigger: featuresSectionRef.value, start: 'top 82%', once: true },
      y: 32,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    })

    gsap.from(footerRef.value, {
      scrollTrigger: { trigger: footerRef.value, start: 'top 96%', once: true },
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    })

    ScrollTrigger.refresh()
  })

  // Safety net: never leave cards invisible (fixes frozen mid-animation bug)
  setTimeout(() => {
    document.querySelectorAll('.feature-card').forEach((el) => {
      const o = parseFloat(getComputedStyle(el).opacity)
      if (o < 0.9) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.4, overwrite: true, clearProps: 'transform' })
      }
    })
    ScrollTrigger.refresh()
  }, 3500)
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
      <!-- HERO: text on top, visual below (no overlap) -->
      <section id="hero" ref="heroSectionRef" class="hero">
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

        <div class="hero-visual">
          <div class="hero-side hero-side--left" aria-hidden="true"></div>
          <div class="hero-side hero-side--right" aria-hidden="true"></div>
          <div class="hero-glow" aria-hidden="true"></div>
          <div class="hero-centerpiece" aria-hidden="true">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="crystal-grad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stop-color="#c084fc"/>
                  <stop offset="55%" stop-color="#a855f7"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
                <filter id="crystal-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#crystal-glow)">
                <path d="M100 30 L122 78 L100 170 L78 78 Z" fill="url(#crystal-grad)" opacity="0.95"/>
                <path d="M100 30 L150 78 L100 170 L50 78 Z" fill="url(#crystal-grad)" opacity="0.35"/>
                <path d="M82 62 L118 62 L112 74 L88 74 Z" fill="white" opacity="0.18"/>
                <line x1="100" y1="30" x2="100" y2="170" stroke="white" stroke-width="0.6" opacity="0.35"/>
              </g>
            </svg>
          </div>
          <div class="hero-icons" aria-hidden="true">
            <span class="hero-icon"><font-awesome-icon icon="key" /></span>
            <span class="hero-icon"><font-awesome-icon icon="code" /></span>
            <span class="hero-icon"><font-awesome-icon icon="star" /></span>
            <span class="hero-icon"><font-awesome-icon icon="rocket" /></span>
          </div>
        </div>

        <div class="scroll-hint" aria-hidden="true">
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
            <div v-for="(feature, i) in features" :key="i" class="feature-card">
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
          <a href="https://github.com/Fast4gc/Complext" class="footer-link" aria-label="GitHub">
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <a href="https://discord.gg/gZhnBrxWqA" class="footer-link" aria-label="Discord">
            <font-awesome-icon :icon="['fab', 'discord']" />
          </a>
        </div>
        <p class="footer-copy">&copy; 2026 Complext Studio</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site { position: relative; min-height: 100vh; }

/* Header */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 16px 24px;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
}
.header--hidden { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.header-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; border-radius: 100px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
}
.header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 700; font-size: 1rem; }
.header-logo-img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
.header-nav { display: flex; gap: 32px; }
.header-nav a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.25s; }
.header-nav a:hover { color: #fff; }
.header-cta {
  padding: 8px 20px; border-radius: 100px; background: #fff; color: #000;
  text-decoration: none; font-size: 0.875rem; font-weight: 600;
  transition: transform 0.25s, box-shadow 0.25s;
}
.header-cta:hover { transform: scale(1.04); box-shadow: 0 4px 20px rgba(255,255,255,0.15); }

/* Hero */
.hero {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: flex-start;
  overflow: hidden;
  padding: 150px 24px 60px;
}
.hero-content { position: relative; z-index: 3; text-align: center; max-width: 760px; }
.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.8rem);
  font-weight: 700; line-height: 1.15; letter-spacing: -0.03em;
  color: #fff; margin: 0 0 24px;
}
.hero-subtitle {
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  color: rgba(255,255,255,0.45); line-height: 1.6;
  margin: 0 auto 40px; max-width: 520px;
}
.hero-actions { display: flex; justify-content: center; }
.btn-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent; color: #fff;
  text-decoration: none; font-size: 0.95rem; font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
}
.btn-cta:hover { border-color: #fff; background: rgba(255,255,255,0.06); transform: scale(1.04); }

/* Visual block BELOW text — never overlaps */
.hero-visual {
  position: relative; z-index: 1;
  width: 100%; max-width: 1100px;
  height: 420px; margin-top: 40px;
  display: flex; align-items: center; justify-content: center;
}
.hero-glow {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 420px; height: 420px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,85,247,0.22) 0%, transparent 70%);
  filter: blur(60px); pointer-events: none;
  animation: glow-pulse 4s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%,100% { opacity: 0.6; transform: translate(-50%,-50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%,-50%) scale(1.08); }
}
.hero-centerpiece { position: relative; z-index: 2; width: 150px; height: 150px; animation: centerpiece-float 6s ease-in-out infinite; }
.hero-centerpiece svg { width: 100%; height: 100%; overflow: visible; }
@keyframes centerpiece-float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* Halftone dot texture (CSS — no scribble SVGs) */
.hero-side {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 34%; height: 70%;
  background-image: radial-gradient(circle, rgba(255,255,255,0.35) 1.2px, transparent 1.8px);
  background-size: 11px 11px;
  pointer-events: none;
}
.hero-side--left {
  left: 0;
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 20% 50%, black 20%, transparent 70%);
  mask-image: radial-gradient(ellipse 90% 80% at 20% 50%, black 20%, transparent 70%);
  opacity: 0.5;
}
.hero-side--right {
  right: 0;
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 80% 50%, black 20%, transparent 70%);
  mask-image: radial-gradient(ellipse 90% 80% at 80% 50%, black 20%, transparent 70%);
  opacity: 0.5;
}
.hero-icons { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 26px; z-index: 2; }
.hero-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.28); font-size: 0.95rem;
  border: 1px dashed rgba(255,255,255,0.12);
}

.scroll-hint { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); }
.scroll-hint-line {
  width: 1px; height: 44px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
  animation: scroll-bounce 2s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%,100% { opacity: 0.3; } 50% { opacity: 0.7; }
}

/* Features */
.features { position: relative; z-index: 2; padding: 90px 24px 120px; }
.features-inner { max-width: 1100px; margin: 0 auto; text-align: center; }
.features-title { font-size: clamp(2rem,4vw,3rem); font-weight: 700; letter-spacing: -0.03em; color: #fff; margin: 0 0 16px; }
.features-highlight {
  background: linear-gradient(135deg,#a855f7,#6366f1);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.features-subtitle { font-size: 1.05rem; color: rgba(255,255,255,0.45); max-width: 480px; margin: 0 auto 56px; line-height: 1.6; }
.features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; text-align: left; }
.feature-card {
  padding: 34px 30px; border-radius: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
}
.feature-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-4px); }
.feature-card-icon {
  width: 46px; height: 46px; border-radius: 12px;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.05rem; color: rgba(255,255,255,0.7); margin-bottom: 18px;
}
.feature-card-title { font-size: 1.12rem; font-weight: 700; color: #fff; margin: 0 0 10px; }
.feature-card-desc { font-size: 0.9rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin: 0; }

/* Footer */
.footer { position: relative; z-index: 2; padding: 36px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
.footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.footer-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; }
.footer-logo { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
.footer-links { display: flex; gap: 20px; }
.footer-link { color: rgba(255,255,255,0.3); font-size: 1.2rem; transition: color 0.25s; }
.footer-link:hover { color: #fff; }
.footer-copy { font-size: 0.8rem; color: rgba(255,255,255,0.2); margin: 0; }

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .hero-visual { height: 320px; }
  .hero-side { display: none; }
  .hero-centerpiece { width: 120px; height: 120px; }
}
@media (max-width: 640px) {
  .footer-inner { flex-direction: column; gap: 14px; }
  .header-nav { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-centerpiece, .hero-glow, .scroll-hint-line { animation: none !important; }
}
</style>
