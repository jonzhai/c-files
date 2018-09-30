<template>
    <div class="invesmentDetail">
         <scroll 
            ref="scroll" 
            class="scroll-container"
            @pullingDown="pullingDown"
        >  
            <div>
                <div class="swiper-container"  ref="sliderWrapper">
                    <slider :showDot="product.photo.length > 1" :autoPlay="product.photo.length > 1" :loop="product.photo.length > 1" v-if="product.photo.length">
                        <div v-for="(item,index) in product.photo" :key="index">
                            <a :href="item.link">
                                <img class="needsclick"  :src="product.photoIp+item.src">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="product-info">
                    <p class="product-info-head">{{product.pName}}</p>
                    <div class="product-info-body">
                        <div class="left-part">
                            <p class="detail-title">保底年化利率</p>
                            <p class="annualEarn">{{product.minAnnualEarn | toPrecent}}<span class="little">%</span></p>
                        </div>
                        <div class="middle-part">
                            <p class="detail-title">剩余金额(元)</p>
                            <p class="dark">{{product.remainCrowdPrice}}</p>
                        </div>
                        <div class="right-part">
                            <p class="detail-title">锁定期</p>
                            <p class="dark">{{product.inversCycle}}天</p>
                        </div>
                    </div>
                    <div class="product-info-foot">
                        <span class="inversUnderline">{{product.startInversPrice | toDecimal(2)}}元 起投</span>
                        <span>产品规模{{(product.crowdPrice/10000)| toDecimal(2)}}万</span>
                    </div>
                </div>
                <div class="investor-container" v-if="product.inverstorImages && product.inverstorImages.length > 0">
                    <div class="investor-img">
                        <img :src="!item.src ? defalutUserImg : product.photoIp+item.src" alt="" v-for="(item,index) in product.inverstorImages" :key="index">
                    </div>
                    <div class="investors" @click="toInvermentRecord">
                        共<span class="investor-count">{{product.totalInverstor}}</span>人投资<span class="icon iconfont icon-right1"></span>
                    </div>
                    <!-- <router-link tag="div" class="investors" :to="{path: '/invermentRecord',query:{productId: id}}">
                        共 <span class="investor-count">{{product.totalInverstor}}</span> 人投资<span class="icon iconfont icon-right1"></span>
                    </router-link> -->
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
                    <div class="swiper2-container" >
                        <!-- 滑动效果 -->
                        <!-- <slider-old @initSlide="initSlide" @changeIndex="changeIndex" ref="sliderOld"> 
                            <Particulars :pContent="product.pContent" ></Particulars>
                            <Detail :productItem="product.productItem" :photoIp="product.photoIp"  @loadImage='loadImage'></Detail>
                        </slider-old> -->
                        <transition name="fade">
                            <Particulars :pContent="product.pContent" v-if="!showDetail"></Particulars>
                            <Detail :productItem="product.productItem" :photoIp="product.photoIp" v-if="showDetail" @loadImage='loadImage'></Detail>
                        </transition>
                    </div>
                </div>
            </div>
          
         </scroll>
        <div class="loading-container" v-show="showLoading">
            <loading></loading>
        </div>
        <div class="fixed-footer">
            <div class="servers">
                <span class="icon"></span>
                <span class="kefu">客服</span>
            </div>
            <div class="control-btn">
                <span class="history-btn" @click="toInvermentRecord">投资记录</span>
                <span class="fast-btn" @click="toInvesmenImmediate">立即投资</span>
                <!-- <router-link tag="span"  class="history-btn" :to="{path:'/invermentRecord'}">投资记录</router-link> -->
                <!-- <router-link tag="span"  class="fast-btn" :to="{path:`/invesmenImmediate/${id}`}">立即投资</router-link> -->
            </div>
        </div>
        <!-- 客服弹出层 -->
        <div class="servers-mock">
            <div class="servers">
                <div class="wx"></div>
                <div class="phone"></div>
            </div>
        </div>
    </div>
</template>
<script>
import Slider from 'src/base/slider/slider';
import Scroll from 'src/base/scroll/scroll';
import Loading from 'src/base/loading/loading';
import Particulars from './child/particulars';
import Detail from './child/detail';
import SliderOld from 'src/base/slider/slider.old';

