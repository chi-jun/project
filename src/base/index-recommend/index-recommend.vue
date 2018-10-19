<template>
    <div class="index-discounts-content clearfix">
        <div class="index-headline">
            {{ indexHeadline }}
        </div>
        <!--
        <section class="index-discounts-container">
            <router-link class="index-discounts-list" tag="article" v-for="(item, index) in lanternData" to="/choose" :key="item.id">
                <div class="index-discounts-img">
                    <img :src="item.imgPath" :alt="item.name">
                </div>
                <div class="index-discounts-wrap">
                    <h4 class="index-discounts-title">
                        {{ item.name }}
                    </h4>
                    <p class="index-discounts-info">
                        {{ item.info }}
                    </p>
                    <p class="index-discounts-tag">
                        <span v-for="i in item.tally">{{ i }}</span>
                    </p>
                    <div class="index-discounts-money">
                        <p class="money">￥<span>{{ item.price }}</span></p>
                        <p class="inventory">(库存:{{ item.inventory }}件)</p>
                    </div>
                    <span class="discounts-newly-btn" @click="newlyShopping(item.id)">
                        <i class="iconfont icon-jia"></i>
                    </span>
                </div>
            </router-link>
        </section>
        -->
        <product :result="lanternData"></product>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from '@/constant/api'
import product from '@/base/product-list/product'
export default {
    data() {
        return {
            lanternData: {},
            indexHeadline: "新品推荐"
        }
    },
    methods: {
        /*
        newlyShopping (id) {
            this.myfn(); // 阻止冒泡
            console.log('当前点击新增的物品是:' + id)
        },*/
        // 组织冒泡
        myfn (e) {
            window.event? window.event.cancelBubble = true : e.stopPropagation();
        }
        
    },
    components: {
        product
    },
    beforeCreate() {},
    created() {
        getData('src/data/index-discounts.json').then((response) => {
            // console.log(response)
            this.lanternData = response.result
            // JSON.stringify 转字符串 JSON.parse 转对象
            // setTimeout(() => {
            //     let pageBtn = document.getElementsByClassName('swiper-pagination-bullet');
            //     for (var i = 0; i < pageBtn.length; i++) {
            //         pageBtn[i].style.width = '26px';
            //         pageBtn[i].style.height = '4px';
            //         pageBtn[i].style.borderRadius = '0px';
            //     }
            //     // let pageActive = document.getElementsByClassName('swiper-pagination-bullet-active')[0];
            //     // pageActive.style.background = '#f6b801';
            // }, 200)
        })
    },
    watch:{

    },
}

</script>
<!--  -->
<style lang="scss" rel="stylesheet/stylus" scoped>
@import 'src/assets/scss/common';
.index-discounts-content {
    width: 100%;
    margin: 0 auto;
    background: #eee;
    // height: 180px;
}
.index-headline {
    width: 100%;
    height: 102px;
    @include font(32px, 130px, normal, center, #8572e6);
    position: $rela;
    background: url('../../assets/images/index-recommend/index-recommend-bg.png') no-repeat center / 750px 106px;
}
.index-headline:before {
    content: '';
    display: block;
    width: 60px;
    height: 7px;
    background: #8572e6;
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