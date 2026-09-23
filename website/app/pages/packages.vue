<template>
  <div>
    <PageBanner
      :title="t('packages.banner.title')"
      :subtitle="t('packages.banner.subtitle')"
      :image="PHOTOS.dining"
    />

    <section class="section">
      <div class="grid gap-8 lg:grid-cols-2">
        <Reveal
          v-for="(pkg, i) in packageKeys"
          :key="pkg"
          :delay="i * 100"
        >
          <article
            class="flex flex-col border border-white/10 bg-white/[0.03] p-8 h-full"
            :class="pkg === 'platinum' ? 'border-gold/40' : ''"
          >
            <p class="eyebrow">{{ t(`packages.${pkg}.tagline`) }}</p>
            <h2 class="mt-3 text-3xl text-gold-light">{{ t(`packages.${pkg}.name`) }}</h2>
            <ul class="mt-8 flex-1 space-y-3 font-sans text-white/70">
              <li v-for="(item, j) in packageItems(pkg)" :key="j" class="flex gap-3">
                <span class="text-gold shrink-0">◆</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <NuxtLink
              :to="localePath({ path: '/contact', query: { package: pkg } })"
              class="btn-gold mt-10 self-start"
            >
              {{ t(`packages.${pkg}.cta`) }}
            </NuxtLink>
          </article>
        </Reveal>
      </div>
    </section>

    <section class="border-t border-white/10 bg-white/[0.02]">
      <div class="section">
        <MenuBoard />
      </div>
    </section>

    <section class="border-t border-white/10">
      <div class="section">
        <Reveal>
          <h2 class="text-3xl text-white">{{ t('packages.addons.title') }}</h2>
        </Reveal>
        <div class="mt-10 grid gap-6 sm:grid-cols-2">
          <Reveal
            v-for="(item, i) in addonItems"
            :key="i"
            :delay="i * 60"
          >
            <div class="border border-white/10 p-6 font-sans text-white/70 h-full">
              <span class="text-gold mr-2">◆</span>{{ item }}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'PackagesPage' }
</script>

<script setup lang="ts">
import { PHOTOS } from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()

useSeoMeta({
  title: () => t('packages.seoTitle'),
  description: () => t('packages.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('packages.seoTitle'),
  ogDescription: () => t('packages.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
})

const packageKeys = ['gold', 'platinum'] as const

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => (typeof item === 'string' ? item : rt(item as never)))
}

function packageItems(pkg: 'gold' | 'platinum'): string[] {
  return asStringList(tm(`packages.${pkg}.items` as 'packages.gold.items'))
}

const addonItems = computed(() => asStringList(tm('packages.addons.items')))
</script>
