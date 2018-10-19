<template>
	<div>
        <!-- 通用页面切换底部 -->
        <div class="footer" v-show="!footer">
            <ul class="menu-wrap">
                <li class="menu-list" v-for="i in footList">
                    <router-link :to="i.href" class="menu-link" active-class="active">
                        <i :class="i.taxon"></i>
                        <span class="menu-con"> {{ i.content }} </span>
                        <em v-show="i.state" class="state" v-if="shopNum > 0">{{ shopNum }}</em>
                    </router-link>
                </li>
            </ul> 
        </div>
    </div>
</template>

<script>
    import {postData, getData, apiUrl} from '@/constant/api';
    import {mapMutations, mapGetters} from 'vuex'
export default {
    data () {
        return {
            footList: [
                {   
                    href: '/index',
                    taxon: 'iconfont icon-shouye',
                    content: '首页 ',
                    state: false
                },
                {
                    href: '/choose',
                    taxon: 'iconfont icon-leibie',
                    content: '选购',
                    state: false
                },
                {
                    href: '/shop',
                    taxon: 'iconfont icon-gouwu',
                    content: '购物车',
                    state: true
                },
                {
                    href: '/personal',
                    taxon: 'iconfont icon-gerenzhongxin',
                    content: '个人中心',
                    state: false
                }
            ],
            footer: false,      // 判断当前是否是商品列表页
            shopNum: 0,         // 购物车底部数量
            // shopCarNum: this.$store.state('shopCartNum')
        }
    },
    methods: {
        refresh () {
            //获取路由参数
            let url = this.$route.path
            // console.log(url)
            if(url.substring(0,12) === '/choose-list') {            // 商品列表
                this.hideFoot();
            }else if (url.substring(0,14) === '/searchHistory'){    // 搜索历史
                this.hideFoot();
            }else if (url.substring(0,13) === '/searchResult'){     // 搜索结果
                this.hideFoot();
            }else if(url.substring(0,14) === '/goods-details'){     // 商品详情
                this.hideFoot();
            }else if(url.substring(0,9) === '/clearing'){           // 结算页面
                this.hideFoot();
            }else if(url.substring(0, 13) === '/payment-hint') {    // 结算提示
                this.hideFoot();
            }else if(url.substring(0, 15) === '/selection-site'){   // 结算地址选择
                this.hideFoot();
            }else if(url.substring(0, 8) === '/invoice') {          // 结算发票选择
                this.hideFoot();
            }else if(url.substring(0, 16) === '/payment-coupons') { // 结算优惠卷选择
                this.hideFoot();
            }else if(url.substring(0, 14) === '/personal-data'){    // 个人中心 个人资料
                this.hideFoot();
            }else if(url.substring(0,8) === '/address'){            // 个人中心 地址管理
                this.hideFoot();
            }else if(url.substring(0,13) === '/edit-address'){      // 个人中心 地址编辑
                this.hideFoot();
            }else if(url.substring(0,13) === '/notescontact'){      // 个人中心 联系客服
                this.hideFoot();
            }else if(url.substring(0, 12) === '/add-address'){      // 个人中心 新增地址
                this.hideFoot();
            }else if(url.substring(0, 6) === '/order'){             // 个人中心 我的订单
                this.hideFoot();
            }else if(url.substring(0,10) === '/logistics'){         // 个人中心 物流详情
                this.hideFoot();
            }else if(url.substring(0, 7) === '/refund'){            // 个人中心 申请退款
                this.hideFoot();
            }else if(url.substring(0,9) === '/evaluate'){           // 个人中心 订单评价
                this.hideFoot();
            }else if(url.substring(0,8) === '/coupons'){            // 个人中心 优惠卷
                this.hideFoot();
            }else if(url.substring(0,8) === '/collect'){            // 个人中心 我的收藏
                this.hideFoot();
            }else if(url.substring(0,8) === '/balance'){            // 个人中心 余额
                this.hideFoot();
            }else if(url.substring(0,9) === '/recharge'){           // 个人中心 充值
                this.hideFoot();
            }else {
                this.showFoot();
            }
        },
        hideFoot () {
            this.footer = true;
        },
        showFoot () {
            this.footer = false;
        },
        // 购物车底部数量
        shopFootNum () {
            let data = {
               pageSize: 9999,
                pageNo: 1
            }
            postData(apiUrl().findMyCartPage, data).then((response) => {
                if(response.status == 200){
                    // console.log(response.result.num, '购物车数量', response.result); 打印是否请求footer页面底部请求成功
                    this.shopNum = response.result.num;
                }else {
                    // console.log(response.message, response.status, '请稍后获取！')
                    console.log(response, '请求失败')
                }
            })
        },
        // 设置vuex 数据
        ...mapMutations({
            setShopCartNum: 'SET_SHOPCARTNUM'
        })
    },
    // 计算属性
        computed: {
        ...mapGetters([
            'shopCartNum'
        ])
    },
    // 动态监听
    watch: {
        $route (n) {
            this.refresh ()
        },
        shopCartNum (n) {
            // 请求购物车底部的数字
            if(n !== undefined){
                // console.log(n)
                // 查询购物车数量
                this.shopFootNum();
            }
        }
    },
    // 创建完毕之后 , 立即执行
    created () {
        this.refresh();
        // 查询购物车数量
        this.shopFootNum();
    }
}
</script>

<style lang="scss" scoped>
    @import 'src/assets/scss/common';
	.footer {
        width: 100%;
        height: 100px;
        background: #f6f6f6;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        box-sizing: border-box;
        border-top: 1px solid #ccc;
        z-index: 50;

        ul {
            width: 100%;
            height: 99px;
            margin: 0 auto;
        }

        .menu-wrap {
            display: -webkit-flex; 
            display: flex;
            -webkit-flex-direction: row; 
            -webkit-justify-content: space-around;

            li {
                display: inline-block;
                width: 186px;
                height: 99px;
            }
        }

        .menu-list {
            position: $rela;

            i {
                display: block;
                width: 100%;
                height: 68px;
                text-align: center;
                line-height: 68px;
                color: #666;
            }
            span {
                display: block;
                width: 100%;
                height: 30px;
                text-align: center;
                line-height: 16px;
                color: #666;
                font-size: 24px;
            }

            i.icon-shouye {
                font-size: 54px !important;
            }

            i.icon-leibie {
                font-size: 44px !important;
            }

            i.icon-gouwu {
                font-size: 44px !important;
            }

            i.icon-gerenzhongxin {
                font-size: 46px !important;
            }

            em.state {
                display: block;
                position: $abso;
                @include size(36px, 36px);
                background: #f0555a;
                top: 6px;
                right: 50px;
                @include font(18px, 36px, normal, center, #fff);
                font-style: normal;
                border-radius: 50%;
                @include text-over;
            }

        }
        .menu-list .active {
            span, i {
                color: #8ec25a;
            }
            em.state {
                display: none;
            }
        }

    }
</style>