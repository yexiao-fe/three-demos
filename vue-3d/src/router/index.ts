import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import InitPage from '../views/InitPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'InitPage',
    component: InitPage
  },
  {
    path: '/PeriodicTable',
    name: 'PeriodicTable',
    component: () => import('../views/PeriodicTable.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
