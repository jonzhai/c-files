<template>
    <div class="copper-img" ref="copperContainer">
        <div class="img-wrapper">
            <img :src="imgSrc" alt="" ref="editImg">
        </div>
        <div class="controller">
            <label for="uploadImg" class="fileWrapper">选择图片
                <input id="uploadImg" type="file" accept="image/*" ref="uploadImg"/>
            </label>
            <p class="btn" @click="cropper">裁剪</p>
            <p class="btn" @click="cancel">取消</p>
        </div>
    </div>
</template>
<script>
import Copper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
export default {
    data(){
        return {
            imgSrc:'',
            image: null
        }
    },
    mounted() {
        //初始化选择图片事件
        this._initFile();
        let me = this;
         setTimeout(()=>{
             let height = document.documentElement.clientHeight;
            //初始化裁剪器
            this.Copper =  new Copper(this.$refs.editImg,{
                aspectRatio: 1 / 1,
                dragMode: 'move',
                toggleDragModeOnDblclick: 'false',
                cropBoxResizable: false,
                checkImageOrigin: true,
                minContainerHeight: height,
                // minCanvasHeight: height,
                minCropBoxHeight: 200,
                crop: function(event) {
                }
          })
        },20)
    },
    methods:{
         cropper(){
            //如果裁剪，则当前文件置为裁剪后文件
            let me  = this;
            if( !this.Copper.getCroppedCanvas()){
                 alert('请先点击选择图片！');
                return;
            }
            this.Copper.getCroppedCanvas().toBlob((file) => {
                if(me.countSize(file) > 5){
                    alert('图片不能大于5M');
                }else{
                    me.image = file;
                    me.$emit('closeCopper',me.image);
                }
            },'image/jpeg');
      
        },
        cancel(){
            this.$emit('closeCopper',null);
        },
         _initFile(){
            let me = this;
            this.$refs.uploadImg.onchange = function(){
                let reader = new FileReader();
                let file = this.files[0];
                if(me.countSize(file) > 5){
                    alert('图片不能大于5M');
                    return;
                }
                let self = this;
                reader.onload=function(e) {  
                    me.imgSrc = e.target.result;
                    //置换裁剪文件
                    me.Copper.replace( me.imgSrc);
                    self.value="";

                };  
                //正式读取文件  
                reader.readAsDataURL(file);  
            }
        },
          countSize(file){
            //将文件大小转为M
            return (file.size/1024/1024).toFixed(2);
        }
    }

}
</script>

<style lang="scss" scoped>
    .copper-img{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;
        .controller{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: px2rem(60);
            display: flex;
           .fileWrapper{
                flex: 1;
                overflow: hidden;
                position: relative;
                text-align: center;
                border: 1px solid #666;
                background-color: #eee;
                line-height: px2rem(60);
                @include font-dpr(24px);
                color: #000;
                #uploadImg{
                    position: absolute;
                    opacity: 0;
                    width: 1px;
                }
            }
            .btn{
                flex: 1;
                text-align: center;
                line-height: px2rem(60);
                overflow: hidden;
                 @include font-dpr(24px);
                border: 1px solid #666;
                background-color: #eee;
                color: #000;
            }
        }
        
    }
</style>

