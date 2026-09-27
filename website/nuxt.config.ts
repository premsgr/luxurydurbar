// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.ts',
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:33000',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:33001',
    },
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'ne', language: 'ne-NP', name: 'नेपाली', file: 'ne.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:33001',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'ld_locale',
      redirectOn: 'root',
    },
  },
  app: {
    head: {
      title: 'Luxury Durbar — Banquet Hall & Party Palace in Sitapaila, Kathmandu',
      meta: [
        {
          name: 'description',
          content:
            'Luxury Durbar is a premium banquet hall and party palace in Sitapaila, Kathmandu, Nepal for weddings, birthdays, anniversaries, business events, Bratabandha, Annaprashan, and festival celebrations.',
        },
        {
          name: 'keywords',
          content:
            'banquet hall Sitapaila, party palace Kathmandu, wedding venue Nepal, Bratabandha Kathmandu, Annaprashan Nepal, birthday party venue Kathmandu, anniversary venue Kathmandu, corporate events Kathmandu, Luxury Durbar',
        },
        { name: 'robots', content: 'index, follow' },
        { name: 'geo.region', content: 'NP-P3' },
        { name: 'geo.placename', content: 'Sitapaila, Kathmandu' },
        { name: 'author', content: 'Luxury Durbar' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        {
          property: 'og:title',
          content:
            'Luxury Durbar — Banquet Hall & Party Palace in Sitapaila, Kathmandu',
        },
        {
          property: 'og:description',
          content:
            'Premium banquet venue in Sitapaila, Kathmandu for weddings, parties, Bratabandha, Annaprashan, and every celebration.',
        },
        { property: 'og:image', content: '/assets/front-view.jpg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content:
            'Luxury Durbar — Banquet Hall & Party Palace in Sitapaila, Kathmandu',
        },
        {
          name: 'twitter:description',
          content:
            'Premium banquet venue in Sitapaila, Kathmandu for weddings, parties, Bratabandha, Annaprashan, and every celebration.',
        },
        { name: 'twitter:image', content: '/assets/front-view.jpg' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },
})
