import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios';
import filters from '@/assets/js/filters';
//注册全局过滤器
for (let key in filters) {
  Vue.filter(key, filters[key])
}

Vue.use(ElementUI)
Vue.use(VueRouter)

//axios默认配置
const API_ROOT = process.env.API_ROOT;
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; 
axios.interceptors.response.use(
  response => {
      return response;
  },
  error => {
      if (error.response) {
          // debugger;
          switch (error.response.status) {
              case 401:
                  // 返回 401 清除token信息并跳转到登录页面
                  router.replace({ path: '/login' }, () => {
                      store.dispatch('logout');
                  })


          }
      }
      return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });
Vue.prototype.$axios = axios;

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
    if(to.fullPath !== "/login" && !store.state.account){
        store.dispatch('logout');
        next({path: '/login'});
    }else{
        next();
    }
})

Vue.prototype.$photoIp = process.env.PHOTO_IP;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

