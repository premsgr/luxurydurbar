<template>
  <div v-if="pending" class="section font-sans text-white/50">{{ t('common.loading') }}</div>
  <div v-else-if="error || !hall" class="section font-sans text-red-400">
    {{ t('halls.detail.notFound') }}
  </div>
  <div v-else>
    <section class="hero-flush relative h-[55vh] min-h-[320px]">
      <img
        :src="photos[0]"
        :alt="hall.name"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div class="absolute bottom-0 left-0 right-0 section !py-10">
        <h1 class="text-4xl sm:text-5xl text-white">{{ hall.name }}</h1>
        <p class="mt-2 font-sans text-gold-light">
          {{ t('common.guests', { count: hall.capacity }) }}
        </p>
      </div>
    </section>

    <section class="section grid gap-12 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-8">
        <p class="font-sans text-lg text-white/70 leading-relaxed">
          {{ description }}
        </p>
        <div v-if="hasMarketing" class="space-y-4 font-sans text-sm text-white/70">
          <p><span class="text-gold">{{ t('halls.labels.bestFor') }}:</span> {{ marketing('bestFor') }}</p>
          <p><span class="text-gold">{{ t('halls.labels.keyFeatures') }}:</span> {{ marketing('features') }}</p>
          <p><span class="text-gold">{{ t('halls.labels.layoutOptions') }}:</span> {{ marketing('layouts') }}</p>
        </div>
        <div>
          <h2 class="text-xl text-gold-light mb-4">{{ t('halls.detail.amenities') }}</h2>
          <ul class="grid gap-2 sm:grid-cols-2 font-sans text-white/70">
            <li v-for="a in hall.amenities" :key="a" class="flex gap-2">
              <span class="text-gold">◆</span> {{ a }}
            </li>
          </ul>
        </div>
        <div v-if="photos.length > 1" class="grid gap-4 sm:grid-cols-2">
          <img
            v-for="(src, i) in photos.slice(1)"
            :key="i"
            :src="src"
            :alt="hall.name"
            class="rounded-sm aspect-[4/3] object-cover w-full border border-white/10"
          />
        </div>
      </div>
      <aside class="border border-white/10 bg-white/[0.03] p-6 h-fit">
        <h3 class="text-lg text-gold-light">{{ t('halls.detail.requestTitle') }}</h3>
        <p class="mt-2 font-sans text-sm text-white/50">{{ t('halls.detail.requestText') }}</p>
        <NuxtLink :to="localePath({ path: '/contact', query: { hall: hall.slug } })" class="btn-gold mt-6 w-full">
          {{ t('halls.detail.bookCta', { name: hall.name }) }}
        </NuxtLink>
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'HallDetail' }
</script>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'
import { hallPhotos, PHOTOS } from '~/utils/photos'
import { SEO_DEFAULT_DESCRIPTION, SEO_KEYWORDS } from '~/utils/seo'

const { t, te, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { api } = useApi()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug))

const { data: hall, pending, error } = await useAsyncData(
  () => `hall-${slug.value}`,
  () => api<HallDto>(`/halls/${slug.value}`),
  { watch: [slug] },
)

const photos = computed(() =>
  hallPhotos(slug.value, hall.value?.images.map((i) => i.url) || []),
)

function marketing(field: string): string {
  const key = `halls.marketing.${slug.value}.${field}`
  return te(key) ? t(key) : ''
}

const hasMarketing = computed(() => te(`halls.marketing.${slug.value}.bestFor`))

const description = computed(() => {
  const overrideKey = `halls.marketing.${slug.value}.description`
  if (locale.value === 'ne' && te(overrideKey)) return t(overrideKey)
  return hall.value?.description || ''
})

useSeoMeta({
  title: () => (hall.value ? `${hall.value.name} — Luxury Durbar Kathmandu` : 'Hall — Luxury Durbar'),
  description: () =>
    hall.value?.description?.slice(0, 155)
    || 'Banquet hall at Luxury Durbar for events, parties, and Bratabandha in Kathmandu, Nepal.',
  keywords: SEO_KEYWORDS,
  ogTitle: () => (hall.value ? `${hall.value.name} — Luxury Durbar` : 'Hall — Luxury Durbar'),
  ogDescription: () => hall.value?.description?.slice(0, 155) || SEO_DEFAULT_DESCRIPTION,
  ogImage: () => `${config.public.siteUrl}${photos.value[0] || PHOTOS.hall}`,
})
</script>
