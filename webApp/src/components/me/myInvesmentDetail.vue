<template>
    <div class="invesmentDetail">
         <scroll 
            ref="scroll" 
            class="scroll-container"
            @pullingDown="pullingDown"
        >  
            <div>
                <div class="top">
                    <div class="head">
                        <p class="title">{{product.title}}</p>
                        <p>订单编号：{{product.serialno}}</p>
                    </div>
                    <div class="body">
                        <div>
                            <p class="alreadyEarn">{{product.profitPrice}}</p>
                            <p class="desc">已赚利息（元）</p>
                        </div>
                         <div class="middle">
                            <p class="title">{{product.totalPrice}}</p>
                            <p class="desc">在投金额（元）</p>
                        </div>
                        <div class="middle">
                            <p class="title">{{product.annualEarn}}</p>
                            <p class="desc">保底年化</p>
                        </div>
                    </div>
                    <div class="foot">
                        <p>{{product.startInversPrice | toDecimal(2)}}元 起投</p>
                        <p>剩余金额{{(product.remainCrowdPrice/10000) | toDecimal(2)}}万</p>
                        <p>到期：<span class="orange">{{product.returnDate | toDate2}}</span></p>
                    </div>
                </div>
                <div class="investor-container">
                    <div class="investor-img">
                        <img :src="!item.src ? defalutUserImg : product.photoIp+item.src" alt="" v-for="(item,index) in product.inverstorImages" :key="index">
                    </div>
                    <router-link tag="div" class="investors" :to="{path: '/invermentRecord',query:{productId: product.productId}}">
                        共 <span class="investor-count">{{product.totalInverstor}}</span> 人投资<span class="icon iconfont icon-right1"></span>
                    </router-link>
                </div>
                <div class="progress-info">
                    <div class="steps">
                        <div class="step" :class="{active: product.orderStatus >= 1}">
                            <span class="circle">
                            </span>
                            <span class="desc">认购</span>
                            <span class="date">{{product.orderTime | toDate2}}</span>
                        </div>
                        <div class="step" :class="{active: product.orderStatus >= 2}">
                            <span class="circle">
                                <span class="line"></span>
                            </span>
                            <span class="desc">起息</span>
                            <span class="date">{{product.valueDate | toDate2}}</span>
                        </div>
                        <div class="step" :class="{active: product.orderStatus >= 3}">
                            <span class="circle">
                                <span class="line"></span>
                            </span>
                            <span class="desc">回款</span>
                            <span class="date">{{product.returnDate | toDate2}}</span>
                        </div>
                        <div class="step" :class="{active: product.orderStatus >= 4}">
                            <span class="circle">
                                <span class="line"></span>
                            </span>
                            <span class="desc">还本息</span>
                            <span class="date">{{product.endTime | toDate2}}</span>
                        </div>
                    </div>

                </div>
                <div class="productDetail-container">
                    <div class="nav" @click="refreshScroll">
                       <div class="left" :class="{active:curIndex === 0 }" @click="changeTab(0)">
                            <span>详情</span>
                        </div>
                        <div class="left" :class="{active:curIndex === 1 }" @click="changeTab(1)">
                            <span>明细</span>
                        </div>
                    </div>
                     <!-- <scroll 
                        :scrollY="false"
                        :probeType="2" 
                        :listenScroll="true"  
                        @scroll = "scroll"
                        ref="hScroll"
                        class="hScroll"  
                    >
                        <div class="swiper-container" ref="sliderWrapper">
                            <Particulars :pContent="product.pContent" ></Particulars>
                            <Detail :productItem="product.productItem" @loadImage="loadImage" :photoIp="product.photoIp"></Detail>
                        </div>
                    </scroll> -->
                    <div class="swiper-container" >
                        <transition name="fade">
                            <Particulars :pContent="product.pContent" v-if="!showDetail"></Particulars>
                            <Detail :productItem="product.productItem" :photoIp="product.photoIp" v-if="showDetail" @loadImage="loadImage"></Detail>
                        </transition>
                    </div>


                </div>
            </div>
              <div class="loading-container" v-show="showLoading">
                <loading></loading>
            </div>
         </scroll>
        <div class="fixed-footer" @click="toMonitor">
            监控
        </div>
    </div>
