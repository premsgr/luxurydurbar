<template>
  <div>
    <section class="relative min-h-[85vh] flex items-center overflow-hidden">
      <div class="hero-bg absolute inset-0" aria-hidden="true">
        <img
          v-for="(src, i) in heroImages"
          :key="src"
          :src="src"
          alt=""
          class="hero-bg__img"
          :class="{ 'hero-bg__img--active': heroIndex === i }"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
      <div class="relative section !py-28">
        <p class="eyebrow hero-fade-in mb-4">{{ t('home.eyebrow') }}</p>
        <h1 class="hero-fade-in hero-fade-in--delay-1 max-w-3xl text-4xl sm:text-6xl lg:text-7xl leading-tight text-white tracking-wide">
          {{ t('home.headline') }}
        </h1>
        <span class="hero-gold-line" aria-hidden="true" />
        <p class="hero-fade-in hero-fade-in--delay-2 mt-6 max-w-xl font-sans text-lg text-white/70">
          {{ t('home.subhead') }}
        </p>
        <div class="hero-fade-in hero-fade-in--delay-3 mt-10 flex flex-wrap gap-4">
          <NuxtLinkLocale to="/contact" class="btn-gold">{{ t('home.ctaPrimary') }}</NuxtLinkLocale>
          <NuxtLinkLocale to="/contact" class="btn-outline">{{ t('home.ctaSecondary') }}</NuxtLinkLocale>
        </div>
      </div>
    </section>

    <section class="section">
      <Reveal>
        <p class="eyebrow">{{ t('home.story.eyebrow') }}</p>
      </Reveal>
      <div class="story-layout mt-10">
        <div class="story-collage">
          <button
            v-for="(item, i) in STORY_COLLAGE_PHOTOS"
            :key="item.src"
            type="button"
            class="story-collage__item"
            :class="`story-collage__item--${i + 1}`"
            :aria-label="t(item.altKey)"
            @click="openStoryLightbox(i)"
          >
            <img :src="item.src" :alt="t(item.altKey)" loading="lazy" />
          </button>
        </div>
        <div class="story-copy">
          <article
            v-for="(key, i) in storyKeys"
            :key="key"
            class="story-chapter"
          >
            <Reveal :delay="i * 70">
              <h2 class="text-2xl sm:text-3xl leading-tight text-white tracking-wide">
                {{ t(`home.story.chapters.${key}.title`) }}
              </h2>
              <p class="mt-3 font-sans text-sm sm:text-base text-white/55 leading-relaxed">
                {{ t(`home.story.chapters.${key}.text`) }}
              </p>
            </Reveal>
          </article>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-if="lightboxIndex !== null"
          class="story-lightbox"
          role="dialog"
          aria-modal="true"
          :aria-label="t('home.story.collage.lightboxLabel')"
          @click.self="closeStoryLightbox"
        >
          <button
            type="button"
            class="story-lightbox__close font-sans"
            @click="closeStoryLightbox"
          >
            {{ t('home.story.collage.close') }}
          </button>
          <img
            :src="STORY_COLLAGE_PHOTOS[lightboxIndex]!.src"
            :alt="t(STORY_COLLAGE_PHOTOS[lightboxIndex]!.altKey)"
            class="story-lightbox__img"
          />
        </div>
      </Teleport>
    </section>

    <section class="overflow-hidden py-16">
      <div class="section !py-0 mb-10">
        <Reveal>
          <p class="eyebrow">{{ t('home.galleryStrip.eyebrow') }}</p>
          <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('home.galleryStrip.title') }}</h2>
        </Reveal>
      </div>
      <PhotoMarquee />
    </section>

    <section class="section">
      <Reveal>
        <p class="eyebrow">{{ t('home.highlights.title') }}</p>
      </Reveal>
      <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal
          v-for="(key, i) in highlightKeys"
          :key="key"
          :delay="i * 80"
        >
          <div class="border border-white/10 bg-white/[0.03] p-6 h-full">
            <div class="text-gold text-xl mb-3">◆</div>
            <h3 class="text-xl text-gold-light">{{ t(`home.highlights.${key}.title`) }}</h3>
            <p class="mt-3 font-sans text-sm text-white/60 leading-relaxed">
              {{ t(`home.highlights.${key}.text`) }}
            </p>
          </div>
        </Reveal>
      </div>
    </section>

    <section class="border-y border-white/10 bg-white/[0.02]">
      <div class="section">
        <div class="home-menu-photos">
          <Reveal
            v-for="(item, i) in HOME_MENU_PHOTOS"
            :key="item.src"
            :delay="i * 100"
          >
            <figure class="home-menu-photos__item">
              <img :src="item.src" :alt="t(item.altKey)" loading="lazy" />
            </figure>
          </Reveal>
        </div>
        <MenuBoard />
      </div>
    </section>

    <section class="border-b border-white/10 bg-white/[0.02]">
      <div class="section">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <Reveal>
            <div>
              <p class="eyebrow">{{ t('home.venues.eyebrow') }}</p>
              <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('home.venues.title') }}</h2>
              <p class="mt-3 max-w-xl font-sans text-white/55">{{ t('home.venues.subtext') }}</p>
            </div>
          </Reveal>
          <div class="flex flex-wrap gap-2 font-sans text-xs uppercase tracking-wider">
            <button
              v-for="tab in venueTabs"
              :key="tab"
              type="button"
              class="rounded-sm border px-3 py-2 transition"
              :class="activeTab === tab
                ? 'border-gold bg-gold text-ink'
                : 'border-white/20 text-white/70 hover:border-gold/50'"
              @click="activeTab = tab"
            >
              {{ t(`home.venues.tabs.${tab}`) }}
            </button>
          </div>
        </div>

        <div v-if="pending" class="font-sans text-white/50">{{ t('common.loading') }}</div>
        <div v-else-if="error" class="font-sans text-red-400">{{ t('common.loadError') }}</div>
        <div v-else class="grid gap-8 md:grid-cols-3">
          <Reveal
            v-for="(hall, i) in filteredHalls"
            :key="hall.id"
            :delay="i * 90"
          >
            <article class="group overflow-hidden border border-white/10 bg-ink h-full">
              <div class="aspect-[4/3] overflow-hidden">
                <img
                  :src="hallPrimaryPhoto(hall.slug, hall.images[0]?.url)"
                  :alt="hall.name"
                  class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div class="p-5">
                <h3 class="text-2xl text-gold-light">{{ hall.name }}</h3>
                <p class="mt-2 font-sans text-sm text-white/50">
                  {{ t('common.guests', { count: hall.capacity }) }}
                </p>
                <NuxtLinkLocale
                  :to="`/halls/${hall.slug}`"
                  class="mt-5 inline-block font-sans text-sm uppercase tracking-wider text-gold hover:text-gold-light"
                >
                  {{ t('home.venues.viewSpecs') }} →
                </NuxtLinkLocale>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>

    <section class="section">
      <Reveal>
        <p class="eyebrow">{{ t('home.testimonials.eyebrow') }}</p>
        <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('home.testimonials.title') }}</h2>
      </Reveal>
      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <Reveal
          v-for="(item, i) in testimonials"
          :key="i"
          :delay="i * 100"
        >
          <blockquote class="border border-white/10 bg-white/[0.03] p-8 h-full">
            <p class="text-xl sm:text-2xl leading-relaxed text-white/90 italic">
              “{{ item.quote }}”
            </p>
            <footer class="mt-6 font-sans text-sm text-gold-light">
              — {{ item.author }}
              <span class="text-white/40"> ({{ item.role }})</span>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>

    <section class="border-t border-white/10 bg-white/[0.02]">
      <div class="section text-center !py-20">
        <Reveal>
          <h2 class="text-3xl sm:text-5xl text-white tracking-wide">{{ t('home.cta.title') }}</h2>
          <p class="mt-4 font-sans text-white/60">{{ t('home.cta.sub') }}</p>
          <NuxtLinkLocale to="/contact" class="btn-gold mt-8 inline-flex">
            {{ t('home.cta.button') }}
          </NuxtLinkLocale>
        </Reveal>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'HomePage' }
