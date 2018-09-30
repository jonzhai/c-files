<template>
    <div class="recharge">
        <div v-if="!noCard">
            <div class="input-group">
                <div class="left">银行卡信息</div>
                  <div class="right" @click="toChooseCards">
                    <span class="bank-name">建设银行</span>
                    <span>6236</span>
                    <span>****</span>
                    <span>****</span>
                    <span>3523</span>
                    <span class="icon iconfont icon-right1"></span>
                </div>
            </div>
            <div class="remainder-container">
                可提现金额：1223.12
            </div>
            <div class="recharge-ipt-container">
                <div class="title">提现金额</div>
                <div class="content">
                    <span class="dollar">￥</span>
                    <input type="text" placeholder="输入提现金额" class="recharge-ipt" v-model="money" autofocus>
                </div>
            </div>
            <div class="confirm-container">
                <div class="confirm-btn" :class="{active: isReady}" @click="rechargeImmediate">立即提现</div>
            </div>
        </div>
        <router-link tag="div" class="add-card-wrapper" :to="{path:'/addBankCard'}" v-if="noCard">
            <img src="./img/addCard.png" alt="">
            <span class="add-card">添加银行卡</span>
        </router-link>
        

        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div>
        <transition name="slide">
             <router-view></router-view>
        </transition>
        <!-- <transition name="slide">
            <ChooseBankCard @chooseCard="chooseCard" v-if="showChooseCard"></ChooseBankCard>
        </transition> -->
        <transition name="fade">
            <EnterPass v-if="showPass" @newPass="getNewPass"></EnterPass>
        </transition>
    </div>
</template>
<script>
import Toast from 'src/base/toast/toast_login';
import {ToastMixin} from 'src/assets/js/mixin';
import {mapGetters, mapActions} from 'vuex';
import Qs from 'qs';
import Md5 from 'md5';
import ChooseBankCard from './chooseBankCard';
import EnterPass from 'src/base/enterPass/enterPass'; 

import eventBus from 'src/assets/js/eventBus';
export default {
    mixins:[ToastMixin],
    beforeRouteEnter: (to, from, next) => {
        document.title = "提现";
        next();
    },
    data(){
        return {
            //充值的钱数
            money: null,
            //是否显示选择卡片
            showChooseCard: false,
            //当前是否有卡
            noCard: false,

            showPass: false
        }
    },
     computed:{
         isReady(){
             return !this.noCard && /^\d{1,10}(\.\d{1,2})?$/.test(this.money) && this.money >= 100 ;
         },
        ...mapGetters(['prevRouter'])
    },
    created() {
        //每次重建先移除事件，避免重复多次绑定
         eventBus.$off('getCard');
    },
    mounted() {
        eventBus.$on('getCard',(data) => {
            console.log(data)
        })
    },
    methods:{
        chooseCard(card){

            this.showChooseCard = false;
        },
        getNewPass(pass){
            if(!pass){
                this.showPass = false;
                return;
            }
            //此处发送请求
            console.log(pass)
        },
        rechargeImmediate(){
            if(!this.isReady){
                this.toast('请输入正确提现金额！');
                return;
            }
            this.showPass = true;
        },
        tologin(){
            
          
            let  params =  Qs.stringify({
                 phone:  this.phone,
                //  code: this.code,
                 password: Md5(this.password)
             });
            this.$axios.post('/app/login',params).then((res) =>{
                console.log(res)
                   if(res.status === 200){
                       if(res.data.code > 0){
                            this.LOGIN({
                                token: res.data.data.Authorization,
                                curCount: this.phone
                            });
                            this.toast('登录成功！');
                            setTimeout(() => {
                                this.$router.replace({path: this.prevRouter});
                            },500)
                       }else{
                            this.toast(res.data.message);
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })

            //如果通过。发送ajax请求，成功后，跳转至记录页
          

            
           
        },
        toChooseCards(){
             this.$router.push({path: '/withdrawCash/chooseBankCard'});
        },
        ...mapActions(['LOGIN'])

    },
    components:{
        Toast,
        ChooseBankCard,
        EnterPass
    }
}
</script>

<style lang="scss" scoped>
    .recharge{
        background: #f5f5f5;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .input-group{
            background: #fff;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: px2rem(96);
            margin-bottom:  px2rem(17);
            overflow: hidden;
            padding: 0 px2rem(30);
            position: relative;
            .left{
                color:#666;
                @include font-dpr(28px);
            }
            .right{
                @include font-dpr(28px);
                color: #999;
                .bank-name{
                    color:#333;
                }
                .iconfont{
                    @include font-dpr(28px);
                    margin-left:px2rem(28);
                }
            }
            
        
        }
        .remainder-container{
            height: px2rem(66);
            line-height: px2rem(66);
            padding: 0 px2rem(30);
            color: #999;
            @include font-dpr(24px);
        }
        .recharge-ipt-container{
            height: px2rem(163);
            background-color: #fff;
            padding: 0 px2rem(30);
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title{
                color: #666;
                @include font-dpr(24px);
                // margin-bottom: px2rem(1);
            }
            .content{
                display: flex;
                align-items: center;
                .dollar{
                    color: #666;
                    @include font-dpr(60px);
                    margin-right:  px2rem(20);
                }
                .recharge-ipt{
                    color: #999;
                    @include font-dpr(28px);
                }

            }
        }
        .confirm-container{
            padding: 0 px2rem(49);
            height: px2rem(96);
            overflow: hidden;
            margin-top:  px2rem(60);
            .confirm-btn{
                width: 100%;
                color: #fff;
                background-color: #d6d6d6;
                text-align: center;
                line-height:  px2rem(96);
                border-radius: px2rem(48);
                @include font-dpr(36px);
                &.active{
                   background-color: #5e93fc;
                }
            }
        }
        .add-card-wrapper{
            display: flex;
            justify-content: center;
            align-items: center;
            height: px2rem(88);
            background-color: #fff;
            border-radius:  px2rem(10);
            margin-top:  px2rem(20);
            img{
                width: px2rem(47);
                height: px2rem(30);
            }
            .add-card{
                @include font-dpr(28px);
                color: #666;
                margin-left:  px2rem(16);
            }
        }
        .toast-container{
            position: absolute;
            left: 50%;
            // bottom: px2rem(287);
            bottom: 30%;
            z-index: 100;
            transform: translate3d(-50%,0,0);
        }
    }
    .slide-enter-active,.slide-leave-active{
        transition: all 0.5s;
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0);
    }
</style>

