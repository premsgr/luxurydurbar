<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-stone-800/80 bg-stone-950/90 backdrop-blur sticky top-0 z-50">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <NuxtLink to="/" class="group flex items-center gap-3">
          <span class="text-2xl text-[#c9a227]">◆</span>
          <div>
            <div class="text-lg tracking-[0.2em] uppercase text-[#e8d48b]">Luxury Durbar</div>
            <div class="font-sans-ui text-[10px] uppercase tracking-[0.3em] text-stone-500">Banquet & Events</div>
          </div>
        </NuxtLink>
        <nav class="hidden items-center gap-8 font-sans-ui text-sm uppercase tracking-wider text-stone-300 md:flex">
          <NuxtLink to="/halls" class="hover:text-[#e8d48b]">Halls</NuxtLink>
          <NuxtLink to="/gallery" class="hover:text-[#e8d48b]">Gallery</NuxtLink>
          <NuxtLink to="/book" class="hover:text-[#e8d48b]">Book</NuxtLink>
          <NuxtLink to="/about" class="hover:text-[#e8d48b]">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-[#e8d48b]">Contact</NuxtLink>
          <NuxtLink to="/book" class="btn-gold !py-2 !px-4 !text-xs">Request booking</NuxtLink>
        </nav>
        <button type="button" class="md:hidden font-sans-ui text-sm text-[#e8d48b]" @click="open = !open">
          Menu
        </button>
      </div>
      <div v-if="open" class="border-t border-stone-800 px-4 py-4 md:hidden font-sans-ui">
        <div class="flex flex-col gap-3 text-sm uppercase tracking-wider">
          <NuxtLink to="/halls" @click="open = false">Halls</NuxtLink>
          <NuxtLink to="/gallery" @click="open = false">Gallery</NuxtLink>
          <NuxtLink to="/book" @click="open = false">Book</NuxtLink>
          <NuxtLink to="/about" @click="open = false">About</NuxtLink>
          <NuxtLink to="/contact" @click="open = false">Contact</NuxtLink>
        </div>
      </div>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-stone-800 bg-stone-950">
      <div class="section !py-10 grid gap-8 md:grid-cols-3 font-sans-ui text-sm text-stone-400">
        <div>
          <div class="text-[#e8d48b] tracking-widest uppercase mb-2">Luxury Durbar</div>
          <p>A grand banquet destination for weddings, receptions, and unforgettable celebrations.</p>
        </div>
        <div>
          <div class="text-stone-200 mb-2">Visit</div>
          <p>Kathmandu Valley<br />Nepal</p>
        </div>
        <div>
          <div class="text-stone-200 mb-2">Contact</div>
          <p>+977-1-0000000<br />hello@luxurydurbar.local</p>
        </div>
      </div>
      <div class="border-t border-stone-900 py-4 text-center font-sans-ui text-xs text-stone-600">
        © {{ year }} Luxury Durbar. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const open = ref(false)
const year = new Date().getFullYear()
</script>
