<template>
  <div>
    <div class="row" style="justify-content: space-between; margin-bottom: 1rem">
      <h1 class="page-title" style="margin: 0">Calendar</h1>
      <div class="row">
        <input v-model="from" type="date" class="input" style="width: auto" @change="load" />
        <span class="muted">to</span>
        <input v-model="to" type="date" class="input" style="width: auto" @change="load" />
      </div>
    </div>
    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Hall</th>
            <th>Title</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="`${item.type}-${item.id}`">
            <td>{{ item.date }}</td>
            <td>{{ item.startTime }}–{{ item.endTime }}</td>
            <td>{{ item.hallName }}</td>
            <td>
              <RouterLink v-if="item.type === 'booking'" :to="`/bookings/${item.id}`">
                {{ item.title }}
              </RouterLink>
              <span v-else>{{ item.title }}</span>
            </td>
            <td>
              <span v-if="item.type === 'blocked'" class="badge blocked">blocked</span>
              <span v-else class="badge" :class="item.status">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!items.length" class="muted">Nothing in this range.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { CalendarItem } from '@luxurydurbar/shared'
import { api } from '../lib/api'

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

const start = new Date()
const end = new Date()
end.setDate(end.getDate() + 45)

const from = ref(iso(start))
const to = ref(iso(end))
const items = ref<CalendarItem[]>([])

async function load() {
  items.value = await api(`/bookings/calendar?from=${from.value}&to=${to.value}`)
}

onMounted(load)
</script>
