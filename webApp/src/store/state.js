const getState = () => {
    return localStorage.getItem('curCount')
}
const getToken = () => {
    return localStorage.getItem('token')
}
export const state = {
    //当前登录状态
    curCount: getState(),

    //记录进入登录页的页面地址，登录成功，跳转回去
    prevRouter: '',
    //记录登录token
    token: getToken(),
    //当前订单
    curOrder: '',

    //当前汽车列表
    curCarsList: [],

    //是否设置交易密码
    isSetTransitionPass: false,

    //投资-当前的持有时限
    curTime: 30,

    //投资-当前选择的地区
    curCity: {},
    //卖车-当前选择的地区
    curSaleCity: {}
}