<template>
    <div class="goods-comments-container">
        <div class="commodity-comment-list clearfix">
            <div class="commodity-head">
                <div class="commodity-head-img">
                    <img :src="evaluate.memberPic" :alt="evaluate.memberName">
                </div>
                <div class="commodity-head-con">
                    <p>{{ evaluate.memberName }}</p>
                    <time>{{ evaluate.evTime }}</time>
                </div>
                <ul class="commodity-head-star">
                    <li class="star" v-for="(item, index) in 5" :class="{active: index + 1 <= evaluate.star}">
                        <i></i>
                    </li>
                </ul>
            </div>
            <div class="commodity-content">
                {{ evaluate.content }}
            </div>
            <ul class="comment-details clearfix">
                <li v-for="(item, index) in evaluate.imgList">
                    <img :src="item.img" alt="" :id="item.id">
                </li>
            </ul>
        </div>
        <!-- 幻灯片预览预留 -->
        <div class="lantern-wrap" style="display: none;">
            <p class="lantern-wrap-bg"></p>
            <div class="lantern-container"></div>
        </div>
    </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { postData, getData, apiUrl } from "@/constant/api";
export default {
  name: "carrousel",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      //以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
      swiperOption: {
        direction: "horizontal",
        loop: true,
        autoplay: {
          delay: 3000 //5秒切换一次
        },
        // 如果需要分页器
        pagination: {
          el: ".swiper-pagination"
        },
        // 点击分页器的指示点分页器会控制Swiper切换
        paginationClickable: true,
        // 如果需要前进后退按钮
        // navigation: {
        // nextEl: '.swiper-button-next',
        // prevEl: '.swiper-button-prev',
        // },
        scrollbar: {
          el: ".swiper-scrollbar"
        },
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　　　　　　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        grabCursor: true,
        setWrapperSize: true,
        autoHeight: true,
        mousewheelControl: true,
        observeParents: true,
        // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
        debugger: true,
        //修改swiper自己或子元素时，自动初始化swiper
        observer: true,
        //修改swiper的父元素时，自动初始化swiper
        observeParents: true,
        onSlideChangeEnd: function(swiper) {
          swiper.update(); //swiper更新
        }
      },
      lanternData: {},
      starArr: []
    };
  },
  methods: {},
  beforeCreate() {},
  created() {
      //console.log(this.starArr)
    for (var i = 1; i < this.evaluate.star + 1; i++) {
        this.starArr.push(i);
    }
  },
  // 接收参数
  props: ["evaluate"],
  watch: {
    // 监听这个数据
    evaluate() {
      // console.log(this.evaluate);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/stylus">
@import "src/assets/scss/common";
.goods-comments-container {
  @include size(100%, auto);
  margin: 0 auto;

  .commodity-comment-list {
    @include size(100%, auto);
    border-bottom: 1px solid #ddd;
    @include box-sizing;
    padding: 30px 0;
  }
  .commodity-head {
    @include size(100%, 72px);
  }
  .commodity-head-img {
    @include size(72px, 72px);
    float: left;
    border-radius: 50%;
    overflow: hidden;
    background: #fff;
    margin-right: 20px;
    img {
      width: 100%;
    }
  }
  .commodity-head-con {
    float: left;
    @include size(430px, 72px);
    // background: pink;
    p {
      @include size(100%, 34px);
      @include font(24px, 34px, normal, left, #666);
      @include text-over;
      margin-bottom: 12px;
    }
    time {
      @include size(100%, 26px);
      @include font(18px, 26px, normal, left, #aaa);
      @include text-over;
    }
  }
  .commodity-head-star {
    @include size(144px, 72px);
    float: right;
    // background:red;

    li.star {
      display: inline-block;
      @include size(24px, 72px);
      // background: yellow;
      margin-right: 6px;
      float: left;
      @include font(24px, 72px, normal, left, #aaa);

      i {
        display: inline-block;
        @include size(24px, 24px);
        background: url("../../assets/images/goods-details/star2.png") no-repeat
          center / 38px;
      }
    }
    li.star:nth-of-type(5) {
      margin: 0;
    }
    li.star.active {
      i {
        background: url("../../assets/images/goods-details/star1.png") no-repeat
          center / 38px;
      }
    }
  }
  .commodity-content {
    @include size(100%, auto);
    @include font(24px, 40px, normal, left, #666);
    padding: 20px 0;
  }
  .comment-details {
    @include size(100%, 126px);

    li {
      @include size(126px, 126px);
      margin-right: 14px;
      overflow: hidden;
      float: left;
      // background: red;

      img {
        width: 100%;
      }
    }
    li:nth-of-type(5) {
      margin-right: 0;
    }
  }

  //幻灯片
  .lantern-wrap {
    @include size(100%, 100%);
    position: $fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    z-index: 100;
    overflow: hidden;
  }
  .lantern-wrap-bg {
    @include size(100%, 100%);
    position: $abso;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.8);
  }
  .lantern-container {
    @include size(750px, 750px);
    position: $abso;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
  }
}
</style>
