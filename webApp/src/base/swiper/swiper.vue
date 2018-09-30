<template>
    <swiper :options="swiperOption" @slideChangeTransitionStart="ts" ref="sw">
        <swiper-slide v-for="(item,index) in swipData" :key="index">
            <a :href="item.link">
                <img :src="item.src">
            </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="swipData.length > 1"></div>
    </swiper>
</template>
<script>
  import Vue from 'vue'
  import VueAwesomeSwiper from 'vue-awesome-swiper'

  // require styles
  import 'swiper/dist/css/swiper.css'

  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  export default{
      props:{
        swipData:{
            type: Array,
            required: true
          }
      },
      data() {
        return {
          swiperOption: {
            autoplay: {
              disableOnInteraction: false
            },//可选选项，自动滑动
            speed:1000,
            loop:true,
            // followFinger : false,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            }
          }
        }
      },
      created:function(){
        
      },
      methods:{
        ts(e){
            // console.log(this.$refs.sw.swiper.realIndex)
        }
      },//methods
      components: {
        swiper,
        swiperSlide
     }

    }//export




</script>  
<style>
.swiper-wrapper{
  height: 100%;
  width: 100%;
}
.swiper-slide{
  height: 100%;
  width: 100%;
}
.swiper-slide img{
  display: block;
  height: 100%;
  width: 100%;
}
.swiper-pagination-bullet{
    width: 14px;
    height: 14px;
    border-radius: 7px;
}
.swiper-pagination-bullet-active{
    background-color: #fff;
}
</style>