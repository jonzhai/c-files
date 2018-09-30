<template>
    <div class="sidebar">
         <ul >
            <li  v-for="(item,index) in treeData" :key="index" class="parentNode" :class="{active: item.open,firstActive: item.open === undefined && index === 0 && curItem === '统计信息'}">
                <p class="treeItem" @click="toggleList(item)"><span>{{item.desc}}</span><span class="el-icon-arrow-down iconfont" v-if="item.open"></span><span class="el-icon-arrow-right iconfont" v-if="!item.open"></span></p>
                <ul>
                    <li  v-for="(innerItem,innerIndex) in item.children" :key="innerIndex" class="childNode" :class="{active:curItem === innerItem.desc }" @click="toggleActive(innerItem.desc)">
                        <router-link tag="p" class="treeItem" :to="innerItem.to">{{innerItem.desc}}</router-link>
                    </li>
                </ul>
            </li>
        </ul>  
    </div>
</template>

<script>
    import {mapGetters, mapActions,mapMutations} from 'vuex';
    import * as types from 'src/store/mutationTypes';
    export default {
        data() {
            return {
                 treeData:[
                    {
                        desc: "系统信息",
                        open: false,
                        to:'/systemMsgList',
                        children:[
                            {desc: '信息列表',to:'/systemMsgList'},
                            {desc: '发布通知',to:'/SystemMsgNew'}
                        ]
                    },
                    {
                        desc: "产品管理",
                        // open: true,
                        to:'/productList',
                        children:[
                            {desc: '产品列表',to:'/productList'},
                            {desc: '上新产品',to:'/addProduct'}
                        ]
                    },
                    {
                        desc: "订单管理",
                        // open: false,
                        to:'/orderList',
                        children:[
                            {desc: '订单列表',to:'/orderList'}
                        ]
                    },
                    {
                        desc: "用户管理",
                        // open: false,
                        to:'/userList',
                        children:[
                            {desc: '用户列表',to:'/userList'},
                        ]
                    },
                    {
                        desc: "卖车管理",
                        // open: true,
                        to:'/carsList',
                        children:[
                            {desc: '车辆列表',to:'/carsList'},
                            {desc: '添加车辆',to:'/addCar'}
                        ]
                    },
                    {
                        desc: "广告管理",
                        // open: false,
                        to:'/adsList',
                        children:[
                            {desc: '广告列表',to:'/adsList'}
                            // {desc: '广告编辑',to:'/addAd'}
                        ]
                    },
                    {
                        desc: "设备管理",
                        // open: false,
                        to:'/cameraList',
                        children:[
                            {desc: '监控',to:'/cameraList'},
                            {desc: 'Gps',to:'/gpsList'},
                        ]
                    }

                ],
            }
        },
         computed: {
            ...mapGetters(['curItem'])
        },
        created(){
        },
        mounted(){
            setTimeout(()=>{
                //当刷新系统时，保持当前目录打开状态
                if(this.curItem){
                    this.treeData.forEach(element => {
                        element.children.forEach(item => {
                            if(item.desc === this.curItem){
                                this.toggleList(element,true);
                                this.toggleActive(item.desc);
                            }
                        })
                    });
                }
            },20)
        },
        methods:{
            //点击切换父级列表
            toggleList(item,tag){
                // tag标志位，当刷新系统时需要使用
                if(typeof item.open === "undefined"){
                    this.$set(item, 'open', true );
                }else{
                    item.open = !item.open;
                }
                if(item.open && !tag){
                    this.$router.push({path: item.to});
                    this.setCurItem(item.children[0].desc);
                }
            
            },
            //点击切换子项时，切换高亮状态
            toggleActive(item){
                this.setCurItem(item);
            },
            ...mapMutations({
                setCurItem: types.SET_CURITEM
            })
        }
    }
</script>

<style lang="scss" scoped>
.sidebar{
    display: block;
    position: absolute;
    left: 0;
    width: 250px;
    top: 70px;
    bottom:0;
    overflow-y: scroll;
    background-color: rgb(50, 65, 87);
    color: rgb(191, 203, 217);
}
.parentNode{
    .treeItem{
        display: block;
        box-sizing: border-box;
        // text-align: center;
        height: 50px;
        padding: 0 30px;
        line-height: 50px;
        margin: 0;
        cursor: pointer;
        &:hover{
            background-color: #242f42;
        }
    }
    >.treeItem{
        border: none;
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        .iconfont{
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translate3d(0,-50%,0);
        }
    }
    >ul{
        display: none;
        border: none;
        
        .active{
            color: rgb(32, 160, 255);
        }
    }
    &.active>span{
        background-color: #f0ad4e;
    }
    &.active >ul{
        display: block;
    }
    &.firstActive >ul{
        display: block;
    }
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

