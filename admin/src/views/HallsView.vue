<template>
  <div>
    <div class="row" style="justify-content: space-between; margin-bottom: 1rem">
      <h1 class="page-title" style="margin: 0">Halls</h1>
      <button class="btn" type="button" @click="openCreate">Add hall</button>
    </div>

    <div class="card" style="margin-bottom: 1rem">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="h in halls" :key="h.id">
            <td>{{ h.name }}</td>
            <td>{{ h.capacity }}</td>
            <td>{{ h.published ? 'Yes' : 'No' }}</td>
            <td class="row">
              <button class="btn secondary" type="button" @click="edit(h)">Edit</button>
              <button class="btn danger" type="button" @click="remove(h.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm" class="card stack">
      <h2 style="margin: 0">{{ editingId ? 'Edit hall' : 'New hall' }}</h2>
      <div>
        <label class="label">Name</label>
        <input v-model="form.name" class="input" required />
      </div>
      <div class="grid-2">
        <div>
          <label class="label">Capacity</label>
          <input v-model.number="form.capacity" type="number" class="input" min="1" />
        </div>
        <div>
          <label class="label">Sort order</label>
          <input v-model.number="form.sortOrder" type="number" class="input" />
        </div>
      </div>
      <div>
        <label class="label">Description</label>
        <textarea v-model="form.description" class="textarea" rows="3" />
      </div>
      <div>
        <label class="label">Amenities (comma separated)</label>
        <input v-model="amenitiesText" class="input" />
      </div>
      <div>
        <label class="label">Image URL</label>
        <input v-model="imageUrl" class="input" />
      </div>
      <label class="row">
        <input v-model="form.published" type="checkbox" />
        Published
      </label>
      <p v-if="error" class="error">{{ error }}</p>
      <div class="row">
        <button class="btn" type="button" @click="save">Save</button>
        <button class="btn secondary" type="button" @click="showForm = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { HallDto } from '@luxurydurbar/shared'
import { api, ApiError } from '../lib/api'

const halls = ref<HallDto[]>([])
const showForm = ref(false)
const editingId = ref<string | null>(null)
const amenitiesText = ref('')
const imageUrl = ref('')
const error = ref('')

const form = reactive({
  name: '',
  capacity: 100,
  description: '',
  sortOrder: 0,
  published: true,
})

async function load() {
  halls.value = await api('/halls/admin/all')
}

function openCreate() {
  editingId.value = null
  form.name = ''
  form.capacity = 100
  form.description = ''
  form.sortOrder = halls.value.length + 1
  form.published = true
  amenitiesText.value = ''
  imageUrl.value = 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b2?w=1600'
  showForm.value = true
  error.value = ''
}

function edit(h: HallDto) {
  editingId.value = h.id
  form.name = h.name
  form.capacity = h.capacity
  form.description = h.description
  form.sortOrder = h.sortOrder
  form.published = h.published
  amenitiesText.value = h.amenities.join(', ')
  imageUrl.value = h.images[0]?.url || ''
  showForm.value = true
  error.value = ''
}

async function save() {
  error.value = ''
  const payload = {
    name: form.name,
    capacity: form.capacity,
    description: form.description,
    sortOrder: form.sortOrder,
    published: form.published,
    amenities: amenitiesText.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    images: imageUrl.value ? [{ url: imageUrl.value }] : [],
  }
  try {
    if (editingId.value) {
      await api(`/halls/${editingId.value}`, { method: 'PATCH', json: payload })
    } else {
      await api('/halls', { method: 'POST', json: payload })
    }
    showForm.value = false
    await load()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Save failed'
  }
}

async function remove(id: string) {
  if (!confirm('Delete this hall?')) return
  await api(`/halls/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(load)
</script>
