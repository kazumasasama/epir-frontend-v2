import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import BookAppointment from '@/views/BookAppointment.vue'
import CompleteEvent from '@/views/CompleteEvent.vue'
import SignupView from '@/views/SignupView.vue'
import LoginView from '@/views/LoginView.vue'

import AdminCalendar from '@/views/admin/AdminCalendar.vue'
import AdminMenus from '@/views/admin/AdminMenus.vue'
import UsersIndex from '@/views/admin/UsersIndex.vue'
import UserShow from '@/views/admin/UserShow.vue'

import TermsAndConditions from '@/views/TermsAndConditions.vue'
import PrivacyAndPolicy from '@/views/PrivacyAndPolicy.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin/calendar',
    name: 'adminCalendar',
    component: AdminCalendar
  },
  {
    path: '/admin/menus',
    name: 'adminMenus',
    component: AdminMenus
  },
  {
    path: '/admin/users',
    name: 'adminUsers',
    component: UsersIndex
  },
  {
    path: '/admin/users/:id',
    name: 'adminShowUsers',
    component: UserShow
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: BookAppointment
  },
  {
    path: '/complete',
    name: 'complete',
    component: CompleteEvent
  },
  {
    path: '/complete',
    name: 'complete',
    component: CompleteEvent
  },
  {
    path: '/termsandconditions',
    name: 'termsandconditions',
    component: TermsAndConditions
  },
  {
    path: '/privacyandpolicy',
    name: 'privacyandpolicy',
    component: PrivacyAndPolicy
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
