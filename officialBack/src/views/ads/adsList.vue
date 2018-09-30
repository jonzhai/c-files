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
			<el-table-column  label="图片" >
                <template scope="scope" >
                    <div style="text-align:center">
                        <img :src="$photoIp + scope.row.images.src" alt="" style="height:100px;">
                    </div>
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
			<el-table-column prop="href" label="链接"  width="350"  >
			</el-table-column>
			<el-table-column label="操作" width="200">
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
                $photoIp: this.$photoIp
			}
		},
		created() {
			this.getAdvertisementList(1);
		},
		methods: {
			//性别显示转换
			formatTime: function (row, column) {
				 let date = new Date(row.createTime);
				return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getAdvertisementList();
			},
			getAdvertisementList(pageNumber) {
				this.listLoading = true;
				this.$axios.get('getAdvertisementList',{
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
					this.$axios.get('delectAdvertisementById',{
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
								this.getAdvertisementList(this.page);
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
				this.$router.push({path: '/addAd',query:{id: row.id}})
			},
			//显示新增界面
			handleAdd: function () {
				this.$router.push({path: '/addAd'})
			},
			
			
		},
		mounted() {
			// this.getUsers();
		}
	}

</script>

<style scoped>
.cell{
    text-align: center;
}
</style>