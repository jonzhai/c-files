<template>
    <div class="reset-password">
        <div class="input-group">
            <label for="oldPass" class="input_label">输入旧密码</label>
            <input type="password" id="oldPass" class="input" placeholder="请输入旧密码" v-model="oldpassword">
        </div>
        <div class="input-group">
            <label for="newPass" class="input_label">输入新密码</label>
            <input type="password" id="newPass" class="input" placeholder="请输入6位纯数字密码" v-model="password">
        </div>
         <div class="input-group">
            <label for="reNewPass" class="input_label">确认新密码</label>
            <input type="password" id="reNewPass" class="input" placeholder="请再次输入密码" v-model="repassword">
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" @click="resetPass" :class="{disable: !isReady}">确认</div>
        </div>
        <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import Toast from 'src/base/toast/toast_login';
import Qs from 'qs';
import Md5 from 'md5';
import {ToastMixin} from 'src/assets/js/mixin'
export default {
    mixins:[ToastMixin],
    beforeRouteEnter:(to, from, next) => {
        document.title = "交易密码修改";
        next();
    },
    data(){
        return {
            //旧密码
            oldpassword: '',
            //新密码
            password: '',
            //重复新密码
           repassword: ''
        }
    },
    methods:{
        resetPass(){
            let reg = /^\d{6}$/;
            if(!reg.test(this.password) || !reg.test(this.oldpassword) ){
                this.toast('密码只能是长度为6的数字！');
                return;
            }else if(this.password !== this.repassword ){
                this.toast('两次密码不一致！')
                return;
            }
            let  params =  Qs.stringify({
                oldPassword: Md5(this.oldpassword),
                newPassword: Md5(this.password)
             });
            this.$axios.post('/app/updateTransactionPwd',params).then((res) =>{
                console.log(res)
                   if(res.status === 200){
                       if(res.data.code > 0){
                           this.toast('重置成功！');
                           setTimeout(()=>{
                               this.$router.replace({path:'/myInfoCenter'})
                           },500)
                       }else{
                            this.toast(res.data.message);
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })
        }
    },
    computed:{
        isReady(){
            let reg = /^\d{6}$/g;
            return reg.test(this.password) &&  this.password === this.repassword;
        }
    },
    components:{
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
        .input-group{
            background: #fff;
            height: px2rem(96);
            box-sizing: border-box;
            margin-top:  px2rem(20);
            display: flex;
            padding:0 px2rem(30);
            position: relative;
            .input_label{
                width: 5em;
                white-space: nowrap;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color:#666;
                flex-shrink: 0;
                @include font-dpr(28px);
                margin-right: px2rem(40);
            }
            .input{
                flex: 1;
                color: #a3abb8;
                @include font-dpr(28px);
            }

        }
        .confirm-container{
            padding: 0 px2rem(49);
            height: px2rem(96);
            overflow: hidden;
            margin-top: px2rem(60);
            
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

