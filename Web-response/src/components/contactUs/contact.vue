<template>
    <div class="contact-us">
        <div class="container">
            <div class="left">
                <h2>联系我们</h2>
                <div class="weixin">
                    <img src="../../assets/img/wx.png" alt="" class="brand">
                    关注官方微信<br/>获得更多资讯
                </div>
                <div class="weibo" >
                    <img src="../../assets/img/wb.png" alt="" class="brand">
                    关注官方微博<br/>获得更多资讯
                </div>
            </div>
            <div class="middle">
                <div class="email">
                    <img src="../../assets/img/mail.png" alt="" class="brand">
                    E-mail：advice@yeahworld.com
                </div>
                <div class="adress">
                    <img src="../../assets/img/address.png" alt="" class="brand">
                    地址：广东省广州市海珠区新港东路琶洲新村
                </div>
            </div>
            <div class="right">
                <p class="title">business</p>
                <p>CPS、CPA and other cooperation in China</p>
                <p>Media cooperation</p>
                <p>Global market business</p>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
 .contact-us{
        height: 210px;
        background-color: #F0F0F0;
        .container{
            width: $fixedWidth;
            margin: 0 auto;
            display: flex;
            height: 100%;
            justify-content: space-between;
            .left{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                h2{
                    border-left: 3px solid #2E93D6;
                }
                .weixin,.weibo{
                    display: flex;
                    align-items: center;
                    img{
                        float: left;
                        margin-right: 10px;
                    }
                }
            }
            .middle{
                display: flex;
                flex-direction: column;
                justify-content: center;
                >div{
                    display: flex;
                    align-items: center;
                    img{
                        float: left;
                        margin-right: 10px;
                    }
                }
                .email{
                    margin-top: 50px;
                }
                .adress{
                    margin-top: 50px;
                }
            }
            .right{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                text-align: left;
                .title{
                    color: #2E93D6;
                    font-weight: bold;
                    margin-top: 30px;
                }
            }
        }
    }
</style>

