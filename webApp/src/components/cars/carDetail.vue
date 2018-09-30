<template>
    <div class="carDetail">
         <scroll 
            ref="scroll" 
            class="scroll-container"
            @pullingDown="pullingDown"
        >  
            <div>
                <div class="swiper-container"  ref="sliderWrapper">
                    <slider :showDot="Car.carPhoto.length > 1" :autoPlay="Car.carPhoto.length  > 1" :loop="Car.carPhoto.length  > 1" v-if="Car.carPhoto.length" >
                        <div v-for="(item,index) in Car.carPhoto" :key="index">
                            <a>
                                <img class="needsclick"  :src="Car.photoIp+item.src">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="car-info">
                    <p class="title">{{Car.title}}</p>
                    <div class="car-money">
                        <p class="car-price">￥{{Car.sellPrice}}万</p>
                        <p class="car-distance">里程数：{{Car.mileage}}万公里</p>
                    </div>
                </div>
                <div class="car-detail">
                    <p class="title">汽车信息</p>
                    <p class="detail">{{Car.carContent}}</p>
                </div>
            </div>
         </scroll>
        <div class="fixed-footer">
            <a class="tel" :href="`tel:${Car.customerPhone}`">
            <!-- <div class="tel"> -->
                <img src="./img/phone.png" alt="">
                <span>电话咨询</span>
            <!-- </div> -->
            </a>
            <div class="weixin">
                <img src="./img/wechat.png" alt="">
               <span> 微信客服</span>
            </div>
        </div>
    </div>
</template>
<script>
import Slider from 'src/base/slider/slider';
import Scroll from 'src/base/scroll/scroll';
import {mapMutations,mapGetters} from 'vuex';
export default {
    beforeRouteEnter (to, from, next) {
        if(!to.query.id){
            next(from.fullPath);
        }
        document.title = "汽车详情";
        next();
    },
     data(){
        return {
            //产品数据
            Car: {
                carPhoto: []
            },
            id: ''

        }
    },
    created(){
        this.id = this.$route.query.id;
        this._getCarById(this.id);
    },
    mounted(){
        setTimeout(()=>{
            this.$refs.scroll.refresh();
        },20)
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
        toInvermentRecord(){
            if(!this.curCount){
                this.setPrevRouter(this.$route.fullPath)
                this.$router.push({path: '/login'})
            }else{
                this.$router.push({path: '/invermentRecord',query:{productId: this.id}})
            }
        },
        
        refreshScroll(){
            setTimeout(()=>{
                 this.$refs.scroll.refresh();
            },500)
        },
        _getCarById(id){
            let me = this;
            me.$axios.get('/sellCar/getSellCarDetailByCarId',{
                params:{
                    carId: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                    // console.log( res)
                        me.Car = res.data.data;
                    }else{
                        me.toast(res.data.message);
                        return;
                    }
                } 

            }).catch((err) =>{
                console.log(err)
            })
            
        }
    },
    components:{
        Slider,
        Scroll
    }
}
</script>
<style lang="scss" scoped>
    .carDetail{
        position: absolute;
        top: 0;
        left: 0;
        right: 0; 
        bottom: 0;
        background-color: #fff;
        .scroll-container{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: px2rem(88);
            overflow: hidden;
        }
        .swiper-container{
            height: px2rem(374);
            width: 100%;
            // text-align: bottom;
        }
        .car-info{
             height: px2rem(220);
             box-sizing: border-box;
             padding: 0 px2rem(26);
             border-bottom:px2rem(20) solid #f5f5f5;
             display: flex;
             flex-direction: column;
             justify-content: center;
            @include font-dpr(28px);
            color: #666666; 
            .title{
                @include font-dpr(36px);
                color: #333333; 
                font-weight: 700;
                padding: 0 px2rem(10);
                margin-bottom: px2rem(20);
                @include ml-ellipsis(2);
               height: 2.8em;
            }
            .car-money{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .car-price{
                    color: #f57f3f; 
                    font-weight: 700; 
                }
                .car-distance{
                    @include font-dpr(22px);
                }
              
            }
        }
        .car-detail{
            padding: 0 px2rem(26);
            .title{
                color: #333; 
                font-weight: 700;
                margin-top: px2rem(28);   
                margin-bottom: px2rem(16);

            }
            .detail{
                @include font-dpr(28px);
                color: #666666; 
                line-height: 1.4em;
            }
        }
        .fixed-footer{
            position: fixed;
            bottom: 0;
            height: px2rem(88);
            left: 0;
            right: 0;
            display: flex;
            justify-content: space-between;
            @include font-dpr(28px);
            color: #fff;
            >div,.tel{
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                img{
                    margin-right: px2rem(20);
                }
            }
            .tel{
                background-color: #5e93fc;
                // display: block;
                img{
                    width: px2rem(36);
                    height: px2rem(38);
                }
            }
            .weixin{
                background-color: #42bd55;
                img{
                    width: px2rem(40);
                    height: px2rem(32);
                }
            }
        }
    }
       
</style>




