<template>
    <footer class="footer">
        <div class="container">
            <ul class="nav" > 
                <router-link tag="li" class="divide" :to="{path: '/home'}">首页</router-link>
                <router-link tag="li" class="divide" :to="{path: '/onlineCar'}">车盈在线</router-link>
                <router-link tag="li" class="divide" :to="{path: '/aboutUs'}">关于我们</router-link>
                <router-link tag="li"  :to="{path: '/jobs'}">人才招聘</router-link>
                <router-link tag="li"  :to="{path: '/aboutUs' ,query:{index: 2}}">服务网点</router-link>
            </ul>
            <div class="brand">
                <img src="./img/logo.png" alt="">
                远盈定制汽车联盟
            </div> 
            <p><a href="http://www.miitbeian.gov.cn" style="color:#828a92;">粤ICP备18110972号-1</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-if="false">粤网文 (2017) 9226-2329号</span></p>
        </div>
    </footer>
</template>
<style lang="scss" scoped>
    .footer{
        height: 150px;
        width: 100%;
        background-color: #232833;
        color: #fff;
        .container{
            height: 100%;
            margin: 0 auto;
            font-size: 14px;
            color: #828a92;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .nav{
                display: flex;
                >li{
                    position: relative;
                    width: 115px;
                    text-align: center;
                    border-right: 2px solid #666; 
                    cursor: pointer;
                    &:last-child{
                        border: none;
                    }
                }
            }
            .brand{
                margin: 10px 0 10px;
                img{
                    vertical-align: middle;
                    margin-right: 20px;
                    width: 50px;
                }
            }
        }
    }
    @media screen and (max-width: 980px){
        .nav{
            display: none !important;
        }
    }
</style>

