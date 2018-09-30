<template>
     <transition name="fade">
        <div  class="toast">
            <div class="content">
                <p>{{title}}</p>
            </div>
        </div>
   </transition>
</template> 
<script>
export default {
    props:{
        title:{
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
    .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    }
    .toast{
        position: absolute;
        top:50%;
        width: 100%;
        padding: 0 30px;
        transform: translateY(-50%);
        height: 3rem;
        .content{
            background-color: rgba(0,0,0,0.5);
            width: 100%;
            height: 100%;
            border-radius: 3px; 
            p{
                width: 100%;
                height: 100%;
                line-height: 3rem;
                text-align: center;
                color:#fff;
            }
        }
        
    }
</style>

