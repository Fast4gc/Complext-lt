<template>
  <section ref="rootRef" class="scrollstory" aria-label="Scroll story">
    <div ref="pinRef" class="scrollstory-pin">
      <!-- ACT 1 — 3D star (Image 1) -->
      <div ref="act1Ref" class="act act--dark">
        <p class="act-kicker">01 — Signal</p>
        <div ref="starRef" class="star">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="star-rim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e0f2ff"/>
                <stop offset="35%" stop-color="#7c5cff"/>
                <stop offset="65%" stop-color="#4f46e5"/>
                <stop offset="100%" stop-color="#c026d3"/>
              </linearGradient>
              <radialGradient id="star-fill" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stop-color="#1b1040"/>
                <stop offset="70%" stop-color="#0a0618"/>
                <stop offset="100%" stop-color="#050310"/>
              </radialGradient>
              <filter id="star-blur" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <g filter="url(#star-blur)">
              <path
                d="M100 2 C102 60 140 98 198 100 C140 102 102 140 100 198 C98 140 60 102 2 100 C60 98 98 60 100 2 Z"
                fill="url(#star-fill)" stroke="url(#star-rim)" stroke-width="2.5"/>
              <path
                d="M100 22 C101 66 134 99 178 100 C134 101 101 134 100 178 C99 134 66 101 22 100 C66 99 99 66 100 22 Z"
                fill="white" opacity="0.06"/>
              <line x1="100" y1="0" x2="100" y2="34" stroke="white" stroke-width="1.4" opacity="0.7"/>
              <line x1="100" y1="166" x2="100" y2="200" stroke="white" stroke-width="1" opacity="0.3"/>
            </g>
          </svg>
        </div>
        <p class="act-hint">scroll to dissolve</p>
      </div>

      <!-- ACT 2 — animated text (Image 2) -->
      <div ref="act2Ref" class="act act--cream">
        <p class="act-kicker act-kicker--dark">02 — Void</p>
        <h2 ref="voidRef" class="void-word">COMPLEXT</h2>
        <div class="void-blobs" aria-hidden="true">
          <span ref="blobARef" class="void-blob void-blob--a"></span>
          <span ref="blobBRef" class="void-blob void-blob--b"></span>
        </div>
      </div>

      <!-- progress ticks -->
      <div class="story-progress" aria-hidden="true">
        <span ref="tick1Ref" class="tick is-active">01</span>
        <span class="tick-line"></span>
        <span ref="tick2Ref" class="tick">02</span>
        <span class="tick-line"></span>
        <span ref="tick3Ref" class="tick">03</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const rootRef = ref(null)
const pinRef = ref(null)
const act1Ref = ref(null)
const act2Ref = ref(null)
const starRef = ref(null)
const voidRef = ref(null)
const blobARef = ref(null)
const blobBRef = ref(null)
const tick1Ref = ref(null)
const tick2Ref = ref(null)
const tick3Ref = ref(null)
let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    // Desktop / large: pinned scrubbed sequence
    mm.add('(min-width: 769px)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.value,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: pinRef.value,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            tick1Ref.value?.classList.toggle('is-active', p < 0.4)
            tick2Ref.value?.classList.toggle('is-active', p >= 0.4 && p < 0.8)
            tick3Ref.value?.classList.toggle('is-active', p >= 0.8)
          },
        },
      })

      // Act 1: star slowly rotates + grows while reading
      tl.to(starRef.value, { rotation: 120, scale: 1.12, duration: 1 }, 0)
        .to('.act-hint', { opacity: 0, duration: 0.3 }, 0.5)

      // Transition: star shrinks away, dark act fades
      tl.to(starRef.value, { scale: 0.4, opacity: 0, rotation: 200, duration: 0.8 }, 1)
        .to(act1Ref.value, { opacity: 0, duration: 0.6 }, 1.1)

      // Act 2: cream panel wipes in, word rises, gradient band sweeps
      tl.fromTo(act2Ref.value, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.2)
        .fromTo(voidRef.value,
          { yPercent: 18, opacity: 0, backgroundPosition: '50% 0%' },
          { yPercent: 0, opacity: 1, backgroundPosition: '50% 100%', duration: 1.2 }, 1.3)
        .fromTo([blobARef.value, blobBRef.value],
          { yPercent: 60, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 1.6)

      // Settle: word drifts slightly, blobs breathe
      tl.to(voidRef.value, { yPercent: -4, duration: 0.6 }, 2.4)
        .to([blobARef.value, blobBRef.value], { scaleY: 1.08, duration: 0.6, stagger: 0.08 }, 2.4)

      return () => {}
    })

    // Mobile / reduced motion: static stacked panels, no pin
    mm.add('(max-width: 768px), (prefers-reduced-motion: reduce)', () => {
      gsap.set([act1Ref.value, act2Ref.value], { clearProps: 'all', opacity: 1 })
      gsap.set(starRef.value, { clearProps: 'all', opacity: 1 })
      gsap.set(voidRef.value, { clearProps: 'all', opacity: 1 })
      return () => {}
    })
  }, rootRef.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.scrollstory { position: relative; z-index: 2; background: #000; }
.scrollstory-pin {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.act { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.act--dark { background: #000; z-index: 1; }
.act--cream { background: #f3efe7; z-index: 2; opacity: 0; }

.act-kicker {
  position: absolute; top: 96px;
  font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase;
  color: rgba(255,255,255,0.35); margin: 0;
}
.act-kicker--dark { color: rgba(20,16,12,0.4); }
.act-hint { margin-top: 42px; font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3); }

.star { width: min(46vh, 380px); height: min(46vh, 380px); filter: drop-shadow(0 0 42px rgba(124,58,237,0.45)); }
.star svg { width: 100%; height: 100%; overflow: visible; }

/* Image 2 — big word with scroll-driven gradient band */
.void-word {
  margin: 0;
  font-weight: 900;
  font-size: clamp(3rem, 13vw, 11rem);
  letter-spacing: -0.05em;
  line-height: 1;
  color: transparent;
  background-image: linear-gradient(to bottom,
    #171310 0%, #171310 36%,
    #6d28d9 45%, #a855f7 52%,
    #171310 60%, rgba(23,19,16,0.05) 92%);
  background-size: 100% 220%;
  background-position: 50% 0%;
  -webkit-background-clip: text;
  background-clip: text;
}

.void-blobs { position: absolute; bottom: -12vh; left: 0; right: 0; height: 34vh; pointer-events: none; }
.void-blob { position: absolute; bottom: 0; filter: blur(38px); }
.void-blob--a {
  left: 4%; width: 44%; height: 120%;
  background: radial-gradient(ellipse at 40% 60%, #0c0a08 30%, #4c1d95 62%, transparent 75%);
  border-radius: 50% 50% 0 0;
}
.void-blob--b {
  right: 4%; width: 44%; height: 120%;
  background: radial-gradient(ellipse at 60% 60%, #0c0a08 30%, #6d28d9 62%, transparent 75%);
  border-radius: 50% 50% 0 0;
}

.story-progress {
  position: absolute; bottom: 28px; right: 36px; z-index: 5;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.72rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.4);
}
.tick { opacity: 0.35; transition: opacity 0.3s; }
.tick.is-active { opacity: 1; color: #fff; }
.tick-line { width: 28px; height: 1px; background: rgba(255,255,255,0.25); }

@media (max-width: 768px) {
  .scrollstory-pin { height: auto; }
  .act { position: relative; min-height: 80vh; }
  .act--cream { opacity: 1; }
  .story-progress { display: none; }
}
</style>
