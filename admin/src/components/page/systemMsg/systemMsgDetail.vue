<template>
    <div class="systemMsg-detail">
        <div class="head">
            <div class="head-left">
                <i class="el-icon-arrow-left back-icon" @click="goBack"></i>
                <span class="allInfo">全部通知</span>
            </div>
        </div>
        <div class="container">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        标题：
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        {{msg.title}}
                    </div>
                </el-col>
            </el-row>
             <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        创建时间：
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        {{msg.createTime | toDate3}}
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        通知内容：
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        {{msg.content}}
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            msg: ''
        }
    },
    created(){
       this.msgId = this.$route.query.id;
       this._getSystemMsgById(this.msgId);
    },
    mounted(){
    },
    methods:{
        goBack(){
            this.$router.back();
        },
       _getSystemMsgById(id){
           this.$axios.get('/getSysMessageById',{
                params:{
                   id: id
                }
            }).then((res) =>{
                // console.log(res);
                if(res.status === 200){
                    if(res.data.code > 0){
                        this.msg = res.data.data;
                    }else{
                        return;
                    }
                } 
            }).catch((err) =>{
                console.log(err)
            })
       }
       
    }
}
</script>

<style lang="scss" scoped>
.systemMsg-detail{
    width: 100%;
    position: relative;
    padding: 0 10px;
    .head{
        height: 30px;
        width: 100%;
        // display: flex;
        // justify-content: space-between;
        .head-left{
            display: flex;
            align-items: center;
            .back-icon{
                font-size: 32px;
                cursor: pointer;
            }
            .allProduct{
                width: 200px;
                border-bottom: 1px solid #000; 
            }
        }
    }
    .el-row{
        margin-bottom: 10px;
    }
   .container{
       margin-top: 30px; 
   }
    
}
</style>

