<template>
  <div class="min-h-screen flex flex-col bg-ink text-white">
    <header class="site-header" :class="{ 'is-scrolled': scrolled || open }">
      <div class="site-header__inner mx-auto flex max-w-[110rem] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-10">
        <NuxtLinkLocale to="/" class="site-header__brand group flex items-center min-w-0">
          <img
            :src="PHOTOS.logo"
            alt="Luxury Durbar"
            class="site-header__logo rounded-sm object-cover border border-gold/40 shrink-0"
          />
          <div class="site-header__titles min-w-0 shrink">
            <div class="site-header__name tracking-brand uppercase text-gold-light whitespace-nowrap">
              {{ t('brand.name') }}
            </div>
            <div class="site-header__tagline font-sans uppercase tracking-label text-white/45 whitespace-nowrap">
              {{ t('brand.tagline') }}
            </div>
          </div>
        </NuxtLinkLocale>

        <nav class="site-header__nav hidden items-center font-semibold uppercase tracking-wider text-white/90 min-[1500px]:flex">
          <NuxtLinkLocale
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            active-class="nav-link--active"
          >
            {{ t(item.label) }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/contact" class="btn-gold site-header__cta">
            {{ t('nav.bookTour') }}
          </NuxtLinkLocale>
          <LanguageSwitcher />
        </nav>

        <div class="flex items-center gap-2 sm:gap-3 min-[1500px]:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            class="header-menu-btn"
            :aria-expanded="open"
            :aria-label="open ? t('nav.close') : t('nav.menu')"
            @click="open = !open"
          >
            <span class="header-menu-btn__icon" :class="{ 'is-open': open }" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div v-if="open" class="site-header__drawer border-t border-white/10 px-4 py-5 min-[1500px]:hidden font-sans">
        <div class="flex flex-col items-center gap-4 text-center text-lg font-semibold uppercase tracking-wider text-white/90">
          <NuxtLinkLocale
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-link nav-link--mobile"
            @click="open = false"
          >
            {{ t(item.label) }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/contact" class="btn-gold !py-2.5" @click="open = false">
            {{ t('nav.bookTour') }}
          </NuxtLinkLocale>
        </div>
      </div>
    </header>

    <main class="site-main">
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
      <div class="section !py-10 grid gap-10 md:grid-cols-3 font-sans text-sm text-white/55">
        <div>
          <NuxtLinkLocale to="/" class="inline-block mb-4">
            <img
              :src="PHOTOS.logo"
              alt="Luxury Durbar"
              class="footer-logo rounded-sm object-cover border border-gold/40"
            />
          </NuxtLinkLocale>
          <p>{{ t('footer.blurb') }}</p>
        </div>
        <div>
          <div class="text-white mb-2">{{ t('footer.visit') }}</div>
          <p class="whitespace-pre-line">{{ t('footer.location') }}</p>
          <p class="mt-2 text-white/40">{{ t('footer.hours') }}</p>
        </div>
        <div class="md:text-right">
          <div class="text-white mb-2">{{ t('footer.contact') }}</div>
          <p>
            <a :href="`tel:${footerPhone}`" class="hover:text-gold-light transition">
              {{ t('footer.phone') }}
            </a>
          </p>
          <p class="mt-1">
            <a :href="`mailto:${footerEmail}`" class="hover:text-gold-light transition">
              {{ t('footer.email') }}
            </a>
          </p>
          <ul class="footer-social mt-6 md:justify-end">
            <li v-for="item in socialLinks" :key="item.key">
              <a
                :href="item.href"
                class="footer-social__link"
                :aria-label="t(`footer.social.${item.key}`)"
                :target="item.href.startsWith('http') ? '_blank' : undefined"
                :rel="item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                <span class="footer-social__icon" v-html="item.icon" />
              </a>
            </li>
          </ul>
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
const scrolled = ref(false)
const year = new Date().getFullYear()
const footerEmail = 'hello@luxurydurbar.local'
const footerPhone = '+977-1-0000000'

const navItems = [
  { to: '/', label: 'nav.home' },
  { to: '/halls', label: 'nav.venues' },
  { to: '/packages', label: 'nav.packages' },
  { to: '/gallery', label: 'nav.gallery' },
  { to: '/contact', label: 'nav.contact' },
]

const socialLinks = [
  {
    key: 'facebook',
    href: 'https://www.facebook.com/luxurydurbar',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.84c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.19 2.12.19v2.34h-1.2c-1.18 0-1.55.74-1.55 1.49v1.78h2.64l-.42 2.9h-2.22v7.03c4.78-.75 8.44-4.91 8.44-9.93z"/></svg>',
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/luxurydurbar',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#ig)" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2zm5.35-3.45a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15z"/></svg>',
  },
  {
    key: 'twitter',
    href: 'https://x.com/luxurydurbar',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1DA1F2" d="M18.9 2H22l-7.1 8.1L23 22h-6.3l-4.9-6.4L6.1 22H3l7.6-8.7L1 2h6.5l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z"/></svg>',
  },
  {
    key: 'tiktok',
    href: 'https://www.tiktok.com/@luxurydurbar',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25F4EE" d="M16.5 2.2c.4 2.3 1.8 3.9 4 4.3v2.7c-1.4 0-2.7-.4-4-1.1v6.2A6.5 6.5 0 1 1 10 8.1c.3 0 .6 0 .9.1v2.8a3.5 3.5 0 1 0 2.4 3.3V2.2h3.2z"/><path fill="#FE2C55" d="M15.7 1.4c.4 2.3 1.8 3.9 4 4.3v2.7c-1.4 0-2.7-.4-4-1.1v6.2a6.5 6.5 0 1 1-6.5-6.5c.3 0 .6 0 .9.1v2.8a3.5 3.5 0 1 0 2.4 3.3V1.4h3.2z"/><path fill="#111111" d="M16.1 1.8c.4 2.3 1.8 3.9 4 4.3v2.7c-1.4 0-2.7-.4-4-1.1v6.2a6.5 6.5 0 1 1-6.5-6.5c.3 0 .6 0 .9.1v2.8a3.5 3.5 0 1 0 2.4 3.3V1.8h3.2z"/></svg>',
  },
  {
    key: 'whatsapp',
    href: 'https://wa.me/97710000000',
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#25D366" d="M12 2a9.9 9.9 0 0 0-8.6 14.8L2 22l5.4-1.4A9.9 9.9 0 1 0 12 2zm0 1.8a8.1 8.1 0 0 1 6.8 12.3l-.3.5.8 3-3.1-.8-.5.3A8.1 8.1 0 0 1 12 3.8zm-2.9 3.6c.2 0 .5 0 .7.6l.9 2.2c.1.3 0 .5-.2.7l-.4.5c-.1.2-.3.4 0 .7.4.6 1.3 1.7 2.7 2.4 1.1.6 1.4.5 1.7.4l1-.5c.2-.1.5-.1.7 0l2.1 1c.3.1.4.3.4.6 0 .8-.5 2.3-2.2 2.5-.5.1-1.7.2-4.1-.9-2.8-1.4-4.6-4.6-4.8-4.8-.2-.2-1.5-2-1.5-3.8 0-1.8.9-2.7 1.3-3 .3-.3.7-.3.9-.3z"/></svg>',
  },
  {
    key: 'gmail',
    href: `mailto:${footerEmail}`,
    icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M3 6.5 12 13l9-6.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6.5z"/><path fill="#4285F4" d="M21 6.5 12 13 3 6.5V6a2 2 0 0 1 2-2h1.2L12 9.2 17.8 4H19a2 2 0 0 1 2 2v.5z"/><path fill="#34A853" d="M3 6.5V18a2 2 0 0 0 .6 1.4L9 13.2 3 6.5z"/><path fill="#FBBC05" d="M21 6.5V18a2 2 0 0 1-.6 1.4L15 13.2 21 6.5z"/><path fill="#C5221F" d="M3 6.5 12 13l9-6.5L12 4 3 6.5z" opacity=".35"/></svg>',
  },
] as const

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 40
  }
  const onResize = () => {
    if (window.innerWidth >= 1500) open.value = false
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
  })
})
</script>
