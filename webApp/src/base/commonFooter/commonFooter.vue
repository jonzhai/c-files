<template>
    <div class="footer">
        <router-link tag="div" class="home" to="/home">
            <p class="icon-little"></p>
            <p class="icon-text">首页</p>
        </router-link>
        <router-link tag="div" class="investment" to="/investment">
            <p class="icon-little"></p>
            <p class="icon-text">投资</p>
        </router-link>
        <router-link tag="div" class="buy-car" to="/saleCars">
            <p class="icon-little"></p>
            <p class="icon-text">购车</p>
        </router-link>

        <!-- <div class="personal-center" @click="toMe">
            <p class="icon-little"></p>
            <p class="icon-text">我</p>
        </div> -->
        <router-link tag="div" class="personal-center" to="/me">
           <p class="icon-little"></p>
            <p class="icon-text">我</p>
        </router-link>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    methods:{
        toMe(){
            if(!this.curCount){
                this.$alert('请登录后访问！').then(() =>{
                    this.$router.push({path: '/login'});
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                this.$router.push({path: '/me'})
            }
        }
    },
    computed:{
        ...mapGetters(['curCount'])
    }
}
</script>

<style lang="scss" scoped>
.footer{
    display: flex;
    height: px2rem(90);
    // height:  100%;
    flex-direction: row;
    box-sizing: border-box;
    padding-top: px2rem(3);
    background-color: #fff;
    z-index: 100;
    >div{
        flex: 1;
        .icon-little{
            width: px2rem(42);
            height: px2rem(42);
            margin: 0 auto;
            margin-top:  px2rem(5);
            background-image: url(./img/sprite-home@2x.png);
            background-repeat: no-repeat;
            background-size: px2rem(444);
        }
        .icon-text{
            text-align: center;
            @include font-dpr(22px);
            margin-top:  px2rem(5);
        }
        &.home{
            .icon-little{
                background-position: px2rem(-46) px2rem(-6); 
            }
        }
         &.investment{
            .icon-little{
                background-position: px2rem(-140) px2rem(-5); 
            }
        }
         &.buy-car{
            .icon-little{
                background-position: px2rem(0) px2rem(-5); 
            }
        }
         &.personal-center{
            .icon-little{
                background-position: px2rem(-93) px2rem(-5); 
            }
        }
        &.router-link-active{
            .icon-little{
                background-position-y: px2rem(-53);
            }
        } 

    } 
}
</style>



