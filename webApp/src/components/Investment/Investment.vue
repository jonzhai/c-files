<template>
    <div id="invesment">
        <scroll ref="classifyScroll" :data="classifyList"  class="classify-container   " :scrollY="false">
            <ul v-cloak class="classify" ref="classify" @click="changeClassify">
                <li 
                    v-for="(item,index) in classifyList"
                    :data-cId="item.cid"
                    :data-index="index"
                    :class="{active:index == curIndex}"
                    ref="lis"
                    :key="index"
                >{{item.name}}</li>
            </ul>
            <img class="icon-right-arrow" src="./img/right_arrow.png" v-if="classifyList.length > 4"> 
        </scroll>
        <div class="timeAndRegion">
            <div class="time-btn" @click="showChooseTime = true">
                <span>持有时限</span>
                <span>{{curTime}}日</span>
                <span class="icon iconfont icon-arrow-down"></span>
            </div>
            <div class="region-btn" @click="showChooseCity = true">
                <span >地区</span>
                <span>{{curCity.name | toEllipsis}}</span>
                <span class="icon iconfont icon-arrow-down"></span>
            </div>
        </div>
        <scroll ref="listScroll" 
            :data="lists" 
            class="lists-container" 
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
                <ul v-cloak class="list-container" ref="hotLists">
                    <li  v-for="(item,index) in hotLists"  :key="index" class="list-item border-1px" >
                        <div class="img-container">
                            <img :src="item.photoIp+item.photo.src" alt="">
                            <div class="bandge" :class="{'blue-bg': item.isNew === 1,'red-bg': item.isHot === 1}" v-if="item.isNew || item.isHot">{{item.isNew === 1 ? '最新': '最热'}}</div>
                        </div>
                        <div class="yield-container">
                            <p class="yield-rate">{{item.minAnnualEarn | toPrecent}}%</p>
                            <p class="yield-desc">保底年化</p>
                        </div>
                        <div class="invesment-regulation">
                            <p class="invesment-underline">{{item.startInversPrice}}起投</p>
                            <p class="lock-days">锁定期<span>{{item.inversCycle}}</span>天</p>
                        </div>
                        <div class="go-invesment">
                            <router-link tag="span" class="invesment-btn" :to="{path: '/investment/invesmentDetail',query:{pId:item.id}}">投资</router-link>
                            <!-- <span class="invesment-btn" >投资</span>   -->
                        </div>
                    </li>
                </ul>
                <scroll ref="adScroll" :data="classifyList"  class="ads-container" :scrollY="false" v-if="swipLists.length > 0">
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
                <ul v-cloak class="list-container" ref="lists">
                    <li  v-for="(item,index) in commonLists"  :key="index" class="list-item" >
                        <div class="img-container">
                            <img :src="item.photoIp+item.photo.src" alt="">
                            <div class="bandge" :class="{'blue-bg': item.isNew === 1,'red-bg': item.isHot === 1}" v-if="item.isNew || item.isHot">{{item.isNew === 1 ? '最新': '最热'}}</div>
                        </div>
                        <div class="yield-container">
                            <p class="yield-rate">{{item.minAnnualEarn | toPrecent}}%</p>
                            <p class="yield-desc">保底年化</p>
                        </div>
                        <div class="invesment-regulation">
                            <p class="invesment-underline">{{item.startInversPrice}}起投</p>
                            <p class="lock-days">锁定期<span>{{item.inversCycle}}</span>天</p>
                        </div>
                        <div class="go-invesment">
                            <!-- <span class="invesment-btn">投资</span>   -->
                            <router-link tag="span" class="invesment-btn" :to="{path: '/investment/invesmentDetail',query:{pId:item.id}}">投资</router-link>
                        </div>
                    </li>
                </ul>
                  <p class="underline" v-show="isLastPage">已经到底了...</p>
            </div>
            <div class="loading-container" v-show="showLoading">
                <loading></loading>
            </div>
        </scroll>
        <div class="footer-container" ref="footer">
            <common-footer></common-footer>
        </div>
        <transition-group name="fade">
            <choose-time v-show="showChooseTime"  @close="closeChooseTime" key="chooseTime" :curTime="curTime"></choose-time>
            <choose-city v-show="showChooseCity"  @close="closeChooseCity"  key="chooseCity" :curCity="curCity" :isShow="showChooseCity"></choose-city>
        </transition-group>

        <router-view></router-view>
    </div>
    
