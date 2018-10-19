// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入移动端适配
import 'lib-flexible'
// 引入字体图标库
import 'assets/iconfont/iconfont.css'
// 引入 swiper
import swiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 引入 状态管理vuex
import store from './vuex'
/*引入快速点击*/
/*import fastclick from 'fastclick'*/
/*引入懒加载*/
import VueLazyload from 'vue-lazyload'
// 引入弹框
import {Alert, Confirm, Toast} from 'wc-messagebox'
import 'wc-messagebox/style.css'
Vue.use(Alert, {})
Vue.use(Confirm, {})
Vue.use(Toast, 1000)

import 'assets/js/vee'

Vue.use(VueLazyload, {
    loading: require('assets/images/lazyLoad/loading.gif'),
    error: require('assets/images/lazyLoad/none.jpg')
})
Vue.config.productionTip = false

Vue.use(swiper)
/* eslint-disable no-new */
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
