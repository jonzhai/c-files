<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="points" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="shopName" label="店名" width="300" >
			</el-table-column>
			<el-table-column prop="address" label="地址"  >
			</el-table-column>
			<el-table-column prop="phone" label="联系方式" width="300">
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="店名" prop="shopName">
					<el-input v-model="editForm.shopName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="editForm.address" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="editForm.phone" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="店名" prop="shopName">
					<el-input v-model="addForm.shopName" auto-complete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="地址" props="address">
					<el-input type="textarea" v-model="addForm.address"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import {alertMixin} from '@/assets/js/mixin';
	import {appendFormToFormData} from '@/assets/js/tools';

	export default {
		 mixins: [alertMixin],
		data() {
			return {
				filters: {
					name: ''
				},
				points: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					shopName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					shopName: '',
					address: '',
					phone: 0
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					shopName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					shopName: '',
					address: '',
					phone: ''
				
				}

			}
		},
		created() {
			this.getPoints(1)
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getPoints(val)
			},
			//获取用户列表
			getPoints(pageNumber) {
				this.listLoading = true;
				this.$axios.get('getServiceStationList',{
					params:{
						pageNumber: pageNumber,
						pageSize: 12
					}
				}).then((res) =>{
					this.listLoading = false;
					if(res.status === 200){
						if(res.data.code > 0){
							this.points = res.data.data.list;
							this.total = res.data.data.pages;
							this.page = res.data.data.pageNum;
						}else{
							this.myAlert(res.data.message);
							return;
						}
					} 
				}).catch((err) =>{
					console.log(err)
				})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					this.$axios.get('deleteServiceStation',{
						params:{
							id: row.id
						}
					}).then((res) =>{
						this.listLoading = false;
						if(res.status === 200){
							if(res.data.code > 0){
								this.$message({
									message: '删除成功',
									type: 'success'
								});
								this.getPoints(this.page);
							}else{
								this.myAlert(res.data.message);
								return;
							}
						} 
					}).catch((err) =>{
						console.log(err)
					})

				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				console.log(row)
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					shopName: '',
					address: '',
					phone: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let formData = new FormData();
							appendFormToFormData(this.editForm,formData);
							formData.delete('createTime');
							this._submit(formData).then(()=>{
								this.editFormVisible = false;
								this.editLoading = false;
							})
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							appendFormToFormData(this.addForm,formData);
							this._submit(formData).then(()=>{
								this.addFormVisible = false;
								this.addLoading = false;
							})
						});
					}
				});
			},
			 _submit(formData){
				let me = this;
				//上传请求
				return this.$axios.post('/saveOrUpdateServiceStation', formData,{
					headers:{
						'Content-Type':'multipart/form-data'
					},
					onUploadProgress: function (progressEvent) {
						if(!progressEvent){return}
						var complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
						me.uploadProgress = complete;
					},

				}).then(function (response) {
					me.addLoading = false;
					if(response.data.code > 0){
							me.$message({
								message: '提交成功',
								type: 'success'
							});
							me.getPoints(me.page);
					}else{
						me.myAlert(response.data.message);
					}
				}).catch(function (error) {
					console.log(error);
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						// this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			// this.getUsers();
		}
	}

</script>

<style scoped>

</style>