</script>

<script setup lang="ts">
import type { HallDto } from '@luxurydurbar/shared'
import {
  hallPrimaryPhoto,
  HOME_MENU_PHOTOS,
  PHOTOS,
  STORY_COLLAGE_PHOTOS,
  VENUE_TAB_HALLS,
  type StoryChapterKey,
} from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t, tm, rt } = useI18n()
const { api } = useApi()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('home.seoTitle'),
  description: () => t('home.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('home.seoTitle'),
  ogDescription: () => t('home.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
  twitterCard: 'summary_large_image',
})

const heroImages = [PHOTOS.hero, PHOTOS.heroAlt] as const
const heroIndex = ref(0)

const storyKeys: StoryChapterKey[] = ['lifetime', 'gossip', 'toast', 'business', 'gold']
const highlightKeys = ['flexible', 'catering', 'support', 'location'] as const
const venueTabs = ['all', 'weddings', 'corporate', 'social'] as const
const activeTab = ref<(typeof venueTabs)[number]>('all')

const lightboxIndex = ref<number | null>(null)

function openStoryLightbox(index: number) {
  lightboxIndex.value = index
}

function closeStoryLightbox() {
  lightboxIndex.value = null
}

onMounted(() => {
  const id = setInterval(() => {
    heroIndex.value = (heroIndex.value + 1) % heroImages.length
  }, 9000)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeStoryLightbox()
  }
  window.addEventListener('keydown', onKey)

  onUnmounted(() => {
    clearInterval(id)
    window.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  })
})

watch(lightboxIndex, (value) => {
  if (!import.meta.client) return
  document.body.style.overflow = value === null ? '' : 'hidden'
})

const { data: halls, pending, error } = await useAsyncData('home-halls', () =>
  api<HallDto[]>('/halls'),
)

const filteredHalls = computed(() => {
  const list = halls.value || []
  const order = VENUE_TAB_HALLS[activeTab.value] ?? VENUE_TAB_HALLS.all ?? []
  return order
    .map((slug) => list.find((h) => h.slug === slug))
    .filter((h): h is HallDto => !!h)
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
