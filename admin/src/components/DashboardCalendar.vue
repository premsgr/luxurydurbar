<template>
  <div class="dash-cal">
    <div class="dash-cal__header">
      <div>
        <h2 class="dash-cal__title">Occupancy</h2>
        <p class="muted" style="margin: 0.25rem 0 0; font-size: 0.9rem">
          Click a day to see halls, bookings, and customer notes.
        </p>
      </div>
      <div class="row">
        <button class="btn secondary" type="button" aria-label="Previous month" @click="shiftMonth(-1)">
          ‹
        </button>
        <span class="dash-cal__month">{{ monthTitle }}</span>
        <button class="btn secondary" type="button" aria-label="Next month" @click="shiftMonth(1)">
          ›
        </button>
      </div>
    </div>

    <div class="dash-cal__legend">
      <span><i class="dash-cal__dot open" /> Open</span>
      <span><i class="dash-cal__dot booked" /> Booked</span>
      <span><i class="dash-cal__dot blocked" /> Blocked</span>
      <span>
        <svg class="dash-cal__wrench" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        Repair &amp; maintenance
      </span>
    </div>

    <p v-if="monthLoading" class="muted">Loading calendar…</p>
    <p v-else-if="monthError" class="error">Could not load calendar.</p>
    <div v-else class="dash-cal__grid">
      <div v-for="day in weekdayLabels" :key="day" class="dash-cal__weekday">{{ day }}</div>
      <button
        v-for="(cell, idx) in calendarCells"
        :key="`${cell.date ?? 'empty'}-${idx}`"
        type="button"
        class="dash-cal__day"
        :class="dayCellClass(cell)"
        :disabled="!cell.inMonth"
        @click="onDayClick(cell)"
      >
        <span v-if="cell.day" class="dash-cal__day-num">{{ cell.day }}</span>
        <svg
          v-if="cell.maintenance"
          class="dash-cal__wrench"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <span v-if="cell.maintenance" class="dash-cal__sr">Repair and maintenance</span>
        <span v-else-if="cell.inMonth && cell.status" class="dash-cal__day-status" :class="cell.status">
          {{ statusLabel(cell.status) }}
        </span>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="popupOpen"
        class="dash-cal__modal"
        role="dialog"
        aria-modal="true"
        :aria-label="`Agenda for ${popupDate}`"
      >
        <button type="button" class="dash-cal__backdrop" aria-label="Close" @click="closePopup" />
        <div class="dash-cal__dialog card">
          <div class="row" style="justify-content: space-between; align-items: flex-start">
            <div>
              <div class="muted" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em">
                Day agenda
              </div>
              <h3 style="margin: 0.25rem 0 0">{{ popupDateLabel }}</h3>
              <p v-if="popupUnderMaintenance" class="dash-cal__maint-note">
                Repair and maintenance through 31 October.
              </p>
            </div>
            <button class="btn secondary" type="button" @click="closePopup">Close</button>
          </div>

          <p v-if="popupLoading" class="muted" style="margin-top: 1.25rem">Loading…</p>
          <p v-else-if="popupError" class="error" style="margin-top: 1.25rem">Could not load day details.</p>
          <div v-else-if="!hasAgenda" class="muted" style="margin-top: 1.25rem">
            No bookings or blocks on this day.
          </div>
          <div v-else class="dash-cal__halls">
            <section v-for="hall in hallsWithActivity" :key="hall.slug" class="dash-cal__hall">
              <h4>{{ hall.name }}</h4>

              <article v-for="b in hall.bookings" :key="b.id" class="dash-cal__item">
                <div class="row" style="justify-content: space-between">
                  <strong>{{ b.startTime }}–{{ b.endTime }}</strong>
                  <span class="badge" :class="b.status">{{ b.status }}</span>
                </div>
                <div>{{ b.eventType }} · {{ b.customerName }}</div>
                <div class="muted" style="font-size: 0.85rem">
                  {{ b.customerEmail }} · {{ b.customerPhone }} · {{ b.guestCount }} guests
                </div>
                <p v-if="b.notes" class="dash-cal__notes">
                  <span class="muted">Notes:</span> {{ b.notes }}
                </p>
                <RouterLink :to="`/bookings/${b.id}`" class="dash-cal__link">View booking →</RouterLink>
              </article>

              <article v-for="s in hall.blocks" :key="s.id" class="dash-cal__item blocked">
                <div class="row" style="justify-content: space-between">
                  <strong>{{ s.startTime }}–{{ s.endTime }}</strong>
                  <span class="badge blocked">blocked</span>
                </div>
                <div class="muted">{{ s.reason || 'Blocked' }}</div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  VENUES,
  isVenueUnderMaintenance,
  type AdminDayAgenda,
  type AdminMonthOccupancy,
  type BookingDto,
  type BlockedSlotDto,
} from '@luxurydurbar/shared'
import { api } from '../lib/api'

