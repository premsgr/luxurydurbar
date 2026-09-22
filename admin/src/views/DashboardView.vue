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
      <h2 style="margin-top: 0">Today</h2>
      <p v-if="!data?.todaysEvents.length" class="muted">No events scheduled today.</p>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Hall</th>
            <th>Customer</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in data.todaysEvents" :key="b.id">
            <td>{{ b.startTime }}–{{ b.endTime }}</td>
            <td>{{ b.hall?.name }}</td>
            <td>
              <RouterLink :to="`/bookings/${b.id}`">{{ b.customerName }}</RouterLink>
            </td>
            <td><span class="badge" :class="b.status">{{ b.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BookingDto } from '@luxurydurbar/shared'
import { api } from '../lib/api'

const data = ref<{ pendingCount: number; todaysEvents: BookingDto[] } | null>(null)

onMounted(async () => {
  data.value = await api('/bookings/dashboard')
})
</script>
