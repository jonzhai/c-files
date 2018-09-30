// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js';
import axios from 'axios';
import fastclick from 'fastclick';
import VueLazyload from 'vue-lazyload';
// import VueRouter from "vue-router";
Vue.config.productionTip = false
// Vue.use(VueRouter);
fastclick.attach(document.body);
Vue.use(VueLazyload, {
	loading: require('@/assets/logo.png')
  })
Vue.prototype.$axios = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
	axios,
	store,
  components: { App },
  template: '<App/>'
})
