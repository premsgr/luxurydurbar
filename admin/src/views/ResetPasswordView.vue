<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 1.5rem">
    <form class="card stack" style="width: min(400px, 100%)" @submit.prevent="submit">
      <h1 style="margin: 0; font-size: 1.3rem">Reset password</h1>
      <div>
        <label class="label">New password</label>
        <input v-model="password" class="input" type="password" minlength="8" required />
      </div>
      <p v-if="msg" class="ok">{{ msg }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit">Update password</button>
      <RouterLink to="/login">Back to login</RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, ApiError } from '../lib/api'

const route = useRoute()
const router = useRouter()
const password = ref('')
const msg = ref('')
const error = ref('')

async function submit() {
  msg.value = ''
  error.value = ''
  try {
    await api('/auth/reset-password', {
      method: 'POST',
      json: { token: String(route.query.token || ''), password: password.value },
    })
    msg.value = 'Password updated. Redirecting…'
    setTimeout(() => router.push('/login'), 1000)
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Reset failed'
  }
}
</script>
