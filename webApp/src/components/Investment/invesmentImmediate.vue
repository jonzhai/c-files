<template>
    <div class="invesmenImmediate">
        <div class="banner-container">
            <div class="title-container">
                <span class="title">{{product.pName}}</span>
                <span class="total">产品规模{{product.crowdPrice/10000 | toDecimal(2)}}万</span>
            </div>
            <div class="annualEarn-container">
                <p class="title">保底年化利率</p>
                <p class="annualEarn">{{product.minAnnualEarn | toPrecent}}<span class="littlePrecent">%</span></p>
            </div>
            <div class="lock-container">
                <span class="lockday">锁定期{{product.inversCycle}}天</span>
                <span class="underMoney">{{product.startInversPrice}}起投</span>
            </div>
        </div>
        <div class="operate-container">
            <div class="baseInput inversmentMoney">
                <span class="title">投资金额（元）</span>
                <input class="inversmentIpt" type="text" v-model="inversmentMoney" placeholder="输入投资金额">
                <span class="allInverment" @click="inversmentMoney = product.userMoney">全投</span>
            </div>
            <div class="ableMoney baseInput">
                <div class="container">
                    <span>账户可用金额（元）</span>
                    <span class="balance">{{product.userMoney}}</span>
                    <span class="recharge">充值</span>
                </div>
            </div>
            <div class="presetMoney-conatiner baseInput">
                <div class="left">
                    <span>预期收益</span>
                    <span class="presetMoney">{{presetMoney}}</span>
                </div>
                <div class="right">到期还本息</div>
            </div>
            <div class="recommendPerson baseInput">
                <span>推荐人ID</span>
                <input type="text" class="recommendPersonIpt" v-model="recommendPersonId" placeholder="推荐人昵称，如没有可不填写">
            </div>
            <div class="confirmInvesment-container">
                <p class="confirmInvesment" @click="confirmInvesment">确认投资</p> 
            </div>     
        </div>

        <div class="agreement-container" v-if="showAgreement">
            <div class="agreement">
                投资协议内容区，待补充。。。

            </div>
            <div class="agree-container" @click="toggleCheck">
                <input type="checkbox" class="checkbox" :class="{active: isCheck}" >
                <span class="desc">同意《产品服务协议》</span>
            </div>
            <div class="btn-container">
                <p class="prevStep" @click="prevStep">上一步</p>
                <p class="nextStep" @click="nextStep">下一步</p>
            </div>
        </div> 
        <transition name="fade">
            <EnterPass v-if="showPass" @newPass="getNewPass"></EnterPass>
        </transition>
        <div class="toast-container" v-if="showToast">
            <toast @close="closeToast" :descText="descText"></toast>
        </div>
        <div class="loading-container" v-show="showLoading">
            <loading></loading>
        </div>
    </div>
