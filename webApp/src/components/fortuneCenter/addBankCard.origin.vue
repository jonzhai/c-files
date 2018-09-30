<template>
    <div class="add-bank-card">
        <div class="input-group">
            <label for="cardNum" class="input_label">卡号</label>
            <input type="text" id="cardNum" class="input" placeholder="请输入银行卡号" v-model="cardNum" autocomplete="off"> 
            <div class="feedback-container">
                <login-validate :showType="cardNumFeedBackType" :errorMsg="cardNumErrorMsg"></login-validate>
            </div>
        </div>
        <div class="tips" >
            <div class="title">
                持卡人信息
            </div>
            <div class="desc">
                <span class="icon iconfont  icon-gantanhao"></span>
                <span>请谨慎填写信息，核实后不可更改</span>
            </div>
        </div>
         <div class="input-group">
            <label for="cardName" class="input_label">姓名</label>
            <input type="text" id="cardName" class="input" placeholder="请输入您的真实姓名" v-model="cardName" autocomplete="off">
             <div class="feedback-container">
                <login-validate :showType="cardNameFeedBackType" :errorMsg="cardNameErrorMsg"></login-validate>
            </div>
        </div>
        <div class="input-group">
            <label for="cardId" class="input_label">身份证</label>
            <input type="text" id="cardId" class="input" placeholder="请输入您的身份证号" v-model="cardId" autocomplete="off">
             <div class="feedback-container">
                <login-validate :showType="cardIdFeedBackType" :errorMsg="cardIdErrorMsg"></login-validate>
            </div>
        </div>
        <div class="agreeProtocol" @click="toggleAgree">
            <span class="check-box" :class="{active: isAgree}"></span>
            <span class="protocol">同意《银行卡绑定及解绑服务协议》</span>
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" :class="{active: isReady}" @click="tologin">下一步</div>
        </div>
        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import Toast from 'src/base/toast/toast_login';
import {ToastMixin} from 'src/assets/js/mixin';
import loginValidate from 'src/base/validateFeedback/loginValidate';
import {mapGetters, mapActions} from 'vuex';
import {RegFeedBackType} from 'src/assets/js/config'
import Qs from 'qs';
import Md5 from 'md5';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "添加银行卡";
        next();
    },
    mixins:[ToastMixin],
    data(){
        return {
            cardNum: '',
            cardNumFeedBackType: 0,
            cardNumErrorMsg: '',
            cardName: '',
            cardNameFeedBackType: 0,
            cardNameErrorMsg: '',
            cardId: '',
            cardIdFeedBackType: 0,
            cardIdErrorMsg: '',
            isAgree: false
        }
    },
     computed:{
        // cardNumFeedBackType: function(){
        //     let reg  = /^1\d{10}$/g;
        //     return reg.test(this.cardNum) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        // },
        // cardNameFeedBackType: function(){
        //     let reg  = /^\d{6}$/g;
        //     return reg.test(this.cardName) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        // },
        // cardIdFeedBackType: function(){
        //     let reg  = /^\w{6,15}$/g;
        //     return reg.test(this.cardId) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        // },
        isReady: function(){
            return this.cardNumFeedBackType === RegFeedBackType.showSuccess  && this.cardIdFeedBackType === RegFeedBackType.showSuccess;
        },
        ...mapGetters(['prevRouter'])
    },
    methods:{
        tologin(){
            if(this.cardNumFeedBackType !== RegFeedBackType.showSuccess){
                 this.toast('手机号码格式不正确！');
                 return;
            }else if(this.cardIdFeedBackType !== RegFeedBackType.showSuccess){
                this.toast('密码格式不正确');
                return;
            }
            // else if(this.cardNameFeedBackType !== RegFeedBackType.showSuccess){
            //     this.toast('验证码格式不正确');
            //     return;
            // }
            let  params =  Qs.stringify({
                 phone:  this.phone,
                //  code: this.code,
                 password: Md5(this.password)
             });
            // let  params = new URLSearchParams();
            // params.append('phone', this.phone);
            // params.append('code', this.code);
            // params.append('password', this.password);
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

                            // if(res.data.data.operating === "REGISTER_SUCCESS"){
                            //     this.$router.replace({path: this.prevRouter});
                            // }else{
                            //     this.$router.replace({path: this.prevRouter});
                            // }
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
        toggleAgree(){
            this.isAgree = !this.isAgree;
        },
        ...mapActions(['LOGIN'])

    },
    components:{
        Toast,
        loginValidate
    }
}
</script>

<style lang="scss" scoped>
    .add-bank-card{
        background: #f5f5f5;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .tips{
            height: px2rem(70);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 px2rem(30);
            color: #999;
            .title{
                @include font-dpr(28px); 
            }
            .desc{
                 @include font-dpr(24px);
                .iconfont{
                    @include font-dpr(24px);
                    color: #f57f3f; 
                }
            }
        }
        input:-webkit-autofill{
            background: #fff;
        }
        .input-group{
            background: #fff;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            height: px2rem(96);
            margin-bottom:  px2rem(17);
            overflow: hidden;
            padding: 0 px2rem(30);
            position: relative;
            .input_label{
                width: 3em;
                // display: flex;
                // justify-content: flex-start;
                // align-items: center;
                margin-right:  px2rem(40);
                color:#666;
                flex-shrink: 0;
                @include font-dpr(28px);
            }
            .input{
                flex: 1;
                @include font-dpr(28px);
                color: #333;
            }
            .feedback-container{
                position: absolute;
                right: px2rem(28);
                top: 50%;
                transform: translate3d(0,-50%,0);
            }
            .select{
                border: 0;
                width: 100%;
                height: 100%;
                background-color: #fff;
            }
        
        }
        .agreeProtocol{
            box-sizing: border-box;
            height: px2rem(92);
            padding-bottom: px2rem(20);
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .check-box{
                box-sizing: border-box;
                border-radius: px2rem(1);
                height: px2rem(32);
                width: px2rem(32);
                border:px2rem(4) solid #999999;
                margin-right:  px2rem(20);

                padding: px2rem(3);
                background-clip: content-box;
                transform: translate3d(0,-10%,0);
                &.active{
                    background-color: green;
                }
            }
            .protocol{
                  @include font-dpr(28px);
                  color: #333;
            }
        }
        .confirm-container{
            padding: 0 px2rem(49);
            height: px2rem(96);
            overflow: hidden;
            margin-top:  px2rem(18);
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
        .forgetPassword{
            margin-top:  px2rem(20);
            text-align: center;
            @include font-dpr(28px);
        }
        .register{
            margin-top:  px2rem(20);
            text-align: center;
            @include font-dpr(28px);
        }
        .foot{
            padding: 0 px2rem(100);
            margin-top:  px2rem(20);
            display: flex;
            justify-content: space-between;
            >div{
                color: #999;
                @include font-dpr(28px);
            }
        }
        .toast-container{
            position: absolute;
            left: 50%;
            // bottom: px2rem(287);
            bottom: 30%;
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

