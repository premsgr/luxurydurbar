<template>
  <div>
    <PageBanner
      :title="t('contact.banner.title')"
      :subtitle="t('contact.banner.subtitle')"
      :image="PHOTOS.hero"
    />

    <section class="section grid gap-12 lg:grid-cols-5">
      <form class="lg:col-span-3 space-y-5" @submit.prevent="submit">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label">{{ t('contact.form.fullName') }}</label>
            <input v-model="form.customerName" class="input" required />
          </div>
          <div>
            <label class="label">{{ t('contact.form.email') }}</label>
            <input v-model="form.customerEmail" type="email" class="input" required />
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label">{{ t('contact.form.phone') }}</label>
            <input v-model="form.customerPhone" class="input" required />
          </div>
          <div>
            <label class="label">{{ t('contact.form.eventType') }}</label>
            <select v-model="form.eventType" class="input" required>
              <option v-for="et in eventTypes" :key="et" :value="et">
                {{ t(`contact.eventTypes.${et}`) }}
              </option>
            </select>
          </div>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label">{{ t('contact.form.hall') }}</label>
            <select v-model="form.hallId" class="input" required>
              <option v-for="h in halls" :key="h.id" :value="h.id">
                {{ h.name }} ({{ h.capacity }})
              </option>
            </select>
          </div>
          <div>
            <label class="label">{{ t('contact.form.date') }}</label>
            <input v-model="form.eventDate" type="date" class="input" required :min="minDate" />
          </div>
        </div>
        <div>
          <label class="label">{{ t('contact.form.guests') }}</label>
          <select v-model="guestBucket" class="input" required>
            <option value="under100">{{ t('contact.form.guestOptions.under100') }}</option>
            <option value="100to300">{{ t('contact.form.guestOptions.100to300') }}</option>
            <option value="300to500">{{ t('contact.form.guestOptions.300to500') }}</option>
            <option value="500plus">{{ t('contact.form.guestOptions.500plus') }}</option>
          </select>
        </div>
        <div>
          <label class="label">{{ t('contact.form.notes') }}</label>
          <textarea v-model="form.notes" rows="4" class="input" />
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <button
            type="button"
            class="btn-outline !py-2"
            :disabled="!form.hallId || !form.eventDate"
            @click="checkAvailability"
          >
            {{ t('contact.form.checkAvail') }}
          </button>
          <p
            v-if="availabilityMsg"
            class="font-sans text-sm"
            :class="availabilityOk ? 'text-emerald-400' : 'text-amber-400'"
          >
            {{ availabilityMsg }}
          </p>
        </div>

        <p v-if="errorMsg" class="font-sans text-sm text-red-400">{{ errorMsg }}</p>
        <p v-if="successMsg" class="font-sans text-sm text-emerald-400">{{ successMsg }}</p>

        <button type="submit" class="btn-gold" :disabled="submitting">
          {{ submitting ? t('contact.form.submitting') : t('contact.form.submit') }}
        </button>
      </form>

      <aside class="lg:col-span-2 space-y-8">
        <div class="border border-white/10 bg-white/[0.03] p-6 font-sans text-sm text-white/70 space-y-4">
          <h2 class="text-lg text-gold-light">{{ t('contact.info.title') }}</h2>
          <p>
            <span class="text-white/40 block text-xs uppercase tracking-wider mb-1">
              {{ t('contact.info.addressLabel') }}
            </span>
            {{ t('contact.info.address') }}
          </p>
          <p>
            <span class="text-white/40 block text-xs uppercase tracking-wider mb-1">
              {{ t('contact.info.phoneLabel') }}
            </span>
            {{ t('contact.info.phone') }}<br />
            {{ t('contact.info.whatsapp') }}
          </p>
          <p>
            <span class="text-white/40 block text-xs uppercase tracking-wider mb-1">
              {{ t('contact.info.emailLabel') }}
            </span>
            {{ t('contact.info.email') }}
          </p>
          <p>
            <span class="text-white/40 block text-xs uppercase tracking-wider mb-1">
              {{ t('contact.info.hoursLabel') }}
            </span>
            {{ t('contact.info.hours') }}
          </p>
        </div>

        <div class="overflow-hidden border border-white/10 aspect-[4/3]">
          <iframe
            title="Luxury Durbar location"
            class="h-full w-full grayscale contrast-125 opacity-80"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Kathmandu%20Valley%2C%20Nepal&z=12&output=embed"
          />
        </div>
      </aside>
    </section>
  </div>
