<template>
    <div class="real-name-certification">
         <div class="input-group">
            <label for="cardName" class="input_label">姓名</label>
            <input type="text" id="cardName" class="input" placeholder="请输入您的真实姓名" v-model="realName" autocomplete="off">
        </div>
        <div class="input-group">
            <label for="cardId" class="input_label">身份证</label>
            <input type="text" id="cardId" class="input" placeholder="请输入您的身份证号" v-model="idCard" autocomplete="off">
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" :class="{active: isReady}" @click="toCertification">确认</div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import Qs from 'qs';
import Md5 from 'md5';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "实名认证";
        next();
    },
    data(){
        return {
            realName: '',
            idCard: ''
        }
    },
     computed:{
        isReady: function(){
            return /^.{2,}$/.test(this.realName.trim()) && /^\d{17}[\dx]$/i.test(this.idCard.trim());
        },
        ...mapGetters(['prevRouter'])
    },
    methods:{
        toCertification(){
            if(!/^.{2,20}$/.test(this.realName.trim()) ){
                 this.$toast('姓名格式不正确！');
                 return;
            }else if(!/^\d{17}[\dx]$/i.test(this.idCard.trim())){
                this.$toast('身份证格式不正确！');
                return;
            }
            let  params =  Qs.stringify({
                 realName:  this.realName,
                 idCard: this.idCard
             });
            this.$axios.post('/app/authentication',params).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                            this.$toast('认证成功！');
                            setTimeout(() => {
                                this.$router.back();
                            },500)
                       }else{
                            this.$toast(res.data.message);
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
    }
}
</script>

<style lang="scss" scoped>
    .real-name-certification{
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

