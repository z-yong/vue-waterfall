import Vue from 'vue'
import VueRouter from 'vue-router'
import Waterfall from '../views/waterfall.vue'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/waterfall',
      name: 'Waterfall',
      component: Waterfall
    },
  ]

const router = new VueRouter({
  routes
})

export default router
