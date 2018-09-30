const getState = () => {
    return localStorage.getItem('curCount')
}
export const state = {
    loginCount: getState() //当前登录状态
 
}