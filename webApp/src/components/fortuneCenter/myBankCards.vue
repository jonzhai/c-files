<template>
    <scroll 
        class="bank-cards"
        ref="scroll"
        @pullingDown="pullingDown"
        @pullingUp="pullingUp"
    >
        <ul class="cards">
            <li class="card" v-for="(item,index) in cardsList" :key="index">
                <div class="title" :style="{backgroundColor: item.color}">
                    <span class="bank-name">{{item.name}}</span>
                    <span class="remove-card" @click="unbindCard(item.cardId)">解绑银行卡</span>
                </div>
                <div class="card-num">
                    <span>****</span>   
                    <span>****</span>   
                    <span>****</span>   
                    <span>{{item.cardNo | getLast(4)}}</span>   
                </div> 
            </li>
        </ul>
        <p class="nocard" v-if="cardsList.length === 0">当前没有银行卡，请点击添加</p>
        <router-link tag="div" class="add-card-wrapper" :to="{path:'/addBankCard'}">
            <img src="./img/addCard.png" alt="">
            <span class="add-card">添加银行卡</span>
        </router-link>
        <!-- <p class="underline" v-show="isLastPage"> 已经到底了...</p> -->
         <div class="loading-container" v-show="showLoading">
            <loading desc="请等待..."></loading>
        </div>
        <transition name="fade">
            <EnterPass v-if="showPass" @newPass="getNewPass" desc="请输入短信验证码"></EnterPass>
        </transition>
   </scroll>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';
import EnterPass from 'src/base/enterPass/enterPass'; 
export default {
     data(){
        return {
            showLoading:false,
            cardsList: [],
            showPass: false,
            ticket: ''
        }
    },
    created() {
        this._getBankCards();
    },
    methods:{
        pullingDown(e){
            // this.showLoading = false;
            this.$refs.scroll.finishPullDown();
        },
   
        pullingUp(){
            // this.showLoading = true;
            // if(this.isLastPage){
            //      this.showLoading = false;
            //     return;
            // }
            // this._getNews(++this.pageNumber)
            this.$refs.scroll.finishPullUp();
        },
        unbindCard(cardId){
            this.showLoading =true;
             this.$axios.get('/app/unbindingBankCard',{
                params:{
                    cardId : cardId
                }
             }).then((res) => {
                if(res.status === 200){
                    this.showLoading = false;
                    if(res.data.code > 0){
                         this.ticket = res.data.data.ticket;
                         this.showPass = true;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                        }).catch(()=>{})
                    }
                    
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        getNewPass(pass){
            if(!pass){
                this.showPass = false;
                return;
            }
            this.$axios.get('/app/unbindingBankCardAdvance',{
                params:{
                    ticket: this.ticket,
                    code: pass
                }
             }).then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.showPass = false;
                        this.$toast('解绑成功！');
                        this._getBankCards();

                    }else{
                        this.$alert(res.data.message).then(()=>{

                        }).catch(()=>{})
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
         _getBankCards(){
            this.showLoading = true;
            this.$axios.get('/app/getMyBankCard').then((res) => {
                if(res.status === 200){
                    this.showLoading = false;
                    if(res.data.code > 0){
                         this.cardsList = res.data.data.list;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                            this.$router.push({path: '/realNameCertification'})
                        })
                    }else{
                        this.$toast(res.data.message)
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        }
    },
     components:{
        Scroll,
        Loading,
        EnterPass
    },
    filters:{
        getLast(val,n){
            // let len = val.length;
            return val.substr(-1,n);
        }
    }
}
</script>

<style lang="scss" scoped>
.bank-cards{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f5f5f5;
    padding: px2rem(20) px2rem(30) 0;
    .cards{
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
                // background-color: #5e93fc;
                color: #fff;
                .bank-name{
                    @include font-dpr(28px);
                }
                .remove-card{
                    @include font-dpr(24px);
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
        }
    }
    .nocard{
        text-align: center;
        padding: px2rem(20) auto;
        margin-bottom: px2rem(50);
    }
    .add-card-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
        height: px2rem(88);
        background-color: #fff;
        border-radius:  px2rem(10);
        img{
            width: px2rem(47);
            height: px2rem(30);
        }
        .add-card{
            @include font-dpr(28px);
            color: #666;
            margin-left:  px2rem(16);
        }
    }
}
</style>

