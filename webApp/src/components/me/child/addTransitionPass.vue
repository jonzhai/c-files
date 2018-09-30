<template>
    <div class="add-password">
        <div class="input-group">
            <label for="newPass" class="input_label">输入新密码</label>
            <input type="password" id="newPass" class="input" placeholder="请输入6位纯数字密码" v-model="password">
        </div>
         <div class="input-group">
            <label for="rePass" class="input_label">确认新密码</label>
            <input type="password" id="rePass" class="input" placeholder="请再次输入密码" v-model="repassword">
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
import {mapGetters,mapMutations} from 'vuex';
import Toast from 'src/base/toast/toast_login';
import {ToastMixin} from 'src/assets/js/mixin';

import Qs from 'qs';
import Md5 from 'md5';
export default {
     mixins:[ToastMixin],
     beforeRouteEnter:(to, from, next) => {
        document.title = "交易密码设置";
        next();
    },
    data(){
        return {
            // descText: '',
            // showToast: false,
            password: '',
           repassword: ''
        }
    },
    methods:{
    //     toast(text){
    //         this.descText = text;
    //         this.showToast = true;
    //     },
    //    closeToast(){
    //        this.showToast = false;
    //    },
        resetPass(){
            let reg = /^\d{6}$/;
            if(!reg.test(this.password)){
                this.toast('密码只能是长度为6的数字！');
                return;
            }else if(this.password !== this.repassword ){
                this.toast('两次密码不一致！');
                return;
            }
            let  params =  Qs.stringify({
                 password: Md5(this.password)
             });
            this.$axios.post('/app/bindTransactionPwd',params).then((res) =>{
                // console.log(res)
                   if(res.status === 200){
                       if(res.data.code > 0){
                           this.toast('添加成功！');
                           this.setTpass(true);
                           setTimeout(()=>{
                               if(this.curOrder){
                                //    console.log(this.curOrder)
                                   this.$router.replace({path:this.curOrder})
                               }else{
                                   this.$router.replace({path:'/myInfoCenter'})
                               }
                           },500)
                       }else{
                            this.toast(res.data.message);
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })
        },
        ...mapMutations({
            setTpass: 'SET_TRANSITIONPASS'
        }),
      
    },
    computed:{
        isReady(){
            let reg = /^\d{6}$/g;
            return reg.test(this.password) &&  this.password === this.repassword;
        },
        ...mapGetters(['curOrder'])
    },
    components:{
        Toast
    }

}

</script>

<style lang="scss" scoped>
    .add-password{
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

