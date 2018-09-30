<template>
    <div class="myInfo">
        <div class="head base">
            <img class="user-img" :src="!perseonInfo.image.src ? defalutUserImg : perseonInfo.photoIp+perseonInfo.image.src"  alt="">
            <label  class="input-container" @click="showCopper=true">
                设置头像<span class="icon iconfont icon-right1"></span>
                <!-- <input id="uploadImg" type="file" accept="image/*" ref="uploadImg"/> -->
            </label>
        </div>
        <div class="list-container">
            <div class="base">
                <p class="title">昵称</p>
                <p>{{perseonInfo.nickName}}<span class="edit" @click="editNickName">修改</span><span class="icon iconfont icon-right1"></span></p>
            </div>
             <div class="base">
                <p class="title">绑定手机</p>
                <p>{{perseonInfo.phone}}<span class="icon iconfont icon-right1" ></span></p>
            </div>
             <div class="base">
                <p class="title">实名认证</p>
                <p>
                    <span v-if="perseonInfo.isAuthentication">已认证</span>
                    <router-link :to="{path:'/realNameCertification'}" tag="span" v-if="!perseonInfo.isAuthentication">点击认证</router-link>
                    <!-- <span v-if="!perseonInfo.isAuthentication">点击认证</span> -->
                    <span class="icon iconfont icon-right1" ></span>
                </p>
            </div>
            <div class="base">
                <p class="title">交易密码</p>
                <!-- <router-link tag="p" :to="{path: '/myInfoCenter/addTransitionPass'}" v-if="!perseonInfo.isTransactionPwd">设置密码<span class="icon iconfont icon-right1" ></span></router-link>
                <router-link tag="p" :to="{path: '/myInfoCenter/resetTransitionPass'}" v-if="perseonInfo.isTransactionPwd">修改密码<span class="icon iconfont icon-right1" ></span></router-link> -->
                <p v-if="!perseonInfo.isTransactionPwd" @click="operateTransitionPass('set_pay_password')">设置密码<span class="icon iconfont icon-right1" ></span></p>
                <p v-if="perseonInfo.isTransactionPwd" @click="operateTransitionPass('modify_pay_password')">修改密码<span class="icon iconfont icon-right1" ></span></p>
            </div>
            <div class="base">
                <p class="title">忘记交易密码</p>
                <p><span class="icon iconfont icon-right1" ></span></p>
            </div>
        </div>
        <router-view></router-view>
        <div class="editNickName" v-if="showEditNick">
            <input type="text" class="editIpt" ref="editIpt" v-model="nickName" autofocus>
            <span class="confirmBtn" @click="confirmEdit">确定</span>
        </div>
         <!-- <div class="toast-container" v-if="showToast">
            <toast :descText="descText" @close="closeToast" :delay="2000"></toast>
        </div> -->
        <div class="loading-container" v-show="showLoading">
            <loading desc="正在上传..."></loading>
        </div>
        <ImageCopper v-show="showCopper" @closeCopper="closeCopper"></ImageCopper>
    </div>
