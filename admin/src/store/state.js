const getState = () => {
    return localStorage.getItem('adminCount')
}
const getToken = () => {
    return localStorage.getItem('adminToken')
}
const getAdminID = () => {
    return localStorage.getItem('adminID')
}
const getCurProduct = () => {
    return localStorage.getItem('curProduct')
}

export const state = {
    //当前登录状态
    adminCount: getState(),
    adminID: getAdminID(),
    //记录进入登录页的页面地址，登录成功，跳转回去
    prevRouter: '',

    //token
    adminToken: getToken(),

    //左侧列表的激活项
    curItem: '',

    //当前产品
    curProduct: getCurProduct()

}