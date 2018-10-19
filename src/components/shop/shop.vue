<template>
    <div class="shop-container clearfix">
        <section class="shop-wrap clearfix">
            <article
                    class="shop-box"
                    v-for="(item, index) in resultData"
                    @click="skipTarget(item.productId,item.sukIds)"
                    :id="item.cardId"
            >
                <div class="shop-box-select" :class="{'active': item.check}" @click="shopSelect(item)">
                    <i class="iconfont icon-gou"></i>
                </div>
                <div class="shop-box-con">
                    <div class="shop-product-pic">
                        <!--<img v-lazy="item.productAdImg" :alt="item.title">-->
                        <img :src="item.productAdImg" :alt="item.title">
                    </div>
                    <div class="shop-product-content">
                        <h4 class="shop-box-title">{{ item.title }}</h4>
                        <p>{{ item.description }}</p>
                    </div>
                    <div class="shop-product-price">
                        <p><em>￥</em>{{ item.realPrice }}</p>
                        <span>￥{{ item.marketPrice }}</span>
                    </div>
                    <!--加减运算-->
                    <!--<operation :result="item" :index="index" @operation-result="operationResult"></operation>-->
                    <!--<operation :result="item" :index="index" @operation-result="operationResult"></operation>-->

                    <!-- 增加减少 -->
                    <div class="operation-container clearfix">
                        <div class="add-subtract-wrap clearfix">
                            <p class="subtract"
                               @click="addSubtractNum(1, index)"
                               :class="{'active': item.repertory == 1 || item.repertory == 0}"
                            >
                                <i class="iconfont icon-minus"></i>
                            </p>
                            <input type="tel"
                                   class="goodsNum"
                                   v-model.trim.number="item.repertory"
                                   @click="gainNum(item.repertory)"
                                   @change="maximum(item)"
                                   @blur="isEmpty(item.repertory, index)"
                            >
                            <p class="add"
                               @click="addSubtractNum(2, index)"
                               :class="{'active': item.repertory == inventory}"
                            >
                                <i class="iconfont icon-jia"></i>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="shop-box-hint">
                    <p class="shop-box-hint-txt" v-show="item.isPackage == 1">包邮</p>
                    <p class="shop-box-hint-txt" v-show="item.isCheap == 1">特惠</p>
                    <p class="shop-box-hint-txt" v-show="item.isAct == 1">活动</p>
                    <p class="shop-box-hint-txt" v-show="item.isTimeDiscount == 1">限时优惠</p>
                </div>
            </article>
        </section>
        <!-- 页面底部 -->
        <section class="shop-footer">
            <div class="shop-box-check" :class="checkAll?'active':''" @click="selectAll">
                <i class="iconfont icon-gou"></i>
                <p>全选</p>
            </div>
            <div class="shop-footer-price">
                <p class="shop-price-wrap">合计: <span>￥{{ operation }}</span></p>
                <!--
                <div class="shop-footer-hint">
                    <p>不含运费</p>
                </div>
                -->
            </div>
            <div class="shop-footer-close-btn" :class="clearingBtn?'active':''" @click="clearing">结算</div>
        </section>
        <div class="shop-footer-del-btn" @click="shopDel">删除</div>

        <!-- 验证提示 -->
        <div class="invoice-reminder" :class="reminder?'active':''">
            {{ msg }}
        </div>

        <!-- 加载提示 -->
        <div class="loaded-tip" :class="{'active': loaded}">
            <div class="loaded-box">
                <div class="loaded-img">
                    <img src="../../assets/images/goods-details/loader.gif" alt="loaded">
                </div>
                <p>正在修改数量</p>
            </div>
        </div>

        <!-- 弹窗提示 -->
        <div class="hint-wrap" @click="close" :class="{'active': show}">
            <div class="hint-wrap-info" @click="myfn" :class="{'active': show}">
                <h4>删除商品提示</h4>
                <p class="info">是否确认要删除该商品!</p>
                <p class="hint-btn-y" @click="hintResult(1)">确认</p>
                <p class="hint-btn-n" @click="hintResult(0)">取消</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {postData, getData, apiUrl, toast} from '@/constant/api'
    import {mapMutations, mapGetters} from 'vuex'
