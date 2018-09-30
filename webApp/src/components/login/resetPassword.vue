<template>
    <div class="reset-password">
        <div class="input-group">
            <label for="resetUserPhone" class="input_label">手机号</label>
            <input type="text" id="resetUserPhone" class="input" placeholder="请输入11位手机号" v-model="phone">
            <!-- <div class="feedback-container">
                <login-validate :showType="phoneFeedBackType" :errorMsg="phoneErrorMsg"></login-validate>
            </div> -->
        </div>
        <div class="input-group">
            <label for="resetVerificationCode" class="input_label">验证码</label>
            <input type="text" id="resetVerificationCode" class="input" placeholder="请输入短信验证码" v-model="code">
            <div class="verificationCode-container">
                <getPhoneCode  @getCode="getCode" @toast="toast" :isOk="phoneFeedBackType === 1" :isError="isError"></getPhoneCode>
                <!-- <div class="feedback-container code-feedback">
                    <login-validate :showType="codeFeedBackType" :errorMsg="codeErrorMsg"></login-validate>
                </div>    -->
            </div>
           
        </div>
         <div class="input-group">
            <label for="resetPassword" class="input_label">重设密码</label>
            <input type="password" id="resetPassword" class="input" placeholder="请输入6位以上的密码" v-model="password">
            <!-- <div class="feedback-container ">
                <login-validate :showType="passFeedBackType" :errorMsg="passErrorMsg"></login-validate>
            </div> -->
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" :class="{disable: !isReady}" @click="toReset">确认修改</div>
        </div>
        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div>
    </div>
</template>
<script>
import LoginValidate from 'src/base/validateFeedback/loginValidate';
import {RegFeedBackType} from 'src/assets/js/config';
import {mapGetters} from 'vuex';
import GetPhoneCode from 'src/base/getPhoneCode/getPhoneCode';
import Toast from 'src/base/toast/toast_login';
import Qs from 'qs';
import Md5 from 'md5';

export default {
     beforeRouteEnter: (to, from, next) => {
        document.title = "忘记密码";
        next();
    },
    beforeRouteLeave:  (to, from, next) => {
        document.title = "登录";
        next();
    },
    data(){
        return {
            phone: '',
            code: '',
            password: '',

            //获取验证码的次数
            getCodeTimes: 0,
            //
            countDown: 0,
            descText:'',
            showToast: false,
            isError: false
        }
    },
    methods:{
        closeToast(){
            //关闭toast
            this.showToast = false;
        },
        toast(descText){
            this.descText = descText;
            this.showToast = true;
        },
        toReset(){
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
            this.$axios.post('/app/resetLoginPwd',params).then((res) =>{
                // console.log(res)
                   if(res.status === 200){
                       if(res.data.code > 0){
                           this.toast('重置成功！');
                           setTimeout(()=>{
                               this.$router.replace({path:'/login'})
                            //    this.$router.replace({path: this.prevRouter});
                           },500)
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
        getCode(){
            this.isError = false;
            //在这里发送ajax请求，生成验证码
              this.$axios.get('/app/sendSmsPwd',{
                params:{
                    phone:  this.phone,
                    identity: 'resetLoginPwd'
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                           this.toast('发送成功');
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
            let reg  = /^[\x00-\xff]{6,15}$/;
            return reg.test(this.password) ? RegFeedBackType.showSuccess : RegFeedBackType.showError;
        },
        isReady: function(){
            return this.phoneFeedBackType === RegFeedBackType.showSuccess && this.codeFeedBackType === RegFeedBackType.showSuccess && this.passFeedBackType === RegFeedBackType.showSuccess;
        },
        ...mapGetters(['prevRouter'])
    },
    components:{
        LoginValidate,
        GetPhoneCode,
        Toast
    }
}
</script>

<style lang="scss" scoped>
    .reset-password{
        background: #f5f5f5;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
        padding-top:  px2rem(20);
        .input-group{
            background: #fff;
            height: px2rem(96);
            box-sizing: border-box;
            margin-bottom:  px2rem(20);
            display: flex;
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
                background-color: #5e93fc;
                text-align: center;
                line-height:  px2rem(96);
                border-radius: px2rem(48);
                @include font-dpr(36px);
                &.disable{
                   background-color: #d6d6d6; 
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
            top: 50%;
            transform: translate3d(-50%,-50%,0);
        }
    }
</style>

