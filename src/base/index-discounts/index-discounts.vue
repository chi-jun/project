<template>
    <div>
        <div class="index-discounts-content clearfix" v-for="item in lanternData">
            <div class="index-headline">
                {{item.name}}
            </div>
            <product :result="item.infoList"></product>
        </div>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
import product from "base/product-list/product";

export default {
  data() {
    return {
      lanternData: {}
    };
  },
  methods: {
    findMainProduct() {
      postData("main/findMainProduct").then(res => {
        this.lanternData = res.result;
      });
    }
  },
  components: {
    product
  },
  beforeCreate() {},
  created() {
    this.findMainProduct();
  },
  watch: {
    $route(n, o) {
      if (n.path.indexOf("/index") !== -1) {
        this.findMainProduct();
      }
    }
  }
};
</script>
<!--  -->
<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.index-discounts-content {
  width: 100%;
  margin: 0 auto;
  background: #eee;
  // height: 180px;
}

div.index-discounts-content:nth-of-type(2) {
  div.index-headline {
    width: 100%;
    height: 102px;
    @include font(32px, 130px, normal, center, #8572e6);
    position: $rela;
    background: url("../../assets/images/index-recommend/index-recommend-bg.png")
      no-repeat center / 750px 106px;
  }
  .index-headline:before {
    background: #8572e6;
  }
}

div.index-headline {
  width: 100%;
  height: 102px;
  @include font(32px, 130px, normal, center, #71b42e);
  position: $rela;
  background: url("../../assets/images/index-discounts/index-discounts-bg.png")
    no-repeat center / 750px 106px;
}

.index-headline:before {
  content: "";
  display: block;
  width: 60px;
  height: 7px;
  background: #71b42e;
  position: $abso;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
}

/*
    .index-discounts-container {
        display: block;
        width: 100%;
        margin: 0 auto;
    }
    .index-discounts-list {
        width: 100%;
        height: 240px;
        margin: 0 auto 4px;
        background: #fff;
        position: $rela;
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
    */
</style>
