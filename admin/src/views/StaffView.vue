<template>
  <div>
    <h1 class="page-title">Staff</h1>

    <div class="card stack" style="margin-bottom: 1rem">
      <h2 style="margin: 0; font-size: 1.1rem">Add staff member</h2>
      <div class="grid-2">
        <div>
          <label class="label">Name</label>
          <input v-model="form.name" class="input" autocomplete="off" />
        </div>
        <div>
          <label class="label">Email</label>
          <input v-model="form.email" type="email" class="input" autocomplete="off" />
        </div>
        <div>
          <label class="label">Password</label>
          <input v-model="form.password" type="password" class="input" autocomplete="new-password" />
        </div>
        <div>
          <label class="label">Role</label>
          <select v-model="form.role" class="select">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="msg" class="ok">{{ msg }}</p>
      <button class="btn" type="button" :disabled="busy" @click="create">Add member</button>
    </div>

    <div class="card">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td><span class="badge" :class="u.role">{{ u.role }}</span></td>
            <td>
              <button
                v-if="u.id !== auth.user?.id"
                class="btn danger"
                type="button"
                :disabled="busy"
                @click="remove(u.id)"
              >
                Remove
              </button>
              <span v-else class="muted">You</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!users.length" class="muted">No staff members yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { CreateStaffRequest, StaffUserDto, UserRole } from '@luxurydurbar/shared'
import { api, ApiError } from '../lib/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const users = ref<StaffUserDto[]>([])
const busy = ref(false)
const error = ref('')
const msg = ref('')
const form = reactive<CreateStaffRequest>({
  name: '',
  email: '',
  password: '',
  role: 'staff',
})

async function load() {
  users.value = await api<StaffUserDto[]>('/users')
}

async function create() {
  error.value = ''
  msg.value = ''
  busy.value = true
  try {
    await api('/users', {
      method: 'POST',
      json: {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role as UserRole,
      },
    })
    form.name = ''
    form.email = ''
    form.password = ''
    form.role = 'staff'
    msg.value = 'Staff member added.'
    await load()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to add staff'
  } finally {
    busy.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Remove this staff member? They will no longer be able to sign in.')) return
  error.value = ''
  msg.value = ''
  busy.value = true
  try {
    await api(`/users/${id}`, { method: 'DELETE' })
    msg.value = 'Staff member removed.'
    await load()
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'Failed to remove staff'
  } finally {
    busy.value = false
  }
}

onMounted(load)
</script>
