<template>
    <div class="order-details-container clearfix">
        <!-- 地址 -->
        <section class="clearing-site">
            <p>
                <span>{{ orderCommon.reciverName}}</span>
                <span>{{ orderCommon.phone }}</span>
            </p>
            <p>
                {{orderCommon.reciverInfo}}
            </p>
        </section>
        <!-- 订单列表 -->
        <section class="order-details-wrap clearfix">
            <article class="order-details-box clearfix" :class="{'active': state == 1}" v-for="(item, index) in orderData.orderGoods">
                <i
                 class="iconfont icon-gou order-select" 
                    v-show="orderData.shippingState==2&&orderData.orderState==0||orderData.shippingState==2&&orderData.orderState==1"           
                 :class="{active:!item.orderSn}"
                 @click="check(item,index)"></i> 
                <div class="order-details-pic">
                    <img :src="item.goodsImage" :alt="item.desc">
                </div>
                <div class="order-details-con">
                    <h4>{{ item.goodsName }}</h4>
                    <p> {{ item.desc }} </p>
                    <div>
                        <span><em>￥</em>{{ item.goodsPrice }}</span>
                        <span>x{{ item.goodsNum }}</span>
                    </div>
                </div>
                <!-- <div class="bottomBox">
                    <p class="btn"
                     v-show="orderData.orderState == 4"
                     @click="evaluate(index)">评价</p>
                </div> -->
            </article>
        </section>

        <ul class="order-details-info clearfix">
            <li><span>订单编号:</span><p>{{ orderData.orderSn }}</p></li>
            <li v-show="orderData.paymentCode"><span>支付方式:</span><p>{{ orderData.paymentCode | payFilter}}</p></li>
            <li><span>下单时间:</span><p>{{ orderData.addTime }}</p></li>
            <li v-show="orderData.paymentTime"><span>支付时间:</span><p>{{ orderData.paymentTime }}</p></li>
            <li v-show="orderCommon.shippingTime"><span>发货时间:</span><p>{{orderCommon.shippingTime}}</p></li>
        </ul>

        <section class="order-details-foot">
            <div class="foot-left">
                <p>合计: <span>￥{{orderData.orderAmount}}</span></p>
                <p>含运费:<span>￥{{orderData.shippingFee}}</span></p>
            </div>
            <div class="foot-right">
              <!-- 未付款 -->
              <p  class="btn" v-show="orderData.payState==0&&orderData.orderState>=0" @click="qxdd">取消订单</p>
              <p  class="btn" v-show="orderData.orderState < 0" @click="deleteOrder">删除订单</p>
              <p  class="btn" v-show="orderData.payState==0&&orderData.orderState>=0" @click="PaymentOrder">付款</p>
              <!-- 已付款未发货,催发货 -->
              <p class="btn"
                v-show="orderData.payState==1&&orderData.shippingState==0&&orderData.orderState == 1"
                @click="remindOrder(orderData.isHurry )"
                >{{orderData.isHurry | isHurry}}</p>
              <!-- 已发货 -->
              <p class="btn" 
               v-show="orderData.shippingState == 1"
               @click="confirmOrder"
               >确认收货</p>
              <p 
                class="btn"
                v-show="orderData.shippingState == 1"
                @click="skipLogistics">
                查看物流</p>
                <!-- 已签收 -->
                 <p 
                class="btn" 
                  v-show="orderData.orderState == 4"
                @click="addOrderReturn">申请售后</p>
                   <p class="btn"
                   v-show="orderData.orderState == 4"
                    @click="evaluate">评价</p>
                      <!-- v-show="orderData.orderState == 4" -->
                            
            </div>
           <!-- v-show="orderData.shippingState==2&&orderData.orderState==0||
           orderData.shippingState==2&&orderData.orderState==1"-->
        </section>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast, paymentJjump } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      goodsIDs: {},
      orderData: {}, // 存储订单信息
      orderCommon: {},
      state: 0, // 订单列表页传递的状态
      orderId: 0, // 订单列表页传递过来的id
      orderIdObj: {}
    };
  },
  // 计算属性
  computed: {},
  methods: {
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 去地址选择页面
    toSelectionSite() {
      this.$router.push({ path: `/selection-site` });
    },
    // 选择
    check(item, index) {
      if (item.orderSn) {
        item.orderSn = false;
        this.goodsIDs[index] = item.recId;
      } else {
        item.orderSn = true;
        this.goodsIDs[index] = "";
      }
    },
    // 跳转
    skipRefund() {
      this.$router.push({ path: `/refund` });
    },
    // 跳转物流页面
    skipLogistics() {
      // this.$router.push({path: `/logistics/${id}`});   // 前往物流页面
      this.$router.push({ path: `/logistics/` + this.orderId });
    },
    // 订单详情信息
    findOrderById() {
      this.orderId = this.$route.params.Id;
      this.orderIdObj = {
        orderId: this.orderId
      };
      postData("/order/findOrderById", this.orderIdObj).then(res => {
        if (res.status == 200) {
          this.orderData = res.result.order; // 存储订单信息
          console.log(this.orderData, "订单详情信息");
          this.orderCommon = res.result.orderCommon;
          // this.setCurrentOrderData(res.result);
        }
      });
    },
    // 询问是否取消
    qxdd(orderId) {
      this.$confirm({
        title: " ",
        content: "确定取消订单?"
      })
        .then(() => {
          this.cancelOrder();
        })
        .catch(() => {});
    },
    // 取消订单
    cancelOrder() {
      postData("/order/cancelOrder", this.orderIdObj).then(res => {
        if (res.status == 200) {
          this.$router.back();
        }
      });
    },
    // 删除订单
    deleteOrder() {
      this.$confirm({
        title: " ",
        content: "确定删除订单?"
      })
        .then(() => {
          postData("/order/deleteOrder", this.orderIdObj).then(res => {
            if (res.status == 200) {
              this.$router.back();
            }
          });
        })
        .catch(() => {});
    },
    // 提醒发货
    remindOrder(isHurry) {
      if (isHurry == 1) {
        toast(this, "已提醒发货");
        return;
      } else {
        postData("/order/remindOrder", this.orderIdObj).then(res => {
          if (res.status == 200) {
            toast(this, "催货成功");
            this.orderData.isHurry = 1;
          }
        });
      }
    },
    // 支付订单
    PaymentOrder() {
      this.prePay();
    },
    //添加评价
    evaluate() {
      // 去往评价页面
      this.$router.push({ path: `/evaluate/` + this.orderId + "/" + 0 });
    },
    // 确认收货
    confirmOrder() {
      postData("/order/confirmOrder", this.orderIdObj).then(res => {
        if (res.status == 200) {
          this.$router.back();
        }
      });
    },
    // 申请退款
    addOrderReturn() {
      let info = [];
      for (let key in this.goodsIDs) {
        if (this.goodsIDs[key]) {
          info.push(this.goodsIDs[key]);
        }
      }
      if (!info.length) {
        this.$toast("请先选择要退款的商品");
        return;
      }
      console.log(info, "当前选中的info");
      localStorage.setItem("refundgood", JSON.stringify(info));
      this.$router.push({ path: `/refund/` + this.orderId });
    },
    // 微信支付方法
    // 支付接口
    prePay() {
      let data = {};
      // 余额 充值的时候 只传price 订单支付的时候传orderId 如果是购物车下单直接支付 传orderId 和 paySign 其中价钱是必传的
      // wxpay 微信支付 online 余额支付    微信支付 this.WeChatPay 余额支付 this.balance
      data.price = this.orderData.orderAmount; // price	    是		金额
      data.orderId = this.orderData.orderId; // orderId	否		订单ID 看api说明
      data.paySign = this.orderData.paySn; // paySign	否		订单交易号 看api说明
      postData(apiUrl().prePay, data).then(res => {
        if (res.status == 200) {
          if (res.result) {
            // 调用微信内容ajax 传参 支付
            this.ultimatePayment(res.result);
          }
        } else {
          toast(this, res.message);
        }
      });
    },
    // 调微信自带付款页面
    ultimatePayment(data) {
      let selfThis = this;
      console.log(selfThis, "当前的vue实例");
      // const jsApiCall = data => {
      //     WeixinJSBridge.invoke(
      //       "getBrandWCPayRequest",
      //       {
      //         appId: data.appId, // 公众号名称，由商户传入
      //         timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
      //         nonceStr: data.nonceStr, // 随机串
      //         package: data.package,
      //         signType: data.signType, // 微信签名方式：
      //         paySign: data.paySign //微信签名
      //       },
      //       // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      //       function(res) {
      //         this.resultPay(res); //   调用微信支付结果返回方法
      //       }
      //     );
      //   },
      //   callpay = () => {
      //     if (typeof WeixinJSBridge == "undefined") {
      //       if (document.addEventListener) {
      //         document.addEventListener(
      //           "WeixinJSBridgeReady",
      //           onBridgeReady,
      //           false
      //         );
      //       } else if (document.attachEvent) {
      //         document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
      //         document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
      //       }
      //     } else {
      //       onBridgeReady();
      //     }
      //   };
      // callpay(); // 调用支付!
      function onBridgeReady() {
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: data.appId, // 公众号名称，由商户传入
            timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: data.nonceStr, // 随机串
            package: data.package,
            signType: data.signType, // 微信签名方式：
            paySign: data.paySign //微信签名
          },
          function(res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              selfThis.$router.push({
                path: `/payment-hint`
              });
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
              toast(selfThis, "您已取消支付");
            } else if (res.err_msg == "get_brand_wcpay_request:fail") {
              toast(selfThis, "支付失败");
            }
          }
        );
      }
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener(
            "WeixinJSBridgeReady",
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    }
    // resultPay(res) {
    //   console.log("进入调用微信支付结果返回方法", res);
    //   if (res.err_msg == "get_brand_wcpay_request:ok") {
    //     toast(this, "支付成功");
    //     // this.toSucceed();
    //     paymentJjump("payment-hint");
    //   } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
    //     toast(this, "您已取消支付");
    //     //  this.toOrder();
    //     paymentJjump("order/0");
    //   } else if (res.err_msg == "get_brand_wcpay_request:fa") {
    //     toast(this, "支付失败");
    //     // this.toOrder();
    //     paymentJjump("order/0");
    //   }
    // },
    /*
    toSucceed() {
      this.$router.push({ path: `/payment-hint` });
    },
    toOrder() {
      this.$router.push({ path: `/order/0` }); // 去全部订单页面
    }*/
    // ...mapMutations({
    //   setCurrentOrderData: "SET_CURRENTORDERDATA"
    // })
    // toSucceed() {
    //   paymentJjump("/payment-hint");
    // },
    // toOrder() {
    //   paymentJjump("/order/0");
    // }
  },
  // 过滤器
  filters: {
    payFilter: function(value) {
      if (value == "wxpay") {
        return "微信支付";
      } else if (value == "online") {
        return "余额支付";
      }
    },
    isHurry: function(value) {
      if (value != 1) {
        return "提醒发货";
      } else {
        return "已提醒发货";
      }
    }
  },

  created() {
    this.findOrderById();
  },
  // 动态监听
  watch: {
    $route(n) {
      // 判断是否undefined
      if (n.path.indexOf("order-details") !== -1) {
        this.goodsIDs = [];
        this.findOrderById();
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.order-details-container {
  //@include size(100%, auto);
  width: 100%;
  /*height: auto;*/
  height: 1020px;
  overflow-y: auto;
  margin: 0 auto;
  @include box-sizing;
  padding: 0 0 10px 0;
}
// 地址
.clearing-site {
  @include size(100%, auto);
  margin: 0 0 20px 0;
  background: #fff;
  @include box-sizing;
  padding: 26px 30px 20px;
  position: $rela;
  p:nth-of-type(1) {
    @include size(640px, 58px);
    @include font(30px, 58px, normal, left, #333);
    @include text-over;
    span:nth-of-type(1) {
      margin: 0 20px 0 0;
    }
  }
  p:nth-of-type(2) {
    @include size(640px, auto);
    @include font(26px, 56px, normal, left, #666);
  }
  p:nth-of-type(3) {
    @include size(80px, 80px);
    @include font(32px, 80px, normal, center, #aaa);
    position: $abso;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto 0;
  }
}
p.btn {
  @include size(160px, 72px);
  border-radius: 60px;
  @include font(28px, 72px, normal, center, #71b42e);
  background: #fff;
  border: 2px solid #71b42e;
  margin: 20px 0 0 20px;
  float: right;
}
// 订单列表
.order-details-wrap {
  @include size(100%, auto);
  margin: 0 auto;
  article.order-details-box:last-child {
    margin: 0 auto 30px;
  }
  .order-details-box {
    // @include size(100%, 240px);
    @include size(100%, auto);
    @include box-sizing;
    background: #fff;
    margin: 0 auto 10px;
    padding: 0 30px;
    position: $rela;
  }
  .order-details-box.active {
    padding: 0 30px 0 90px;
  }
  .order-select {
    display: block;
    position: $abso;
    top: 0;
    left: 30px;
    bottom: 0;
    margin: auto 0;
    @include size(40px, 40px);
    float: left;
    border-radius: 50%;
    border: 2px solid #ababab;
    background: #fff;
    @include font(40px, 40px, normal, center, #fff);
  }
  .order-select.active {
    border: 2px solid #8ec25a;
    background: #8ec25a;
  }
  .order-details-pic {
    @include size(220px, 220px);
    float: left;
    margin: 10px 10px;
    overflow: hidden;
    // background: red;
    img {
      width: 100%;
    }
  }
  .order-details-con {
    @include size(65%, 240px);
    float: left;
    .btn {
      width: 120px;
      text-align: center;
      position: absolute;
      margin: auto;
      bottom: 5px;
      right: 2px;
    }

    h4 {
      @include size(100%, auto);
      @include box-sizing;
      padding: 20px 0 0 0;
      @include font(28px, 40px, normal, left, #333);
      @include txtover(2);
    }
    p {
      @include size(100%, 60px);
      @include font(24px, 60px, normal, left, #999);
      @include text-over;
    }
    div {
      @include size(100%, 70px);
      @include font(26px, 70px, normal, left, #f0555a);
    }
    em {
      font-style: normal;
      font-size: 22px;
    }
    span:nth-of-type(1) {
      float: left;
    }
    span:nth-of-type(2) {
      float: right;
      color: #999;
    }
  }
  .bottomBox {
    @include size(100%, 100px);
    display: block;
    float: left;
    background: #fff;
    border-top: 2px solid #e8e8e8;

    .btn {
      @include size(160px, 64px);
      @include box-sizing;
      border-radius: 60px;
      float: right;
      border: 2px solid #8ec25a;
      @include font(28px, 60px, normal, center, #fff);
      margin: 20px 0 0 20px;
      background: #8ec25a;
    }
  }
}
// 订单信息
.order-details-info {
  @include size(100%, auto);
  margin: 0 auto 30px;
  background: #fff;
  @include box-sizing;
  padding: 15px 30px;
  li {
    @include size(100%, 56px);
    @include font(26px, 56px, normal, left, #333);

    span {
      display: block;
      @include size(20%, 56px);
      float: left;
    }
    p {
      display: block;
      @include size(80%, 56px);
      float: left;
      color: #999;
    }
  }
}
// 订单底部
.order-details-foot {
  @include size(100%, 110px);
  background: #fff;
  position: $fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  @include box-sizing;
  padding: 0 30px;

  .foot-left {
    @include size(330px, 110px);
    float: left;
    @include box-sizing;
    padding: 10px 0;

    p:nth-of-type(1) {
      @include size(100%, 48px);
      @include font(28px, 48px, normal, left, #666);

      span {
        color: #f0555a;
      }
    }
    p:nth-of-type(2) {
      @include size(100%, 42px);
      @include font(24px, 48px, normal, left, #999);
    }
  }
  .foot-right {
    display: flex;
    justify-content: flex-end;
  }

  p.btn:nth-last-child(1) {
    margin: 20px 0 0 0;
  }
  p.btn.active {
    background: #71b42e;
    border: 2px solid #71b42e;
    @include font(28px, 72px, normal, center, #fff);
  }
}
</style>