import {mapMutations,mapGetters} from 'vuex';
export default {
    beforeRouteEnter (to, from, next) {
        if(!to.query.pId){
            next(from.fullPath);
        }
        document.title = "投资详情";
        next();
    },
     data(){
        return {
            //轮播图数据
            lists:[
                {
                    src: require('./img/banner@2x.jpg'),
                    link: ''
                },
                {
                    src: require('./img/banner@2x.jpg'),
                    link: ''
                }
            ],
            defalutUserImg: require('./img/userDefault.png'),
            //投资人数据
            investors:[1,2,3,4,4,5],
            //产品数据
            product: {
                pContent: {},
                photo: [],
                productItem:{},
                inverstorImages: []
            },
            //产品id
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
        this.id = this.$route.query.pId;
  
        this._getProductById(this.id);
    },
    mounted(){
         setTimeout(() => {
             //设置左右滑动时，父级的宽度为两倍的子元素
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
        //去投资记录
        toInvermentRecord(){
            if(!this.curCount){
                this.$alert('当前尚未登录，请先登录！').then(()=>{
                    this.setPrevRouter(this.$route.fullPath)
                    this.$router.push({path: '/login'})
                }).catch((err) =>{
                    console.log(err)
                })
               
            }else{
                this.$router.push({path: '/invermentRecord',query:{productId: this.id}})
            }
        },
        //去立即投资
        toInvesmenImmediate(){
             this.$alert('商品已过期，无法购买！').then(()=>{
                    return;
                }).catch((err) =>{
                    console.log(err)
                })
            // if(!this.curCount){
            //      this.$alert('当前尚未登录，请先登录！').then(()=>{
            //         this.setPrevRouter(this.$route.fullPath)
            //         this.$router.push({path: '/login'})
            //     }).catch((err) =>{
            //         console.log(err)
            //     })
               
            // }else{
            //     this.$router.push({path:`/invesmenImmediate/${this.id}`})
            // }
        },
        refreshScroll(){
            setTimeout(()=>{
                 this.$refs.scroll.refresh();
            },500)
        },
        scroll(pos){
            this.scrollX = pos.x;
        },
        loadImage(){
             this.$refs.scroll.refresh();
        },
        changeTab(index){
            this.curIndex = index;
            if(index === 0){
                this.showDetail = false;
            }else{
                this.showDetail = true;
            }
            setTimeout(() => {
                    this.$refs.scroll.refresh();
            }, 20);
        },
        // initSlide(){
        //      this.$refs.scroll.refresh();
            
        // },
        // changeTab(index){
        //     this.curIndex = index;
        //     this.$refs.sliderOld.goToPage(index,0,500)
        // },
        // changeIndex(index){
        //      this.curIndex = index;
        // },
        //获取产品详情
        _getProductById(id){
            this.showLoading = true;
            let me = this;
            me.$axios.get('/product/getProductDetails',{
                params:{
                    id: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        me.product = res.data.data;
                        document.title= me.product.pName;
                        setTimeout(() => {
                            me.$refs.scroll.refresh();
                        },20)


                    }else{
                        me.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        return;
                    }
                    me.showLoading = false;
                    
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
    // },
    components:{
        Slider,
        Scroll,
        Loading,
        Particulars,
        Detail,
        SliderOld
    }
}
</script>
<style lang="scss" scoped>
    .invesmentDetail{
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
        .scroll-container{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: px2rem(88);
            overflow: hidden;
           
        }
        .loading-container{
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translate3d(-50%,-50%,0);
            // left: 0;
            // right: 0;
            // top: 0 ;
            // bottom: 0;
            // background-color: rgba(0,0,0,0.5);
            // display: flex;
            // justify-content: center;
            // align-items: center;


        }
        .swiper-container{
            height: px2rem(374);
            width: 100%;
            text-align: bottom;
        }
        .product-info{
             height: px2rem(298);
             box-sizing: border-box;
             padding: 0 px2rem(30);
             border-bottom:px2rem(20) solid #f5f5f5;
             display: flex;
             flex-direction: column;
            .product-info-head{
                @include font-dpr(36px);
                color: #333333; 
                height: px2rem(74);
                // @include ml-ellipsis(1);
                @include sl-ellipsis();
                line-height: 2em;
            
            }
            .product-info-body{
                height: px2rem(135);
                border-bottom: 1px solid #e4e4e4; 
                display: flex;
                // align-items: center;
                div{
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                   justify-content: center;
                    .detail-title{
                        color:#999999;
                        @include font-dpr(22px);
                        margin-bottom: px2rem(16);
                    }
                    .dark{
                        color:#333;
                         @include font-dpr(36px); 
                    }
                    &.left-part{
                        width:  px2rem(200);
                        .annualEarn{
                            color:#f57f3f;
                             @include font-dpr(48px);
                             .little{
                                @include font-dpr(28px);  
                             }
                        }
                        // border-right:1px solid #333; 
                    }
                    &.left-part:after{
                        content: '';
                        position: absolute;
                        display: block;
                        width: 1px;
                        height: px2rem(48);
                        background-color: #e4e4e4;
                        right: 0;
                        // top: 50%;
                        // transform: translate3d(0,-50%,0);
                        bottom: px2rem(40);
                    }
                    &.middle-part{
                        width:  px2rem(253);
                        text-align: center; 
                    }
                     &.middle-part:after{
                        content: '';
                        position: absolute;
                        display: block;
                        width: 1px;
                        height: px2rem(48);
                        background-color: #e4e4e4;
                        right: 0;
                        bottom: px2rem(40);
                        // top: 50%;
                        // transform: translate3d(0,-50%,0);
                    }
                    &.right-part{
                        padding-left: px2rem(50);
                    }
                }
                border-bottom: 1px solid #e4e4e4;
            }
            .product-info-foot{
                height: px2rem(88);
                color: #666666;
                @include font-dpr(24px);
                display: flex;
                align-items: center;
                .inversUnderline{
                    margin-right:  px2rem(84);
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
                    @include font-dpr(24px); 
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
                    width: 100vw;
                }
            }
        }
        .fixed-footer{
            position: fixed;
            bottom: 0;
            height: px2rem(88);
            left: 0;
            right: 0;
            padding: px2rem(16) px2rem(28);
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            @include font-dpr(28px);
            
            .servers{
                color:#666666;
                height: 100%;
                display: flex;
                flex: 1;
                margin-right: px2rem(48);
                border-right: 1px solid #e4e4e4; 
                align-items: center;
                .icon{
                    background-image: url('./img/serversPhone@2x.png');
                    background-repeat: no-repeat; 
                    background-size: contain; 
                    width:  px2rem(30);
                    height: px2rem(35);
                    padding-right: px2rem(20);
                }
            }
            .control-btn{
                display: flex;
                width: px2rem(480);
                height: 100%;
                border-radius: px2rem(28);
                overflow: hidden;
                span{
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fff;
                    &.history-btn{
                        background-color: #5e93fc;

                    }
                    &.fast-btn{
                        background-color: #f57f3f;
                    }
                }
            }
        }
    }

</style>


