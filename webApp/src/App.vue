<template>
  <div id="app">
    <keep-alive :include="['home','investment','saleCars']">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
export default {
  name: 'App',
  // beforeDestroy() {
  //     this.LOGOUT();
  // },
  created() {
     //记录页面卸载时间+30min，每次进入页面时，判断当前时间是否大于记录时间，如果大于，则退出登录
    let now = new Date().getTime(),
        date = localStorage.getItem('unloadTime');
    if(date){
      date = parseInt(date);
      if(now > date){
        this.LOGOUT();
      }
    }
  },
  mounted(){
    window.onunload = ()=>{
      localStorage.setItem('unloadTime',new Date().getTime()+30*60*1000);
      // this.LOGOUT();
    }
  },
  methods:{
    ...mapActions(['LOGOUT'])
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "STXihei", "Microsoft YaHei", "SimHei", "WenQuanYi Micro Hei";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

}
</style>
