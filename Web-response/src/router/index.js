import Vue from 'vue'
import Router from 'vue-router'
import Entry from '@/pages/Entry'
import Home from '@/pages/home'
import NewsDetail from '@/pages/newsDetail'
import OnLineCar from '@/pages/carOnLine'
import AboutUs from '@/pages/aboutUs.vue'
import Jobs from '@/pages/jobs.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'entry',
      component: Entry,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        {
          path: 'newsDetail',
          component: NewsDetail,
        },
        {
          path: 'onlineCar',
          component: OnLineCar,
        },
        {
          path: 'aboutUs',
          component: AboutUs,
        },
        {
          path: 'jobs',
          component: Jobs,
        }
      ]
    }
  ]
})
