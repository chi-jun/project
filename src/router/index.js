import Vue from 'vue';
import Router from 'vue-router';
// 粮油商城-首页
import index from '@/components/index/index';
// 粮油商城-选购
import choose from '@/components/choose/choose';
// 粮油商城-商品列表
import chooseList from '@/components/choose/choose-list';
// 粮油商城-商品详情
import goodsDetails from '@/components/choose/goods-details';
// 粮油商城-购物车
import shop from '@/components/shop/shop';
// 粮油商城-个人中心
import personal from '@/components/personal/personal';
// 粮油商城-搜索历史
import searchHistory from '@/components/search/search-history';
// 粮油商城-搜索结果
import searchResult from '@/components/search/search-result';
// 粮油商城-结算
import clearing from '@/components/clearing/clearing';
// 粮油商城-结算成功
import paymentHint from '@/components/payment-hint/payment-hint';
// 粮油商城-结算地址选择
import selectionSite from '@/components/selection-site/selection-site';
// 粮油商城-结算发票选择
import invoice from '@/components/invoice/invoice';
// 粮油商城-结算优惠卷
import paymentCoupons from '@/components/payment-coupons/payment-coupons';
// 粮油商城-个人资料
import personalData from '@/components/personal/personal-data';
// 粮油商城-地址管理
import address from '@/components/personal/address';
// 粮油商城-地址编辑
import editAddress from '@/components/personal/editAddress';
// 粮油商城-添加新地址
import addAddress from '@/components/personal/addAddress';
// 粮油商城-联系客服
import notescontact from '@/components/personal/notescontact';
// 粮油商城-我的订单
import order from '@/components/personal/order';
// 粮油商城-订单详情
import orderDetails from '@/components/personal/order-details';
// 粮油商城-物流详情
import logistics from '@/components/personal/logistics';
// 粮油商城-申请退款
import refund from '@/components/personal/refund'
// 粮油商城-订单评价
import evaluate from '@/components/personal/evaluate'
// 粮油商城-优惠卷
import coupons from '@/components/personal/coupons'
// 粮油商城-我的收藏
import collect from '@/components/personal/collect'
// 粮油商城-个人中心 余额
import balance from '@/components/personal/balance'
// 粮油商城-个人中心 充值
import recharge from '@/components/personal/recharge'
import NotFoundComponent from '@/components/personal/NotFoundComponent'
// import HelloWorld from '@/components/HelloWorld'
Vue.use(Router)
const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition
    } else {
        return {x: 0, y: 0}
    }
}

