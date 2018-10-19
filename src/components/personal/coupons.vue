<template>
    <div class="coupons-container clearfix">
        <ul class="coupons-menu">
            <li :class="{'active': index == menuNum}" v-for="(item, index) in menuTxt" @click="switcher(index)">
                <p>{{ item }}</p>
            </li>
        </ul>

        <!-- 可用优惠卷 -->
        <section class="coupons-wrap" v-show="menuNum == 0">
            <!-- 给article加active 是选中状态 -->
            <div class="coupons-list red active" v-for="item in resultdatas" @click="toGoodList(item.activityCoupon.gcId1)">
                <div class="coupons-box">
                    <p class="price">￥{{item.activityCoupon.cutMoney}}</p>
                    <p class="rule">满{{item.activityCoupon.filledMoney}}元减{{item.activityCoupon.cutMoney}}元（{{item.activityCoupon.gcName}}商品专用）</p>
                </div>
                <p class="coupons-info">
                    有效期：{{item.endTime}}
                </p>
                <!--<p class="select"><i class="iconfont icon-gou"></i></p>-->
                <p class="hint">立即使用</p>
            </div>
        </section>
        <!-- 不可用优惠卷 -->
        <section class="coupons-wrap" v-show="menuNum == 1">
            <article class="coupons-list golden" v-for="item in resultdatas">
                <div class="coupons-box">
                    <p class="price">￥{{item.activityCoupon.cutMoney}}</p>
                    <p class="rule">满{{item.activityCoupon.filledMoney}}元减{{item.activityCoupon.cutMoney}}元（{{item.activityCoupon.gcName}}商品专用）</p>
                </div>
                <p class="coupons-info">
                    有效期：{{item.endTime}}
                </p>
                <!--<p class="select"><i class="iconfont icon-gou"></i></p>-->
                <p class="hint">已使用</p>
            </article>

        </section>


        <!-- 已过期优惠卷 -->
        <section class="coupons-wrap" v-show="menuNum == 2">
            <article class="coupons-list gray" v-for="item in resultdatas">
                <div class="coupons-box">
                    <p class="price">￥{{item.activityCoupon.cutMoney}}</p>
                    <p class="rule">满{{item.activityCoupon.filledMoney}}元减{{item.activityCoupon.cutMoney}}元（{{item.activityCoupon.gcName}}商品专用）</p>
                </div>
                <p class="coupons-info">
                    有效期：{{item.endTime}}
                </p>
                <!--<p class="select"><i class="iconfont icon-gou"></i></p>-->
                <p class="hint">已过期</p>
            </article>
        </section>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
export default {
  data() {
    return {
      menuTxt: ["未使用", "已使用", "已过期"], // 菜单内容
      menuNum: 0, // 订单列表页传递的状态
      resultdatas: ""
    };
  },
  methods: {
    switcher(i) {
      this.menuNum = i;
      if (i == 0) {
        this.getActivityCouponRecordCondition(1, 1);
      } else if (i == 1) {
        this.getActivityCouponRecordCondition(1, 0);
      } else if (i == 2) {
        this.getActivityCouponRecordCondition(1, 2);
      }
    },
    getActivityCouponRecordCondition(pageNo, state) {
      let data = {
        pageNo: pageNo,
        pageSize: 9999,
        state: state
      };
      postData("/member/getActivityCouponRecordCondition", data).then(res => {
        if (res.status == 200) {
          this.resultdatas = res.result.resultList;
        }
      });
    },
    toGoodList(gcId1) {
      this.$router.push("choose-list/" + gcId1);
    }
  },
  // 计算属性
  computed: {},
  // 过滤器
  filters: {
    payFilter: function(value) {
      if (value == "wx_pay") {
        return "微信支付";
      } else if (value == "online") {
        return "余额支付";
      }
    }
  },
  created() {
    this.getActivityCouponRecordCondition(1, 1);
  },
  // 动态监听
  watch: {
    $route(n) {
      if (n.path.indexOf("/coupons") !== -1) {
        this.menuNum = 0;
        this.getActivityCouponRecordCondition(1, 1);
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.coupons-container {
  @include size(100%, auto);
  @include box-sizing;
  padding: 80px 0 0 0;
  margin: 0 auto -100px;
}
// 顶部菜单
.coupons-menu {
  @include size(100%, 88px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;
  position: $fixed;
  top: 88px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 50;
  display: table;
  border-bottom: 1px solid #ddd;

  li {
    display: table-cell;
    height: 88px;
    @include box-sizing;
    transition: all 0.2s ease;
    position: $rela;

    p {
      @include size(60%, 88px);
      margin: 0 auto;
      @include font(30px, 88px, normal, center, #666);
    }
  }
  li:before {
    content: "";
    display: block;
    @include size(2px, 40px);
    position: $abso;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto 0;
    background: #ddd;
  }
  li:last-child:before {
    display: none;
  }
  li.active {
    p {
      @include font(30px, 88px, normal, center, #8ec25a);
      border-bottom: 4px solid #8ec25a;
    }
  }
}
// 优惠卷
.coupons-wrap {
  @include size(100%, auto);
  @include box-sizing;
  padding: 30px 30px 0;
  margin: 0 auto;

  .coupons-list {
    @include size(100%, 300px);
    border-radius: 10px;
    position: $rela;
    margin: 0 auto 40px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    background: #fff;
    .coupons-box {
      @include size(555px, 206px);
      float: left;
      position: $rela;
      @include box-sizing;
      padding: 20px 0 35px 30px;
    }
    .coupons-box:before {
      display: block;
      content: "";
      @include size(555px, 10px);
      position: $abso;
      left: 0;
      right: 0;
      bottom: -2px;
      margin: 0 auto;
      z-index: 1;
      background: url("../../assets/images/coupons/coupons-box.png") no-repeat
        center / 530px 10px;
    }
    .price {
      @include size(100%, 86px);
      @include font(46px, 86px, normal, left, #fff);
    }
    .rule {
      @include size(100%, 90px);
      @include font(24px, 45px, normal, left, #fff);
      @include txtover(2);
    }
    .select {
      @include size(40px, 40px);
      position: $abso;
      top: 0;
      bottom: 0;
      right: 48px;
      margin: auto 0;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      border: 2px solid #acacac;
      @include font(40px, 40px, normal, center, #fff);
      background: #fff;
    }
    .hint {
      @include size(30px, 74px);
      position: $abso;
      top: 0;
      bottom: 0;
      right: 50px;
      margin: auto 0;
      @include font(20px, 28px, normal, center, #aaa);
    }
  }
  .coupons-list.active {
    .select {
      border: 2px solid #8ec25a;
      background: #8ec25a;
    }
  }
  .coupons-info {
    @include size(100%, 94px);
    @include font(22px, 94px, normal, left, #999);
    float: left;
    @include box-sizing;
    padding: 0 0 0 30px;
  }
  .coupons-list:before,
  .coupons-list:after {
    display: block;
    content: "";
    position: $abso;
    @include size(60px, 30px);
    background: #eee;
    z-index: 10;
  }
  .coupons-list:before {
    top: 0px;
    right: 108px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  .coupons-list:after {
    bottom: 0px;
    right: 108px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
  }
  // 未使用
  .coupons-list.red {
    .coupons-box {
      background: linear-gradient(to top right, #e42702, #ff9697);
    }
  }
  // 已使用
  .coupons-list.golden {
    .coupons-box {
      background: linear-gradient(to top right, #827354, #cebfa0);
    }
  }
  // 已过期
  .coupons-list.gray {
    .coupons-box {
      background: linear-gradient(to top right, #737373, #c0c0c0);
    }
  }
}
</style>