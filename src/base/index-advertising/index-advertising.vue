<template>
    <div class="index-advertising-container clearfix">
        <div class="advertising-wrap">
            <article class="advertising-box" v-if="lanternData.length > 0" v-for="(item, index) in lanternData">
                <a :src="item.url">
                    <img :src="item.imgUrl" alt="首页广告">
                </a>
            </article>
        </div>
    </div>
</template>

<script>
    import {postData, getData, apiUrl} from '@/constant/api'
    export default {
        data() {
            return {
                lanternData: {}
            }
        },
        methods: {
            findMainAd() {
                postData('main/findMainAd').then((res) => {
                    this.lanternData = res.result
                    // console.log(res.result, '广告');
                })
            }
        },
        beforeCreate() {
        },
        created() {
            this.findMainAd();
        }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';

    .index-advertising-container {
        @include size(100%, auto);
        margin: 0 auto;
    }

    .advertising-wrap {
        @extend .index-advertising-container;
        padding: 30px 0 0 0;
    }

    .advertising-box {
        width: 100%;
        height: 240px;
        overflow: hidden;
        background: #fff;
        a {
            display: block;
            @include size(100%, 100%);
        }

        img {
            display: block;
            width: 100%;
            margin: 0 auto;
        }
    }

    article.advertising-box:nth-of-type(1) {
        margin-bottom: 20px;
    }
</style>
