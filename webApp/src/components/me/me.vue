<template>
    <div class="me">
        <scroll 
            ref="scroll" 
            class="scroll-container"
            :listenScroll="true"
            @pullingDown="pullingDown"
            @pullingUp="pullingUp"
        >   
        <div>
            <div class="user-info">
                <div class="head">
                    <img class="user-img" :src="!user.image.src ? defalutUserImg : user.photoIp+user.image.src" alt="">
                    <div class="user-container">
                        <p class="userName">{{user.nickName}}</p>
                        <p class="userPhone">{{user.phone}}</p>
                    </div>
                    <span class="logout" @click="logout"></span>
                </div>
                <div class="foot">
                    <router-link tag="div" class="myInverse" :to="{path: '/myInvesment'}">
                        <span class="title">{{user.inverstCount ? user.inverstCount : 0}}</span>
                        <span class="desc">我的投资</span>
                    </router-link>
                    <router-link tag="div" class="myCard" :to="{path: '/myBankCards'}">
                         <span class="title">0</span>
                        <span class="desc">银行卡</span>
                    </router-link>
                    <!-- <div class="myCard">
                        <span class="title">0</span>
                        <span class="desc">银行卡</span>
                    </div> -->
                     <router-link tag="div" class="myInfo" :to="{path: '/myInfoCenter'}">
                        <span class="title icon iconfont icon-yonghutouxiang"></span>
                        <span class="desc">个人信息</span>
                    </router-link>
                </div>
            </div>
            <div class="fortune-info">
                <div class="border"></div>
                <!-- 财富功能未实现-->
                <router-link tag="div" class="myFortune commonRow" :to="{path: '/myFortune'}">
                    <span>我的财富</span>
                    <span class="icon iconfont icon-right1"></span>
                </router-link>
                <!-- <div class="myFortune commonRow">
                    <span>我的财富</span>
                    <span class="icon iconfont icon-right1"></span>
                </div> -->
                <div class="totalFortune">
                    <p class="title">总财富</p>
                    <p class="total hide-money" v-show="!showMoney">****<img src="./img/hideMoney.png"  class="eye" alt="" @click="showMoney = !showMoney"></p>
                    <p class="total show-money" v-show="showMoney">123456<img src="./img/showMoney.png"  class="eye" alt="" @click="showMoney = !showMoney"></p>
                </div>
                <div class="earn">
                    <div class="left"><span class="title">今日收益</span><span class="xing" v-show="!showMoney">****</span><span class="earn-m" v-show="showMoney">10.05</span>  </div>
                    <div class="right"><span class="title">累计收益</span><span class="xing" v-show="!showMoney">****</span><span class="earn-m" v-show="showMoney">100.05</span> </div>
                </div>
                <div class="operate">
                    <div class="left">
                        <router-link tag="div" :to="{path: '/recharge'}">
                           <img class="operate-icon" src="./img/recharge@2x.png" alt="">
                            <p class="operate-paly">充值</p>
                        </router-link>
                        <!-- <img class="operate-icon" src="./img/recharge@2x.png" alt="">
                        <p class="operate-paly">充值</p> -->
                    </div>
                    <router-link tag="div" class="right" :to="{path: '/withdrawCash'}">
                         <img class="operate-icon" src="./img/withdrawCash@2x.png" alt="">
                        <p class="operate-paly">提现</p>
                    </router-link>
                    <!-- <div class="right">
                        <img class="operate-icon" src="./img/withdrawCash@2x.png" alt="">
                        <p class="operate-paly">提现</p>
                    </div> -->
                </div>
            </div>
            <div class="list-vontainer">
                <div class="commonRow">
                    <span>关于远盈</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="commonRow">
                    <span>公司资质</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="more-border commonRow">
                    <span>网点分布</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="commonRow">
                    <span>如何投资</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="more-border commonRow">
                    <span>常见问题</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="more-border commonRow">
                    <span>联系客服</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
                <div class="opinions commonRow">
                    <span>意见与反馈</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
            </div>
        </div>
        </scroll>
        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div>
        <div class="footer-container" ref="footer">
            <common-footer></common-footer>
        </div>
    </div>
</template>
<script>
import commonFooter from "src/base/commonFooter/commonFooter";
import Scroll from 'src/base/scroll/scroll';
import {mapActions} from 'vuex';
import {ToastMixin} from 'src/assets/js/mixin';
import Toast from 'src/base/toast/toast_login';
// import {Alert}  from  'src/assets/js/common' 

