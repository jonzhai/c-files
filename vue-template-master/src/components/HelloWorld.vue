<template>
  <div class="hello">
    <h1 class="tab border-1px">{{ msg }}</h1>
    <div class="bg"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  // @import url(../assets/style/common.scss);
  .tab{
    display: flex;
    width: 100%;
    // height: 40px;

    line-height: 1.4em;
    @include font-dpr(40px);
    @include border-1px(rgba(7,17,27,1));
 }
 .bg{
   width: 80%;
   height: px2rem(320);
   @include img-dpr('../assets/images/logo');
   background-repeat: no-repeat; 
   display: flex;
 }
</style>
