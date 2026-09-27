<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <div class="grid-2" style="margin-bottom: 1.5rem">
      <div class="card">
        <div class="muted">Pending requests</div>
        <div style="font-size: 2rem; font-weight: 700; margin-top: 0.35rem">
          {{ data?.pendingCount ?? '—' }}
        </div>
      </div>
      <div class="card">
        <div class="muted">Today's events</div>
        <div style="font-size: 2rem; font-weight: 700; margin-top: 0.35rem">
          {{ data?.todaysEvents.length ?? '—' }}
        </div>
      </div>
    </div>

    <div class="card">
      <DashboardCalendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BookingDto } from '@luxurydurbar/shared'
import { api } from '../lib/api'
import DashboardCalendar from '../components/DashboardCalendar.vue'

const data = ref<{ pendingCount: number; todaysEvents: BookingDto[] } | null>(null)

onMounted(async () => {
  data.value = await api('/bookings/dashboard')
})
</script>
