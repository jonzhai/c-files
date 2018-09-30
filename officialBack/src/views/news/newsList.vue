<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<!-- <el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
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
		<el-table :data="lists"   border highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="title" label="标题" width="250" >
			</el-table-column>
			<el-table-column prop="subTitle" label="副标题"   >
			</el-table-column>
			<el-table-column prop="typeName" label="类型" width="200" >
			</el-table-column>
			<el-table-column  label="发布时间" width="200" :formatter="formatTime" >
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" @click="toDetail(scope.$index, scope.row)">详情</el-button>
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

	</section>
</template>

<script>
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				lists: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

			}
		},
		created() {
			this.getNewsList();
		},
		methods: {
			formatTime: function (row, column) {
				 let date = new Date(row.createTime);
				return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getNewsList();
			},
			getNewsList(pageNumber) {
				this.listLoading = true;
				this.$axios.get('getNewsList',{
					params:{
						pageNumber: pageNumber,
						pageSize: 12
					}
				}).then((res) =>{
					this.listLoading = false;
					if(res.status === 200){
						if(res.data.code > 0){
							this.lists = res.data.data.list;
							this.total = res.data.data.pages;
							this.page = res.data.data.pageNum;
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
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$axios.get('deleteNews',{
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
								this.getNewsList(this.page);
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
			toDetail(index,{id}){
				this.$router.push({path: '/newsDetail',query:{id: id}})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.$router.push({path: '/addEditNews',query:{id: row.id}})
			},
			//显示新增界面
			handleAdd: function () {
				this.$router.push({path: '/addEditNews'})
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
						this.getUsers();
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