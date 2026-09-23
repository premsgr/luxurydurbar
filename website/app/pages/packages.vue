<template>
  <div>
    <PageBanner
      :title="t('packages.banner.title')"
      :subtitle="t('packages.banner.subtitle')"
      :image="PHOTOS.dining"
    />

    <!-- Celebration tiers -->
    <section class="section">
      <Reveal>
        <p class="eyebrow">{{ t('packages.tiers.eyebrow') }}</p>
        <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('packages.tiers.title') }}</h2>
      </Reveal>
      <div class="mt-10 grid gap-8 lg:grid-cols-3">
        <Reveal
          v-for="(pkg, i) in celebrationKeys"
          :key="pkg"
          :delay="i * 100"
        >
          <article
            class="flex flex-col border border-white/10 bg-white/[0.03] p-8 h-full"
            :class="{
              'border-gold/40': pkg === 'platinum',
              'border-gold/25': pkg === 'diamond',
            }"
          >
            <p class="eyebrow">{{ t(`packages.${pkg}.tagline`) }}</p>
            <h3 class="mt-3 text-3xl text-gold-light">{{ t(`packages.${pkg}.name`) }}</h3>
            <ul class="mt-8 flex-1 space-y-3 font-sans text-white/70">
              <li v-for="(item, j) in packageItems(pkg)" :key="j" class="flex gap-3">
                <span class="text-gold shrink-0">◆</span>
                <span>{{ item }}</span>
              </li>
            </ul>
            <NuxtLink
              :to="packageLink(pkg)"
              class="btn-gold mt-10 self-start"
            >
              {{ t(`packages.${pkg}.cta`) }}
            </NuxtLink>
          </article>
        </Reveal>
      </div>
    </section>

    <!-- Corporate -->
    <section class="border-t border-white/10 bg-white/[0.02]">
      <div class="section">
        <Reveal>
          <p class="eyebrow">{{ t('packages.corporate.eyebrow') }}</p>
          <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('packages.corporate.title') }}</h2>
          <p class="mt-4 max-w-3xl font-sans text-white/60 leading-relaxed">
            {{ t('packages.corporate.intro') }}
          </p>
        </Reveal>
        <div class="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal
            v-for="(key, i) in corporateKeys"
            :key="key"
            :delay="i * 100"
          >
            <article class="flex flex-col border border-white/10 bg-ink p-8 h-full">
              <h3 class="text-2xl sm:text-3xl text-gold-light">
                {{ t(`packages.corporate.${key}.name`) }}
              </h3>
              <p class="mt-2 font-sans text-sm uppercase tracking-wider text-gold/80">
                {{ t(`packages.corporate.${key}.subtitle`) }}
              </p>
              <p class="mt-4 font-sans text-white/60 leading-relaxed">
                {{ t(`packages.corporate.${key}.ideal`) }}
              </p>
              <ul class="mt-6 flex-1 space-y-3 font-sans text-white/70">
                <li
                  v-for="(item, j) in corporateItems(key)"
                  :key="j"
                  class="flex gap-3"
                >
                  <span class="text-gold shrink-0">◆</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <NuxtLink
                :to="packageLink(key)"
                class="btn-gold mt-10 self-start"
              >
                {{ t(`packages.corporate.${key}.cta`) }}
              </NuxtLink>
            </article>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Specialized -->
    <section class="border-t border-white/10">
      <div class="section">
        <Reveal>
          <p class="eyebrow">{{ t('packages.special.eyebrow') }}</p>
          <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('packages.special.title') }}</h2>
          <p class="mt-4 max-w-3xl font-sans text-white/60 leading-relaxed">
            {{ t('packages.special.intro') }}
          </p>
        </Reveal>
        <div class="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal
            v-for="(key, i) in specialKeys"
            :key="key"
            :delay="i * 100"
          >
            <article class="flex flex-col border border-white/10 bg-white/[0.03] p-8 h-full">
              <h3 class="text-2xl sm:text-3xl text-gold-light">
                {{ t(`packages.special.${key}.name`) }}
              </h3>
              <p class="mt-3 font-sans text-sm text-gold/80">
                {{ t(`packages.special.${key}.bestFor`) }}
              </p>
              <ul class="mt-6 flex-1 space-y-3 font-sans text-white/70">
                <li
                  v-for="(item, j) in specialItems(key)"
                  :key="j"
                  class="flex gap-3"
                >
                  <span class="text-gold shrink-0">◆</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
              <NuxtLink
                :to="packageLink(key)"
                class="btn-outline mt-10 self-start"
              >
                {{ t(`packages.special.${key}.cta`) }}
              </NuxtLink>
            </article>
          </Reveal>
        </div>
      </div>
    </section>

    <!-- Add-ons checklist -->
    <section class="border-t border-white/10 bg-white/[0.02]">
      <div class="section">
        <Reveal>
          <p class="eyebrow">{{ t('packages.addons.eyebrow') }}</p>
          <h2 class="mt-2 text-3xl sm:text-4xl text-white">{{ t('packages.addons.title') }}</h2>
          <p class="mt-4 max-w-3xl font-sans text-white/60 leading-relaxed">
            {{ t('packages.addons.intro') }}
          </p>
        </Reveal>

        <div class="mt-12 grid gap-10 md:grid-cols-2">
          <Reveal
            v-for="(group, i) in addonGroups"
            :key="group"
            :delay="i * 80"
          >
            <div>
              <h3 class="text-xl text-gold-light">
                {{ t(`packages.addons.groups.${group}.title`) }}
              </h3>
              <ul class="mt-5 space-y-3 font-sans">
                <li
                  v-for="item in addonGroupItems(group)"
                  :key="item.key"
                >
                  <label class="flex cursor-pointer items-start gap-3 text-white/75 hover:text-white transition">
                    <input
                      v-model="selectedAddons"
                      type="checkbox"
                      :value="item.key"
                      class="mt-1 accent-[var(--gold)]"
                    >
                    <span>{{ item.label }}</span>
                  </label>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal :delay="200">
          <NuxtLink
            :to="customQuoteLink"
            class="btn-gold mt-12 inline-flex"
          >
            {{ t('packages.addons.cta') }}
          </NuxtLink>
        </Reveal>
      </div>
    </section>

    <section class="border-t border-white/10">
      <div class="section">
        <MenuBoard />
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

