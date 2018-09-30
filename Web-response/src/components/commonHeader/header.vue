<template>
    <div class="header">
        <!-- <div class="container"> -->
            <!-- <nav class="navbar navbar-expand-lg navbar-light  justify-content-between" >
                <a class="navbar-brand" href="#">
                    <img src="./img/logo.png" width="50"  alt="">
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>


                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <router-link tag="li" :to="{path: '/home'}">首页</router-link>
                        <router-link tag="li" :to="{path: '/onlineCar'}">车盈在线</router-link>
                        <router-link tag="li" :to="{path: '/aboutUs'}">关于我们</router-link>
                        <router-link tag="li" :to="{path: '/jobs'}">人才招聘</router-link>
                    </ul>
                </div>
            </nav> -->
            
        <!-- </div>   -->
        
        <header class="container">
            <div class="brand">
                <img src="./img/logo.png" alt="">
            </div>
           
            <div class="min-device ">
                <div @click="toBlock"><span class="icon iconfont icon-weibiaoti12"></span> </div>
            </div>
             <nav ref="nav" class="nav-symbol">
                <ul class="nav">
                    <router-link tag="li" :to="{path: '/home'}">首页</router-link>
                    <router-link tag="li" :to="{path: '/onlineCar'}">车盈在线</router-link>
                    <router-link tag="li" :to="{path: '/aboutUs'}">关于我们</router-link>
                    <router-link tag="li" :to="{path: '/jobs'}">人才招聘</router-link>
                </ul>
            </nav>
        </header>
    </div>
</template> 
<script>
export default {
    methods:{
        toBlock(){
            let temp =  this.$refs.nav.style.display;
         
            if(temp !=="block"){
                this.$refs.nav.style.display = "block";
            }else{
                this.$refs.nav.style.display = "none";
            }
        }
    }
}
</script>

<style lang="scss" scoped>
  .header{
        box-shadow: 0px 0px 10px #666;
        // height: 60px;
        // overflow: hidden;
        // padding: 10px 20px;
        
    .container{
        width: $fixedWidth;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .min-device{
            display: none;
            .iconfont{
                cursor: pointer;
                font-size: 2rem;
            }
        }
        .nav-symbol{
            display: block;
        }
        nav{
            height: 100%;
            display: flex;
            align-items: center;
        }
        .nav{
            display: flex;
            font-size: 18px;
            height: 100%;
            cursor: pointer;
            flex-shrink: 0;
            >li{
                line-height: 60px;
                width: 175px;
                flex-shrink: 0;
                text-align: center;
                color: #7e7e7e;
                &:hover{
                    background: url(./img/nav_bg.png) no-repeat;
                     color: #fff;
                }
            }
            .router-link-active{
               background: url(./img/nav_bg.png) no-repeat;
               color: #fff;
            }
        }
    } 
   
  }
   @media screen and (max-width: 980px){
        .header{
             padding: 10px 20px;
            .container{
                width: 100%;
                .min-device{
                    display: block;
                }
                .nav-symbol{
                    display: none;
                    width: 100%;
                }
                .nav{
                    flex-direction: column;
                    >li{
                            width: 100%;
                            line-height: 40px;
                        &:hover{
                            background: rgba(0,0,0,0.3) !important;
                        }
                    }
                    .router-link-active{
                        background: rgba(0,0,0,0.3) !important;
                    }
                }
            } 
        }

    }
</style>

