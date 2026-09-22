<template>
  <div class="section max-w-3xl">
    <p class="font-sans-ui text-xs uppercase tracking-[0.3em] text-[#c9a227]">Reservations</p>
    <h1 class="mt-2 text-4xl">Request a booking</h1>
    <p class="mt-4 font-sans-ui text-stone-400">
      Select a hall and date, check availability, then submit your request. No payment is required online.
    </p>

    <form class="mt-10 space-y-5" @submit.prevent="submit">
      <div>
        <label class="label">Hall</label>
        <select v-model="form.hallId" class="input" required>
          <option value="" disabled>Select a hall</option>
          <option v-for="h in halls" :key="h.id" :value="h.id">{{ h.name }} ({{ h.capacity }})</option>
        </select>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="label">Event date</label>
          <input v-model="form.eventDate" type="date" class="input" required :min="minDate" />
        </div>
        <div>
          <label class="label">Event type</label>
          <select v-model="form.eventType" class="input" required>
            <option v-for="t in eventTypes" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="label">Start time</label>
          <input v-model="form.startTime" type="time" class="input" required />
        </div>
        <div>
          <label class="label">End time</label>
          <input v-model="form.endTime" type="time" class="input" required />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <button type="button" class="btn-outline !py-2" :disabled="!canCheck" @click="checkAvailability">
          Check availability
        </button>
        <p v-if="availabilityMsg" class="font-sans-ui text-sm" :class="availabilityOk ? 'text-emerald-400' : 'text-amber-400'">
          {{ availabilityMsg }}
        </p>
      </div>
      <ul v-if="availability?.slots?.length" class="font-sans-ui text-sm text-stone-400 space-y-1">
        <li v-for="s in availability.slots" :key="`${s.startTime}-${s.endTime}`">
          {{ s.startTime }}–{{ s.endTime }}:
          <span :class="s.available ? 'text-emerald-400' : 'text-red-400'">
            {{ s.available ? 'available' : `taken (${s.reason})` }}
          </span>
        </li>
      </ul>

      <div>
        <label class="label">Guest count</label>
        <input v-model.number="form.guestCount" type="number" min="1" class="input" required />
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="label">Your name</label>
          <input v-model="form.customerName" class="input" required />
        </div>
        <div>
          <label class="label">Phone</label>
          <input v-model="form.customerPhone" class="input" required />
        </div>
      </div>
      <div>
        <label class="label">Email</label>
        <input v-model="form.customerEmail" type="email" class="input" required />
      </div>
      <div>
        <label class="label">Notes (optional)</label>
        <textarea v-model="form.notes" rows="3" class="input" />
      </div>

      <p v-if="errorMsg" class="font-sans-ui text-sm text-red-400">{{ errorMsg }}</p>
      <p v-if="successMsg" class="font-sans-ui text-sm text-emerald-400">{{ successMsg }}</p>

      <button type="submit" class="btn-gold" :disabled="submitting">
        {{ submitting ? 'Submitting…' : 'Submit booking request' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { EVENT_TYPES, type AvailabilityResponse, type HallDto } from '@luxurydurbar/shared'

useSeoMeta({
  title: 'Book — Luxury Durbar',
  description: 'Check hall availability and request a booking at Luxury Durbar.',
})

const { api } = useApi()
const route = useRoute()
const eventTypes = EVENT_TYPES
const minDate = new Date().toISOString().slice(0, 10)

const { data: halls } = await useAsyncData('book-halls', () => api<HallDto[]>('/halls'))

const form = reactive({
  hallId: '',
  eventDate: '',
  startTime: '15:00',
  endTime: '22:00',
  guestCount: 100,
  eventType: 'wedding' as (typeof EVENT_TYPES)[number],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
})

watchEffect(() => {
  if (!form.hallId && halls.value?.length) {
    const pref = String(route.query.hall || '')
    const match = halls.value.find((h) => h.slug === pref || h.id === pref)
    form.hallId = match?.id || halls.value[0]?.id || ''
  }
})

const availability = ref<AvailabilityResponse | null>(null)
const availabilityMsg = ref('')
const availabilityOk = ref(false)
const canCheck = computed(() => !!form.hallId && !!form.eventDate)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function checkAvailability() {
  availabilityMsg.value = ''
  availability.value = await api<AvailabilityResponse>(
    `/availability?hallId=${form.hallId}&date=${form.eventDate}`,
  )
  const slot = availability.value.slots.find(
    (s) => s.startTime === form.startTime && s.endTime === form.endTime,
  )
  if (slot) {
    availabilityOk.value = slot.available
    availabilityMsg.value = slot.available
      ? 'Your selected time window looks available (pending requests may still exist).'
      : `Selected window conflicts with a ${slot.reason}. You can still request — staff will review.`
  } else {
    availabilityOk.value = availability.value.available
    availabilityMsg.value = availability.value.available
      ? 'Date has open windows.'
      : 'Date appears busy — staff will advise alternatives.'
  }
}

async function submit() {
  errorMsg.value = ''
  successMsg.value = ''
  submitting.value = true
  try {
    await api('/bookings', { method: 'POST', body: { ...form } })
    successMsg.value = 'Request received! Check your email for confirmation. Our team will follow up soon.'
    form.notes = ''
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; message?: string }
    const msg = err?.data?.message
    errorMsg.value = Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Request failed'
  } finally {
    submitting.value = false
  }
}
</script>
