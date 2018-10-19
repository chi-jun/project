<template>
    <div class="coupons-container clearfix">
        <ul class="coupons-head">
            <li v-for="(itme, index) in headline" :class="index == tabNum?'active':''" @click="tabCut(index)">{{ itme.name }} {{ itme.num }}</li>
        </ul>
        <!-- 可用优惠卷 -->
        <section class="coupons-wrap" v-show="tabNum == 0">
            <!-- 给article加active 是选中状态 -->
            <article class="coupons-list"
                     v-if="resultData.validList.length > 0"
                     v-for="(item, index) in resultData.validList"
                     :class="{'red': item.state == 1, 'active': item.id == deduction.id}"
                     @click="selectMethods(item.id, item.activityCoupon.cutMoney)"
                     :id="item.state"
            >
                <div class="coupons-box">
                    <p class="price">￥{{  item.activityCoupon.cutMoney  }}</p>
                    <p class="rule">满{{ item.activityCoupon.filledMoney }}元减{{  item.activityCoupon.cutMoney  }}元（{{ item.activityCoupon.couponName }}）</p>
                </div>
                <p class="coupons-info">
                    有效期：{{ item.getTime }} - {{ item.endTime }}
                </p>
                <p class="select"><i class="iconfont icon-gou"></i></p>
                <!--<p class="hint">已使用</p>-->
            </article>

            <div class="coupons-foot">
                <p @click="nonuse">不使用优惠券</p>
                <p @click="confirm">确定</p>
            </div>
        </section>
        <!-- 不可用优惠卷 -->
        <section class="coupons-wrap" v-show="tabNum == 1">
            <article class="coupons-list"
                     v-if="resultData.unvalidList.length > 0"
                     v-for="(item, index) in resultData.unvalidList"
                     :class="{'gray': item.state == 0, 'red': item.state == 1, 'golden': item.state == 2}"
                     @click="selectMethods(item)"
                     :id="item.state"
            >
                <div class="coupons-box">
                    <p class="price">￥{{  item.activityCoupon.cutMoney  }}</p>
                    <p class="rule">满{{ item.activityCoupon.filledMoney }}元减{{  item.activityCoupon.cutMoney  }}元（{{ item.activityCoupon.couponName }}）</p>
                </div>
                <p class="coupons-info">
                    有效期：{{ item.getTime }} - {{ item.endTime }}
                </p>
                <p class="hint" v-if="item.state == 0">已使用</p>
                <p class="hint" v-if="item.state == 1">不可用</p>
                <p class="hint" v-if="item.state == 2">已过期</p>
            </article>
        </section>
    </div>
</template>

