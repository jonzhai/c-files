<template>
    <div id="home">
        <scroll 
            ref="scroll" 
            class="scroll-container"
            :data="recommendLists" 
            :listenScroll="true"
            @pullingDown="pullingDown"
            @pullingUp="pullingUp"
            @click="toLogin"
        >   
            <div>
                <div class="swiper-container"  ref="sliderWrapper">
                    <slider :showDot="lists.length > 1" :autoPlay="lists.length > 1" :loop="lists.length > 1" :interval="1500" v-if="lists.length > 0">
                        <div v-for="(item,index) in lists" :key="index">
                            <a :href="item.href">
                                <img class="needsclick" :src="item.image ? item.image.photoIp+item.image.src : ''">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="banner-container "  ref="banner">
                    <div class="content">
                        <a class="immediatelyLogin" v-if="bannerState === 'noLogin'"  @click="toLogin" v-cloak>立即登录<span class="icon iconfont icon-right_b"></span></a>
                        <router-link tag="p" to="/investment" class="noProfit immediatelyLogin" v-if="bannerState === 'noProfit'" v-cloak>您暂无收益，<span class="getInfo">去了解投资项目</span><span class="icon iconfont icon-right_b"></span></router-link>
                        <div class="todayProfit" v-if="bannerState === 'profit'" v-cloak>
                            <p class="title">今日收益（元）</p>
                            <p class="detail-profit">{{5.101}}</p>
                        </div>
                        <p class="investmentPlatform"><span class="question"></span>如何投资汽车众筹平台</p>
                    </div>
                </div>
                <div class="recommend">
                    <div class="title-container">
                        <p class="title">最新推荐</p>   
                    </div> 
                    <div class="recommendLists">
                        <div v-cloak class="item" v-for="(item,index) in recommendLists" :key="index" @click="toProductDetail(item.id)">
                            <div class="img-container">
                                <img :src="item.photoIp+item.photo[0].src"> 
                            </div>
                            <p class="describe">{{toEllipsis(item.pName, 20)}}</p>
                            <div class="item-info">
                                <span class="percent">+{{item.annualEarn  | toPrecent}}%</span>
                                <span class="lock-day">锁定期{{item.inversCycle}}天</span>
                            </div>
                        </div>
                        <p class="underline" v-show="isLastPage">已经到底了...</p>
                    </div>
                </div>
            </div>
            <div class="loading-container" v-show="showLoading">
                <loading></loading>
            </div>
        </scroll>
        <div class="footer-container" ref="footer">
            <common-footer></common-footer>
            <router-link tag="div" class="smallBell" to="/systemMsg">
                <span class="tips"  v-if="newsNum > 0">{{newsNum > 99 ? 99+'+' : newsNum}}</span>
            </router-link>
        </div>
       <div class="mock" v-if="showReward">
            <div class="alert-container">
                <!-- <transication-reward 
                    rTitle="黄小鸡交易成功"
                    :rewardType= "0"
                    ValidityTime="2018-04-28"
                ></transication-reward> -->
                <fresh-reward 
                    operateStep="恭喜您"
                    rewardDesc="获得新手体验券"
                    cardType=" 新手体验券"
                    ValidityTime="2018-04-28"
                    @close="closeReward"
                ></fresh-reward>
            </div>
        </div>
        <router-view></router-view>

    </div> 
</template>
<script>
import commonFooter from "src/base/commonFooter/commonFooter";
import Scroll from 'src/base/scroll/scroll';
import Slider from 'src/base/slider/slider';
import Loading from 'src/base/loading/loading';


import TransicationReward from 'src/base/alert/transicationReward';
import FreshReward from 'src/base/alert/freshReward';

import {mapMutations,mapGetters} from 'vuex';
import {SET_PREVROUTER} from 'src/store/mutationTypes';

