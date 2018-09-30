<template>
    <div class="add-bank-card">
        <div class="input-group">
            <label  class="input_label">银行</label>
            <select v-model="bankCode" class="select">
                <option v-for="(item,index) in banksList" :key="index" :value="item.code">{{item.name}}</option>
            </select>
            <span class="icon iconfont icon-arrow-down"></span>
        </div>
        <div class="input-group">
            <label for="bankAccountNo " class="input_label">卡号</label>
            <input type="text" id="bankAccountNo" class="input" placeholder="请输入银行卡号" v-model="bankAccountNo" autocomplete="off"> 
        </div>
     
        <div class="input-group">
            <label  class="input_label">选择省份</label>
            <select v-model="province" class="select" >
                <option  v-for="(item,index) in provincesList" :key="index" :value="item">{{item.name}}</option>
            </select>
            <span class="icon iconfont icon-arrow-down"></span>
        </div>
        <div class="input-group">
            <label  class="input_label">选择城市</label>
            <select  v-model="city" class="select">
                <option  v-for="(item,index) in citysList" :key="index" :value="item.name">{{item.name}}</option>
            </select>
            <span class="icon iconfont icon-arrow-down"></span>
        </div>
        <div class="input-group">
            <label for="phone " class="input_label">手机</label>
            <input type="text" id="phone " class="input" placeholder="请输入银行预留手机号" v-model="phone " autocomplete="off">
        </div>
        <div class="confirm-container">
            <div class="confirm-btn" :class="{active: isReady}" @click="bindCard">确定</div>
        </div>
        <div class="loading-container" v-show="showLoading">
            <loading desc="请等待..."></loading>
        </div>
        <transition name="fade">
            <EnterPass v-if="showPass" @newPass="getNewPass" desc="请输入短信验证码"></EnterPass>
        </transition>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import Loading from 'src/base/loading/loading';
