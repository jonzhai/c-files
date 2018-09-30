<template>
    <div class="product-detail"  v-loading="loading">
            <div class="head">
                <div class="head-left">
                   <i class="el-icon-arrow-left back" @click="goBack"></i>
                    <span class="allProduct">全部产品</span>
                     <el-button type="primary" @click="toEdit">编辑此产品</el-button>
                    <!-- <button class="btn btn-primary lowerShelf" @click="toggleShelf">{{product.isPutStatus === 1 ? '下架该产品': "上架该产品" }}</button> -->
                </div>
                <div class="head-right">
                    <span class="publishTime">产品发布时间：{{product.createTime | toDate}}</span>
                </div>
            </div>
            <div class="content">
               <table>
                   <tr>
                       <th>产品编号</th>
                       <th>产品名称</th>
                       <th>众筹额度</th>
                       <th>众筹进度</th>
                       <th>投资周期</th>
                       <th>年化收益率</th>
                       <th>投资分类</th>
                       <th>状态</th>
                   </tr>
                   <tr>
                        <td>{{product.id}}</td>
                        <td>{{product.pName}}</td>
                        <td>{{product.crowdPrice}}</td>
                        <td>{{(1-product.remainCrowdPrice/product.crowdPrice) | toPrecent}}%</td>
                        <td>{{product.inversCycle}}</td>
                        <td>{{product.annualEarn | toPrecent}}% ~{{product.minAnnualEarn | toPrecent}}%</td>
                        <td>{{product.category.name}}</td>
                        <!-- <td>{{product.cId}}</td> -->
                       <td class="text-primary">{{product.crowdStatus === -1 ? '待售中' : product.crowdStatus === 0 ? '销售中' : '众筹完毕'}}</td>
                   </tr>
                </table>
                <div class="pic-container">
                    <div class="img-wrapper" v-for="(photo,index) in product.photo" :key="index">
                        <img :src="product.photoIp+photo.src" alt="" :title="photo.key">
                    </div>
                </div>
                <div class="Project-detaile">
                    <h2 class="title">详情</h2>

                    <h4>车辆位置：</h4>
                    <p class="indent2em">{{product.pContent.carLocation}}</p>

                    
                    <h4>汽车信息：</h4>
                    <p class="indent2em">{{product.pContent.carInfo}}</p>

                    <h4>项目介绍：</h4>
                    <p class="indent2em">{{product.pContent.introduction}}</p>
                </div>

                <div class="Project-detailed">
                    <h2 class="title">明细</h2>

                    <h4>车架号：</h4>
                    <p class="indent2em">{{product.productItem.carframNum}}</p>

                    <h4>发票金额：</h4>
                    <p class="indent2em">{{product.productItem.invoicePrice}}</p>

                    <h4>开票日期：</h4>
                    <p class="indent2em">{{product.productItem.invoiceDate | toDate}}</p>
                    <h4>车辆合格证</h4>
                    <div class="pic-container">
                        <div class="img-wrapper" v-for="(photo,index) in product.productItem.carCertified" :key="index">
                            <img :src="product.photoIp+photo.src" alt="" :title="photo.key">
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import * as types from 'src/store/mutationTypes';
import {alertMixin} from 'src/assets/js/mixin'
export default {
    mixins: [alertMixin],
    beforeRouteEnter (to, from, next) {
        if(!to.query.id){
            next('/productList');
        }
        next();
       
    },
    data(){
        return {
            product: {
                pContent: {},
                productItem:{},
                category: {}
            },
            descText: '测试',
            loading: false
        }
    },
    created(){
        this.id = this.$route.query.id;
        this.setCurProduct(this.id);
        this._getDetail(this.id);
    },
    mounted(){
    },
    methods:{
        toEdit(){
            //params必须通过name来导航
            this.$router.push({name: `eidtProduct`,params:{product: this.product}, query:{id: this.id}})
            // console.log(this.product)
        },
        goBack(){
           this.$router.push({path:'/productList',query:{curPage: this.$route.query.curPage}})
       },
        toggleShelf(){
              this.$axios.get('/updatePutStatus',{
                params:{
                   id: this.id,
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        // window.location.reload();
                         this._getDetail(this.id);
                         if(this.product.isPutStatus === 1){
                             this.myAlert('下架成功');
                         }else{
                             this.myAlert('上架成功');
                         }
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })


        },
        _getDetail(id){
            this.loading = true;
             this.$axios.get('/getProductById',{
                params:{
                   id: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.product = res.data.data;
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
        // parsePhoto(str){
        //     // let firstCode = str.charCodeAt(0);  
        //     // if (firstCode < 0x20 || firstCode > 0x7f) {  
        //     //     console.log(JSON.parse(str.substring(1)))
        //     //     return JSON.parse(str.substring(1)); // 去除第一个字符  
        //     // } 
        //       console.log(JSON.parse(str))
        //     return JSON.parse(str); 
        // }
        ...mapActions({
            setCurProduct: 'setCurProduct'
        })
    },
    filters:{
        toDate(val){
            let date = new Date(val);
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().length > 1 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1) }-${date.getDate().toString().length > 1 ? date.getDate() : '0' + date.getDate()}`
        }
    },
    components:{
        // Toast
    }
}
</script>

<style lang="scss" scoped>
.product-detail{
    width: 100%;
    position: relative;
    padding: 0 10px;
    .head{
        height: 30px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .head-left{
            display: flex;
            .back{
                font-size: 32px;
                cursor: pointer;
            }
            .lowerShelf{
                margin-left: 20px;
            }
            .allProduct{
                width: 200px;
                border-bottom: 1px solid #000; 
            }
        }
        .head-right{
            margin-right: 30px;
        }
        
      
    }
    .content{
        margin-top: 20px;
        background-color: #fff;
        table{
            width: 100%;
            border-collapse: collapse; 
            th{
                background-color: #eee;
            }
            th,td{
                text-align: center;
                // width: 4em;
                border: 1px solid #000;
                font-size: 16px;
                padding: 5px 16px;
            }
        }
        .pic-container{
            height: 150px;
            display: flex;
            margin-top:30px;
            .img-wrapper{
                width: 120px;
                height: 120px;
                margin-right: 10px;
                border: 1px dashed #999;
                border-radius: 10px; 
                position: relative;
                display: flex;
                align-items: center;
                img{
                    width: 100%;
                    max-height: 100%;
                }
                .del-icon{
                    display: none;
                    position: absolute;
                    right: 0;
                    top: 0;
                    transform: translate3d(50%,-50%,0);
                    color: #f00;
                    font-size: 20px;
                    cursor: pointer;
                }
                &:hover .del-icon{
                    display: block;
                }


            }
            .add-img{
               position: relative;
               label{
                   position: absolute;
                   left: 0;
                   top: 0;
                   bottom: 0;
                   right: 0;
                   z-index: 100;
                   display: flex;
                   justify-content: center;
                   align-items: center;
                   span{
                       font-size: 64px;
                   }
               }
               input{
                   opacity: 0;
               }
            }
        }
        .Project-detaile,.Project-detailed{
            line-height: 1.5em;
            .title{
                margin-top: 10px;
                margin-bottom: 10px;
            }
            h4{
                margin-top: 10px;
            }

        }
        .indent2em{
            text-indent: 2em;
        }
    }
    .toast-container{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
    }
}
</style>
