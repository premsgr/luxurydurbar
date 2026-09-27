<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts">
export default { name: 'AppRoot' }
</script>

<script setup lang="ts">
import {
  seoDefaultDescriptionForLocale,
  seoDefaultTitleForLocale,
} from '~/utils/seo'

const { locale } = useI18n()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
})

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang ?? (locale.value === 'ne' ? 'ne' : 'en'),
    ...(i18nHead.value.htmlAttrs?.dir
      ? { dir: i18nHead.value.htmlAttrs.dir }
      : {}),
  },
  link: [...(i18nHead.value.link || [])],
  meta: [
    ...(i18nHead.value.meta || []),
    {
      property: 'og:locale',
      content: locale.value === 'ne' ? 'ne_NP' : 'en_US',
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': ['EventVenue', 'LocalBusiness'],
        name: 'Luxury Durbar',
        description: seoDefaultDescriptionForLocale(locale.value),
        url: siteUrl,
        image: `${siteUrl}/assets/front-view.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sitapaila',
          addressLocality: 'Kathmandu',
          addressRegion: 'Bagmati',
          addressCountry: 'NP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.7265,
          longitude: 85.2858,
        },
        areaServed: {
          '@type': 'Place',
          name: 'Sitapaila, Kathmandu, Nepal',
        },
        knowsAbout: [
          'Banquet hall',
          'Party palace',
          'Weddings',
          'Marriage banquets',
          'Birthday parties',
          'Anniversaries',
          'Business events',
          'Corporate events',
          'Bratabandha',
          'Bartabandha',
          'Annaprashan',
          'Festival events',
          'Sitapaila banquet hall',
          'Kathmandu banquet hall',
        ],
        slogan: seoDefaultTitleForLocale(locale.value),
      }),
    },
  ],
}))
</script>
