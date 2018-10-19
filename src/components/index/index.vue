<template>
    <div class="index-container clearfix">
        <!-- 首页轮播图 -->
        <index-lantern></index-lantern>
        <!-- 首页分类 -->
        <index-classify></index-classify>
        <!-- 首页优惠专区 -->
        <index-discounts></index-discounts>
        <!-- 首页广告位 -->
        <index-advertising></index-advertising>
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex'
    import indexLantern from 'base/index-lantern/index-lantern'
    import indexClassify from 'base/index-classify/index-classify'
    import indexDiscounts from 'base/index-discounts/index-discounts'
    import indexRecommend from 'base/index-recommend/index-recommend'
    import indexAdvertising from 'base/index-advertising/index-advertising'
    export default {
        components: {
            indexLantern,
            indexClassify,
            indexDiscounts,
            indexRecommend,
            indexAdvertising
        },
        methods: {
            // 映射vuex的数据
            ...mapMutations({
                setShoppingData: 'SET_SHOPPINGDATA',
                shoppingId: 'SET_SHOPPINGID',
                setShopCartNum: 'SET_SHOPCARTNUM'
            }),
        },
        $route(n) {
            this.setShopCartNum(Math.random());     // 设置vuex 重新渲染页面底部数字
        },
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    .index-container {
        width: 100%;
        height: auto;
        margin: 0 auto;
    }
</style>
