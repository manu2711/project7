import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: window.localStorage.getItem('token') || null,
    user: JSON.parse(window.localStorage.getItem('user')) || null
  },
  mutations: {
    AUTH_REQUEST (state) {
      state.status = 'loading'
    },
    AUTH_SUCCESS (state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    AUTH_ERROR (state) {
      state.status = 'error'
      state.token = null
      state.user = null
    },
    LOGOUT (state) {
      state.status = 'logged out'
      state.token = null
      state.user = {
        id: '',
        isAdmin: false,
        name: ''
      }
    }
  },
  actions: {
    // Login in action - sets the token once user is logged in
    login: ({ commit }, user) => {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST')
        axios
          .post('http://localhost:3000/api/users/login', {
            email: user.email,
            password: user.password
          })
          .then(result => {
            const token = result.data.token
            const user = result.data.user
            window.localStorage.setItem('token', `Bearer ${token}`) // Store the token inside localStorage
            window.localStorage.setItem('user', JSON.stringify(user))
            commit('AUTH_SUCCESS', { token, user })
            resolve(result)
          })
          .catch(error => {
            console.log(error)
            commit('AUTH_ERROR', error)
            window.localStorage.removeItem('token')
            reject(error.response.data.message)
          })
      })
    },
    // Register action
    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('AUTH_REQUEST')
        axios
          .post('http://localhost:3000/api/users/register', {
            name: user.name,
            email: user.email,
            password: user.password
          })
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response.data.error)
          })
      })
    },
    // Logout action
    logout ({ commit }) {
      return new Promise(resolve => {
        commit('LOGOUT')
        window.localStorage.clear()
        resolve()
      })
    }
  },
  modules: {},
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isAdmin: state => {
      if (state.user.isAdmin === 'true') {
        return true
      }
    },
    userName: state => {
      if (state.user.name) return state.user.name
    },
    userId: state => {
      if (state.user.id) return state.user.id
    }
  }
})
