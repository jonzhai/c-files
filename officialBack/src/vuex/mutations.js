// 定义所需的 mutations
const mutations = {
    LOGIN(state, account) {
        state.account = account;
    },
    LOGOUT(state) {
        state.account = null;
    }
}
export default mutations;