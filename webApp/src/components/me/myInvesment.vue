<template>
    <div class="my-invesment">
        <div class="head">
            <div class="left">
                <p class="title">投资金额</p>
                <p class="money">{{sumInversPrice}}</p>
            </div>
            <div class="right">
                <p class="title">预计总收益</p>
                <p class="money">{{sumPredictPrice}}</p>
            </div>
        </div> 
        <scroll 
            class="list-container"
            ref="scroll"
            @pullingDown="pullingDown"
            @pullingUp="pullingUp"
            :data= "orderLists"
        >
            <ul class="lists">
                <li 
                    class="item"
                    v-for="(item,index) in orderLists" 
                    :key="index"
                    @click="toDetail(item.id,item.productId)"
                >
                    <div class="top">
                        <p class="title">{{item.title}}</p>
                        <p class="orderNum">订单编号：{{item.serialno}}</p>
                    </div>
                    <div class="bottom">
                        <div class="up">
                            <div>
                                <p class="alreadyEarn">{{item.profitPrice}}</p>
                                <p class="desc">已赚利息（元）</p>
                            </div>
                            <div>
                                <p class="money">{{item.totalPrice}}</p>
                                <p class="desc">在投金额（元）</p>
                            </div>
                            <div>
                                <p class="money">{{item.predictPrice}}</p>
                                <p class="desc">预计收益（元）</p>
                            </div>
                        </div>
                        <div class="down">
                            <p>保底年化：{{item.annualEarn}}</p>
                            <p>到期：{{item.productEndTime | toTime}}</p>
                        </div>
                    </div>
                </li>
                <li class="underline" v-show="isLastPage">已经到底了...</li>
            </ul>
            <p class="underline" v-show="orderLists.length === 0">当前无数据！</p>
            <div class="loading-container" v-show="showLoading">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';

export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "我的投资";
        next();
    },
    data(){
        return {
            //投资订单列表
            orderLists: [],
            //总投资
            sumInversPrice: 0,
            //总预期收入
            sumPredictPrice: 0,
            //是否显示loading
            showLoading: false,
            //当前pageindex
            pageNumber: 0,
            //当前页是否是最后一页
            isLastPage: false
        }
    },
    created(){
        //获取订单第一页
        this._getlist(1);
    },
    mounted(){
        //刷新列表
        this.$refs.scroll.refresh();
    },
    methods:{
        pullingDown(e){
            this.$refs.scroll.finishPullDown();
        },
   
        pullingUp(){
            this.$refs.scroll.finishPullUp();
            // console.log('up')
            // this.showLoading = true;
            //下拉时，判定是否到达最后一页，如果没有到达，继续获取下一页
            if(this.isLastPage){
                //  this.showLoading = false;
                return;
            }
            this._getlist(++this.pageNumber);
        },
        //去详情页
        toDetail(id,pId){
            this.$router.push({path: '/myInvesment/myInvesmentDetail',query:{id: id, pId: pId} })
        },
        //获取订单列表
        _getlist(pageIndex){
              this.showLoading = true;
             this.$axios.get('/app/getUserOrderList',{
                params:{
                    pageNumber: pageIndex,
                    pageSize: 20
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                        // console.log(res)
                        res.data.data.pageOrder.list.forEach((element) => {
                             this.orderLists.push(element);
                        })
                        this.pageNumber = res.data.data.pageOrder.pageNum;
                        this.isLastPage = res.data.data.pageOrder.isLastPage;
                        this.sumInversPrice = res.data.data.sumInversPrice;
                        
                        this.sumPredictPrice = res.data.data.sumPredictPrice;

                         this.showLoading = false;
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            return;
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
    },
    filters:{
        toTime(val){
            let date = new Date(val);
            return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
        }
    }
}
</script>

<style lang="scss" scoped>
.my-invesment{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .head{
        height: px2rem(180);
        background-color: #6ba9fe;
        display: flex;
        color: #fff;
        >div{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .left:after{
            content: '';
            display: block;
            position: absolute;
            width: 1px;
            height: px2rem(48);
            right: 0;
            background-color: #f8f8f8;
            top: 50%;
            transform: translate3d(0,-50%,0);
        }
        .title{
            @include font-dpr(24px);
        }
        .money{
            @include font-dpr(48px);
            font-weight: 700;
        }
    }
    .list-container{
        position: absolute;
        top: px2rem(180);
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f5f5f5;
        overflow: hidden;
        .lists{
            color: #999999;
            @include font-dpr(22px);
           .item{
               padding: 0 px2rem(30);
               margin-top:  px2rem(20);
               background-color: #fff;
               .top{
                   height: px2rem(90);
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   border-bottom: 1px solid #e4e4e4;
                   .title{
                       color: #333333;
                        @include font-dpr(28px);
                        max-width: 8em;
                        // @include ml-ellipsis(1);
                        @include sl-ellipsis();
                   } 
               }
               .bottom{
                  .up{
                    height: px2rem(148);
                    display: flex;
                    align-items: flex-end;
                    overflow: hidden;
                    >div{
                        flex: 1;
                    }
                    .alreadyEarn{
                        color: #f57f3f;
                        font-weight: 700;
                        @include font-dpr(48px); 
                    }
                    .money{
                        color: #333333;
                        @include font-dpr(28px); 
                    }
                    .desc{
                        margin-top: px2rem(6); 
                        margin-bottom: px2rem(44);
                    }
                  } 
                  .down{
                    height: px2rem(62);
                    display: flex;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding-top: px2rem(8);
                  }
               }
           } 
        }
        .underline{
            text-align: center;
            margin-top:  px2rem(20);
        }
        .loading-container{
            position: absolute;
            left: 0;
            right: 0;
            bottom:20%;
        }

    }
}
</style>

