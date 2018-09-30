<template>
    <div class="activitys">
        <div class="item" v-for="(item,index) in activitys" :key="index">
            <img :src="item.image? photoIp+item.image.src : ''" alt="" class="img1">
            <p class="desc">{{item.title}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            photoIp: this.$photoIp,
            activitys: []
        }
    },
    created() {
        this.getActivitys();
    },
    methods:{
        getActivitys(){
            this.$axios.get('getActivitys').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.activitys = res.data.data.list;
                    }else{
                        this.myAlert(res.data.message);
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.activitys{
    .item{
        position: relative;
        margin-top: 40px;
        .desc{
            position: absolute;
            left: 0;
           right: 0;
            bottom:30px;
            color: #fff;
            padding: 0 10px;
            text-align: center;
            white-space: wrap;
            word-break: break-all;
        }
        img{
            display: block;
            width: 100%;
        }
    }
}
</style>


