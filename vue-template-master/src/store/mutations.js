import * as types from './mutationsType';
console.log(types)
export default {
    [types.SET_LOGSTATE](state, curCount) {
        state.loginCount = curCount;
    }
}