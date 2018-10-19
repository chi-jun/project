<template>
    <div class="recharge-container clearfix">
        <form action="" class="recharge-wrap">
            <section class="recharge-box">
                <div class="recharge-list">
                    <label for="">充值金额</label>
                    <input type="number" class="" v-model.trim="price" @keyup="onlyNumber(price)" id=""
                           placeholder="请输入您要充值的金额">
                </div>
                <!--
                <div class="recharge-list">
                    <label for="">应付金额</label>
                    <p class="info">￥20.00</p>
                </div> -->
            </section>
            <h2 class="recharge-headline">支付方式</h2>
            <div class="recharge-select active">
                <i class="iconfont icon-gou"></i>
                <span>微信支付</span>
            </div>

            <div class="submit-wrap" @click="recharge">
                <p>立即充值</p>
            </div>
        </form>
        <!-- 验证提示 -->
        <div class="invoice-reminder" :class="reminder?'active':''">
            {{ msg }}
        </div>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      resultData: {}, // 当前请求回来的数据
      price: "",
      msg: "",
      reminder: false
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
    // 跳转
    skipRefund() {
      this.$router.push({ path: `/refund` });
    },
    recharge() {
      if (this.price) {
        let data = {
          price: this.price
        };
        postData("/weChat/prePay", data).then(response => {
          if (response.status == 200) {
            console.log(response, "微信支付结果!");
            if (
              response.result != "" ||
              response.result != undefined ||
              response.result != null
            ) {
              // 调用微信内容ajax 传参 支付
              this.ultimatePayment(response.result);
            }
          } else {
            toast(this, "支付接口请求失败");
          }
        });
      } else {
        toast(this, "请输入金额");
      }
    },
    onlyNumber() {
      //修复第一个字符是小数点 的情况.
      if (this.price != "" && this.price.substr(0, 1) == ".") {
        this.price = "";
      }
      this.price = this.price.replace(/^0*(0\.|[1-9])/, "$1"); //解决 粘贴不生效
      this.price = this.price.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      this.price = this.price.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      this.price = this.price
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this.price = this.price.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
      if (this.price.indexOf(".") < 0 && this.price != "") {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (this.price.substr(0, 1) == "0" && this.price.length == 2) {
          this.price = this.price.substr(1, this.price.length);
        }
      }
    },
    // 调微信自带付款页面
    ultimatePayment(data) {
      const jsApiCall = data => {
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
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            function(res) {
              console.log("微信充值返回值", res);
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                toast(this, "支付成功");
                // this.paymentWay = false;
                setTimeout(() => {
                  this.$router.push({ path: `/payment-hint` });
                }, 500);
                // 去支付成功页面
              } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                toast(this, "您已取消支付");
                setTimeout(() => {
                  this.$router.push({ path: `/balance` });
                }, 500);
                // 去充值页面
              } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                toast(this, "支付失败,请重试");
                setTimeout(() => {
                  this.$router.push({ path: `/balance` });
                }, 500); // 关闭支付界面
                // 去充值页面
              }
            }
          );
        },
        callpay = data => {
          console.log("调用微信充值接口");
          if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
              document.addEventListener(
                "WeixinJSBridgeReady",
                jsApiCall(data),
                false
              );
            } else if (document.attachEvent) {
              document.attachEvent("WeixinJSBridgeReady", jsApiCall(data));
              document.attachEvent("onWeixinJSBridgeReady", jsApiCall(data));
            }
          } else {
            jsApiCall(data);
          }
        };

      callpay(data); // 调用支付!
    }
  },
  // 过滤器
  filters: {
    payFilter: function(value) {
      if (value == "wx_pay") {
        return "微信支付";
      } else if (value == "online") {
        return "余额支付";
      }
      console.log(value);
    }
  },
  components: {},
  created() {
    // 初始化页面进入时 获取当前路由从上一个页面传过来的状态
    console.log(
      "params.state:" +
        this.$route.params.state +
        "params.id:" +
        this.$route.params.Id
    );
    this.state = this.$route.params.state; // 状态
    this.orderId = this.$route.params.Id; // id
  },
  // 动态监听
  watch: {
    $route(n) {
      // 判断是否undefined
      if (this.$route.params.Id && this.$route.params.state) {
        // "evaluationState": 0,//0未评价 1已评价 2过期未评价
        console.log(
          "params.state:" +
            this.$route.params.state +
            "params.id:" +
            this.$route.params.Id
        );
        this.state = this.$route.params.state; // 状态
        this.orderId = this.$route.params.Id; // id
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.recharge-container {
  @include size(100%, auto);
  @include box-sizing;
  margin: 0 auto -100px;
}

.recharge-wrap {
  @include size(100%, auto);
  margin: 0 auto;

  input {
    @include box-sizing;
    margin: 0;
    padding: 0;
    border: 0;
    resize: none;
    outline: none;
  }
}

.recharge-box {
  @include size(100%, auto);
  background: #fff;
  @include box-sizing;
  padding: 0 30px;
  margin: 0 0 18px 0;

  div.recharge-list {
    @include size(100%, 102px);
    @include box-sizing;
    border-bottom: 1px solid #ddd;
    label {
      display: block;
      @include size(184px, 102px);
      @include font(28px, 102px, normal, left, #333);
      float: left;
    }
    input {
      @include size(504px, 60px);
      @include font(28px, 60px, normal, left, #999);
      margin: 20px 0 0 0;
      background: #fff;
    }
    .info {
      @include size(504px, 102px);
      float: left;
      @include font(28px, 102px, normal, left, #f0555a);
    }
  }
  div.recharge-list:last-child {
    border: 0;
  }
}

.recharge-headline {
  @include size(100%, 70px);
  @include font(30px, 70px, normal, left, #333);
  @include box-sizing;
  padding: 0 30px;
}

.recharge-select {
  @include size(100%, 100px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;

  i.iconfont {
    display: block;
    @include size(40px, 40px);
    border: 2px solid #acacac;
    border-radius: 50%;
    float: left;
    margin: 30px 20px 0 0;
    @include font(40px, 40px, normal, center, #fff);
    background: #fff;
    transition: all 0.2s ease;
  }
  span {
    display: block;
    float: left;
    @include size(280px, 100px);
    @include font(28px, 100px, normal, left, #666);
  }
}

.recharge-select.active {
  i.iconfont {
    background: #8ec25a;
    border: 2px solid #8ec25a;
  }
}

.submit-wrap {
  @include size(100%, 80px);
  margin: 100px auto 30px;
  @include box-sizing;
  padding: 0 30px;

  p {
    @include size(100%, 80px);
    border-radius: 60px;
    background: #8ec25a;
    @include font(26px, 80px, normal, center, #fff);
  }
}

// 提示框
.invoice-reminder {
  @include size(470px, 120px);
  background: #fff;
  position: $fixed;
  top: -200%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 100;
  transition: all 0.2s ease;
  border-radius: 12px;
  -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  @include font(28px, 120px, normal, center, #fff);
  @include box-sizing;
  background: rgba(0, 0, 0, 0.6);
}

.invoice-reminder.active {
  top: 0;
}
</style>