<template>
    <div id="monitor">
        <div class="top-monitor">
            <ul class="nav">
                <li class="nav-item " :class="{active: curIndex === 1}" @click="toggleSource(devices.device_1,1)">A监控</li>
                <li class="nav-item" :class="{active: curIndex === 2}" @click="toggleSource(devices.device_2,2)">B监控</li>
                <li class="nav-item" :class="{active: curIndex === 3}" @click="toggleSource(devices.device_3,3)">C监控</li>
            </ul>
            <div class="video-container">
                <div class="video"  @click="toggleControl">
                    <video
                        id="my-player"
                        class="video-js  vjs-big-play-centered"
                        preload="metadata"
                        controls
                        data-setup='{}'
                        playsinline 
                        webkit-playsinline
                        x5-playsinline
                        @tap="toggleControl"
                        v-show="!showNoSource"
                    >
                        <!-- <source src=""  type="application/x-mpegURL"></source> -->
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a
                            web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                            </a>
                        </p>
                    </video>
                    <p class="no-source" v-show="showNoSource">
                        暂无播放源！
                    </p>
                    <!-- <transition name="fade">
                        <div class="control-bar" v-show="showControl">
                            <span class="icon iconfont icon-iconset0481" v-if="!playState" @click.stop="play"></span>
                            <span class="icon iconfont icon-bofang" v-if="playState" @click.stop="pause"></span>
                        </div>
                    </transition> -->
                </div>
                <p class="title">{{productTitle}}</p>
                <p class="state">等待入场</p>
            </div>
        </div>
        <div class="map-container">
            <p class="title">
                <span class="icon iconfont icon-htmal5icon14"></span>
                <!-- 广东省中山市东区博爱六路20号 -->
                {{locationInfo.length > 20 ? locationInfo.substr(0,20)+'...' : locationInfo}}
            </p>
            <div id="mapWrap">

            </div>
        </div>

    </div>
</template>
<script>
// import videojs from 'video.js';
// //引入videojs样式
// import 'video.js/dist/video-js.css';
// import 'videojs-contrib-hls';
import Jsonp from 'src/assets/js/jsonp';
export default {
    beforeRouteLeave(to, from, next){
        //路由离开前中断video请求
         this.player.dispose();
        //取消gps请求
        clearTimeout(this.timer);
         next(); 
    },
    data(){
        return{
            // testSrc:'http://alhlscdn.lechange.cn/LCO/4E02B87PAG1C8C9/0/1/20/180720092630/dev_20180720092630_01r47dsp0r5zkd9x.m3u8',
            showControl: true,
            // playState: false,
            curIndex: 1,
            devices: {
                device_1:{},
                device_2:{},
                device_3:{}
            },
            productTitle: '',
            isFirst: true,
            showNoSource: false,
            locationInfo: '',
            delayTime: 60
        }
    },
    created() {
        this.pId = this.$route.query.pId;
        
    },
    mounted() {
     
        setTimeout(() => {
            //获取当前播放器
            this.player = videojs('my-player');
            this._getPlayList( this.pId).then(()=>{
                this.toggleSource(this.devices.device_1,1);
            })
            this._initMap();
            //   let center = new qq.maps.LatLng(39.916527,116.397128);
            //   console.log(center)
        },20)
    },
    methods:{
        toggleSource(camera,index){
            this.curIndex = index;
            if(camera && camera.coverUrl && camera.hls){
                this.showNoSource = false;
                //设置poster
                this.player.poster(camera.coverUrl);
                //设置播放源            
                this.player.src({src: camera.hls,
                    type: 'application/x-mpegURL'});
                this.player.load();
            
                //第一次不让播放
                if(this.isFirst){
                    this.isFirst = false;
                    return;
                }
                this.player.play();
            }else{
                this.player.pause();
                this.player.poster(require('./img/no_source.jpg'));
                this.showNoSource = true;
            }
            
        },
        toggleControl(){
            this.showControl = !this.showControl;
        },
        play(){
            // console.log(this.player.poster)
            this.player.play();
            // this.playState = true;
        },
        pause(){
            this.player.pause();
            // this.playState = false;
        },
        _getPlayList(pId){
           return  this.$axios.get('/app/getMyOrderProductControl',{
                params:{
                   productId: pId,
                }
             }).then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.devices =  res.data.data.devices;
                        this.productTitle = res.data.data.productTitle;
                    }else{
                        this.$alert(res.data.message)
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _initMap(){
            // clearInterval(this.timer);
            this._getLocation().then((res) => {
                let center = new qq.maps.LatLng(res.location.lat,res.location.lng);
                // let center = res.location;
                // this._getLocationInfo(center);
                 this.locationInfo = res.address;

                this.map = new qq.maps.Map(document.getElementById('mapWrap'),{
                    center: center,
                    zoom: 20
                });
                //创建一个Marker
                this.marker = new qq.maps.Marker({
                    //设置Marker的位置坐标
                    position: center,
                    //设置显示Marker的地图
                    map: this.map
                });
                //
                setTimeout(() => {
                    this._updateMap();
                },this.delayTime*1000)
            })
           


           
            //anchor是相对图标本身的位移
            // var anchor = new qq.maps.Point(50, 50),
            //     size = new qq.maps.Size(100, 100),
            //     origin = new qq.maps.Point(50, 0),
            //     icon = new qq.maps.MarkerImage(
            //         require('./img/location.png'),
            //         size,
            //         origin,
            //         anchor
            //     );
            // marker.setIcon(icon);
            // var cs=new qq.maps.CityService({
            //     complete:function(result){
            //         console.log(result)
            //     },
            // });
            // cs.searchCityByLatLng(center);
            // var callbacks={
            //     complete:function(result){
            //         console.log(result)
            //         map.setCenter(result.detail.location);
            //         marker.moveTo(result.detail.location,10000000)
            //     },
            // }
            // let geocoder = new qq.maps.Geocoder(callbacks);
            // geocoder.getLocation("中国,广州,天河区,天河公园");
            //   let d = 40;
            // setInterval(()=>{
            //     d--;
            //     map.setCenter(new qq.maps.LatLng(d,116.397128))
            //     marker.moveTo(new qq.maps.LatLng(d,116.397128),1000000)
            // },10000)



        },
        _getLocation(){
            return  this.$axios.get('/app/getProductLocation',{
                params:{
                   productId: this.pId,
                }
             }).then((res) =>{
                console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        //如果运动，则每分钟请求一次，否则，5min请求一次
                        if(res.data.data.movement){
                            this.delayTime = 60;
                        }else{
                            this.delayTime = 1*60;
                        }
                        return res.data.data;
                    }else{
                        this.$alert(res.data.message)
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })

        },
        _updateMap(){
            //获取定位信息
            this._getLocation().then((res) => {
                
                let center = new qq.maps.LatLng(res.location.lat, res.location.lng);
                this.locationInfo = res.address;
                this.map.setCenter(center);
                this.marker.moveTo(center,10000000);
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this._updateMap();
                },this.delayTime*1000)
            }).catch((err) =>{
                console.log(err)
            } )
        },
        //根据获得的经纬度逆解析
        // _getLocationInfo(coord){
        //     Jsonp('https://apis.map.qq.com/ws/geocoder/v1/',{
        //         key: 'GDWBZ-UVQ6V-HSIPM-UNOK2-XD3U5-3CF6Q',
        //         location: '39.984154,116.307490',
        //         output: 'jsonp'
        //     }).then((res) => {
        //         this.locationInfo = res.detail
        //     })
        // }


    },

}
</script>