</template>
<script> 
import {getData} from 'src/assets/js/dom';
import Md5 from 'md5';
import Qs from 'qs';
import Toast from 'src/base/toast/toast_login';
import {ToastMixin} from 'src/assets/js/mixin';
import {mapMutations} from 'vuex';
import EnterPass from 'src/base/enterPass/enterPass'; 
import Loading from 'src/base/loading/loading';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "立即投资";
        next();
    },
    mixins:[ToastMixin],
    data(){
        return {
            //投资钱数
            inversmentMoney: 0,
            //推荐人id
            recommendPersonId: '',

            //是否显示输入密码
            showPass: false,
            //是否显示协议
            showAgreement: false,
            //是否同意协议
            isCheck: false,
            product: '',
            showLoading: false
 
        }
    },
    created(){
        this.id = this.$route.params.id;
        this._getinversmentInfo(this.id);
    },
    mounted(){
      
    },
    computed:{
        presetMoney(){
            return (this.inversmentMoney*this.product.annualEarn*this.product.inversCycle/365).toFixed(2);
        }
    },
    methods:{
        //确认按钮
        confirmInvesment(){
            if(!/^\d+(\.[\d]{1,3})?$/g.test(this.inversmentMoney)){
                this.toast('投资金额必须是数字！');
                return;
            }else if(this.inversmentMoney < this.product.startInversPrice){
                this.toast('投资金额必须大于起投金额！');
                return;
            }else if(this.inversmentMoney > this.product.crowdPrice){
                 this.toast('投资金额必须小于重筹金额！');
                return;
            }else if(this.inversmentMoney > this.product.userMoney){
                 this.toast('余额不足，请充值！');
                return;
            }
            this.showAgreement = true;
            this.isCheck = false;
        },
       
        toggleCheck(){
            this.isCheck = ! this.isCheck;
        },
        toggleAgreement(){
            this.showAgreement = !this.showAgreement ;
        },
        getNewPass(pass){
            if(!pass){
                this.showPass = false;
                return;
            }

            this._submitOrder(pass).then(()=>{
                this.showPass = false;
            
                this.toast('购买成功！');
                setTimeout(()=>{
                    this.$router.push({path: '/myInvesment'})
                },500)
            }).catch((err)=>{
                this.toast(err);
            })

        },
        nextStep(){
            if(!this.isCheck){
                this.$alert('同意协议才能下一步').then((msg)=>{
                    }).catch((err) =>{
                        console.log(err)
                    })
                return;
            }
            this.showAgreement = false;

            this.showPass = true;
        },
        prevStep(){
            this.showAgreement = false;
            this.isCheck = false;
        },
        _getinversmentInfo(id){
            this.showLoading = true;
            this.$axios.get('/order/getInvestmentProductInfo',{
                params:{
                    id: id
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                        this.product = res.data.data;
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            return;
                       }
                   } 
                this.showLoading = false;
            }).catch((err) =>{
                console.log(err)
            })
        },
        _submitOrder(pass){
            let me = this;

            return new Promise((resolve,reject)=>{
                let  params =  Qs.stringify({
                    productId:  me.id,
                    inversPrice: me.inversmentMoney,
                    password: Md5(pass)
                });
                me.$axios.post('/order/addOrder',params).then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            //未设置交易密码
                            if(res.data.data.isSet === false){
                                 
                                 me.$alert(res.data.message+',点击确定设置').then((msg)=>{
                                    me.setCurOrder(me.$route.fullPath);
                                    me.$router.push({path: '/myInfoCenter/addTransitionPass'})

                                }).catch((err) =>{
                                    console.log(err)
                                })
                                // me.toast(res.data.message);
                                // setTimeout(()=>{
                                // },500)
                            }else{
                                me.$axios.get('/pay/simulatesinaAppPay',{
                                    params:{
                                        orderNumber: res.data.data
                                    }
                                }).then((res) =>{
                                    if(res.status === 200){
                                    } 
                                }).catch((err) =>{
                                    console.log(err)
                                })

                                resolve();
                            }
                        }else{
                            reject(res.data.message);
                            // me.$alert(res.data.message).then((msg)=>{
                            // }).catch((err) =>{
                            //     console.log(err)
                            // })
                            return;
                        }
                    } 

                }).catch((err) =>{
                    console.log(err)
                })
            })
          
        },
        ...mapMutations({
            setCurOrder: 'SET_CURORDER'
        })
    },
    components:{
        Toast,
        EnterPass,
        Loading
    }
}
</script>

