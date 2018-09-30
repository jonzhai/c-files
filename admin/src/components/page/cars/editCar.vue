<template>
    <div class="product-detail">
        <div class="head">
            <div class="head-left">
                <i class="el-icon-arrow-left back" @click="goBack"></i>
                <span class="allProduct">全部车辆</span>
            </div>
            <div class="head-right">
                <el-button type="primary" @click="publish">发布车辆</el-button>
            </div>
        </div>
        <el-form ref="form" class="form-container" :model="form" :rules="rules"  label-width="0px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">标题 <span class="red">*</span></div>
                         <el-form-item
                            prop="title"
                          >
                            <el-input v-model="form.title" name="title" placeholder="请输入标题"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                          <div class="el-form-item__label">车类别</div>
                         <el-form-item prop="carType">
                               <el-select v-model="form.carType" name="carType" placeholder="请选择车辆类别">
                                    <el-option  v-for="(item,index) in carTypes" :key="index" :value="item.code" :label="item.name"></el-option>
                                </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
           <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">售价 <span class="red">*</span></div>
                         <el-form-item
                            prop="sellPrice"
                          >
                            <el-input placeholder="输入售价" v-model="form.sellPrice" name="sellPrice">
                                <template slot="append">万元</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">客服电话 <span class="red">*</span></div>
                         <el-form-item
                            prop="customerPhone"
                          >
                            <el-input v-model="form.customerPhone" name="customerPhone" placeholder="输入客服人员号码"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">里程数 <span class="red">*</span></div>
                         <el-form-item
                            prop="mileage"
                          >
                            <el-input placeholder="输入里程数" v-model="form.mileage" name="mileage">
                                <template slot="append">万公里</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">客服热线</div>
                         <el-form-item
                            prop="customerHotPhone"
                          >
                            <el-input v-model="form.customerHotPhone" name="customerHotPhone" placeholder="输入客服热线"> </el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="24">
                    <div class="el-form-item__label">选择地区</div>
                    <Dist-picker @changeDist="changeDist" :EprovinceId="form.provinceId" :EcityId="form.cityId" :EdistrictId="form.districtId"></dist-picker>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="24">
                    <p class="el-form-item__label">注：红色*表示必填选项</p>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="el-form-item__label">上传产品图片</div>
                    <upload-img 
                        @filesChange="changeDescImg"
                        :maxLength="5"
                        :seversImgs="form.carPhoto" 
                        :seversImgsIp="form.photoIp" 
                         @delFile="delFile"
                         @imgLengthChange="photoLengthChange"
                     ></upload-img>
                </el-col>
                <div class="el-form-item__label" style="padding-left:10px">注：图片大小不能超过5M，超过5M自动过滤掉</div>
            </el-row>
           <el-row :gutter="20">
                <el-col :span="24">
                   <h4 class="title">详情</h4>
                </el-col>
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                         <el-form-item
                            prop="carContent"
                          >
                            <el-input type="textarea" v-model="form.carContent" rows="10" name="carContent" placeholder="输入车辆介绍"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <div class="progressBar-container" v-show=" uploadProgress > 0 && uploadProgress < 100">
           <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadProgress"></el-progress>
        </div>               
    </div>
</template>
<script>
import {mapMutations} from 'vuex';
import * as types from 'src/store/mutationTypes';

import DistPicker from "src/components/common/distpicker/distpicker"
import UploadImg from 'src/components/common/upload/uploadImg';

