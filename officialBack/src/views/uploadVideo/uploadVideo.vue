<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="24">
               <label for="uploadVideo" class="ipt-label">
                   上传视频
                   <input id="uploadVideo" class="ipt" type="file" @change="iptchange" ref="ipt">
               </label>
                <label for="uploadImage" class="ipt-label">
                   上传封面
                   <input id="uploadImage" class="ipt" type="file"  ref="ipt" maxlength="1" @change="setImage">
               </label>
               <p>注：视频仅支持'3gp','rmvb','flv','wmv','avi','mkv','mp4','mp3','wav'格式，且大小不超过50M</p>
            </el-col>
        </el-row>
        <el-row>
            <p>当前视频：</p>
            <el-col :span="12">
                <div class="poster">
                    <img src="" alt="">
                     <p class="no-source" v-if="!devices">
                        暂无封面！
                    </p>
                </div> 
            </el-col>
            <el-col :span="12">
               <div class="video">
                    <video
                        id="my_player_1"
                        class="video-js  vjs-big-play-centered"
                        controls
                        preload="metadata"
                        data-setup='{}'
                        playsinline 
                        webkit-playsinline
                    >
                        <!-- <source :src="devices.device_1.hls"  type="application/x-mpegURL"></source> -->
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a
                            web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                            </a>
                        </p>
                    </video>
                    <p class="no-source" v-if="!devices">
                        暂无视频！
                    </p>
                </div>
            </el-col>
        </el-row>
        <el-progress  :percentage="uploadPercent" v-show="uploadPercent > 0 && uploadPercent < 100"></el-progress>
        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%"  >
            <vue-cropper  ref='cropper' :src="imgSrc" :aspectRatio="438/254" ></vue-cropper> <!--:ready="cropImage" :zoom="cropImage" :cropmove="cropImage" -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCrop">取 消</el-button>
                <el-button type="primary" @click="cropImage ">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
    export default {
         beforeRouteLeave(to, from, next){
            //路由离开前中断video请求
            this.Player_1.dispose();
            next(); 
        },
        data() {
            return {
                chartColumn: null,
                devices: '',
                dialogVisible: false,
                imgSrc: '',
                cropImg: '',
                canvas: null,
                uploadPercent: 0
            }
        },

        methods: {
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
                // this.cropImg = this.defaultSrc;
            },
           iptchange(e){
               console.log(e)
           },
            playVideo(player,camera){
                if(camera && camera.coverUrl){
                    player.poster(camera.coverUrl);
                }
                //设置播放源  
                if(camera && camera.hls){          
                player.src({src: camera.hls,
                    type: 'application/mp4'});
                }
                player.play();
            },
        },

        mounted() {
        setTimeout(()=>{
            //播放器
            this.Player_1 = videojs('my_player_1');
            // this.playVideo(this.Player_1,this.devices);
           
           
        });
    },
        updated: function () {
        }
    }
</script>

<style scoped lang="scss">
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
    .ipt-label{
        display: inline-block;
        width: 100px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        background-color: #409eff;
        position: relative;
        border-radius: 5px; 
        cursor: pointer;
        .ipt{
            position: absolute;
            z-index: -1;
            visibility: hidden;
        }
    }
    .video,.poster{
        width: 600px;
        height: 400px;
        position: relative;
        #my_player_1{
            width: 100%;
            height: 100%;
        }
        .no-source{
            margin: 0;
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            color: #fff;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
 
</style>
