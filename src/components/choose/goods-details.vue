<template>
    <!-- 商品详情 -->
    <div class="goods-details-container">
        <!-- 商品详情页轮播图 -->
        <goods-details-lantern :lantern-img="imgContainer"></goods-details-lantern>
        <!-- 商品详情内容 -->
        <section class="goods-details-wrap clearfix">
            <!-- 商品信息 -->
            <article class="goods-details-info clearfix">
                <h2 class="goods-details-info-head">{{ resultData.title }}</h2>
                <p class="goods-details-info-box">{{ resultData.description}}</p>
                <div class="goods-details-info-wrap">
                    <div class="price-and-tally clearfix">
                        <p><span>￥</span>{{ resultData.realPrice}}</p>
                        <ul class="tally clearfix">
                            <li v-show="resultData.isPackage==1">包邮</li>
                            <li v-show="resultData.isCheap==1">特惠</li>
                            <li v-show="resultData.isAct==1">活动</li>
                            <li v-show="resultData.isTimeDiscount==1">限时优惠</li>
                        </ul>
                    </div>
                    <div class="originalPrice">
                        <p class="price">￥{{resultData.marketPrice}}</p>
                        <p class="inventory"> 库存:{{resultData.repertory}}件</p>
                    </div>
                </div>
                <div class="add-subtract-wrap clearfix">
                    <p class="subtract" @click="addSubtractNum(1)" :class="goodsNum == 1? 'active' : '' "><i
                            class="iconfont icon-minus"></i></p>
                    <input
                            type="tel"
                            class="goodsNum"
                            v-model.trim.number="goodsNum"
                            @click="gainNum"
                            @change="maximum(goodsNum)"
                    />
                    <p class="add" @click="addSubtractNum(2)" :class="{'active': goodsNum == inventory}"><i
                            class="iconfont icon-jia"></i></p>
                </div>
            </article>
        </section>

        <!-- 商品规格详细 -->
        <section class="specification-wrap">
            <article class="specification-box">
                已选: {{resultData.name}} {{this.goodsNum}}件
            </article>
        </section>

        <!-- 图文详情、商品评价 -->
        <section class="goods-tab clearfix">
            <ul class="goods-tab-head">
                <li
                        v-for="(item, index) in menu"
                        :class="index == menuNum?'active':''"
                        @click="tabCut(index)"
                >{{ item }}
                </li>
            </ul>
            <!-- 图文详情 -->
            <div class="goods-tab-con graphic-details clearfix" ref="graphicDetails" v-show="menuNum == 0"
                v-html="graphicDetails">
            </div>
            <!-- 商品评价 -->
            <article class="goods-tab-con commodity-comment clearfix" v-show="menuNum == 1">
                <!-- 商品评论列表 -->
                <goods-comments
                        v-for="(item,index) in commodityComment"
                        :evaluate="item"
                        :key="item.evId"
                ></goods-comments>
            </article>
        </section>

        <!-- 商品详情页面底部 -->
        <div class="commodity-wrap">
            <div class="collect-wrap" @click="collectMethod" :class="collect == '已收藏'?'active': ''">
                <p class="collect-icon"></p>
                <p class="collect-text">{{ collect }}</p>
            </div>
            <p class="add-shopping" @click="addShopping">加入购物车</p>
            <p class="buy-immediately" @click="buyImmediately">立即购买</p>
        </div>
    </div>
</template>

