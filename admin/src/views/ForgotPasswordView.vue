<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 1.5rem">
    <form class="card stack" style="width: min(400px, 100%)" @submit.prevent="submit">
      <h1 style="margin: 0; font-size: 1.3rem">Forgot password</h1>
      <p class="muted">We'll email a reset link (visible in Mailpit locally).</p>
      <div>
        <label class="label">Email</label>
        <input v-model="email" class="input" type="email" required />
      </div>
      <p v-if="msg" class="ok">{{ msg }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit">Send reset link</button>
      <RouterLink to="/login">Back to login</RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api, ApiError } from '../lib/api'

const email = ref('')
const msg = ref('')
const error = ref('')

async function submit() {
  msg.value = ''
  error.value = ''
  try {
    await api('/auth/forgot-password', { method: 'POST', json: { email: email.value } })
    msg.value = 'If that account exists, a reset email was sent.'
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Request failed'
  }
}
</script>