<script>
    import { postData, getData, apiUrl } from '@/constant/api'
    import { mapMutations, mapGetters } from 'vuex'
    export default {
        // 数据
        data () {
            return {
                headline: [  // 结算页面tab 标题
                    {
                        name: '可用优惠卷',
                        num: 0
                    },
                    {
                        name: '不可用优惠卷',
                        num: 2
                    }
                ],
                tabNum: 0,                              // 结算页面tab 优惠卷选择
                resultData: {},                         // 数据
                selectNum: 0,                           // 选择
                deduction: {}                           // 优惠卷抵扣
            }
        },
        // 方法
        methods: {
            // 切换页面的选项卡请求数据
            tabCut (i) {
                this.tabNum = i;
                if(i == 0){
                    console.log('可用优惠卷!')
                }else if(i == 1){
                    console.log('不可用优惠卷!')
                }
            },
            // 选择操作
            selectMethods(id, money) {
                this.deduction.id = id;
                this.deduction.num = money;
            },
            // 确定
            confirm(){
                localStorage.deduction = JSON.stringify(this.deduction);
                this.$router.back();
            },
            // 不使用优惠券
            nonuse(){
                this.deduction.id = 0;
                this.deduction.num = 0;
                localStorage.deduction = JSON.stringify(this.deduction);
                this.$router.back();
            },
            // 获取优惠卷
            getCoupons(){
                if(this.$route.path.substring(0, 16) === '/payment-coupons'){
                    const data = {};
                    if(localStorage.getItem('clearingData') != '' || localStorage.getItem('clearingData') != null){
                        // console.log(localStorage.getItem('clearingData') != '' || localStorage.getItem('clearingData') != null);
                        const clearingDatum = JSON.parse(localStorage.getItem('clearingData')),
                              Datum = clearingDatum.cartResult.cartVoList[0].cartList;
                        console.log(clearingDatum)
                        // console.log(clearingDatum.cartResult.cartVoList[0].cartList);

                        if(clearingDatum.type == 1){            // 购物车结算
                            // console.log('购物车结算', Datum);
                            data.cardId = new Array();
                            Datum.forEach((e) => {
                                data.cardId.push(e.cardId)                                                  // 赋值购物车ID
                            })
                            // console.log(data, '获取到的数据')
                        }else if(clearingDatum.type == 0){      // 立即购买结算
                            // console.log('立即购买结算', Datum);
                            data.productId = new String();
                            data.num = new Number();

                            data.productId = Datum[0].productId;     // 商品ID
                            if(Datum[0].skuId != 0 && Datum[0].skuId != null){
                                data.skuId = new String();
                                //data.skuId = clearingDatum.cartResult.num;                                     // 库存ID 不为空 不为0 时回传
                                data.skuId = Datum[0].skuId;
                            }
                            data.num = Datum[0].repertory;                                                     // 商品数量
                            // 立即购买选优惠券：productId 和 skuId 和 num 是立即购买选择优惠券列表的传参 一起出现
                            //  console.log(data)
                        }
                    }
                    postData(apiUrl().getCouponRecordForStoreAndClass, data).then((response) => {
                        console.log(response,'-----------------22345')
                        this.resultData = response.result;
                        this.headline[0].num = response.result.validSize;       // 可用优惠卷数量
                        this.headline[1].num = response.result.unvalidSize;     // 不可用优惠卷数量


                        console.log(response.result.validList);
                        console.log(JSON.parse(localStorage.getItem('deduction')));
                        if(localStorage.getItem('deduction') != '' || localStorage.getItem('deduction') != null){
                            var discount = JSON.parse(localStorage.getItem('deduction'));

                        }
                    })
                }
            },
            // 获取优惠券缓存
            getDiscountCache(){
                if(localStorage.getItem('deduction') != '' || localStorage.getItem('deduction') != null){
                    this.deduction = JSON.parse(localStorage.getItem('deduction'));
                }
            }
        },
        // 计算属性
        computed: {},
        // 注册子组件
        components: {},
        // 实例化之前
        created() {
            this.getDiscountCache();    // 获取优惠券缓存
            this.getCoupons();  // 获取优惠卷
        },
        // 监听
        watch: {
            $route(n) {
                this.getDiscountCache();    // 获取优惠券缓存
                this.getCoupons();  // 获取优惠卷
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .coupons-container {
        @include size(100%, auto);
        @include box-sizing;
        padding: 80px 0 0 0;
        margin: 0 auto;
    }
    .coupons-head {
        position: $fixed;
        top: 86px;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 40;
        @include size(100%, 80px);
        background: #fff;

        li {
            @include size(50%, 80px);
            float: left;
            @include box-sizing;
            position: $rela;
            @include font(26px, 80px, normal, center, #666);
            transition: all .2s linear;
            border-bottom: 1px solid #ddd;
        }
        li:nth-of-type(1):after {
            display: block;
            content: '';
            position: $abso;
            @include size(1px, 40px);
            background: #ddd;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto 0;
        }

        li.active {
            @include font(26px, 80px, normal, center, #99cc66);
        }

        li.active:before {
            display: block;
            content: '';
            position: $abso;
            @include size(200px, 4px);
            background: #99cc66;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
        }
    }

    .coupons-wrap {
        @include size(100%, auto);
        @include box-sizing;
        padding: 30px 30px 0;
        margin: 0 auto;

        .coupons-list {
            @include size(100%, 300px);
            border-radius: 10px;
            position: $rela;
            margin: 0 auto 40px;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, .6);
            overflow: hidden;
            background: #fff;
            .coupons-box {
                @include size(555px, 206px);
                float: left;
                position: $rela;
                @include box-sizing;
                padding: 20px 0 35px 30px;
            }
            .coupons-box:before {
                display: block;
                content: '';
                @include size(555px, 10px);
                position: $abso;
                left: 0;
                right: 0;
                bottom: -2px;
                margin: 0 auto;
                z-index: 1;
                background: url('../../assets/images/coupons/coupons-box.png') no-repeat center / 530px 10px;
            }
            .price {
                @include size(100%, 86px);
                @include font(46px, 86px, normal, left, #fff);
            }
            .rule {
                @include size(100%, 90px);
                @include font(24px, 45px, normal, left, #fff);
                @include txtover(2);
            }
            .select {
                @include size(40px, 40px);
                position: $abso;
                top: 0;
                bottom: 0;
                right: 48px;
                margin: auto 0;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
                border: 2px solid #acacac;
                @include font(40px, 40px, normal, center, #fff);
                background: #fff;
            }
            .hint {
                @include size(30px, 74px);
                position: $abso;
                top: 0;
                bottom: 0;
                right: 50px;
                margin: auto 0;
                @include font(20px, 28px, normal, center, #aaa);
            }
        }
        .coupons-list.active {
            .select {
                border: 2px solid #8ec25a;
                background: #8ec25a;
            }
        }
        .coupons-info {
            @include size(100%, 94px);
            @include font(22px, 94px, normal, left, #999);
            float: left;
            @include box-sizing;
            padding: 0 0 0 30px;
        }
        .coupons-list:before, .coupons-list:after {
            display: block;
            content: '';
            position: $abso;
            @include size(60px, 30px);
            background: #eee;
            z-index: 10;
        }
        .coupons-list:before {
            top: 0px;
            right: 108px;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
        }
        .coupons-list:after {
            bottom: 0px;
            right: 108px;
            border-top-left-radius: 30px;
            border-top-right-radius: 30px;
        }
        // 未使用
        .coupons-list.red {
            .coupons-box {
                background: linear-gradient(to top right, #e42702, #ff9697);
            }
        }
        // 已过期
        .coupons-list.gray {
            .coupons-box {
                background: linear-gradient(to top right, #737373, #c0c0c0);
            }
        }
        // 已使用
        .coupons-list.golden {
            .coupons-box {
                background: linear-gradient(to top right, #827354, #cebfa0);
            }
        }

        // 确定
        .coupons-foot {
            @include size(100%, 115px);
            position: $fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            background: #eee;
            @include box-sizing;
            padding: 16px 30px 0;
            z-index: 50;
            box-shadow: 0 0 20px rgba(0, 0, 0, .8);

            p {
                @include size(48%, 80px);
                border-radius: 80px;
                background: #8ec25a;
                @include font(28px, 80px, normal, center, #fff);
                display: inline-block;
            }
            p:nth-of-type(1) {
                float: left;
            }
            p:nth-of-type(2) {
                float: right;
            }
        }
    }
</style>