<script>
    import {postData, getData, apiUrl, toast} from "@/constant/api";
    import goodsComments from "base/goods-details/goods-comments";
    import goodsDetailsLantern from "base/goods-details/goods-details-lantern";
    import {mapMutations, mapGetters} from "vuex";

    export default {
        data() {
            return {
                imgContainer: [], // 储存幻灯片图片的容器
                resultData: {}, // 存取初始化获取数据
                goodsNum: 1, // 存取物品数量的值
                inventory: 0, // 商品庫存
                menu: ["图文详情", "商品评价"],
                menuNum: 0, // 菜单第一个切换tab的样式 及 请求控制
                // 商品详情菜单的图文详情内容
                graphicDetails: "",
                commodityComment: [], // 商品详情菜单的商品评价内容
                commodity: false, // 判断商品详情底部
                collect: "", // 收藏
                rulId: 0, // 获取跳转页面进来获取的物品id
                beforeNum: 0,        // 修改之前的数字
            };
        },
        // 计算属性
        computed: {},
        methods: {
            // 映射vuex的数据
            ...mapMutations({
                setShoppingData: "SET_SHOPPINGDATA",
                shoppingId: "SET_SHOPPINGID",
                setShopCartNum: "SET_SHOPCARTNUM"
            }),
            // 监听路由
            gainParams() {
                if (this.$route.params.productId) {
                    this.rulId = this.$route.params.productId; // 返回商品id
                    this.skuId = this.$route.params.skuId; // 在商品列表接口返回的skuId如果是null要传0到后台 规格库存id
                    this.findProductInfoSku(); // 商品详情
                    this.findProductInfoDetail(); // 圖文詳情
                    this.findProductInfoComment(); // 商品評價
                }
            },
            /* 圖文詳情 */
            findProductInfoDetail() {
                let data = {
                    productInfoId: this.rulId
                };
                postData("/chooseBuy/findProductInfoDetail", data).then(res => {
                    this.graphicDetails = res.result;
                });
            },
            /*商品详情*/
            findProductInfoSku() {
                let data;
                if (this.skuId && this.skuId != "null") {
                    data = {
                        skuId: this.skuId,
                        productInfoId: this.rulId
                    };
                } else {
                    data = {
                        productInfoId: this.rulId
                    };
                }
                postData("chooseBuy/findProductInfoSku", data).then(res => {
                    // console.log(res.result.imgList,'------商品数据222');
                    this.imgContainer = res.result.imgList; // 幻燈片
                    this.resultData = res.result; // 商品詳情數據
                    this.inventory = res.result.repertory; // 庫存
                    this.collect = this.resultData.isFavor == 1 ? "已收藏" : "收藏";
                    // console.log(this.resultData, "spsj");
                });
            },
            /*商品评价*/
            findProductInfoComment() {
                let data = {
                    pageSize: 9999,
                    pageNo: 1,
                    productInfoId: this.rulId
                };
                postData(apiUrl().productCommentt, data).then(res => {
                    this.commodityComment = res.result.resultList;
                });
            },
            // 增加或减少商品选购数量
            addSubtractNum(num) {
                this.myfn(); // 阻止冒泡
                if (num === 1) {
                    if (this.goodsNum > 1) {
                        // 當前的總數量大於1的時候
                        this.goodsNum--; // 允許每次減1
                    }
                } else if (num === 2) {
                    if (this.goodsNum < this.inventory) {
                        // 當前的數量小於總庫存的時候， 允許每次加1
                        this.goodsNum++; // 增加操作
                    }
                }
            },
            // 图文详情和商品评价的tab切换
            tabCut(index) {
                this.menuNum = index;
                if (index == 0) {
                    // console.log("图文详情");
                } else if (index == 1) {
                    // console.log("商品评价");

                    // 请求商品评价的数据
                    this.findProductInfoComment();
                }
            },
            // 组织冒泡
            myfn(e) {
                window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
            },
            stopBubble(e) {
                // 如果提供了事件对象，则这是一个非IE浏览器
                if (e && e.stopPropagation) {
                    // 因此它支持W3C的stopPropagation()方法
                    e.stopPropagation();
                } else {
                    // 否则，我们需要使用IE的方式来取消事件冒泡
                    window.event.cancelBubble = true;
                }
            },
            // 判断输入后的值是否超过库存
            maximum(goodsNum) {
                this.myfn(); // 阻止冒泡
                this.goodsNum = this.goodsNum < this.inventory ? this.goodsNum : this.inventory;
                this.goodsNum = this.goodsNum == "" ? this.goodsNum = 1 : this.goodsNum;
            },
            // 检测是否为空
            isEmpty() {
                if (this.goodsNum == '') {
                    this.goodsNum = this.beforeNum;
                }
            },
            // 点击时拿到现在的数据
            gainNum() {
                this.beforeNum = this.goodsNum;
                this.myfn();        // 阻止默认事件
            },
            // 加入购物车
            addShopping() {
                // console.log(this.goodsNum, "當前的商品數", "加入购物车");
                let data = {
                    goodsId: "", // 商品id
                    goodSpecIds: "", // 需要判断非空, 非零 时才传参
                    goodsNum: "", // 数量
                    goodSpec: "", // 规格值组合
                    storeId: "", // 是	Long	店铺id
                    storeName: "", // 是	String	店铺名称
                    goodsName: "", // 是	String	商品名称
                    goodsPrice: "", // 是		    商品价格 商品详情的实际价格
                    goodsImage: "" // 是	String	商品图片 商品详情productAdImg
                };
                data.goodsId = this.resultData.productId; // 設置商品id
                // 商品详情回显数据的skuid 存在则回传这个id
                if (this.resultData.skuId !== null && this.resultData.skuId) {
                    data.goodSpecIds = this.resultData.skuId;
                } else {
                    delete data.goodSpecIds;
                }
                data.goodsNum = this.goodsNum; // 商品數量
                data.goodSpec = this.resultData.sukName; // 商品详情显数据的规格值组合 存在则回传这个值
                data.storeId = this.resultData.storeId; // 店鋪ID
                data.storeName = this.resultData.storeName; // 店铺名称
                data.goodsName = this.resultData.title; // 商品名称
                data.goodsPrice = this.resultData.realPrice; // 商品价格
                data.goodsImage = this.resultData.productAdImg; // 商品图片

                postData(apiUrl().addMyCart, data).then(response => {
                    if (response.status == 200) {
                        this.setShopCartNum(Math.random()); // 每次新增任意设置购物车数量的值
                        this.goodsNum = 1;
                        toast(this, "添加购物车成功！");
                        //console.log(response, "添加成功!");
                    } else if (response.status == 400) {
                        toast(this, response.result);
                        // console.log(response, response.message);
                    }
                });
            },
            // 立即购买
            buyImmediately() {
                // console.log("立即购买");
                let data = {
                    productInfoId: "", // 是	Long	商品id
                    skuId: "", // 否	Long	库存skuid 商品详情有这个字段 不为0或者null 则回传
                    num: "" // 是	Int	    购买数量
                };
                data.productInfoId = this.resultData.productId;
                if (this.resultData.skuId !== null && this.resultData.skuId) {
                    data.skuId = this.resultData.skuId;
                } else {
                    delete data.skuId;
                }
                data.num = this.goodsNum;
                postData(apiUrl().buyNow, data).then(response => {
                    if (response.status == 200) {
                        // console.log(response, "請求成功數據!");
                        this.goodsNum = 1;
                        localStorage.clearingData = JSON.stringify(response.result); // 设置 localStorage 数据

                        // 设置地址
                        let clearingSite = {
                            // 结算页地址
                            name: "选择 / 新增地址",
                            phone: "",
                            site: "",
                            addressId: 0
                        };
                        if (response.result.memberAddress != null) {
                            clearingSite.name = response.result.memberAddress.trueName;
                            clearingSite.phone = response.result.memberAddress.mobPhone;
                            clearingSite.site =
                                response.result.memberAddress.areaInfo +
                                response.result.memberAddress.address;
                            clearingSite.addressId = response.result.memberAddress.addressId;
                        }
                        localStorage.clearingSite = JSON.stringify(clearingSite);

                        // 设置优惠卷金额
                        let deduction = {
                            // 优惠卷抵扣
                            num: 0,
                            id: 0
                        };
                        if (response.result.cartResult.cartVoList[0].fillMoney !== null) {
                            deduction.num = response.result.cartResult.cartVoList[0].fillMoney;
                            deduction.id = response.result.cartResult.cartVoList[0].couponId;
                        }
                        localStorage.deduction = JSON.stringify(deduction);

                        this.$router.push({path: `/clearing/${data.productInfoId}`});
                    } else if (response.status == 400) {
                        toast(this, response.message);
                    } else if (response.status == 600) {
                        toast(this, "请前往个人中心绑定手机号");
                    }
                });
            },
            // 收藏切换
            collectMethod() {
                if (this.collect === "收藏") {
                    let data = {
                        favoriteId: this.rulId
                    };
                    // 添加收藏
                    postData(apiUrl().addMyFavor, data).then(response => {
                        if (response.status == 200) {
                            this.collect = "已收藏";
                        } else if (response.status == 400) {
                            this.collect = "已收藏";
                        }
                        // console.log(response, "添加收藏结果");
                    });
                } else if (this.collect === "已收藏") {
                    // 取消收藏
                    let data = {
                        id: this.rulId
                    };
                    postData(apiUrl().deleteMyFavor, data).then(response => {
                        if (response.status == 200) {
                            this.collect = "收藏";
                        }
                        // console.log(response, "取消收藏结果");
                    });
                }
            }
        },
        components: {
            goodsDetailsLantern, // 引入商品详情的幻灯片
            goodsComments // 引入评论的子组件
        },
        created() {
            // 请求轮播图的图片
            // 调监听路由
            this.gainParams();
        },
        // 动态监听
        watch: {
            $route(n) {
                if (n.path.indexOf("/goods-details") != -1) {
                    this.gainParams();
                }
            }
        },
        // 所有页面元素创建完毕之后,挂载
        mounted() {},
        // 重新渲染页面时
        updated() {
        	// 更改富文本图片样式
        	var wrap = this.$refs.graphicDetails;
        	var box = wrap.getElementsByTagName("p");
        	for (var i = 0; i < box.length; i++) {
                if(box[i].children[0]){
                	box[i].removeAttribute("width");
	                box[i].removeAttribute("height");
                	console.log(box[i].children[0])
                	box[i].children[0].style.width = "100%";
	                box[i].children[0].style.height = 'auto';
	                box[i].children[0].style.marginTop = '10px';
                }
                // console.log(box[i])
            }
        	
        },
    };
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import "src/assets/scss/common";
    .goods-details-container {
        width: 100%;
        height: auto;
    }

    .goods-details-wrap {
        @include size(100%, auto);
        margin-bottom: 20px;

        .goods-details-info {
            @include size(100%, auto);
            background: #fff;
            @include box-sizing;
            padding: 18px 30px 18px;
            position: $rela;
        }
        .goods-details-info-head {
            @include size(100%, 50px);
            @include font(28px, 50px, normal, left, #333);
            @include text-over;
        }
        .goods-details-info-box {
            @include size(100%, auto);
            @include font(24px, 48px, normal, left, #999);
            @include text-over;
            margin: 0 0 22px 0;
        }
    }

    .goods-details-info-wrap {
        @include size(446px, 100px);
        .price-and-tally {
            @include size(446px, auto);
            margin-bottom: 10px;
            p {
                display: inline-block;
                @include font(26px, 40px, normal, left, #f0555a);
                float: left;
                margin-right: 10px;
                span {
                    font-size: 20px;
                }
            }
            .tally {
                height: 36px;
                float: left;
                li {
                    height: 36px;
                    display: inline-block;
                    float: left;
                    @include font(20px, 32px, normal, center, #71b42e);
                    padding: 0 18px;
                    border-radius: 16px;
                    border: 2px solid #71b42e;
                    margin-right: 10px;
                    @include box-sizing;
                }
            }
        }
        .originalPrice {
            @include size(446px, 40px);
            @include font(24px, 40px, normal, left, #999);

            .price {
                display: inline-block;
                margin-right: 10px;
                float: left;
                text-decoration: line-through;
            }
            .inventory {
                display: inline-block;
                float: left;
            }
        }
    }

    // 加减
    .add-subtract-wrap {
        @include size(228px, 60px);
        position: $abso;
        right: 30px;
        bottom: 40px;

        .subtract,
        .add {
            display: inline-block;
            @include size(60px, 60px);
            border-radius: 50%;
            @include font(26px, 60px, normal, center, #fff);
            background: #99cc66;
        }
        .subtract {
            float: left;
            margin-right: 4px;
        }
        .add {
            float: right;
        }

        .subtract.active,
        .add.active {
            background: #ccc;
        }

        .goodsNum {
            display: inline-block;
            float: left;
            @include size(100px, 60px);
            @include box-sizing;
            border: 2px solid #aaa;
            border-radius: 30px;
            // margin: 0 auto;
            background: #fff;
            @include font(26px, 60px, normal, center, #666);
        }
    }

    // 规格
    .specification-wrap {
        @include size(100%, auto);
        background: #fff;
        padding: 0 30px;
        @include box-sizing;
        @include font(22px, 80px, normal, left, #666);
        margin-bottom: 20px;
    }

    // 商品详情选项卡
    .goods-tab {
        @include size(100%, auto);
        background: #fff;
        margin: 0 auto;
        .goods-tab-head {
            @include size(100%, 80px);
            background: #fff;
            border-bottom: 2px solid #ddd;

            li:nth-of-type(1):before {
                content: "";
                display: block;
                @include size(1px, 40px);
                position: $abso;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto 0;
                background: #ddd;
            }
            li {
                @include size(50%, 80px);
                float: left;
                position: $rela;
                background: #fff;
                @include font(28px, 80px, normal, center, #727272);
                transition: all 0.1s linear;
            }
            li.active {
                @include font(28px, 80px, normal, center, #99cc66);
            }
            li.active:after {
                content: "";
                display: block;
                @include size(200px, 4px);
                position: $abso;
                left: 0;
                right: 0;
                bottom: 0;
                margin: 0 auto;
                background: #99cc66;
            }
        }

        .graphic-details,
        .commodity-comment {
            @include size(100%, auto);
            @include box-sizing;
            padding: 0 30px;
        }

        .graphic-details {
            @include font(28px, 80px, normal, left, #727272);
            img {
                width: 100%;
            }
        }
    }

    .commodity-comment {
        @include size(100%, auto);
    }

    // 商品详情页面底部
    .commodity-wrap {
        @include size(100%, 110px);
        position: $fixed;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        background: #fff;
        z-index: 50;
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.8);
        padding: 19px 30px;
        @include box-sizing;

        .collect-wrap {
            @include size(148px, 72px);
            float: left;
            margin-right: 42px;
            .collect-icon {
                @include size(40px, 40px);
                margin: 0 auto;
                background: url("../../assets/images/goods-details/collect1.png") no-repeat center / 40px 38px;
                transition: all 0.2s linear;
            }
            .collect-text {
                @include size(100%, 34px);
                @include font(24px, 40px, normal, center, #666);
                transition: all 0.2s linear;
            }
        }
        .collect-wrap.active {
            .collect-icon {
                background: url("../../assets/images/goods-details/collect2.png") no-repeat center / 40px 38px;
            }
        }
    }

    .add-shopping,
    .buy-immediately {
        @include size(240px, 72px);
        float: left;
        @include box-sizing;
        border-radius: 72px;
    }

    .add-shopping {
        background: #fff;
        @include font(24px, 70px, normal, center, #99cc66);
        margin-right: 20px;
        border: 2px solid #99cc66;
    }

    .buy-immediately {
        background: #99cc66;
        @include font(24px, 72px, normal, center, #fff);
    }
</style>
