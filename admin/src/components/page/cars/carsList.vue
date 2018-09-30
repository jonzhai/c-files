<template>
    <div class="product-list">
        <div class="head">
            <span class="allProduct">全部产品</span>
            <el-button type="primary" @click="toAdd">新增产品</el-button>
            <!-- <router-link tag="button" class="btn btn-primary" to="/home/addCar" @click.native="setCurItem('添加车辆')">添加车辆</router-link> -->
        </div>
        <div class="content">
             <el-table
                :data="lists"
                border
                style="width: 100%"
                v-loading="loading"
            >
                <!-- :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"> -->
                <el-table-column
                    prop="id"
                    label="车辆编号"
                    width="100">
                </el-table-column>
                <el-table-column
                :formatter="formatCarName"
                    label="车辆名称"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="sellPrice"
                    label="售价（万）"
                     width="100">
                </el-table-column>   
                <el-table-column
                    prop="mileage"
                    label="公里数（公里）"
                     width="180">
                </el-table-column>
                <el-table-column
                    :formatter="formatCarName"
                    label="标题">
                </el-table-column>
                
                <el-table-column
                    prop="address"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="toDetail(scope.row.id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-count ="maxPage"
                v-if="maxPage > 1"
                @current-change="getPageData"
                 :current-page="curPage"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
// import Pagination from 'src/base/pagination/pagination';
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin';

export default {
    mixins: [alertMixin],
    data(){
        return {
            lists: [],
            maxPage:0,
            loading: false,
            curPage: 1
        }
    },
    created(){
        if (this.$route.query.curPage){
            this.curPage = this.$route.query.curPage;
        }
        this._getLists(this.curPage);
        this.setCurItem('车辆列表');
        
    },
    methods:{
        getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
        formatCarName(item){
            return item.title.length > 20 ? item.title.substr(0,20)+'...':item.title;
        },
        toAdd(){
            this.$router.push({path: '/addCar'})
        },
        toDetail(Id){
            this.$router.push({path: '/carDetail',query:{id: Id,curPage: this.curPage}})
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
        _getLists(pageNumber){
            this.loading = true;
            this.$axios.get('/getSellCars',{
                params:{
                   pageNumber: pageNumber,
                   pageSize: 12
                }
            }).then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists = res.data.data.list;
                        this.maxPage = res.data.data.pages;
                        this.curPage = res.data.data.pageNum;
                    }else{
                        this.myAlert(res.data.message);
                        return;
                    }
                } 
                this.loading = false;
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
        .table{
            width: 100%;
            th{
                background-color: #eee;
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
