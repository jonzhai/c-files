<template>
    <div class="user-detail">
        <div class="head">
            <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
            <span class="allUser">全部用户</span>
            <img :src="user.image.src ? user.image.photoIp+user.image.src : require('./img/userDefault.png')" alt="" class="user-image">
        </div>
        <div class="content">
            <table>
                <tr>
                    <th>用户编号</th>
                    <th>用户名称</th>
                    <th>实名</th>
                    <th>手机号</th>
                    <th>累计投资</th>
                    <th>身份证</th>
                </tr>
                <tr>
                    <td>{{user.id}}</td>
                    <td>{{user.nickName}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.phone}}</td>
                    <td>{{user.investTotalPrice}}</td>
                    <td >{{user.idCard}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import {alertMixin} from 'src/assets/js/mixin';
export default {
    mixins: [alertMixin],
    data(){
        return {
            user:{
               image:{src: ''} 
            },
            maxPage: 10,
            pageList:[1,2,3,4,5],
            curPage: 0,
        }
    },
    created(){
        this.userId = this.$route.query.id;
        this._getUserInfo( this.userId);
    },

    methods:{
       goBack(){
           this.$router.push({path: '/userList',query:{curPage: this.$route.query.curPage}});
       },
        _getUserInfo(userId){
             this.$axios.get('/getUserById',{
                params:{
                   id: userId
                }
            }).then((res) =>{
                // console.log(res)
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.user = res.data.data
                    }else{
                        this.myAlert(res.data.message);
                    }
                } 
            }).catch((err) =>{
                console.log(e)
            })
        }
    }
   
}
</script>

<style lang="scss" scoped>
.user-detail{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 20px;
    .head{
        height: 30px;
        display: flex;
        position: relative;
        .back-icon{
            font-size: 32px;
            cursor: pointer;
        }
        .allUser{
            height: 100%;
            width: 200px;
            border-bottom: 1px solid #000; 
        }
        .user-image{
            position: absolute;
            right: 20px;
            width: 60px;
            height: 60px;
            border: 1px solid #fff;
            border-radius: 30px;  

        }
    }
    .content{
        margin-top: 40px;
        min-height: 700px;
        background-color: #fff;
        table{
            // width: 100%;
            border-collapse:collapse; 
            th,td{
                text-align: center;
                // width: 4em;
                border: 1px solid #000;
                font-size: 16px;
                padding: 5px 30px;
            }
        }
    }
}
</style>
