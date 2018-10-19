<template>
  <div class="index-classify-content">
    <swiper v-if="lanternData.length > 0" :options="swiperOption" ref="mySwiper">
      <!-- slides -->
      <div class="swiper-slide" v-for="i in lanternData">
        <router-link :to="'/choose/'+i.productClassId">
          <div class="swiper-slide-pic">
            <img :src="i.img" :alt="i.alt">
          </div>
          <p class="swiper-slide-txt">
            {{ i.title }}
          </p>
        </router-link>
      </div>
      <!-- Optional controls -->
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->

      <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
    </swiper>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {postData, getData, apiUrl,ERR_OK} from '@/constant/api'

  export default {
    name: 'carrousel',
    components: {
      swiper,
      swiperSlide
    },
    data() {
      return {
        //以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
        swiperOption: {
          direction: 'horizontal',
          // loop: true,
          autoplay: {
            delay: 3000, //5秒切换一次
          },
          // 如果需要分页器
          // pagination: {
          // el: '.swiper-pagination',
          // },
          // 点击分页器的指示点分页器会控制Swiper切换
          paginationClickable: true,
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          scrollbar: {
            el: '.swiper-scrollbar',
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
          onSlideChangeEnd: function (swiper) {
            swiper.update(); //swiper更新
          },
          slidesPerView: 4,             // 设置slider容器能够同时显示的slides数量
          spaceBetween: 30,             // slide之间的距离（单位px）
          slidesPerGroup: 4,            // 在carousel mode下定义slides的数量多少为一组
          // loop: true,                   // 循环的
          // loopFillGroupWithBlank: true, // 在loop模式下，为group填充空白slide
        },
        lanternData: {}
      }
    },
    methods: {
      findOneLevelClass() {
        postData('main/findOneLevelClass').then((res) => {
          if (res.status == ERR_OK){
            this.lanternData = res.result
              // console.log(this.lanternData,'分类数据');
          }
        })
      }
    },
    beforeCreate() {
    },
    created() {
      this.findOneLevelClass()
    }
  }

</script>
<style lang="scss" rel="stylesheet/stylus">
  @import 'src/assets/scss/common';

  .index-classify-content {
    width: 100%;
    height: 180px;
    margin: 0 auto;
    background: #fff;
    position: relative;

    .swiper-container {
      width: 626px;
      height: 180px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      list-style: none;
      padding: 0;
      z-index: 1;
    }

    .swiper-slide {
      width: 134px;
      height: 180px;
      // background: red;

      .swiper-slide-pic {
        width: 80px;
        height: 80px;
        margin: 30px auto 0;
        overflow: hidden;
        border-radius: 50%;
      }
      .swiper-slide-txt {
        width: 100%;
        height: 58px;
        @include text-over;
        @include font(26px, 58px, normal, center, #666);
      }
    }
    // swiper 左右按钮
    .swiper-button-prev, .swiper-button-next {
      position: absolute;
      top: 50%;
      width: 27px;
      height: 44px;
      margin-top: -22px;
      z-index: 10;
      cursor: pointer;
      background-size: 27px 44px;
      background-position: center;
      background-repeat: no-repeat;
    }

    // 左右按钮
    .swiper-button-prev, .swiper-container-rtl .swiper-button-next {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%238ec25a'%2F%3E%3C%2Fsvg%3E");
      left: 10px;
      right: auto;
    }

    .swiper-button-next, .swiper-container-rtl .swiper-button-prev {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%238ec25a'%2F%3E%3C%2Fsvg%3E");
      right: 10px;
      left: auto;
    }

    .swiper-pagination-bullet {
      width: 16px;
      height: 16px;
      display: inline-block;
      border-radius: 50%;
      background: #fff;
      opacity: .5;
    }

    .swiper-pagination-bullet-active {
      width: 26px;
      height: 16px;
      border-radius: 16px;
      opacity: 1;
      background: #fff;
    }

    .swiper-slide {
      img {
        width: 100%;
      }
    }
  }
</style>
