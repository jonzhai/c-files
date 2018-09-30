<template>
    <div class="home">
        <div class="swiper-container"  ref="sliderWrapper">
            <swiper :swipData = "lists" v-if="lists.length > 0"></swiper>
        </div>
        <div class="container">
            <div class="head" :class="scrollY > 900 ? 'fixed': '' ">
                <div class="tabs">
                    <div class="tab" :class="{active: curIndex === 1}" @click="changeTabs(1)">新闻</div>
                    <div class="tab" :class="{active: curIndex === 2}" @click="changeTabs(2)">盈车帮</div>
                    <div class="empty"></div>
                </div>
                <div class="activity">
                    活动
                </div>
            </div>
            <div class="left-part">
                <ul class="news-list">
                    <li class="new-item" v-for="(item,index) in newsList" :key="index">
                        <div class="content" @click="toNewsDetail(item.id)">
                            <div class="left">
                                <img :src="item.cover ? photoIp+item.cover.src : ''" alt="">
                            </div>
                            <div class="right">
                                <div class="top">
                                    <h3 class="title">{{item.title}}</h3>
                                    <p class="detail">{{item.subTitle}} </p>
                                </div>
                                <div class="bottom">
                                    <img :src="photoIp+item.userIcon.src" alt="" class="user-img">
                                    <div class="desc">
                                        <span class="user-name">{{item.userNickName}}</span>
                                        <span class="publish-time">{{item.createTime | formatHours}}小时前</span>  
                                    </div>
                                              
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="more">
                        <div class="btn-more" @click="needMore" v-show="total === page">浏览更多</div>
                    </li>
                </ul>
            </div>
            <div class="right-part"  ref="ads">
                <Activitys></Activitys>
            </div>
        </div>
        <div class="video-container">
            <div class="content">
                <div class="video">
                    <img :src="aboutUsImg" alt="">
                </div>
                <div class="about-us">
                    <h3>关于我们</h3>
                    <p>{{description}}</p>
                </div>
            </div>
        </div>
        <div class="back-top d-none d-lg-block">
            <a href="#">
                <img src="./img/back_to_top.png"/>
            </a>
        </div>
    </div>
