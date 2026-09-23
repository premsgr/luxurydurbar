<template>
  <div>
    <section class="relative min-h-[50vh] flex items-end overflow-hidden border-b border-white/10">
      <img
        :src="PHOTOS.hero"
        alt=""
        class="hero-zoom absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div class="relative section !py-20">
        <p class="eyebrow hero-fade-in">{{ t('about.eyebrow') }}</p>
        <h1 class="hero-fade-in hero-fade-in--delay-1 mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl leading-tight text-white tracking-wide">
          {{ t('about.statement') }}
        </h1>
        <span class="hero-gold-line" aria-hidden="true" />
      </div>
    </section>

    <section class="section max-w-3xl">
      <Reveal>
        <p class="font-sans text-lg text-white/70 leading-relaxed">
          {{ t('about.intro') }}
        </p>
      </Reveal>
    </section>

    <section class="border-y border-white/10 bg-white/[0.02]">
      <div class="section">
        <Reveal>
          <h2 class="text-3xl text-white tracking-wide">{{ t('about.principles.title') }}</h2>
        </Reveal>
        <div class="mt-12 grid gap-10 md:grid-cols-3">
          <Reveal
            v-for="(key, i) in principleKeys"
            :key="key"
            :delay="i * 100"
          >
            <div>
              <h3 class="text-xl text-gold-light">{{ t(`about.principles.${key}.title`) }}</h3>
              <p class="mt-4 font-sans text-sm text-white/60 leading-relaxed">
                {{ t(`about.principles.${key}.text`) }}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>

    <section class="section grid gap-10 md:grid-cols-2 items-center">
      <Reveal>
        <img
          :src="PHOTOS.hall"
          alt="Luxury Durbar hall"
          class="w-full aspect-[4/3] object-cover border border-white/10"
        />
      </Reveal>
      <Reveal :delay="120">
        <div>
          <NuxtLinkLocale to="/contact" class="btn-gold">{{ t('about.cta') }}</NuxtLinkLocale>
        </div>
      </Reveal>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'AboutPage' }
</script>

<script setup lang="ts">
import { PHOTOS } from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t } = useI18n()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('about.seoTitle'),
  description: () => t('about.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('about.seoTitle'),
  ogDescription: () => t('about.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
})

const principleKeys = ['hospitality', 'detail', 'coordination'] as const
</script>
