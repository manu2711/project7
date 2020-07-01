import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () =>
      import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if (store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    beforeEnter: (to, from, next) => {
      if (store.getters.isLoggedIn) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/compose',
    name: 'Compose',
    component: () =>
      import(/* webpackChunkName: "compose" */ '../views/Compose.vue'),
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
    component: () => import(/* webpackChunkName: "edit" */ '../views/Edit.vue'),
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
    component: () =>
      import(/* webpackChunkName: "articles" */ '../views/Articles.vue'),
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
    component: () =>
      import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
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