type DayStatus = 'open' | 'booked' | 'blocked'

type CalendarCell = {
  date: string | null
  day: number | null
  status: DayStatus | null
  maintenance: boolean
  inMonth: boolean
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const today = new Date().toISOString().slice(0, 10)
const viewYear = ref(Number(today.slice(0, 4)))
const viewMonth = ref(Number(today.slice(5, 7)) - 1)

const dayStatus = ref<Record<string, DayStatus>>({})
const monthLoading = ref(false)
const monthError = ref(false)

const popupOpen = ref(false)
const popupDate = ref('')
const popupAgenda = ref<AdminDayAgenda | null>(null)
const popupLoading = ref(false)
const popupError = ref(false)

const monthTitle = computed(() => {
  const d = new Date(Date.UTC(viewYear.value, viewMonth.value, 1))
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
})

const popupUnderMaintenance = computed(() =>
  popupDate.value ? isVenueUnderMaintenance(popupDate.value) : false,
)

const popupDateLabel = computed(() => {
  if (!popupDate.value) return ''
  const [y, m, d] = popupDate.value.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)))
})

const calendarCells = computed((): CalendarCell[] => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cells: CalendarCell[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push({ date: null, day: null, status: null, maintenance: false, inMonth: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push({
      date,
      day,
      status: dayStatus.value[date] ?? 'open',
      maintenance: isVenueUnderMaintenance(date),
      inMonth: true,
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: null, day: null, status: null, maintenance: false, inMonth: false })
  }
  return cells
})

const hasAgenda = computed(() => {
  const a = popupAgenda.value
  return Boolean(a && (a.bookings.length || a.blockedSlots.length))
})

const hallsWithActivity = computed(() => {
  const a = popupAgenda.value
  if (!a) return [] as { slug: string; name: string; bookings: BookingDto[]; blocks: BlockedSlotDto[] }[]

  return VENUES.map((v) => ({
    slug: v.slug,
    name: v.name,
    bookings: a.bookings.filter((b) => b.hallSlug === v.slug),
    blocks: a.blockedSlots.filter((s) => s.hallSlug === v.slug),
  })).filter((h) => h.bookings.length || h.blocks.length)
})

function statusLabel(status: DayStatus) {
  if (status === 'booked') return 'Booked'
  if (status === 'blocked') return 'Blocked'
  return 'Open'
}

function dayCellClass(cell: CalendarCell) {
  if (!cell.inMonth) return 'empty'
  const classes = [cell.status ?? 'open']
  if (cell.maintenance) classes.push('maintenance')
  if (cell.date === popupDate.value) classes.push('selected')
  if (cell.date === today) classes.push('today')
  return classes.join(' ')
}

function isoRangeForView() {
  const year = viewYear.value
  const month = viewMonth.value
  const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { from, to }
}

function shiftMonth(delta: number) {
  const d = new Date(Date.UTC(viewYear.value, viewMonth.value + delta, 1))
  viewYear.value = d.getUTCFullYear()
  viewMonth.value = d.getUTCMonth()
}

async function loadMonth() {
  monthLoading.value = true
  monthError.value = false
  try {
    const { from, to } = isoRangeForView()
    const data = await api<AdminMonthOccupancy>(`/bookings/agenda/month?from=${from}&to=${to}`)
    const next: Record<string, DayStatus> = {}
    for (const day of data.days) next[day.date] = day.status
    dayStatus.value = next
  } catch {
    monthError.value = true
    dayStatus.value = {}
  } finally {
    monthLoading.value = false
  }
}

async function onDayClick(cell: CalendarCell) {
  if (!cell.inMonth || !cell.date) return
  popupDate.value = cell.date
  popupOpen.value = true
  popupLoading.value = true
  popupError.value = false
  popupAgenda.value = null
  try {
    popupAgenda.value = await api<AdminDayAgenda>(`/bookings/agenda/day?date=${cell.date}`)
  } catch {
    popupError.value = true
  } finally {
    popupLoading.value = false
  }
}

function closePopup() {
  popupOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && popupOpen.value) closePopup()
}

watch([viewYear, viewMonth], loadMonth)
onMounted(() => {
  loadMonth()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
