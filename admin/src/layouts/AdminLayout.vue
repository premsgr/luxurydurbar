<template>
  <div class="layout">
    <aside class="sidebar">
      <h1>Luxury Durbar</h1>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/bookings">Bookings</RouterLink>
        <RouterLink to="/calendar">Calendar</RouterLink>
        <RouterLink to="/halls">Halls</RouterLink>
        <RouterLink to="/blocked">Blocked slots</RouterLink>
      </nav>
      <div style="margin-top: 2rem">
        <p class="muted" style="font-size: 0.85rem; margin: 0 0 0.5rem">
          {{ auth.user?.name }}
        </p>
        <button class="btn secondary" type="button" @click="onLogout">Logout</button>
      </div>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>
