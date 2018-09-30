<template>
  <div class="index">
      <common-header></common-header>
      <!-- <keep-alive> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
      <common-footer></common-footer> 

  </div>
</template>

<script>
import CommonHeader from '@/components/commonHeader/header';
import CommonFooter from '@/components/commonFooter/footer';

export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components:{
    CommonHeader,
    CommonFooter
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


