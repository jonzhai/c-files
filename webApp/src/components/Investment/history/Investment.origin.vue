<template>
    <div id="invesment">
        <div class="banner-container" ref="bannerContainer">
            <img src="./img/invesmentBanner.jpg" alt="">
        </div>
                
        <scroll ref="classifyScroll" :data="classifyList"  class="classify-container  border-1px" :scrollY="false">
            <ul v-cloak class="classify" ref="classify" @click="changeClassify">
            <li 
                v-for="(item,index) in classifyList"
                :data-index="index"
                :class="{active:index == curIndex}"
                ref="lis"
                :key="index"
            >{{item}}</li>
            </ul>
            <img class="icon-right-arrow" src="./img/right_arrow.png"> 
        </scroll>
        <scroll ref="lists-scroll" :data="classifyList"  class="lists-container" :probeType="2" @scroll="scroll" :listenScroll="true">
            <ul v-cloak class="list-container" ref="lists">
                <li  v-for="(item,index) in lists"  ref="listItem"  :key="index" class="list-item border-1px" >
                    <div class="img-container">
                        <img src="./img/banner@2x.jpg" alt="">
                        <div class="bandge">最新</div>
                    </div>
                    <div class="yield-container">
                        <p class="yield-rate">10.00%</p>
                        <p class="yield-desc">保底年化</p>
                    </div>
                    <div class="invesment-regulation">
                        <p class="invesment-underline">5000起投</p>
                        <p class="lock-days">锁定期<span>30</span>天</p>
                    </div>
                    <div class="go-invesment">
                        <span class="invesment-btn">投资</span>  
                    </div>
                </li>
            </ul>
        </scroll>
        <div class="footer-container" ref="footer">
            <common-footer></common-footer>
        </div>
    </div>
    
</template>
<script>
import commonFooter from "src/base/commonFooter/commonFooter";
import Scroll from 'src/base/scroll/scroll';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "投资";
        next();
    },
    data(){
       return {
           classifyList: ["年化利率","持有限","区域","持有期限","区域","持有期限","区域"],
           lists:[1,2,3,4,5,2,3,4,5,2,3,4,5,],
           curIndex: 0
       } 
    },
    mounted(){
        setTimeout(() => {
            let parentWidth = 0;
            this.$refs.lis.forEach(item => {
                parentWidth += item.offsetWidth;
            })
            this.$refs.classify.style.width = parentWidth+"px";
        },20)
      
    },
    methods:{
        changeClassify(e){
            var target = e.target;
            this.curIndex = target.dataset.index;
            this.$refs.classifyScroll.scrollToElement(target,0);
        },
        scroll(pos){
           
        }
    },
    components:{
        commonFooter,
        Scroll
    }
}
</script>
<style lang="scss" scoped>
    #invesment{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: px2rem(90);
        overflow: hidden;
        .banner-container{
            width: 100%;
            height: px2rem(374);
            img{
                display: block;
                height: 100%;
            }
          
        }
        .classify-container{
            position: relative;
            height: px2rem(89);
            width: 100%;
            overflow-x: hidden;
            @include  border-1px(#e4e4e4);
            .classify{
                display: flex;
                flex-wrap: nowrap;
                li{
                    flex-shrink: 0;
                    line-height: px2rem(89);
                    padding: 0 px2rem(40);
                    position: relative;
                    &.active:after{
                        content: "";
                        display: block;
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 50%;
                        border-bottom: 4px solid #5e93fc;
                    }
                }
            }
            .icon-right-arrow{
                position: absolute;
                z-index: 10;
                display: block;
                right: px2rem(28);
                top: 50%;
                transform: translate3d(0,-50%,0);
                width: px2rem(14);
                height: px2rem(24);

            }
        }
        .lists-container{
            position: absolute;
            top: px2rem(463);
            // top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            // z-index:100;
            overflow: hidden;
            .list-container{
                padding: 0 px2rem(28);
                .list-item{
                    height:px2rem(168);
                    overflow: hidden;
                    box-sizing: border-box;
                    @include border-1px(#e4e4e4);
                    display: flex;
                    >div{
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .img-container{
                        width: px2rem(219);
                        position: relative;
                        img{
                           height:px2rem(90); 
                        }
                        .bandge{
                            position: absolute;
                            left: px2rem(2);
                            top: px2rem(20);
                            width: px2rem(50);
                            height:px2rem(30); 
                            // display: flex;
                            // justify-content: center;
                            // align-items: center;
                            text-align: center;
                            line-height: px2rem(30); 
                            color:#fff;
                            background-color: #56adff; 
                            @include font-dpr(18px);
                        }
                    }
                    .yield-container{
                        width: px2rem(164);
                        flex-direction: column;
                        .yield-rate{
                            color: #f57f3f;
                            @include font-dpr(36px);
                        }
                        .yield-desc{
                            @include font-dpr(22px);
                            color: #999;
                        }
                    }
                    .invesment-regulation{
                        width: px2rem(184);
                        flex-direction: column;
                        .invesment-underline{
                            color: #333333;
                            @include font-dpr(28px);
                        }
                        .lock-days{
                            @include font-dpr(22px);
                            color: #999;
                            span{
                               color: #5e93fc;  
                            }
                        }
                    }
                    .go-invesment{
                        flex: 1;
                        .invesment-btn{
                            width: px2rem(120);
                            height: px2rem(60);
                            color: #b2b2b2;
                            border-radius: px2rem(30);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border: 2px solid #f57f3f;
                        }
                    }
                }
            }
            
        }
        .footer-container{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
</style>

