import * as types from './mutationTypes'
// export const setLoginState = ({ commit }, { curCount, token }) => {
//     localStorage.setItem('curCount', curCount);
//     localStorage.setItem('token', token);
//     commit(types.SET_LOGINSTATE, preload);
// }

export const LOGIN = ({ commit }, { adminToken, adminCount, adminID }) => {
    localStorage.setItem('adminToken', adminToken);
    localStorage.setItem('adminCount', adminCount);
    localStorage.setItem('adminID', adminID);
    commit(types.SET_TOKEN, adminToken);
    commit(types.SET_CURCOUNT, adminCount);
    commit(types.SET_ADMIN_ID, adminID);
}
export const LOGOUT = ({ commit }) => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminCount');
    localStorage.removeItem('curItem');
    localStorage.removeItem('curProduct');
    localStorage.removeItem('adminID');
    commit(types.SET_CURCOUNT, null);
    commit(types.SET_TOKEN, null);
    commit(types.SET_CURITEM, null);
    commit(types.SET_CURPRODUCT, null);
    commit(types.SET_ADMIN_ID, null);
}

export const setCurProduct = ({ commit }, curProduct) => {
    localStorage.setItem('curProduct', curProduct);
    commit(types.SET_CURPRODUCT, curProduct);
}