import {appendFormToFormData} from 'src/assets/js/tools';
import {alertMixin} from 'src/assets/js/mixin';
export default {
      beforeRouteEnter (to, from, next) {
        if(!to.params.car){
            next({path:'/carDetail',query:{id: to.query.id}});
        }
        next();
       
    },
    mixins: [alertMixin],
    data(){
        return {
            //描述图片相关
            descFiles:[],

            // showProgress: false,
            //商品类别
            carTypes:[],
            //当前上传进度
            uploadProgress: 0,
            dists: {
                provinceId: '',
                cityId: '',
                districtId: ''
            },
            //记录当前产品图片长度
            photoLength: 0,
            form: {
                title: '',
                carType: '',
                sellPrice:'',
                customerPhone:'',
                mileage:'',
                customerHotPhone:'',
                carContent:'',
        
            },
            rules: {
                title: [
                    { required: true, message: '请输入车辆名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                 carType: [
                    { required: true, message: '请选择车辆类型', trigger: 'change' },
                ],
                sellPrice:[
                    { required: true, message: '请输入众筹金额', trigger: 'blur' },
                    { pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '众筹金额格式错误', trigger: 'blur' }
                ],
                customerPhone:[
                    { required: true, message: '客服号码不能为空', trigger: 'blur' },
                    { pattern: /^1\d{10}$/, message: '客服号码格式不对', trigger: 'blur' }
                ],
                mileage:[
                    { required: true, message: '请输入里程数', trigger: 'blur' },
                    { pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '里程数格式错误', trigger: 'blur' }
                ],
                carContent: [
                    { required: true, message: '车辆详情不能为空', trigger: 'blur' },
                ]
              
            }

        }
    },
    created(){
        //获取商品类别
        this._getCarType().then(() => {
            let form = this.$route.params.car;
            this.form  = form;
            this.photoLength = form.carPhoto.length;
            this.dists.provinceId = form.provinceId;
            this.dists.cityId = form.cityId;
            this.dists.districtId = form.districtId;

        })
    },
    mounted(){
        this.setCurItem('添加车辆');
    },
    methods:{
        //发布产品
        publish(){
            //先执行Validator验证，验证合格，进入上传

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
            this.$router.push({path: '/carsList'});
            this.setCurItem('车辆列表');
        },
        delFile(obj){
             this.$axios.get('/deleteCarPhoto',{
                params:{
                   id: this.form.id,
                   fileKey: obj.key
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.myAlert('删除成功！',null,true);
                    }else{
                        this.myAlert(res.data.message);
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        //当进行图片操作时，执行一下相关
        changeDescImg(data){
            this.descFiles = data;
            // console.log(data)
        },
        changeDist(dist){
            this.dists = dist;
    
        },
         photoLengthChange(len){
            this.photoLength = len;
        },
        _getCarType(){
           return this.$axios.get('/getCarType').then((res) =>{
                // console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.carTypes = res.data.data;
                    }else{
                        this.myAlert(res.data.message);
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _submitForm(){
             let me = this, 
                formData = new FormData();
         
            //产品图片   
            if(me.photoLength < 1){
                me.myAlert('车辆图片不能为空！');
                return;
             }
            if(!me.dists.provinceId || !me.dists.cityId){
                me.myAlert('省市不能为空！');
                return;
            }

            let form = Object.assign({},this.form);
            delete form.carPhoto;
            delete form.provinceId;
            delete form.cityId;
            delete form.districtId;
            delete form.photoIp;
            //注意，此时form和dist中都包含地区信息，必须先执行地区
            appendFormToFormData(me.dists,formData);
            appendFormToFormData(form,formData);
            //将产品图片和 车辆合格证添加至formdata
            me.descFiles.forEach(element => {
                formData.append('carPhoto',element,element.name);
            });
            //上传请求
            me.$axios.post('/savaOrUpdateCar', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    if(!progressEvent){return}
                    var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                    me.uploadProgress = complete;
                },

            }).then(function (res) {
                if(res.status === 200){
                    if(res.data.code > 0){
                        me.myAlert('发布成功！',function(){
                            me.$router.replace({path:'/carsList'});
                        },true)
                    }else{
                        me.myAlert(res.data.message)
                    }
                } 
            }).catch(function (error) {
                console.log(error);
            });
        },
        ...mapMutations({
            setCurItem: types.SET_CURITEM
        }),
    },
    components:{
        UploadImg,
        DistPicker
    }
}
</script>

<style lang="scss" scoped>
.product-detail{
    width: 100%;
    position: relative;
    padding: 0 10px;
    .datapicker{
        height: 100px;
        input: {
            width: 100%;
            height: 100%;
        }    
    }
    .head{
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .head-left{
            display: flex;
            .back{
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
    .progressBar-container{
        position: fixed;
        bottom: 20%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
        width:60%;
    }
    
}
</style>
