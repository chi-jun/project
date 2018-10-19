<template>
    <div class="personal-container clearfix" v-show="showCenter">
        <div class="personal-head">
            <div class="personal-head-pic" @click="toPersonalData">
                <img :src="resultData.memberAvatar" alt="网络故障">
            </div>
            <div class="personal-head-sign">
                <span>{{resultData.memberName}}</span>
                <span>{{resultData.grade == 0 ? '普通会员' : 'vip会员'}}</span>
            </div>
            <ul class="personal-balance-wrap">
                <li>
                <router-link tag="div" :to="'/balance'">
                    <p><span>{{resultData.availablePredeposit}}</span>元</p>
                    <p>余额</p>
                </router-link>
                </li>
                <li >
                <router-link tag="div" to="/coupons">
                    <p><span>{{coupons}}</span>张</p>
                    <p>优惠券</p>
                 </router-link>   
                </li>
            </ul>
        </div>

        <div class="personal-order">
            <h2 class="personal-order-head">
                全部订单
                <router-link to="/order/0">查看全部订单></router-link>
            </h2>
            <ul class="personal-order-con">
                <router-link :to="item.url" tag="li" v-for="(item, index) in personalOrder" :key="item.id">
                    <p class="personal-order-icon">
                        <i class="iconfont" :class="item.icon"></i>
                    </p>
                    <p class="personal-order-text">{{item.name}}</p>
                </router-link>
            </ul>
        </div>

        <ul class="personal-list-wrap">
            <router-link :to="item.url" tag="li" v-for="(item, index) in personalList" :key="item.id">
                <i class="iconfont left" :class="item.icon"></i>
                <p>{{ item.name }}</p>
                <i class="iconfont icon-you right"></i>
            </router-link>
        </ul>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
