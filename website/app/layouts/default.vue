<template>
  <div class="min-h-screen flex flex-col bg-ink text-white">
    <header class="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div class="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <NuxtLinkLocale to="/" class="group flex items-center gap-4 min-w-0">
          <img
            :src="PHOTOS.logo"
            alt="Luxury Durbar"
            class="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] rounded-sm object-cover border border-gold/40"
          />
          <div class="min-w-0 shrink">
            <div class="text-xl tracking-brand uppercase text-gold-light sm:text-2xl whitespace-nowrap">
              {{ t('brand.name') }}
            </div>
            <div class="font-sans text-[11px] uppercase tracking-label text-white/40 sm:text-xs whitespace-nowrap">
              {{ t('brand.tagline') }}
            </div>
          </div>
        </NuxtLinkLocale>

        <nav class="hidden items-center gap-8 font-sans text-base uppercase tracking-wider text-white/70 xl:flex">
          <NuxtLinkLocale
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            active-class="nav-link--active"
          >
            {{ t(item.label) }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/contact" class="btn-gold !py-2.5 !px-5 !text-sm">
            {{ t('nav.bookTour') }}
          </NuxtLinkLocale>
          <LanguageSwitcher />
        </nav>

        <div class="flex items-center gap-3 xl:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            class="font-sans text-base uppercase tracking-wider text-gold-light"
            @click="open = !open"
          >
            {{ open ? t('nav.close') : t('nav.menu') }}
          </button>
        </div>
      </div>

      <div v-if="open" class="border-t border-white/10 px-4 py-5 xl:hidden font-sans">
        <div class="flex flex-col gap-4 text-base uppercase tracking-wider text-white/80">
          <NuxtLinkLocale
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link nav-link--mobile"
            @click="open = false"
          >
            {{ t(item.label) }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/contact" class="btn-gold !py-2.5 self-start" @click="open = false">
            {{ t('nav.bookTour') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-white/10 bg-ink">
      <div class="section !py-14 border-b border-white/10 text-center">
        <h2 class="text-3xl sm:text-4xl text-white">{{ t('footer.ctaTitle') }}</h2>
        <p class="mt-3 font-sans text-white/60">{{ t('footer.ctaSub') }}</p>
        <NuxtLinkLocale to="/contact" class="btn-gold mt-8 inline-flex">
          {{ t('footer.ctaButton') }}
        </NuxtLinkLocale>
      </div>
      <div class="section !py-10 grid gap-8 md:grid-cols-3 font-sans text-sm text-white/55">
        <div>
          <div class="text-gold-light tracking-widest uppercase mb-2">{{ t('brand.name') }}</div>
          <p>{{ t('footer.blurb') }}</p>
        </div>
        <div>
          <div class="text-white mb-2">{{ t('footer.visit') }}</div>
          <p class="whitespace-pre-line">{{ t('footer.location') }}</p>
          <p class="mt-2 text-white/40">{{ t('footer.hours') }}</p>
        </div>
        <div>
          <div class="text-white mb-2">{{ t('footer.contact') }}</div>
          <p>{{ t('footer.phone') }}</p>
          <p>{{ t('footer.email') }}</p>
        </div>
      </div>
      <div class="border-t border-white/5 py-4 text-center font-sans text-xs text-white/35">
        {{ t('footer.rights', { year }) }}
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
export default { name: 'DefaultLayout' }
</script>

<script setup lang="ts">
import { PHOTOS } from '~/utils/photos'

const { t } = useI18n()
const open = ref(false)
const year = new Date().getFullYear()

const navItems = [
  { to: '/', label: 'nav.home' },
  { to: '/halls', label: 'nav.venues' },
  { to: '/packages', label: 'nav.packages' },
  { to: '/gallery', label: 'nav.gallery' },
  { to: '/about', label: 'nav.about' },
  { to: '/contact', label: 'nav.contact' },
]
</script>
