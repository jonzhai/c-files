<template>
    <div class="order-list-container">
        <div class="head">
            <span class="allOrder">全部订单</span>
        </div>
        <div class="order-list">
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
                    label="订单编号"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="产品名称"
                    :formatter="formatPName"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="totalPrice"
                    label="投资金额">
                </el-table-column>   
                <el-table-column
                    prop="inversCycle"
                    label="投资周期">
                </el-table-column>
                <el-table-column
                    prop="annualEarn"
                    label="年化收益率">
                </el-table-column>
                <el-table-column
                    prop="userName"
                    label="投资客户">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="电话">
                </el-table-column>
                <el-table-column
                    :formatter="formatDate"
                    label="提交订单时间">
                </el-table-column>
                <el-table-column
                    prop="location"
                    label="车辆定位">
                </el-table-column>
                <el-table-column
                    prop="progressStatus"
                    label="订单状态">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="toDetail(scope.row.id)">详细</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div> 
        <div class="pagination-container">
            <!-- <pagination :maxPage="maxPage" @getPage="getPageData" v-show=" maxPage > 1"></pagination> -->
             <el-pagination
                background
                layout="prev, pager, next"
                :page-count ="maxPage"
                v-if="maxPage > 1"
                :current-page="curPage"
                @current-change="getPageData"
            >
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin';
export default {
    mixins: [alertMixin],
    data(){
        return {
            lists: [],
            maxPage: 1,
            loading: false,
            curPage: 1
        }
    },
    created(){
        if (this.$route.query.curPage){
            this.curPage = this.$route.query.curPage;
        }
        this._getLists(this.curPage);
        this.setCurItem('订单列表');
        
    },
    methods:{
         getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
        formatDate(item){
            let date = new Date(item.createTime);
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        },
        formatPName(item){
            let len  = item.title.length;
            return  len > 10 ? item.title.substr(0,10)+'...' : item.title;
        },
        toDetail(id){
            this.$router.push({path: '/orderDetail',query:{id: id,curPage: this.curPage}})
        },
        _getLists(pageNumber){
            this.loading = true;
            this.$axios.get('/getOrderList',{
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
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
    },
    components:{
    }
}
</script>

<style lang="scss" scoped>
.order-list-container{
    .head{
        height: 30px;
        display: flex;
        justify-content: space-between;
        .allOrder{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
    }
     .order-list{
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
         .pTitle{
            max-width: 20em;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
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

