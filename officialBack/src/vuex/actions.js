//test

import Cookies from 'js-cookie';

export const login = ({commit},curAccount) => {
    commit('LOGIN',curAccount);
    // sessionStorage.setItem('adminAccount',curAccount);
}
export const logout = ({commit}) => {
    commit('LOGOUT');
    // sessionStorage.removeItem('adminAccount');
    
}