</template>
<script>
import commonFooter from "src/base/commonFooter/commonFooter";
import Scroll from 'src/base/scroll/scroll';
import Slider from 'src/base/slider/slider';
import ChooseTime from 'src/base/chooseTime/chooseTime';
import ChooseCity from 'src/base/chooseCity/chooseCity';

import Loading from 'src/base/loading/loading';
import {mapGetters,mapMutations} from 'vuex';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "投资";
        next();
    },
    data(){
       return {
           //顶部分类
           classifyList: [],
            //顶部广告
            // topAd: require('./img/invesmentBanner.jpg'),
            topAd: {},

           //列表数据
           lists: [],

           //轮播广告数据
           swipLists: [
               
            ],
           curIndex: 0,
           showChooseTime: false,
           showChooseCity: false,
            //当前分类
            curCid: 0,
            pageNumber: 1,
            isLastPage: false,
            showLoading: false,

       } 
    },
    created(){
        //想获取分类然后获取列表
       this._getCategorys().then((res) =>{
           this.curCid = res.cid;
           this._getProductLists(1);
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
        ...mapGetters(['curCity','curTime'])
    },
    methods:{
        ...mapMutations({
            setCurTime: 'SET_CURTIME',
            setCurCity: 'SET_CURCITY'
        }),
        changeClassify(e){
            const target = e.target;
            this.curIndex = target.getAttribute('data-index');
            this.curCid = target.getAttribute('data-cId');
            this.$refs.classifyScroll.scrollToElement(target,0);
            this.lists = [];
            this._getProductLists(1);
        },
        pullingUp(){
            this.showLoading = true;
            if(this.isLastPage){
                this.showLoading = false;
                return;
            }
            this._getProductLists(++this.pageNumber);

            this.$refs.listScroll.finishPullUp();
        },
        closeChooseTime(time){
            // console.log(time)
            // this.curTime = time;
            this.setCurTime(time);
            this.lists = [];
            this._getProductLists(1);
            this.showChooseTime = false;
        },
        closeChooseCity(city){
            this.showChooseCity = false;
            if(!city){return};
            let tempCity = {};
            if(!city.cityId){
                tempCity.cityId = null;
                tempCity.lat = city.latLng.lat;
                tempCity.lng = city.latLng.lng;
            }else{
                tempCity.cityId = city.cityId;
                tempCity.lat = null;
                tempCity.lng = null;
            }
            tempCity.name = city.name;

            this.setCurCity(tempCity);
            this.lists = [];
            this._getProductLists(1);
        },
   
         pullingDown(e){
            this.$refs.listScroll.finishPullDown();
        },
        //获取顶部分类
        _getCategorys(){
            return new Promise((resolve,reject) =>{
                this.$axios.get('/product/getCategorys').then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            // console.log(res)
                            this.classifyList = res.data.data;
                            resolve(this.classifyList[0]);
                            //延时设置列表宽度，方可滚动
                            setTimeout(() => {
                                let parentWidth = 0;
                                if(this.$refs.lis){
                                    this.$refs.lis.forEach(item => {
                                        parentWidth += item.offsetWidth;
                                    })
                                    this.$refs.classify.style.width = parentWidth+"px";
                                }
                            },20)
                        }else{
                            this.toast(res.data.message);
                            reject();
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
            })
           
        },
        //获取产品列表
        _getProductLists(page){
             this.$axios.get('/product/getProductByCid',{
                params:{
                    cid: this.curCid,
                    pageNumber: page,
                    pageSize: 20,
                    cityId: this.curCity.cityId,
                    lat: this.curCity.lat,
                    lng: this.curCity.lng,
                    cycle: this.curTime
                }
             }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        // console.log(res)
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
          _getBannerAds(){
             this.$axios.get('/advertise/getInvestAdvertiseImage').then((res) => {
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
         _getSwiperAds(){
             this.$axios.get('/advertise/getInvestProductAdImage').then((res) => {
                //  console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        if(res.data.data.list){
                            this.swipLists =  res.data.data.list;
                             setTimeout(() => {
                                 if(this.$refs.ad && this.$refs.ad.length > 0){
                                    let tempWidth = 0;
                                    this.$refs.ad.forEach(item => {
                                        tempWidth += (item.offsetWidth+16);
                                    })
                                    this.$refs.ads.style.width = (tempWidth)+"px";
                                }
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
        ChooseTime,
        ChooseCity,
        Loading
    },
    filters:{
        toEllipsis(val){
            if(!val){
                return val;
            }else{
                if(val.length > 4){
                    return val.substr(0,4)+'...';
                }else{
                    return val;
                }
            }
        }
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

        .classify-container{
            position: relative;
            height: px2rem(88);
            width: 100%;
            overflow-x: hidden;
            @include  border-1px(#e4e4e4);
            .classify{
                display: flex;
                flex-wrap: nowrap;
                li{
                    flex-shrink: 0;
                    line-height: px2rem(88);
                    padding: 0 px2rem(40);
                    position: relative;
                    &.active:after{
                        content: "";
                        display: block;
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 50%;
                        border-bottom: 2px solid #5e93fc;
                    }
                }
            }
            .icon-right-arrow{
                position: absolute;
                z-index: 10;
                display: block;
                right: px2rem(28);
                top: 50%;
                transform: translate3d(0,-50%,0);
                width: px2rem(14);
                height: px2rem(24);

            }
        }
        .timeAndRegion{
            height: px2rem(128);
            box-sizing: border-box;
            padding: px2rem(20) px2rem(30);
            display: flex;
            justify-content: space-between;
            >div{
                flex: 1;
                border: 1px solid #e4e4e4;
                border-radius: px2rem(10);
                display: flex;
                justify-content: space-between;
                align-items: center;
                 @include font-dpr(28px);
                 color: #666666;
                 background-color: #f5f5f5;
                 padding: 0 px2rem(20);
            }
            .iconfont{
               @include font-dpr(28px); 
            }
            .time-btn{
                margin-right:  px2rem(22);
            }

        }
        .lists-container{
            position: absolute;
            top: px2rem(216);
            // top: 0;
            bottom:  px2rem(90);
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
                        a{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }  
                    }
                }
            }
            .list-container{
                padding: 0 px2rem(28);
                .list-item{
                    height:px2rem(168);
                    overflow: hidden;
                    box-sizing: border-box;
                    // @include border-1px(#e4e4e4);
                    border-bottom: 1px solid #e4e4e4;
                    display: flex;
                    >div{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .img-container{
                        width: px2rem(219);
                        position: relative;
                        img{
                           height:px2rem(90); 
                        }
                        .bandge{
                            position: absolute;
                            left: px2rem(2);
                            top: px2rem(20);
                            width: px2rem(50);
                            height:px2rem(30); 
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            // text-align: center;
                            // line-height: px2rem(30); 
                            color:#fff;
                            @include font-dpr(18px);
                            &.blue-bg{
                                background-color: #56adff; 
                            }
                            &.red-bg{
                                background-color: #fe3925; 
                            }

                        }
                    }
                    .yield-container{
                        width: px2rem(164);
                        flex-direction: column;
                        .yield-rate{
                            color: #f57f3f;
                            @include font-dpr(36px);
                        }
                        .yield-desc{
                            @include font-dpr(22px);
                            color: #999;
                        }
                    }
                    .invesment-regulation{
                        width: px2rem(184);
                        flex-direction: column;
                        .invesment-underline{
                            color: #333333;
                            @include font-dpr(28px);
                        }
                        .lock-days{
                            @include font-dpr(22px);
                            color: #999;
                            span{
                               color: #5e93fc;  
                            }
                        }
                    }
                    .go-invesment{
                        flex: 1;
                        .invesment-btn{
                            width: px2rem(120);
                            height: px2rem(60);
                            color: #b2b2b2;
                            border-radius: px2rem(30);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border: 1px solid #f57f3f;
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

