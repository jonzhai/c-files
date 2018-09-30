<template>
    <div class="product-detail">
        <div class="head">
            <div class="head-left">
                <i class="el-icon-arrow-left back" @click="goBack"></i>
                <span class="allProduct">全部产品</span>
            </div>
            <div class="head-right">
                <el-button type="primary" @click="publish">发布产品</el-button>
            </div>
        </div>
        <el-form ref="form" class="form-container" :model="form" :rules="rules"  label-width="0px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">商品名称 <span class="red">*</span></div>
                         <el-form-item
                            prop="pName"
                          >
                            <el-input v-model="form.pName" name="pName"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">商品类别</div>
                        <el-form-item prop="cId">
                            <el-select v-model="form.cId" name="cId" placeholder="请选择商品类别">
                                <el-option  v-for="(item,index) in cIds" :key="index" :value="item.cid" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
           <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                         <div class="el-form-item__label">众筹金额 <span class="red">*</span></div>
                         <el-form-item
                            prop="crowdPrice"
                          >
                            <el-input v-model="form.crowdPrice" name="crowdPrice"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">客服电话 <span class="red">*</span></div>
                         <el-form-item
                            prop="customerPhone"
                          >
                            <el-input v-model="form.customerPhone" name="customerPhone"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">投资周期 <span class="red">*</span></div>
                         <el-form-item
                            prop="inversCycle"
                          >
                            <el-input v-model="form.inversCycle" name="inversCycle"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">起投金额 <span class="red">*</span></div>
                         <el-form-item
                            prop="startInversPrice"
                          >
                            <el-input v-model="form.startInversPrice" name="startInversPrice"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">最高年化收益率 <span class="red">*</span></div>
                         <el-form-item
                            prop="annualEarn"
                          >
                            <el-input placeholder="输入最高年化收益率" v-model="form.annualEarn" name="annualEarn">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">最低年化收益率 <span class="red">*</span></div>
                         <el-form-item
                            prop="minAnnualEarn"
                          >
                            <el-input placeholder="输入最低年化收益率" v-model="form.minAnnualEarn" name="minAnnualEarn">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">众筹截止时间 <span class="red">*</span></div>
                         <el-form-item
                            prop="endTime"
                          >
                           <el-date-picker
                                v-model="form.endTime"
                                type="date"
                                placeholder="选择日期"
                                name="endTime"
                                value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </el-col>
               <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">众筹回款时间 <span class="red">*</span></div>
                         <el-form-item
                            prop="returnTime"
                          >
                           <el-date-picker
                                v-model="form.returnTime"
                                type="date"
                                placeholder="选择日期"
                                name="returnTime"
                                value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">是否标记热门</div>
                        <!-- <div style="clear:both"></div> -->
                         <el-form-item
                            prop="isHot"
                          >
                            <el-select v-model="form.isHot" placeholder="请选择" name="isHot">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="-1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
              <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">是否标记最新</div>
                        <!-- <div style="clear:both"></div> -->
                         <el-form-item
                            prop="isNew"
                          >
                            <el-select v-model="form.isNew" placeholder="请选择" name="isNew">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="-1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">摄像头</div>
                        <el-form-item prop="devices.device_1">
                            <el-select v-model="form.devices.device_1" filterable name="device_1"  placeholder="摄像头(1)">
                                <el-option  v-for="(item,index) in deviceLists" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
                 <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label" style="opacity: 0"> 摄像头 </div>
                        <el-form-item prop="devices.device_2">
                            <el-select v-model="form.devices.device_2" filterable name="device_2"  placeholder="摄像头(2)">
                                <el-option  v-for="(item,index) in deviceLists" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
                 <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label" style="opacity: 0"> 摄像头  </div>
                        <el-form-item prop="devices.device_3">
                            <el-select v-model="form.devices.device_3" filterable name="device_3"  placeholder="摄像头(3)">
                                <el-option  v-for="(item,index) in deviceLists" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">gps</div>
                        <el-form-item prop="imei">
                            <el-select v-model="form.imei" filterable name="imei"  placeholder="请选择GPS">
                                <el-option  v-for="(item,index) in gpsLists" :key="index" :value="item.imei" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="18">
                    <div class="el-form-item__label">选择地区</div>
                    <Dist-picker @changeDist="changeDist"></dist-picker>
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
                    <upload-img @filesChange="changeDescImg" :maxLength="5"></upload-img>
                </el-col>
                <div class="el-form-item__label" style="padding-left:10px">注：图片大小不能超过5M，超过5M自动过滤掉</div>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                   <h2 class="title">详情</h2>
                </el-col>
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">车辆位置</div>
                         <el-form-item
                            prop="pContent.carLocation"
                          >
                            <el-input v-model="form.pContent.carLocation" name="carLocation"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                 <el-col> 
                     <p class="el-form-item__label">注：填写格式： 省-市-区-街道-门牌号 （填写地址越精确匹配越精确）</p>
                 </el-col>
                 <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">汽车信息</div>
                         <el-form-item
                            prop="pContent.carInfo"
                          >
                            <el-input type="textarea" v-model="form.pContent.carInfo" rows="10" name="carInfo"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">项目介绍</div>
                         <el-form-item
                            prop="pContent.introduction"
                          >
                            <el-input type="textarea" v-model="form.pContent.introduction" rows="10" name="introduction"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                   <h2 class="title">明细</h2>
                </el-col>
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">车架号</div>
                         <el-form-item
                            prop="productItem.carframNum"
                          >
                            <el-input v-model="form.productItem.carframNum" name="carframNum"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="24">
                   <p class="title">添加发票信息</p>
                </el-col>
                 <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">开票金额</div>
                         <el-form-item
                            prop="productItem.invoicePrice"
                          >
                            <el-input v-model="form.productItem.invoicePrice" name="invoicePrice"></el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple">
                        <div class="el-form-item__label">开票日期</div>
                         <el-form-item
                            prop="productItem.invoiceDate"
                          >
                            <el-date-picker
                                v-model="form.productItem.invoiceDate"
                                type="date"
                                placeholder="选择日期"
                                name="invoiceDate"
                                value-format="yyyy-MM-dd"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <div class="el-form-item__label">上传车辆合格证</div>
                    <upload-img @filesChange="changeVehicleCertificateImg" :maxLength="3"></upload-img>
                </el-col>
                <div class="el-form-item__label" style="padding-left:10px">注：图片大小不能超过5M，超过5M自动过滤掉</div>
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