import EnterPass from 'src/base/enterPass/enterPass'; 
import Qs from 'qs';
import Md5 from 'md5';
export default {
    beforeRouteEnter: (to, from, next) => {
        document.title = "添加银行卡";
        next();
    },
    data(){
        return {
            bankCode : '',
            bankAccountNo : '',
            province: '',
            city: '',
            phone : '',
            banksList: [],
            provincesList: [],
            citysList: [],
            showPass: false,
            ticket: '',
            showLoading: ''
        }
    },
    created() {
        this._getBanks();
        this._getProvinces();
    },
     computed:{
        isReady(){
            return !!this.bankCode && /^\d{15,20}$/.test(this.bankAccountNo) && !!this.province && !!this.city &&  /^1\d{10}$/.test(this.phone)
        },
        ...mapGetters(['prevRouter'])
    },
    methods:{
        bindCard(){
            if(!this.bankCode){
                this.$toast('请选择一家银行！');
                return;
            }else if(!/^\d{15,20}$/.test(this.bankAccountNo)) {
                this.$toast('银行卡号不正确！');
                return;
            }else if(!this.province) {
                this.$toast('请选择省份！');
                return;
            }else if(!this.city) {
                this.$toast('请选择城市！');
                return;
            }else if(!/^1\d{10}$/.test(this.phone)) {
                this.$toast('请输入正确手机号！');
                return;
            }
            this.showLoading = true;
            let  params =  Qs.stringify({
                 bankCode :  this.bankCode ,
                 bankAccountNo :  this.bankAccountNo  ,
                 phone  :  this.phone  ,
                 province  :  this.province.name,
                 city  :  this.city 
             });
            this.$axios.post('/app/bindBankCard',params).then((res) =>{
                if(res.status === 200){
                    this.showLoading = false;
                    if(res.data.code > 0){
                        this.showPass = true;
                        this.ticket = res.data.data.ticket;
                        // setTimeout(() => {
                        //     this.$router.replace({path: '/myBankCards'});
                        // },500)
                    }else if(res.data.code === -2){
                        this.$alert('请实名认证后绑卡！').then(() => {
                            this.$router.replace({path: '/realNameCertification'});
                        }).catch((err) => {
                            console.log(err)
                        })
                    }else{
                        this.$toast(res.data.message);
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        getNewPass(pass){
             if(!pass){
                this.showPass = false;
                return;
            }
             let  params =  Qs.stringify({
                ticket  :  this.ticket ,
                code : pass
             });
              this.$axios.post('/app/bindCardAdvance',params).then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.showPass = false;
                        this.$toast('绑定成功！');
                        setTimeout(()=>{
                            this.$router.replace({path: '/myBankCards'});
                        },500)
                    }else{
                        this.$alert(res.data.message).then(()=>{

                        }).catch(()=>{})
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _getBanks(){
            this.$axios.get('/app/getBank').then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                         this.banksList = res.data.data.list;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                           this.$router.replace({path: '/realNameCertification'});
                        }).catch(()=>{})
                    }else{
                        this.$toast(res.data.message)
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
         _getProvinces(){
            this.$axios.get('/area/getAllProvince ').then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                         this.provincesList = res.data.data;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                        }).catch(()=>{})
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        _getCitys(provinceId){
            this.$axios.get('/area/getCityByProvinceId',{
                params:{
                    provinceId : provinceId
                }
            }).then((res) => {
                if(res.status === 200){
                    if(res.data.code > 0){
                         this.citysList = res.data.data;
                    }else if(res.data.code === -2){
                        this.$alert(res.data.message).then(()=>{
                        }).catch(()=>{})
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
        toggleAgree(){
            this.isAgree = !this.isAgree;
        },
        ...mapActions(['LOGIN']),
      

    },
    components:{
        EnterPass,
        Loading
    },
    watch:{
        province(newVal){
            this._getCitys(newVal.provinceId);
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-bank-card{
        background: #f5f5f5;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        input:-webkit-autofill{
            background: #fff;
        }
        .input-group{
            background: #fff;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            height: px2rem(96);
            margin-bottom:  px2rem(17);
            overflow: hidden;
            padding: 0 px2rem(30);
            position: relative;
            .input_label{
                width: 4em;
                // display: flex;
                // justify-content: space-around;
                // align-items: center;
                text-align: justify;
                text-align-last: justify;
                margin-right:  px2rem(40);
                color:#666;
                flex-shrink: 0;
                @include font-dpr(28px);
            }
            .input{
                flex: 1;
                @include font-dpr(28px);
                color: #333;
            }
            .feedback-container{
                position: absolute;
                right: px2rem(28);
                top: 50%;
                transform: translate3d(0,-50%,0);
            }
            .select{
                -webkit-appearance: none; 
                border: 0;
                outline: 0;
                width: 100%;
                height: 100%;
                background-color: #fff;
                @include font-dpr(28px);
                option{
                    @include font-dpr(12px);
                }
            }
            .iconfont{
                 @include font-dpr(28px);
                color:#666;
            }
        
        }
        .agreeProtocol{
            box-sizing: border-box;
            height: px2rem(92);
            padding-bottom: px2rem(20);
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .check-box{
                box-sizing: border-box;
                border-radius: px2rem(1);
                height: px2rem(32);
                width: px2rem(32);
                border:px2rem(4) solid #999999;
                margin-right:  px2rem(20);

                padding: px2rem(3);
                background-clip: content-box;
                transform: translate3d(0,-10%,0);
                &.active{
                    background-color: green;
                }
            }
            .protocol{
                  @include font-dpr(28px);
                  color: #333;
            }
        }
        .confirm-container{
            padding: 0 px2rem(49);
            height: px2rem(96);
            overflow: hidden;
            margin-top:  px2rem(18);
            .confirm-btn{
                width: 100%;
                color: #fff;
                background-color: #d6d6d6;
                text-align: center;
                line-height:  px2rem(96);
                border-radius: px2rem(48);
                @include font-dpr(36px);
                &.active{
                   background-color: #5e93fc;
                }
            }
        }
        .forgetPassword{
            margin-top:  px2rem(20);
            text-align: center;
            @include font-dpr(28px);
        }
        .register{
            margin-top:  px2rem(20);
            text-align: center;
            @include font-dpr(28px);
        }
        .foot{
            padding: 0 px2rem(100);
            margin-top:  px2rem(20);
            display: flex;
            justify-content: space-between;
            >div{
                color: #999;
                @include font-dpr(28px);
            }
        }
        .toast-container{
            position: absolute;
            left: 50%;
            // bottom: px2rem(287);
            bottom: 30%;
            transform: translate3d(-50%,0,0);
        }
        .loading-container{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
        }
    }
    .slide-enter-active,.slide-leave-active{
        transition: all 0.5s;
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0);
    }
</style>

