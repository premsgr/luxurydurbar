<template>
  <div ref="rootEl" class="photo-marquee" :aria-label="label || t('gallery.marqueeLabel')">
    <div class="photo-marquee__track">
      <figure
        v-for="(item, i) in loopItems"
        :key="`${item.src}-${i}`"
        ref="itemEls"
        class="photo-marquee__item"
      >
        <img :src="item.src" :alt="t(item.altKey)" loading="lazy" />
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'PhotoMarquee' }
</script>

<script setup lang="ts">
import type { GalleryItem } from '~/utils/photos'
import { GALLERY_ITEMS } from '~/utils/photos'

const props = withDefaults(
  defineProps<{
    items?: GalleryItem[]
    label?: string
  }>(),
  {
    items: undefined,
    label: undefined,
  },
)

const { t } = useI18n()

const sourceItems = computed(() => props.items?.length ? props.items : GALLERY_ITEMS)
const loopItems = computed(() => [...sourceItems.value, ...sourceItems.value])

const rootEl = ref<HTMLElement | null>(null)
const itemEls = ref<HTMLElement[]>([])
let rafId = 0
let reducedMotion = false

const EDGE_SCALE = 1.28
const CENTER_SCALE = 0.78

function updateScales() {
  const root = rootEl.value
  const items = itemEls.value
  if (!root || !items?.length || reducedMotion) return

  const rootRect = root.getBoundingClientRect()
  const midX = rootRect.left + rootRect.width / 2
  const halfW = rootRect.width / 2 || 1

  for (const el of items) {
    const rect = el.getBoundingClientRect()
    const itemMid = rect.left + rect.width / 2
    // 0 at center, 1 at either edge
    const edgeFactor = Math.min(1, Math.abs(itemMid - midX) / halfW)
    const scale = CENTER_SCALE + (EDGE_SCALE - CENTER_SCALE) * edgeFactor
    el.style.setProperty('--marquee-scale', scale.toFixed(3))
  }

  rafId = requestAnimationFrame(updateScales)
}

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion) {
    rafId = requestAnimationFrame(updateScales)
  }
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>
