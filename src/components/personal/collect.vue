<template>
  <div class="collect-container clearfix">
    <section
      class="collect-wrap"
      v-if="resultData.length > 0"
      v-for="(item, index) in resultData"
      @click="skipTarget(item.productId,item.skuId)"
    >
      <div class="collect-pic">
        <img :src="item.productAdImg" alt="收藏列表图片">
      </div>
      <div class="index-discounts-wrap">
        <h4 class="index-discounts-title">
          {{ item.title }}
        </h4>
        <p class="index-discounts-info">
          {{ item.description }}
        </p>
        <p class="index-discounts-tag">
          <span v-show="item.isPackage == 1">包邮</span>
          <span v-show="item.isCheap == 1">特价</span>
          <span v-show="item.isAct == 1">活动</span>
          <span v-show="item.isTimeDiscount == 1">限时优惠</span>
        </p>
        <div class="index-discounts-money">
          <p class="money">￥<span>{{ item.realPrice }}</span></p>
          <p class="inventory">(库存:{{ item.skuId }}件)</p>
        </div>
        <p class="cancel-btn" @click.stop="cancelCollect(item.productId)"><i></i><span>取消收藏</span></p>
      </div>
    </section>
  </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      resultData: {} // 当前请求回来的数据
    };
  },
  // 计算属性
  computed: {
    ...mapGetters(["address"])
  },
  methods: {
    // 设置vuex的数据
    ...mapMutations({
      setAddress: "SET_ADDRESS"
    }),
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 取消收藏按钮
    cancelCollect(id) {
      // 发送取消删除请求
      // console.log(id)
      let num = 0;
      // 循环比对删除数据
      this.resultData.forEach((e, i) => {
        // console.log(e.productId)
        if (e.productId == id) {
          num = i;
        }
      });
      this.resultData.splice(num, 1);
      this.deleteMyFavor(id);
    },
    /*取消收藏*/
    deleteMyFavor(id) {
      let data = {
        id: id
      };
      postData("/member/deleteMyFavor", data).then(res => {
        console.log(res.message);
      });
    },
    findMyFavor(pageNo) {
      let data = {
        pageNo: pageNo,
        pageSize: 9999,
      };
      postData("/member/findMyFavor", data).then(res => {
        console.log(res.result.resultList, "收藏数据");
        this.resultData = res.result.resultList;
      });
    },
    skipTarget(productId, skuId) {
      this.$router.push({ path: `/goods-details/${productId}/${skuId}` });
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
    this.findMyFavor(1);
  },
  // 动态监听
  watch: {
    $route(n) {
      if (n.path.indexOf("collect") !== -1) {
        this.findMyFavor(1);
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.collect-container {
  @include size(100%, auto);
  @include box-sizing;
  margin: 0 auto -100px;

  section:last-child {
    margin: 0 auto;
  }
}

.collect-wrap {
  @include size(100%, 240px);
  margin: 0 auto 20px;
  background: #fff;
  @include box-sizing;
  padding: 0 30px;
  position: $rela;

  .collect-pic {
    @include size(220px, 220px);
    margin: 10px 0 10px 0;
    float: left;
    position: $rela;
    overflow: hidden;
    img {
      width: 100%;
      display: block;
      position: $abso;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
  }

  .index-discounts-wrap {
    @include size(66%, 220px);
    float: right;
  }

  .index-discounts-title {
    @include size(100%, auto);
    @include font(28px, 42px, normal, left, #333);
    @include txtover(2);
    @include box-sizing;
    padding: 10px 0 0 0;
  }
  .index-discounts-info {
    @include size(100%, 62px);
    @include font(22px, 62px, normal, left, #999);
    @include text-over;
  }

  .index-discounts-tag {
    @include size(380px, 38px);
    overflow: hidden;
    span {
      display: inline-block;
      height: 38px;
      padding: 0 8px;
      border-radius: 12px;
      border: 2px solid #71b42e;
      @include box-sizing;
      @include font(22px, 32px, normal, left, #71b42e);
      margin: 0px 20px 0 0;
    }
  }

  .index-discounts-money {
    @include size(380px, 54px);
    line-height: 54px;

    .money {
      display: inline-block;
      color: #f0555a;
      font-size: 18px;

      span {
        font-size: 26px;
        line-height: 50px;
      }
    }
    .inventory {
      display: inline-block;
      color: #999;
      font-size: 22px;
    }
  }
  .cancel-btn {
    @include size(96px, 90px);
    display: inline-block;
    position: $abso;
    right: 30px;
    bottom: 0px;
    i,
    span {
      display: block;
    }
    i {
      @include size(40px, 40px);
      margin: 0 auto;
      background: url("../../assets/images/goods-details/collect2.png")
        no-repeat center / 40px 38px;
    }
    span {
      @include size(100%, 44px);
      @include font(24px, 44px, normal, center, #666);
      margin: 0 auto;
    }
  }
}
</style>