</template>
<script>
import Slider from 'src/base/slider/slider';
import Scroll from 'src/base/scroll/scroll';
import {mapMutations,mapGetters} from 'vuex';
import Loading from 'src/base/loading/loading';
import Particulars from 'src/components/investment/child/particulars';
import Detail from 'src/components/investment/child/detail';
export default {
    beforeRouteEnter (to, from, next) {
        if(!to.query.id){
            next(from.fullPath);
        }
        document.title = "投资详情";
        next();
    },
     data(){
        return {
            //轮播图数据
         
            //投资人数据
            // investors:[1,2,3,4,4,5],
            //产品数据
            product: {
                pContent: {},
                photo: [],
                productItem:{},
                inverstorImages: []
            },
            //投资者默认图片
            defalutUserImg: require('./img/userDefault.png'),
            //订单id
            id: '',
            //是否显示loading
            showLoading: false,
             //下方滑动时X轴的移动距离
            // scrollX: 0,
            //当前导航的index
            curIndex: 0,
            showDetail: false


        }
    },
    created(){
        this.id = this.$route.query.id;
        //获取订单详情
        this._getOrderDetailById(this.id);
    },
    mounted(){
         setTimeout(() => {
             //设置左右滑动时，父级的宽度为两倍的子元素
            // let tempW = document.body.clientWidth;
            // this.$refs.sliderWrapper.style.width = 2*tempW +'px';
            this.$refs.scroll.refresh();
        }, 20);
    },
    computed:{
        ...mapGetters(['curCount'])
    },
    methods:{
        ...mapMutations({
            setPrevRouter: 'SET_PREVROUTER'
        }),
        pullingDown(e){
            this.$refs.scroll.finishPullDown();
        },
        //到投资记录
        toInvermentRecord(){
            //如果当前用户未登录，记录当前地址并去登录
            if(!this.curCount){
                this.setPrevRouter(this.$route.fullPath)
                this.$router.push({path: '/login'})
            }else{
                this.$router.push({path: '/invermentRecord'})
            }
        },
        //到立即投资
        toInvesmenImmediate(){
            if(!this.curCount){
                this.setPrevRouter(this.$route.fullPath)
                this.$router.push({path: '/login'})
            }else{
                this.$router.push({path:`/invesmenImmediate/${this.id}`})
            }
        },
        refreshScroll(){
            setTimeout(()=>{
                 this.$refs.scroll.refresh();
            },500)
        },
        //到监控
        toMonitor(){
            // console.log('暂未接入！')
            // return ;
            this.$router.push({path: '/monitor', query:{pId: this.$route.query.pId}})
        },
        // scroll(pos){
        //     this.scrollX = pos.x;
        // },
         changeTab(index){
            this.curIndex = index;
            if(index === 0){
                this.showDetail = false;
            }else{
                this.showDetail = true;
            }

            // if(this.curIndex === index){return};
            // let tempW = document.body.clientWidth;
            // //从1滑倒0
            // if(index === 0){
            //     this.$refs.hScroll.scrollTo(0,0,500);
            // }else{
            //     this.$refs.hScroll.scrollTo(-tempW,0,500);
            // }
        },
        //组件内图片加载完成后刷新scroll
        loadImage() {
            this.$refs.scroll.refresh();
        },
        _getOrderDetailById(id){
            this.showLoading = true;
            let me = this;
            me.$axios.get('/app/getMyOrderDetail',{
                params:{
                    id: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        me.product = res.data.data;
                       setTimeout(() => {
                            me.$refs.scroll.refresh();
                        },20)
                    }else{
                       me.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        // reject(res.data.message);
                        return;
                    }
                      this.showLoading = false;
                } 

            }).catch((err) =>{
                console.log(err)
            })
            
        }
    },
    //  watch:{
    //     //根据当前滚动距离滚动nav和layer层
    //     scrollX(newVal){
    //         let tempW = document.body.clientWidth;
    //         if(newVal > -tempW/2){
    //             if(this.curIndex !== 0){
    //                 this.curIndex = 0;
    //                 this.$refs.hScroll.scrollTo(0,0,500);
    //             }
               
    //         }else{
    //               if(this.curIndex !== 1){
    //                 this.curIndex = 1;
    //                 this.$refs.hScroll.scrollTo(-tempW,0,500);
    //             }
                
    //         }
    //     }
    //  },
    components:{
        Slider,
        Scroll,
        Loading,
        Particulars,
        Detail
    }
    
}
</script>
<style lang="scss" scoped>
    .invesmentDetail{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        .scroll-container{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: px2rem(88);
            overflow: hidden;
             @include font-dpr(24px);
           color: #666666;
        }
       .top{
           padding: 0 px2rem(30);
            @include font-dpr(24px);
           color: #666666;
           border-bottom: px2rem(20) solid #f5f5f5;
           .head{
                height: px2rem(90);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e5e5e5; 
                .title{
                    color: #333333;
                    @include font-dpr(28px);
                    max-width: 10em;
                    // @include ml-ellipsis(1);
                    @include sl-ellipsis();
                }
           }
           .body{
               height: px2rem(181);
               box-sizing: border-box;
               border-bottom: 1px solid #e5e5e5;
               display: flex;
               padding-bottom: px2rem(58); 
               align-items: flex-end; 
               >div{
                   flex: 1;
               }
               .middle{
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   position: relative;
                   &::before{
                       content: "";
                       display: block;
                       width: 1px;
                       height: px2rem(40);
                       background-color: #e5e5e5;
                       position: absolute;
                       left: 0;
                       top: 50%;
                       transform: translate3d(0,-50%,0);


                   }
               }
               .alreadyEarn{
                   color: #f57f3f;
                   @include font-dpr(48px);
                   font-weight: 700;
               }
               .title{
                   color: #333333;
                   @include font-dpr(32px);
               }
               .desc{
                   margin-top: px2rem(16);  
               }
           }
           .foot{
                height: px2rem(98);
                display: flex;
                justify-content: space-between;
                align-items: center;
                .orange{
                   color: #f57f3f;  
                }
           }
       }
        .investor-container{
            height: px2rem(88);
            padding: 0 px2rem(30);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom:px2rem(20) solid #f5f5f5;
            .investor-img {
                height: 100%;
                display: flex;
                align-items: center;
                img{
                    height: px2rem(50);
                    width: px2rem(50);
                    border-radius: 50%;
                    margin-left: px2rem(-10);
                    // transform: translate3d(-20px,0,0);
                    &:first-child{
                        margin-left: 0;
                    }
                }
            }
            .investors{
                @include font-dpr(24px);
                .investor-count{
                    color: #5e93fc;
                }
                .iconfont{
                    margin-left: px2rem(14); 
                    @include font-dpr(24px); 
                }
            }
        }
        .progress-info{
            height: px2rem(150);
            border-bottom: px2rem(20) solid #f5f5f5;
            padding: 0 px2rem(30);
            .steps{
                position: relative;
                height: 100%;
                width: 100%;
            }
            .step{
                // flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: absolute;
                height: 100%;
                &:first-child{
                    left: 0;
                    align-items: flex-start;
                }
                &:nth-child(2){
                    left: 33.33%;
                    transform: translateX(-50%);
                }
                 &:nth-child(3){
                    right: 33.33%;
                    transform: translateX(50%);
                    
                }
                 &:last-child{
                    right: 0;
                     
                    align-items: flex-end;
                }
                .circle{
                    width: px2rem(20);
                    height: px2rem(20);
                    border-radius: 50%;
                    box-sizing: border-box;
                    border: px2rem(2) solid #e0e0e0; 
                    margin-bottom: px2rem(16);
                    position: relative;
                    .line{
                        position: absolute;
                        display: block;
                        width: px2rem(182);
                        height: px2rem(2);
                        background-color: #e0e0e0;
                        right: 100%;
                        margin-right:  px2rem(10);
                        top: 50%;
                    }
                }
                .desc{
                    margin-bottom: px2rem(10);
                }
                &.active{
                    color: #5e93fc; 
                   .circle{
                       border-color: #5e93fc;
                       .line{
                        background-color: #5e93fc;
                       }
                   } 
                }
            }
            
        }
        .productDetail-container{
            .nav{
                height: px2rem(90);
                box-sizing: border-box;
                border-bottom: 1px solid #ededed;
                display: flex;
                >div{
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    span{
                        height: 100%;
                        display: flex;
                        align-items: center;
                        box-sizing: border-box;

                    }
                    &.active{
                        span{
                            border-bottom:px2rem(4) solid #5e93fc;
                            color: #5e93fc; 
                        }
                    }
                }
            }
             .hScroll{
                width: 100%;
                // overflow-x: hidden;
                height: auto;
                .swiper-container{
                    display: flex;
                    height: auto;
                    width: 200vw;
                }
            }
        }
        .loading-container{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 20%;
        }
        .fixed-footer{
            position: fixed;
            bottom: 0;
            height: px2rem(88);
            left: 0;
            right: 0;
            line-height: px2rem(88);
            text-align: center;
            background-color: #5e93fc;
            @include font-dpr(32px);
            color: #fff;
        
        }
    }
       
</style>


