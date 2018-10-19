import axios from 'axios'
import qs from 'qs'

// 数据请求基本地址  本地数据

//export const baseUrl = 'http://www.yylmly.com/liangyou-wechat/'
// export const baseUrl = 'http://ly.messcat.com/liangyou-wechat/'
// export const baseUrl = 'http://8083.messcat.com/liangyou-wechat/'
// export const baseUrl = 'http://test5.messcat.com/liangyou-wechat/'
   export const baseUrl = 'http://192.168.0.126/liangyou-wechat/'
// export const baseUrl = 'http://192.168.0.194:8080/liangyou-wechat/'
// export const baseUrl = 'http://spixg3.natappfree.cc/liangyou-wechat/'

// withCredentials默认是false，意思就是不携带cookie信息，为true
axios.defaults.withCredentials = true;
// 拼接 url
function joinUrl(suffix) {
      return baseUrl + suffix
}
/*判断接口*/
export const ERR_OK = "200";
// 封装 get 函数
export function getData(suffix, parameter) {
      let param = parameter || {}
      let url = joinUrl(suffix)
      let data = Object.assign({}, param)
      return axios.get(url, {
            params: data
      }).then((result) => {
            return Promise.resolve(result.data)
      }).catch(
            (err) => {
                  console.log('网络繁忙，请稍后重试！')
            }
      )
}

// 封装 POST 函数
export function postData(suffix, parameter) {
      let parm = parameter || {}
      let url = joinUrl(suffix)
      let data = Object.assign({}, parm)
      return axios.post(url, qs.stringify(data)).then((result) => {
            return Promise.resolve(result.data)
      }).catch(
            (err) => {
                  console.log('网络繁忙,请稍后访问')
            }
      )
}

// 封装上传图片函数
export function upLoad(suffix, parameter) {
      let url = joinUrl(suffix)
      let config = {
            headers: { 'Content-Type': 'multipart/form-data' }
      };  //添加请求头
      return axios.post(url, parameter, config).then((result) => {
            return Promise.resolve(result.data)
      }).catch(
            (err) => {
                  console.log('网络繁忙,请稍后访问')
            }
      )
}
// 封装提示函数
export function toast(_this, hint) {
       _this.$toast(hint, {
            location: "center" // 默认在中间
      });
}
// 封装时间戳转换日期字符串
/**
 * 时间戳转换日期字符串
 * @param  {[type]} timestamp [时间戳]
 * @param  {[type]} type      [类型， 默认返回带具体时间， 1：返回不带时间的字符串]
 * @return {[type]}           [description]
 */
export function format(timestamp, format) {
      var timestamp = timestamp,
            format = format || 'Y-M-D h:m:s';
      if (timestamp === null) {
            return timestamp;
      } else {
            let date = new Date(timestamp),
                  Y = date.getFullYear(),
                  M = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1,
                  D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                  h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                  m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                  s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
                  output;
            output = format.replace('Y', Y)
                  .replace('M', M)
                  .replace('D', D)
                  .replace('h', h)
                  .replace('m', m)
                  .replace('s', s);
            return output
      }
}


// 定义
export function apiUrl() {
      return {
            // 商品详情
            productDetails: 'chooseBuy/findProductInfoSku',
            // 添加收藏
            addMyFavor: 'member/addMyFavor',
            // 取消收藏
            deleteMyFavor: 'member/deleteMyFavor',
            // 商品评价
            productCommentt: 'chooseBuy/findProductInfoComment',
            // 购物车列表
            findMyCartPage: 'cart/findMyCartPage',
            // 加入购物车
            addMyCart: 'cart/addMyCart',
            // 删除购物车
            deleteMyCart: 'cart/deleteMyCart',
            // 修改购物车商品数量
            updateMyCart: 'cart/updateMyCart',
            // 立即購買結算頁面
            buyNow: 'member/buyNow',
            // 购物车结算页面
            cartBuyNow: 'member/cartBuyNow',
            // 地址列表
            findMyAddress: 'member/findMyAddress',
            // 购买选择优惠券
            getCouponRecordForStoreAndClass: 'member/getCouponRecordForStoreAndClass',
            // 查看个人资料
            findMemberInfo: 'member/findMemberInfo',
            // 购物车提交订单
            addCartOrder: 'member/addCartOrder',
            // 立即购买提交订单
            addOrder: 'member/addOrder',
            // 微信支付
            prePay: 'weChat/prePay',
            // jsapi配置
            getWxConfig: 'weChat/getWxConfig',
            // 商品详情
            findProductInfoSku: 'chooseBuy/findProductInfoSku'
      }
}

export function paymentJjump(url){
    window.location.href =  "http://www.yylmly.com/" + url;
}