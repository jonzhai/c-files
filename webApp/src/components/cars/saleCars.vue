<template>
    <div id="invesment">
        <div class="head">
            <div class="left">
                <span class="icon iconfont icon-htmal5icon14"></span>
                {{curSaleCity.name}}
            </div>
            <div class="right" @click="showChooseCity = true">
                去修改
                <span class="icon iconfont icon-right1"></span>
            </div>
        </div>
        <scroll ref="listScroll" 
            :data="lists" 
            class="scroll-container" 
            :probeType="2" 
            :listenScroll="true"
            @pullingUp="pullingUp"
            @pullingDown="pullingDown"
        >
            <div>
                <div class="banner-container" ref="bannerContainer">
                     <a :href="topAd.href">
                        <img class="needsclick" :src="topAd.image ? topAd.image.photoIp+topAd.image.src : ''" alt="">
                    </a>
                </div>
                <div class="nav">
                    <div v-for="(item,index) in carTypes" :key="index" class="nav-item" :class="{active: curItem === item.name}" @click="changeTab(item.name,item.code)">{{item.name}}</div>
                </div>
                <ul class="list-container"  v-cloak v-if="hotLists.length>0">
                    <li class="item" v-for="(item,index) in hotLists" :key="index" @click="toCarDetail(item.id)">
                        <div class="img-container">
                            <img :src="item.photoIp+item.carPhoto.src"> 
                        </div>
                        <p class="describe">{{toEllipsis(item.title,20)}}</p>

                        <div class="item-info">
                            <span class="percent">￥{{item.sellPrice}}万</span>
                        </div>
                    </li>
                </ul>
                <scroll ref="adScroll" :data="lists"  class="ads-container" :scrollY="false" v-show="true" v-if="swipLists.length > 0">
                    <ul v-cloak class="ads" ref="ads">
                        <li 
                            v-for="(item,index) in swipLists"
                            :data-index="index"
                            ref="ad"
                            :key="index"
                        >
                            <a :href="item.href">
                                <img class="needsclick"  :src="item.image.photoIp+item.image.src">
                            </a>
                        </li>
                    </ul>
                </scroll>
                <ul class="list-container" v-cloak v-if="commonLists.length>0">
                    <li  class="item" v-for="(item,index) in commonLists" :key="index" @click="toCarDetail(item.id)">
                        <div class="img-container">
                            <img :src="item.photoIp+item.carPhoto.src"> 
                        </div>
                        <p class="describe">{{toEllipsis(item.title,20)}}</p>

                        <div class="item-info">
                            <span class="percent">￥{{item.sellPrice}}万</span>
                        </div>
                    </li>
                </ul>
            
                <p class="underline" v-show="isLastPage">已经到底了...</p>
                <div class="loading-container" v-show="showLoading">
                    <loading></loading>
                </div>
            </div>
        </scroll>
        <div class="footer-container" ref="footer">
            <common-footer></common-footer>
        </div>
        <transition name="fade">
            <choose-city v-show="showChooseCity"  @close="closeChooseCity"  key="chooseCity" ref="chooseCity" :curCity="curSaleCity" :isShow="showChooseCity"></choose-city>
        </transition>
        <router-view></router-view>

    </div>
    
</template>
<script>
import commonFooter from "src/base/commonFooter/commonFooter";
import Scroll from 'src/base/scroll/scroll';
import Slider from 'src/base/slider/slider';
import ChooseCity from 'src/base/chooseCity/chooseCity';

import Loading from 'src/base/loading/loading';
import {mapGetters,mapMutations} from 'vuex';

