<template>
    <div class="editAd">
        <form action=""  ref="form">
            <label class="add-img">
                <span class="el-icon-plus"></span>
                <input type="file" accept="image/*" ref="addIpt" maxlength="1" @change="setImage">  
            </label>
            <p class="title">图片</p>
            <div class="img-wrapper">       
                <img ref="editImg" :src="cropImg" alt="">
            </div>
            <label for="" class="adLink" >标题:
                <br/>
                <br/>
                <el-input v-model="title" name="href" placeholder="请输入内容"></el-input>
                <!-- <input type="text" name="href" class="desc" :value="ad.href"> -->
            </label>
             
        </form>
        <el-button type="primary" @click="publish">提 交</el-button>
        <el-button type="primary" @click="back">返回</el-button>
        <!-- <p class="attention">注：如需裁剪请点击裁剪，裁剪完成自动提交，否则，默认提交整张图片</p> -->
        <div class="progressBar-container" v-show=" uploadProgress > 0 && uploadProgress < 100">
           <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadProgress"></el-progress>
        </div>  
         <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%"  >
            <vue-cropper  ref='cropper' :src="imgSrc"   :aspectRatio=" 250/381" ></vue-cropper> <!--:ready="cropImage" :zoom="cropImage" :cropmove="cropImage" -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCrop">取 消</el-button>
                <el-button type="primary" @click="cropImage ">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {alertMixin} from '@/assets/js/mixin';
import VueCropper  from 'vue-cropperjs';
// import 'blueimp-canvas-to-blob';
import Lrz from 'lrz'; 
// import {DefaultImageIp} from '@/assets/js/config';

export default {
    mixins: [alertMixin],//引入模态框mixin,包含{showModal,closeModel}
    data(){
        return {
            imgSrc: '',
            defaultSrc: '',
            ad: {},
            image: null,
            title: '',
            uploadProgress: 0,
            dialogVisible: false,
            cropImg: '',
            canvas: null
        }
    },
    created() {
        this.whRatio = 250/381;
        let id  = this.$route.query.id;
        if(id){
            this._getActivity(id);
        }
    },
    mounted() {
        // setTimeout(() =>{
        //     this.$refs.editImg.style.width = 200+'px';
        //     this.$refs.editImg.style.height = (200/this.whRatio)+'px';
        // },20)
      
    },
    methods:{
         setImage(e){
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
         cropImage () {
            this.dialogVisible = false;
            this.canvas = this.$refs.cropper.getCroppedCanvas();
            this.cropImg = this.canvas.toDataURL();
        },
         cancelCrop(){
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        },
            
        publish(){
            let id  = this.$route.query.id;
            let formData = new FormData();
            formData.append('title', this.title);
            if(id){
                formData.append('id', id);
            }
            if(!this.canvas && !id){
                this.myAlert('图片允许为空！');
                return;
            }else if(this.canvas){
                 let me = this;
                this.canvas.toBlob((file) => {
                    if(this.countSize(file) > 2){
                        this.myAlert('图片不能大于2M');
                    }else{
                        formData.append('image', file, 'image');
                        me._submit(formData);
                    }
                },'image/jpeg');
            }else if(!this.canvas && id){
                 this._submit(formData);
            }
        },
        _submit(formData){
            let me = this;
            //上传请求
            this.$axios.post('/saveOrUpdateActivity', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    if(!progressEvent){return}
                    var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                    me.uploadProgress = complete;
                },

            }).then(function (response) {
                if(response.data.code > 0){

                    me.myAlert('发布成功！',()=>{
                        me.$router.push({path: '/actsList'})
                    },true);
                    
                    
                }else{
                    me.myAlert(response.data.message);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        _getActivity(id){
            this.$axios.get('getActivity',{
                params:{
                   id: id
                }
            }).then((res) =>{
                console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.cropImg = this.$photoIp + res.data.data.image.src;
                        this.title = res.data.data.title ;
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        compressImg(file){
            return new Promise((resolve,reject) => {
                Lrz(file)
                .then(function (rst) {
                    // 处理成功会执行
                    resolve(rst.file);
                })
                .catch(function (err) {
                    // 处理失败会执行
                    reject(err)
                })
            })
        },
         countSize(file){
            //将文件大小转为M
            return (file.size/1024/1024).toFixed(2);
        },
        back(){
            this.$router.back();
        }
    },
    components:{
        VueCropper
    }
}
</script>

<style lang="scss" scoped>
.editAd{
    width: 100%;
    position: relative;
    padding: 0 10px;
    margin-top: 50px;
    .add-img{
        width: 120px;
        height: 120px;
        margin-right: 10px;
        background-color: #fff;
        border: 1px dashed #999;
        border-radius: 10px; 
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        
        span{
            font-size: 32px;
        }
        input{
            opacity: 0;
            position: absolute;
            z-index: 0;
            cursor: pointer;
            
        }
    }
    .title{
        font-weight: 700;
        margin: 10px 0;
    }
    .img-wrapper{
        // height: 300px;
        width: 500px;
        // overflow: hidden;
     
        img{
            display: block;
            // height: 100%;
            max-width: 100%;
            border: 1px dashed #999;
            // border-radius: 10px;
            background-color: #fff;
        }
    }
    .adLink{
        display: block;
        margin: 20px 0;
        width: 30%;
     
        
    }
    .attention{
        margin-top: 10px;
    }
     .progressBar-container{
        position: fixed;
        bottom: 15%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
        width:60%;
    }
   
   
    .el-dialog__wrapper .el-dialog{
        position: absolute !important;
    }
}
    
</style>