type CelebrationKey = 'gold' | 'diamond' | 'platinum'
type CorporateKey = 'seminar' | 'gala'
type SpecialKey = 'dryhire' | 'offpeak'
type AddonGroup = 'av' | 'entertainment' | 'food' | 'decor'

const celebrationKeys: CelebrationKey[] = ['gold', 'diamond', 'platinum']
const corporateKeys: CorporateKey[] = ['seminar', 'gala']
const specialKeys: SpecialKey[] = ['dryhire', 'offpeak']
const addonGroups: AddonGroup[] = ['av', 'entertainment', 'food', 'decor']

const selectedAddons = ref<string[]>([])

function asStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((item) => (typeof item === 'string' ? item : rt(item as never)))
}

function packageItems(pkg: CelebrationKey): string[] {
  return asStringList(tm(`packages.${pkg}.items` as 'packages.gold.items'))
}

function corporateItems(key: CorporateKey): string[] {
  return asStringList(tm(`packages.corporate.${key}.items` as 'packages.corporate.seminar.items'))
}

function specialItems(key: SpecialKey): string[] {
  return asStringList(tm(`packages.special.${key}.items` as 'packages.special.dryhire.items'))
}

function addonGroupItems(group: AddonGroup): Array<{ key: string; label: string }> {
  const raw = tm(`packages.addons.groups.${group}.items` as 'packages.addons.groups.av.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item, index) => {
    if (typeof item === 'string') {
      return { key: `${group}-${index}`, label: item }
    }
    const obj = item as { key?: string; label?: string }
    const label = typeof obj.label === 'string' ? obj.label : rt(obj.label as never)
    const key = typeof obj.key === 'string' ? obj.key : `${group}-${index}`
    return { key, label }
  })
}

function packageLink(pkg: string) {
  return localePath({ path: '/contact', query: { package: pkg } })
}

const customQuoteLink = computed(() => {
  const query: Record<string, string> = { package: 'custom' }
  if (selectedAddons.value.length) {
    query.addons = selectedAddons.value.join(',')
  }
  return localePath({ path: '/contact', query })
})
</script>
