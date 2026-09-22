<template>
  <div class="section">
    <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Venues</p>
    <h1 class="mt-2 text-4xl">Our halls</h1>
    <p class="mt-4 max-w-2xl font-sans-ui text-stone-400">
      From intimate chambers to grand ballrooms — choose the setting that matches your celebration.
    </p>

    <div v-if="pending" class="mt-10 font-sans-ui text-stone-400">Loading…</div>
    <div v-else-if="error" class="mt-10 font-sans-ui text-red-400">Failed to load halls.</div>
    <div v-else class="mt-12 grid gap-10 md:grid-cols-2">
      <article
        v-for="hall in halls"
        :key="hall.id"
        class="overflow-hidden rounded-sm border border-stone-800 bg-stone-900/40"
      >
        <NuxtLink :to="`/halls/${hall.slug}`">
          <div class="aspect-[16/10] overflow-hidden">
            <img :src="hall.images[0]?.url" :alt="hall.name" class="h-full w-full object-cover" />
          </div>
        </NuxtLink>
        <div class="p-6">
          <h2 class="text-2xl text-[#e8d48b]">{{ hall.name }}</h2>
          <p class="mt-2 font-sans-ui text-sm text-stone-400">Capacity {{ hall.capacity }} guests</p>
          <p class="mt-4 font-sans-ui text-stone-300 line-clamp-3">{{ hall.description }}</p>
          <NuxtLink :to="`/halls/${hall.slug}`" class="mt-6 inline-block font-sans-ui text-sm text-[#c9a227]">
            View details →
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'

useSeoMeta({
  title: 'Halls — Luxury Durbar',
  description: 'Explore banquet halls at Luxury Durbar with capacities for every celebration.',
})

const { api } = useApi()
const { data: halls, pending, error } = await useAsyncData('halls', () => api<HallDto[]>('/halls'))
</script>
