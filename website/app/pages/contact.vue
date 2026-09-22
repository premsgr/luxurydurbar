<template>
  <div class="section max-w-2xl">
    <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Get in touch</p>
    <h1 class="mt-2 text-4xl">Contact</h1>
    <p class="mt-4 font-sans-ui text-stone-400">
      Prefer to talk first? Send a message or call us. For hall dates, use the
      <NuxtLink to="/book" class="text-[#e8d48b] underline">booking form</NuxtLink>.
    </p>

    <div class="mt-8 grid gap-4 font-sans-ui text-stone-300">
      <p><span class="text-stone-500">Phone:</span> +977-1-0000000</p>
      <p><span class="text-stone-500">Email:</span> hello@luxurydurbar.local</p>
      <p><span class="text-stone-500">Location:</span> Kathmandu Valley, Nepal</p>
    </div>

    <form class="mt-10 space-y-5" @submit.prevent="sent = true">
      <div>
        <label class="label">Name</label>
        <input v-model="name" class="input" required />
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>
      <div>
        <label class="label">Message</label>
        <textarea v-model="message" rows="4" class="input" required />
      </div>
      <p v-if="sent" class="font-sans-ui text-sm text-emerald-400">
        Thanks — for a confirmed date, please also submit a booking request.
      </p>
      <button type="submit" class="btn-gold">Send message</button>
    </form>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Contact — Luxury Durbar',
  description: 'Contact Luxury Durbar for banquet inquiries and event planning.',
})

const name = ref('')
const email = ref('')
const message = ref('')
const sent = ref(false)
</script>
