<template>
  <div class="loading">
    <img  src="./loading.gif">
    <p class="desc">{{desc}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      desc: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .loading{
    width: 100%;
    text-align: center;
    img{
      width:  px2rem(32); 
      height:  px2rem(32); 
    }
    .desc{
      line-height: 20px;
      font-size: 0.8em;
      color: #000;
      // color: #fff;
    }
  }
    
     
</style>

