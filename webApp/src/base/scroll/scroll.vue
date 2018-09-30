<template>
  <div ref="wrapper" class="wrapper" style="">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      pullup: {
        type: Boolean,
        default: true
      },
      pullingDown: {
        type: Boolean,
        default: true
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      scrollY:{
        type: Boolean,
        default: true
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: true,
          tap: true,
          scrollX: !this.scrollY,
          scrollY: this.scrollY,
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          },
          pullUpLoad: {
            threshold: 50
          },
          // scrollbar: {
          //   fade: true,
          //   interactive: true // 1.8.0 新增
          // }
        })
        if (this.click) {
          let me = this
          this.scroll.on('click', (pos) => {
            me.$emit('click', pos)
          })
        }
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
        this.scroll.on('pullingDown', ()=>{
          this.$emit('pullingDown')
        });
        this.scroll.on('pullingUp', ()=>{
          this.$emit('pullingUp')
        });
        this.scroll.on('scrollStart', ()=>{
          this.$emit('scrollStart')
        });
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
       scrollBy() {
        this.scroll && this.scroll.scrollBy.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      finishPullDown(){
        this.scroll && this.scroll.finishPullDown();
      },
      finishPullUp(){
        this.scroll && this.scroll.finishPullUp();
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>
<style sass scoped>
/* .wrapper{
  width:100%;
  height:100%;
  overflow:hidden;
} */
</style>




