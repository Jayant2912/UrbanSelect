import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomePage',
   component: () => import('@/components/HomePage.vue')
  },
  {
    path: '/SignUp',
    name: 'SignupPage',
   component: () => import('@/components/SignupPage.vue')
  },
  {
    path: '/Login',
    name: 'LoginPage',
   component: () => import('@/components/LoginPage.vue')
  },
  {
    path: '/Checkout',
    name: 'CheckoutPage',
   component: () => import('@/components/CheckoutPage.vue')
  },
  {
    path: '/Orders',
    name: 'OrdersPage',
   component: () => import('@/components/OrdersPage.vue')
  },
  {
    path: '/TrackingPage',
    name: 'TrackingPage',
   component: () => import('@/components/TrackingPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
