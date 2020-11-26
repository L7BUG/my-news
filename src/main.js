import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import '@/plugins/element.js'
// 引入element-ui样式 引入全局css 引入iconfont
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
import '@/assets/font/iconfont.css'

axios.defaults.baseURL = 'http://localhost:8820/api/'
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // config.headers['Content-Type'] = 'text/plain;charset=UTF-8'
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
