<template>
  <div class="section">
    <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Gallery</p>
    <h1 class="mt-2 text-4xl">Moments at the Durbar</h1>
    <div v-if="pending" class="mt-10 font-sans-ui text-stone-400">Loading…</div>
    <div v-else class="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
      <img
        v-for="(img, i) in images"
        :key="i"
        :src="img"
        alt="Luxury Durbar gallery"
        class="mb-4 w-full break-inside-avoid rounded-sm object-cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'

useSeoMeta({
  title: 'Gallery — Luxury Durbar',
  description: 'A visual tour of weddings, receptions, and celebrations at Luxury Durbar.',
})

const { api } = useApi()
const { data: halls, pending } = await useAsyncData('gallery-halls', () => api<HallDto[]>('/halls'))

const images = computed(() => {
  const fromHalls = (halls.value || []).flatMap((h) => h.images.map((i) => i.url))
  const extras = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200',
  ]
  return [...fromHalls, ...extras]
})
</script>
