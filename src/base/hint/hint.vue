<template>
    <!-- 提示框 -->
    <div class="hint-wrap" @click="close" :class="{'active': show}">
        <div class="hint-wrap-info" @click="myfn" :class="{'active': show}">
            <h4>删除商品提示</h4>
            <p class="info">是否确认要删除该商品!</p>
            <p class="hint-btn-y" @click="operation(1)">确认</p>
            <p class="hint-btn-n" @click="operation(0)">取消</p>
        </div>
    </div>
</template>

<script>
    import { postData, getData, apiUrl } from '@/constant/api'
    export default {
        data () {
            return {
                result: false,       // 返回的数据
                show: false
            }
        },
        // 计算属性
        computed: {
        },
        methods: {
            // 阻止冒泡
            myfn (e) {
                window.event? window.event.cancelBubble = true : e.stopPropagation();
            },
            // 点击背景图关闭
            close () {       // 取消刪除
               this.myfn();  // 组织默认事件
               this.show = false;
               this.operation(0);
            },
            // 向父组件传递参数
            operation (num) {
                if (num){  // 为真
                    this.result = true;
                    this.$emit('hintResult', this.result);
                }else{     // 为假
                    this.result = false;
                    this.$emit('hintResult', this.result);
                }
                this.show = false;
            },
            //实现滚动条无法滚动
            mo (e){
                e.preventDefault()
            },
            // 禁止页面滑动
            stop (){
                document.body.style.overflow='hidden';
                document.addEventListener("touchmove",this.mo,false);
            },
            //取消滑动限制出现滚动条
            move (){
                document.body.style.overflow='';
                document.removeEventListener("touchmove",this.mo,false);
            },
            // 判断传参执行是否删除操作
            isOption(){
                // console.log(this.option, 'isOption , 查看父组件传递过来的参数执行展示操作')          //查看父组件传递过来的参数执行展示操作
                if(this.removeHint){
                    this.show = true;    // 展示提示框
                    this.stop();         // 禁止页面滚动
                }else {
                    this.show = false;   // 展示提示框
                    this.move();         // 禁止页面滚动
                }
            }
        },
        components: {},
        created() {
            // this.isOption();        //查看父组件传递过来的参数执行展示操作
        },
        // 接收参数
        // props: ['option'],
        watch: {
            // 监听这个数据
            result () {
                // console.log(this.result)
            },
            // 监听vuex传递的数据是否删除
            removeHint(n) {
                // console.log(n, '查看父组件传递过来的参数执行展示操作')
                this.isOption();//查看父组件传递过来的参数执行展示操作
            }
            /*
            option (n) {
                console.log(n, '查看父组件传递过来的参数执行展示操作')
                this.isOption();   //查看父组件传递过来的参数执行展示操作
            }*/
        }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .hint-wrap {
        @include size(100%, 100%);
        position: $fixed;
        top: 0;
        left: -200%;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
        transition: all .2s ease;
        background: rgba(0, 0, 0, .8);
    }
    .hint-wrap.active {
        left: 0;
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

        -webkit-box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
        -moz-box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
        box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
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
