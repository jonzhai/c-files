<template>
    <div class="product-list">
        <div class="head">
            <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
            <span class="allProduct">全部广告</span>
             <el-button type="primary" @click="toAdd">添加广告</el-button>
            <!-- <router-link tag="button" class="btn btn-primary" :to="{path: '/home/addAd',query:{id: id ,whRatio: whRatio}}">添加广告</router-link> -->
        </div>
        <div class="content">
            <table class="table table-bordered table-hover">
                <tr>
                    <th>图片</th>
                    <th>链接</th>
                    <th>操作</th>
                </tr>
                <tr v-for="(item,index) in lists" :key="index">
                    <td>
                        <a :href="item.href">
                            <img :src="item.image ? item.image.photoIp+item.image.src : ''" alt="" class="item-img">
                        </a>
                    </td>
                    <td>{{item.href}}</td>
                    <td>
                        <router-link tag="span" class="text-operate"  :to="{ name: 'editAd', params: { ad:  item},query:{id: item.id, moduleId:id, whRatio: whRatio} }" style="cursor:pointer">编辑</router-link>
                        <span  class="text-operate" style="cursor:pointer"  @click="delFile(item.id,index)">删除</span>
                    </td>
                    <!-- <td >详细</td> -->
                </tr>
            </table>
        </div>
          <div class="pagination-container">
            <!-- <pagination :maxPage="maxPage" @getPage="getPageData" v-show=" maxPage > 1"></pagination> -->
        </div>
    </div>
</template>
<script>
// import Pagination from 'src/base/pagination/pagination';

import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
export default {
    data(){
        return {
            lists: [],
            maxPage:0,
            id: '',
            whRatio: ''
            
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.whRatio = this.$route.query.whRatio;
        this._getAdsDetail( this.id);
        //  this.setCurItem('车辆列表');
        
    },
    methods:{
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
        getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
          //删除文件
        delFile(id,index){
             this.$axios.get('/delectAdvertiseImage ',{
                params:{
                   id: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists.splice(index,1);
                        alert('删除成功！')
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
         goBack(){
            // this.$router.push({path: '/home/adsList'});
            // this.setCurItem('广告列表');
             this.$router.back();
        },
        toAdd(){
            this.$router.push({path: '/addAd',query:{moduleId: this.id ,whRatio: this.whRatio}})
        },
        _getAdsDetail(id){
            this.$axios.get('/getAdvertiseImageByItemId ',{
                params:{
                   itemId: id
                }
            }).then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists = res.data.data.list;
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        }
    },
    components:{
        // Pagination
    }
}
</script>

<style lang="scss" scoped>
.product-list{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 20px;
    .head{
        height: 30px;
        display: flex;
         .back-icon{
            font-size: 32px;
            cursor: pointer;
        }
        .allProduct{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
    }
    .content{
        margin-top: 20px;
        background-color: #fff;
        .table{
            width: 100%;
            border-collapse: collapse;
            th{
                background-color: #eee;
                &:last-child{
                    width: 20%;
                }
            }
            th,td{
                text-align: center;
                border: 1px solid #000;
                font-size: 16px;
                padding: 5px 16px;
            }
        }
        .text-operate{
            color:#409EFF;
        }
        .item-img{
            // height: 80px;
            // max-width: 100%;
            width: 200px;
        }
    }
    .pagination-container{
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translate3d(-50%,0,0);
    }
}
</style>
