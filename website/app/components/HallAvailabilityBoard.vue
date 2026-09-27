<template>
  <div class="hall-availability-board w-full border border-white/10 bg-white/[0.03] p-4 sm:p-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="eyebrow mb-1">{{ t('contact.occupancy.eyebrow') }}</p>
        <h2 class="text-xl sm:text-2xl text-gold-light">{{ t('contact.occupancy.title') }}</h2>
        <p class="mt-1 font-sans text-sm text-white/50 max-w-xl">
          {{ t('contact.occupancy.subtitle') }}
        </p>
      </div>
      <div class="flex items-center gap-2 font-sans">
        <button
          type="button"
          class="btn-outline !px-2.5 !py-1.5"
          :aria-label="t('contact.occupancy.prevMonth')"
          @click="shiftMonth(-1)"
        >
          ‹
        </button>
        <p class="min-w-[9rem] text-center text-gold-light text-base">
          {{ monthTitle }}
        </p>
        <button
          type="button"
          class="btn-outline !px-2.5 !py-1.5"
          :aria-label="t('contact.occupancy.nextMonth')"
          @click="shiftMonth(1)"
        >
          ›
        </button>
      </div>
    </div>

    <div class="mt-3 flex flex-wrap gap-4 font-sans text-xs text-white/60">
      <span class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-emerald-400" />
        {{ t('contact.occupancy.legendOpen') }}
      </span>
      <span class="inline-flex items-center gap-2">
        <span class="h-2 w-2 rounded-full bg-orange-400" />
        {{ t('contact.occupancy.legendBooked') }}
      </span>
      <span class="inline-flex items-center gap-2">
        <svg class="h-3.5 w-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        {{ t('contact.occupancy.legendMaintenance') }}
      </span>
    </div>

    <p v-if="monthLoading" class="mt-4 font-sans text-sm text-white/50">
      {{ t('contact.occupancy.loading') }}
    </p>
    <p v-else-if="monthError" class="mt-4 font-sans text-sm text-amber-400">
      {{ t('contact.occupancy.error') }}
    </p>

    <div v-else class="mt-4 w-full">
      <div class="grid w-full grid-cols-7 gap-px sm:gap-1">
        <div
          v-for="day in weekdayLabels"
          :key="day"
          class="pb-1.5 text-center font-sans text-[0.65rem] sm:text-xs uppercase tracking-wider text-white/40"
        >
          {{ day }}
        </div>
        <button
          v-for="(cell, idx) in calendarCells"
          :key="`${cell.date ?? 'empty'}-${idx}`"
          type="button"
          class="hall-availability-board__day flex h-12 sm:h-14 flex-col items-center justify-center gap-0 rounded-sm border px-0.5 font-sans transition"
          :class="dayCellClass(cell)"
          :disabled="!cell.clickable"
          @click="onDayClick(cell)"
        >
          <span v-if="cell.day" class="text-xs sm:text-sm leading-none">
            {{ cell.day }}
          </span>
          <span
            v-if="cell.maintenance"
            class="mt-0.5 text-amber-300"
            :title="t('contact.occupancy.legendMaintenance')"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span class="sr-only">{{ t('contact.occupancy.legendMaintenance') }}</span>
          </span>
          <span
            v-else-if="cell.clickable && cell.status"
            class="mt-0.5 text-[0.55rem] sm:text-[0.65rem] uppercase tracking-wide leading-none font-medium"
            :class="cell.status === 'booked' ? 'text-orange-400' : 'text-emerald-400'"
          >
            {{
              cell.status === 'booked'
                ? t('contact.occupancy.legendBooked')
                : t('contact.occupancy.legendOpen')
            }}
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="popupOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="t('contact.occupancy.popupTitle', { date: popupDate })"
      >
        <button
          type="button"
          class="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          :aria-label="t('contact.occupancy.close')"
          @click="closePopup"
        />
        <div
          class="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-white/15 bg-ink p-6 sm:p-8 shadow-2xl"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="eyebrow mb-1">{{ t('contact.occupancy.popupEyebrow') }}</p>
              <h3 class="text-xl sm:text-2xl text-gold-light">
                {{ t('contact.occupancy.popupTitle', { date: popupDateLabel }) }}
              </h3>
            </div>
            <button
              type="button"
              class="btn-outline !px-3 !py-1.5 shrink-0"
              @click="closePopup"
            >
              {{ t('contact.occupancy.close') }}
            </button>
          </div>

          <p
            v-if="popupUnderMaintenance"
            class="mt-4 font-sans text-sm text-amber-300"
          >
            {{ t('contact.occupancy.maintenanceNotice') }}
          </p>

          <p v-if="popupLoading" class="mt-6 font-sans text-sm text-white/50">
            {{ t('contact.occupancy.loading') }}
          </p>
          <p v-else-if="popupError" class="mt-6 font-sans text-sm text-amber-400">
            {{ t('contact.occupancy.error') }}
          </p>
          <div v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="hall in popupOverview?.halls ?? []"
              :key="hall.hallSlug"
              type="button"
              class="text-left border border-white/10 bg-white/[0.03] p-4 transition hover:border-gold/40 focus:outline-none focus-visible:border-gold"
              :class="{ 'border-gold/60': hall.hallSlug === selectedHall }"
              @click="onSelectHall(hall.hallSlug)"
            >
              <h4 class="font-serif text-base text-white">{{ hall.hallName }}</h4>
              <ul class="mt-3 space-y-2 font-sans text-sm">
                <li
                  v-for="slot in hall.slots"
                  :key="`${slot.startTime}-${slot.endTime}`"
                  class="flex flex-col gap-0.5 border-t border-white/10 pt-2 first:border-0 first:pt-0"
                >
                  <span class="text-white/40 text-xs uppercase tracking-wider">
                    {{ slotLabel(slot) }}
                    <span class="normal-case tracking-normal text-white/30">
                      {{ slot.startTime }}–{{ slot.endTime }}
                    </span>
                  </span>
                  <span :class="statusClass(slot.status)">{{ statusLabel(slot) }}</span>
                </li>
              </ul>
              <p class="mt-3 font-sans text-xs text-gold/80">
                {{ t('contact.occupancy.selectHall') }}
              </p>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
