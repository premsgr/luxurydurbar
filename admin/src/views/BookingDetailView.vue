<template>
  <div v-if="booking">
    <div class="row" style="justify-content: space-between; margin-bottom: 1rem">
      <h1 class="page-title" style="margin: 0">Booking detail</h1>
      <RouterLink to="/bookings">← Back</RouterLink>
    </div>

    <div class="card stack">
      <div class="row">
        <span class="badge" :class="booking.status">{{ booking.status }}</span>
        <span class="muted">{{ booking.eventType }}</span>
      </div>
      <div class="grid-2">
        <div>
          <div class="muted">Hall</div>
          <strong>{{ booking.hall?.name }}</strong>
        </div>
        <div>
          <div class="muted">When</div>
          <strong>{{ booking.eventDate }} · {{ booking.startTime }}–{{ booking.endTime }}</strong>
        </div>
        <div>
          <div class="muted">Customer</div>
          <strong>{{ booking.customerName }}</strong>
          <div class="muted">{{ booking.customerEmail }} · {{ booking.customerPhone }}</div>
        </div>
        <div>
          <div class="muted">Guests</div>
          <strong>{{ booking.guestCount }}</strong>
        </div>
      </div>
      <p v-if="booking.notes"><span class="muted">Notes:</span> {{ booking.notes }}</p>

      <p v-if="booking.conflict?.conflict" class="error">
        Conflict with existing {{ booking.conflict.reason }} — confirm carefully or reject.
      </p>

      <div class="row" v-if="booking.status === 'pending'">
        <button class="btn" type="button" :disabled="busy" @click="setStatus('confirmed')">
          Confirm
        </button>
        <button class="btn danger" type="button" :disabled="busy" @click="setStatus('rejected')">
          Reject
        </button>
      </div>
      <div class="row" v-else-if="booking.status === 'confirmed'">
        <button class="btn secondary" type="button" :disabled="busy" @click="setStatus('cancelled')">
          Cancel booking
        </button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="msg" class="ok">{{ msg }}</p>
    </div>
  </div>
  <p v-else class="muted">Loading…</p>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { BookingDto, BookingStatus } from '@luxurydurbar/shared'
import { api, ApiError } from '../lib/api'

type Detail = BookingDto & {
  conflict?: { conflict: boolean; reason?: string }
}

const route = useRoute()
const booking = ref<Detail | null>(null)
const busy = ref(false)
const error = ref('')
const msg = ref('')

async function load() {
  booking.value = await api(`/bookings/${route.params.id}`)
}

async function setStatus(status: BookingStatus) {
  error.value = ''
  msg.value = ''
  busy.value = true
  try {
    booking.value = await api(`/bookings/${route.params.id}/status`, {
      method: 'PATCH',
      json: { status },
    })
    msg.value = `Status updated to ${status}`
    await load()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Update failed'
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>
