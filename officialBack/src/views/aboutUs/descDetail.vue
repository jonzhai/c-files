<template>
    <div class="desc-detail">
        <img :src="src" alt="" class="desc-img">
        <p class="desc">{{content}}</p>
    </div>
</template>
<script>
export default {
    data(){
        return {
            src: '',
            content: ''
        }
    },
    created() {
        this.getAboutDetail();
    },
    methods:{
        getAboutDetail(){
            this.$axios.get('/getAboutDetail ').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        if(res.data.data.image){
                            this.src = this.$photoIp  +res.data.data.image.src;
                        }
                        this.content = res.data.data.content;
                    }else{
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
    .desc-detail{
        overflow: hidden;
        margin-top: 50px;
        .desc-img{
            display: block;
            width: 500px;
        }
        .desc{
            line-height: 1.5em;
             width: 500px;
        }
    }
</style>


