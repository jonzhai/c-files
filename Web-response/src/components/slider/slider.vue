<template>
  <div class="slider" ref="slide">
    <div class="slider-group" ref="slideGroup">
      <slot>
      </slot>
    </div>
    <div v-if="showDot" class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {addClass} from '@/assets/js/dom';
  import BScroll from 'better-scroll'
  const COMPONENT_NAME = 'slide';
  export default {
    name: COMPONENT_NAME,
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      },
      showDot: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true
      },
      threshold: {
        type: Number,
        default: 0.3
      },
      speed: {
        type: Number,
        default:1000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      this.update();
      window.addEventListener('resize', () => {
        if (!this.slide || !this.slide.enabled) {
          return
        }
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          if (this.slide.isInTransition) {
            this._onScrollEnd();
          } else {
            if (this.autoPlay) {
              this._play();
            }
          }
          this.refresh();
        }, 60)
      })
    },
    activated() {
      if (!this.slide) {
        return
      }
      this.slide.enable();
      let pageIndex = this.slide.getCurrentPage().pageX;
      this.slide.goToPage(pageIndex, 0, 0);
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    deactivated() {
      this.slide.disable();
      clearTimeout(this.timer);
    },
    beforeDestroy() {
      this.slide.disable();
      clearTimeout(this.timer);
    },
    methods: {
      update() {
        if (this.slide) {
          this.slide.destroy();
        }
        this.$nextTick(() => {
          this.init();
        })
      },
      refresh() {
        this._setSlideWidth(true);
        this.slide.refresh();
      },
      prev() {
        this.slide.prev();
      },
      next() {
        this.slide.next();
      },
      init() {
        clearTimeout(this.timer);
        this.currentPageIndex = 0;
        this._setSlideWidth();
        if (this.showDot) {
          this._initDots();
        }
        this._initSlide();
        if (this.autoPlay) {
          this._play();
        }
      },
      _setSlideWidth(isResize) {
        this.children = this.$refs.slideGroup.children;
        let width = 0;
        let dpr = document.documentElement.getAttribute('data-dpr');
        let slideWidth;
        if(dpr === '1' || !dpr){
            slideWidth = this.$refs.slide.clientWidth;
        }else{
            slideWidth = window.screen.width*window.devicePixelRatio;
        }
        // let slideWidth = this.$refs.slide.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = slideWidth + 'px';
          width += slideWidth;
        }
        if (this.loop && !isResize) {
          width += 2 * slideWidth;
        }
        this.$refs.slideGroup.style.width = width + 'px';
      },
      _initSlide() {
        // console.log(this.threshold)
        this.slide = new BScroll(this.$refs.slide, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          eventPassthrough: 'vertical',
          snap: {
            loop: this.loop,
            threshold: this.threshold,
            speed: this.speed
          },
          bounce: false,
          stopPropagation: true,
          click: this.click
        })
        this.slide.on('scrollEnd', this._onScrollEnd);
        this.slide.on('touchEnd', () => {
          if (this.autoPlay) {
            this._play();
          }
        });
        this.slide.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        });
     
      },
      _onScrollEnd() {
        let pageIndex = this.slide.getCurrentPage().pageX;
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          this._play();
        }
      },
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      _play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slide.next();
        }, this.interval)
      }
    },
    watch: {
      loop() {
        this.update();
      },
      autoPlay() {
        this.update();
      },
      speed() {
        this.update();
      },
      threshold() {
        this.update();
      },
      currentPageIndex(newVal){
        this.$emit('changeIndex',newVal)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .slider{
    min-height: 1px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .slider-group{
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      height: 100%;
      .slider-item{
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        height: 100%;
        a{
          display: block;
          width: 100%;
         height: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .dots{
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: right;
      padding-right: 200px; 
      font-size: 0;
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 30px;
        height: 14px;
        border-radius: 7px;
        background: #555;
        &.active{
          // width: 20px;
          // border-radius: 5px;
          background: #fff;
        }
      }
    }
  }
</style>