export default { name: 'HallAvailabilityBoard' }
</script>

<script setup lang="ts">
import {
  isVenueUnderMaintenance,
  type MonthDayStatus,
  type MonthOccupancy,
  type OccupancyOverview,
  type OccupancySlot,
} from '@luxurydurbar/shared'

type CalendarCell = {
  date: string | null
  day: number | null
  status: MonthDayStatus['status'] | null
  maintenance: boolean
  clickable: boolean
  inMonth: boolean
}

const props = defineProps({
  date: { type: String, default: '' },
  selectedHall: { type: String, default: '' },
})

const emit = defineEmits<{
  'update:date': [value: string]
  'select-hall': [hallSlug: string]
}>()

const { t, locale } = useI18n()
const { api } = useApi()

const today = new Date().toISOString().slice(0, 10)
const viewYear = ref(Number(today.slice(0, 4)))
const viewMonth = ref(Number(today.slice(5, 7)) - 1) // 0-indexed

const dayStatus = ref<Record<string, MonthDayStatus['status']>>({})
const monthLoading = ref(false)
const monthError = ref(false)

const popupOpen = ref(false)
const popupDate = ref('')
const popupOverview = ref<OccupancyOverview | null>(null)
const popupLoading = ref(false)
const popupError = ref(false)

const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const weekdayLabels = computed(() =>
  weekdayKeys.map((key) => t(`contact.occupancy.weekdays.${key}`)),
)

