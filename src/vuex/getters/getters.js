/*
* @Author: Allen
* @Date:   2018-01-09 13:16:11
* @Last Modified by:   Allen
* @Last Modified time: 2018-01-09 13:33:18
* @映射存入的数据从这里作为出口 从这里取数据到页面中
*/
// 购物车商品的数量
export const commodity = state => state.commodity; // 箭头函数的简写,return了一个state.commodity
// 购物车列表数据
export const shoppingData = state => state.shoppingData;
// 购物车跳转结算页面携带参数
export const shoppingId = state => state.shoppingId
// 个人中心地址管理列表
export const addressList = state => state.addressList
// 购物车展示在页面底部的商品数量
export const shopCartNum = state => state.shopCartNum
// 获取订单
export const searchVal = state => state.searchVal
//获取当前的订单信息
export const currentOrderData = state => state.currentOrderData
