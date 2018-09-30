<template>
    <div class="transaction-reward">
        <div class="title">
            <p :class="{successful: tradeSucess}">{{rTitle}}</p>
            <p class="reward">{{lottery.rewardDesc}}</p>
        </div>
        <div class="card">
            <div class="card-left">
                <p><span class="ratio">10.00</span>%</p>
                <p>提高回报率</p>
            </div>
            <div class="card-right">
                <p class="cardType">{{lottery.lotteryType}}</p>
                <p class="useCard">任意一次投资可用</p>
                <p class="validityTime">有效期：{{ValidityTime}}</p>
            </div>
        </div>
        <div class="immediateExperience">立即体验</div>
    </div>
</template>
<script>
export default {
    props:{
        //奖券标题
        rTitle: {
            type: String,
            required: true
        },
        //奖券类型
        rewardType:{
            type: Number,
            required: true
        },
        //奖券有效期
        ValidityTime: {
            type: String,
            required: true
        }
        
    },
    data(){
        return {
            lottery: {},
            tradeSucess: false
        }
    },
    created(){
        if(this.rewardType === 0){
            this.lottery = {
                rewardDesc: "给您发放交易奖励券",
                lotteryType: "交易奖励券",
            }
            this.tradeSucess = false;
        }else{
           this.lottery = {
                rewardDesc: "恭喜您获得推荐人奖励券",
                lotteryType: "推荐人奖励券",
            } 
            this.tradeSucess = true;
        }
    },
    mounted(){
        
    },
}
</script>

<style lang="scss" scoped>
    .transaction-reward{
        background-color: transparent;
        width: px2rem(520);
        height: px2rem(640);
        background: url(./img/alert_bg@2x.png) no-repeat;
        background-size: cover;
        background-position: center; 
        overflow: hidden;
        position: relative;
        .title{
            margin-top: px2rem(111);
            @include font-dpr(32px);
            color: #fff;
            text-align: center;
            .successful{
                @include font-dpr(48px);
            }
        
        }
        .card{
            width: px2rem(417);
            height:px2rem(152);
            position: absolute;
            bottom:  px2rem(146);
            left: px2rem(53);
            display: flex;
            .card-left{
                width: px2rem(190);
                background: url(./img/card_left@2x.png) no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: #fff;
                @include font-dpr(22px);
                .ratio{
                     @include font-dpr(48px);
                }
            }
            .card-right{
                flex: 1;
                background-color: #f5f5f5;
                padding: 0 px2rem(21);
                @include font-dpr(18px);
                .cardType{
                    @include font-dpr(24px);
                    margin-top: px2rem(27);
                    line-height: 1;
                }
                .useCard{
                    margin-top: px2rem(15);
                    padding-bottom: px2rem(20);
                    color: #666;
                    border-bottom: 1px dashed #999;  
                     line-height: 1;
                }
                .validityTime{
                    // @include font-dpr(18px);
                    margin-top: px2rem(18);
                    color: #999;
                     line-height: 1;
                }
            }
        }
        .immediateExperience{
            height: px2rem(96);
            position: absolute;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #5e93fc;
             @include font-dpr(32px);
        }
    }
</style>

