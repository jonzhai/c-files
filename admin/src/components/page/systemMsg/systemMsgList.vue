<template>
    <div class="msg-list-container">
        <div class="head">
            <span class="allProduct">全部产品</span>
            <el-button type="primary" @click="toAdd">发布新通知</el-button>
            <!-- <router-link tag="button" class="btn btn-primary" to="" @click.native="setCurItem('发布通知')">发布新通知</router-link> -->
        </div>
        <div class="msg-list">
            <el-table
                :data="lists"
                border
                style="width: 100%"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                v-loading="loading"
            >
                <el-table-column
                    prop="title"
                    label="通知标题"
                    width="">
                </el-table-column>
                <el-table-column
                    label="发布时间"
                    :formatter="formatDate"
                    width="360">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="操作"
                    width="180">
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
            maxPage:1,
            loading: false
        }
    },
    created(){
        this._getLists(1);
        this.setCurItem('信息列表');
        
    },
    mounted(){
    },
    methods:{
         getPageData(pageIndex){
            //在此获取数据
            this._getLists(pageIndex);
        },
        toAdd(){
            this.$router.push({path: '/systemMsgNew'})
        },
        formatDate(item){
            let date = new Date(item.createTime);
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        },
        toDetail(id){
            this.$router.push({path: '/systemMsgDetail',query:{id: id}})
        },
        _getLists(pageNumber){
            this.loading = true;
            this.$axios.get('/getSysMessages',{
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
.msg-list-container{
    .head{
        height: 30px;
        display: flex;
        justify-content: space-between;
        .allProduct{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
    }
     .msg-list{
        margin-top: 20px;
        .table{
            width: 100%;
            th{
                background-color: #eee;
                &:first-child{
                    width: 70%;
                }
                &:last-child{
                    width: 10%;
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

