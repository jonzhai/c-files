<template>
     <transition name="fade">
        <div  class="toast">
            <p>{{descText}}</p>
        </div>
   </transition>
</template> 
<script>
export default {
    props:{
        descText:{
            type:String,
            required: true
        },
        delay:{
            type: Number,
            default: 1000
        }
    },
    mounted(){
        setTimeout(()=>{
            this.$emit('close')
        },this.delay)
    }
}
</script>

 <style lang="scss" scoped>
    
    .toast{
        width:  px2rem(363);
        height:  px2rem(144);
        background-color: #1d1d1d;
        border-radius:  px2rem(20);
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: px2rem(10) px2rem(20);
        overflow: hidden;
        z-index: 900;
        p{
            color:#fff;
             @include font-dpr(26px);
        }
    
    }
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
</style>