<style lang="scss" scoped>
.invesmenImmediate{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f5f5f5;
    .banner-container{
        height: px2rem(374);
        background:url(./img/banner_bg.png) no-repeat;
        background-size: cover;
        padding: px2rem(20) px2rem(30);
        display: flex;
        flex-direction: column;
        .title-container{
            width: 100%;
            display: flex;
            justify-content: space-between;
            .title{
                color:#fff;
                @include font-dpr(28px);
                font-weight: 700;
                max-width: 10em;
                overflow: hidden;
                // @include ml-ellipsis(1);
                @include sl-ellipsis();
            }
            .total{
                color:#fffefe;
                @include font-dpr(24px);
            }
        }
        .annualEarn-container{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .title{
                color: #fffefe;
                @include font-dpr(24px);
            }
            .annualEarn{
                color:#fff;
                @include font-dpr(60px);
                font-weight: 700;
                .littlePrecent{
                    @include font-dpr(28px);
                }
            }
        }
        .lock-container{
            height: px2rem(40);
            display: flex;
            color: #fffefe;
            @include font-dpr(24px);
            position: relative;
            >span{
                flex: 1;
                line-height: px2rem(40);
                text-align: center;
            }
            .lockday{
                // border-right: 1px solid #f5f5f5; 
                border-right: 1px solid #eee; 
            }
            &:before{
                content: '';
                display: block;
                position: absolute;
                height: 1px;
                width: 100%;
                background-color: #eee;
                left: 0;
                top: px2rem(-20);
            }

        }
    }
    .operate-container{
        overflow: hidden;
        .baseInput{
            height: px2rem(90);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            padding: 0 px2rem(30);
            @include font-dpr(28px);
            color: #333333;
        }
        .inversmentMoney{
            margin-top:  px2rem(21);
            position: relative;
            .title{
                white-space: nowrap;
            }
            .inversmentIpt{
                margin-left:px2rem(40);
                flex: 1;
                margin-right: px2rem(96);
            }
            .allInverment{
                position: absolute;
                right: px2rem(30);
                top: 50%;
                transform: translate3d(0,-50%,0);
                width: px2rem(96);
                height: px2rem(48);
                line-height: px2rem(48);
                text-align: center;
                color: #f57f3f;
                border: 1px solid #f57f3f;
                @include font-dpr(26px);
                border-radius:  px2rem(24); 
                
            }
        }
        .ableMoney{
            margin-top:  px2rem(20);
            .container{
                flex: 1;
                height: 100%;
                border-bottom: 1px solid #e4e4e4;
                display: flex;
                align-items: center;
                @include font-dpr(28px);
                .balance{
                    margin-left:px2rem(40);
                    color: #999999;
                }
                .recharge{
                    margin-left:px2rem(20);
                    color:#5e93fc;
                }

            }
        }
        .presetMoney-conatiner{
            .left{
                .presetMoney{
                margin-left:px2rem(40); 
                }
            }
            .right{
                color: #999999;
            }
        }
        .recommendPerson{
            margin-top:  px2rem(20);
            .recommendPersonIpt{
                flex: 1;
                color: #999999;
                margin-left:px2rem(40); 
            }
        }
        .confirmInvesment{
            width: px2rem(650); 
            height: px2rem(96); 
            line-height: px2rem(96); 
            text-align: center;
            color: #fff;
            background-color: #5e93fc;
            @include font-dpr(36px);
            margin: 0 auto;
            margin-top: px2rem(50);
            border-radius:  px2rem(48); 
        }
    }
    .loading-container{
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);
    }
    .agreement-container{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        padding:  px2rem(30) px2rem(30) px2rem(103);
        display: flex;
        flex-direction: column;
        .agreement{
            flex: 1;
            border: 1px solid #bfbfbf;
            background-color: #fff;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .agree-container{
            height: px2rem(88);
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .checkbox{
                height: px2rem(32);
                width: px2rem(32);
                border:px2rem(4) solid #999999;
                margin-right:  px2rem(20);
                padding: px2rem(3);
                background-clip: content-box;
                &.active{
                    background-color: green;
                }
            }
            .desc{
                color: #333333;
                @include font-dpr(28px);
            }
        }
        .btn-container{
            height: px2rem(96);
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
                width: px2rem(320);
                border-radius:  px2rem(48);
                text-align: center;
                line-height: px2rem(96);
                color: #fff;
                @include font-dpr(36px);
            }
            .prevStep{
                background-color: #42bd55;
            }
             .nextStep{
                background-color: #5e93fc;
            }
        }
    }
    .toast-container{
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 900;
        transform: translate3d(-50%,-50%,0);
    }
}
</style>
