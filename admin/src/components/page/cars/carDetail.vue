<template>
    <div class="product-detail">
            <div class="head">
                <div class="head-left">
                    <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
                    <span class="allProduct">全部车辆</span>
                    <!-- <button class="btn btn-primary lowerShelf" @click="toggleShelf">{{product.isPutStatus === 1 ? '下架该产品': "上架该产品" }}</button> -->
                </div>
                <div class="head-right">
                    <el-button type="primary" @click="toEdit">编辑车辆</el-button>
                </div>
            </div>
            <div class="content">
               <table>
                   <tr>
                       <th>车辆名称</th>
                       <th>销售类别</th>
                       <th>售价（万）</th>
                       <th>里程数</th>
                       <th>客服人员号码</th>
                       <th>客服热线号码</th>
                   </tr>
                   <tr>
                        <td>{{Car.title}}</td>
                        <td>{{Car.carType}}</td>
                        <td>{{Car.sellPrice}}</td>
                        <td>{{Car.mileage}}</td>
                        <td>{{Car.customerPhone}}</td>
                        <td>{{Car.customerHotPhone}}</td>
                   </tr>
                </table>
                <div class="pic-container">
                    <div class="img-wrapper" v-for="(photo,index) in Car.carPhoto" :key="index">
                        <img :src="Car.photoIp+photo.src" alt="" :title="photo.key">
                    </div>
                </div>
                <div class="Project-detaile">
                    <h2 class="title">汽车介绍：</h2>

                    <p class="indent2em">{{Car.carContent}}</p>
                </div>

            </div>
         
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import * as types from 'src/store/mutationTypes'
export default {
    beforeRouteEnter (to, from, next) {
        if(!to.query.id){
            next('/carsList');
        }
        next();
       
    },
    data(){
        return {
            Car: {
                carPhoto: []
            }
        }
    },
    created(){
        this.id = this.$route.query.id;
        // this.setCurProduct(this.id);
        this._getDetail(this.id);
    },
    mounted(){
    },
    methods:{
        toEdit(){
            //params必须通过name来导航
            this.$router.push({name: `editCar`,params:{car: this.Car}, query:{id: this.id}})
        },
        goBack(){
           this.$router.push({path:'/carsList',query:{curPage: this.$route.query.curPage}})
       },
        toggleShelf(){
              this.$axios.get('/updatePutStatus',{
                params:{
                   carId: this.id,
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        // window.location.reload();
                         this._getDetail(this.id);
                         if(this.product.isPutStatus === 1){
                             this.sToast('下架成功');
                         }else{
                             this.sToast('上架成功');
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
             this.$axios.get('/getSellCarDetailByCarId',{
                params:{
                   carId: id
                }
            }).then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.Car = res.data.data;
                        // console.log(res)
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
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
            .back-icon{
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
            border-collapse:collapse;
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
        .indent2em{
            text-indent: 2em;
        }
    }
    .Project-detaile{
        line-height: 1.5em;
        .title{
            margin-bottom: 10px;
        }
    }
 
}
</style>