//    import operation from 'base/shop-operation/shop-operation'

    export default {
        data() {
            return {
                resultData: {},  // 当前请求回来的数据
                selectBtn: '',   //
                changeDate: {},  // 新的方便更改的数据
                rentalNum: 0,    // 请求回来的总额
                checkAll: false, // 全选
                clearingData: [  // 存储结算页面的数据 预留
                    "name"
                ],
                clearingBtn: false, // 结算按钮
                reminder: false,    // 提示开关
                msg: '',            // 提示内容
                loaded: false,      // 加载提示开关

                inventory: 0,       // 库存
                show: false,        // 提示框开关
                beforeNum: 0,       // 修改之前的数字
                removeData: {},     // 存储删除的数据
            }
        },
        // 计算属性
        computed: {
            operation() {
                let rental = 0;
                if (this.resultData != '' || this.resultData != null || this.resultData != undefined) {
                    for (var i = 0; i < this.resultData.length; i++) {
                        // console.log(this.resultData[i], '循环')
                        if (this.resultData[i].check) {
                            rental += (this.resultData[i].realPrice * this.resultData[i].repertory)
                        }
                    }
                }
                /*
                for (var i = 0; i < this.resultData.length; i++) {
                    // console.log(this.resultData[i], '循环')
                    rental += (this.resultData[i].realPrice * this.resultData[i].repertory)
                }
                */
                // console.log(rental.toFixed(1), this.rentalNum)
                return rental.toFixed(2)
                //console.log(rental)
            },
            // vuex 获取数据
            ...mapGetters([
                'shoppingData',
                'shopCartNum'
            ])
        },
        methods: {
            // 映射vuex的数据
            ...mapMutations({
                setShoppingData: 'SET_SHOPPINGDATA',
                shoppingId: 'SET_SHOPPINGID',
                setShopCartNum: 'SET_SHOPCARTNUM'
            }),
            // 购物车商品选择
            shopSelect(item) {
                this.myfn() // 阻止冒泡
                // console.log(item)
                if (item.check) {
                    item.check = false;
                    this.checkAll = false;    // 让全选取消
                } else {
                    item.check = true;
                }
                // 判断当全选的时候让全选按钮亮， 当不是全选的时候， 让全选按钮取消
                let arr = [], num = this.resultData.length;
                // console.log(num)
                this.resultData.forEach((e, i) => {
                    if (e.check) {
                        arr.push(e);
                    }
                    arr.length === num ? this.checkAll = true : this.checkAll = false;
                });
                this.clearingResult(); // 判断是否有选择的
            },
            // 接收传递出来的参数
            operationResult(event) {
                console.log(event, '子组件传递的参数');
                if (event) {
                    this.loadedJudge(1);    // 判断是否出现加载提示
                    this.checkAll = false;
                    // this.selectAll()
                }


                /*
                console.log('传递出来的金额:' + event.money + '传递出来的索引:' + event.id + '传递出来的数量:' + event.num + '是否删除当前商品:' + event.del);
                if (event.del) {                                    // 判断是否删除
                    let newData = this.resultData.resultList.filter((e, i) => {
                        return i !== event.id // 拿到不属于删除索引的所有数据
                    })
                    console.log(newData)                   // 输出拿到不属于删除索引的所有数据
                    this.resultData.resultList = newData   // 改变渲染页面的参数
                    this.changeDate.resultList = newData   // 改变用于计算总额的数据
                } else {
                    this.changeDate.resultList[event.id].realPrice = event.money * event.num;
                    console.log(this.changeDate.resultList[event.id])
                }
                */
            },
            // 判断是否出现加载提示
            loadedJudge(num) {
                if (num) {
                    this.loaded = true;     // 展示加载提示
                    this.stop();            // 禁止页面滚动
                    console.log('禁止页面滚动');
                } else {
                    this.loaded = false;    // 展示加载提示
                    this.move();            // 允许页面滚动
                    console.log('允许页面滚动');
                }

                if (this.loaded) {
                    setTimeout(() => {
                        this.loadedJudge(0);    // 让加载提示消失
                    }, 1000)
                }
            },
            // 组织冒泡
            myfn(e) {
                window.event ? window.event.cancelBubble = true : e.stopPropagation();
            },
            // 跳转目标并且改变url参数
            // 点击带参数跳转详情页
            skipTarget(productId, sukIds) {
                let skuId = sukIds === null ? 0 : '';
                this.$router.push({path: `/goods-details/${productId}/${skuId}`})
            },
            // 全选
            selectAll() {
                console.log(this.resultData, '输入购物车数据') // 输入购物车数据
                if (this.checkAll) {
                    this.checkAll = !this.checkAll;
                    console.log('取消选择!');
                    if (this.resultData != '' || this.resultData != null || this.resultData != undefined) {
                        this.resultData.forEach((e, i) => {
                            // console.log(e , '循环输出')
                            e.check = false;
                        })
                    }
                } else {
                    this.checkAll = !this.checkAll;
                    console.log('选中!')
                    if (this.resultData != '' || this.resultData != null || this.resultData != undefined) {
                        this.resultData.forEach((e, i) => {
                            // console.log(e , '循环输出')
                            e.check = true;
                        })
                    }
                }
                this.clearingResult(); // 判断是否有选择的
            },
            // 删除按钮
            shopDel() {
                let ids = [];      // 存储需要删除的数据 【数组】
                let newArr = this.resultData.filter((e) => {
                    // console.log(e +':'+ i)
                    if (e.check) {
                        ids.push(e.cardId)
                    }
                    return !e.check
                })

                if (ids.length > 0) {
                    this.$confirm({
                        title: "提示",
                        content: "确定删除所选商品?"
                    }).then(() => { // 点击确定的回调函数
                        let ids = [];      // 存储需要删除的数据 【数组】
                        let newArr = this.resultData.filter((e) => {
                            // console.log(e +':'+ i)
                            if (e.check) {
                                ids.push(e.cardId)
                            }
                            return !e.check
                        })

                        console.log(ids)
                        // 去掉forEach 循环 然后将 传递的data e 改变为 ids
                        // ids.forEach((e) => {
                        // 发送删除请求
                        postData(apiUrl().deleteMyCart, {ids: ids}).then((response) => {
                            console.log(response)
                            if (response.status == 200) {
                                console.log('删除成功!')
                                this.getCartPage();                     // 重新请求数据 渲染页面
                                this.setShopCartNum(Math.random());     // 设置vuex 重新渲染页面底部数字
                            } else if (response.status == 400 || response.status == 500) {
                                console.log('删除失败!')
                            }
                        })
                        // })
                        this.checkAll = false; // 取消选中状态
                        this.clearingResult(); // 判断是否有选择的
                    }).catch(() => { // 点击取消的回调函数

                    });
                } else {
                    toast(this, "请先选择需要删除的商品！");
                }


                /*
                console.log(newArr, data)
                this.resultData = newArr     // 改变渲染页面的参数
                // this.changeDate = newArr   // 改变用于计算总额的数据
                */
            },
            // 结算跳转存储数据
            clearing() {
                if (this.clearingBtn) {
                    // reserved 购物车跳转结算携带参数过去
                    let shopId = [];
                    this.resultData.forEach((e, i) => {
                        if (e.check) {
                            shopId.push(e.cardId)
                        }
                    })
                    // console.log(shopId, '输出存储的购物车id')  // 输出存储的购物车id
                    postData(apiUrl().cartBuyNow, {cardId: shopId}).then((response) => {
                        if (response.status == 200) {
                            // console.log(response.result, '购物车结算数据!')
                            localStorage.clearingData = JSON.stringify(response.result);  // 设置localStorage数据

                            // 设置地址
                            let clearingSite = {     // 结算页地址
                                name: '选择 / 新增地址',
                                phone: '',
                                site: '',
                                addressId: 0
                            };
                            if (response.result.memberAddress != null) {
                                clearingSite.name = response.result.memberAddress.trueName;
                                clearingSite.phone = response.result.memberAddress.mobPhone;
                                clearingSite.site = response.result.memberAddress.areaInfo + response.result.memberAddress.address;
                                clearingSite.addressId = response.result.memberAddress.addressId;
                            }
                            localStorage.clearingSite = JSON.stringify(clearingSite);

                            // 设置优惠卷金额
                            let deduction = {                   // 优惠卷抵扣
                                num: 0,
                                id: 0
                            };
                            if (response.result.cartResult.cartVoList[0].fillMoney !== null) {
                                deduction.num = response.result.cartResult.cartVoList[0].fillMoney;
                                deduction.id = response.result.cartResult.cartVoList[0].couponId
                            }
                            localStorage.deduction = JSON.stringify(deduction);

                            this.$router.push({path: `/clearing/${shopId[0]}`});
                        } else if (response.status == 600) {
                            toast(this, "请前往个人中心绑定手机号");
                        }
                    })
                    // this.shoppingId(shopId) // 设置vuex 携带购物车id数据
                    // 跳转结算页面
                    // this.$router.push({path: `/clearing/`})

                    // 取消選擇
                    this.checkAll = false;
                    console.log('取消选择!')
                    this.resultData.forEach((e, i) => {
                        // console.log(e , '循环输出')
                        e.check = false;
                    })
                    // 结算按钮变灰色
                    this.clearingBtn = false;
                } else {
                    this.hintModel('请选择需要结算的商品!')
                }
            },
            getCartPage() {
                this.resultData = '';   // 清空先前请求的数据
                let data = {
                    pageSize: 9999,
                    pageNo: 1,
                }
                postData(apiUrl().findMyCartPage, data).then((response) => {
                    if (response.status == 200) {
                        // console.log(response, '查询购物车列表结果')
                        if (response.result.cartVoList[0]) {
                            this.rentalNum = response.result.cartVoList[0].totalPrice; // 拿到总额
                        }
                        let data1 = [], data2 = [];
                        response.result.cartVoList.forEach((item) => {
                            // console.log(e)
                            item.cartList.forEach((e) => {
                                data1.push(e);
                                data2.push(e);
                            })
                        })
                        // console.log(data1)
                        this.resultData = data1;   // 用于渲染页面的数据
                        this.changeDate = data2;   // 用于计算金额的数据
                        // this.changeDate = JSON.parse(JSON.stringify(response.result))
                        // this.setShoppingData(this.resultData)
                        // JSON.stringify 转字符串 JSON.parse 转对象
                    }
                })
            },
            // 判断是否有选择的数据,当选择时 改变结算按钮
            clearingResult() {
                let num = 0;
                this.resultData.forEach((e) => {
                    if (e.check) {
                        num++
                    }
                    if (num > 0) {
                        this.clearingBtn = true;
                    } else if (num <= 0) {
                        this.clearingBtn = false;
                    }
                })
            },
            // 提示方法
            hintModel(data) {
                this.reminder = true;
                this.msg = data;

                // 让提示框消失
                if (this.reminder) {
                    setTimeout(() => {
                        this.reminder = false;
                        this.msg = '';
                    }, 2600)
                }
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
            },
            // 增加或减少商品选购数量
            addSubtractNum(num, index) {
                this.myfn();                 // 阻止冒泡
                // console.log(this.resultData[index]);
                var item = this.resultData[index];  // 存储数据
                this.inventory = 0;                 // 清空库存

                // 首先请求商品详情的库存
                let data;
                if (item.skuId && item.skuId != "null") {
                    data = {
                        skuId: item.skuId,
                        productInfoId: item.productId
                    };
                } else {
                    data = {
                        productInfoId: item.productId
                    };
                }
                postData(apiUrl().findProductInfoSku, data).then((response) => {
                    if (response.status == 200) {
                        this.inventory = response.result.repertory; // 储存库存
                        // console.log('查询库存成功!', this.inventory);

                        // 当前商品库存请求成功时再判断是增加或减少
                        if(num === 1){  // 减少操作
                            if(item.repertory == 1){ // 当等于0的时候不再减少,出现提示窗口
                                this.hintRemove(item);   // 出现提示框, 判断是否删除
                            }else { // 否则不等于零的时候
                                this.updateMyCart(item, 1); // 调用请求
                            }
                        }else if(num === 2){
                            if(item.repertory < this.inventory){
                                this.updateMyCart(item, 2); // 调用请求
                            }
                        }
                    }else {
                        console.log('查询库存失败!');
                    }
                });
            },
            // 增加减少数量接口
            updateMyCart(item, type) {
                if(type == 1){
                    item.repertory--;
                }else if(type == 2){
                    item.repertory++;
                }

                let data = {
                    id: 0,                  // 是    Long    购物车ID
                    productId: 0,           // 是    lONG    商品id
                    num: 0                  // 是    Int 数量
                };
                data.id = item.cardId;              // 购物车ID
                data.productId = item.productId;    // 商品ID
                if(item.repertory === 0){
                    // console.log('進入強制更改數量為1判斷!');
                    data.num = 1;                               // 需要删除的数量
                }else {
                    data.num = item.repertory;                  // 需要删除的数量
                }
                // 修改购物车商品数量
                postData(apiUrl().updateMyCart, data).then((response) => {
                    // let inventory = response.result;           // 赋值库存
                    if (response.status == 200) {
                        //  console.log('增加减少成功!');
                        this.loadedJudge(1);    // 判断是否出现加载提示
                    } else if (response.status == 400) {
                        console.log('增加减少失败！')
                    }
                })
            },
            // 点击时拿到现在的数据
            gainNum(item) {
                this.myfn();        // 阻止默认事件
                this.beforeNum = item;
                // console.log(this.beforeNum, '存储数量');
            },
            // 检测是否为空
            isEmpty(item, index){
                if(!item){
                    this.resultData[index].repertory = this.beforeNum;
                    // console.log(item, '失去焦点时为空!', this.beforeNum)
                }else {
                    // console.log(item, '失去焦点时不为空!')
                }
            },
            // 判断输入后的值是否超过库存
            maximum(item) {
                this.myfn();                    // 阻止冒泡


                this.inventory = 0;                 // 清空库存
                // 首先请求商品详情的库存
                let data;
                if (item.skuId && item.skuId != "null") {
                    data = {
                        skuId: item.skuId,
                        productInfoId: item.productId
                    };
                } else {
                    data = {
                        productInfoId: item.productId
                    };
                }
                postData(apiUrl().findProductInfoSku, data).then((response) => {
                    if (response.status == 200) {
                        this.inventory = response.result.repertory; // 储存库存
                        // console.log('查询库存成功!', this.inventory);
                        item.repertory = item.repertory < this.inventory ? item.repertory : this.inventory;

                        // 当库存查询成功, 并且对比之后,修改购物车数量
                        let data = {
                            id: 0,                  // 是    Long    购物车ID
                            productId: 0,           // 是    lONG    商品id
                            num: 0                  // 是    Int 数量
                        };
                        data.id = item.cardId;              // 购物车ID
                        data.productId = item.productId;    // 商品ID
                        if(item.repertory === 0){
                            // console.log('進入強制更改數量為1判斷!');
                            data.num = 1;                               // 需要删除的数量
                        }else {
                            data.num = item.repertory;                  // 需要删除的数量
                        }
                        // 修改购物车商品数量
                        postData(apiUrl().updateMyCart, data).then((response) => {
                            // let inventory = response.result;           // 赋值库存
                            if (response.status == 200) {
                                //  console.log('增加减少成功!');
                                this.loadedJudge(1);    // 判断是否出现加载提示
                            } else if (response.status == 400) {
                                console.log('增加减少失败！')
                            }
                        })

                    }else {
                        console.log('查询库存失败!');
                    }
                });

                // this.operation();    // 向父组件传参 显示加载提示
                /*
                let oDiv = document.getElementById('app');   //获取元素div
                oDiv.onclick = function () {   //给元素增加点击事件
                    console.log('执行自点击事件!')
                };
                oDiv.click();  //执行点击事件，这样就模拟出了自动执行点击事件。
                */
            },
            // 出现提示框，判断是否删除
            hintRemove(item) {
                this.show = true;       // 展示提示框
                this.removeData = item; // 存储需要删除的数据
                this.banSliding();      // 判断是否禁止滑动
            },
            // 判断是否删除
            hintResult(num) {
                if (num) {  // 为真
                    let ids = [];              // 存储需要删除的数据 【数组】
                    // 发送删除请求
                    postData(apiUrl().deleteMyCart, {ids: this.removeData.cardId}).then((response) => {
                        if (response.status == 200) {
                            // console.log('删除成功!')
                            this.setShopCartNum(Math.random());  // 每次新增任意设置购物车数量的值
                        } else if (response.status == 400) {
                            // console.log('删除失败!')
                        }
                    })
                    this.checkAll = false; // 取消全选
                }
                this.show = false;
                this.banSliding();   // 判断是否禁止滑动
            },
            // 点击提示是否删除背景图关闭
            close() {       // 取消刪除
                this.myfn();  // 组织默认事件
                this.show = false;
                this.banSliding();   // 判断是否禁止滑动
            },
            // 判断是否禁止滑动
            banSliding() {
                if (this.show) {              // 当出现付款盒子的时候
                    this.stop();            // 禁止页面滚动
                    // console.log('禁止页面滚动');
                } else {
                    this.move();            // 允许页面滚动
                    // console.log('允许页面滚动');
                }
            },
        },
        components: {
            // operation
        },
        created() {
            this.getCartPage();
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
                // 当监听到url变化的时候取消购物车全选
                if (this.resultData != '') {
                    this.resultData.forEach((e, i) => {
                        e.check = false;
                    })
                }
                this.checkAll = false;
                this.clearingBtn = false;
                this.setShopCartNum(Math.random());     // 设置vuex 重新渲染页面底部数字
            },
            shopCartNum(n) {
                // this.resultData = '';   // 清空先前请求的数据
                this.getCartPage();
            }/*,
            childComponentsNum(n) { // 监听子组件传递出来的参数
                this.resultData = '';   // 清空先前请求的数据
                this.getCartPage();     // 重新请求数据
            }*/
        },
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';

    .shop-container {
        width: 100%;
        height: auto;
        @include box-sizing;
        margin: 0 auto;

        .shop-wrap {
            @include size(100%, auto);
            margin: 0 auto 114px;
            @include box-sizing;
            /*background: red;*/
        }
        .shop-box, .shop-box2 {
            @include size(100%, 332px);
            margin: 0 auto 20px;
            background: #fff;
            @include box-sizing;
            padding: 0 30px;
        }
        .shop-box-select {
            @include size(60px, 240px);
            float: left;
            position: $rela;
            i {
                display: inline-block;
                @include size(40px, 40px);
                border-radius: 50%;
                border: 2px solid #acacac;
                background: #fff;
                position: $abso;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;
                transition: all .2s linear;
                @include font(40px, 40px, normal, center, #fff);
            }
        }
        .shop-box-select.active {
            i {
                border: 2px solid #8ec25a;
                @include font(40px, 40px, normal, center, #fff);
                background: #8ec25a;
            }
        }
        .shop-box-hint {
            @include size(100%, 92px);
            float: left;
            // @include font(26px, 92px, normal, left, #666);
            @include text-over;
            @include box-sizing;
            padding: 0 0 0 60px;
        }
        .shop-box-hint-txt {
            display: inline-block;
            float: left;
            height: 32px;
            @include box-sizing;
            padding: 16px;
            border-radius: 16px;
            border: 2px solid #71b42e;
            margin: 26px 12px 0 0;
            @include font(20px, 2px, normal, center, #7dba46);
        }
    }

    .shop-box-con {
        @include size(630px, 240px);
        float: left;
        position: $rela;
        border-bottom: 1px solid #ddd;

        .shop-product-pic {
            display: inline-block;
            @include size(220px, 220px);
            margin: 10px 0 10px 0;
            float: left;
            overflow: hidden;
            // background: red;
            img {
                width: 100%;
            }
        }

        .shop-product-content {
            @include size(410px, 154px);
            float: left;
            @include box-sizing;
            padding: 20px 0 0 0;
            h4 {
                @include size(100%, auto);
                @include font(28px, 48px, normal, left, #333);
                @include txtover(2);
            }
            p {
                @include size(100%, 46px);
                @include font(26px, 46px, normal, left, #999);
                @include text-over;
            }
        }
        .shop-product-price {
            @include size(186px, 86px);
            float: left;
            p {
                @include size(100%, 44px);
                @include font(26px, 44px, normal, left, #f0555a);
                @include text-over;
                em {
                    font-style: normal;
                    font-size: 20px;
                }
            }
            span {
                display: inline-block;
                text-decoration: line-through;
                @include size(100%, 42px);
                @include font(18px, 42px, normal, left, #999);
                @include text-over;
            }
        }
    }

    // 页面底部
    .shop-footer {
        @include size(100%, 110px);
        background: #fff;
        position: $fixed;
        bottom: 100px;
        left: 0;
        right: 0;
        margin: 0 auto;
        -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        @include box-sizing;
        padding: 0 30px;

        // 全选
        .shop-box-check {
            @include size(135px, 110px);
            float: left;
            position: $rela;
            @include box-sizing;
            padding: 0 0 0 40px;

            i.icon-gou {
                display: block;
                @include size(40px, 40px);
                @include box-sizing;
                border-radius: 50%;
                border: 2px solid #acacac;
                -webkit-transition: all .2s linear;
                transition: all .2s linear;
                position: $abso;
                left: 0;
                top: 0;
                bottom: 0;
                margin: auto 0;
                background: #fff;
                @include font(40px, 40px, normal, center, #fff);
            }

            p {
                @include size(95px, 110px);
                @include font(26px, 110px, normal, center, #666);
            }
            // background: red;
        }
        .shop-box-check.active {
            i {
                border: 2px solid #8ec25a;
                @include font(40px, 40px, normal, center, #fff);
                background: #8ec25a;
            }
        }

        // 价钱
        .shop-footer-price {
            @include size(394px, 110px);
            @include box-sizing;
            padding: 0 0 0 20px;
            float: left;
            /*
            .shop-footer-hint {
                @include size(100%, 36px);
                @include font(22px, 36px, normal, left, #666);
                float: left;
            }*/
            .shop-price-wrap {
                display: block;
                @include size(100%, 110px);
                @include font(26px, 110px, normal, left, #666);
                float: left;
                span {
                    color: #f0555a;
                }
            }
        }

        // 结算
        .shop-footer-close-btn {
            @include size(160px, 70px);
            background: #ccc;
            border-radius: 60px;
            float: right;
            margin: 20px 0 0 0;
            @include font(28px, 70px, normal, center, #fff);
        }
        .shop-footer-close-btn.active {
            background: #99cc66;
        }
    }

    // 删除
    .shop-footer-del-btn {
        @include size(112px, 88px);
        @include font(26px, 88px, normal, center, #fff);
        position: $fixed;
        top: 0;
        right: 0;
        z-index: 51;
    }

    // 提示框
    .invoice-reminder {
        @include size(470px, 120px);
        background: #fff;
        position: $fixed;
        top: -200%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
        transition: all .2s ease;
        border-radius: 12px;
        -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        @include font(28px, 120px, normal, center, #fff);
        @include box-sizing;
        background: rgba(0, 0, 0, .6);
    }

    .invoice-reminder.active {
        top: 0;
    }

    // 加载提示
    .loaded-tip {
        @include size(100%, 100%);
        position: $fixed;
        top: 0;
        left: 0;
        right: -200%;
        bottom: 0;
        margin: auto;
        z-index: 200;
        transition: all .2s ease;
        background: rgba(0, 0, 0, .8);

        .loaded-box {
            display: block;
            @include size(300px, 140px);
            // background: #fff;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }

        .loaded-img {
            @include size(80px, 80px);
            // background: red;
            margin: 0 auto;
            overflow: hidden;
            img {
                width: 100%;
            }
        }
        p {
            @include size(100%, 60px);
            @include font(28px, 60px, normal, center, #fff);
        }
    }

    .loaded-tip.active {
        right: 0;
    }


    // 数量加减
    .operation-container {
        @include size(224px, 60px);
        float: right;
        position: $rela;
    }

    .add-subtract-wrap {
        @include size(228px, 60px);

        .subtract, .add {
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

        .subtract.active, .add.active {
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

    // 弹窗提示
    .hint-wrap {
        @include size(100%, 100%);
        position: $fixed;
        top: 0;
        left: -200%;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 200 !important;
        transition: all .2s ease;
        background: rgba(0, 0, 0, .8);
    }

    .hint-wrap.active {
        left: 0;
        z-index: 100 !important;
    }

    .hint-wrap-info {
        @include size(690px, 360px);
        background: #fff;
        position: $fixed;
        top: 0;
        left: 0;
        right: -200%;
        bottom: 0;
        margin: auto;
        z-index: 101;
        transition: all .4s ease;
        border-radius: 12px;
        padding: 0 30px;
        @include box-sizing;

        -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, .2);
        @include box-sizing;

        h4 {
            @include size(100%, 112px);
            @include font(28px, 112px, normal, center, #333);
        }
        .info {
            @include size(100%, 65px);
            @include font(26px, 65px, normal, center, #666);
            margin: 0 0 60px 0;
        }
    }

    .hint-wrap-info.active {
        right: 0;
    }

    .hint-btn-y, .hint-btn-n {
        @include size(300px, 80px);
        border-radius: 70px;
        @include font(28px, 80px, normal, center, #fff);
    }

    .hint-btn-y {
        float: right;
        background: #8ec25a;
        border: 2px solid #8ec25a;
    }

    .hint-btn-n {
        float: left;
        background: #fff;
        border: 2px solid #c7c7c7;
        color: #999;
    }
</style>
