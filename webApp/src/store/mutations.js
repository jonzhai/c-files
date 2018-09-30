import * as types from './mutationTypes';
export default {
    [types.SET_CURCOUNT](state, curCount) {
        state.curCount = curCount;
    },
    [types.SET_PREVROUTER](state, prevRouter) {
        state.prevRouter = prevRouter;
    },
    [types.SET_TOKEN](state, token) {
        state.token = token;
    },
    [types.SET_CURORDER](state, curOrder) {
        state.curOrder = curOrder;
    },
    [types.SET_CURCARSLIST](state, carsList) {
        state.curCarsList = carsList;
    },
    [types.SET_TRANSITIONPASS](state, tpass) {
        state.isSetTransitionPass = tpass;
    },
    [types.SET_CURTIME](state, curTime) {
        state.curTime = curTime;
    },
    [types.SET_CURCITY](state, curCity) {
        state.curCity = curCity;
    },
    [types.SET_CURSALECITY](state, curSaleCity) {
        state.curSaleCity = curSaleCity;
    },
}