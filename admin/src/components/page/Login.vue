<template>
    <div class="login-wrap">
        <div class="ms-title">车盈在线管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="tologin('ruleForm')">登录</el-button>
                </div>
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
        <canvas id="canvas"  width="1902" height="950"></canvas>
    </div>
</template>

<script>
    import Qs from 'qs'; 
    import Md5 from 'md5';
    import {mapGetters, mapActions} from 'vuex';
    import Animation from 'src/assets/js/loginAnimation';
    import Animation_1 from 'src/assets/js/loginAnimation.1';
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { pattern: /^[\x00-\xff]{6,15}$/, message: '密码格式错误', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            setTimeout(() => {
                // Animation();
                Animation_1();
            },20)
        },
        methods: {
            showModal(desc){
                this.$alert(desc, 'Error', {
                    confirmButtonText: '确定'
                    });
            },
             tologin(){
                let  params =  Qs.stringify({
                    userName:  this.ruleForm.username,
                    password: Md5(this.ruleForm.password)
                });
                this.$axios.post('/adminLogin',params).then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.LOGIN({
                                adminToken: res.data.data.Authorization,
                                adminCount:  this.ruleForm.username,
                                adminID: res.data.data.userId,
                            });
                            this.$router.replace({path: '/systemMsgList'})
                        }else{
                            this.showModal(res.data.message);
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
            },
            ...mapActions(['LOGIN'])
        }
    }
</script>

<style scoped>

    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-color: #000;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: transparent;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>