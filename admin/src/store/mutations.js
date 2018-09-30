import * as types from './mutationTypes';
export default {
    [types.SET_CURCOUNT](state, adminCount) {
        state.adminCount = adminCount;
    },
    [types.SET_PREVROUTER](state, prevRouter) {
        state.prevRouter = prevRouter;
    },
    [types.SET_TOKEN](state, adminToken) {
        state.adminToken = adminToken;
    },
    [types.SET_CURITEM](state, curItem) {
        state.curItem = curItem;
    },
    [types.SET_CURPRODUCT](state, curProduct) {
        state.curProduct = curProduct;
    },
    [types.SET_ADMIN_ID](state, id) {
        state.adminID = id;
    },
}