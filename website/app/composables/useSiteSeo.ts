import { PHOTOS } from '~/utils/photos'
import { seoKeywordsForLocale } from '~/utils/seo'

type SiteSeoOptions = {
  titleKey: string
  descriptionKey: string
  image?: string
  twitterCard?: boolean
}

/** Shared per-page SEO meta with locale-aware keywords. */
export function useSiteSeo(options: SiteSeoOptions) {
  const { t, locale } = useI18n()
  const config = useRuntimeConfig()
  const imagePath = options.image ?? PHOTOS.hero

  useSeoMeta({
    title: () => t(options.titleKey),
    description: () => t(options.descriptionKey),
    ogTitle: () => t(options.titleKey),
    ogDescription: () => t(options.descriptionKey),
    ogImage: () => `${config.public.siteUrl}${imagePath}`,
    ...(options.twitterCard !== false
      ? { twitterCard: 'summary_large_image' as const }
      : {}),
  })

  useHead(() => ({
    meta: [
      {
        name: 'keywords',
        content: seoKeywordsForLocale(locale.value),
      },
    ],
  }))
}
