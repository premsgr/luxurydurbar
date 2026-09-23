<template>
  <section class="page-banner">
    <img
      v-if="image"
      :src="image"
      :alt="title"
      class="absolute inset-0 h-full w-full object-cover opacity-35"
    />
    <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
    <div class="page-banner__inner">
      <p v-if="eyebrow" class="eyebrow mb-3">{{ eyebrow }}</p>
      <h1 class="max-w-3xl text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="mt-5 max-w-2xl font-sans text-lg text-white/65">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>

<script lang="ts">
export default { name: 'PageBanner' }
</script>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  image: { type: String, default: '' },
})
</script>
