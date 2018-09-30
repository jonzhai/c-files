<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="false" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title" @click="toDetail(item)">{{ item.title }}</span>
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" @click="toDetail(subItem)">
                            {{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                items: [
                    {
                        // icon: 'el-icon-setting',
                        index: '1',
                        title: '系统信息',
                        to:'/systemMsgList',
                        subs: [
                            {
                                index: '11',
                                title: '信息列表',
                                to:'/systemMsgList'
                            },
                             {
                                index: '12',
                                title: '发布通知',
                                to:'/SystemMsgNew'
                            }
                        ]
                    },
                    {
                        // icon: 'el-icon-tickets',
                        index: '2',
                        title: '产品管理',
                        to:'/productList',
                         subs: [
                            {
                                index: '21',
                                title: '产品列表',
                                to:'/productList'
                            },
                             {
                                index: '22',
                                title: '上新产品',
                                to:'/addProduct'
                            }
                        ]
                    },
                    {
                        // icon: 'el-icon-message',
                        index: '3',
                        title: '订单管理',
                        to:'/userList',
                         subs: [
                            {
                                index: '31',
                                title: '订单列表',
                                to:'/orderList'
                            }
                        ]
                    },
                    {
                        // icon: 'el-icon-date',
                         index: '4',
                        title: '用户管理',
                        to:'/userList',
                        subs: [
                            {
                                 index: '41',
                                title: '用户列表',
                                 to:'/userList'
                            }
                        ]
                    },
                    {
                        // icon: 'el-icon-star-on',
                        
                        index: '5',
                        title: '卖车管理',
                        to:'/carsList',
                         subs: [
                            {
                                index: '51',
                                title: '车辆列表',
                                to:'/carsList'
                            },
                             {
                                index: '52',
                                title: '添加车辆',
                                to:'/addCar'
                            }
                        ]
                    },
                    {
                        // icon: 'el-icon-rank',
                        index: '6',
                        title: '广告管理',
                        to:'/adsList',
                        subs: [
                            {
                                index: '61',
                                title: '广告列表',
                                to:'/adsList'
                            }
                        ]
                    },
                    {
                        index: '7',
                        icon: 'el-icon-error',
                        title: '404页面'
                    }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            
        },
        methods:{
            toDetail(item){
                this.$router.push({path: item.to})
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
