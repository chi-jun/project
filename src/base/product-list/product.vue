<template>
    <div class="product-container clearfix">
        <article
                class="product-wrap-list"
                v-for="(item, index) in result"
                :id="item.productId"
                @click="skipTarget(item.productId,item.skuId)"
        >
            <div class="index-discounts-img">
                <img v-lazy="item.productAdImg" :alt="item.title">
            </div>
            <div class="index-discounts-wrap">
                <!--<div class="index-discounts-box">-->
                <h4 class="index-discounts-title" ref="selfTitle">
                    {{ item.title }}
                </h4>
                <p class="index-discounts-info">
                    {{ item.description }}
                </p>
                <!--</div>-->
                <p class="index-discounts-tag">
                    <span v-show="item.isPackage==1">包邮</span>
                    <span v-show="item.isCheap==1">特惠</span>
                    <span v-show="item.isAct==1">活动</span>
                    <span v-show="item.isTimeDiscount==1">限时优惠</span>
                </p>
                <div class="index-discounts-money">
                    <p class="money">￥<span>{{ item.realPrice}}</span></p>
                    <p class="inventory">(库存:{{ item.repertory }}件)</p>
                </div>
                <span class="discounts-newly-btn" @click="newlyShopping(item, item.productId)">
                        <i class="iconfont icon-jia"></i>
                </span>
            </div>
        </article>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {

    };
  },
  methods: {
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      // console.log('阻止默认事件')
    },
    // 点击带参数跳转详情页
    skipTarget(productId, skuId) {
      this.$router.push({ path: `/goods-details/${productId}/${skuId}` });
    },
    // 添加购物车
    newlyShopping(data, id) {
      this.myfn(); // 阻止冒泡
      if (data.repertory > 0) {
        // 判断库存是否为零
        this.addShopCart(data);
      } else {
        toast(this, "库存不足,添加购物车失败！");
      }
    },
    addShopCart(data) {
      // console.log(data, "加入购物车!");
      let datum = {
        goodsId: "", // 商品id
        goodSpecIds: "", // 需要判断非空, 非零 时才传参
        goodsNum: 1, // 数量
        goodSpec: "", // 规格值组合
        storeId: "", // 是	Long	店铺id
        storeName: "", // 是	String	店铺名称
        goodsName: "", // 是	String	商品名称
        goodsPrice: "", // 是		    商品价格 商品详情的实际价格
        goodsImage: "" // 是	String	商品图片 商品详情productAdImg
      };
      datum.goodsId = data.productId; // 設置商品id
      if (data.skuId !== null && data.skuId !== 0) {
        // 商品详情回显数据的skuid 存在则回传这个id
        datum.goodSpecIds = data.skuId;
      } else {
        delete datum.goodSpecIds;
      }
      if (data.sukName !== null) {
        // 商品數量
        datum.goodSpec = data.sukName;
      }
      datum.storeId = data.storeId; // 店鋪ID
      datum.storeName = data.storeName; // 店铺名称
      datum.goodsName = data.title; // 商品名称
      datum.goodsPrice = data.realPrice; // 商品价格
      datum.goodsImage = data.productAdImg; // 商品图片

      postData(apiUrl().addMyCart, datum).then(response => {
        if (response.status == 200) {
          this.setShopCartNum(Math.random()); // 每次新增任意设置购物车数量的值
          // console.log(response, '添加成功!')
          toast(this, "添加购物车成功！");
        } else if (response.status == 400) {
          // console.log(response, "添加失败!");
          toast(this, response.result);
        }
      });
    },
    // 设置vuex 数据
    ...mapMutations({
      setShopCartNum: "SET_SHOPCARTNUM"
    })
  },
  // 接收参数
  props: ["result"],
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
// 商品列表
.product-container {
  @include size(100%, auto);
  @include box-sizing;
  margin: 0 auto;

  .product-wrap-list {
    @include size(100%, 240px);
    @include box-sizing;
    background: #fff;
    padding: 0 30px;
    position: $rela;
    margin: 0 0 20px 0;
  }
  .product-wrap-list:last-child {
    margin-bottom: 0px;
  }

  .index-discounts-img {
    @include size(220px, 220px);
    float: left;
    overflow: hidden;
    margin: 10px 0 10px 0;
    img {
      display: block;
      width: 100%;
    }
  }
  .index-discounts-wrap {
    @include size(66%, 220px);
    float: right;
  }

  .index-discounts-title {
    // @include size(100%, 50px);
    width: 100%;
    height: 70px;
    @include font(28px, 30px, normal, left, #333);
    @include txtover(2);
    @include box-sizing;
    padding: 10px 0 0 0;
  }
  .index-discounts-info {
    @include size(100%, 50px);
    @include font(22px,50px, normal, left, #999);
    @include text-over;
  }

  .index-discounts-tag {
    @include size(380px, 38px);
    overflow: hidden;
    span {
      display: inline-block;
      height: 38px;
      padding: 0 4px;
      border-radius: 12px;
      border: 2px solid #71b42e;
      @include box-sizing;
      @include font(22px, 32px, normal, left, #71b42e);
      margin: 0px 10px 0 0;
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
  .discounts-newly-btn {
    @include size(64px, 64px);
    display: inline-block;
    position: $abso;
    border-radius: 50%;
    right: 30px;
    bottom: 30px;
    background: #99cc66;
    @include font(32px, 64px, normal, center, #fff);
  }
}
</style>