</template>
<script>
// import {ToastMixin} from 'src/assets/js/mixin';
// import Toast from 'src/base/toast/toast_login';
import Qs from 'qs';
import {mapGetters,mapMutations} from 'vuex';
import Loading from 'src/base/loading/loading';
// import Lrz from 'lrz'; 
import ImageCopper from 'src/base/copperImage/copperImage';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "个人信息";
        next();
    },    
    // mixins:[ToastMixin],
    data(){
        return{
            //默认用户图片
            defalutUserImg: require('./img/userDefault.png'),
            //是否显示编辑昵称
            showEditNick: false,
            //个人信息
            perseonInfo:{
                image:{}
            },
            //昵称
            nickName: '',
            showLoading: false,
            showCopper: false
        }
    },
    created(){
        //获取用户信息
        this._getUserInfo();
    },
    mounted(){
        //初始化上传用户头像
        // this._initUploadImg();
    },
    methods:{
        editNickName(){
            this.showEditNick = !this.showEditNick;
            if(this.showEditNick){
                setTimeout(()=>{
                    this.$refs.editIpt.focus();
                },20)
            }
        },
        confirmEdit(){
            let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,10}$/;
            if(!reg.test(this.nickName)){
                this.$toast('昵称长度1到10位,只能包括汉字，数字，字母和下划线');
                return;
            }
            this.showEditNick = false;
            let  params =  Qs.stringify({
                 nickName:  this.nickName,
             });
            this.$axios.post('/app/updateNickeName',params).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                           this.perseonInfo.nickName = this.nickName;
                            this.$toast("修改成功！");
                           
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })
        },
        closeCopper(image){
            this.showCopper = false;
            if(image){
                this.uploadImg(image);
            }
        },
        ...mapMutations({
            setTpass: 'SET_TRANSITIONPASS'
        }),
        uploadImg(image){
        
            this.showLoading = true;
            let me =  this,
                formData = new FormData();
            //先执行图片压缩
            // Lrz(file)
            // .then(function (rst) {
                // 处理成功会执行
                formData.append('file' , image);
            
                me.$axios.post('/app/imgUpload', formData,{
                    headers:{
                        'Content-Type':'multipart/form-data'
                    }
                }).then(function (response) {
                    // debugger
                    me.showLoading = false;
                    if(response.data.code > 0){
                        me._getUserInfo().then(()=>{
                                me.$toast('上传成功！');
                        }).catch((err)=>{
                                console.log(err)    
                        })
                    }else{
                        me.$alert(response.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                        // me.$toast(response.data.message);
                    }
                }).catch(function (error) {
                    console.log(error)
                });
            // })
             
            
        },
        operateTransitionPass(operateType){
            let params =  Qs.stringify({
                returnUrl: window.location.href,
                serviceName: operateType
             });
            this.$axios.post('/app/tradePwd',params).then((res) =>{
                   if(res.status === 200){
                       if(res.data.code > 0){
                           let redirect_url = res.data.data.redirect_url;
                            if(redirect_url){
                                window.location.href = redirect_url;
                            }
                       }else{
                            this.$alert(res.data.message).then((msg)=>{
                            }).catch((err) =>{
                                console.log(err)
                            })
                            return;
                       }
                   } 

            }).catch((err) =>{
                console.log(err)
            })


        },
        // _initUploadImg(){
        //     let me = this;
        //     this.$refs.uploadImg.onchange = function(){
        //         me.showLoading = true;
        //         let file = this.files[0],
        //             formData = new FormData();
        //         //先执行图片压缩
        //         Lrz(file)
        //         .then(function (rst) {
        //             // 处理成功会执行
        //             formData.append('file' , rst.file);
        //             me.$axios.post('/app/imgUpload', formData,{
        //                 headers:{
        //                     'Content-Type':'multipart/form-data'
        //                 }
        //             }).then(function (response) {
        //                 // debugger
        //                 me.showLoading = false;
        //                 if(response.data.code > 0){
        //                     me._getUserInfo().then(()=>{
        //                             me.$toast('上传成功！');
        //                     }).catch((err)=>{
        //                             console.log(err)    
        //                     })
        //                 }else{
        //                     me.$toast(response.data.message);
        //                 }
        //             }).catch(function (error) {
        //                 console.log(error)
        //             });
        //         })
        //         .catch(function (err) {
        //             // 处理失败会执行
        //             console.log(err)
        //         })
               
        //     }
            
        // },
        _getUserInfo(){
            return new Promise((resolve,reject)=>{
                this.$axios.get('/app/getUserBaseInfo').then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.perseonInfo = res.data.data;
                            this.setTpass(this.perseonInfo.isTransactionPwd );
                            resolve();
                        }else{
                            this.$toast(res.data.message);
                            reject();
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
            })
         
        }

        

    },
    computed:{
        ...mapGetters(['isSetTransitionPass'])
    },
    watch:{
      isSetTransitionPass(newVal){
          if(newVal){
               this._getUserInfo();
          }
      }  
    },
    components:{
        Loading,
        ImageCopper
    }
}
</script>

<style lang="scss" scoped>
.myInfo{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f5f5f5;
    color: #999999;
    @include font-dpr(24px);
    .base{
        height: px2rem(96);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 px2rem(36) 0 px2rem(31);
        .iconfont{
            @include font-dpr(24px);
            margin-left: px2rem(18);
        }
        .title{
            color: #666666;
             @include font-dpr(28px);
        }

    }
    .head{
        background-color: #fff;
        margin-top: px2rem(21);
        height: px2rem(120);
   
        .user-img{
            height: px2rem(90);
            width: px2rem(90);
        }
        .input-container{
            position: relative;
            #uploadImg{
                position: absolute;
                opacity: 0;
            }
        }
    }

    .list-container{
        overflow: hidden;
        margin-top: px2rem(21);
        background-color: #fff;
        .edit{
            color: #5e93fc;
            margin-left: px2rem(20);
        }
        
    }
    .editNickName{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: px2rem(126);
        border-radius: px2rem(10) px2rem(10) 0 0;
        background-color: #fff;
        padding: 0 px2rem(36);
        display: flex;
        align-items: center;
        .editIpt{
            flex: 1;
            height:px2rem(66);
            background-color: #f5f5f5;
            border-radius:  px2rem(10);
            margin-right: px2rem(20);
        }
        .confirmBtn{
            flex-shrink: 0;
            height: px2rem(66);
            width: px2rem(120);
            background-color: #42bd55;
            color: #fff;
            text-align: center; 
            line-height: px2rem(66);
            border-radius:  px2rem(10);
            @include font-dpr(26px);
            
        }
    }
    .toast-container{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
    }
    .showLoading{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%,-50%,0);
    }
}
</style>

