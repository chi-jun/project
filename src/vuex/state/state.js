/*
* @Author: Allen
* @Date:   2018-01-09 13:16:11
* @Last Modified by:   Allen
* @Last Modified time: 2018-01-09 13:29:57
* @定义存储vuex的状态管理
*/
const state = {
    commodity: {},            // 存放添加购物车的数量
    shoppingData: '',         // 定义购物车数据的变量
    shoppingId: [],           // 购物车跳转携带参数 [携带购物车id]
    site: '',
    addressList: '',          // 个人中心地址列表
    shopCartNum: 0,           // 购物车数量
    searchVal:'',             // 搜索的内容
    currentOrderData:{}
}
// 给定义的变量一个出口
export default state
