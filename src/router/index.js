import NotFound from '@/views/NotFound.vue'

import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import BookAppointment from '@/views/BookAppointment.vue'
import CompleteEvent from '@/views/CompleteEvent.vue'
import SignupView from '@/views/SignupView.vue'
import ActivateAccount from '@/views/ActivateAccount.vue'
import ActivationProcess from '@/views/ActivationProcess.vue'
import LoginView from '@/views/LoginView.vue'
import PasswordReset from '@/views/PasswordReset.vue'
import MyPage from '@/views/MyPage.vue'

import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminCalendar from '@/views/admin/AdminCalendar.vue'
import AdminMenus from '@/views/admin/AdminMenus.vue'
import UsersIndex from '@/views/admin/UsersIndex.vue'
import UserShow from '@/views/admin/UserShow.vue'
import AdminConfig from '@/views/admin/AdminConfig.vue'

import TermsAndConditions from '@/views/TermsAndConditions.vue'
import PrivacyAndPolicy from '@/views/PrivacyAndPolicy.vue'

import { useUserStore } from '@/store/userStore'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin/config',
    name: 'adminConfig',
    component: AdminConfig,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin/dashboard',
    name: 'adminDashboard',
    component: AdminDashboard,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin/calendar',
    name: 'adminCalendar',
    component: AdminCalendar,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin/menus',
    name: 'adminMenus',
    component: AdminMenus,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin/users',
    name: 'adminUsers',
    component: UsersIndex,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin/users/:id',
    name: 'adminShowUsers',
    component: UserShow,
    beforeEnter: (to, from, next)=> {
      const userStore = useUserStore();
      if (!userStore.isAdmin) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },
  {
    path: '/activate/:activation_token/:email',
    component: ActivationProcess
  },
  {
    path: '/activate-account',
    name: 'ActivateAccount',
    component: ActivateAccount
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/password-reset',
    name: 'passwordReset',
    component: PasswordReset
  },
  {
    path: '/mypage',
    name: 'userPage',
    component: MyPage,
    // beforeEnter: (to, from, next)=> {
    //   const userStore = useUserStore();
    //   if (userStore.user.id === this.$route.params.id) {
    //     next('/login')
    //   } else {
    //     next()
    //   }
    // }
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
    path: '/termsandconditions',
    name: 'termsandconditions',
    component: TermsAndConditions
  },
  {
    path: '/privacyandpolicy',
    name: 'privacyandpolicy',
    component: PrivacyAndPolicy
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
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
