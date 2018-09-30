<template>

    
    <div class="product-list">
        <div class="head">
            <span class="allProduct">全部产品</span>
            <!-- <router-link tag="button" class="btn btn-primary" to="/home/addProduct" @click.native="setCurItem('上新产品')">上新产品</router-link> -->
             <el-button type="primary" @click="toAdd">新增产品</el-button>
        </div>
         <el-table
            :data="lists"
            border
            style="width: 100%"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            v-loading="loading"
        >
            <el-table-column
                prop="id"
                label="产品编号"
                width="180"
            >
            </el-table-column>
            <el-table-column
                :formatter="formatPName"
                label="产品名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="crowdPrice"
                label="众筹额度">
            </el-table-column>   
            <el-table-column
                :formatter="formatRole"
                label="众筹进度">
            </el-table-column>
            <el-table-column
                prop="inversCycle"
                label="投资周期">
            </el-table-column>
            <el-table-column
                :formatter="formatAnnualEarn"
                label="年化收益率">
            </el-table-column>
            <el-table-column
                prop="category.name"
                label="投资分类">
            </el-table-column>
            <el-table-column
                :formatter="formatStatus"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="toDetail(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
      
        <div class="pagination-container" >
            <el-pagination
                background
                layout="prev, pager, next"
                :page-count ="maxPage"
                v-if="maxPage > 1"
                @current-change="getPageData"
                :current-page="curPage"
            >
            </el-pagination>
            <!-- <pagination :maxPage="maxPage" @getPage="getPageData" v-show=" maxPage > 1"></pagination> -->
        </div>
    </div>
</template>
<script>
// import {addClass,delClass,hasClass}from 'src/assets/js/dom';
// import Pagination from 'src/base/pagination/pagination';
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
export default {
    data(){
        return {
            lists: [],
            maxPage: 0,
            loading: false,
            curPage: 1
        }
    },
    created(){
        if (this.$route.query.curPage){
            this.curPage = this.$route.query.curPage;
        }
        this._getLists(this.curPage);
    },
     mounted(){
        setTimeout(()=>{
            this.setCurItem('产品列表');

        },20)
    },
    methods:{
        getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
        formatRole(item){
            return ((1-item.remainCrowdPrice/item.crowdPrice)*100).toFixed(2) + '%';
        },
         formatStatus(item){
            return item.crowdStatus === -1 ? '待售中' : item.crowdStatus === 0 ? '销售中' : '众筹完毕'
        },
        formatAnnualEarn(item){
            return (item.annualEarn*100).toFixed(2)+'%';
        },
        formatPName(item){
            return item.pName.length > 10 ? item.pName.substr(0,10)+'...' : item.pName;
        },
        toAdd(){
            this.$router.push({path: '/addProduct'})
        },
        toDetail(pId){
            this.$router.push({path: '/productDetail',query:{id: pId,curPage: this.curPage}})
        },
        _getLists(pageNumber){
            this.loading = true;
            this.$axios.get('/getProductList',{
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
                        // console.log( this.maxPage )   
                    }else{
                        console.log(res.data.message)
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
        justify-content: space-between;
        margin-bottom: 10px;
        .allProduct{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
    }
  
    .pagination-container{
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translate3d(-50%,0,0);
    }
   
    .textCenter{
         text-align: center;
    }
   
}
</style>
