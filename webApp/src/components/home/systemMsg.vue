<template>
    <scroll 
        class="msg-container"
        ref="scroll"
        @pullingDown="pullingDown"
        @pullingUp="pullingUp"
    >
        <ul class="system-msg">
            <li class="msg-item" v-for="(item,index) in newsLists" :key="index">
                <p class="title">{{item.title}}</p>
                <p class="time">{{item.createTime | toTime}}</p>
                <p class="content">{{item.content}}</p>
                <p class="bandge">{{item.isRead > 0 ? "已读":"未读"}}</p>
            </li>
        </ul>
        <p class="underline" v-show="isLastPage"> 已经到底了...</p>
        <p class="underline" v-show="newsLists.length === 0">当前无数据！</p>
         <div class="loading-container" v-show="showLoading">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "系统消息";
        next();
    },
    data(){
        return {
            showLoading:false,
            isLastPage: false,
            pageNumber: 0,
            newsLists: []
        }
    },
    created(){
        this._getNews(1);
    },
    methods:{
        pullingDown(e){
            this.$refs.scroll.finishPullDown();
        },
   
        pullingUp(){
            if(this.isLastPage){
                return;
            }
            this._getNews(++this.pageNumber)
            this.$refs.scroll.finishPullUp();
        },
        _getNews(pageIndex){
            this.showLoading = true;
            this.$axios.get('/app/getUserMessageList',{
                params:{
                        pageNumber: pageIndex,
                        pageSize: 10
                    }
            }).then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                         res.data.data.list.forEach((element) => {
                             this.newsLists.push(element);
                        })
                         this.pageNumber = res.data.data.pageNum;
                         this.isLastPage = res.data.data.isLastPage;
                    }else{
                       this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        return;
                    }
                } 
                this.showLoading = false;
            }).catch((err) =>{
                console.log(err)
            })
        }
    },
    filters:{
        toTime(val){
            if(typeof val !== "number"){
                return;
            }
            let date = new Date(val);
            return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }
    },
    components:{
        Scroll,
        Loading
    }
}
</script>
<style lang="scss" scoped>
    .msg-container{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        // width: 100vw;
        // height: 100vh;
        // z-index: 100;
        background-color: #f5f5f5;
        .system-msg{
            padding: 0 px2rem(30);
            .msg-item{
                border: 1px solid #e5e6e6;
                background-color: #fff;
                padding: px2rem(32) px2rem(20) px2rem(28);
                margin-top:  px2rem(20);
                border-radius:  px2rem(20);
                position: relative;
                .title{
                    @include font-dpr(32px);
                    color:#333333;
                    margin-bottom: px2rem(18);
                }
                .time{
                    color: #999999;
                    @include font-dpr(22px);
                    margin-bottom: px2rem(32);
                }
                .content{
                    color:#666666; 
                    @include font-dpr(28px);
                    
                }
                .bandge{
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: px2rem(85);
                    height: px2rem(36);
                    background-color: #e9ecf2;
                    color: #999999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    @include font-dpr(22px);
                    border-radius: 0  px2rem(20) 0 px2rem(20);
                }
            }
        }
        .loading-container{
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translate3d(-50%,-50%,0);
        }
        .underline{
            text-align: center;
            margin-top: px2rem(10);
        }
    }
</style>


