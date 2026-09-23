<template>
  <div class="inline-flex items-center rounded-sm border border-white/20 overflow-hidden font-sans text-xs uppercase tracking-wider">
    <NuxtLink
      :to="switchLocalePath('en')"
      class="px-2.5 py-1.5 transition"
      :class="locale === 'en' ? 'bg-gold text-ink' : 'text-white/70 hover:text-gold-light'"
    >
      EN
    </NuxtLink>
    <NuxtLink
      :to="switchLocalePath('ne')"
      class="px-2.5 py-1.5 transition"
      :class="locale === 'ne' ? 'bg-gold text-ink' : 'text-white/70 hover:text-gold-light'"
    >
      नेपाली
    </NuxtLink>
  </div>
</template>

<script lang="ts">
export default { name: 'LanguageSwitcher' }
</script>

<script setup lang="ts">
const { locale } = useI18n()
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
