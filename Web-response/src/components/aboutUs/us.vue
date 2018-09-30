<template>
    <div class="us">
        {{content}}
    </div>
</template>
<script>
export default {
    data(){
        return {
            content: ''
        }
    },
    created() {
        this.getAboutUs();
    },
    methods:{
        getAboutUs(){
            this.$axios.get('getAbout').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.content = res.data.data.content;
                    }else{
                        alert(res.data.message);
                        return;
                    }
                } 
                this.loading = false;
            }).catch((err) =>{
                console.log(err)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .us{
        text-indent: 2em; 
        text-align: left;
        line-height: 1.5em;
        color: #323131; 
    }
</style>

