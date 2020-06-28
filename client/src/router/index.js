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
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/Admin.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "register" */ '../views/Register.vue')
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
    path: '/edit/:id',
    name: 'Edit',
    component: () => import('../views/Edit.vue'),
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
    path: '/profile',
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
