<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="ruleForm2.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapActions} from 'vuex';
  import Qs from 'qs'; 
  import Md5 from 'md5';
  import {alertMixin} from '@/assets/js/mixin'
  //import NProgress from 'nprogress'
  export default {
    	mixins:[alertMixin],
    data() {
      return {
        ruleForm2: {
          userName: '',
          password: ''
        },
        rules2: {
          userName: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this._tologin();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      _tologin(){
          let  params =  Qs.stringify({
              userName:  this.ruleForm2.userName,
              password: Md5(this.ruleForm2.password)
          });
          this.$axios.post('userLogin',params).then((res) =>{
              if(res.status === 200){
                  if(res.data.code > 0){
                      this.login(this.ruleForm2.userName);
                      this.$router.replace({path: '/newsList'});
                  }else{
                      this.myAlert(res.data.message);
                      return;
                  }
              } 
          }).catch((err) =>{
              console.log(err)
          })
      },
      ...mapActions(['login'])
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>