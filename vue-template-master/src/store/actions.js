import * as types from './mutationsType'
export const setLoginState = ({commit},preload) =>{
    localStorage.setItem('curCount',preload)
    commit(types.SET_LOGSTATE,preload);
}
