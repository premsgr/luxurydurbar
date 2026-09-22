import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot',
      component: () => import('../views/ForgotPasswordView.vue'),
      meta: { public: true },
    },
    {
      path: '/reset-password',
      name: 'reset',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('../layouts/AdminLayout.vue'),
      children: [
        { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
        { path: 'bookings', name: 'bookings', component: () => import('../views/BookingsView.vue') },
        {
          path: 'bookings/:id',
          name: 'booking-detail',
          component: () => import('../views/BookingDetailView.vue'),
        },
        { path: 'calendar', name: 'calendar', component: () => import('../views/CalendarView.vue') },
        { path: 'halls', name: 'halls', component: () => import('../views/HallsView.vue') },
        { path: 'blocked', name: 'blocked', component: () => import('../views/BlockedView.vue') },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.loaded) await auth.fetchMe()
  if (!to.meta.public && !auth.user) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && auth.user) return { name: 'dashboard' }
  return true
})

export default router
