<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import ThreeBackground from './components/ThreeBackground.vue'
import ScrollStory from './components/ScrollStory.vue'
import StarSky from './components/StarSky.vue'

gsap.registerPlugin(ScrollTrigger)

const headerRef = ref(null)
const heroNameRef = ref(null)
const heroTitleRef = ref(null)
const heroSubtitleRef = ref(null)
const heroBtnRef = ref(null)
const featuresSectionRef = ref(null)
const footerRef = ref(null)
const heroSectionRef = ref(null)
const isHeaderVisible = ref(true)
let ctx = null
let lenis = null
let motion = null
const tickLenis = (time) => lenis?.raf(time * 1000)

const features = [
  { title: 'Python Core', desc: 'Robust backend using 3.11+ for intelligent processing.', icon: 'rocket' },
  { title: 'Vue 3 UI', desc: 'Granular reactivity for a seamless user experience.', icon: 'code' },
  { title: 'GSAP Motion', desc: 'High-performance animations that guide the eye.', icon: 'star' }
]

const steps = [
  { title: 'Connect', desc: 'Link your store, keys and pipeline credentials in minutes.', icon: 'key' },
  { title: 'Automate', desc: 'Rules and workers handle promos, drops and restocks for you.', icon: 'code' },
  { title: 'Deploy', desc: 'Ship to production in one click with zero downtime.', icon: 'rocket' },
  { title: 'Scale', desc: 'From indie drop to global sale without rewriting a thing.', icon: 'star' }
]

const stats = [
  { value: 99, prefix: '', suffix: '%', label: 'workflow uptime' },
  { value: 70, prefix: '−', suffix: '%', label: 'manual busywork' },
  { value: 3, prefix: '', suffix: 'x', label: 'faster releases' }
]

onMounted(async () => {
  await nextTick()
  motion = gsap.matchMedia()
  motion.add('(prefers-reduced-motion: no-preference)', () => {
  ctx = gsap.context(() => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tickLenis)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.create({
      start: 'top top',
      end: 100,
      onUpdate: (self) => {
        isHeaderVisible.value = self.scroll() <= 50
      }
    })

    // Hero entrance: star + project name first, then tagline + CTAs
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 })
      .from('.hero-star-scale', { scale: 0.5, opacity: 0, duration: 1.4, ease: 'back.out(1.4)' }, '-=0.4')
      .from(heroNameRef.value, { y: 80, opacity: 0, duration: 1.1 }, '-=1.0')
      .from(heroTitleRef.value, { y: 36, opacity: 0, duration: 0.9 }, '-=0.7')
      .from(heroSubtitleRef.value, { y: 24, opacity: 0, duration: 0.8 }, '-=0.6')
      .from(heroBtnRef.value, { y: 16, opacity: 0, scale: 0.97, duration: 0.6 }, '-=0.5')
      .from('.hero-side', { opacity: 0, x: (i) => (i === 0 ? -40 : 40), duration: 1.0, stagger: 0.1 }, '-=0.8')
      .from('.scroll-hint', { opacity: 0, duration: 0.8 }, '-=0.4')

    // Hero scroll: star zooms + spins away, name gradient sweeps, content parallaxes
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 40%', scrub: 1 },
    })
      .to('.hero-star-scale', { scale: 1.7, rotation: 100, opacity: 0.15 }, 0)
      .to(heroNameRef.value, { backgroundPosition: '50% 100%' }, 0)
      .to('.hero-content-inner', { y: -90 }, 0)

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

    // How-it-works steps + stats count-up
    gsap.utils.toArray('.step-card').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        y: 40, opacity: 0, duration: 0.7,
        delay: (i % 4) * 0.1,
        ease: 'power2.out',
        clearProps: 'transform',
      })
    })

    gsap.utils.toArray('.stat-num').forEach((el) => {
      const target = parseFloat(el.dataset.target || '0')
      const obj = { v: 0 }
      const num = el.querySelector('b')
      gsap.to(obj, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: () => { if (num) num.textContent = Math.round(obj.v) },
      })
    })

    gsap.from('.features-title', {
      scrollTrigger: { trigger: featuresSectionRef.value, start: 'top 82%', once: true },
      y: 32,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    })

    gsap.from('.about-outline', {
      scrollTrigger: { trigger: '.about', start: 'top 72%', once: true },
      xPercent: 10, opacity: 0, duration: 1, ease: 'power2.out',
    })

    gsap.from('.about-blob', {
      scrollTrigger: { trigger: '.about', start: 'top 72%', once: true },
      scale: 0.82, opacity: 0, duration: 1.2, ease: 'power2.out',
    })

    gsap.from('.about-copy > *', {
      scrollTrigger: { trigger: '.about-copy', start: 'top 82%', once: true },
      y: 28, opacity: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out',
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

  return () => {
    ctx?.revert()
    gsap.ticker.remove(tickLenis)
    lenis?.destroy()
    lenis = null
    isHeaderVisible.value = true
  }
  })
})