export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "我";
        next();
    },
    mixins:[ToastMixin],
    data(){
        return {
            defalutUserImg: require('./img/userDefault.png'),
            showMoney: false,
            user:{
                image:{}
            }
        }
    },
    created(){
        this._getUserInfo();
    },
    mounted() {
    },
    methods:{
        pullingDown(e){
            this.$refs.scroll.finishPullDown();
        },
        pullingUp(){
            this.$refs.scroll.finishPullUp();
        },
        logout(){
            this.$axios.get('/app/logOut').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.toast('成功退出！');
                        setTimeout(() => {
                            this.LOGOUT();
                            this.$router.replace({path: '/home'})
                        }, 500);
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
         _getUserInfo(){
            this.$axios.get('/app/getUserBaseInfo').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.user = res.data.data;
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
        ...mapActions(['LOGOUT'])
    },
    components:{
        commonFooter,
        Scroll,
        Toast
    },
    filters:{
        hidePhone(val){
            return `${val.substr(0,3)}****${val.substr(-4,4)}`
        }
    }
}
</script>

<style lang="scss" scoped>
.me{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .scroll-container{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: px2rem(90);
        overflow: hidden;
    }
    .user-info{
        height: px2rem(321);
        box-sizing: border-box;
        padding: px2rem(30);
        display: flex;
        flex-direction: column;
        .head{
            height: px2rem(130);
            width: 100%;
            position: relative;
            display: flex;
            align-items: center;
            .user-img{
                width: px2rem(130);
                height: px2rem(130);
                border-radius: px2rem(65); 
                margin-right: px2rem(28);  
            }
            .user-container{
                .userName{
                    @include font-dpr(32px);
                    color:#3c3d41;
                    margin-bottom:  px2rem(20);  
                }
            }
            .logout{
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                width: px2rem(34);  
                height: px2rem(38);
                background: url(./img/logout@2x.png) no-repeat;
                background-size: contain; 
            }

        }
        .foot{
            flex: 1;
            display: flex;
            >div{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                position: relative;
            }
            .myInverse:after,.myCard:after{
                content: '';
                width: 1px;
                height:  px2rem(68);
                background-color: #f4f4f4;
                // background-color: #000;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translate3d(0,-50%,0);
            }
            .title{
                color: #333333;
                @include font-dpr(48px);
                font-weight: 700;
                margin-bottom:  px2rem(14);
            }
            .desc{
                color: #999999;
                @include font-dpr(22px); 
            }
        }
    }
    .commonRow{
       height: px2rem(88);
       display: flex;
       justify-content: space-between;
       align-items: center;
       @include font-dpr(28px);
       color:#3c3d41;
       padding: 0 px2rem(30);
       border-bottom: 1px solid #e4e4e4; 
       .iconfont{
           color: #999999;
            @include font-dpr(28px);
       }
    }
    .fortune-info{
        .border{
            height: px2rem(20);
            background-color: #f5f5f5;
        }
        .totalFortune{
            height: px2rem(180);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
             border-bottom: 1px solid #e4e4e4; 
            .title{
               color: #999999;
                @include font-dpr(22px); 
            }
            .total{
                color: #333333;
                @include font-dpr(60px);
                font-weight: 700;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
                position: relative;
                &.hide-money{
                    margin-top:  px2rem(10);
                    .eye{
                        position: absolute;
                        height: px2rem(20);
                        width: px2rem(40);
                        right: px2rem(-60);
                        top: 50%;
                        transform: translate3d(0,-100%,0);
                    }
                }
                &.show-money{
                    margin-top:  px2rem(20);
                    height: px2rem(28);
                    .eye{
                        margin-left: px2rem(20);
                    }
                }
              
            }
        }
        .earn{
           height: px2rem(80);
            padding: 0 px2rem(30);
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                position: relative;
            }
            .title{
                color: #999999;
                @include font-dpr(24px);
                margin-right:  px2rem(20);
            }
            .xing{
                color: #f57f3f;
                // position: absolute;
                // right: 0;
                // top: 0;
            }
            .earn-m{
                color: #f57f3f;
            }
             
        }
        .operate{
            height: px2rem(208);
            background-color: #f5f5f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 px2rem(32);
            >div{
                width: px2rem(334);
                height: px2rem(166);
                border: 1px solid #e4e4e4;
                background-color: #fff;
                border-radius:  px2rem(10);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .operate-icon{
                    width: px2rem(50);
                    height: px2rem(36);
                    margin-bottom: px2rem(22);
                }
                .operate-paly{
                    color: #333333;
                    @include font-dpr(28px);
                    
                }
            }
        }
        
    }
    .list-vontainer{
        .more-border{
            border-bottom:px2rem(20) solid #f5f5f5;
        }
        .opinions{
            border-bottom:px2rem(36) solid #f5f5f5;
        }
    }
    .toast-container{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
    }
    .footer-container{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
    }
}
</style>

