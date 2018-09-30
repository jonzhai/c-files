import Vue from 'vue'
import Vuex from 'vuex'
import { state } from './state'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters' //必须以此方式引入，因为getter为函数

Vue.use(Vuex)
export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
})