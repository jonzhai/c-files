<template>
    <div class="inverment-record">
        <div class="title">
            <span class="title-col">投资人</span>
            <span class="title-col">投资时间</span>
            <span class="title-col">投资金额（元）</span>
        </div>
        <scroll 
            class="record-container"
            ref="scroll"
            @pullingDown="pullingDown"
            @pullingUp="pullingUp"
            :data="recordLists"
        >
            <ul>
                <li class="item" v-for="(item,index) in recordLists" :key="index">
                    <span class="item-col">{{item.userName}}</span>
                    <span class="item-col">{{item.inverstmentTime | toDate2}}</span>
                    <span class="item-col">{{item.inverstmentPrice}}</span>
                </li>
                <li class="underline" v-show="isLastPage">已经到底了...</li>
            </ul>
            <p class="no-data" v-if="recordLists.length === 0">当前无数据！</p>
            <div class="loading-container" v-show="showLoading">
                <loading></loading>
            </div>
        </scroll>
       
    </div>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';

export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "投资记录";
        next();
    },
     data(){
        return {
            showLoading:false,
            isLastPage: false,
            pageNumber: 0,
            recordLists: []
        }
    },
    created(){
        this.productId = this.$route.query.productId;
        this._getOrderLists(1);
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
            this._getOrderLists(++this.pageNumber)
            this.$refs.scroll.finishPullUp();
        },
        _getOrderLists(pageIndex){
             this.showLoading = true;
             this.$axios.get('/app/getProductOrderRecord',{
                params:{
                    productId: this.productId,
                    pageNumber: pageIndex,
                    pageSize: 15
                }
            }).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                        res.data.data.list.forEach((element) => {
                             this.recordLists.push(element);
                        })
                         this.pageNumber = res.data.data.pageNum;
                         this.isLastPage = res.data.data.isLastPage;
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
    }
}
</script>
<style lang="scss" scoped>
    .inverment-record{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .title{
            height: px2rem(68);
            background-color: #f5f5f5;
            color: #333333;
            @include font-dpr(26px);
            display: flex;
            .title-col{
                flex: 1;
                text-align: center;
                line-height: px2rem(68);
            }
        }
        .record-container{
            position: absolute;
            top: px2rem(68);
            bottom: 0;
            left: 0;
            right: 0;
            overflow: hidden;
            .item{
                border-bottom: 1px solid #e4e4e4;
                height: px2rem(96);
                display: flex;
                .item-col{
                    flex: 1;
                    line-height: px2rem(96);
                    text-align: center;
                }
            }
            .loading-container{
                position: absolute;
                bottom: 20%;
                left: 50%;
                transform: translate3d(-50%,0,0);
            }
            .underline{
                text-align: center;
                padding: px2rem(10) 0;
            }
            .no-data{
                text-align: center;
                 padding: px2rem(10) 0;
            }
        }
     
        
    }
</style>


