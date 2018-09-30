<template>
    <div class="product-list">
        <div class="head">
            <span class="allProduct">全部广告</span>
            <!-- <router-link tag="button" class="btn btn-primary" to="/home/addAd" @click.native="setCurItem('添加车辆')">添加车辆</router-link> -->
        </div>
        <div class="content">
            <table class="table table-bordered table-hover">
                <tr>
                    <th>广告区块</th>
                    <th>操作</th>
                </tr>
                <tr v-for="(item,index) in lists" :key="index">
                    <td>{{item.name}}</td>
                    <router-link tag="td" class="text-primary"  :to="{ path:'/adDetail', query: { id:  item.id, whRatio: item.whratio} }" style="cursor:pointer;color:#409EFF">详细</router-link>
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
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
export default {
    data(){
        return {
            lists: [],
            maxPage:0
        }
    },
    created(){

        this._getLists(1);
         this.setCurItem('广告列表');
        
    },
    methods:{
        getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
        _getLists(pageNumber){
            this.$axios.get('/getAdvertiseItemList ',{
                params:{
                   pageNumber: pageNumber,
                   pageSize: 15
                }
            }).then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists = res.data.data.list;
                        this.maxPage = res.data.data.pages;

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
                &:first-child{
                    width: 70%;
                }
            }
            th,td{
                text-align: center;
                border: 1px solid #000;
                font-size: 16px;
                padding: 5px 16px;
            }
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
