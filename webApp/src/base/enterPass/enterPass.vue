<template>
     <div class="enterPass-mock">
            <div class="enterPass-container" >
                <label class="head" for="passIpt">
                    <p class="title">{{desc}}</p>
                    <input type="text" id="passIpt" autofocus v-model="passWord" maxlength="6" style="opacity:0" ref="passIpt">
                    <ul class="ipt-group" ref="iptGroup">
                        <li class="ipt" :class="{active: passWord.length >= 1,focus: passWord.length === 0}"></li>
                        <li class="ipt" :class="{active: passWord.length >= 2,focus: passWord.length === 1}"></li>
                        <li class="ipt" :class="{active: passWord.length >= 3,focus: passWord.length === 2}"></li>
                        <li class="ipt" :class="{active: passWord.length >= 4,focus: passWord.length === 3}"></li>
                        <li class="ipt" :class="{active: passWord.length >= 5,focus: passWord.length === 4}"></li>
                        <li class="ipt" :class="{active: passWord.length >= 6,focus: passWord.length === 5}"></li>
                    </ul>
                </label>
                <div class="foot" @click="cancel">取消</div>
            </div>
        </div>
</template>
<script>
export default {
    props:{
        desc:{
            type: String,
            default: '请输入交易密码'
        }
    },
   data(){
        return {
            passWord: ''
        }
   },
   mounted() {
       setTimeout(()=>{
           this.$refs.passIpt.focus();
       },20)
   },
   methods:{
       cancel(){
           this.$emit('newPass')
       }
   },
    watch:{
        passWord(newVal){
            let passWord = newVal.replace(/[^\d*]/g,'');
            if(passWord.length === 6){
                this.$emit('newPass' ,passWord)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.enterPass-mock{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: rgba(0,0,0,0.5);
    .enterPass-container{
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
        width: px2rem(500);
        height: px2rem(284);
        border-radius:  px2rem(10);
        background-color: #fff;
        display: flex;
        flex-direction: column;
        color: #333333;
            @include font-dpr(32px);
        .head{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            input{
                border: none;
                outline: none;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
            }
            .title{
                text-align: center;
                margin-bottom: px2rem(28);
            }
            .ipt-group{
                display: flex;
                justify-content: center;
                .ipt{
                    height: px2rem(56); 
                    width: px2rem(56); 
                    margin-right: px2rem(16); 
                    border: 2px solid #e1e1e1;
                    position: relative;
                    &.active::after{
                        content: "";
                        display: block;
                        height: px2rem(10);
                        width: px2rem(10);
                        border-radius:5px;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%,-50%);
                        background-color: #000; 
                    }
                    &.focus::after{
                        content: "";
                        display: block;
                        height: 80%;
                        width: 1px;
                        position: absolute;
                        left: 10%;
                        top: 50%;
                        transform: translate(0,-50%);
                        background-color: #000;
                        animation: spark 1s infinite;
                    }
                    &:last-child{
                        margin-right: 0;
                    }
                }
            }
        }
        .foot{
            height: px2rem(98);
            line-height: px2rem(98);
            text-align: center;
            border-top: 1px solid #e4e4e4;   
        } 
    }
}
@keyframes spark {
    0%    { opacity: 0;}
    50%   { opacity: 1;}
    100%  { opacity: 0;}
}
</style>

