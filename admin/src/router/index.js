import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children: [{
                    path: 'productList',
                    component: resolve => require(['../components/page/product/productList.vue'], resolve),
                    meta: { title: '产品列表' }
                },
                {
                    path: '/productDetail',
                    component: resolve => require(['../components/page/product/productDetail.vue'], resolve),
                    meta: { title: '产品详情' }
                },
                {
                    path: '/eidtProduct',
                    name: 'eidtProduct',
                    component: resolve => require(['../components/page/product/eidtProduct.vue'], resolve),
                    meta: { title: '编辑产品' }
                },
                {
                    path: 'addProduct',
                    component: resolve => require(['../components/page/product/addProduct.vue'], resolve),
                    meta: { title: '增加产品' }
                },
                {
                    path: '/userList',
                    component: resolve => require(['../components/page/userManage/userList.vue'], resolve),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/userDetail',
                    component: resolve => require(['../components/page/userManage/userDetail.vue'], resolve),
                    meta: { title: '用户详情' }
                },
                {
                    path: '/systemMsgList',
                    component: resolve => require(['../components/page/systemMsg/systemMsgList.vue'], resolve),
                    meta: { title: '系统消息列表' }
                },
                {
                    path: '/systemMsgDetail',
                    component: resolve => require(['../components/page/systemMsg/systemMsgDetail.vue'], resolve),
                    meta: { title: '系统消息详情' }
                },
                {
                    path: '/systemMsgNew',
                    component: resolve => require(['../components/page/systemMsg/systemMsgNew.vue'], resolve),
                    meta: { title: '新增消息' }
                },
                {
                    path: '/orderList',
                    component: resolve => require(['../components/page/order/orderList.vue'], resolve),
                    meta: { title: '订单列表', permission: true }
                },
                {

                    path: '/orderDetail',
                    component: resolve => require(['../components/page/order/orderDetail.vue'], resolve),
                    meta: { title: '订单详情' }
                },
                {
                    path: '/carsList',
                    component: resolve => require(['../components/page/cars/carsList.vue'], resolve),
                    meta: { title: '汽车列表' }
                },
                {
                    path: '/addCar',
                    component: resolve => require(['../components/page/cars/AddCar.vue'], resolve),
                    meta: { title: '新增汽车' }
                },
                {

                    path: '/carDetail',
                    component: resolve => require(['../components/page/cars/carDetail.vue'], resolve),
                    meta: { title: '汽车详情' }
                },
                {
                    path: '/editCar',
                    name: 'editCar',
                    component: resolve => require(['../components/page/cars/editCar.vue'], resolve),
                    meta: { title: '编辑汽车' }
                },
                {
                    path: '/adsList',
                    component: resolve => require(['../components/page/ads/adsList.vue'], resolve),
                    meta: { title: '广告列表' }
                },
                {
                    path: '/adDetail',
                    component: resolve => require(['../components/page/ads/adDetail.vue'], resolve),
                    meta: { title: '广告详情' }
                },
                {
                    path: '/addAd',
                    component: resolve => require(['../components/page/ads/addAd.vue'], resolve),
                    meta: { title: '添加广告' }
                },
                {
                    path: '/editAd',
                    name: 'editAd',
                    component: resolve => require(['../components/page/ads/editAd.vue'], resolve),
                    meta: { title: '编辑广告' }
                },
                {
                    path: '/cameraList',
                    name: 'cameraList',
                    component: resolve => require(['../components/page/camera/cameraList.vue'], resolve),
                    meta: { title: '监控' }
                },
                {
                    path: '/gpsList',
                    name: 'gpsList',
                    component: resolve => require(['../components/page/gps/gpsList.vue'], resolve),
                    meta: { title: 'gps' }
                },
            ]
        },

        // {
        //     path: '/404',
        //     component: resolve => require(['../components/page/404.vue'], resolve)
        // },
        // {
        //     path: '/403',
        //     component: resolve => require(['../components/page/403.vue'], resolve)
        // },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})