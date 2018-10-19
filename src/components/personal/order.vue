<template>
    <div class="order-container clearfix">
        <ul class="order-menu">
            <li v-for="(item, index) in menu" :class="{'active': index == menuIndex}" @click="menuMethod(index)">{{ item }}</li>
        </ul>
        <section class="order-wrap">
            <article class="order-box"
                     v-if="resultData.length > 0"
                     v-for="(item, index) in resultData"
                     @click="toOrderDetails(item.orderId, item.evaluationState)"
            >
                <div class="order-headline">
                    <p class="time">下单时间: {{ item.addTime }}</p>
                     <p class="state">{{item.status | orderFilter}}</p>
                </div>
                   <div class="order-con">
                    <div class="order-con-list" v-for="(imgs,index) in item.orderGoods" v-show="index<4"><img :src="imgs.goodsImage" alt="订单详情图"></div>
                    </div>
                <div class="order-foot">
                    <p class="price">合计: <span><em>￥</em>{{item.orderAmount}}</span></p>
                    <!-- 加类名是付款 去掉active 是普通按钮 -->
                      <!-- 未付款 -->
              <p  class="btn" v-show="item.payState==0&&item.orderState>=0" >取消订单</p>
              <p  class="btn" v-show="item.orderState < 0" >删除订单</p>
              <p  class="btn active" v-show="item.payState==0&&item.orderState >=0" >付款</p>
              <!-- 已付款未发货,催发货 -->
              <p class="btn"
                v-show="item.payState==1&&item.shippingState==0"
                >{{item.isHurry | isHurryFilter}}</p>
              <!-- 已发货 -->
              <p class="btn" 
               v-show="item.shippingState == 1"
               >确认收货</p>
              <p 
                class="btn"
                v-show="item.shippingState == 1">
                查看物流</p>
                <!-- 已签收 -->
                  <p 
                 v-show="item.orderState==4"
                class="btn"
              >评价</p>
                 <p 
                 v-show="item.orderState==4"
                class="btn"
              >申请售后</p>
               <!-- 退货中 -->
               </div>
            </article>
        </section>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
export default {
  // 数据
  data() {
    return {
      resultData: [], // 存储初始化页面请求回来的数据
      menu: [
        // 存储头部菜单内容
        "全部",
        "待付款",
        "待发货",
        "待收货",
        "完成",
        "售后"
      ],
      menuIndex: 0 // 存储头部菜单索引
    };
  },
  // 方法
  methods: {
    // 设置vuex的数据
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 菜单切换 请求数据
    menuMethod(index) {
      //  this.$router.push('/order/'+index)
      this.findOrderById(index);
    },
    // 请求数据
    findOrderById(type, pageNo) {
      this.menuIndex = type;
      // 根据传入参数请求 不同数据
      pageNo = pageNo || 1;
      //   type=type==0?'order_all':type==1?'order_not_pay':type==2?'order_send':type==3?'order_not_evaluation':type==4?'order_refund'
      if (type == 0) {
        type = "order_all";
      } else if (type == 1) {
        type = "order_not_pay";
      } else if (type == 2) {
        type = "order_pay";
      } else if (type == 3) {
        type = "order_send";
      } else if (type == 4) {
        type = "order_not_evaluation";
      } else {
        type = "order_refund";
      }
      let data = {
        pageNo: pageNo,
        pageSize: 9999,
        type: type
      };
      postData("/order/getAllOrder", data).then(res => {
        this.resultData = res.result.resultList; // 第一次请求回来的数据
        console.log(res, "订单222222222信息");
      });
    },
    // 前往订单详情页面
    toOrderDetails(id, state) {
      console.log(id, "----------id信息");
      this.$router.push({ path: `/order-details/${id}/${state}` }); // 前往订单详情页面
    },
    // 各种按钮点击跳转
    skip(id) {
      this.myfn(); // 组织冒泡
      this.$router.push({ path: `/logistics/${id}` }); // 前往订单详情页面
    },
    // 判断路由进入页面的id是什么 请求对应的数据
    loadData(n) {
      let id = n.params.orderId;
      if (id !== undefined) {
        // 初始化页面判断到底进入页面的值是什么
        this.findOrderById(id);
      }
    }
  },
  // 计算属性
  computed: {},
  filters: {
    orderFilter: function(value) {
      if (value == 0) {
        return "待付款";
      } else if (value == 1) {
        return "待发货";
      } else if (value == 2) {
        return "配送中";
      } else if (value == 3) {
        return "已签收";
      } else if (value == 4) {
        return "已完成";
      } else if (value == 5) {
        return "已评价";
      } else if (value == 6) {
        return "已取消";
      } else if (value == 7) {
        return "申请退货";
      } else if (value == 8) {
        return "确认退货";
      } else if (value == 9) {
        return "取消退货";
      }else if (value == 10) {
        return "退货成功";
      }
    },
    isHurryFilter(value) {
      if (value != 1) {
        return "提醒发货";
      } else {
        return "已提醒发货";
      }
    }
  },
  // 注册子组件
  components: {},
  // 实例化之前
  created() {
    // 判断路由进入页面的id是什么 请求对应的数据
    this.loadData(this.$route);
  },
  // 监听
  watch: {
    // 监听获取数据的变化 从字符串转为对象并赋值给 resultData
    addressList(n) {
      this.resultData = JSON.parse(n);
    },
    // 监听路由变化 变更页面
    $route(n) {
      // 判断路由进入页面的id是什么 请求对应的数据
      this.loadData(n);
    }
  }
};
</script>


