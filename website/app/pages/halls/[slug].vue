<template>
  <div v-if="pending" class="section font-sans-ui text-stone-400">Loading hall…</div>
  <div v-else-if="error || !hall" class="section font-sans-ui text-red-400">Hall not found.</div>
  <div v-else>
    <section class="relative h-[50vh] min-h-[320px]">
      <img :src="hall.images[0]?.url" :alt="hall.name" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 section !py-10">
        <h1 class="text-4xl sm:text-5xl text-[#faf7f2]">{{ hall.name }}</h1>
        <p class="mt-2 font-sans-ui text-[#e8d48b]">Up to {{ hall.capacity }} guests</p>
      </div>
    </section>

    <section class="section grid gap-12 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-8">
        <p class="font-sans-ui text-lg text-stone-300 leading-relaxed">{{ hall.description }}</p>
        <div>
          <h2 class="text-xl text-[#e8d48b] mb-4">Amenities</h2>
          <ul class="grid gap-2 sm:grid-cols-2 font-sans-ui text-stone-300">
            <li v-for="a in hall.amenities" :key="a" class="flex gap-2">
              <span class="text-[#c9a227]">◆</span> {{ a }}
            </li>
          </ul>
        </div>
        <div v-if="hall.images.length > 1" class="grid gap-4 sm:grid-cols-2">
          <img
            v-for="img in hall.images.slice(1)"
            :key="img.id"
            :src="img.url"
            :alt="img.caption || hall.name"
            class="rounded-sm aspect-[4/3] object-cover w-full"
          />
        </div>
      </div>
      <aside class="rounded-sm border border-stone-800 bg-stone-900/50 p-6 h-fit">
        <h3 class="text-lg text-[#e8d48b]">Request this hall</h3>
        <p class="mt-2 font-sans-ui text-sm text-stone-400">
          Check availability and submit a booking request. Our team will confirm shortly.
        </p>
        <NuxtLink :to="`/book?hall=${hall.slug}`" class="btn-gold mt-6 w-full">Book {{ hall.name }}</NuxtLink>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'

const route = useRoute()
const { api } = useApi()
const slug = computed(() => String(route.params.slug))

const { data: hall, pending, error } = await useAsyncData(
  () => `hall-${slug.value}`,
  () => api<HallDto>(`/halls/${slug.value}`),
  { watch: [slug] },
)

useSeoMeta({
  title: () => (hall.value ? `${hall.value.name} — Luxury Durbar` : 'Hall — Luxury Durbar'),
  description: () => hall.value?.description?.slice(0, 155) || 'Banquet hall at Luxury Durbar',
})
</script>
