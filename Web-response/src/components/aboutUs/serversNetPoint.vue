<template>
    <div class="servers-point">
        <p class="title">远盈定制汽车联盟在中山市内预计建设{{points.length}}家分店，现已经投入营业的有：</p>
        <ul class="points">
            <li v-for="(item, index) in points" :key="index" class="point">
                <p class="title_01">{{item.shopName}}：</p>
                <p class="title_02">{{item.address}}</p>
                <p class="title_03">联系方式： {{item.phone}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import {numberConvertToUppercase} from '@/assets/js/utils';
export default {
    data(){
        return {
            points: []
        }
    },
    created() {
        this.getServiceStations();
    },
    methods:{
         getServiceStations(){
            this.$axios.get('getServiceStations').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.points = res.data.data.list;
                    }else{
                        this.myAlert(res.data.message);
                        return;
                    }
                } 
                this.loading = false;
            }).catch((err) =>{
                console.log(err)
            })
        },
    },
    filters:{
        transformNum(val){
            return numberConvertToUppercase()(val+1);
        }
    }
}
</script>
<style lang="scss" scoped>
.servers-point{
    text-align: left;
    font-size: 0.8rem;
    color: #323131;
    .title{
        padding-bottom: 20px;
    }
    .points{
        margin-bottom: 50px;
    }
    .point{
        margin-top: 20px; 
        .title_01{
            margin-bottom: 20px;  
        }
        .title_02,.title_03{
           color: #7e7e7e;
        }
    }
}
</style>


