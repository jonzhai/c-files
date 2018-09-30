import * as types from './mutationTypes'

export const LOGIN = ({ commit }, { token, curCount }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('curCount', curCount)
    commit(types.SET_TOKEN, token);
    commit(types.SET_CURCOUNT, curCount);
}
export const LOGOUT = ({ commit }) => {
    localStorage.removeItem('token');
    localStorage.removeItem('curCount');
    commit(types.SET_CURCOUNT, null);
    commit(types.SET_TOKEN, null);
}