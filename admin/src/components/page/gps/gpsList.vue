<template>
    <div class="product-list">
        <div class="head">
            <span class="allProduct">全部设备</span>
            <el-button type="primary" @click="syncGps">同步设备</el-button>
        </div>
        <div class="content">
             <el-table
                :data="lists"
                border
                style="width: 100%"
                v-loading="loading"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
            >
                <el-table-column
                    prop="id"
                    label="设备编号"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="设备名称"
                    >
                </el-table-column>
                <el-table-column
                    prop="imei"
                    label="设备id"
                     width="200">
                </el-table-column>   
                <el-table-column
                    prop="address"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="toEdit(scope.row)">重命名</el-button>
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
        <div class="add-camera" v-if="editCamera">
            <ReNameGps @add="add" :originData="curCamera.name"></ReNameGps>
        </div>
    </div>
</template>
<script>
// import Pagination from 'src/base/pagination/pagination';
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin';
import ReNameGps from './reNameGps';

export default {
    mixins: [alertMixin],
    data(){
        return {
            lists: [],
            maxPage:0,
            loading: false,
            editCamera: false,
            curPageIndex: 1,
            curCamera: null
        }
    },
    created(){

        this._getLists(1);
        this.setCurItem('Gps');
        
    },
    methods:{
        getPageData(pageIndex){
            //在此获取数据
            this.curPageIndex = pageIndex;
            this._getLists(pageIndex);
        },
        formatCarName(item){
            return item.title.length > 20 ? item.title.substr(0,20)+'...':item.title;
        },
        syncGps(){
            this.loading = true;
             this.$axios.get('/syscGpsData').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this._getLists(1);
                        this.myAlert('同步成功！',null,true);
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
   
        toEdit(item){
            this.editCamera = true;
            this.curCamera = item;
        },
        add(name){
            this.editCamera = false;
            if(!name){
                return;
            }
            this._submitForm(this.curCamera.imei,name)
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
        _getLists(pageNumber){
            this.loading = true;
            this.$axios.get('/getGpsDeviceList',{
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
        _submitForm(deviceId,deviceName){
             this.loading = true;
             let me = this,
                formData = new FormData();
            formData.append('imei',deviceId);
            formData.append('name',deviceName);
            //上传请求
            me.$axios.post('/setGpsDeviceName ', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then(function (res) {
                if(res.status === 200){
                    if(res.data.code > 0){
                        me.myAlert('更改成功！',function(){
                            me._getLists(me.curPageIndex);
                        },true)
                    }else{
                        me.myAlert(res.data.message)
                    }
                } 
                 me.loading = false;
            }).catch(function (error) {
                console.log(error);
            });
        },
    },
    components:{
       ReNameGps
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
    .add-camera{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        // align-items: center;
    }
    .pagination-container{
        position: absolute;
        bottom: 50px;
        left: 50%;
        z-index: 999;
        transform: translate3d(-50%,0,0);
    }
    .progressBar-container{
        position: fixed;
        bottom: 20%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
        width:60%;
    }
}
</style>
