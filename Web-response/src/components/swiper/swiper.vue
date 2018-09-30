<template>
    <swiper :options="swiperOption" @slideChangeTransitionStart="ts" ref="sw">
        <swiper-slide v-for="(item,index) in swipData" :key="index">
            <a :href="item.href">
                <img :src="photoIp+item.src">
            </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="swipData.length > 1"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
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
            speed:3000,
            loop:true,
            // followFinger : false,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true,//修改swiper的父元素时，自动初始化swiper
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            effect: "fade"
          },
          photoIp: this.$photoIp
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
    width: 0.7rem !important;
    height:  0.7rem !important;
    border-radius: 0.35rem !important;
    background-color: #eee;
}
.swiper-pagination-bullet-active{
    width: 1.4rem !important;
    background-color: #fff;
}
.swiper-pagination{
  text-align: center;
  /* width: 85% !important; */
  bottom: 1.5rem !important;
}
.swiper-button-next{
  right: 50px;
}
.swiper-button-prev{
  left: 50px;
  /* width: 44px;
  padding: 10px;
  background-color: rgba(0,0,0,0.3);
  color: #fff;
  border-radius:50%;  */
}
@media screen and (max-width: 980px){
  .swiper-button-next{
    display: none;
  }
  .swiper-button-prev{
     display: none;
  }
}
</style>