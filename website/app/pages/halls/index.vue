<template>
  <div>
    <PageBanner
      :title="t('halls.banner.title')"
      :subtitle="t('halls.banner.subtitle')"
      :image="PHOTOS.hall"
    />

    <div v-if="pending" class="section font-sans text-white/50">{{ t('common.loading') }}</div>
    <div v-else-if="error" class="section font-sans text-red-400">{{ t('common.loadError') }}</div>
    <template v-else>
      <section class="section space-y-20">
        <article
          v-for="(hall, index) in halls"
          :key="hall.id"
          class="grid gap-10 lg:grid-cols-2 items-center"
          :class="index % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''"
        >
          <div class="aspect-[4/3] overflow-hidden border border-white/10">
            <img
              :src="hallPrimaryPhoto(hall.slug, hall.images[0]?.url)"
              :alt="hall.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div>
            <p class="eyebrow">{{ t('common.capacity', { count: hall.capacity }) }}</p>
            <h2 class="mt-2 text-3xl sm:text-4xl text-gold-light">{{ hall.name }}</h2>
            <p class="mt-4 font-sans text-white/60">
              {{ marketing(hall.slug, 'capacityLabel') }}
            </p>
            <dl class="mt-6 space-y-4 font-sans text-sm text-white/75">
              <div>
                <dt class="text-gold uppercase tracking-wider text-xs mb-1">{{ t('halls.labels.bestFor') }}</dt>
                <dd>{{ marketing(hall.slug, 'bestFor') }}</dd>
              </div>
              <div>
                <dt class="text-gold uppercase tracking-wider text-xs mb-1">{{ t('halls.labels.keyFeatures') }}</dt>
                <dd>{{ marketing(hall.slug, 'features') }}</dd>
              </div>
              <div>
                <dt class="text-gold uppercase tracking-wider text-xs mb-1">{{ t('halls.labels.layoutOptions') }}</dt>
                <dd>{{ marketing(hall.slug, 'layouts') }}</dd>
              </div>
            </dl>
            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLinkLocale :to="`/halls/${hall.slug}`" class="btn-outline !py-2">
                {{ t('halls.viewHall') }}
              </NuxtLinkLocale>
              <NuxtLink :to="localePath({ path: '/contact', query: { hall: hall.slug } })" class="btn-gold !py-2">
                {{ t('halls.inquire') }}
              </NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <section class="border-t border-white/10 bg-white/[0.02]">
        <div class="section overflow-x-auto">
          <h2 class="text-3xl text-white mb-8">{{ t('halls.comparison.title') }}</h2>
          <table class="w-full min-w-[640px] font-sans text-sm text-left border-collapse">
            <thead>
              <tr class="border-b border-white/20 text-gold-light">
                <th class="py-3 pr-4 font-medium">{{ t('halls.comparison.feature') }}</th>
                <th v-for="hall in halls" :key="hall.id" class="py-3 px-4 font-medium">
                  {{ hall.name }}
                </th>
              </tr>
            </thead>
            <tbody class="text-white/70">
              <tr class="border-b border-white/10">
                <td class="py-3 pr-4 text-white/90">{{ t('halls.comparison.maxCapacity') }}</td>
                <td v-for="hall in halls" :key="`cap-${hall.id}`" class="py-3 px-4">
                  {{ hall.capacity }}
                </td>
              </tr>
              <tr
                v-for="row in comparisonRows"
                :key="row.key"
                class="border-b border-white/10"
              >
                <td class="py-3 pr-4 text-white/90">{{ t(row.label) }}</td>
                <td v-for="hall in halls" :key="`${row.key}-${hall.id}`" class="py-3 px-4">
                  {{ amenityLabel(hall.slug, row.key) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
export default { name: 'HallsIndex' }
</script>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'
import { hallPrimaryPhoto, PHOTOS } from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t, te } = useI18n()
const localePath = useLocalePath()
const { api } = useApi()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('halls.seoTitle'),
  description: () => t('halls.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('halls.seoTitle'),
  ogDescription: () => t('halls.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
})

const { data: halls, pending, error } = await useAsyncData('halls-list', () =>
  api<HallDto[]>('/halls'),
)

const comparisonRows = [
  { key: 'av', label: 'halls.comparison.av' },
  { key: 'bridal', label: 'halls.comparison.bridal' },
  { key: 'valet', label: 'halls.comparison.valet' },
  { key: 'catering', label: 'halls.comparison.catering' },
] as const

function marketing(slug: string, field: string): string {
  const key = `halls.marketing.${slug}.${field}`
  return te(key) ? t(key) : ''
}

function amenityLabel(slug: string, field: string): string {
  const raw = marketing(slug, field)
  const map: Record<string, string> = {
    included: t('halls.comparison.included'),
    onRequest: t('halls.comparison.onRequest'),
    available: t('halls.comparison.available'),
    dressing: t('halls.comparison.dressing'),
  }
  return map[raw] || raw
}
</script>
