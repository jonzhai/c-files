// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import '@/assets/style/base.css'
Vue.config.productionTip = false


const API_ROOT = process.env.API_ROOT;
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; 
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
Vue.prototype.$photoIp = process.env.PHOTO_IP;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
