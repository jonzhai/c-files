<template>
    <div class="particulars">
        <div class="info" v-if="!isEmpty">
            <div class="item">
                <p class="title">汽车位置</p>
                <p class="content">{{pContent.carLocation}}</p>
            </div>
            <div class="item">
                <p class="title">汽车信息</p>
                <p class="content">{{pContent.carInfo}}</p>
            </div>
            <div class="item">
                <p class="title">项目介绍</p>
                <p class="content">{{pContent.introduction}}</p>
            </div>
        </div>
        <div class="noInfo" v-if="isEmpty">
            <div class="item">
                <p class="title">汽车信息</p>
                <div class="img-container">
                    <img  src="./img/noCarInfo@2x.png"  alt="没有相关信息">
                </div>
                <p class="desc">这里很干净，什么信息也没有~</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
      pContent: {
          type: Object,
          default: () =>{
              return {}
          }
      }  
    },
    data(){
        return {
            isEmpty: false
        }
    },
    created() {
        if(!this.pContent.carLocation && !this.pContent.carInfo && !this.pContent.introduction){
            this.isEmpty = true;
        }else{
            this.isEmpty = false;
        }
    },
    methods:{
        loadImage(){
            this.$emit('loadImage')
        }
    },
    watch:{
        pContent(newVal){
            if(!newVal.carLocation && !newVal.carInfo  && !newVal.introduction){
                this.isEmpty = true;
            }else{
                this.isEmpty = false;
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.particulars{
    // flex-shrink: 0;
    // width: 100vw;
    box-sizing: border-box;
    padding: px2rem(28) px2rem(28) px2rem(88);
    .item{
        margin-bottom: px2rem(60);
        text-align: left;
        @include font-dpr(28px);
        .title{
            color: #333333;
            margin-bottom: px2rem(20);
            font-weight: 700;
        }
        .content{
            color:#666666;
            line-height: 1.4em;
        }
    }
    .noInfo{
        .img-container{
            width: px2rem(260);
            height: px2rem(190);
            margin: 0 auto;
        }
        .desc{
             @include font-dpr(28px);
             color: #999999;
             text-align: center;
        }
    }
}
</style>
