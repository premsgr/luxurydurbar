<template>
  <div
    class="lang-switch inline-flex items-center rounded-sm border border-white/20 overflow-hidden"
    role="group"
    :aria-label="t('nav.language')"
  >
    <NuxtLink
      :to="switchLocalePath('en')"
      class="lang-switch__btn"
      :class="locale === 'en' ? 'is-active' : ''"
      :aria-label="t('nav.langEn')"
      :title="t('nav.langEn')"
    >
      <img
        src="/assets/flags/gb.svg"
        alt=""
        class="lang-switch__flag lang-switch__flag--uk"
        width="22"
        height="15"
        aria-hidden="true"
      >
      <span class="lang-switch__code hidden sm:inline">EN</span>
    </NuxtLink>
    <NuxtLink
      :to="switchLocalePath('ne')"
      class="lang-switch__btn"
      :class="locale === 'ne' ? 'is-active' : ''"
      :aria-label="t('nav.langNe')"
      :title="t('nav.langNe')"
    >
      <img
        src="/assets/flags/np.svg"
        alt=""
        class="lang-switch__flag lang-switch__flag--np"
        width="16"
        height="20"
        aria-hidden="true"
      >
      <span class="lang-switch__code hidden sm:inline">NE</span>
    </NuxtLink>
  </div>
</template>

<script lang="ts">
export default { name: 'LanguageSwitcher' }
</script>

<script setup lang="ts">
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

watch(
  locale,
  (code) => {
    if (import.meta.client) {
      document.documentElement.lang = code === 'ne' ? 'ne' : 'en'
    }
  },
  { immediate: true },
)
</script>
