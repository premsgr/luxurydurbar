import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StaffUserDto } from '@luxurydurbar/shared'
import { api } from '../lib/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<StaffUserDto | null>(null)
  const loaded = ref(false)

  async function fetchMe() {
    try {
      user.value = await api<StaffUserDto>('/auth/me')
    } catch {
      user.value = null
    } finally {
      loaded.value = true
    }
  }

  async function login(email: string, password: string) {
    const res = await api<{ user: StaffUserDto }>('/auth/login', {
      method: 'POST',
      json: { email, password },
    })
    user.value = res.user
    return res.user
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, loaded, fetchMe, login, logout }
})
