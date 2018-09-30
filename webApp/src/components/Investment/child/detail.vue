
<template>
    <div class="detail">
        <div class="carNum">车架号：{{productItem.carframNum}}</div>
        <div class="alreadyLog" v-if="curCount">
            <p class="invoice-title">发票信息</p>
            <p class="invoice-money">
                <span>发票金额</span>
                <span>￥{{productItem.invoicePrice}}</span>
            </p>
            <p class="invoice-date">
                <span>开票日期</span>
                <span>{{productItem.invoiceDate | toDate2}}</span>
            </p>
            <div class="vehicle-certificate-container">
                <p class="title">车辆合格证</p>
                <img class="vehicle-certificate" @load="loadImage" v-for="(item,index) in productItem.carCertified" :src="photoIp+item.src" alt="" :key="index">
            </div>
        </div>
        <div class="notLog" v-if="!curCount">
            <p class="title">发票信息</p>
            <img class="nologin"  src="./img/nologin@2x.png" alt="未登录" @click="toLogin">

        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    props:{
        productItem: {
            type: Object,
            default: () =>{
                return {};
            }
        },
        photoIp:{
            type: String
        } 
    },
    // created(){
    // },
    data(){
        return {
        }
    },
    computed:{
   
        ...mapGetters(['curCount'])
    },
    methods:{
        toLogin(){
            this.$router.push({path: '/login'})
        },
        loadImage(){
            this.$emit('loadImage')
        }
    }
}
</script>


<style lang="scss" scoped>
.detail{
    flex-shrink: 0;
    width: 100vw;
    box-sizing: border-box;
    
    padding: 0 px2rem(30);
    .carNum{
        box-sizing: border-box;
        height: px2rem(96);
        border-bottom: 1px solid #ededed;
        display: flex;
        align-items: center;
        @include font-dpr(28px);
        color: #333333;
    }
    .alreadyLog{
        >p{
            height: px2rem(90);
            display: flex;
            justify-content: space-between;
            align-items: center;
            @include font-dpr(28px);
            color: #333333;
            &.invoice-date{
                border-bottom: 1px solid #ededed;
            }
        }
        .invoice-title{
            @include font-dpr(28px);
            font-weight: 700;
            color: #333333; 
        }
        .vehicle-certificate-container{
            .title{
                @include font-dpr(28px);
                color: #333333;
                font-weight: 700;
                padding: px2rem(30) 0 px2rem(20);
            }
            .vehicle-certificate{
                display: block;
                width: 100%;
                margin-bottom: px2rem(10);
            }
        } 
    }
    .notLog{
        .title{
            color:#333333;
            font-weight: 700;
             @include font-dpr(28px);
             margin: px2rem(30) 0 px2rem(16);
        }
        .nologin{
            display: block;
            width: 100%;
        }
    }
   
}
</style>

