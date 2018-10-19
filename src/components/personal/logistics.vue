<template>
    <div class="logistics-container clearfix">
        <!-- 物流信息展示 -->
        <section class="logistics-wrap">
            <div class="logistics-pic">
                <img :src="orderData.orderGoods[0].goodsImage" alt="商品图片">
            </div>
            <div class="logistics-con">
                <h2>{{orderData.shippingState | shippingState}}</h2>
                <p>运单号码：{{orderData.shippingCode}}</p>
            </div>
        </section>
        <div class="logistics-box">
            <iframe src="http://m.kuaidi100.com/index.jsp?from=openv" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
export default {
  methods: {
    // 订单详情信息
    findOrderById() {
      this.orderId = this.$route.params.logId;
      this.orderIdObj = {
        orderId: this.orderId
      };
      postData("/order/findOrderById", this.orderIdObj).then(res => {
        if (res.status == 200) {
          this.orderData = res.result.order; // 存储订单信息
          console.log(this.orderData,'----订单信息')
          this.orderCommonData = res.result.orderCommon;
        }
      });
    }
  },
  data() {
    return {
      orderId: "",
      orderData: "",
      rderCommonData: ""
    };
  },
  created() {
    this.findOrderById();
  },
  // 动态监听
  watch: {
    $route(n) {
      // 判断是否undefined
      if (this.$route.params.logId) {
         this.findOrderById();
      }
    }
  },
  // 过滤器
  filters: {
    shippingState: function(value) {
      if (value == 0) {
        return "未发货";
      } else if (value == 1) {
        return "已发货";
      } else if (value == 2) {
        return "已签收";
      } else if (value == 3) {
        return "退货中";
      } else if (value == 4) {
        return "已退货";
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.logistics-container {
  @include size(100%, 1120px);
  @include box-sizing;
  margin: 0 auto -100px;
}
.logistics-wrap {
  @include size(100%, 240px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;
  margin: 0 0 30px 0;

  .logistics-pic {
    @include size(220px, 220px);
    margin: 10px auto 10px;
    float: left;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .logistics-con {
    @include size(470px, 240px);
    @include box-sizing;
    padding: 44px 0 0 0;
    float: left;
    h2 {
      @include size(100%, 60px);
      @include font(28px, 60px, normal, left, #8ec25a);
      @include text-over;
      margin: 0 0 10px 0;
    }
    p:nth-of-type(1),
    p:nth-of-type(2) {
      @include size(100%, 46px);
      @include font(24px, 46px, normal, left, #666);
    }
  }
}
.logistics-box {
  @include size(100%, 860px);

  iframe {
    @include size(100%, 100%);
  }
}
</style>