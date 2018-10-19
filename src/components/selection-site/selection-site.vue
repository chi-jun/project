<template>
    <div class="selection-site-container clearfix">
        <section class="selection-wrap" v-for="(item,index) in resultData" @click="back(item)">
            <p>
                <span>{{ item.trueName }}</span>
                <span>{{ item.mobPhone }}</span>
            </p>
            <p>
                {{ item.areaInfo}} {{ item.address  }}
            </p>
            <p>
                邮编:{{ item.zipCode }}
            </p>
        </section>
        <section class="selection-site-foot">
            <p @click="toAddAddress()">添加新地址</p>
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
                resultData: {},              // 存储请求数据
                address: {}                  // 存储选中的地址
            }
        },
        // 方法
        methods: {
            // 设置地址并返回上一页
            back (item) {
                this.address.name = item.trueName;
                this.address.site = item.areaInfo + item.address;
                this.address.phone = item.mobPhone;
                this.address.addressId = item.addressId
                localStorage.clearingSite = JSON.stringify(this.address) // 设置本地缓存
                this.$router.back();           // 返回上一页
                // this.$router.push({path: `/clearing`})
            },
            // 前往 添加新地址页面
            toAddAddress () {
                this.$router.push({path: `/add-address`})
            },
            // 获取地址列表数据
            getAddressData() {
                let data = {
                    pageNo: 1,
                    pageSize: 9999,
                }
                postData(apiUrl().findMyAddress, data).then((response) => {
                    if(response.status == 200){
                        console.log(response.result.resultList)
                        this.resultData = response.result.resultList;
                    }
                })
            }
        },
        // 计算属性
        computed: {},
        // 注册子组件
        components: {},
        // 实例化之前
        created() {
            this.getAddressData();      // 请求数据
        },
        // 监听
        watch: {
            $route(n) {
                this.resultData = '';
                this.getAddressData();      // 请求数据
                console.log('请求数据')
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .selection-site-container {
        @include size(100%, auto);
        margin: 0 auto;
        @include box-sizing;
        padding: 30px 30px 100px;

        .selection-wrap {
            @include size(100%, auto);
            background: #fff;
            border-radius: 10px;
            @include box-sizing;
            padding: 24px 30px;
            margin: 0 auto 20px;
            p:nth-of-type(1) {
                @include size(100%, 58px);
                @include font(28px, 58px, normal, left, #333);
                @include text-over;
                span:nth-of-type(1) {
                    margin: 0 20px 0 0;
                }
            }
            p:nth-of-type(2) {
                @include size(100%, auto);
                @include font(24px, 50px, normal, left, #999);
            }
            p:nth-of-type(3) {
                @include size(100%, 50px);
                @include font(24px, 50px, normal, left, #999);
            }
        }

        .selection-site-foot {
            @include size(100%, 120px);
            position: $fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0 auto;
            background: #fff;
            z-index: 50;
            box-shadow: 8px 8px 16px rgba(0, 0, 0, 1);
            @include box-sizing;
            padding: 0 30px;
            p {
                @include size(100%, 80px);
                @include font(26px, 80px, normal, center, #fff);
                border-radius: 40px;
                background: #8ec25a;
                margin: 20px 0 0 0;
            }
        }
    }
</style>