import {appendFormToFormData} from 'src/assets/js/tools'
export default {
    data(){
        return {
            //描述图片相关
            descFiles:[],

            //发票信息
            invoiceFiles:[],

            //车辆许可证
            VehicleCertificateFiles:[],

            // showProgress: false,
            //商品类别
            cIds:[],
            //当前上传进度
            uploadProgress: 0,
            //地区信息
            dists: {},
            //设备列表
            deviceLists:[],
            //gps列表
            gpsLists:[],
           
            form: {
                pName: '',
                cId: '',
                crowdPrice:'',
                customerPhone:'',
                inversCycle:'',
                startInversPrice:'',
                annualEarn:'',
                minAnnualEarn:'',
                endTime:'',
                returnTime: '',
                isHot:'',
                isNew:'',
                imei: '',
                pContent:{
                    carLocation:'',
                    carInfo:'',
                    introduction:''
                },
                productItem:{
                    carframNum:'',
                    invoicePrice:'',
                    invoiceDate:''
                },
                devices:{
                    device_1: '',
                    device_2: '',
                    device_3: ''
                },
                gps:''
               
                

            },
            rules: {
                pName: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                crowdPrice:[
                    { required: true, message: '请输入众筹金额', trigger: 'blur' },
                    { pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '众筹金额格式错误', trigger: 'blur' }
                ],
                inversCycle:[
                    { required: true, message: '请输入众筹周期', trigger: 'blur' },
                    { pattern: /^\d{1,5}$/, message: '众筹周期必须是正整数', trigger: 'blur' }
                ],
                customerPhone:[
                    { required: true, message: '客服号码不能为空', trigger: 'blur' },
                    { pattern: /^1\d{10}$/, message: '客服号码格式不对', trigger: 'blur' }
                ],
                annualEarn:[
                    { required: true, message: '最高年化率不能为空', trigger: 'blur' },
                ],
                minAnnualEarn:[
                    { required: true, message: '最低年化率不能为空', trigger: 'blur' },
                ],
                startInversPrice:[
                    { required: true, message: '起投金额不能为空', trigger: 'blur' },
                    { pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '起投金额格式不对', trigger: 'blur' }
                ],
                 endTime:[
                    { required: true, message: '众筹截止时间不能为空', trigger: 'blur' },
                ],
                 returnTime:[
                    { required: true, message: '众筹回款时间不能为空', trigger: 'blur' },
                ],
                cId:[
                    { required: true, message: '产品种类不能为空', trigger: 'change' },
                ],
            }

        }
    },
    created(){
        //获取商品类别
        this._getCIds();
        this._getDevices();
        this._getGps();
    },
    mounted(){
        this.setCurItem('上新产品');
    },
    methods:{
        //发布产品
        publish(){
            //先执行Validator验证，验证合格，进入上传

             this.$refs.form.validate((valid) => {
                if (valid) {
                    this._submitForm();
                } else {
                    this.showModal('缺少必填选项，请仔细检查！');
                    return false;
                }
            });
           
               
           
        },
        goBack(){
            this.$router.push({path: '/productList'});
            this.setCurItem('产品列表');
        },

        //当进行图片操作时，执行一下相关
        changeDescImg(data){
            this.descFiles = data;
            // console.log(data)
        },
        changeInvoiceImg(data){
            this.invoiceFiles = data;
            // console.log(data)
        },
        changeVehicleCertificateImg(data){
            this.VehicleCertificateFiles = data;
            // console.log(data)
        },
        showModal(desc,callback,isSuccess){
            let sence = isSuccess ? "Success" : "Error";
            this.$alert(desc, sence, {
                confirmButtonText: '确定',
                 callback: action => {
                    if(callback){
                        callback();
                    }
                }
            });
        },
        changeDist(dist){
            this.dists = dist;
        },
        _getCIds(){
            this.$axios.get('/getCategorys').then((res) =>{
                // console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.cIds = res.data.data;
                    }else{
                        this.showModal(res.data.message);
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _getDevices(){
            this.$axios.get('/getDevices').then((res) =>{
                // console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.deviceLists = res.data.data.list;
                        // console.log(this.deviceLists)
                    }else{
                        this.showModal(res.data.message);
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _getGps(){
            this.$axios.get('/getGpsDevices').then((res) =>{
                // console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.gpsLists = res.data.data.list;
                        // console.log(this.deviceLists)
                    }else{
                        this.showModal(res.data.message);
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

              //众筹截止时间必须大于众筹回款时间
            if(this._getTime(this.form.endTime) < this._getTime(this.form.returnTime) ){
                me.showModal('众筹截止时间必须大于众筹回款时间！');
                return;
            }
            //产品图片和车辆合格证验证   
            if(me.descFiles.length < 1){
                me.showModal('产品图片不能为空！');
                return;
            }else if(me.VehicleCertificateFiles.length < 1){
                me.showModal('车辆合格证图片不能为空！');
                return;
            }
            if(!me.dists.provinceId || !me.dists.cityId){
                me.showModal('省市不能为空！');
                return;
            }
            // let originData = this.form;
            // let pContent = {
            //     carLocation: originData.carLocation,
            //     carInfo: originData.carInfo,
            //     introduction: originData.introduction
            // }
            // let productItem = {
            //     carframNum: originData.carframNum,
            //     invoiceDate: originData.invoiceDate,
            //     invoicePrice: originData.invoicePrice
            
            // }
            // formData.append('pContent',JSON.stringify(pContent));
            // formData.append('productItem',JSON.stringify(productItem));

            appendFormToFormData(this.form,formData);
            appendFormToFormData(this.dists,formData);
            //将产品图片和 车辆合格证添加至formdata
            me.descFiles.forEach(element => {
                formData.append('photo',element,element.name);
            });


            me.VehicleCertificateFiles.forEach(element => {
                formData.append('carCertified',element,element.name);
            });
            // console.log(formData.getAll('carCertified'))
            //上传请求
            me.$axios.post('/saveOrUpdateProduct', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    // debugger;
                    // console.log(progressEvent);
                    if(!progressEvent){return}
                    var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                    me.uploadProgress = complete;
                },

            }).then(function (res) {
                if(res.status === 200){
                    if(res.data.code > 0){
                        me.showModal('发布成功！',function(){
                            me.$router.replace({path:'/productList'});
                        },true)
                    }else{
                        me.showModal(res.data.message)
                    }
                } 
            }).catch(function (error) {
                me.showModal(error.message);
            });
        },
        _getTime(date){
            return new Date(date).getTime(); 
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
