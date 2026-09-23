<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts">
export default { name: 'AppRoot' }
</script>

<script setup lang="ts">
import { SEO_DEFAULT_DESCRIPTION, SEO_DEFAULT_TITLE } from '~/utils/seo'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'EventVenue',
        name: 'Luxury Durbar',
        description: SEO_DEFAULT_DESCRIPTION,
        url: siteUrl,
        image: `${siteUrl}/assets/front-view.jpg`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kathmandu',
          addressRegion: 'Bagmati',
          addressCountry: 'NP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 27.7172,
          longitude: 85.324,
        },
        knowsAbout: [
          'Banquet',
          'Events',
          'Parties',
          'Birthday parties',
          'Bratabandha',
          'Bartabandha',
          'Weddings',
          'Kathmandu banquet hall',
        ],
        slogan: SEO_DEFAULT_TITLE,
      }),
    },
  ],
})
</script>
