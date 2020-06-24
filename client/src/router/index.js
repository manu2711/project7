import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/compose',
    name: 'Compose',
    component: () => import('../views/Compose.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/articles/:id',
    name: 'Articles',
    component: () => import('../views/Articles.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