export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "购车";
        next();
    },
    data(){
       return {
     
           //列表数据
           lists: [],

            topAd: require('./img/car_banner.jpg'),
           showChooseCity: false,
        //    curCity: {},
            //当前分类
            curItem: '新车',
            //获取到的汽车分类
            carTypes: [],
            //不同分类对应的code，用于获取数据
            carCode: '',

            //当前页
            pageNumber: 1,
            //是否到达最后一页
            isLastPage: false,
            //是否显示loading
            showLoading: false,
                //轮播广告数据
            swipLists: []
            
       } 
    },
    created(){
    //     //想获取分类然后获取列表
        let me = this;
        this._getCarTypes().then((res) =>{
           this.carCode = res.code;
            let citylocation = new qq.maps.CityService({
                complete : function(result){
                    // me.curSaleCity = result.detail;
                    if(!me.curSaleCity.name){
                        me.setCurSaleCity(result.detail);
                    }
                    // console.log( me.curSaleCity)
                    me.lists = [];
                    me._getCarsList(1);
                    
                }
            });
            //调用searchLocalCity();方法    根据用户IP查询城市信息。
            citylocation.searchLocalCity();
       }).catch((err) =>{
           console.log(err)
       })
          //获取首部广告
       this._getBannerAds();
       //获取轮播广告
       this._getSwiperAds();
    },
    mounted(){
    },
    computed:{
        hotLists(){
            return this.lists.slice(0,4);
        },
        commonLists(){
            return this.lists.slice(4);
        },
        ...mapGetters(['curSaleCity'])
        
    },
    methods:{
        ...mapMutations({
            setCurSaleCity: 'SET_CURSALECITY'
        }),
        changeTab(type,code){
            this.curItem = type;
            this.carCode = code;
            this.lists = [];
            this._getCarsList(1);
        },
        pullingUp(){
            if(this.isLastPage){
                return;
            }
            this._getProductLists(++this.pageNumber);

            this.$refs.listScroll.finishPullUp();
        },
        closeChooseCity(city){
            this.showChooseCity = false;
            // this.curSaleCity = city;
            if(!city){return}
            this.setCurSaleCity(city);
            
            this.lists = [];
            this._getCarsList(1);
        },
   
         pullingDown(e){
            this.$refs.listScroll.finishPullDown();
        },
        toCarDetail(id){
            this.$router.push({path: '/saleCars/carDetail',query:{id:id}})
        },
        toEllipsis(text,num){
            if(typeof text !== "string"){return};
            return text.length > num ? text.substr(0,num)+'...' : text;
        },
        //获取汽车类型
        _getCarTypes(){
            return new Promise((resolve,reject) =>{
                this.$axios.get('/sellCar/getCarType').then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.carTypes = res.data.data;
                            resolve(this.carTypes[0]);
                        }else{
                            reject();
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            return;
                        }
                    } 
                }).catch((err) =>{
                    reject(err);
                })
            })
           
        },
        //获取列表数据
        _getCarsList(page){
            this.showLoading = true;
            
             this.$axios.get('/sellCar/getSellCars',{
                params:{
                    carType: this.carCode,
                    pageNumber: page,
                    pageSize: 20,
                    latLng: JSON.stringify(this.curSaleCity) 
                }
             }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        res.data.data.list.forEach((element) => {
                             this.lists.push(element);
                        })
                         this.pageNumber = res.data.data.pageNum;
                         this.isLastPage = res.data.data.isLastPage;
                         this.showLoading = false;

                    }else{
                        this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
         //获取banner区广告
          _getBannerAds(){
             this.$axios.get('/advertise/getSellCarAdImage').then((res) => {
                //  console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        let list = res.data.data.list;
                        if(list.length > 0 ){
                             this.topAd =  list[0];
                        }
                    }else{
                        this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        //获取下方滑动区广告
         _getSwiperAds(){
             this.$axios.get('/advertise/getSellCarProductAdImage').then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                        if(res.data.data.list){
                            this.swipLists =  res.data.data.list;
                            //设置滑动图的容器宽度
                             setTimeout(() => {
                                let tempWidth = 0;
                                this.$refs.ad.forEach(item => {
                                    tempWidth += (item.offsetWidth+16);
                                })
                                this.$refs.ads.style.width = (tempWidth)+"px";
                            },20)
                        }
                    }else{
                        this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
    },
    components:{
        commonFooter,
        Scroll,
        Slider,
        ChooseCity,
        Loading
    }
}
</script>
<style lang="scss" scoped>
    #invesment{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .head{
            height: px2rem(80);
            background-color: #e7ecf7;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 px2rem(28);
            .left{
                @include font-dpr(28px);
                color: #333333;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .iconfont{
                    @include font-dpr(48px);
                    // margin-right: px2rem(10);
                    color: #e74848;
                }
            }
            .right{
                @include font-dpr(28px);
                color: #5e93fc;
            
                .iconfont{
                    @include font-dpr(24px);
                    // margin-left: px2rem(10);
                    color: #5e93fc;
                }
                
            }
            
        }
        .scroll-container{
            position: absolute;
            top: px2rem(80);
            // top: 0;
            bottom: px2rem(90);
            left: 0;
            right: 0;
            // z-index:100;
            overflow: hidden;
            .banner-container{
                width: 100%;
                height: px2rem(374);
                img{
                    display: block;
                    height: 100%;
                    width: 100%;
                }
            }
            .nav{
                height: px2rem(90);
                display: flex;
                box-sizing: border-box;
                border-bottom: 1px solid #ededed;
                .nav-item{
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #666666;
                    @include font-dpr(28px);
                    position: relative;
                }
                .active{
                    color: #5e93fc;
                    &::after{
                        content: "";
                        display: block;
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: px2rem(74);
                        border-bottom: px2rem(4) solid #5e93fc;
                    }
                }

            }
            .list-container{
                display: flex;
                flex:1;
                flex-wrap: wrap;
                justify-content: space-between;
                width: 100%;
                .item{
                    height: px2rem(396);
                    width: 49%;
                    padding-top: px2rem(12);
                    @include font-dpr(26px);
                    .img-container{
                        box-sizing: border-box;
                        background-color: #f0f0f0;
                        width: 100%;
                        height: px2rem(240);
                        margin-bottom: px2rem(20);
                        padding: 0 px2rem(36);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img{
                            width: 100%;
                            max-height: 100%;
                        }

                    }
                    .describe{
                        padding: 0 px2rem(44) 0 px2rem(30); 
                        color:#333333;
                        @include ml-ellipsis(2);
                        height: 2.8em;
                    }
                    .item-info{
                        display: flex;
                        justify-content: space-between;
                        padding-left: px2rem(30); 
                        padding-right : px2rem(20); 
                        margin-top:  px2rem(20);
                        .percent{
                            color:#f57f3f;
                        }
                    }
                }
                .underline{
                    width: 100%;
                    text-align: center;
                    color: #666;
                }
            }
            .ads-container{
               box-sizing: border-box;
               height: px2rem(258); 
               padding:  px2rem(28) 0;
            //    padding-left: 28px;
            //    padding-right: 28px; 
               overflow-x: hidden;
               .ads{
                    display: flex;
                    flex-wrap: nowrap;
                    padding:0  px2rem(28);
                    
                    li{
                        flex-shrink: 0;
                        width: px2rem(694); 
                        height: px2rem(200);
                        margin-right: 16px;
                        border-radius:  px2rem(8);
                        
                        overflow: hidden;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }  
                    }
                }
            }
            .underline{
                width: 100%;
                text-align: center;
                color: #666;
            }
            
        }
        .footer-container{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
    .fade-enter-active,.fade-leave-active{
        transition: all 0.5s;
    }
    .fade-enter,.fade-leave-to{
        transform: translate3d(0,100%,0);
    }
</style>

