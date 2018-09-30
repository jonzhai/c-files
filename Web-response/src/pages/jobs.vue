<template>
    <div class="jobs">
        <div class="banner">
            <img src="./img/jobs-banner.png" alt="">
        </div>
        <div class="desc">
            <p class="title">我们能给你什么</p>
            <p>法定双薪、年假、餐补、夜班补贴、员工活动、节日福利、系统的培训、完善的晋升空间。</p>
            <p>这只是我们能提供给你最基本的工作福利！我们能给你更多你想不到的！相信我们，我们将为您的职业生涯带来跨越式的发展！</p>
        </div>
        <div class="what-jobs">
            <p class="title">如果</p>
            <p class="subtitle">你 够有料 有态度 那就放马过来</p>
            <div class="content">
                <div class="item" v-for="(item,index) in jobs" :key="index" :style="{backgroundColor: color[index > 3 ? index % 4 : index ]}">{{item.name}}</div>     
            </div> 
        </div>
        <div class="bottom-banner">
            <div class="call">
                <img src="./img/phone_03.png" alt="">
                <span>13432174308(诗诗)</span>
            </div>
            <p>别打钱 打call啊！</p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            jobs: [],
            color:['#4ecdfb','#ff86ea','#f36198','#4ce39e']
        }
    },
    created() {
        this.getJobsList();
    },
    methods:{
          getJobsList(){
            this.$axios.get('getJobsList').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.jobs = res.data.data.list;
                    }else{
                        this.myAlert(res.data.message);
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
   .jobs{
     .banner{
        //  height: 386px;
         >img{
             display: block;
             width: 100%;
            //  height: 100%;
         }
     }
     .desc{
         height: 198px;
         background-color: #f5f5f5;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         font-size: 14px;
         color: #211f21;
         >p{
             margin-bottom: 10px; 
         }
         .title{
              font-size: 18px;
              margin-bottom: 30px; 
         }
     }  
     .what-jobs{
         overflow: hidden;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         .title{
             color: #211f21;
             font-size: 3rem;
             margin-top: 50px; 
         }
         .subtitle{
             color: #211f21;
             font-size: 1.8rem; 
             margin-top: 10px; 
         }
         .content{
            // margin-top: 60px;
            width: 654px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
             .item{
                 width: 185px;
                 margin-right: 20px;
                 height: 44px;
                 flex-shrink: 0;
                 line-height: 44px;
                 text-align: center;
                 color: #fff;
                 margin-top: 26px;
             } 
         }

     }
     .bottom-banner{
         height: 210px;
         background: url(./img/jobs-bottom.png) no-repeat;
         background-size: cover; 
         overflow: hidden;
         .call{
             margin-top: 60px; 
             >img{
                 width: 24px;
                 vertical-align: middle;
                 margin-right: 10px;
             }
             
         }
         >p{
           margin-top: 18px;       
        }
     }
   } 
   @media screen and (max-width: 980px){
       .content{
           width: 100% !important;
       }
   }
</style>

