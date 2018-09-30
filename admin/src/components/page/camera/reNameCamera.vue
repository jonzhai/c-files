<template>
    <div class="product-detail">
        <el-form ref="form" class="form-container" :model="form" :rules="rules"  label-width="0px">
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">设备名称 <span class="red">*</span></div>
                         <el-form-item
                            prop="deviceName"
                          >
                            <el-input v-model="form.deviceName" placeholder="请输入设备名称"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
              
            </el-row>
        </el-form>
        <div class="control">
            <el-button type="primary" @click="cancel">取消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
        </div>
              
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';

import {alertMixin} from 'src/assets/js/mixin';
export default {
    mixins: [alertMixin],
    props:{
        originData:{
            type: String
        }
    },
    data(){
        return {
            form: {
                deviceName: ''
            },
            rules: {
                deviceName: [
                    { required: true, message: '请输入设备名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ]
            }

        }
    },
    created(){
        this.form.deviceName = this.originData;
    },
    mounted(){
        this.setCurItem('监控');
    },
    methods:{
        //发布产品
        confirm(){
            //先执行Validator验证，验证合格，进入上传

             this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit('add',this.form.deviceName);
                } else {
                    this.myAlert('缺少必填选项，请仔细检查！');
                    return false;
                }
            });
        },
        cancel(){
            this.$emit('add',null);
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
    margin-top: 150px;
    width: 40%;
    position: relative;
    padding: 0 10px;
    .red{
        color: red;
    }
    .form-container{
        margin-top: 10px;
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
    }
    .el-form{
        background-color: #fff;
        padding: 10px;
    }
    .control{
        box-sizing: border-box;
        padding: 10px 20px;
        background-color: #fff;
        text-align: right;
    }

    
}
</style>
