<template>
	<el-form ref="form" :model="form" :rules="rules" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="类型" prop="type">
			<el-select v-model="form.typeId" placeholder="请选择类型">
				<el-option label="新闻" :value="1"></el-option>
				<el-option label="盈车帮" :value="2"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="标题" prop="title">
			<el-input v-model="form.title"></el-input>
		</el-form-item>
		<el-form-item label="副标题" prop="subTitle">
			<el-input type="textarea" v-model="form.subTitle"></el-input>
		</el-form-item>
		<el-form-item label="封面图片">
			<el-row>
				<el-col :span="6">
					<label class="add-img">
						<span class="el-icon-plus"></span>
						<input type="file" accept="image/*" ref="addIpt" maxlength="1" @change="setImage">  
					</label>
				</el-col>
				<el-col :span="18">
					<div class="img-wrapper">       
						<img ref="editImg" :src="cropImg" alt="">
					</div>
				</el-col>	
			</el-row>
		</el-form-item> 
		<el-form-item label="内容">
			<div class="editor-container">
				 <!-- <UE :defaultMsg=defaultMsg :config=config ref="ue"></UE> -->
				<quill-editor v-model="form.content"
							ref="myQuillEditor"
							:options="editorOption"
							@change="onEditorChange($event)"
							:style="{height: '100%'}"
							>
				</quill-editor>
			</div>
		</el-form-item>
		<el-form-item class="control-btn">
			<el-button type="primary" @click.stop="onSubmit">立即提交</el-button>
			<el-button @click.native.prevent="cancel">取消</el-button>
		</el-form-item>
		<div class="progressBar-container" v-show=" uploadProgress > 0 && uploadProgress < 100">
           <el-progress :text-inside="true" :stroke-width="18" :percentage="uploadProgress"></el-progress>
        </div>  
		<el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%"  >
            <vue-cropper  ref='cropper' :src="imgSrc" :aspectRatio="306/210" ></vue-cropper> <!--:ready="cropImage" :zoom="cropImage" :cropmove="cropImage" -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelCrop">取 消</el-button>
                <el-button type="primary" @click="cropImage ">确 定</el-button>
            </span>
        </el-dialog>
	</el-form>
</template>

<script>
import VueCropper  from 'vue-cropperjs';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor';
import {alertMixin} from '@/assets/js/mixin';
import {appendFormToFormData} from '@/assets/js/tools';
import 'blueimp-canvas-to-blob';

export default {
	mixins:[alertMixin],
	data() {
		return {
			form: {
				title: '',
				subTitle: '',
				typeId: '',
				content: '<p style="color: red;">请在此编辑新闻内容！</p>'
			},
			rules: {
				typeId: [
					{ required: true, message: '请选择类型', trigger: 'change' }
				],
				title: [
					{ required: true, message: '请输入标题', trigger: 'blur' },
					{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
					//{ validator: validaePass }
				],
				subTitle: [
					{ required: true, message: '请输入副标题', trigger: 'blur' },
					{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
					//{ validator: validaePass2 }
				]
			},
			dialogVisible: false,
			imgSrc: '',
			cropImg: '',
			canvas: null,
			uploadProgress: 0,
			editorOption: {
				
			}
			
		}
	},
	created() {
		let id = this.$route.query.id;
		if(id){
			this._getNewsById(id);
		}
	},
	methods: {
		setImage(e){
			const file = e.target.files[0];
			if (!file.type.includes('image/')) {
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				this.dialogVisible = true;
				this.imgSrc = event.target.result;
				this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
			};
			reader.readAsDataURL(file);
		},
		cropImage () {
			this.dialogVisible = false;
			this.canvas = this.$refs.cropper.getCroppedCanvas();
			this.cropImg = this.canvas.toDataURL();
		},
		cancelCrop(){
			this.dialogVisible = false;
			// this.cropImg = this.defaultSrc;
		},
		onEditorChange({ quill, html, text }) {
			// console.log( html, text)
			this.content = html
		},
		cancel(){
			this.$router.back();
		},
		onSubmit() {
		    this.$refs.form.validate((valid) => {
				if (valid) {
					this._submitForm();
							
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		_submitForm(){
			let me = this, 
				formData = new FormData();
			appendFormToFormData(this.form,formData);
			let id = this.$route.query.id;
			if(id){
				formData.append('id', id);
			}
			if(this.canvas){
				this.canvas.toBlob((file) => {
					if(this.countSize(file) > 2){
						this.myAlert('图片不能大于2M');
					}else{
						formData.append('cover', file, 'image');
						this._postData(formData);
					}
				},'image/jpeg');
			}else{
				this._postData(formData);
				
			}
			 
			
		},
		_postData(formdata){
			//上传请求
			let me = this;
			me.$axios.post('/saveOrUpdateNews', formdata,{
				headers:{
					'Content-Type':'multipart/form-data'
				},
				onUploadProgress: function (progressEvent) {
					// debugger;
					// console.log(progressEvent);
					if(!progressEvent){return}
					var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
					me.uploadProgress = complete;
				},

			}).then(function (res) {
				if(res.status === 200){
					if(res.data.code > 0){
						me.myAlert('发布成功！',function(){
							me.$router.replace({path:'/newsList'});
						},true)
					}else{
						me.myAlert(res.data.message)
					}
				} 
			}).catch(function (error) {
				me.myAlert(error.message);
			});
		},
		 countSize(file){
            //将文件大小转为M
            return (file.size/1024/1024).toFixed(2);
		},
		_getNewsById(id){
			this.$axios.get('getNewsById',{
					params:{
						id: id
					}
				}).then((res) =>{
					// console.log(res);
					if(res.status === 200){
						if(res.data.code > 0){
							let {title,subTitle,typeId,content} = res.data.data;
							if(res.data.data.cover){
								let url = this.$photoIp + res.data.data.cover.src;
								this.cropImg = url;
							}
							
							this.form.title = title;
							this.form.subTitle = subTitle;
							this.form.typeId = typeId;
							this.form.content = content;

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
	},
	components:{
		quillEditor
	}
}

</script>
<style  scoped lang="scss">
  .add-img{
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background-color: #fff;
        border: 1px dashed #999;
        border-radius: 10px; 
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        
        span{
            font-size: 16px;
        }
        input{
            opacity: 0;
            position: absolute;
            z-index: 0;
            cursor: pointer;
            
        }
    }
	.img-wrapper{
		>img{
			height: 210px;
			width: 306px;
		}
	}
	.editor-container{
		height: 250px;
		>div{
			height: 100%;
		}
	}
	.control-btn{
		margin-top: 150px;
	}
</style>
