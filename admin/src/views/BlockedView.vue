<template>
  <div>
    <h1 class="page-title">Blocked slots</h1>
    <div class="card stack" style="margin-bottom: 1rem">
      <h2 style="margin: 0; font-size: 1.1rem">Block a date/time</h2>
      <div class="grid-2">
        <div>
          <label class="label">Hall</label>
          <select v-model="form.hallId" class="select">
            <option disabled value="">Select hall</option>
            <option v-for="h in halls" :key="h.id" :value="h.id">{{ h.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Date</label>
          <input v-model="form.date" type="date" class="input" />
        </div>
        <div>
          <label class="label">Start</label>
          <input v-model="form.startTime" type="time" class="input" />
        </div>
        <div>
          <label class="label">End</label>
          <input v-model="form.endTime" type="time" class="input" />
        </div>
      </div>
      <div>
        <label class="label">Reason</label>
        <input v-model="form.reason" class="input" />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="btn" type="button" @click="create">Add block</button>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Hall</th>
            <th>Reason</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in slots" :key="s.id">
            <td>{{ s.date }}</td>
            <td>{{ s.startTime }}–{{ s.endTime }}</td>
            <td>{{ s.hall?.name }}</td>
            <td>{{ s.reason || '—' }}</td>
            <td>
              <button class="btn danger" type="button" @click="remove(s.id)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!slots.length" class="muted">No blocked slots.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { BlockedSlotDto, HallDto } from '@luxurydurbar/shared'
import { api, ApiError } from '../lib/api'

const halls = ref<HallDto[]>([])
const slots = ref<BlockedSlotDto[]>([])
const error = ref('')
const form = reactive({
  hallId: '',
  date: '',
  startTime: '09:00',
  endTime: '22:00',
  reason: 'Maintenance',
})

async function load() {
  ;[halls.value, slots.value] = await Promise.all([
    api<HallDto[]>('/halls/admin/all'),
    api<BlockedSlotDto[]>('/blocked-slots'),
  ])
  if (!form.hallId && halls.value[0]) form.hallId = halls.value[0].id
}

async function create() {
  error.value = ''
  try {
    await api('/blocked-slots', { method: 'POST', json: { ...form } })
    form.reason = 'Maintenance'
    await load()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed'
  }
}

async function remove(id: string) {
  await api(`/blocked-slots/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(load)
</script>
