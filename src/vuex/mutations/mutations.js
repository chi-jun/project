/*
* @Author: Allen
* @Date:   2018-01-09 13:16:11
* @Last Modified by:   Allen
* @Last Modified time: 2018-01-09 14:03:14
* @存放改变变量的方法
*/
// 引入mutation-types
import * as types from './mutation-types'

const mutations = {
    /**
     * 定义添加商品的数量vuex
     * @param state      [获取定义状态页面的state]
     * @param commodity  [提交的时候的参数]
    */
    [types.SET_COMMODITY](state, commodity) {
        state.commodity = commodity
    },
    // 定义购物车列表的数量
    [types.SET_SHOPPINGDATA](state, shoppingData) {
        state.shoppingData = shoppingData
    },
    // 定义购物车跳转结算页面的参数
    [types.SET_SHOPPINGID](state, shoppingId) {
        state.shoppingId = shoppingId
    },
    // 个人中心地址管理
    [types.SET_ADDRESSLIST](state, addressList) {
        state.addressList = addressList
    },
    // 购物车底部展示数量
    [types.SET_SHOPCARTNUM](state, shopCartNum) {
        state.shopCartNum = shopCartNum
    },
    // 当前的订单
    [types.SET_SEARCHVAL](state, searchVal) {
        state.searchVal = searchVal
    },
    [types.SET_CURRENTORDERDATA](state, currentOrderData) {
        state.currentOrderData = currentOrderData
    }
}

export default mutations
