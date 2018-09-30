import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'

//news
import NewsList from './views/news/newsList.vue'
import AddNew from './views/news/addNew'
import NewsDetail from './views/news/newDetail.vue'

//ad
import AdsList from './views/ads/adsList.vue'
import AddAd from './views/ads/addAd.vue'

//activitys
import AddAct from './views/activity/addAct.vue'
import ActsList from './views/activity/actsList.vue'

//aboutus
import EditDesc from './views/aboutUs/editDesc.vue'
import EditDream from './views/aboutUs/editDream.vue'
// import DescDetail from './views/aboutUs/descDetail.vue'
import ServersPoints from './views/aboutUs/serversPoints.vue'
import Recruit from './views/aboutUs/recruit.vue'

//上传视频，暂时取消
// import UploadVideo from './views/uploadVideo/uploadVideo.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '新闻管理',
        iconCls: 'fa fa-hacker-news',//图标样式class
        children: [
            { path: '/newsList', component: NewsList, name: '新闻列表' },
            { path: '/newsDetail', component: NewsDetail, name: '新闻详情',hidden:true },
            { path: '/addEditNews', component: AddNew, name: '新增/编辑新闻' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '广告管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/adsList', component: AdsList, name: '广告列表' },
            { path: '/addAd', component: AddAd, name: '添加/编辑广告' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '活动管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/actsList', component: ActsList, name: '活动列表' },
            { path: '/addAct', component: AddAct, name: '添加/编辑活动' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '关于我们',
        iconCls: 'fa fa-address-card',
        // leaf: true,//只有一个节点
        children: [
            { path: '/editDesc', component: EditDesc, name: '编辑简介' },
            { path: '/editDream', component: EditDream, name: '编辑愿景' },
            // { path: '/descDetail', component: DescDetail, name: '简介详情' },
            { path: '/serversPoints', component: ServersPoints, name: '服务点管理' },
            { path: '/recruit', component: Recruit, name: '招聘管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;