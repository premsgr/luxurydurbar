<template>
  <div>
    <PageBanner
      :title="t('gallery.banner.title')"
      :subtitle="t('gallery.banner.subtitle')"
      :image="PHOTOS.hallAlt"
    />

    <section
      v-for="key in GALLERY_SECTION_KEYS"
      :key="key"
      class="overflow-hidden border-b border-white/10 py-14"
    >
      <div class="section !py-0 mb-8">
        <p class="eyebrow">{{ t(`gallery.sections.${key}.eyebrow`) }}</p>
        <h2 class="mt-2 text-3xl sm:text-4xl text-white">
          {{ t(`gallery.sections.${key}.title`) }}
        </h2>
      </div>
      <PhotoMarquee
        :items="GALLERY_SECTIONS[key]"
        :label="t(`gallery.sections.${key}.title`)"
      />
    </section>

    <section class="section">
      <p class="eyebrow">{{ t('gallery.spotlight.title') }}</p>
      <div class="mt-8 space-y-10 max-w-3xl">
        <div class="border border-white/10 bg-white/[0.03] p-8">
          <h2 class="text-3xl text-gold-light">{{ t('gallery.spotlight.story') }}</h2>
          <p class="mt-2 font-sans text-sm text-gold">{{ t('gallery.spotlight.details') }}</p>
          <p class="mt-6 font-sans text-white/70 leading-relaxed">
            {{ t('gallery.spotlight.body') }}
          </p>
        </div>
        <blockquote
          v-for="(item, i) in testimonials"
          :key="i"
          class="border border-white/10 p-8"
        >
          <p class="text-xl italic text-white/90">“{{ item.quote }}”</p>
          <footer class="mt-4 font-sans text-sm text-gold-light">
            — {{ item.author }} <span class="text-white/40">({{ item.role }})</span>
          </footer>
        </blockquote>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'GalleryPage' }
</script>

<script setup lang="ts">
import {
  GALLERY_SECTION_KEYS,
  GALLERY_SECTIONS,
  PHOTOS,
} from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t, tm, rt } = useI18n()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('gallery.seoTitle'),
  description: () => t('gallery.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('gallery.seoTitle'),
  ogDescription: () => t('gallery.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
  twitterCard: 'summary_large_image',
})

const testimonials = computed(() => {
  const raw = tm('home.testimonials.items') as Array<{ quote: string; author: string; role: string }>
  if (!Array.isArray(raw)) return []
  return raw.map((item) => ({
    quote: typeof item.quote === 'string' ? item.quote : rt(item.quote),
    author: typeof item.author === 'string' ? item.author : rt(item.author),
    role: typeof item.role === 'string' ? item.role : rt(item.role),
  }))
})
</script>
