/*
* @Author: Allen
* @Date:   2018-01-09 13:16:11
* @Last Modified by:   Allen
* @Last Modified time: 2018-01-10 15:12:40
* @作用 作为vuex的入口文件
*/
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions/actions'
import * as getters from './getters/getters'
import state from './state/state'
import mutations from './mutations/mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
