<template>
    <div class="user-list">
        <div class="head">
            <span class="allUser">全部用户</span>
        </div>
        <div class="content">
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
                    label="用户编号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="idCard"
                    label="实名">
                </el-table-column>   
                <el-table-column
                    prop="phone"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="investTotalPrice"
                    label="累计投资">
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
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin';
export default {
     mixins: [alertMixin],
    data(){
        return {
            lists:[ ],
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
        this.setCurItem('用户列表');
    },
    methods:{
        getPageData(pageIndex){
            //在此获取数据
            // console.log(pageIndex)
            this._getLists(pageIndex);
        },
        toDetail(id){
            this.$router.push({path: '/userDetail',query:{id: id,curPage: this.curPage}})
        },
         _getLists(pageNumber){
             this.loading = true;
            this.$axios.get('/getUsers',{
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
        // Pagination
    }
}
</script>

<style lang="scss" scoped>
.user-list{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 20px;
    .head{
        height: 30px;
        display: flex;
        .allUser{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
    }
    .content{
        margin-top: 20px;
        padding: 0;
        table{
            width: 100%;
            th{
                background-color: #eee;
            }
            th,td{
                text-align: center;
                border: 1px solid #000;
                font-size: 16px;
                padding: 5px 30px;
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
