<template>
    <div class="register">
        <!-- <div class="tips" >
            <span class="icon iconfont  icon-gantanhao"></span>
            <span>如果没有注册，我们将会通过此手机号为您自动创建账号。</span>
        </div> -->
        <div class="input-group">
            <label for="rUserPhone" class="input_label">手机号</label>
            <input type="text" id="rUserPhone" class="input" placeholder="请输入11位手机号" v-model="phone" autocomplete="off"> 
        </div>
        <div class="input-group">
            <label for="verificationCode" class="input_label">验证码</label>
            <input type="text" id="verificationCode" class="input" placeholder="请输入短信验证码" v-model="code" autocomplete="off">
            <div class="verificationCode-container">
                <getPhoneCode  @getCode="getCode" @toast="toast" :isOk="phoneFeedBackType === 1" :isError="isError"></getPhoneCode>
            </div>
           
        </div>
         <div class="input-group">
            <label for="rPassword" class="input_label">密码</label>
            <input type="password" id="rPassword" class="input" placeholder="请输入6位以上的密码" v-model="password" autocomplete="off">
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" :class="{active: isReady}" @click="toRegister">立即注册</div>
        </div>
        <!-- <router-link tag="div" class="forgetPassword" to="/login/resetPassword">忘记密码？</router-link> -->
        <!-- <div class="forgetPassword" @click="toResetPassword">忘记密码？</div> -->
        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="1000"></toast>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import Toast from 'src/base/toast/toast_login';
import loginValidate from 'src/base/validateFeedback/loginValidate';
import {mapGetters, mapActions} from 'vuex';
import {RegFeedBackType} from 'src/assets/js/config'
import GetPhoneCode from 'src/base/getPhoneCode/getPhoneCode';
import Qs from 'qs';
import Md5 from 'md5';
import {ToastMixin} from 'src/assets/js/mixin';

export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "注册";
        next();
    },
    beforeRouteLeave:  (to, from, next) => {
        document.title = "登录";
        next();
    },
    mixins:[ToastMixin],
    data(){
        return {
            phone: '',
            code: '',
            password: '',
            //获取验证码的次数
            getCodeTimes: 0,
            //
            countDown: 0,
            isError: false
        }
    },
     computed:{
        phoneFeedBackType: function(){
            let reg  = /^1\d{10}$/;
            return reg.test(this.phone) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        },
        codeFeedBackType: function(){
            let reg  = /^\d{6}$/;
            return reg.test(this.code) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        },
        passFeedBackType: function(){
            //匹配6~15位数字，字母，和英文半角符号
            let reg  = /^[\x00-\xff]{6,15}$/;
            return reg.test(this.password) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        },
        isReady: function(){
            return this.phoneFeedBackType === RegFeedBackType.showSuccess && this.codeFeedBackType === RegFeedBackType.showSuccess && this.passFeedBackType === RegFeedBackType.showSuccess;
        },
        ...mapGetters(['prevRouter'])
    },
    methods:{
        toRegister(){
            if(!/^1\d{10}$/.test(this.phone)){
                 this.toast('手机号码格式不正确！');
                 return;
            }else if(!/^\d{6}$/.test(this.code)){
                this.toast('验证码格式不正确');
                return;
            }else if(!/^[\x00-\xff]{6,15}$/.test(this.password)){
                this.toast('密码格式必须为6~15位数字，英文字符和半角标点符号！');
                return;
            }
            let  params =  Qs.stringify({
                 phone:  this.phone,
                 code: this.code,
                 password: Md5(this.password)
             });
            this.$axios.post('/app/register',params).then((res) =>{
                    // console.log(res)
                
                   if(res.status === 200){
                       if(res.data.code > 0){
                            this.LOGIN({
                                token: res.data.data.Authorization,
                                curCount: this.phone
                            });
                            if(res.data.data.operating === "REGISTER_SUCCESS"){
                                this.toast('注册成功！');
                                setTimeout(() => {
                                    this.$router.replace({path: '/home'});
                                },500)

                            }else{
                               this.$alert(res.data.message).then((msg)=>{
                                }).catch((err) =>{
                                    console.log(err)
                                })
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

            //如果通过。发送ajax请求，成功后，跳转至记录页
          

            
           
        },
        // toResetPassword(){
        //     this.$router.push({path: '/login/resetPassword'})
        // },
        //发送手机验证码
        getCode(){
            this.isError = false;
            this.$axios.get('/app/sendSmsPwd',{
                params:{
                    phone:  this.phone,
                    identity: 'register'
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                            this.toast('发送成功！');
                        //    alert(`验证码是：${res.data.message}`)
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                                this.isError = true;
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
        ...mapActions(['LOGIN'])

    },
    components:{
        Toast,
        loginValidate,
        GetPhoneCode
    }
}
</script>

<style lang="scss" scoped>
    .register{
        background: #f5f5f5;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        .tips{
            height: px2rem(73);
            line-height: px2rem(73);
            text-align: center;
            @include font-dpr(24px);
            .iconfont{
                @include font-dpr(24px);
                color: #f57f3f; 
            }
            // img{
            //     vertical-align: middle;
            //     padding-right: px2rem(5);
            // }
        }
        input:-webkit-autofill{
            background: #fff;
        }
        .input-group{
            background: #fff;
            box-sizing: border-box;
            display: flex;
            height: px2rem(96);
            margin-bottom:  px2rem(20);
            overflow: hidden;
            padding:px2rem(18) px2rem(30);
            position: relative;
            .input_label{
                width: px2rem(126);
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color:#666;
                flex-shrink: 0;
                @include font-dpr(28px);
            }
            .input{
                flex: 1;
                @include font-dpr(32px);
            }
            .feedback-container{
                position: absolute;
                right: px2rem(28);
                top: 50%;
                transform: translate3d(0,-50%,0);
            }
           .verificationCode-container{
                position: absolute;
                right: px2rem(30);
                top: 50%;
                transform: translate3d(0,-50%,0);
                .feedback-container{
                    right: 110%;
                }
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