import {bannerState} from 'src/assets/js/config'
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "车盈在线";
        next();
    },
    data(){
        return {
            //轮播图数据
            lists:[ ],
            //banner的状态
            bannerState: bannerState.noLogin,
            //推荐的列表
            recommendLists: [],
            pageNumber: 0,
            isLastPage: false,
            //是否显示loading
            showLoading: false,
            showReward: false,

            //新通知的条数
            newsNum: 0
           
        }
    },
    created(){

        //判断当前用户是否已登录，然后判断是否有收益
        if(!this.curCount){
            this.bannerState = bannerState.noLogin;
        }else{
            //去请求收益
    
            this.bannerState = bannerState.noProfit;
            this._getNews();
        }

        //奖券
    //    if(this.$route.query.showReward){
    //        this.showReward = true;
    //    }
        //获取推荐列表
        this.getRecommendLists(1);
        this._getBannerAds();
    },
    mounted(){
    },
    methods:{
        pullingDown(e){
            this.showLoading = false;
            this.$refs.scroll.finishPullDown();
        },
   
        pullingUp(){
            if(this.isLastPage){
                return;
            }
            this.getRecommendLists(++this.pageNumber);

            this.$refs.scroll.finishPullUp();
        },
        //如果需要根据加载的图片来计算滚动，需要在图片onload钩子使用
        // loadImage() {
        //     if (!this.checkloaded) {
        //         this.checkloaded = true;
        //         this.$refs.scroll.refresh();
        //     }
        // },
        toLogin(){
            //记录跳转至登录页面的当前地址
            this.setPrevRouter(this.$route.fullPath);
            this.$router.push({path: "/login"});
        },
        closeReward(){
            this.showReward = false;
        },
        toProductDetail(id){
            this.$router.push({path: `/home/invesmentDetail`,query:{pId:id}});
        },
        getRecommendLists(pageIndex){
            this.showLoading = true;
            this.$axios.get('/product/getRecommenProduct',{
                params:{
                    pageNumber: pageIndex,
                    pageSize: 20
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                        
                        res.data.data.list.forEach((element) => {
                             this.recommendLists.push(element);
                        })
                        // console.log(this.recommendLists)
                         this.pageNumber = res.data.data.pageNum;
                         this.isLastPage = res.data.data.isLastPage;
                         this.showLoading = false;
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            // this.toast(res.data.message);
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })
        },
        toEllipsis(text,num){
            if(typeof text !== "string"){return};
            return text.length > num ? text.substr(0,num)+'...' : text;
        },
        _getNews(){
            this.$axios.get('/app/getUserUnMessageCount').then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.newsNum =  res.data.data;
                    }else{
                        this.$alert(res.data.message).then((msg)=>{
                                // console.log(msg)
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
             this.$axios.get('/advertise/getIndexAdvertiseImage').then((res) => {
                //  console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists =  res.data.data.list;
                    }else{
                        this.$alert(res.data.message).then((msg)=>{
                                // console.log(msg)
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
        ...mapMutations({
            setPrevRouter: SET_PREVROUTER
        })

    },
    computed:{
        ...mapGetters(['curCount'])
    },
    components:{
        commonFooter,
        Scroll,
        Slider,
        Loading,
        TransicationReward,
        FreshReward
    }
}
</script>
<style lang="scss" scoped>
    #home{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: border-box;
        overflow: hidden;
        .scroll-container{
            // height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom:px2rem(88);
            .swiper-container{
                height: px2rem(374);
                width: 100%;
            }
            .banner-container{
                box-sizing: border-box;
                height: px2rem(260);
                overflow: hidden;
                .content{
                    background-image: url(../../assets/img/banner-bg@2x.png);
                    background-repeat: no-repeat; 
                    background-size: cover; 
                    border-radius: 10px;
                    color: #fff;
                    height: px2rem(200);
                    width: px2rem(694);
                    margin: px2rem(30) auto;
                    overflow: hidden;
                    position: relative;
                    @include font-dpr(28px);
                    .immediatelyLogin{
                        height: px2rem(32);
                        display: flex;
                        align-items: center;
                        position: absolute;
                        left: px2rem(40);
                        top: px2rem(70);
                        .iconfont{
                            // background-image: url(./img/icon-circle-right@2x.png);
                            // background-repeat: no-repeat; 
                            // background-size:cover; 
                            // height: 100%;
                            // width: px2rem(32);
                            @include font-dpr(28px);
                            color: #f7ff70;
                            margin-left:  px2rem(16);
                            vertical-align: middle;
                            // position: relative;
                            // width: px2rem(32);
                        }
                    }
                    .noProfit{
                        .getInfo{
                            color:#f7ff70;
                        }
                    }
                    .todayProfit{
                        left: px2rem(40);
                        position: absolute;
                        top: px2rem(30);
                        .title{
                            color:#eee;
                        }
                        .detail-profit{
                            @include font-dpr(50px);
                        }

                    }
                    .investmentPlatform{
                        height: px2rem(32);
                        display: flex;
                        align-items: center;
                        position: absolute;
                        bottom: px2rem(20);
                        left: px2rem(40);
                        .question{
                            background-image: url(./img/sprite-home@2x.png);
                            background-position: px2rem(-166) px2rem(-7);
                            background-size:  px2rem(400);
                            background-repeat: no-repeat; 
                            display: inline-block;
                            position: relative;
                            height: 100%;
                            width: px2rem(32);
                            margin-right:  px2rem(16);
                        }
                    
                    }
                }

            }
            .recommend{
                display: flex;
                flex-direction: column;
                .title-container{
                    height: px2rem(44);
                    box-sizing: border-box;
                    padding: px2rem(8) px2rem(28);
                    .title{
                        border-left: px2rem(4) solid #5e93fc; 
                        padding-left: px2rem(16);
                        line-height: 1;
                        @include font-dpr(26px);
                    }
                }
                .recommendLists{
                    display: flex;
                    flex:1;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    width: 100%;
                    .item{
                        height: px2rem(396);
                        width: 49%;
                        
                        padding-top: px2rem(12);
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
                            @include font-dpr(26px);
                            // @include ml-ellipsis(2);
                            height: 2.8em;
                            overflow: hidden;
                            white-space: wrap;
                        }
                        .item-info{
                            display: flex;
                            justify-content: space-between;
                            padding-left: px2rem(30); 
                            padding-right : px2rem(20); 
                            margin-top: px2rem(22);
                            .percent{
                                @include font-dpr(26px);
                                color:#f57f3f;
                            }
                            .lock-day{
                                @include font-dpr(22px);
                                color: #999;
                            }
                        }
                    }
                    .underline{
                        width: 100%;
                        text-align: center;
                        color: #666;
                    }
                }
               
            }
            .loading-container{
                position: absolute;
                left: 0;
                right: 0;
                bottom:px2rem(50);
                // display: flex;
                // justify-content: center;
                // align-items: center;
            }
        }
        .footer-container{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            // background-color: transparent;
            .smallBell{
                width: px2rem(136);
                height: px2rem(136);
                border-radius: 50%;
                background: url(./img/little_bell@2x.png) center no-repeat; 
                // background-position: center;
                // background-repeat: no-repeat;  
                background-size: contain; 
                position: absolute;
                top: px2rem(-150);
                right: px2rem(30);
                background-color: transparent;
                .tips{
                    background: #f00;
                    color: #fff;
                    padding: px2rem(5) px2rem(10);
                    border-radius:px2rem(30);
                    position: absolute;
                    right: px2rem(15);
                    top: px2rem(20);
                }
            }
        }
        .mock{
            position: fixed;
            z-index: 900;//蒙板设置900，弹出层设置900+
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    // .slide-enter,.slide-leave-to{
    //     height: 0;
    // }
    // .slide-enter-active,.slide-leave-active{
    //     transition: all 1s;
    // }
</style>


