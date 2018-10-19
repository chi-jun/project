<template>
    <!-- 增加减少 -->
    <div class="operation-container clearfix">
        <div class="add-subtract-wrap clearfix">
            <p class="subtract"
               @click="addSubtractNum(1)"
               :class="{'active': goodsNum == 1 || goodsNum == 0}"
            >
                <i class="iconfont icon-minus"></i>
            </p>
            <input type="tel"
                   class="goodsNum"
                   v-model.trim.number="goodsNum"
                   @click="gainNum"
                   @change="maximum(goodsNum)"
                   @blur="isEmpty()"
            >
            <p class="add"
               @click="addSubtractNum(2)"
               :class="{'active': goodsNum == inventory}"
            >
                <i class="iconfont icon-jia"></i>
            </p>
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
    import {postData, getData, apiUrl} from '@/constant/api'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                goodsNum: 1,        // 父组件传入的具体商品数值
                inventory: 0,       // 库存
                show: false,        // 提示框开关
                beforeNum: 0,        // 修改之前的数字
            }
        },
        // 计算属性
        computed: {
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
            // 增加或减少商品选购数量
            addSubtractNum(num) {
                this.myfn();                 // 阻止冒泡
                if (num === 1) {             // 删除操作
                    if (this.goodsNum >= 1) {  // 判断数据是否大于或等于1 当大于等于1 时 再减一
                        this.goodsNum--;     // 减少数量
                        this.updateMyCart(); // 调用请求
                        if(this.goodsNum != 0){
                            this.operation();    // 向父组件传参 显示加载提示
                        }
                    }
                    /*
                    if(this.goodsNum >= 1){
                        this.operation();    // 向父组件传参 显示加载提示
                    }*/
                    if (this.goodsNum == 0) {  // 判断数据是否等于零
                        this.show = true;    // 展示提示框
                        this.banSliding();   // 判断是否禁止滑动
                        // console.log(this.show)
                    }
                    if (this.goodsNum >= 1) {
                        this.setShopCartNum(Math.random()) // 每次新增任意设置购物车数量的值
                    }
                } else if (num === 2) {       // 新增操作
                    if (this.goodsNum < this.inventory) {
                        this.goodsNum++;     // 增加操作
                        this.updateMyCart(); // 请求数据
                        this.operation();    // 向父组件传参 显示加载提示
                        this.setShopCartNum(Math.random()) // 每次新增任意设置购物车数量的值
                    }
                }

            },
            // 增加减少数量接口
            updateMyCart() {
                let data = {
                    id: 0,                  // 是    Long    购物车ID
                    productId: 0,           // 是    lONG    商品id
                    num: 0                  // 是    Int 数量
                };
                data.id = this.result.cardId;              // 购物车ID
                data.productId = this.result.productId;    // 商品ID
                if(this.goodsNum === 0){
                    // console.log('進入強制更改數量為1判斷!');
                    data.num = 1;                               // 需要删除的数量
                }else {
                    data.num = this.goodsNum;                  // 需要删除的数量
                }
                // console.log(data1)
                // console.log(data, '更改數據傳遞的參數 002');
                postData(apiUrl().updateMyCart, data).then((response) => {
                    if (response.status == 200) {
                        // console.log('增加减少成功!');
                        this.inventory = response.result;           // 赋值库存
                        // this.operation();                        // 向父组件传参 显示加载提示
                    } else if (response.status == 400) {
                        // console.log('增加减少失败！')
                    }
                })
            },
            // 组织冒泡
            myfn(e) {
                window.event ? window.event.cancelBubble = true : e.stopPropagation();
            },
            // 判断输入后的值是否超过库存
            maximum(goodsNum) {
                // console.log(goodsNum);
                this.myfn();                    // 阻止冒泡
                this.goodsNum = this.goodsNum < this.inventory ? this.goodsNum : this.inventory;
                this.updateMyCart();        // 请求数据
                this.setShopCartNum(Math.random()) // 每次新增任意设置购物车数量的值
                this.operation();    // 向父组件传参 显示加载提示
                /*
                let oDiv = document.getElementById('app');   //获取元素div
                oDiv.onclick = function () {   //给元素增加点击事件
                    console.log('执行自点击事件!')
                };
                oDiv.click();  //执行点击事件，这样就模拟出了自动执行点击事件。
                */
            },
            // 点击时拿到现在的数据
            gainNum() {
                this.beforeNum = this.goodsNum;
                this.myfn();        // 阻止默认事件
            },
            // 检测是否为空
            isEmpty(){
                if(this.goodsNum == ''){
                    this.goodsNum = this.beforeNum;
                }
            },
            // 购物车新增减少传参 和 运算金额
            operation() {
                /*
                this.paramData.money = this.result.realPrice; // 金额
                this.paramData.num = this.goodsNum            // 存取数量
                this.$emit('operation-result', this.paramData)
                */
                this.$emit('operation-result', true);
            },
            // 点击背景图关闭
            close() {       // 取消刪除
                this.myfn();  // 组织默认事件
                this.show = false;
                this.addSubtractNum(2);
                this.banSliding();   // 判断是否禁止滑动
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
            // 禁止滑动
            banSliding() {
                if (this.show) {              // 当出现付款盒子的时候
                    this.stop();            // 禁止页面滚动
                    // console.log('禁止页面滚动');
                } else {
                    this.move();            // 允许页面滚动
                    // console.log('允许页面滚动');
                }
            },
            // 判断是否删除
            hintResult(num) {
                if (num) {  // 为真
                    let ids = [];              // 存储需要删除的数据 【数组】
                    // 发送删除请求
                    postData(apiUrl().deleteMyCart, {ids: this.result.cardId}).then((response) => {
                        if (response.status == 200) {
                            // console.log('删除成功!')
                            this.setShopCartNum(Math.random());  // 每次新增任意设置购物车数量的值
                        } else if (response.status == 400) {
                            // console.log('删除失败!')
                        }
                    })
                } else this.addSubtractNum(2); // 新增一个
                this.show = false;
                this.banSliding();   // 判断是否禁止滑动
            }
        },
        components: {},
        created() {
            this.goodsNum = this.result.repertory  // 赋值总的这条数据
            this.updateMyCart();                   // 请求一次数据
        },
        // 接收参数
        props: ['result', 'index'],
        // watch: {
        //     // 监听这个数据
        //     result() {
        //         console.log(this.result, '传入的数据')
        //     },
        //     // 监听是否删除
        //     removeHint(n) {
        //         console.log(n, '是否删除');
        //     }
        // }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';

    .operation-container {
        @include size(224px, 60px);
        float: right;
        position: $rela;
    }

    // 加减
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