<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({ active: { type: Boolean, default: true } })
const skyRef = ref(null)
const visible = ref(false)
let observer

// Stable positions keep the sky consistent across renders.
let seed = 417
const random = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const stars = Array.from({ length: 110 }, (_, index) => ({
  left: `${random() * 100}%`,
  top: `${random() * 100}%`,
  '--size': `${index % 9 === 0 ? 2 : 0.7 + random() * 0.8}px`,
  '--brightness': 0.18 + random() * 0.48,
  '--delay': `${-random() * 7}s`,
  '--duration': `${4 + random() * 4}s`,
}))

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    visible.value = entry.isIntersecting
  }, { threshold: 0.05 })
  observer.observe(skyRef.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="skyRef" class="star-sky" :class="{ 'is-playing': visible && active }" aria-hidden="true">
    <span v-for="(style, index) in stars" :key="index" class="sky-star" :style="style"></span>
    <div class="meteor-path"><span class="meteor"></span></div>
  </div>
</template>

<style scoped>
.star-sky {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: radial-gradient(ellipse at 65% 35%, rgba(var(--violet-rgb), 0.09), transparent 65%);
}
.sky-star {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--color-text);
  opacity: var(--brightness);
}
.sky-star:nth-child(3n) { background: var(--color-accent); }
.sky-star:nth-child(9n) {
  box-shadow: 0 0 7px rgba(var(--lilac-rgb), 0.65);
  animation: star-shimmer var(--duration) ease-in-out var(--delay) infinite;
  animation-play-state: paused;
}
.meteor-path {
  position: absolute;
  top: 12%;
  left: 82%;
  width: min(84vw, 920px);
  height: 2px;
  transform: rotate(142deg);
  transform-origin: left center;
}
.meteor {
  position: absolute;
  width: clamp(100px, 18vw, 240px);
  height: 1px;
  opacity: 0;
  background: linear-gradient(90deg, transparent, rgba(var(--violet-rgb), 0.25) 30%, var(--color-accent) 80%, white);
  filter: drop-shadow(0 0 4px var(--color-violet));
  animation: meteor-flight 8s linear 0.8s infinite;
  animation-play-state: paused;
}
.meteor::after {
  content: '';
  position: absolute;
  right: 0;
  top: -1px;
  width: 4px;
  height: 3px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 8px var(--color-accent), 0 0 18px var(--color-violet);
}
.is-playing .sky-star, .is-playing .meteor { animation-play-state: running; }
@keyframes star-shimmer {
  0%, 100% { opacity: var(--brightness); }
  50% { opacity: 0.15; }
}
@keyframes meteor-flight {
  0% { left: -15%; opacity: 0; transform: scaleX(0.4); }
  3% { opacity: 0.9; }
  18% { left: 85%; opacity: 0; transform: scaleX(1); }
  100% { left: 85%; opacity: 0; }
}
@media (max-width: 640px) {
  .sky-star:nth-child(2n) { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sky-star { animation: none; }
  .meteor-path { display: none; }
}
</style>
