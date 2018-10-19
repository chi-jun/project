<template>
    <!-- 选购 -->
    <div class="choose-container clearfix">
        <section class="choose-wrap clearfix">
            <article class="choose-box" v-for="item in resultData" :id="item.id" :name="item.id">
                <div class="choose-box-head">
                    <div class="choose-box-head-img">
                        <img :src="item.img" :alt="item.alt">
                    </div>
                    <p class="choose-box-head-txt">{{ item.pdClassName}}</p>
                </div>
                <ul class="choose-box-con clearfix">
                    <router-link  :to="'/choose-list/'+ item.id" tag="li" :key="item.id" :id="item.id">
                       	全部
                    </router-link>
                    <router-link v-for="i in item.subProductClassList" :to="'/choose-list/'+ i.id" tag="li" :key="i.id" :id="i.id">
                        {{ i.pdClassName}}
                    </router-link>
                </ul>
            </article>
        </section>
    </div>
</template>

<script>
    import { postData, getData, apiUrl } from '@/constant/api'
    export default {
        data () {
            return {
                resultData: {},
                urlNum: ''
            }
        },
        // 计算属性
        computed: {},
        methods: {
          	findAllClass(){
            	postData('chooseBuy/findAllClass').then((res) => {
              		this.resultData = res.result
              		console.log(this.resultData)
            	})
          	},
	        movet (target) {
	            clearInterval(timer);
	            var timer = setInterval(function() {
	                var scoll = document.documentElement.scrollTop || document.body.scrollTop;
	                var speed = (target - scoll) / 8;
	                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
	                flag = true;
	                document.documentElement.scrollTop = document.body.scrollTop = scoll + speed;
	                if(scoll == target) {
	                    clearInterval(timer);
	                }
	            }, 20)
	        }
        },
        components: {},
        created() {
        this.findAllClass();
        },
        // 动态监听
        watch: {
            $route (n) {
                // 做首页跳到当前页面做滚动
              // console.log(n);
              this.urlNum = this.$route.query.item
                if (this.urlNum !== undefined) {
                    // console.log(this.urlNum)
                }
                // var mTop = document.getElementById('1').offsetTop;
                // console.log(mTop)
                /*
                var url = window.location.toString();
                var arr = url.split('#');
                if(arr[1] === "group-party"){
                    var mTop = document.getElementById('group-party').offsetTop;
                    movet(mTop);
                }*/
            }
        },
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .choose-container {
        width: 100%;
        height: auto;
        margin: 0 auto;
    }
    .choose-wrap {
        @include size(100%, auto);
        margin: 0 auto;

        .choose-box:last-child {
            margin-bottom: 0;
        }
    }
    .choose-box {
        @include size(100%, auto);
        @include box-sizing;
        margin-bottom: 4px;
        background: #fff;
        padding: 0 30px;
    }
    .choose-box-head {
        @include size(100%, 100px);
        border-bottom: 1px solid #ddd;
    }
    .choose-box-head-img {
        @include size(60px, 60px);
        border-radius: 50%;
        float: left;
        margin: 20px 20px 20px 0;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    .choose-box-head-txt {
        @include size(88%, 100%);
        float: left;
        @include font(30px, 100px, normal, left, #666);
    }
    .choose-box-con {
        @include size(100%, auto);
        @include box-sizing;
        padding: 15px 0 15px 80px;
        margin: auto 0;

        li {
            @include size(184px, 48px);
            box-sizing: inherit;
            border: 2px solid #aaa;
            border-radius: 48px;
            float: left;
            margin: 15px 28px 15px 0;
            @include font(24px, 44px, normal, center, #999);
            @include text-over;
        }
        li:nth-of-type(3n) {
            float: left;
            margin: 15px 0 15px 0;
        }

    }
</style>
