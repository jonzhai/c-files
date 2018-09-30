<template>
     <transition name="fade">
        <div class="toast">
            <div class="content">
                <span :class="iconType"></span>
            </div>
            <p>{{desc}}</p>
        </div>
   </transition>
</template> 
<script>
export default {
    props:{
        desc:{
            type:String,
            required: true
        },
        type:{
            type: Number,
            default: 0
        },
        delay:{
            type: Number,
            default: 1000
        }
    },
    data(){
        return {
            iconType: "glyphicon glyphicon-ok"
        }
    },
    mounted(){
        if(this.type === 0){
            this.iconType = "glyphicon glyphicon-ok";
        }else if(this.type === 1){
            this.iconType = "glyphicon glyphicon-remove";
        }
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
        width: px2rem(200);
        height: px2rem(200);
        border-radius:px2rem(10);
        background-color: rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column; 
        color:#fff;
        .content{
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5em;
        }
        p{
            text-align: center;
            font-size: 1.5em;
            line-height: 100%;
        }
    }
</style>

