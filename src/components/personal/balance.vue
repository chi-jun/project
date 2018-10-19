<template>
    <div class="balance-container clearfix">
        <section class="balance-head">
            <p class="balance">{{resultDataS.availablePredeposit}}<span>元</span></p>
            <router-link to="/recharge" class="goto-recharge">充值</router-link>
        </section>
        <h2 class="balance-headline">消费明细</h2>
        <ul class="balance-wrap">
            <li class="balance-box">
                <p>创建时间</p>
                <p>收支(元)</p>
                <p>变更说明</p>
            </li>
            <li class="balance-box" v-if="resultData.length > 0" v-for="(item, index) in resultData">
                <p>{{ item.lgAddTime }}</p>
                <p>{{ item.lgAvAmount }}</p>
                <p>{{ item.lgType | lgTypeFiler }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast} from "@/constant/api";

export default {
  data() {
    return {
      resultData: {}, // 当前请求回来的数据
      resultDataS: {}
    };
  },
  methods: {
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    findMemberInfo() {
          this.findMemberPdLog(1);
      postData("/member/findMemberInfo").then(res => {
        if (res.status === "200") {
          this.resultDataS = res.result;
        } else if (res.status === "400") {
          toast(this,res.message);
        }
      });
    },

    // 获取当前所有的消费明细
    findMemberPdLog(pageNo) {
      let data = {
        pageNo: pageNo,
        pageSize: 9999,
      };
      postData("/member/findMemberPdLog", data).then(res => {
        if (res.status == 200) {
          this.resultData = res.result.resultList;
        }
      });
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
    },
    lgTypeFiler: function(value) {
      if (value == 1) {
        return "充值";
      } else if (value == 2) {
        return "提现";
      } else if (value == 3) {
        return "订单支付";
      } else if (value == 4) {
        return "退款";
      }
    },
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  },
  components: {},
  created() {
    this.findMemberInfo();
  },
  // 动态监听
  watch: {
    $route(n) {
      if (n.path == "/balance") {
        this.findMemberInfo();
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.balance-container {
    @include size(100%, auto);
    @include box-sizing;
    margin: 0 auto -100px;
}
.balance-head {
  @include size(100%, 360px);
  background: url("../../assets/images/personal/balance-bg.png") no-repeat center / 100%;
  margin: 0 auto 20px;
  @include box-sizing;
  padding: 36px 0 0 0;
    position: fixed;
    top: 88px;
    left: 0;
    right: 0;
    margin: 0 auto;
  // background: red;

  .balance {
    @include size(100%, 172px);
    @include font(50px, 172px, normal, center, #fff);

    span {
      @include font(24px, 172px, normal, center, #ddd);
    }
  }
  .goto-recharge {
    display: block;
    @include size(200px, 72px);
    @include font(28px, 72px, normal, center, #fff);
    background: #eec934;
    margin: 0 auto;
    border-radius: 60px;
  }
}
.balance-headline {
  @include size(100%, 68px);
  @include font(28px, 68px, normal, left, #333);
  @include box-sizing;
  padding: 0 30px;
}
.balance-wrap {

    position: fixed;
    top: 468px;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    overflow-y: auto;

  @include size(100%, auto);
  @include box-sizing;
  background: #fff;
  li {
    @include size(100%, 100px);
    @include box-sizing;
    border-bottom: 1px solid #ddd;
    @include font(24px, 100px, normal, center, #999);
    p {
      @include size(33%, 100px);
      display: inline-block;
    }
    p:nth-of-type(1) {
      float: left;
    }
    p:nth-of-type(2) {
      margin: 0 auto;
    }
    p:nth-of-type(3) {
      float: right;
    }
  }
  li:last-child {
    border: 0;
  }
  li {
    p:nth-of-type(2) {
      color: #333;
    }
  }
  li:nth-of-type(1) {
    color: #666;
    p:nth-of-type(2) {
      color: #666;
    }
  }
}
</style>