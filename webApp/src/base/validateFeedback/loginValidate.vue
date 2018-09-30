<template>
    <div class="validate">
        <div class="successMessage" v-if="showType === RegFeedBackType.showSuccess"><span class="icon iconfont icon-success"></span></div>
        <div class="errorMessage" v-if="showType === RegFeedBackType.showError">{{errorMsg}}<span class="icon iconfont icon-error"></span></div>
    </div>
</template>
<script>

// import {RegFeedBackType} from 'src/assets/js/config'

export default {
    props:{
        showType:{
            type: Number,
            default: 0
        },
        errorMsg:{
            type: String,
            default: ''
        }
    },
    data(){
        return{
            RegFeedBackType:{
               showNothing: 0,
               showSuccess: 1,
               showError: 2
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .validate{
        padding: px2rem(10);
        .successMessage{
            .icon-success{
                 @include font-dpr(44px);
                 color:green;
            }
        }
        .errorMessage{
            color: #f00;
            @include font-dpr(24px);
            white-space: nowrap;
            .icon-error{
                @include font-dpr(44px);
                padding-left: px2rem(20);
                vertical-align: middle;
            }
        }
    }
</style>

