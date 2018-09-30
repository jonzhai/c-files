<template>
        <ul class="ipt-group" ref="iptGroup">
            <li><input type="text" class="ipt" data-index="0" v-model="firstW" :value="firstV"></li>
            <li><input type="text" class="ipt" data-index="1" v-model="secondW" :value="secondV"></li>
            <li><input type="text" class="ipt" data-index="2" v-model="thirdW" :value="thirdV"></li>
            <li><input type="text" class="ipt" data-index="3" v-model="fourthW" :value="fourthV"></li>
            <li><input type="text" class="ipt" data-index="4" v-model="fiveW" :value="fiveV"></li>
            <li><input type="text" class="ipt" data-index="5" v-model="sixW" :value="sixV"></li>
        </ul>
</template>
<script>
export default {
    data(){
        return {
            firstW: '',
            secondW: '',
            thirdW: '',
            fourthW: '',
            fiveW: '',
            sixW: ''
        }
    },
    mounted(){
        this._initInputEvent();
    },
    computed:{
        firstV(){
            return this.firstW.substr(0,1);
        },
        secondV(){
            return this.secondW.substr(0,1);
        },
        thirdV(){
            return this.thirdW.substr(0,1);
        },
        fourthV(){
            return this.fourthW.substr(0,1);
        },
        fiveV(){
            return this.fiveW.substr(0,1);
        },
        sixV(){
             return this.sixW.substr(0,1);
        }

    },
    methods:{
        _initInputEvent(){
            let me = this;
            this.$refs.iptGroup.oninput=function(e){
                if(this.checkOk){
                    me.$emit('ok',''+this.firstV+this.secondV+this.thirdV+this.fourthV+this.fiveV+this.sixV);
                    return;
                }
                let et = e.target,
                    curIndex = parseInt(getData(et,'index'));
              
                if(curIndex >= 5){
                    et.blur(); 
                    return
                };
                
                me.$refs.iptGroup.children[curIndex+1].children[0].focus();
                et.value = et.value.substr(0,1);
            }
        },
        checkOk(){
           if( this.firstV.length === 1 
              && this.secondV.length === 1
              && this.thirdV.length === 1
              && this.fourthV.length === 1
              && this.fiveV.length === 1
              && this.sixV.length === 1
           ){
               return true ;
           }else{
               return true;
           }
        }

    }
}
</script>

<style lang="scss" scoped>
 .ipt-group{
    display: flex;
    justify-content: center;
    .ipt{
        height: px2rem(56); 
        width: px2rem(56); 
        margin-right: px2rem(16); 
        border: 2px solid #e1e1e1;
        text-align: center;
    }
}
</style>

