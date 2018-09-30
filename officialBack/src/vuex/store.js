import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import Cookies from 'js-cookie';

Vue.use(Vuex)

const getAccount = () => {
    return Cookies.get('user_id');
    // return sessionStorage.getItem('adminAccount');
}

// 应用初始状态
const state = {
    account: getAccount()
}



// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})