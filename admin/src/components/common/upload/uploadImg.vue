<template>
    <div class="uploadImg">
        <div class="img-wrapper" v-for="(item,index) in imgs" :key="index">
            <img :src="item.src" >
            <!-- <span class="del-icon el-icon-circle-close-outline" @click="delFile(index,item)"></span> -->
            <transition name="fade">
                <div class="mock">
                    <span class="el-icon-zoom-in" @click="preview(item)"></span>
                    <span class="el-icon-delete" @click="delFile(index,item)"></span>
                </div>  
            </transition>
        </div>
        <div class="img-wrapper add-img">
            <label>
                <span class="el-icon-plus"></span>
                <span class="desc">点击上传</span>
                <input type="file" accept="image/*" ref="addIpt" multiple>  
            </label>
        </div>
        <transition name="fade">
            <div class="preview-container" v-show="showPreview">
                <div class="preview">
                    <span class="el-icon-close" @click= "closePreview"></span>
                    <div class="img-Wrapper">
                        <img :src="previewSrc" alt="">
                    </div>
                </div>
            </div>
        </transition>
        
    </div>
</template>
<script>
// import ImageCompressor from 'image-compressor.js';
import Lrz from 'lrz'; 

export default {
    props:{
        maxLength:{
            type: Number,
            default: 1
        },
        //当处于编辑状态时，从服务器获取的图片
        seversImgs:{
            type: Array,
            default: function(){
                return [];
            }
        },
        seversImgsIp:{
            type: String
        },
        type:{
            type: String
        }

    },
    data(){
        return {
            imgs:[],
            files:[],
            outputFiles: [],
            showPreview: false,
            previewSrc: ''
        }
    },
    created(){
        // console.log(this.seversImgs)
        //如果传进来有图片
        if(this.seversImgs.length > 0) {
            this.seversImgs.forEach((item) => {
                this.imgs.push({src: this.seversImgsIp+item.src, key:item.key})
            })
        }
    },
    mounted(){
         //初始化添加图片
        setTimeout(()=>{
            this._initAddImg();
        },20)
    },
    methods:{
        delFile(index,item){
            this.imgs.splice(index,1);
            //有此标记，表示从服务器下载的图片
            if(typeof item.key !== 'undefined'){
                this.$emit('delFile',{key: item.key,type: this.type});
            }else{
                this.files.forEach((element,index) => {
                    if(element.name && element.name === item.name){
                        this.files.splice(index,1);
                        this.outputFiles.splice(index,1);
                    }
                });
                this.$emit('filesChange',this.outputFiles)
            }
            
        },
        preview(item){
            this.previewSrc = item.src;
            this.showPreview = true;
        },
        closePreview(){
            this.previewSrc = '';
            this.showPreview = false;
        },
         _initAddImg(){

             //外层this
            var me = this;
            this.$refs.addIpt.onchange = function(){
                if(me.imgs.length >= me.maxLength){
                    alert(`最多只能添加${me.maxLength}张图片`);
                    return;
                }
                //内层this
                let self = this,
                    len = self.files.length;

                for(let i =0; i < len; i++){
                    let reader = new FileReader(),
                        file = self.files[i];
                    //大于5M自动过滤掉
                    if(me.countSize(file) > 5){
                        continue;
                    }
                    reader.onload=function(e) {  
                        if(me.imgs.length >= me.maxLength ){return}
                        me.imgs.push({name:file.name,src:e.target.result});
                         me.files.push(file);
                        me.compressImg(file).then((pFile)=>{
                            me.outputFiles.push(pFile);
                            me.$emit('filesChange',me.outputFiles);
                            //置空当前input，以便可以选择同一文件
                            self.value = '';
                        }).catch((err) => {
                            self.value = '';
                            console.log(err);
                        })
                      
                    };  
                    //正式读取文件  
                     reader.readAsDataURL(file);  
                }
            }

        },
        compressImg(file){
            return new Promise((resolve,reject) => {
                Lrz(file)
                .then(function (rst) {
                    // 处理成功会执行
                    // console.log(rst)
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
        }
    },
    watch:{
        seversImgs(newVal){
             if(newVal.length > 0) {
                newVal.forEach((item) => {
                    this.imgs.push({src: this.seversImgsIp+item.src, key:item.key})
                })
            }
        },
        imgs(newVal){
            this.$emit('imgLengthChange',newVal.length)
        }

    }
}
</script>
<style lang="scss" scoped>
    .uploadImg{
        width: 100%;
        height: 100%;
        display: flex;
        .img-wrapper{
            width: 120px;
            height: 120px;
            margin-right: 10px;
            border: 1px dashed #999;
            border-radius: 10px; 
            position: relative;
            display: flex;
            align-items: center;
            img{
                width: 100%;
                max-height: 100%;
            }
            .del-icon{
                // display: none;
                position: absolute;
                left: 0;
                top: 0;
                transform: translate3d(-50%,-50%,0);
                color: #f00;
                font-size: 20px;
                cursor: pointer;
            }
            &:hover .del-icon{
                display: block;
            }
            .mock{
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                border-radius: 10px; 
                display: none;
                background-color: rgba(0,0,0,0.5);
                color: #fff;
                font-size: 24px;
                span{
                    margin-right: 10px;
                    cursor: pointer;
                }

            }
            &:hover{
                .mock{
                    display: flex;
                    justify-content: center;
                    align-items: center;

                }
            }
        }
        .add-img{
            position: relative;
            label{
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                z-index: 100;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                
               .iconfont{
                    font-size: 48px;
                    color: #666;
                }
                .desc{
                    color: #666;
                }
            }
            input{
                opacity: 0;
                position: absolute;
                left: 0;
                right: 0;
                width: 1px;
                z-index: 0;
                cursor: pointer;
                
            }
        }
        .preview-container{
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-color:rgba(0,0,0,0.3);
            z-index: 1000;
        }
        .preview{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%,-50%,0);
            border: 1px solid #666;
            width: 50%;
            max-height: 600px;
            display: flex;
            flex-direction: column;
            padding: 20px;
            background-color: #fff;
            .el-icon-close{
                text-align: right;
                font-size: 24px;
                margin-bottom: 10px;
                cursor: pointer;
            }
            .img-Wrapper{
                overflow-y: auto; 
            }
            .img-Wrapper img{
                width: 100%;
            }
        }
    }
    // .fade-enter-active,.fade-leave-active{
    //     transition: all 1s;
    // }
    // .fade-enter,.fade-leave-to{
    //     opacity: 0;
    // }
    .fade-enter-active {
        transition: opacity .5s;
    }
    .fade-enter /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>