onBeforeUnmount(() => motion?.revert())
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
          <a href="#story">Story</a>
          <a href="#about">About</a>
          <a href="#how">How</a>
          <a href="#features">Features</a>
          <a href="https://github.com/Fast4gc/Complext">GitHub</a>
        </nav>
        <a href="keys" class="header-cta">Get started</a>
      </div>
    </header>

    <main>
      <!-- HERO: fused — 3D star + project name spotlight -->
      <section id="hero" ref="heroSectionRef" class="hero">
        <StarSky />
        <div class="hero-glow-main" aria-hidden="true"></div>
        <div class="hero-side hero-side--left" aria-hidden="true"></div>
        <div class="hero-side hero-side--right" aria-hidden="true"></div>

        <div class="hero-content-inner">
          <p class="hero-eyebrow">Complext Studio — automation flow</p>

          <div class="hero-stage">
            <div class="hero-star-spin" aria-hidden="true">
              <div class="hero-star-scale">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="hero-star-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#e0f2ff"/>
                      <stop offset="35%" stop-color="#7c5cff"/>
                      <stop offset="65%" stop-color="#4f46e5"/>
                      <stop offset="100%" stop-color="#c026d3"/>
                    </linearGradient>
                    <radialGradient id="hero-star-fill" cx="50%" cy="45%" r="65%">
                      <stop offset="0%" stop-color="#1b1040"/>
                      <stop offset="70%" stop-color="#0a0618"/>
                      <stop offset="100%" stop-color="#050310"/>
                    </radialGradient>
                    <filter id="hero-star-blur" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="7" result="b"/>
                      <feMerge>
                        <feMergeNode in="b"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g filter="url(#hero-star-blur)">
                    <path
                      d="M100 2 C102 60 140 98 198 100 C140 102 102 140 100 198 C98 140 60 102 2 100 C60 98 98 60 100 2 Z"
                      fill="url(#hero-star-fill)" stroke="url(#hero-star-rim)" stroke-width="2.5"/>
                    <path
                      d="M100 22 C101 66 134 99 178 100 C134 101 101 134 100 178 C99 134 66 101 22 100 C66 99 99 66 100 22 Z"
                      fill="white" opacity="0.06"/>
                    <line x1="100" y1="0" x2="100" y2="34" stroke="white" stroke-width="1.4" opacity="0.7"/>
                    <line x1="100" y1="166" x2="100" y2="200" stroke="white" stroke-width="1" opacity="0.3"/>
                  </g>
                </svg>
              </div>
            </div>
            <h1 ref="heroNameRef" class="hero-name">COMPLEXT</h1>
          </div>

          <h2 ref="heroTitleRef" class="hero-tagline">
            When intelligence reaches out to instinct, the future takes shape
          </h2>
          <p ref="heroSubtitleRef" class="hero-subtitle">
            an unlikely alliance — where human intuition and algorithmic precision move as one
          </p>
          <div ref="heroBtnRef" class="hero-actions">
            <a href="keys" class="btn-cta btn-solid">
              See it in action
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="8" x2="13" y2="8"/>
                <polyline points="9,4 13,8 9,12"/>
              </svg>
            </a>
            <a href="#story" class="btn-cta">
              Explore the story
            </a>
          </div>
        </div>

        <div class="scroll-hint" aria-hidden="true">
          <div class="scroll-hint-line"></div>
        </div>
      </section>

      <!-- TECH MARQUEE -->
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <span>Python</span><span>Vue 3</span><span>GSAP</span><span>Three.js</span><span>Vite</span><span>Lenis</span>
          <span>Python</span><span>Vue 3</span><span>GSAP</span><span>Three.js</span><span>Vite</span><span>Lenis</span>
        </div>
      </div>

      <!-- SCROLL STORY: 3D star -> animated text (pinned) -->
      <div id="story">
        <ScrollStory />
      </div>

      <!-- ABOUT (Image 3 style) -->
      <div class="continuation">
      <section id="about" class="about">
        <div class="about-blob" aria-hidden="true"></div>
        <span class="about-outline" aria-hidden="true">ABOUT</span>
        <div class="about-inner">
          <div class="about-copy">
            <p class="about-eyebrow">Who we are</p>
            <h2 class="about-title">Providing comprehensive automation tailored to the unique needs of our clients.</h2>
            <p class="about-text">
              Complext is a studio of engineers and designers obsessed with flow.
              We blend human intuition with algorithmic precision to ship fast,
              reliable experiences — from backend pipelines to interfaces.
            </p>
            <a href="keys" class="btn-cta about-cta">
              Read more
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="3" y1="8" x2="13" y2="8"/>
                <polyline points="9,4 13,8 9,12"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="about-ticks" aria-hidden="true"><span>01</span><i></i><i></i><i></i></div>
      </section>

      <!-- FEATURES -->
      <section id="features" ref="featuresSectionRef" class="features">
        <div class="features-inner">
          <p class="section-badge"><i></i>Introduction</p>
          <h2 class="features-title">
            What is <span class="features-highlight">Complext?</span>
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

      <!-- HOW IT WORKS (01–04 steps) -->
      <section id="how" class="how">
        <div class="how-inner">
          <p class="section-badge"><i></i>Choose • Deploy • Automate • Iterate</p>
          <h2 class="features-title">How it works</h2>
          <p class="features-subtitle">From first connection to full autopilot in four steps.</p>
          <div class="how-grid">
            <div v-for="(step, i) in steps" :key="i" class="step-card">
              <span class="step-num">0{{ i + 1 }}</span>
              <div class="step-icon"><font-awesome-icon :icon="step.icon" /></div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="stats" aria-label="Stats">
        <div class="stats-inner">
          <div v-for="(s, i) in stats" :key="i" class="stat">
            <div class="stat-num" :data-target="s.value"><span class="stat-prefix">{{ s.prefix }}</span><b>{{ s.value }}</b><span class="stat-suffix">{{ s.suffix }}</span></div>
            <p class="stat-label">{{ s.label }}</p>
          </div>
        </div>
      </section>
      </div>
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
.continuation {
  position: relative;
  z-index: 2;
  isolation: isolate;
  background: var(--color-bg);
}
.continuation::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 65% 24% at 8% 20%, rgba(var(--violet-rgb), 0.13), transparent 75%),
    radial-gradient(ellipse 65% 32% at 95% 48%, rgba(var(--violet-rgb), 0.08), transparent 75%);
}

