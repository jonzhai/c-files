<template>
    <scroll class="reward-container">
        <ul class="list-container">
            <li class="list-item">
               <base-reward :ratio="12.00" :ValidityTime="new Date().getTime()" :cardType="1"></base-reward>
            </li>
        </ul>
    </scroll>
</template>
<script>
import Scroll from 'src/base/scroll/scroll';
import BaseReward from './baseReward';

export default {
    components:{
        Scroll,
        BaseReward
    }    
}
</script>

<style lang="scss" scoped>
    .reward-container{
        position: absolute;
        left: 0;
        right: 0;
        top: px2rem(89);
        bottom: 0;
        background-color: #f5f5f5;
        padding: 0  px2rem(30);
        .list-container{
           .list-item{
                overflow: hidden;
                margin-top:  px2rem(20);
           } 
        }
    }
</style>

