<template>
    <div class="news-detail">
        <div class="container">
            <div class="left-part">
                <h2 class="title">{{title}}</h2>
                <div class="writer-info">
                    <img :src="photoIp+userIcon.src" alt="" class="user-img">
                    <span class="user-name">{{userNickName}}</span>
                    <span class="publish-time">{{createTime | formatHours}}小时前</span>            
                </div>
                <div class="content" v-html="content">
                    
                </div>
                <!-- <div class="zan">
                    <p class="click-zan">赞</p>
                    <p class="zan-num">99</p>
                </div> -->
            </div>
            <div class="right-part">
                <p class="title">活动</p>
                <!-- <div class="item" v-for="(item,index) in activitys" :key="index">
                    <img :src="photoIp+item.image.src" alt="" class="img1">
                    <p class="desc">{{item.title}}</p>
                </div> -->
                <Activitys></Activitys>
            </div>

        </div>


    </div>
</template>
<script>
 import Activitys from '@/components/activitys/activitys';

export default {
    data(){
        return {
            photoIp: this.$photoIp,
            title: '',
            content: '',
            userNickName: '',
            activitys: [],
            
            cover: {},
            userIcon: {},
            createTime: new Date().getTime()
        }
    },
    created() {
        let id = this.$route.query.nId;
        if(id){
            this.getNewsDetail(id);
        }
        // this.getActivitys();
    },
    methods:{
        getNewsDetail(id){
             this.$axios.get('getNewsDetail',{
                params:{
                    id: id,
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        let {title,content,userNickName,userIcon,createTime} = res.data.data;
                        this.title = title;
                        this.content = content;
                        this.userNickName = userNickName;
                        this.userIcon = userIcon;
                        this.createTime = createTime;
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
                this.loading = false;
            }).catch((err) =>{
                console.log(err)
            })
        },
    },
    filters:{
        formatHours(val){
            let time = new Date().getTime();
            return Math.ceil((time-val)/(1*60*60*1000));
        }
    },
    components:{
        Activitys
    }
}
</script>

<style lang="scss" scoped>
    .news-detail{
        overflow: hidden;
        .container{

            width: $fixedWidth;
            margin: 0 auto;
            margin-top: 36px;
            display: flex;
            justify-content: space-between;
            min-height: 885px;
            .left-part{
                width: 744px;
                text-align: left;
                .title{
                    margin-bottom: 30px;
                } 
                .writer-info{
                    padding-bottom: 20px;
                    border-bottom: 1px solid #c2c2c2;
                    .user-img{
                        height: 30px;
                        width: 30px;
                        border-radius: 15px;
                        overflow: hidden;
                        vertical-align: middle;
                    }
                    >span{
                        display: inline-block;
                        // width: 84px;
                        text-align: center;
                        padding-left: 10px;
                    }
                    .user-name{
                        border-right: 2px solid #c2c2c2; 
                        padding: 0 10px;
                    }
                }
                .content{
                    margin-top: 30px;
                }
                .zan{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-top: 50px; 
                    .click-zan{
                        height: 50px;
                        width: 50px;
                        border-radius: 50%;
                        overflow: hidden;
                        background-color: #4ecdfa;
                        color: #fff;
                        text-align: center;
                        line-height: 50px;
                        margin-bottom: 10px;
                        cursor: pointer; 
                    }
                }
            }
             .right-part{
                width: 250px;
                .title{
                    height: 70px;
                    font-size: 30px;
                    color: #7e7e7e;
                    text-align: left;
                    line-height: 70px;
                    border-bottom: 6px solid #c2c2c2;
                    margin-bottom: 40px;
                }
                .item{
                    position: relative;
                    margin-top: 40px;
                    .desc{
                        position: absolute;
                        left: 0;
                        width: 100%;
                        bottom:30px;
                        color: #fff;
                        padding: 0 10px;
                        text-align: center;
                    }
                    img{
                        display: block;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>

