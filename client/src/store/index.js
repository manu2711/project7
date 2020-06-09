import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {}
  },
  mutations: {
    AUTH_REQUEST (state) {
      state.status = 'loading'
    },
    AUTH_SUCCESS (state, token, user) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    AUTH_ERROR (state) {
      state.status = 'error'
    },
    LOGOUT (state) {
      state.status = ''
      state.token = ''
      state.user = {}
    }
  },
  actions: {
    login ({ commit }, user) {
      commit('AUTH_REQUEST')

      axios
        .post('http://localhost:3000/api/users/login', {
          email: user.email,
          password: user.password
        })
        .then(result => {
          // console.log(result)
          const token = result.data.token
          const user = result.data.user
          console.log(user)
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          axios.defaults.headers.common['Authorization'] = token
          commit('AUTH_SUCCESS', { token: token, user: user })
        })
        .catch(error => {
          commit('AUTH_ERROR')
          localStorage.removeItem('token')
          console.log(error)
        })
    },
    register ({ commit }, user) {
      commit('AUTH_REQUEST')

      axios
        .post('http://localhost:3000/api/users/register', {
          name: user.name,
          email: user.email,
          password: user.password
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error.response.data.error)
        })
    },
    logout ({ commit }) {
      return new Promise(resolve => {
        commit('LOGOUT')
        localStorage.clear()
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  modules: {},
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
})