export default new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
        {
            // 首页
            path: '/',
            name: '默认',
            redirect: '/index'
        },
        /*
        {
            // 首页
            path: '/',
            name: '默认',
            redirect: '/index'
        },
        */
        {
            // 首页
            path: '/index',
            name: '首页',
            component: index
        },
        {
            //  选购
            path: '/choose',
            name: '选购',
            component: choose,
            children: [
                {
                    path: ':productClassId',
                    name: '选购详情',
                    component: choose
                }
            ]
        },
        {
            // 商品列表页
            path: '/choose-list/:listId',
            name: '商品列表',
            component: chooseList,
            // children: [
            //     {
            //         path: ':listId',
            //         name: '商品id',
            //         component: chooseList
            //     }
            // ]
        },
        {
            // 商品详情页
            path: '/goods-details/:productId/:skuId',
            name: '商品详情',
            component: goodsDetails,
            // children: [
            //     {
            //         path: ':productId',
            //         name: '商品详情id',
            //         component: goodsDetails,
            //         children: [
            //             {
            //                 path: ':skuId',
            //                 name: '规格库存id',
            //                 component: goodsDetails
            //             }

            //         ]
            //     },

            // ]
        },
        {
            // 购物车
            path: '/shop',
            name: '购物车',
            component: shop
        },
        {
            // 个人中心
            path: '/personal',
            name: '个人中心',
            component: personal
        },
        {
            // 个人资料
            path: '/personal-data',
            name: '个人资料',
            component: personalData,
            // children: [
            //     {
            //         path: ':id',
            //         name: '个人资料子页面',
            //         component: personalData,
            //     }
            // ]
        },
        {
            // 地址管理
            path: '/address',
            name: '地址管理',
            component: address,
            // children: [
            //     {
            //         path: ':id',
            //         name: '地址管理页面',
            //         component: address
            //     }
            // ]
        },
        {
            // 地址编辑
            path: '/edit-address',
            name: '地址编辑',
            component: editAddress,
            children: [
                {
                    path: ':id',
                    name: '地址编辑页面',
                    component: editAddress
                }
            ]
        },
        {
            // 添加新地址
            path: '/add-address',
            name: '添加新地址',
            component: addAddress,
            // children: [
            //     {
            //         path: ':id',
            //         name: '添加新地址页面',
            //         component: addAddress
            //     }
            // ]
        },
        {
            // 联系客服
            path: '/notescontact',
            name: '联系客服',
            component: notescontact
        },
        {
            // 我的订单
            path: '/order/:orderId',
            name: '我的订单',
            component: order,
            // children: [
            //     {
            //         path: ':orderId',
            //         name: '我的订单页面',
            //         component: order
            //     }
            // ]
        },
        {
            // 订单详情
            path: '/order-details/:Id/:state',
            name: '订单详情',
            component: orderDetails
            // children: [
            //     {
            //         path: ':Id',
            //         name: '订单详情页面',
            //         component: orderDetails,
            //         children: [
            //             {
            //                 path: ':state',
            //                 name: '订单详情子页面',
            //                 component: orderDetails,
            //             }
            //         ]
            //     }
            // ]
        },
        {
            // 申请退款
            path: '/refund',
            name: '申请退款',
            component: refund,
            children: [
                {
                    path: ':refundId',
                    name: '申请退款页面',
                    component: refund
                }
            ]
        },
        {
            // 物流详情
            path: '/logistics',
            name: '物流详情',
            component: logistics,
            children: [
                {
                    path: ':logId',
                    name: '物流详情页面',
                    component: logistics
                }
            ]
        },
        {
            // 评价
            path: '/evaluate',
            name: '评价',
            component: evaluate,
            children: [
                {
                    path: ':evaluateId',
                    name: '订单评价',
                    component: evaluate,
                    children: [
                        {
                            path: ':goodIndex',
                            name: '商品索引',
                            component: evaluate
                        }
                    ]
                }
            ]
        },
        {
            // 优惠卷 coupons
            path: '/coupons',
            name: '优惠卷',
            component: coupons,
            children: [
                {
                    path: ':id',
                    name: '优惠卷页面',
                    component: coupons
                }
            ]
        },
        {
            // 我的收藏
            path: '/collect',
            name: '我的收藏',
            component: collect
        },
        {
            // 余额
            path: '/balance',
            name: '余额',
            component: balance,
            children: [
                {
                    path: ':id',
                    name: '余额页面',
                    component: balance
                }
            ]
        },
        {
            // 充值
            path: '/recharge',
            name: '充值',
            component: recharge,
            children: [
                {
                    path: ':id',
                    name: '充值页面',
                    component: recharge
                }
            ]
        },
        {
            // 搜索历史
            path: '/searchHistory',
            name: '搜索历史',
            component: searchHistory
        },
        {
            // 搜索结果
            path: '/searchResult/:searchVal',
            name: '搜索结果',
            component: searchResult,
        },
        {
            // 结算首页
            path: '/clearing',
            name: '结算',
            component: clearing,
            children: [
                {
                    path: ':id',
                    name: '结算页面',
                    component: clearing
                }
            ]
        },
        {
            // 结算提示
            path: '/payment-hint',
            name: '结算提示',
            component: paymentHint
        },
        {
            // 结算地址选择
            path: '/selection-site',
            name: '结算地址选择',
            component: selectionSite
        },
        {
            // 结算发票选择
            path: '/invoice',
            name: '结算发票',
            component: invoice,
            children: [
                {
                    path: ':id',
                    name: '发票选择',
                    component: invoice
                }
            ]
        },
        {
            // 结算优惠卷
            path: '/payment-coupons',
            name: '结算优惠卷',
            component: paymentCoupons,
            children: [
                {
                    path: ':id',
                    name: '结算优惠卷选择',
                    component: paymentCoupons
                }
            ]
        },
        { path: '*', component: NotFoundComponent }
    ]
})


