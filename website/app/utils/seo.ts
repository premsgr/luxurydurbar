/** Shared SEO keywords for Kathmandu / Sitapaila banquet venue discovery */
export const SEO_KEYWORDS_EN =
  'banquet hall Sitapaila, party palace Kathmandu, banquet Kathmandu, wedding venue Nepal, Bratabandha Kathmandu, Annaprashan Nepal, birthday party venue Kathmandu, anniversary venue Kathmandu, corporate events Kathmandu, festival events Nepal, Luxury Durbar'

export const SEO_KEYWORDS_NE =
  'भोज हल सितापाइला, पार्टी प्यालेस काठमाडौं, विवाह हल काठमाडौं, ब्रतबन्ध सितापाइला, अन्नप्राशन काठमाडौं, जन्मदिन पार्टी काठमाडौं, वर्षगाँठ स्थल, व्यापारिक कार्यक्रम काठमाडौं, चाडपर्व कार्यक्रम नेपाल, Luxury Durbar'

/** @deprecated Prefer seoKeywordsForLocale — kept for any remaining imports */
export const SEO_KEYWORDS = SEO_KEYWORDS_EN

export const SEO_DEFAULT_TITLE =
  'Luxury Durbar — Banquet Hall & Party Palace in Sitapaila, Kathmandu'

export const SEO_DEFAULT_DESCRIPTION =
  'Luxury Durbar is a premium banquet hall and party palace in Sitapaila, Kathmandu, Nepal for weddings, birthdays, anniversaries, business events, Bratabandha, Annaprashan, and festival celebrations.'

export const SEO_DEFAULT_TITLE_NE =
  'Luxury Durbar — सितापाइला, काठमाडौंमा भोज हल तथा पार्टी प्यालेस'

export const SEO_DEFAULT_DESCRIPTION_NE =
  'Luxury Durbar सितापाइला, काठमाडौंको प्रिमियम भोज हल तथा पार्टी प्यालेस हो — विवाह, जन्मदिन, वर्षगाँठ, व्यापारिक कार्यक्रम, ब्रतबन्ध, अन्नप्राशन र चाडपर्व उत्सवका लागि।'

export function seoKeywordsForLocale(locale: string): string {
  return locale === 'ne' ? SEO_KEYWORDS_NE : SEO_KEYWORDS_EN
}

export function seoDefaultTitleForLocale(locale: string): string {
  return locale === 'ne' ? SEO_DEFAULT_TITLE_NE : SEO_DEFAULT_TITLE
}

export function seoDefaultDescriptionForLocale(locale: string): string {
  return locale === 'ne' ? SEO_DEFAULT_DESCRIPTION_NE : SEO_DEFAULT_DESCRIPTION
}