</template>

<script lang="ts">
export default { name: 'ContactPage' }
</script>

<script setup lang="ts">
import { EVENT_TYPES, type AvailabilityResponse, type HallDto } from '@luxurydurbar/shared'
import { PHOTOS } from '~/utils/photos'
import { SEO_KEYWORDS } from '~/utils/seo'

const { t, te, tm, rt } = useI18n()
const { api } = useApi()
const route = useRoute()
const config = useRuntimeConfig()
const eventTypes = EVENT_TYPES
const minDate = new Date().toISOString().slice(0, 10)

useSeoMeta({
  title: () => t('contact.seoTitle'),
  description: () => t('contact.seoDesc'),
  keywords: SEO_KEYWORDS,
  ogTitle: () => t('contact.seoTitle'),
  ogDescription: () => t('contact.seoDesc'),
  ogImage: () => `${config.public.siteUrl}${PHOTOS.hero}`,
})

const { data: halls } = await useAsyncData('contact-halls', () => api<HallDto[]>('/halls'))

const guestBucket = ref('100to300')
const guestCountMap: Record<string, number> = {
  under100: 75,
  '100to300': 200,
  '300to500': 400,
  '500plus': 600,
}

const form = reactive({
  hallId: '',
  eventDate: '',
  startTime: '15:00',
  endTime: '22:00',
  guestCount: 200,
  eventType: 'wedding' as (typeof EVENT_TYPES)[number],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
})

watchEffect(() => {
  form.guestCount = guestCountMap[guestBucket.value] || 200
})

watchEffect(() => {
  if (!halls.value?.length) return
  const pref = String(route.query.hall || '')
  if (pref) {
    const match = halls.value.find((h) => h.slug === pref || h.id === pref)
    if (match) form.hallId = match.id
  }
  if (!form.hallId) form.hallId = halls.value[0]?.id || ''
})

watchEffect(() => {
  const pkg = String(route.query.package || '')
  if (!pkg) return
  const nameKey = `packages.packageNames.${pkg}`
  const label = te(nameKey) ? t(nameKey) : pkg
  const note = t('contact.form.packageNote', { name: label })
  if (!form.notes.includes(note)) {
    form.notes = form.notes ? `${form.notes}\n${note}` : note
  }
})

watchEffect(() => {
  const raw = String(route.query.addons || '')
  if (!raw) return
  const keys = raw.split(',').map((k) => k.trim()).filter(Boolean)
  if (!keys.length) return

  const labels = keys.map((key) => {
    for (const group of ['av', 'entertainment', 'food', 'decor'] as const) {
      const items = tm(`packages.addons.groups.${group}.items`) as Array<{ key?: string; label?: string }>
      if (!Array.isArray(items)) continue
      const match = items.find((item) => item?.key === key)
      if (match) {
        return typeof match.label === 'string' ? match.label : rt(match.label as never)
      }
    }
    return key
  })

  const note = t('contact.form.addonsNote', { list: labels.join(', ') })
  if (!form.notes.includes(note)) {
    form.notes = form.notes ? `${form.notes}\n${note}` : note
  }
})

const availabilityMsg = ref('')
const availabilityOk = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function checkAvailability() {
  availabilityMsg.value = ''
  const result = await api<AvailabilityResponse>(
    `/availability?hallId=${form.hallId}&date=${form.eventDate}`,
  )
  availabilityOk.value = result.available
  availabilityMsg.value = result.available
    ? t('contact.form.availOk')
    : t('contact.form.availBusy')
}

async function submit() {
  errorMsg.value = ''
  successMsg.value = ''
  submitting.value = true
  try {
    await api('/bookings', { method: 'POST', body: { ...form } })
    successMsg.value = t('contact.form.success')
  } catch (e: unknown) {
    const err = e as { data?: { message?: string | string[] }; message?: string }
    const msg = err?.data?.message
    errorMsg.value = Array.isArray(msg) ? msg.join(', ') : msg || err.message || 'Request failed'
  } finally {
    submitting.value = false
  }
}
</script>
