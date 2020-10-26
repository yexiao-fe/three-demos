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
    // 元素周期表
    path: '/PeriodicTable',
    name: 'PeriodicTable',
    component: () => import('../views/PeriodicTable.vue')
  },
  {
    // 小精灵
    path: '/SmallSprites',
    name: 'SmallSprites',
    component: () => import('../views/SmallSprites.vue')
  },
  {
    // 分子结构
    path: '/MolecularStructure',
    name: 'MolecularStructure',
    component: () => import('../views/MolecularStructure.vue')
  },
  {
    // 网格图
    path: '/LineWireframe',
    name: 'LineWireframe',
    component: () => import('../views/LineWireframe.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
