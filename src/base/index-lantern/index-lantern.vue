<template>
  <div class="index-lantern-content">
    <swiper v-if="lanternData.length > 0" :options="swiperOption" ref="mySwiper">
      <!-- slides -->
       <div class="swiper-slide" v-for="i in lanternData" :key="i.id">
         <a :href="i.url">
        <img :src="i.picture" alt="图片丢失" title="">
        </a>
       </div>
      <!-- Optional controls -->
      <div class="swiper-pagination" slot="pagination"></div>
      <!-- <div class="swiper-button-prev" slot="button-prev"></div> -->
      <!-- <div class="swiper-button-next" slot="button-next"></div> -->
      <!-- <div class="swiper-scrollbar" slot="scrollbar"></div> -->
    </swiper>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import {postData, getData, apiUrl, ERR_OK} from '@/constant/api'

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
          preventClicks : false,//默认true
          loop: true,
          autoplay: {
            delay: 3000, //5秒切换一次
          },
          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination',
          },
          // 点击分页器的指示点分页器会控制Swiper切换
          paginationClickable: true,
          // 如果需要前进后退按钮
          // navigation: {
          // nextEl: '.swiper-button-next',
          // prevEl: '.swiper-button-prev',
          // },
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
           onClick: function(swiper){
               alert('你点了Swiper');
           },
          onSlideChangeEnd: function (swiper) {
            swiper.update(); //swiper更新
          },
        },
        lanternData: {}
      }
    },
    methods: {
      findAllBanner() {
        postData('main/findAllBanner').then((res) => {
          if (res.status == ERR_OK) {
            this.lanternData = res.result;
            // console.log( this.lanternData)
  
          }

        })
      }
    },
    beforeCreate() {
    },
    created() {
      this.findAllBanner();
    }
  }

</script>
<style lang="scss" rel="stylesheet/stylus">
  .index-lantern-content {
    width: 100%;
    height: 400px;
    margin: 0 auto;

    .swiper-container {
      height: 400px;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      list-style: none;
      padding: 0;
      z-index: 1;
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
      height: 400px;
      a{
        display: block;
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
