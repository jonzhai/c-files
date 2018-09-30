<template>
    <scroll 
        class="cards-container"
        ref="scroll"
        @pullingDown="pullingDown"
        @pullingUp="pullingUp"
    >
        <ul class="cards">
            <li class="card" v-for="(item,index) in cardsList" :key="index" @click="selectCard(item.cardId)">
                <div class="title" :style="{background: item.color}">
                    <span class="bank-name">{{item.name}}</span>
                    <span class="icon iconfont icon-success"></span>
                </div>
                <div class="card-num">
                    <span>****</span>   
                    <span>****</span>   
                    <span>****</span>   
                    <span>3523</span>   
                </div> 
                <!-- <div class="desc">
                    限额：单笔200000元 单日50万
                </div> -->
            </li>
        </ul>
        <p class="underline" v-show="cardsLists.length === 0">当前无数据！</p>
         <div class="loading-container" v-show="showLoading">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';
import eventBus from 'src/assets/js/eventBus';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "选择银行卡";
        next();
    },
    data(){
        return {
            showLoading:false,
            cardsList: []
        }
    },
    created(){
        // this.type = this.$route.query.type;
    },
    mounted() {
        setTimeout(()=>{
            this.$refs.scroll.refresh();
        },20)
    },
    methods:{
        pullingDown(e){
            this.showLoading = false;
            this.$refs.scroll.finishPullDown();
        },
   
        pullingUp(){
            this.showLoading = true;
            if(this.isLastPage){
                 this.showLoading = false;
                return;
            }
            this.$refs.scroll.finishPullUp();
        },
        selectCard(index){
            eventBus.$emit('getCard',index)
        },
        _getBankCards(){
            this.showLoading = true;
            this.$axios.get('/app/getMyBankCard').then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                         this.cardsList = res.data.data.list;
                         this.showLoading = false;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                            this.$router.push({path: '/myInfoCenter'})
                        })
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        }
    },
    components:{
        Scroll,
        Loading
    }
}
</script>
<style lang="scss" scoped>
    .cards-container{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f5f5f5;
        padding:  px2rem(20) px2rem(30) 0; 
        .cards{
            padding-top:  px2rem(20);
            .card{
                height: px2rem(210);
                display: flex;
                flex-direction: column;
                border-radius:  px2rem(10);
                overflow: hidden;
                margin-bottom: px2rem(20);
                .title{
                    height:px2rem(80);
                    padding: 0 px2rem(20);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // background-color: #7b9fe8;
                    color: #fff;
                    .bank-name{
                        @include font-dpr(28px);
                    }
                    .iconfont{
                        color: #fff;
                        @include font-dpr(40px);
                    }
                }
                .card-num{
                    flex:1;
                    @include font-dpr(48px);
                    color: #333;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    background-color: #fff;
                    
                }
                .desc{
                    height:px2rem(62);
                    line-height: px2rem(62);
                    border-top: 1px solid #e4e4e4;
                    background-color: #fff;
                    padding: 0 px2rem(20);
                    @include font-dpr(24px);
                    color: #999;
                }
            }
        }
        .underline{
            text-align: center;
            margin-top: px2rem(10);
        }
    }
</style>


