import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue } from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueQuillEditor from 'vue-quill-editor'
import Vuelidate from 'vuelidate'

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

const VueTruncate = require('vue-truncate-filter')

Vue.use(BootstrapVue)
Vue.use(VueAxios, Axios)
Vue.use(VueTruncate)
Vue.use(VueQuillEditor)
Vue.use(Vuelidate)

Vue.config.productionTip = false

Axios.interceptors.request.use(
  config => {
    config.headers.authorization = window.localStorage.getItem('token')
    return config
  },
  error => Promise.reject(error)
)

Axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    store.dispatch('logout')
  }
  return Promise.reject(error)
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
