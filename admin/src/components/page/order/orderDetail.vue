<template>
    <div class="order-detail">
            <div class="head">
                <div class="head-left">
                       <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
                    <span class="allOrder">全部订单</span>
                    <el-button type="primary" @click="toProductDetail">查看对应产品详情</el-button>
                    <el-button type="primary" @click="toUserDetail">查看客户详情</el-button>
                </div>
            </div>
            <div class="content">
                <el-table
                    :data="lists"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="订单编号"
                        width="">
                    </el-table-column>
                    <el-table-column
                        :formatter="formatPName"
                        label="产品名称"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="totalPrice"
                        label="投资金额（元）"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="inversCycle"
                        label="投资周期(天)"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="annualEarn"
                        label="年化率"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="userName"
                        label="投资客户"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="电话"
                        width="">
                    </el-table-column>
                    <el-table-column
                        label="下单时间"
                        :formatter="formatDate"
                        width="">
                    </el-table-column>
                      <el-table-column
                        prop="progressStatus"
                        label="订单状态"
                        width="">
                    </el-table-column>
                </el-table>
            </div>
            <div class="video-container">
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
                    <p class="no-source" v-if="!devices.device_1">
                        暂无播放源！
                    </p>
                </div>
                <div class="video">
                    <video
                        id="my_player_2"
                        class="video-js vjs-big-play-centered"
                        controls
                        preload="metadata"
                        data-setup='{}'
                        playsinline 
                        webkit-playsinline
                    >
                        <!-- <source :src="devices.device_2.hls"  type="application/x-mpegURL"></source> -->
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a
                            web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                            </a>
                        </p>
                    </video>
                    <p class="no-source" v-if="!devices.device_2">
                        暂无播放源！
                    </p>
                </div>
                <div class="video">
                    <video
                        id="my_player_3"
                        class="video-js vjs-big-play-centered"
                        controls
                        preload="metadata"
                        data-setup='{}'
                        playsinline 
                        webkit-playsinline
                    >
                        <!-- <source :src="devices.device_3.hls"  type="application/x-mpegURL"></source> -->
                        <p class="vjs-no-js">
                            To view this video please enable JavaScript, and consider upgrading to a
                            web browser that
                            <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                            </a>
                        </p>
                    </video>
                    <p class="no-source" v-if="!devices.device_3">
                        暂无播放源！
                    </p>
                </div>
            </div>
            <div class="map-container">
                <div id="mapWrapper"></div>
            </div>
    </div>
</template>
<script>
import {alertMixin} from 'src/assets/js/mixin';
//引入video样式
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
// import 'videojs-contrib-hls';
export default {
     beforeRouteLeave(to, from, next){
        //路由离开前中断video请求
         this.Player_1.dispose();
         this.Player_2.dispose();
         this.Player_3.dispose();
         next(); 
    },
    mixins: [alertMixin],
    data(){
        return {
            lists:[],
            devices: {
                device_1:{},
                device_2:{},
                device_3:{}
            },
             delayTime: 60,
        }
    },
    created() {
        this.orderId = this.$route.query.id;
        
    },
    mounted() {
        setTimeout(()=>{
            //播放器
            this.Player_1 = videojs('my_player_1');
            this.Player_2 = videojs('my_player_2');
            this.Player_3 = videojs('my_player_3');
            this._getOrderDeatilById(this.orderId).then(()=>{
                this.playVideo(this.Player_1,this.devices.device_1);
                this.playVideo(this.Player_2,this.devices.device_2);
                this.playVideo(this.Player_3,this.devices.device_3);
                //初始化地图
                this._initMap();
            })
           
        });
    },
    methods:{
        goBack(){
            this.$router.push({path:'/orderList',query:{curPage: this.$route.query.curPage}});
        },
        toProductDetail(){
             this.$router.push({path: '/productDetail',query:{id: this.lists[0].productId}})
        },
        toUserDetail(){
            this.$router.push({path: '/userDetail',query:{id: this.lists[0].userId}})
        },
        formatDate(item){
            let date = new Date(item.createTime);
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        },
        formatPName(item){
            let len  = item.title.length;
            return  len > 20 ? item.title.substr(0,20)+'...' : item.title;
        },
        playVideo(player,camera){
            if(camera && camera.coverUrl){
                player.poster(camera.coverUrl);
            }
            //设置播放源  
            if(camera && camera.hls){          
            player.src({src: camera.hls,
                type: 'application/x-mpegURL'});
            }
            player.play();
        },
        _getOrderDeatilById(orderId){
            this.lists = [];
           return this.$axios.get('/getOrderById',{
                params:{
                    id: orderId
                }
            }).then((res) =>{
                console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.devices  = res.data.data.devices;
                        this.lists.push(res.data.data)
                    }else{
                        this.myAlert(res.data.message)
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
                this.locationInfo = res.address;
                this.map = new qq.maps.Map(document.getElementById('mapWrapper'),{
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
                //一分钟获取一次
               setTimeout(() => {
                    this._updateMap();
                },this.delayTime*1000)
            })
        },
        _getLocation(){
            return  this.$axios.get('/getOrderProductLocation ',{
                params:{
                   productId: this.lists[0].productId,
                   orderId: this.orderId
                }
             }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        if(res.data.data.movement){
                            this.delayTime = 60;
                        }else{
                            this.delayTime = 5*60;
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
                
                let center = new qq.maps.LatLng(res.location.lat,res.location.lng);
                this.locationInfo = res.address;
                this.map.setCenter(center);
                this.marker.moveTo(center,10000000);
                 setTimeout(() => {
                    this._updateMap();
                },this.delayTime*1000)
            }).catch((err) =>{
                console.log(err)
            } )
        },
    }
}
</script>

<style lang="scss" scoped>
.order-detail{
    width: 100%;
    position: relative;
    padding: 0 10px;
    .head{
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .head-left{
            display: flex;
            .back-icon{
                font-size: 32px;
                cursor: pointer;
            }
            .allOrder{
                display: flex;
                width: 200px;
                border-bottom: 1px solid #000; 
                align-items: center;
            }
            .toProductDetail,.toUserDetail{
                margin-left: 20px;
            }
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
    .video-container{
        height: 300px;
        display: flex;
        .video{
            flex: 1;
            padding: 10px;
            background-color: #fff;
            margin: 10px;
            max-height: 100%;
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
                background-color: #000;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
    .map-container{
        height: 500px;
        margin-top: 50px;
        #mapWrapper{
            width: 100%;
            height: 100%;
        }
    }
}
</style>
