<template>
    <div class="payment-hint-container clearfix">
        <div class="payment-hint-bg clearfix"></div>
        <p class="payment-hint-txt">付款成功!</p>
        <div class="payment-hint-wrap">
            <!--<p class="to-order">查看订单</p>-->
            <router-link to="/order/0" class="to-order" tag="p">查看订单</router-link>
            <p class="to-home" @click="backToHome">返回首页</p>
        </div>
    </div>
</template>

<script>
    import {postData, getData, apiUrl} from '@/constant/api'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                resultData: {},     // 当前请求回来的数据

            }
        },
        // 计算属性
        computed: {
            ...mapGetters([
                'shoppingId'
            ])
        },
        methods: {
            // 组织冒泡
            myfn(e) {
                window.event ? window.event.cancelBubble = true : e.stopPropagation();
            },
            // 返回首页
            backToHome () {
                this.$router.push({path: `/index`})
            },
            //实现滚动条无法滚动
            mo(e) {
                e.preventDefault()
            },
            // 禁止页面滑动
            stop() {
                document.body.style.overflow = 'hidden';
                document.addEventListener("touchmove", this.mo, false);
            },
            //取消滑动限制出现滚动条
            move() {
                document.body.style.overflow = '';
                document.removeEventListener("touchmove", this.mo, false);
            }
        },
        components: {},
        created() {
            console.log(this.shoppingId)
            this.move();
            // 请求页面数据, 渲染页面 以及算出总价格
            /*
            getData('src/data/findMyCartPage.json').then((response) => {
                // console.log(response)
                // this.resultData = response.result// 第一次请求回来的数据
                // this.changeDate = JSON.parse(JSON.stringify(response.result)) // 可更改的数据对象
                // this.setShoppingData(this.resultData) // 设置数据
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
            */
            // console.log(this.$route.query.item)
        },
        // 动态监听
        watch: {
            $route(n) {
                // 做首页跳到当前页面做滚动
//                this.urlNum = this.$route.query.item
//                if (this.urlNum !== undefined) {
//                    // console.log(this.urlNum)
//                }
                this.move();
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .payment-hint-container {
        @include size(100%, 100%);
        margin: 0 auto;
        background: #fff;
        padding: 1px 0 0 0;

        // 付款提示图片
        .payment-hint-bg {
            @include size(383px, 252px);
            margin: 80px auto 30px;
            background: url('../../assets/images/payment-hint/payment-hint-bg.png') no-repeat center / 383px, 252px;
        }

        // 付款提示文字
        .payment-hint-txt {
            @include size(100%, 60px);
            @include box-sizing;
            padding: 0 30px;
            @include font(30px, 60px, normal, center,#333);
            margin: 0 0 60px 0;
        }

        // 按钮
        .payment-hint-wrap {
            @include size(100%, 80px);
            margin: 0 auto 200px;
            @include box-sizing;
            padding: 0 30px;
            p {
                display: inline-block;
                @include size(330px, 80px);
                border-radius: 60px;
                background: red;
            }
            .to-order {
                float: left;
                border: 2px solid #8ec25a;
                @include font(28px, 80px, normal, center, #8ec25a);
                background: #fff;
            }
            .to-home {
                float: right;
                border: 2px solid #8ec25a;
                @include font(28px, 80px, normal, center, #fff);
                background: #8ec25a;
            }
        }
    }
</style>