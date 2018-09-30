<template>
    <div class="card">
        <div class="card-left" :class="{disable: cardType !== 0}">
            <p><span class="ratio">{{ratio.toFixed(2)}}</span>%</p>
            <p>提高回报率</p>
        </div>
        <div class="card-right">
            <div class="head">
                <p class="cardType">{{title}}</p>
                <p class="useCard">
                    <span class="desc">{{desc}}</span>
                    <span class="use" v-if="cardType === 0" @click="toUse">立即使用</span>
                </p>
                <img class="used-bandge" src="./img/used@2x.png" alt="" v-if="cardType === 1">
            </div>
            <p class="validityTime">使用有效期：{{ValidityTime | toDate3}}</p>
        </div>
    </div>
</template>
<script>
const cardTypes = {
    fresh: 0,
    recommend: 1,
    transition: 2
}
export default {
    props:{
        ratio:{
            type: Number,
            required: true
        },
        cardType:{
            type: Number,
            default: 0
        },
        ValidityTime:{
            type: Number,
            required: true
        },
        rewardId:{
            type: Number,
            default: 1
        }
    },
    data(){
        return{
            title: '',
            desc: ''
        }
    },

    created() {
        if(this.cardType === cardTypes.fresh){
            this.title = "新手体验券";
            this.desc = "首次投资使用";
        }else if(this.cardType === cardTypes.recommend){
             this.title = "推荐奖励券";
            this.desc = "任意一次投资可用";
        }else if(this.cardType === cardTypes.transition){
             this.title = "交易奖励券";
             this.desc = "任意一次投资可用"
        }
    },
    methods:{
        toUse(){
            this.$emit('use', this.rewardId)
        }
    }
}
</script>

<style lang="scss" scoped>
 .card{
    width: 100%;
    display: flex;
    height:px2rem(164);
    .card-left{
        width: px2rem(240);
        background: url(./img/reward_blue_bg.png) ;
        background-repeat:  no-repeat;
        background-size: contain;
        // background-color: #7da8fd;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;
        &.disable{
            background: url(./img/grey_bg.png) ;
            background-repeat:  no-repeat;
            background-size: contain;
        }
        @include font-dpr(22px);
        .ratio{
            @include font-dpr(48px);
            font-weight: 700;
        }
    }
    .card-right{
        flex: 1;
        background-color: #fff;
        padding: 0 px2rem(26);
        display: flex;
        flex-direction: column;
        position: relative;
        @include font-dpr(22px);
        .head{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .cardType{
                @include font-dpr(28px);
                font-weight: 700;
                color: #333333;
            }
            .useCard{
                margin-top: px2rem(8);
                height: px2rem(36);
                display: flex;
                justify-content: space-between;
                align-items: center;
                .desc{
                    color: #666666;
                }
                .use{
                    color: #5e93fc;
                    width: px2rem(130);
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #5e93fc;
                    border-radius:  px2rem(18);
                }
            }
            .used-bandge{
                position: absolute;
                right: px2rem(36);
                top: px2rem(20);
                width: px2rem(110);
                height: px2rem(75);
            }
        }
       
        .validityTime{
            height: px2rem(52);
            line-height: px2rem(52);
            box-sizing: border-box;
            border-top: 1px dashed #cccccc; 
            color: #999;
        }
    }
}
</style>