/* Header */
.header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 16px 24px;
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
}
.header--hidden { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.header-inner {
  max-width: var(--content-width); margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; border-radius: 100px;
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
}
.header-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #fff; font-weight: 700; font-size: 1rem; }
.header-logo-img { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }
.header-nav { display: flex; gap: 32px; }
.header-nav a { color: var(--color-muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.25s; }
.header-nav a:hover { color: #fff; }
.header-cta {
  padding: 8px 20px; border-radius: 100px; background: #fff; color: #000;
  text-decoration: none; font-size: 0.875rem; font-weight: 600;
  transition: transform 0.25s, box-shadow 0.25s;
}
.header-cta:hover { transform: scale(1.04); box-shadow: 0 4px 20px rgba(255,255,255,0.15); }

/* Hero — fused: 3D star + project name spotlight */
.hero {
  position: relative; z-index: 1;
  min-height: 100svh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  overflow: hidden;
  padding: 130px 24px 80px;
}
.hero-glow-main {
  position: absolute; top: 4%; left: 50%;
  transform: translateX(-50%);
  width: min(92vw, 880px); height: min(72vh, 560px);
  background: var(--gradient-ambient);
  filter: blur(50px);
  pointer-events: none;
}
.hero::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 150px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(transparent, var(--color-bg));
}
.scroll-hint { z-index: 3; }
.hero-content-inner { position: relative; z-index: 3; text-align: center; max-width: 920px; }
.hero-eyebrow {
  display: inline-block;
  font-size: 0.72rem; letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--color-muted);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 100px;
  padding: 8px 18px;
  margin: 0 0 18px;
  background: rgba(255,255,255,0.03);
}
.hero-stage {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  min-height: clamp(240px, 44vh, 430px);
  margin: 6px 0 2px;
}
.hero-stage::before {
  content: '';
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: min(80vw, 720px); height: 62%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.6), transparent 70%);
  filter: blur(28px);
  z-index: 1;
  pointer-events: none;
}
.hero-star-spin {
  position: absolute; top: 50%; left: 50%;
  width: min(44vh, 360px); height: min(44vh, 360px);
  transform: translate(-50%, -50%);
  animation: hero-spin 46s linear infinite;
  opacity: 0.55;
  z-index: 0;
  filter: drop-shadow(0 0 46px rgba(var(--violet-rgb),0.45));
}
@keyframes hero-spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
.hero-star-scale { width: 100%; height: 100%; }
.hero-star-scale svg { width: 100%; height: 100%; overflow: visible; }
.hero-name {
  position: relative; z-index: 2;
  margin: 0;
  font-weight: 900; letter-spacing: -0.04em; line-height: 0.95;
  font-size: clamp(2.6rem, 12.8vw, 11rem);
  color: transparent;
  background-image: linear-gradient(to bottom,
    #ffffff 0%, #ffffff 36%,
    #c4b5fd 45%, #a855f7 52%,
    #ffffff 60%, #ffffff 100%);
  background-size: 100% 220%;
  background-position: 50% 0%;
  -webkit-background-clip: text;
  background-clip: text;
  filter: drop-shadow(0 6px 40px rgba(var(--lilac-rgb),0.35));
}
.hero-tagline {
  font-size: clamp(1.15rem, 2.6vw, 1.7rem);
  font-weight: 600; line-height: 1.3; letter-spacing: -0.02em;
  color: #fff;
  max-width: 660px;
  margin: 26px auto 14px;
}
.hero-subtitle {
  font-size: clamp(0.95rem, 1.8vw, 1.1rem);
  color: var(--color-muted); line-height: 1.6;
  margin: 0 auto 38px; max-width: 520px;
}
.hero-actions { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }
.btn-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent; color: #fff;
  text-decoration: none; font-size: 0.95rem; font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
}
.btn-cta:hover { border-color: #fff; background: rgba(255,255,255,0.06); transform: scale(1.04); }
.btn-solid { background: #fff; color: #000; border-color: #fff; }
.btn-solid:hover { background: #f0f0f0; box-shadow: 0 4px 24px rgba(255,255,255,0.18); }

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
.scroll-hint { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); }
.scroll-hint-line {
  width: 1px; height: 44px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
  animation: scroll-bounce 2s ease-in-out infinite;
}
@keyframes scroll-bounce {
  0%,100% { opacity: 0.3; } 50% { opacity: 0.7; }
}

/* About (Image 3 style) */
.about {
  position: relative; z-index: 2; overflow: hidden;
  padding: 130px 24px 140px;
  background: transparent;
}
.about-outline {
  position: absolute; top: 46px; right: -10px;
  font-weight: 900; letter-spacing: 0.02em;
  font-size: clamp(4rem, 15vw, 12rem); line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,0.16);
  pointer-events: none; user-select: none;
}
.about-blob {
  position: absolute; left: -12%; bottom: 0;
  width: min(58vw, 640px); aspect-ratio: 1.15;
  background:
    radial-gradient(ellipse at 35% 35%, #d2b8ff 0%, transparent 48%),
    radial-gradient(ellipse at 55% 55%, var(--color-violet) 15%, transparent 65%),
    radial-gradient(ellipse at 40% 70%, var(--color-violet-deep) 15%, transparent 68%);
  filter: blur(28px) saturate(1.2);
  mask-image: radial-gradient(ellipse closest-side, black 35%, transparent 100%);
  border-radius: 42% 58% 55% 45% / 48% 42% 58% 52%;
  animation: blob-morph 12s ease-in-out infinite;
  pointer-events: none;
}
@keyframes blob-morph {
  0%,100% { border-radius: 42% 58% 55% 45% / 48% 42% 58% 52%; transform: rotate(0deg) scale(1); }
  50% { border-radius: 58% 42% 45% 55% / 42% 58% 48% 52%; transform: rotate(8deg) scale(1.05); }
}
.about-inner { position: relative; max-width: var(--content-width); margin: 0 auto; display: flex; justify-content: flex-end; }
.about-copy { max-width: 470px; text-align: left; padding-top: 70px; }
.about-eyebrow { font-size: 0.72rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-muted); margin: 0 0 18px; }
.about-title { font-size: clamp(1.3rem, 2.4vw, 1.75rem); font-weight: 700; line-height: 1.35; color: #fff; margin: 0 0 18px; letter-spacing: -0.01em; }
.about-text { font-size: 0.92rem; line-height: 1.75; color: var(--color-muted); margin: 0 0 32px; }
.about-cta { font-size: 0.85rem; padding: 12px 24px; }
.about-ticks { position: absolute; bottom: 30px; right: 36px; display: flex; align-items: center; gap: 12px; font-size: 0.72rem; color: var(--color-muted); }
.about-ticks i { display: block; width: 26px; height: 1px; background: rgba(255,255,255,0.25); }
.about-ticks i:first-of-type { background: rgba(255,255,255,0.7); }

/* Features */
.features { position: relative; z-index: 2; padding: 90px 24px 120px; }
.features-inner { max-width: var(--content-width); margin: 0 auto; text-align: center; }
.features-title { font-size: clamp(2rem,4vw,3rem); font-weight: 700; letter-spacing: -0.03em; color: #fff; margin: 0 0 16px; }
.features-highlight {
  background: var(--gradient-accent);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.features-subtitle { font-size: 1.05rem; color: var(--color-muted); max-width: 480px; margin: 0 auto 56px; line-height: 1.6; }
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
.feature-card-desc { font-size: 0.9rem; color: var(--color-muted); line-height: 1.6; margin: 0; }

/* Section badge pill */
.section-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--color-muted);
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02);
  padding: 7px 16px; border-radius: 100px;
  margin: 0 0 22px;
}
.section-badge i { width: 6px; height: 6px; border-radius: 50%; background: #a855f7; display: inline-block; }

/* Tech marquee */
.marquee {
  position: relative; z-index: 2;
  background: var(--color-bg);
  overflow: hidden; padding: 16px 0;
}
.marquee-track { display: flex; gap: 54px; width: max-content; animation: marquee-scroll 30s linear infinite; }
.marquee-track span {
  display: flex; align-items: center; gap: 54px;
  font-size: 0.78rem; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--color-muted); white-space: nowrap;
}
.marquee-track span::after { content: '◆'; font-size: 0.5rem; color: rgba(var(--lilac-rgb),0.6); }
@keyframes marquee-scroll { to { transform: translateX(-50%); } }

/* How it works */
.how { position: relative; z-index: 2; padding: 110px 24px 120px; }
.how-inner { max-width: var(--content-width); margin: 0 auto; text-align: center; }
.how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; text-align: left; margin-top: 54px; }
.step-card {
  padding: 30px 26px; border-radius: 18px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
}
.step-card:nth-child(even) { background: rgba(var(--lilac-rgb),0.05); }
.step-card:hover { transform: translateY(-4px); border-color: rgba(var(--lilac-rgb),0.35); }
.step-num { font-size: 0.75rem; letter-spacing: 0.2em; font-weight: 700; color: var(--color-accent); }
.step-icon {
  width: 42px; height: 42px; border-radius: 12px;
  background: rgba(255,255,255,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; color: rgba(255,255,255,0.7);
  margin: 18px 0 14px;
}
.step-title { font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0 0 8px; }
.step-desc { font-size: 0.87rem; color: var(--color-muted); line-height: 1.6; margin: 0; }

/* Stats */
.stats { position: relative; z-index: 2; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
.stats-inner { max-width: var(--content-width); margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); }
.stat { padding: 52px 24px; text-align: center; position: relative; }
.stat + .stat::before { content: ''; position: absolute; left: 0; top: 26%; height: 48%; width: 1px; background: rgba(255,255,255,0.08); }
.stat-num { font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 900; letter-spacing: -0.03em; color: #fff; }
.stat-prefix, .stat-suffix { color: var(--color-accent); }
.stat-label { font-size: 0.8rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--color-muted); margin: 10px 0 0; }

/* Footer */
.footer { position: relative; z-index: 2; padding: 36px 24px; background: var(--color-bg); border-top: 1px solid rgba(255,255,255,0.06); }
.footer-inner { max-width: var(--content-width); margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.footer-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; }
.footer-logo { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
.footer-links { display: flex; gap: 20px; }
.footer-link { color: var(--color-muted); font-size: 1.2rem; transition: color 0.25s; }
.footer-link:hover { color: #fff; }
.footer-copy { font-size: 0.8rem; color: var(--color-muted); margin: 0; }

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
  .how-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-inner { grid-template-columns: 1fr; }
  .stat { padding: 34px 24px; }
  .stat + .stat::before { display: none; }
  .hero-side { display: none; }
  .hero-star-spin { width: min(70vw, 340px); height: min(70vw, 340px); }
  .hero-stage { min-height: 300px; }
  .about-inner { justify-content: flex-start; }
  .about-copy { max-width: 100%; padding-top: 120px; }
  .about-blob { left: -30%; width: 110vw; opacity: 0.7; }
  .about-ticks { display: none; }
}
@media (max-width: 640px) {
  .header { padding: 12px 16px; }
  .header-inner { padding: 10px 14px; }
  .hero { padding: 112px 20px 64px; min-height: 90svh; }
  .hero-content-inner { width: 100%; }
  .hero-eyebrow { font-size: 0.6rem; letter-spacing: 0.16em; }
  .hero-stage { min-height: 240px; }
  .features, .how, .about { padding: 80px 20px; }
  .about-blob { opacity: 0.3; }
  .features-grid, .how-grid { gap: 16px; }
  .footer-inner { flex-direction: column; gap: 14px; }
  .header-nav { display: none; }
  .how-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-star-spin, .scroll-hint-line, .marquee-track { animation: none !important; }
}
</style>
