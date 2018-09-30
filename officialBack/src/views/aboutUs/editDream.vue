<template>
	<div class="dream">
		<p v-show="!eidt" style="width:80%;">{{textarea}}<span v-show="!textarea">当前内容为空</span></p>
		<el-button type="primary" v-show="!eidt" @click="eidt = !eidt">编辑</el-button>
		<form action=""  ref="form" class="form">
			<el-input
				type="textarea"
				:rows="10"
				placeholder="请输入内容"
				v-model="textarea"
				class="text"
				v-show="eidt"	
				
			>
			</el-input>

		  	<el-button type="primary" v-show="eidt" @click="submit">提交</el-button>
		  	<el-button type="primary" v-show="eidt" @click="eidt = !eidt">取消</el-button>
		</form>
	</div>
</template>
<script>
import {alertMixin} from '@/assets/js/mixin';

export default {
    mixins: [alertMixin],//引入模态框mixin,包含{showModal,closeModel}
	
	data(){
		return {
			textarea: '',	
			eidt: false
		}
	},
	created() {
		this.getAboutDetail();
	},
	methods:{
		submit(){
            let me = this,
				formData = new FormData();
			if(this.textarea && this.textarea.length > 200){
				me.myAlert('长度不能超过200字符');
				return;	
			}
			formData.append('content',this.textarea);


            //上传请求
            this.$axios.post('/SaveOrUpdateCompayVision', formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            }).then(function (response) {
                if(response.data.code > 0){

                    me.myAlert('发布成功！',()=>{
					   me.eidt = false;
					   me.getAboutDetail();
                    },true);
                    
                    
                }else{
                    me.myAlert(response.data.message);
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        getAboutDetail(){
            this.$axios.get('/getCompanyVisionDetail').then((res) =>{
                if(res.status === 200){
                    if(res.data.code > 0){
						this.textarea = res.data.data.content;
                    }else{
                        this.myAlert(res.data.message);
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
        },
	}
}
</script>
<style lang="scss" scoped>
.dream{
	margin-top: 50px;
}
.text{
	margin: 20px 0;
}
</style>

