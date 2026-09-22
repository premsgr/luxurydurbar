<template>
  <div>
    <section class="relative min-h-[78vh] flex items-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1519167758481-83f29da8c2b2?w=2000"
        alt="Luxury Durbar banquet hall"
        class="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      <div class="relative section !py-24">
        <p class="font-sans-ui text-xs uppercase tracking-[0.4em] text-[#c9a227] mb-4">Grand Banquet Venue</p>
        <h1 class="max-w-2xl text-4xl sm:text-6xl leading-tight text-[#faf7f2]">
          Celebrate in timeless elegance
        </h1>
        <p class="mt-6 max-w-xl font-sans-ui text-stone-300 text-lg">
          Luxury Durbar hosts weddings, receptions, and milestones in halls crafted for grandeur.
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <NuxtLink to="/book" class="btn-gold">Check availability</NuxtLink>
          <NuxtLink to="/halls" class="btn-outline">Explore halls</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Our venues</p>
          <h2 class="mt-2 text-3xl text-[#faf7f2]">Signature halls</h2>
        </div>
        <NuxtLink to="/halls" class="font-sans-ui text-sm text-[#e8d48b] hover:underline">View all</NuxtLink>
      </div>
      <div v-if="pending" class="font-sans-ui text-stone-400">Loading halls…</div>
      <div v-else-if="error" class="font-sans-ui text-red-400">Could not load halls. Is the API running?</div>
      <div v-else class="grid gap-8 md:grid-cols-3">
        <NuxtLink
          v-for="hall in halls?.slice(0, 3)"
          :key="hall.id"
          :to="`/halls/${hall.slug}`"
          class="group overflow-hidden rounded-sm border border-stone-800 bg-stone-900/40"
        >
          <div class="aspect-[4/3] overflow-hidden">
            <img
              :src="hall.images[0]?.url"
              :alt="hall.name"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div class="p-5">
            <h3 class="text-xl text-[#e8d48b]">{{ hall.name }}</h3>
            <p class="mt-2 font-sans-ui text-sm text-stone-400">Up to {{ hall.capacity }} guests</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="border-y border-stone-800 bg-stone-900/30">
      <div class="section grid gap-10 md:grid-cols-2 items-center">
        <div>
          <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Why Luxury Durbar</p>
          <h2 class="mt-2 text-3xl">A stage for your finest moments</h2>
          <ul class="mt-6 space-y-3 font-sans-ui text-stone-300">
            <li>— Multiple halls from intimate to grand</li>
            <li>— Dedicated event coordination</li>
            <li>— Real-time availability for booking requests</li>
            <li>— Catering-ready kitchens & décor partners</li>
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200"
          alt="Celebration at Luxury Durbar"
          class="rounded-sm object-cover aspect-[4/3] w-full"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'

useSeoMeta({
  title: 'Luxury Durbar — Banquet & Events',
  description:
    'Grand banquet halls for weddings, receptions, and celebrations. Explore venues and request a booking at Luxury Durbar.',
  ogTitle: 'Luxury Durbar — Banquet & Events',
  ogDescription: 'Celebrate in timeless elegance at Luxury Durbar.',
})

const { api } = useApi()
const { data: halls, pending, error } = await useAsyncData('home-halls', () =>
  api<HallDto[]>('/halls'),
)
</script>
