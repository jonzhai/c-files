<template>
    <div class="my-fortune">
        <div class="fortune-info">
            <div class="totalFortune">
                <p class="title">总财富</p>
                <p class="total hide-money" v-show="!showMoney">****<img src="./img/hideMoney.png"  class="eye" alt="" @click="showMoney = !showMoney"></p>
                <p class="total show-money" v-show="showMoney">123456<img src="./img/showMoney.png"  class="eye" alt="" @click="showMoney = !showMoney"></p>
            </div>
           <div class="detailInfo">
               <div class="preset-profit">
                   <p class="title">238.99</p>
                   <p class="desc">预计收益</p>
               </div>
               <div class="user-balance">
                    <p class="title">238.99</p>
                    <p class="desc">账户余额</p>
               </div>
               <div class="sum-profit">
                   <p class="title">238.99</p>
                   <p class="desc">累计收益</p>
               </div>
           </div>
        </div>
         <div class="list-vontainer">
             <router-link tag="div" class="commonRow myInverse" :to="{path: '/myInvesment'}">
                <span>我的投资</span>
                <p class="desc">
                    2
                    <span class="icon iconfont icon-right1"></span>
                </p>
             </router-link>
             <router-link tag="div" class="commonRow" :to="{path: '/home'}">
                <span>体验金</span>
                <span class="icon iconfont icon-right1"></span>
             </router-link>
            <router-link tag="div" class=" commonRow" :to="{path: '/myFortune/recommendReward'}">
                <span>推荐好友</span>
                <span class="icon iconfont icon-right1"></span>
            </router-link>
            <!-- <router-link tag="div" class="commonRow" :to="{path: '/myRewards/ableUseRewards'}">
                <span>我的奖券</span>
                <span class="icon iconfont icon-right1"></span>
             </router-link> -->
         
         </div>
         <div class="foot">
            <router-link tag="p" class="recharge" :to="{path: '/recharge'}">
                充值
            </router-link>
             <router-link tag="p" class="withdraw-cash" :to="{path: '/withdrawCash'}">
                提现
            </router-link>
         </div>
        <router-view></router-view>

    </div>
</template>
<script>
export default {
    beforeRouteEnter:(to, from, next) => {
        document.title = "我的财富";
        next();
    },
    data(){
        return {
            showMoney: true
        }
    }
}
</script>
<style lang="scss" scoped>
    .my-fortune{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f5f5f5;
        .fortune-info{
            background-color: #fff;
            color: #999999;
            @include font-dpr(24px);
            margin-bottom:  px2rem(20);
            .totalFortune{
                height: px2rem(230);
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: center;
                overflow: hidden;
                .total{
                    color: #333333;
                    @include font-dpr(60px);
                    font-weight: 700;
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    margin-bottom:  px2rem(52);
                    &.hide-money{
                        margin-top:  px2rem(10);
                        .eye{
                            position: absolute;
                            height: px2rem(20);
                            width: px2rem(40);
                            right: px2rem(-60);
                            top: 50%;
                            transform: translate3d(0,-100%,0);
                        }
                    }
                    &.show-money{
                        margin-top:  px2rem(12);
                        .eye{
                            height: px2rem(28);
                            margin-left: px2rem(20);
                        }
                    }
                }
            }
            .detailInfo{
                height: px2rem(110);
                display: flex;
                >div{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                }
                .preset-profit:after,.user-balance:after{
                    content: '';
                    display: block;
                    width: 1px;
                    height: px2rem(40);
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate3d(0,-50%,0);
                    background-color: #e4e4e4;
                }
                .title{
                    color: #f57f3f;
                    @include font-dpr(32px);
                    margin-bottom: px2rem(16); 
                    
                }
            }
        }
        .list-vontainer{
            background-color: #fff;
            color: #999999;
            @include font-dpr(28px);
            .commonRow{
                height: px2rem(88);
                display: flex;
                justify-content: space-between;
                align-items: center;
                color:#3c3d41;
                padding: 0 px2rem(30);
                .iconfont{
                    color: #999999;
                     @include font-dpr(28px);
                }
            }
            .myInverse{
               .iconfont{
                   margin-left: px2rem(20); 
               } 
               .desc{
                   color: #999999;
               }
            }

        }
        .foot{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: px2rem(88);
            display: flex;
            >p{
                flex: 1;
                line-height: px2rem(88);
                text-align: center;
                color: #fff;
                @include font-dpr(32px);
            }
            .recharge{
                background-color: #5e93fc;
            }
            .withdraw-cash{
                background-color: #f57f3f;
            }
        }
    }
</style>


