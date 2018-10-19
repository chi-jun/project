<template>
    <!-- 商品列表 -->
    <div class="chooseList-container clearfix">
        <!-- munu菜单 -->
        <section class="chooseList-menu-wrap clearfix">
            <article class="chooseList-menu-box">
                <ul class="chooseList-menu-tab">
                    <li v-for="(item, index) in menu" :class="index == menuNum?'active':' '"   @click="tabCut(index)">
                        {{ item }}
                        <span
                                v-if="index==2"
                                class="chooseList-menu-price" :class="{active:priceMun,green:isPrice}" @click="tabPrice">
                         </span>
                    </li>                    
                </ul>
                <div class="chooseList-menu-screen" @click="menuScreen"><i class="iconfont icon-shaixuan"></i>筛选</div>
            </article>
        </section>
        <!-- 商品列表 -->
        <section class="chooseProduct-wrap clearfix">
            <product :result="resultData"></product>
        </section>
        <!-- 商品列表筛选 -->
        <section class="chooseList-screen-wrap" v-show="screenBtn">
            <div class="chooseList-screen-wrap-bg" @click="menuScreen"></div>
            <article class="chooseList-screen-box clearfix">
                <h2 class="chooseList-screen-head">筛选</h2>
                <div class="chooseList-screen-content" v-if="screenList.length>0">
                    <div class="chooseList-screen-con">
                        <p class="chooseList-screen-info"> {{screenList[0].spName}}</p>
                        <ul class="chooseList-screen-child clearfix">
                            <li class="chooseList-screen-list"
                                v-for="(item, index) in screenList[0].productSpecValues"
                                :class="{'active':item.spValueId == selfIndex01}"
                                :id="item.spValueId"
                                @click="screenBg01(screenList[0].spId,item.spValueId)"
                            >
                                {{ item.spValueName }}
                            </li>
                        </ul>
                    </div>
                    <div class="chooseList-screen-con">
                        <p class="chooseList-screen-info"> {{screenList[1].spName}}</p>
                        <ul class="chooseList-screen-child clearfix">
                            <li class="chooseList-screen-list"
                                v-for="(item, index) in screenList[1].productSpecValues"
                                :class="{'active':item.spValueId == selfIndex02}"
                                :id="item.spValueId"
                                @click="screenBg02(screenList[1].spId,item.spValueId)"
                            >
                                {{ item.spValueName }}
                            </li>
                        </ul>
                    </div>
                    <div class="chooseList-screen-con">
                        <p class="chooseList-screen-info"> {{screenList[2].spName}}</p>
                        <ul class="chooseList-screen-child clearfix">
                            <li class="chooseList-screen-list"
                                v-for="(item, index) in screenList[2].productSpecValues"
                                :class="{'active':item.spValueId == selfIndex03}"
                                :id="item.spValueId"
                                @click="screenBg03(screenList[2].spId,item.spValueId)"
                            >
                                {{ item.spValueName }}
                            </li>
                        </ul>
                    </div>
                </div>
                <ul class="chooseList-screen-btn clearfix">
                    <li @click="resetBtn">重置</li>
                    <li @click="submitBtn">完成</li>
                </ul>
            </article>
        </section>
        <!--    &lt;!&ndash; 筛选弹框 &ndash;&gt;
            <section class="screen-info-wrap" :class="screenInfoShow?'active':'' ">
              <h2>错误提示!  请选择产地、规格、用途之后再点击确定!</h2>
            </section>-->
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
import product from "@/base/product-list/product";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      menu: ["综合", "销量", "价格"],
      menuNum: 0, // 菜单第一个切换tab的样式 及 请求控制
      rulId: 0, // 获取跳转页面进来获取的物品id
      resultData: [], // 存取初始化获取数据
      screenList: [], // 存取筛选列表数据
      priceMun: false, // 控制价格
      screenBtn: false, // 筛选按钮
      selfIndex01: -1, // 筛选的点击顺序
      selfIndex02: -1, // 筛选的点击顺序
      selfIndex03: -1, // 筛选的点击顺序
      products01: [], // 筛选的第一个列表
      products02: [], // 筛选的第二个列表
      products03: [], // 筛选的第三个列表
      screenArr: [], // 筛选的结果数据
      screenZfc: "",
      isPrice: false
    };
  },
  // 计算属性
  computed: {},
  methods: {
    // 监听路由
    gainParams() {
      if (this.$route.params.listId != undefined) {
      	// console.log(this.$route.params.listId, '输出获取监听路由的id')
        this.rulId = this.$route.params.listId;
        /*请求综合商品*/
        // this.findProductInfoByCondition();
        /*请求删选列表*/
        this.findProductSpeByClassId();
      }
      this.tabCut(0);
    },
    /*获取筛选后的商品*/
    findProductInfoByCondition(data1) {
      data1 = data1 || {};
      let data0 = {
        pageNo: 1,
        pageSize: 9999,
        productClassId: this.rulId,
        sukValue: this.screenZfc
      };
      let data = Object.assign(data0, data1);
      postData("chooseBuy/findProductInfoByCondition", data).then(res => {
        this.resultData = res.result.resultList;
      });
    },
    findProductSpeByClassId() {
      postData("chooseBuy/findProductSpeByClassId", {
        classId: this.rulId
      }).then(res => {
        this.screenList = res.result;
        console.log(this.screenList, "筛选列表2222222222222222");
      });
    },
    // 综合和销量的tab切换
    tabCut(index) {
      this.menuNum = index;
      if (index == 2) {
        return;
      }
      let data = index === 0 ? "" : "down";
      this.findProductInfoByCondition({
        sellNum: data
      });
    },
    tabPrice() {
      this.isPrice = true;
      this.priceMun = !this.priceMun;
      let data = this.priceMun ? "up" : "down";
      this.findProductInfoByCondition({
        price: data
      });
    },
    // 添加购物
    newlyShopping(id) {
      this.myfn(); // 阻止冒泡
      // console.log("当前点击新增的物品是:" + id);
    },
    // 筛选方法
    menuScreen() {
      this.screenBtn = !this.screenBtn;
      /*        this.screenInfoShow = false;*/
      if (this.screenBtn) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    // 筛选点击
    screenBg01(spId, spValueId) {
      this.selfIndex01 = spValueId;
      this.screenArr[0] = `${spValueId}`;
    },
    screenBg02(spId, spValueId) {
      this.selfIndex02 = spValueId;
      this.screenArr[1] = `${spValueId}`;
    },
    screenBg03(spId, spValueId) {
      this.selfIndex03 = spValueId;
      this.screenArr[2] = `${spValueId}`;
    },
    // 重置
    resetBtn() {
      this.selfIndex01 = -1;
      this.selfIndex02 = -1;
      this.selfIndex03 = -1;
      this.screenArr = [];
    },
    // 提交
    submitBtn() {
      this.screenBtn = !this.screenBtn;
      this.screenZfc = this.screenArr.length ? this.screenArr.join(",") : "";
      this.findProductInfoByCondition();
    },

    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 跳转目标并且改变url参数
    skipTarget(id) {
      // console.log(id)
      if (!id) {
        return;
      } else {
        this.$router.push({ path: `/goods-details/${id}` });
      }
    }
  },
  components: {
    product
  },
  created() {
    this.gainParams();
  },
  // 动态监听
  watch: {
    $route(n) {
      if (n.path.indexOf("choose-list") !== -1) {
        this.isPrice = false;
        this.gainParams();
      }
      this.resultData = '';
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.chooseList-container {
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 100px 0 0 0;
}

.chooseList-menu-wrap {
  position: $fixed;
  top: 88px;
  left: 0;
  right: 0;
  margin: 0 auto;
  @include size(100%, auto);
  margin: 0 auto;
  z-index: 50;
}

.chooseProduct-wrap {
  width: 100%;
  height: auto;
  margin: 0 auto;
}

.chooseList-menu-box {
  @include size(100%, 84px);
  margin: 0 auto;
  @include box-sizing;
  background: #fff;
  position: $rela;
  border-bottom: 1px solid #ddd;
  padding: 0 30px;
}

.chooseList-menu-tab {
  @include size(334px, 84px);
  @include box-sizing;
  float: left;
  background: transparent;
  position: $rela;
  @include flex;
  // background: pink;

  li {
    display: inline-block;
    @include size(104px, 84px);
    @include box-sizing;
    @include font(26px, 84px, normal, center, #999);
    position: $rela;
    transition: all 0.1s linear;
  }
  li.active {
    border-bottom: 4px solid #99cc66;
    @include font(26px, 84px, normal, center, #99cc66);
  }
}

.chooseList-menu-price {
  @include size(138px, 84px);
  @include font(26px, 84px, normal, left, #999);
  /*   position: $rela;*/
  text-indent: 26px;
  // background: pink;
  position: absolute;
  left: 0px;
}

.chooseList-menu-price:before,
.chooseList-menu-price:after {
  @include size(0, 0);
  content: "";
  display: block;
  position: $abso;
  right: 29px;
  transition: all 0.1s linear;
}

.chooseList-menu-price:before {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 14px solid #ddd;
  top: 26px;
}
.chooseList-menu-price.green:before {
  border-bottom: 14px solid #8ec25a;
}

.chooseList-menu-price:after {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 14px solid #ddd;
  bottom: 26px;
}

.chooseList-menu-price.active:before {
  border-bottom: 14px solid #ddd;
}

.chooseList-menu-price.active:after {
  border-top: 14px solid #8ec25a;
}

.chooseList-menu-screen {
  @include size(168px, 84px);
  // background: red;
  float: right;
  @include font(26px, 84px, normal, right, #999);
  position: $rela;
  .icon-shaixuan {
    font-size: 36px;
    margin-right: 10px;
  }
}

.chooseList-menu-screen:before {
  content: "";
  display: inline-block;
  @include size(2px, 40px);
  background: #ddd;
  position: $abso;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
}

// 商品列表
.chooseList-wrap {
  @include size(100%, auto);
  margin: 0 auto;

  .chooseList-wrap-list {
    @include size(100%, 240px);
    margin-bottom: 8px;
    background: #fff;
    @include box-sizing;
    // padding: 0 30px;
    position: $rela;
  }
  .chooseList-wrap-list:last-child {
    margin-bottom: 0px;
  }

  .index-discounts-img {
    width: 220px;
    height: 220px;
    float: left;
    margin: 0 10px 0 0;
    overflow: hidden;
    margin: 10px 0 0 30px;
    img {
      width: 100%;
    }
  }
  .index-discounts-wrap {
    width: 66%;
    height: 240px;
    float: right;
  }
  .index-discounts-title {
    width: 100%;
    height: 72px;
    @include font(28px, 94px, normal, left, #333);
    @include text-over;
  }
  .index-discounts-info {
    width: 100%;
    height: 42px;
    @include font(22px, 42px, normal, left, #999);
    @include text-over;
  }

  .index-discounts-tag {
    width: 406px;
    height: 58px;

    span {
      display: inline-block;
      height: 38px;
      padding: 0 8px;
      border-radius: 12px;
      border: 2px solid #71b42e;
      @include box-sizing;
      @include font(22px, 32px, normal, left, #71b42e);
      margin: 10px 20px 0 0;
    }
  }

  .index-discounts-money {
    width: 406px;
    height: 54px;
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
  .discounts-newly-btn {
    display: inline-block;
    position: $abso;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    right: 30px;
    bottom: 30px;
    background: #99cc66;
    @include font(32px, 64px, normal, center, #fff);
  }
}

// 筛选
.chooseList-screen-wrap {
  @include size(100%, 100%);
  position: $fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  .chooseList-screen-box {
    @include size(100%, 800px);
    background: #fff;
    position: $fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    @include box-sizing;
    padding: 100px 30px 168px;
    z-index: 101;
  }

  .chooseList-screen-head {
    display: block;
    @include size(100%, 100px);
    @include font(30px, 120px, normal, center, #000);
    position: $abso;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
}

.chooseList-screen-wrap-bg {
  @include size(100%, 100%);
  background: rgba(0, 0, 0, 0.7);
}

.chooseList-screen-content {
  width: 100%;
  max-height: 536px;
  overflow-y: auto;
}

.chooseList-screen-con {
  @include size(100%, auto);
  margin: 0 auto;
  border-bottom: 1px solid #ddd;
  // background: red;
  padding: 0 0 10px 0;

  p.chooseList-screen-info {
    @include size(100%, 82px);
    @include font(28px, 82px, normal, left, #666);
  }

  ul.chooseList-screen-child {
    @include size(100%, auto);
    margin: 0 auto;

    li.chooseList-screen-list {
      display: inline-block;
      float: left;
      margin: 0 16px 20px 0;
      @include size(160px, 64px);
      @include box-sizing;
      border: 2px solid #aaa;
      border-radius: 64px;
      @include font(24px, 64px, normal, center, #999);
      background: #fff;
      transition: all 0.2s linear;
    }
    li.chooseList-screen-list:nth-of-type(4n) {
      margin: 0 0 20px 0;
    }
    li.chooseList-screen-list.active {
      float: left;
      @include font(24px, 64px, normal, center, #fff);
      background: #8ec25a;
      border: 2px solid #8ec25a;
    }
  }
}

.chooseList-screen-btn {
  @include size(100%, 168px);
  position: $abso;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding: 58px 0 0 0;
  @include box-sizing;
  @include flex;
  li {
    display: inline-block;
    @include size(330px, 80px);
    border-radius: 44px;
    @include font(26px, 80px, normal, center, #fff);
  }

  li:nth-of-type(1) {
    background: #ccc;
  }
  li:nth-of-type(2) {
    background: #8ec25a;
  }
}

// 筛选弹框
.screen-info-wrap {
  @include size(470px, auto);
  background: #fff;
  position: $fixed;
  top: -50%;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 100;
  transition: all 0.2s ease;
  border-radius: 12px;

  -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  @include font(28px, 60px, normal, left, #74dc0d);
  @include box-sizing;
  padding: 20px 20px;
  background: #f2f4ef;
}

.screen-info-wrap.active {
  top: 10%;
}
</style>