/*  import personData from 'components/personal/personal-data'*/
export default {
  data() {
    return {
      showCenter: true,
      coupons: "",
      resultData: {}, // 数据储存
      personalOrder: [
        // 订单
        {
          name: "待付款",
          icon: "icon-fukuan",
          url: "/order/1"
        },
        {
          name: "待发货",
          icon: "icon-baoguocopy",
          url: "/order/2"
        },
        {
          name: "配送中",
          icon: "icon-yunshu",
          url: "/order/3"
        },
        {
          name: "完成订单",
          icon: "icon-dingdan",
          url: "/order/4"
        },
        {
          name: "售后",
          icon: "icon-shouhou",
          url: "/order/5"
        }
      ],
      personalList: [
        // 个人中心列表
        {
          name: "我的收藏",
          icon: "icon-star",
          url: "/collect"
        },
        {
          name: "地址管理",
          icon: "icon-dizhi1",
          url: "/address"
        },
        {
          name: "联系客服",
          icon: "icon-kefu",
          url: "/notescontact"
        }
      ]
    };
  },
  // 计算属性
  computed: {},
  methods: {
    // 前往个人资料页面
    toPersonalData() {
      this.$router.push({ path: "/personal-data" });
    },
    findMemberInfo() {
      postData("/member/findMemberInfo").then(res => {
        if (res.status === "200") {
          this.resultData = res.result;
          console.log(this.resultData, "个人信息");
        } else if (res.status === "400") {
          toast(this, res.message);
        }
      });
    },
    getActivityCouponRecordCondition(pageNo, state) {
      let data = {
        pageNo: pageNo,
        pageSize: 9999,
        state: state
      };
      postData("/member/getActivityCouponRecordCondition", data).then(res => {
        if (res.status == 200) {
          this.coupons = res.result.rowCount;
        }
      });
    }
  },
  components: {},
  created() {
    this.findMemberInfo();
    this.getActivityCouponRecordCondition(1, 1);
  },
  // 动态监听
  watch: {
    $route(n) {
      if (n.path == "/personal") {
        this.findMemberInfo();
        this.getActivityCouponRecordCondition(1, 1);
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.personal-container {
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.personal-head {
  @include size(100%, 530px);
  margin: -88px 0 20px 0;
  background: #fff url("../../assets/images/personal/personal-head.png")
    no-repeat top center / 100% 312px;
  overflow: hidden;
  @include box-sizing;
  padding: 0 30px;

  .personal-head-pic {
    @include size(160px, 160px);
    border-radius: 50%;
    overflow: hidden;
    margin: 122px auto 50px;
    img {
      display: block;
      width: 100%;
    }
  }
  .personal-head-sign {
    @include size(100%, 48px);
    @include font(30px, 48px, normal, center, #333);

    span:nth-of-type(2) {
      display: inline-block;
      height: 48px;
      padding: 0 40px;
      border-radius: 48px;
      border: 2px solid #eec934;
      @include font(22px, 46px, normal, center, #eec934);
      @include box-sizing;
      margin: 0 0 0 20px;
    }
  }
  .personal-balance-wrap {
    @include size(100%, 150px);
    li:nth-of-type(1):before {
      content: "";
      display: block;
      @include size(2px, 50px);
      background: #ddd;
      position: $abso;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto 0;
    }
    li {
      display: flex !important;
      justify-content: center;
      float: left;
      display: inline-block;
      @include size(50%, 150px);
      position: $rela;
      // background: #F8D8D8;
      div {
        width: 60%;
        p {
          @include size(100%, 75px);
          @include font(22px, 75px, normal, center, #999);
          @include text-over;
          span {
            font-size: 28px;
            color: #333;
          }
        }
        p:nth-of-type(1) {
          line-height: 100px;
        }
        p:nth-of-type(2) {
          line-height: 50px;
        }
      }
    }
  }
}

.personal-order {
  @include size(100%, 236px);
  @include box-sizing;
  padding: 0 30px;
  margin: 0 auto 20px;
  background: #fff;
  .personal-order-head {
    @include size(100%, 90px);
    @include box-sizing;
    border-bottom: 1px solid #ddd;
    @include font(28px, 90px, normal, left, #333);
    a {
      float: right;
      @include font(24px, 90px, normal, left, #8ec25a);
    }
  }
  .personal-order-con {
    @include size(100%, 146px);
    li {
      display: inline-block;
      @include size(120px, 146px);
      float: left;
      margin-right: 22px;
      @include box-sizing;
      padding: 22px 0 0 0;
    }
    li:nth-of-type(5) {
      margin: 0;
    }

    .personal-order-icon {
      @include size(100%, 58px);
      @include font(40px, 58px, normal, center, #6c6c6c);
    }
    .personal-order-text {
      @include size(100%, 50px);
      @include font(26px, 50px, normal, center, #6c6c6c);
    }
    i.icon-fukuan {
      font-size: 56px;
    }
    i.icon-baoguocopy {
      font-size: 42px;
    }
    i.icon-yunshu {
      font-size: 54px;
    }
    i.icon-dingdan {
      font-size: 52px;
    }
    i.icon-shouhou {
      font-size: 54px;
    }
  }
}

.personal-list-wrap {
  @include size(100%, auto);
  margin: 0 auto;

  li {
    @include size(100%, 100px);
    margin-bottom: 4px;
    background: #fff;
    @include box-sizing;
    padding: 0 30px;
    @include font(28px, 100px, normal, left, #333);

    .left {
      display: block;
      float: left;
      @include size(72px, 100px);
      @include font(32px, 100px, normal, left, #aaa);
    }
    i.icon-star {
      font-size: 52px;
    }
    i.icon-dizhi1 {
      font-size: 44px;
    }
    i.icon-kefu {
      font-size: 40px;
    }
    p {
      float: left;
    }
    .right {
      display: block;
      float: right;
      @include size(32px, 100px);
      @include font(32px, 100px, normal, center, #aaa);
    }
  }
}
</style>
