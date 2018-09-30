<template>
    <div class="chooseTime">
        <span class="icon iconfont icon-shachu-xue" @click="close"></span>
        <div class="content">
            <div class="title-container">
                <h2 class="title">持有时限选择</h2>
                <p class="detail">选择适合自己的周期</p>
            </div>
            <div class="all-time-container">
                <p class="title"> 全部时限</p>
                <p v-cloak v-for="(item,index) in timeLists" :key="index" class="time-item border-1px" :class="{active: curItem === item}" @click="choose(item)">{{item}}日</p>
            </div>
        </div>
      
    </div>
</template>
<script>
export default {
    props:{
        curTime:{
            type: Number
        }
    },
    data(){
        return {
            timeLists: [30,60,90,180,270,360],
            curIndex: 0,
            finalTime: 0,
            curItem: ''

        }
    },
     created(){
        this.finalTime = this.timeLists[0];
        this.curItem = this.curTime;
    },
    methods:{
        close(){
            this.$emit('close',this.finalTime);
        },
        choose(item){
            this.curItem = item;
            this.finalTime = item;
            this.$emit('close',this.finalTime);
        } 
    }
}
</script>

<style lang="scss" scoped>
    .chooseTime{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 100;
        .icon-shachu-xue{
            position: absolute;
            left: px2rem(36);
            top: px2rem(29);
            // padding: px2rem(10);
            @include font-dpr(30px); 
        }
        .content{
            position: absolute;
            top: px2rem(65);
            bottom: 0;
            left: 0;
            right: 0;
            .title-container{
                height: px2rem(170);
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: px2rem(36);
                .title{
                    @include font-dpr(36px);
                    margin-bottom: px2rem(16);
                }
                .detail{
                    @include font-dpr(22px);
                    color: #6c7179;
                }
            }
            .all-time-container{
                .title{
                    height: px2rem(48);
                    line-height: px2rem(48);
                    padding-left: px2rem(36);
                    background-color: #ededed;
                     @include font-dpr(22px);
                }
                .time-item{
                    height: px2rem(96);
                    line-height: px2rem(96);
                    text-align: center;
                     @include font-dpr(32px);
                    color: #6c7179;
                    @include border-1px(#e4e4e4);
                    &.active{
                        background-color: #f5f5f5;
                        color: #42bd55;
                    }
                }
            }
        }
    }
    
</style>