<style lang="scss" scoped>
#monitor{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
   .top-monitor{
       height: px2rem(560);
       background-color: #f5f5f5;
        overflow: hidden;
       .nav{
           height: px2rem(56);
           width: px2rem(602);
           margin: px2rem(20) auto;
           border-radius:  px2rem(28);
           overflow: hidden;
           display: flex;
            .nav-item{
                flex: 1;
                line-height: px2rem(56);
                text-align: center;
                color: #333333;
                background-color: #b1cafd;
                @include font-dpr(28px);
                &.active{
                    background-color: #5e93fc;
                    color: #fff;
                }
                &:first-child{
                    margin-right: 1px;
                }
                 &:last-child{
                    margin-left: 1px;
                }
                
            }
       }
       .video-container{
           padding: 0 px2rem(30);
           .video{
               width: 100%;
               height: px2rem(346);
               border-radius: px2rem(10);
               position: relative;
               .video-js {
                   width: 100%;
                   height: 100%;
               }
               .no-source{
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    z-index: 999;
                    background-color: #000;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
               .control-bar{
                   position: absolute;
                   left: 50%;
                   top: 50%;
                   height:  px2rem(80);
                   width:  px2rem(80);
                   transform: translate3d(-50%,-50%,0);
                   background-color: #fff;
                   z-index: 999;
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   .iconfont{
                        @include font-dpr(60px);
                   }
               }
           }
           .title{
               color: #333333;
               @include font-dpr(32px);
                max-width: 20em;
                @include ml-ellipsis(1);
                margin-top: px2rem(10);
           }
           .state{
               color: #f57f3f;
               @include font-dpr(22px); 
                margin-top: px2rem(10);
           }
       }  
   } 
    .map-container{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: px2rem(560);
        .title{
           height: px2rem(88);
           padding: 0 px2rem(30);
           display: flex;
           align-items: center;
           color: #333333;
            @include font-dpr(28px);
            border-bottom: 1px solid #e6e6e6;  
           .iconfont{
                @include font-dpr(40px);
                color: #5e93fc; 
               
           }


        }
        #mapWrap{
             position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: px2rem(88);
        }


    }
    .vjs-control-bar{
        height: px2rem(50) !important;
    }
}
</style>