const monthTitle = computed(() => {
  const d = new Date(Date.UTC(viewYear.value, viewMonth.value, 1))
  return new Intl.DateTimeFormat(locale.value === 'ne' ? 'ne-NP' : 'en-US', {
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
  const date = new Date(Date.UTC(y, m - 1, d))
  return new Intl.DateTimeFormat(locale.value === 'ne' ? 'ne-NP' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
})

const calendarCells = computed((): CalendarCell[] => {
  const year = viewYear.value
  const month = viewMonth.value
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cells: CalendarCell[] = []
  for (let i = 0; i < firstDow; i++) {
    cells.push({
      date: null,
      day: null,
      status: null,
      maintenance: false,
      clickable: false,
      inMonth: false,
    })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isPast = date < today
    const status = dayStatus.value[date] ?? null
    cells.push({
      date,
      day,
      status: isPast ? null : status,
      maintenance: isVenueUnderMaintenance(date),
      clickable: !isPast,
      inMonth: true,
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({
      date: null,
      day: null,
      status: null,
      maintenance: false,
      clickable: false,
      inMonth: false,
    })
  }
  return cells
})

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

function dayCellClass(cell: CalendarCell) {
  if (!cell.inMonth) {
    return 'border-transparent bg-transparent cursor-default'
  }
  if (!cell.clickable) {
    return 'border-white/5 bg-white/[0.02] text-white/25 cursor-not-allowed'
  }
  const selected = cell.date && cell.date === props.date
  const base =
    'border-white/10 bg-ink/40 text-white hover:border-gold/40 focus:outline-none focus-visible:border-gold cursor-pointer'
  if (cell.maintenance) {
    const maintenance = `${base} bg-amber-400/15 border-amber-400/40`
    return selected ? `${maintenance} ring-1 ring-gold/40` : maintenance
  }
  if (selected) return `${base} border-gold/60 ring-1 ring-gold/40`
  if (cell.status === 'booked') return `${base} bg-orange-400/10`
  if (cell.status === 'open') return `${base} bg-emerald-400/10`
  return base
}

function slotLabel(slot: OccupancySlot) {
  if (slot.startTime === '09:00' && slot.endTime === '14:00') {
    return t('contact.occupancy.morning')
  }
  if (slot.startTime === '15:00' && slot.endTime === '22:00') {
    return t('contact.occupancy.evening')
  }
  return `${slot.startTime}–${slot.endTime}`
}

function statusLabel(slot: OccupancySlot) {
  if (slot.status === 'open') return t('contact.occupancy.open')
  if (slot.status === 'blocked') return t('contact.occupancy.unavailable')
  const purpose = slot.eventType
    ? t(`contact.eventTypes.${slot.eventType}`)
    : t('contact.eventTypes.other')
  return t('contact.occupancy.booked', { purpose })
}

function statusClass(status: OccupancySlot['status']) {
  if (status === 'open') return 'text-emerald-400'
  if (status === 'blocked') return 'text-white/40'
  return 'text-orange-400'
}

async function loadMonth() {
  const { from, to } = isoRangeForView()
  monthLoading.value = true
  monthError.value = false
  try {
    const result = await api<MonthOccupancy>(`/availability/month?from=${from}&to=${to}`)
    const map: Record<string, MonthDayStatus['status']> = {}
    for (const day of result.days) {
      map[day.date] = day.status
    }
    dayStatus.value = map
  } catch {
    dayStatus.value = {}
    monthError.value = true
  } finally {
    monthLoading.value = false
  }
}

async function onDayClick(cell: CalendarCell) {
  if (!cell.clickable || !cell.date) return
  emit('update:date', cell.date)
  popupDate.value = cell.date
  popupOpen.value = true
  popupOverview.value = null
  popupLoading.value = true
  popupError.value = false
  try {
    popupOverview.value = await api<OccupancyOverview>(
      `/availability/overview?date=${cell.date}`,
    )
  } catch {
    popupError.value = true
  } finally {
    popupLoading.value = false
  }
}

function onSelectHall(hallSlug: string) {
  emit('select-hall', hallSlug)
  closePopup()
}

function closePopup() {
  popupOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && popupOpen.value) closePopup()
}

watch([viewYear, viewMonth], loadMonth, { immediate: true })

watch(
  () => props.date,
  (value) => {
    if (!value) return
    const [y, m] = value.split('-').map(Number)
    if (y !== viewYear.value || m - 1 !== viewMonth.value) {
      viewYear.value = y
      viewMonth.value = m - 1
    }
  },
)

onMounted(() => {
  if (!props.date) emit('update:date', today)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
