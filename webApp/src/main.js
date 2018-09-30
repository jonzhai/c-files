// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js';
import axios from 'axios';
import fastclick from 'fastclick';
// import VueLazyload from 'vue-lazyload';
import filters from 'src/assets/js/commonFilters';
//引入videojs样式
// import 'video.js/dist/video-js.css'
//自定义的样式
import 'src/assets/style/alert.scss';
import { Alert, Toast } from 'src/assets/js/common'
Vue.prototype.$alert = Alert;
Vue.prototype.$toast = Toast;
// import 'src/assets/js/common'
//注册全局过滤器
for (let key in filters) {
    Vue.filter(key, filters[key])
}

Vue.config.productionTip = false

//fastclick解决300毫秒延迟问题
fastclick.attach(document.body);

//懒加载方案
// Vue.use(VueLazyload, {
//     loading: require('src/assets/img/loading.gif')
// })

//配置全局axios
const API_ROOT = process.env.API_ROOT;
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true; //设置cross跨域 并设置访问权限 允许跨域携带cookie信息    
// http request 拦截器
axios.interceptors.request.use(
    config => {
        if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = `${store.state.token}`;
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
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    store.dispatch('LOGOUT');
                    router.replace({ path: '/login' });
                    // Alert('登录失效，请重新登录！');
                    break;
                    // case 500:
                    //     alert(`服务器发生错误！即将跳转到首页`);
                    //     router.replace({ path: '/home' });
            }
        }
        return Promise.reject(error.response.data) // 返回接口返回的错误信息
    });
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