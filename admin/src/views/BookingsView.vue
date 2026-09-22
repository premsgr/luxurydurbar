<template>
  <div>
    <div class="row" style="justify-content: space-between; margin-bottom: 1rem">
      <h1 class="page-title" style="margin: 0">Bookings</h1>
      <select v-model="status" class="select" style="width: auto" @change="load">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Hall</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in bookings" :key="b.id">
            <td>{{ b.eventDate }} {{ b.startTime }}–{{ b.endTime }}</td>
            <td>{{ b.hall?.name }}</td>
            <td>
              <RouterLink :to="`/bookings/${b.id}`">{{ b.customerName }}</RouterLink>
            </td>
            <td>{{ b.eventType }}</td>
            <td><span class="badge" :class="b.status">{{ b.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <p v-if="!bookings.length" class="muted">No bookings found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { BookingDto, BookingStatus } from '@luxurydurbar/shared'
import { api } from '../lib/api'

const bookings = ref<BookingDto[]>([])
const status = ref<BookingStatus | ''>('')

async function load() {
  const q = status.value ? `?status=${status.value}` : ''
  bookings.value = await api(`/bookings${q}`)
}

onMounted(load)
</script>
