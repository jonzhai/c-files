<template>
    <div class="about-us">
        <div class="banner">
            <p class="title">关于我们</p>
        </div>
        <div class="container">
            <div class="left-part">
                <ul class="my-nav">
                    <li class="nav-item" :class="{active: curIndex === 0}" @click="changeTab(0)">关于我们</li>
                    <li class="nav-item" :class="{active: curIndex === 1}" @click="changeTab(1)">公司愿景</li>
                    <li class="nav-item" :class="{active: curIndex === 2}" @click="changeTab(2)">服务网点</li>
                    <!-- <li class="nav-item" :class="{active: curIndex === 3}" @click="changeTab(3)">联系方式</li> -->
                </ul>  
            </div>
            <div class="right-part">
                <us v-if="curIndex === 0"></us>
                <company-dream  v-if="curIndex === 1"></company-dream>
                <servers-netPoint v-if="curIndex === 2"></servers-netPoint>

            </div>
        </div>
    </div>
</template>
<script>
import Us from '@/components/aboutUs/us';
import ServersNetPoint from '@/components/aboutUs/serversNetPoint';
import CompanyDream  from '@/components/aboutUs/companyDream';
export default {
    data(){
        return {
           lists: [
              
            ] ,
            curIndex: 0
        }
    },
    created() {
        let index = this.$route.query.index;
        if(index){
            this.curIndex = index;
        }
    },
    methods:{
      changeTab(index){
          this.curIndex = index;
      }  
    },
    components:{
        Us,
        ServersNetPoint,
        CompanyDream
    }
}
</script>

<style lang="scss" scoped>
    .about-us{
        .banner{
            height: 15rem;
            position: relative;
            background: url(./img/banner_bg.png) no-repeat;
            background-size: cover; 
            display: flex;
            justify-content: center;
            align-items: flex-end;
          .title{
             width: $fixedWidth;
             margin-bottom: 52px;
             color: #fff;
             font-size: 2rem; 
             text-align: left;
          }
        }
        .container{
             width: $fixedWidth;
             min-height: 450px;
             margin: 0 auto;
             padding-top: 38px;
             display: flex;
             justify-content: space-between;
             .left-part{
                 width: 256px;
                 flex-shrink: 0;
                 margin-right: 32px;
                 .my-nav{
                    width: 100%;
                    font-size: 18px;
                    text-align: center;
                    color: #7e7e7e;
                    .nav-item{
                        height: 58px;
                        line-height: 58px;
                        cursor: pointer;
                        &:hover{
                            background-color: #ededed;
                            color: #000;
                        }
                    }
                    .active{
                        border-left: 6px solid #4eccfc;
                        background-color: #ededed;
                        color: #000;
                    }
                 }
             }
             .right-part{
                 flex: 1;
                 padding-top: 20px;
             }

        }
    }
    @media screen and(max-width: 980px){
        .container{
            flex-direction: column;
            width: 100% !important;
        }
        .banner{
            .title{
                width: 100% !important;
                padding-left: 20px;

            }
        }
        .left-part{
            width: 100% !important;
            .my-nav{
                width: 100%;
                display: flex;
                .nav-item{
                    flex: 1;
                    margin-right: 20px;
                } 
                .active{
                    border-bottom: 2px solid #4eccfc;
                    border-left: none !important; 
                    background-color: #fff !important;
                }  
            }
        }
        .right-part{
            padding: 0 10px;
        }
        
    }
</style>

