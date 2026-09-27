<template>
  <div>
    <PageBanner
      :title="t('events.banner.title')"
      :subtitle="t('events.banner.subtitle')"
      :eyebrow="t('events.banner.eyebrow')"
      :image="PHOTOS.hallAlt"
    />

    <section class="section">
      <Reveal>
        <p class="eyebrow">{{ t('events.intro.eyebrow') }}</p>
        <p class="mt-4 max-w-3xl font-sans text-lg text-white/70 leading-relaxed">
          {{ t('events.intro.text') }}
        </p>
      </Reveal>

      <div class="mt-14 highlight-grid events-grid">
        <Reveal
          v-for="(key, i) in eventKeys"
          :key="key"
          :delay="i * 60"
        >
          <article
            :id="key"
            class="highlight-card ornament-card border border-white/10 bg-white/[0.03] p-6 scroll-mt-28"
          >
            <CardOrnament />
            <div class="text-gold text-xl mb-3">◆</div>
            <h2 class="text-xl sm:text-2xl text-gold-light tracking-wide">
              {{ t(`events.types.${key}.title`) }}
            </h2>
            <p
              v-if="te(`events.types.${key}.timing`)"
              class="mt-2 font-sans text-xs uppercase tracking-wider text-gold/80"
            >
              {{ t(`events.types.${key}.timing`) }}
            </p>
            <p class="mt-4 font-sans text-sm text-white/60 leading-relaxed">
              {{ t(`events.types.${key}.text`) }}
            </p>

            <template v-if="key === 'childhood'">
              <div class="mt-5 space-y-4 border-t border-white/10 pt-4">
                <div>
                  <h3 class="text-sm text-gold-light tracking-wide">
                    {{ t('events.types.childhood.girlsTitle') }}
                  </h3>
                  <p class="mt-2 font-sans text-sm text-white/55 leading-relaxed">
                    {{ t('events.types.childhood.girlsText') }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm text-gold-light tracking-wide">
                    {{ t('events.types.childhood.boysTitle') }}
                  </h3>
                  <p class="mt-2 font-sans text-sm text-white/55 leading-relaxed">
                    {{ t('events.types.childhood.boysText') }}
                  </p>
                </div>
              </div>
            </template>

            <template v-if="key === 'janku'">
              <ul class="mt-5 space-y-2 border-t border-white/10 pt-4 font-sans text-sm text-white/55 leading-relaxed">
                <li
                  v-for="(stage, si) in jankuStages"
                  :key="si"
                  class="flex gap-2"
                >
                  <span class="text-gold shrink-0">◆</span>
                  <span>{{ stage }}</span>
                </li>
              </ul>
            </template>
          </article>
        </Reveal>
      </div>
    </section>

    <section class="border-t border-white/10 bg-white/[0.02]">
      <div class="section text-center !py-20">
        <Reveal>
          <h2 class="text-3xl sm:text-4xl text-white tracking-wide">
            {{ t('events.cta.title') }}
          </h2>
          <p class="mt-4 font-sans text-white/60">{{ t('events.cta.sub') }}</p>
          <NuxtLinkLocale to="/contact" class="btn-gold mt-8 inline-flex">
            {{ t('events.cta.button') }}
          </NuxtLinkLocale>
        </Reveal>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'EventsPage' }
</script>

<script setup lang="ts">
import { PHOTOS } from '~/utils/photos'

const { t, te, tm, rt } = useI18n()

const eventKeys = [
  'machabu',
  'pasni',
  'childhood',
  'bahra',
  'weddings',
  'janku',
  'birthdays',
  'anniversaries',
  'business',
  'festivals',
  'other',
] as const

const jankuStages = computed(() => {
  const raw = tm('events.types.janku.stages')
  if (!Array.isArray(raw)) return []
  return raw.map((item) => (typeof item === 'string' ? item : rt(item as string)))
})

useSiteSeo({
  titleKey: 'events.seoTitle',
  descriptionKey: 'events.seoDesc',
  image: PHOTOS.hallAlt,
})
</script>
