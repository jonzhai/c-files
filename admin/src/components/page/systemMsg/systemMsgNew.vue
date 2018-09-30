<template>
    <div class="product-detail">
        <div class="head">
            <div class="head-left">
               <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
                <span class="allInfo">全部通知</span>
            </div>
            <div class="head-right">
                <el-button type="primary" @click="publish">发布通知</el-button>
            </div>
        </div>
        <el-form ref="form" class="form-container" :model="form" :rules="rules"  label-width="0px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">通知标题 <span class="red">*</span></div>
                        <el-form-item
                            prop="title"
                        >
                            <el-input v-model="form.title" name="title"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
                <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">通知类型</div>
                        <el-form-item prop="typeId">
                            <el-select v-model="form.typeId" name="typeId" placeholder="请选择通知类型">
                                <el-option  v-for="(item,index) in types" :key="index" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">项目介绍</div>
                        <el-form-item
                            prop="content"
                        >
                            <el-input type="textarea" v-model="form.content" rows="10" name="content"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin';
import {appendFormToFormData} from 'src/assets/js/tools'

export default {
    mixins: [alertMixin],
    data(){
        return {
            types:[],
            form:{
                title: '',
                typeId: '',
                content: ''
            },
            rules: {
                title: [
                    { required: true, message: '请输入通知标题', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                typeId:[
                    { required: true, message: '请输选择通知类型', trigger: 'change' }
                ],
                content:[
                    { required: true, message: '请输入通知类容', trigger: 'blur' },
                    { min: 1, max: 70, message: '长度在 1 到 70 个字符', trigger: 'blur' }
                ]
            }

        }
    },
    created(){
        //获取商品类别
        this._getMsgType();
    },
    mounted(){
        this.setCurItem('发布通知');
    },
    methods:{
        //发布产品
        publish(){
             this.$refs.form.validate((valid) => {
                if (valid) {
                    this._submitForm();
                } else {
                    this.myAlert('缺少必填选项，请仔细检查！');
                    return false;
                }
            });
        },
        goBack(){
            this.$router.push({path: '/systemMsgList'});
            this.setCurItem('统计信息');
        },
        _submitForm(){
            let me = this;
            let formData = new FormData();
            appendFormToFormData(me.form,formData);
            //上传请求
            me.$axios.post('/addSysMessage', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then(function (response) {
                if(response.data.code > 0){
                    me.myAlert('发布成功！',()=>{
                        me.$router.replace({path:'/systemMsgList'});
                    },true);
                }else{
                    me.myAlert(response.data.message);
                }
            }).catch(function (error) {
               console.log(error);
            });
            

        },
        _getMsgType(){
             this.$axios.get('/getMessageType').then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.types = res.data.data;
                    }else{
                        this.myAlert(res.message)
                        return;
                    }
                } 
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
.product-detail{
    width: 100%;
    position: relative;
    padding: 0 10px;
    .el-select{
        width: 100%;
    }
    .el-date-editor{
        width: 100%;
    }
    .el-form-item__label{
        text-align: left;
        display: block;
        width: 100%;
    }
    .head{
        height: 30px;
        width: 50%;
        display: flex;
        justify-content: space-between;
        .head-left{
            display: flex;
            align-items: center;
            .back-icon{
                font-size: 32px;
                cursor: pointer;
            }
            .allProduct{
                width: 200px;
                border-bottom: 1px solid #000; 
            }
        }
        .head-right{
            margin-right: 30px;
        }
        
        
      
    }
    .form-container{
        margin-top: 10px;
    }
    
}
</style>