</template>
 <script>
 import Swiper from '@/components/swiper/swiper';
 import {getLeft} from '@/assets/js/dom';
 import Activitys from '@/components/activitys/activitys';
 export default {
     data(){
         return {
            lists: [ ],
            newsList: [ ],
            activitys: [],
            scrollY: 0,
            curIndex: 1,
            total: 1,
            page: 1,
            photoIp: this.$photoIp,
            description: '',
            aboutUsImg: require('./img/video.jpg')
         }
     },
     created() {
         this.getAdvertisments();
         this.getNewsList(1);
         this.getAboutUs();
     },
     mounted() {
         this.$nextTick(() => {
             window.onscroll = (e) => {
                this.scrollY = document.documentElement.scrollTop;
             }
         })
     },
     methods: {
         toNewsDetail(id){
             this.$router.push({path: '/newsDetail',query:{nId: id}})
         },
         getRight(ele){
            let tWidth = document.documentElement.clientWidth,
                adWidth = ele.offsetWidth,
                left = getLeft(ele);

            return tWidth -  adWidth -left;
         },
        changeTabs(index){
            this.curIndex = index;
            this.getNewsList(index,1);
        },
        getAdvertisments(){
            this.$axios.get('getAdvertisments').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.lists = res.data.data.list;
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
        getAboutUs(){
            this.$axios.get('getAbout').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.description = res.data.data.content;
                        if(res.data.data.image){
                            this.aboutUsImg = this.photoIp + res.data.data.image.src;
                        }
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
        getNewsList(typeId,pageNum){
            this.$axios.get('getNewsPage',{
                params:{
                    typeId: typeId,
                    pageSize: 10,
                    pageNumber: pageNum
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.newsList = res.data.data.list;
                        this.total = res.data.data.pages;
                        this.page = res.data.data.pageNum;
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
        needMore(){
            if(this.page < this.total){
                this.getNewsList(this.curIndex,this.page+1)
            }
        }

     },
     watch:{
     
     },
    components:{
        Swiper,
        Activitys
    },
    filters:{
        formatHours(val){
            let time = new Date().getTime();
            return Math.ceil((time-val)/(1*60*60*1000));
        }
    }
 }
 </script>
 <style lang="scss" scoped>
 .home{
    .swiper-container{
        // height: 805px;
        width: 100%;
        // margin-bottom: 50px;
    }
    .container{
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        min-height: 925px;
        width: $fixedWidth;
        display: flex;
        flex-wrap: wrap;
         justify-content: space-between;
        .head{
            height: 70px;
            display: flex;
            width: $fixedWidth;
            flex-shrink:0; 
            justify-content: space-between;
            &.fixed{
                position: fixed;
                top: 0;
                background-color: #fff;
            }
            .tabs{
                display: flex;
                font-size: 1.5rem;
                width: 744px;
                color: #7e7e7e;
                .tab{
                   width: 140px;
                   text-align: center;
                   line-height: 70px;
                    border-bottom: 6px solid #c2c2c2;
                    cursor: pointer;
                    &.active{
                        border-color: #4ecdfa; 
                        font-weight: bold;
                    }
                }
                .empty{
                    flex: 1;
                    border-bottom: 6px solid #c2c2c2;
                     
                }
            }
           .activity{
                width: 250px;
                box-sizing: border-box;
                height: 70px;
                font-size: 30px;
                color: #7e7e7e;
                text-align: left;
                line-height: 70px;
                border-bottom: 6px solid #c2c2c2;
                z-index: 10;
            }

        }
        .left-part{
            width: 744px;
            
            .news-list{
                .new-item{
                    height: 14.1rem;
                    border-bottom: 1px solid #c2c2c2; 
                    display: flex;
                    align-items: center;
                    .content{
                        height: 10.5rem;
                        flex: 1;
                        display: flex;
                        .left{
                            width: 15.4rem;
                            flex-shrink: 0;
                            margin-right: 36px; 
                            >img{
                                display: block;
                                height: 100%;
                                width: 100%;
                            }
                        }
                        .right{
                            flex: 1;
                            text-align: left;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            .top{
                                .title{
                                    margin-bottom: 10px;
                                }
                                .detail{
                                    line-height: 1.5em;
                                }
                            }
                            .bottom{
                                display: flex;
                                align-items: center;
                                .user-img{
                                    height: 30px;
                                    width: 30px;
                                    border-radius: 15px;
                                    overflow: hidden;
                                    vertical-align: middle;
                                }
                                .desc{
                                    display: flex;
                                    // flex-direction: column;
                                    padding-left: 10px;
                                }
                                .user-name{
                                    border-right: 2px solid #c2c2c2; 
                                    padding-right: 5px;
                                    margin-right: 5px;
                                    
                                }
                            }
                        }
                    }
                }
                .more{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
            
                    .btn-more{
                        height: 54px;
                        width: 192px;
                        border-radius:5px;
                        border: 1px solid #4ecdfa;
                        font-size: 16px;
                        color: #4ecdfa;
                        text-align: center;
                        line-height:  54px; 
                        margin-top: 32px;
                    }
                }
            }
        }
        .right-part{
            // position: absolute;
            // right: 0;
            // top: 70px;
            width: 250px;
            z-index: -1;    
            &.fixed{
                position: fixed;
                 right: none;
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
    .video-container{
        
        height: 22.3rem;
        width: 100%;
        background: url(./img/bottom_bg.png) no-repeat;
        background-size: cover;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        .content{
            width: $fixedWidth;
            height: 255px;
            overflow: hidden;
            display: flex;
            padding-bottom: 48px; 
            border-bottom: 1px solid #c2c2c2;

            .video{
                width: 40%;
                margin-right: 70px;
                display: flex;
                align-items: center;
                >img{
                    display: block;
                    max-height: 100%;
                    width: 100%;
                }
            }
            .about-us{
                flex: 1;
                color: #fff;
                font-size: 20px;
                >h3{
                    margin-top: 10px;
                }
                >p{
                    margin-top: 20px;
                    text-indent: 4em;
                    text-align: left;
                    color: #c2cbd3;
                    line-height: 1.8em;
                     font-size: 16px;
                }
            }
        }
    }
    .back-top{
        position: fixed;
        right: 50px;
        bottom: 580px;
       img{
           width: 38px;
       }
    }
   
 }
  @media screen and (max-width: 980px) {
     .home{
        .swiper-container{
        }
        .container{
            min-height: 0;
            width: 100%;
            .head{
                height: 50px;
                &.fixed{
                }
                .tabs{
                    .tab{
                        border-bottom: 2px solid #c2c2c2;
                        &.active{
                        }
                    }
                    .empty{
                         border-bottom: 2px solid #c2c2c2;
                    }
                }
            .activity{
                display: none;
                }

            }
            .left-part{
                width: 100%;
                .news-list{
                    .new-item{
                        .content{
                            .left{
                                 width: 185px;
                                 height: 126px;
                                 margin-right: 10px; 
                                >img{

                                }
                            }
                            .right{
                                .top{
                                    .title{
                                    }
                                    .detail{
                                    }
                                }
                                .bottom{
                                   .desc{
                                       flex-direction: column;
                                   }
                                   .user-name{
                                       border: none;
                                   }
                                }
                            }
                        }
                    }
                    .more{
                        .btn-more{
                        }
                    }
                }
            }
            .right-part{
                display: none;
            }
        }
        .video-container{
            .content{
                flex-direction: column;
                .video{
                    display: none;
                    >img{
                    }
                }
                .about-us{
                    margin-top: 80px;
                    
                    >h3{
                    }
                    >p{
                    }
                }
            }
        }
        .back-top{
            display: none;
            img{
            }
        }
    
    }  
  } 

 </style>
 
 