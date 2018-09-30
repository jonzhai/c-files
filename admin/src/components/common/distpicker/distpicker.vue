<template>
    <el-row :gutter="20">
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-form-item 
                    prop="provinces"
                >
                    <el-select v-model="provinceId" name="provinceId" placeholder="----选择省份----">
                        <el-option v-for="(item,index) in provinces" :key="index" :value="item.provinceId" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-form-item 
                    prop="citys"
                >
                    <el-select v-model="cityId" name="cityId" placeholder="----选择城市----">
                        <el-option v-for="(item,index) in citys" :key="index" :value="item.cityId" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                  <el-form-item 
                    prop="districts"
                 >
                    <el-select v-model="districtId" name="districtId" placeholder="----选择区域----">
                        <el-option v-for="(item,index) in districts" :key="index" :value="item.districtId" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {
    props:{
      
        EprovinceId:{
            type: Number
        },
        EcityId:{
            type: Number
        }, 
        EdistrictId:{
            type: Number
        },
    },
    data(){
        return {
            provinces: [],
            citys: [],
            districts: [],
            provinceId: '',
            cityId:'',
            districtId:'',
            //标志位，用于编辑时
            isFirst: true
        }
    },
    created() {
        //获取全部省级
       this._getProvinces();
    },
    mounted() {
        // this.provinceId = this.EprovinceId;
        this.cityId = this.cityId;
        this.districtId = this.EdistrictId;

        //获取省级数据
        // this._getProvinces().then(()=>{
        //     //此处先判断是否传入，如有传入，则为编辑状态，依次获取市区，并指定id
        //     if(this.EprovinceId && this.EcityId){
        //         this.setDefault();
        //     }else{
        //        this.isFirst = false; 
        //     }
        // }).catch((err)=>{
        //     console.log(err)
        // })
    },
    methods:{
        // async setDefault(){
        //     this.provinceId = this.EprovinceId;
        //     await this._getCitys(this.EprovinceId);
        //     this.cityId = this.EcityId;
        //     if(this.EdistrictId){
        //         await this._getDistricts(this.EcityId);
        //         this.districtId = this.EdistrictId;
        //             this.isFirst = false;
        //     }else{
        //         this.isFirst = false;
        //     }
        // },
        _getProvinces(){
            return this.$axios.get('/getAllProvince').then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.provinces = res.data.data;
                        }else{
                            console.log(res.data.message)
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
        },
        _getCitys(ProvinceId){
            return this.$axios.get('/getCityByProvinceId',{
                    params: {
                        provinceId : ProvinceId
                    }
                }).then((res) =>{
                    // console.log(res);
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.citys = res.data.data;
                        }else{
                            console.log(res.data.message)
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
        },
         _getDistricts(cityId){
            return this.$axios.get('/getDistrictByCityId',{
                    params: {
                        cityId: cityId
                    }
                }).then((res) =>{
                    if(res.status === 200){
                        if(res.data.code > 0){
                            this.districts = res.data.data;
                        }else{
                            console.log(res.data.message)
                            return;
                        }
                    } 
                }).catch((err) =>{
                    console.log(err)
                })
        },

    },
    watch:{
        provinceId(newVal){
            this.districts = [];
            this._getCitys(newVal);
            this.cityId = null;
            this.districtId = null;
            this.$emit('changeDist',{
                provinceId: newVal,
                cityId: this.cityId,
                districtId: this.districtId
            })
        },
        cityId(newVal){
            if(newVal === null ){
                return;
            }
            this._getDistricts(newVal);
            this.districtId = "";
            this.$emit('changeDist',{
                provinceId: this.provinceId,
                cityId: newVal,
                districtId: this.districtId
            })
        },
        districtId(newVal){
            if(newVal === null ){
                return;
            }
            this.$emit('changeDist',{
                provinceId: this.provinceId,
                cityId: this.cityId,
                districtId: newVal
            })
        },
        EprovinceId(newVal){
            this.provinceId = newVal;
        },
        EcityId(newVal){
            this.cityId = newVal;
        },
        EdistrictId(newVal){
            this.districtId = newVal;
        }

    }
}
</script>


