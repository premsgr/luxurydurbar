<template>
  <div style="min-height: 100vh; display: grid; place-items: center; padding: 1.5rem">
    <form class="card stack" style="width: min(400px, 100%)" @submit.prevent="submit">
      <div>
        <h1 style="margin: 0; font-size: 1.4rem">Staff login</h1>
        <p class="muted" style="margin: 0.4rem 0 0">Luxury Durbar admin</p>
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="email" class="input" type="email" required />
      </div>
      <div>
        <label class="label">Password</label>
        <input v-model="password" class="input" type="password" required />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
      <RouterLink to="/forgot-password" class="muted" style="font-size: 0.9rem">
        Forgot password?
      </RouterLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ApiError } from '../lib/api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('admin@luxurydurbar.local')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
