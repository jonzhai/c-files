import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js';

import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题

import filters from 'src/assets/js/commonFilters'
//注册全局过滤器
for (let key in filters) {
    Vue.filter(key, filters[key])
}

Vue.use(ElementUI, { size: 'small' });
Vue.config.productionTip = false;


const API_ROOT = process.env.API_ROOT;
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; //设置cross跨域 并设置访问权限 允许跨域携带cookie信息    
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.adminToken) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `${store.state.adminToken}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器

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
                        store.dispatch('LOGOUT');
                    })


            }
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });
Vue.prototype.$axios = axios;
new Vue({
    el: '#app',
    router,
    axios,
    store,
    components: { App },
    template: '<App/>'
})