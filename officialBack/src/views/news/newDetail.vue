<template>
	<div class="news-detail">
		<table class="table">
			<!-- <tr>
				<th style="width:200px;">标题</th>
				<th>内容</th>
			</tr> -->
			<tbody>
				<tr>
					<th>类型：</th>
					<td>{{form.typeId == 1 ? "新闻": '盈车帮'}}</td>
				</tr>
				<tr>
					<th>标题：</th>
					<td>{{form.title}}</td>
				</tr>
				<tr>
					<th>副标题：</th>
					<td>{{form.subTitle}}</td>
				</tr>
				<tr>
					<th>封面：</th>
					<td>
						<img ref="editImg" :src="form.cropImg" alt="" style="width: 300px">
					</td>
				</tr>
				<tr>
					<th>内容：</th>
					<td v-html="form.content"></td>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<script>
import {alertMixin} from '@/assets/js/mixin';
export default {
	mixins:[alertMixin],
	data() {
		return {
			form: {
				title: '',
				subTitle: '',
				typeId: '',
                content: '',
                cropImg: ''
            },
            editorOption:{
                readOnly: true
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
		//类型显示转换
		formatSex: function (row, column) {
			return row.typeId == 1 ? '新闻' : '盈车帮';
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
						let data = res.data.data;
						if(data.cover){
							let url = this.$photoIp + data.cover.src;
							this.form.cropImg = url;
						}
						this.form.title = data.title;
						this.form.subTitle = data.subTitle;
						this.form.typeId = data.typeId;
						this.form.content = data.content;

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
        // quillEditor
    }
}

</script>
<style  scoped lang="scss">
.news-detail{
	overflow: hidden;
	margin-top: 50px;
	.table{
		width: 90%;
		margin: 0 auto;
		border-collapse: collapse; 
		border: 1px solid #eee;
		th{
			width: 100px;
			height: 1.5em;
			background-color: #eee;
			border: 1px solid #999;
		}
		td{
			border: 1px solid #eee;
			padding: 10px 20px;
		}
	}
}
</style>