<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.order-container {
  width: 100%;
  height: auto;
  margin: 0 auto;
  @include box-sizing;
  padding: 110px 0 0 0;
  margin: 0 0 -100px 0;
}
.order-menu {
  @include size(100%, 80px);
  @include box-sizing;
  background: #fff;
  position: $fixed;
  top: 88px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 50;
  padding: 0 30px;
  display: table;

  li {
    display: table-cell;
    height: 80px;
    @include font(26px, 80px, normal, center, #666);
    @include box-sizing;
    transition: all 0.2s ease;
  }

  li.active {
    border-bottom: 4px solid #99cc66;
    color: #99cc66;
  }
}
.order-menu:before {
  display: block;
  content: "";
  width: 100%;
  height: 2px;
  background: #ddd;
  position: $abso;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.order-wrap {
  @include size(100%, auto);
  margin: 0 auto;
  // 最后一个小盒子
  article.order-box:last-child {
    margin: 0 auto 0;
  }
}
.order-box {
  @include size(100%, 396px);
  margin: 0 auto 30px;
  background: #fff;
  @include box-sizing;
  padding: 0 30px;

  .order-headline {
    @include size(100%, 82px);
    @include box-sizing;
    border-bottom: 1px solid #ddd;

    .time {
      @include size(470px, 82px);
      float: left;
      @include font(28px, 82px, normal, left, #999);
    }
    .state {
      @include size(220px, 82px);
      float: right;
      @include font(28px, 82px, normal, right, #8ec25a);
    }
  }

  .order-con {
    @include size(100%, 210px);
    @include box-sizing;
    border-bottom: 1px solid #ddd;
    padding: 20px 0 0 0;
    @include flex;
    justify-content: flex-start;

    .order-con-list {
      @include size(170px, 170px);
      @include box-sizing;
      overflow: hidden;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .order-foot {
    @include size(100%, 104px);

    .price {
      @include size(330px, 104px);
      @include font(26px, 104px, normal, left, #666);
      float: left;
      span {
        font-size: 28px;
        color: #f0555a;
      }
      em {
        font-size: 26px;
        font-style: normal;
      }
    }

    .btn {
      @include size(160px, 64px);
      @include box-sizing;
      border-radius: 60px;
      float: right;
      border: 2px solid #8ec25a;
      @include font(28px, 60px, normal, center, #8ec25a);
      margin: 20px 0 0 20px;
      background: #fff;
    }
    .btn.active {
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
</style>