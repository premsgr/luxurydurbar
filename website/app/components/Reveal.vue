<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'reveal--visible': visible }"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
export default { name: 'Reveal' }
</script>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    delay?: number
    once?: boolean
  }>(),
  {
    delay: 0,
    once: true,
  },
)

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (import.meta.server) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) {
    visible.value = true
    return
  }

  const target = el.value
  if (!target) return

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.value = true
          if (props.once) observer.unobserve(entry.target)
        }
        else if (!props.once) {
          visible.value = false
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  )

  observer.observe(target)
  onUnmounted(() => observer.disconnect())
})
</script>
