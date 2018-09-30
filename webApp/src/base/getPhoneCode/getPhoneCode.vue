<template>
    <div class="phone-code">
        <span class="verificationCodeBtn" @click="getValidateCode" :class="{disable: !isAble}">{{getCodeTimes === 0 ? '获取验证码': countDown === 0 ? '重新获取':`${countDown}s 后重新获取` }}</span>
    </div>
</template>
<script>
export default {
    props:{
        isOk: false,
        isError: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
             //获取验证码的次数
            getCodeTimes: 0,
            //计时
            countDown: 0,
            //是否可点击
            isAble: false


            
        }
    },
    created(){
        this.codeId = this.getCodeId();
    },
    watch:{
        isOk(newVal){
            this.isAble =  newVal && this.countDown === 0;
        },
        countDown(newVal){
           this.isAble =  newVal === 0 && this.isOk; 
        },
        isError(newVal){
            //如果获取code出错。重置
            if(newVal){
                this.countDown = 0;
                this.isAble = true;
                clearInterval(this.timer)
            }
        }
    },
    methods:{
         getValidateCode(){
            //定义一个唯一的code key，防止locolstorage存放多个timeLimit时，出现错乱
            const CODE_KEY =  `timeLimit${this.codeId}`; 
            //如果当前正在倒计时，直接返回
            // if(this.countDown){return;}
            if(!this.isAble){return;}

            let timeLimit = parseInt(localStorage.getItem(CODE_KEY)),
                now = new Date().getTime();
            //判断当前时间是否在限制期内，如果不是，则将getCodeTimes置零，客户获得10次点击机会,如果在限制期内，则显示toast
            if(timeLimit && now < timeLimit){
                this.$emit('toast', `已超出发送次数，请${Math.floor((timeLimit -now)/(1000*60))}分钟后再发送`)
                return;
            }else if(timeLimit && now >= timeLimit){
                this.getCodeTimes = 0;
                localStorage.setItem(CODE_KEY,0)
            }
            //如果当前点击次数超过10次，则记录限制时间为当前时间向后推算60min
            if(this.getCodeTimes >=10){
                localStorage.setItem(CODE_KEY,(now + 60*60*1000).toString());
                this.$emit('toast', `已超出发送次数，请60分钟后再发送`)
            }else{
                this.$emit('getCode')
                this.countDown = 60;
                this.timer = setInterval(()=>{
                    this.countDown--;
                    if(this.countDown <=0){
                        clearInterval(this.timer)
                    }
                },1000)
                this.getCodeTimes++;
            }
        },
        closeToast(){
            //关闭toast
            this.showToast = false;
        },
        getCodeId(){
            let len = localStorage.length,
                reg = /^codeId_(\d+)$/g,
                arr = [];
            for (let i = 0; i < len; i++){
                let temp = reg.exec(localStorage.key(i));
                if(temp){
                   arr.push(parseInt(temp[1])); 
                }
            }
            if(arr.length > 0 ){
                return `codeId_${Math.max.apply(null,arr)+1}`;
            }else{
                return `codeId_0`;
            }

        }
    }
}
</script>
<style lang="scss" scoped>

    .verificationCodeBtn{
        padding: px2rem(10) px2rem(20);
        border-radius: px2rem(30);
        background-color:#5e93fc;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        @include font-dpr(24px);
        &.disable{
            background-color: #d6d6d6; 
        }
    }
</style>

   
