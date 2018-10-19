<template>
    <div class="invoice-container clearfix">
        <div class="invoice-headline">发票材质</div>
        <div class="invoice-texture">
            <p v-for="(item, index) in invoiceTexture" :class="{'active': invoiceData.materialType == index}" @click="selectTexture(index)">{{ item }}</p>
            <span>部分商品仅提供普通电子发票，具体以实际出具为准</span>
        </div>
        <div class="invoice-headline">发票类型</div>
        <div class="invoice-type">
            <p v-for="(item, index) in invoiceType" :class="{'active': invoiceData.invoiceType == index + 1}" @click="selectType(index)">{{ item }}</p>
        </div>
        <div class="invoice-headline">发票抬头</div>
        <div class="invoice-rise">
            <p v-for="(item, index) in invoiceRise" :class="{'active': invoiceData.invoiceTitle == item}" @click="selectRise(item)"><i class="iconfont icon-gou"></i><span>{{ item }}</span></p>
        </div>
        <div class="invoice-headline">收票人信息</div>
        <div class="collector-info">
            <div class="collector-info-list">
                <label for="phone"><span>*</span>收票人手机</label>
                <input type="tel" id="phone" v-model.trim="invoiceData.telephoneRegistration">
            </div>
            <div class="collector-info-list">
                <label for="email">收票人邮箱</label>
                <input type="text" id="email" v-model.trim="invoiceData.registeredAddress" placeholder="用来接收电子发票的邮箱，可选填">
            </div>
        </div>
        <div class="invoice-headline">发票内容</div>
        <div class="invoice-content clearfix">
            <p v-for="(item, index) in invoiceContent" :class="{'active': invoiceData.invoiceContent == item}" @click="selectContent(item)" ><i class="iconfont icon-gou"></i><span>{{ item }}</span></p>
        </div>
        <div class="invoice-confirm" @click="invoiceSubmit()">确定</div>

        <!-- 验证提示 -->
        <div class="invoice-reminder" :class="invoiceReminder.reminder?'active':''">
            {{ invoiceReminder.msg }}
        </div>
    </div>
</template>

<script>
    import { postData, getData, apiUrl } from '@/constant/api'
    import { mapMutations, mapGetters } from 'vuex'
    export default {
        // 数据
        data () {
            return {
                resultData: {},                 // 存储请求数据
                invoiceData: {                  // 需要传递给后台的数据
                    materialType: 0,            // 否	String	类型 0：纸质发票 1：电子发票
                    invoiceType: 1,             // 否	String	发票类型1普通发票2增值税发票
                    unitName: '个人',            // 否	String	单位 个人
                    invoiceTitle: '个人',	    // 否	String	单位 个人 发票抬头
                    invoiceContent: '明细',      // 否	String	发票内容
                    telephoneRegistration: '',  // 否	String	注册电话
                    registeredAddress: '',      // 否	String	注册邮箱
                },
                invoiceTexture: [               // 发票材质文字
                    '纸质发票',
                    '电子发票'
                ],
                invoiceType: [                  // 发票类型文字
                    '普通发票',
                    '增值税发票'
                ],
                invoiceRise: [                  // 发票抬头
                    '个人',
                    '单位'
                ],
                invoiceContent: [               // 发票内容
                    '明细',
                    '耗材',
                    '日用品',
                    '电子'
                ],
                invoiceReminder: {
                    msg: '',                    // 验证提示
                    reminder: false
                },
                regPhone: /^[1][0-9][0-9]{9}$/, // 手机校验正则
                regEmail: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,   // 邮箱校验
                invoiceTypes: '纸质发票',        // 存储vuex的信息结算 页面发票
                invoiceRises: '个人'            // 存储vuex的信息结算 页面发票
            }
        },
        // 方法
        methods: {
            // 发票材质
            selectTexture (index) {
                this.invoiceData.materialType = index;
                if(index == 0){
                    console.log('纸质发票');
                } else if(index == 1){
                    console.log('电子发票');
                }
                console.log(this.invoiceData.materialType);
            },
            // 发票类型
            selectType (index) {
                this.invoiceData.invoiceType = index + 1;
                if(index == 0){
                    console.log('普通发票');
                } else if(index == 1){
                    console.log('增值税发票');
                }
                console.log(this.invoiceData.invoiceType);
            },
            // 发票抬头
            selectRise (item) {
                this.invoiceData.invoiceTitle = item;
                this.invoiceData.unitName = item;
                if(item == '个人'){
                    console.log('个人');
                }else if (item == '单位'){
                    console.log('单位')
                }
            },
            // 发票内容
            selectContent (item) {
                this.invoiceData.invoiceContent = item;
                console.log(item);
            },
            // 提交
            invoiceSubmit () {
                // 校验格式
                let vPhone = new RegExp(this.regPhone),
                    vEmail = new RegExp(this.regEmail);
                // 判断为空
                if(this.invoiceData.telephoneRegistration === ''){
                    this.invoiceReminder.msg = '手机号码不能为空!';
                    this.invoiceReminder.reminder = true
                    // 判断手机格式是否正确
                }else if(vPhone.test(this.invoiceData.telephoneRegistration)) {
                    this.invoiceReminder.reminder = false
                    // 通过校验 校验邮箱
                    if(this.invoiceData.registeredAddress === ''){
                        // 发送请求 邮箱为空
                        this.$router.back() // 返回上一页
                        localStorage.InvoiceInfo = JSON.stringify(this.invoiceData)   // 设置发票数据
                        console.log(this.invoiceData)

                        return;
                    }else if(this.invoiceData.registeredAddress !== ''){
                        if(!vEmail.test(this.invoiceData.registeredAddress)) {
                            this.invoiceReminder.reminder = true
                            this.invoiceReminder.msg = '请填写正确格式的邮箱地址!';
                            this.invoiceData.registeredAddress = '';
                        }else {
                            // 发送请求 邮箱非空
                            localStorage.InvoiceInfo = JSON.stringify(this.invoiceData)   // 设置发票数据
                            this.$router.back()         // 返回上一页
                            console.log(this.invoiceData)
                        }
                    }
                } else {
                    this.invoiceReminder.reminder = true
                    this.invoiceReminder.msg = '请填写正确格式的手机号码!';
                    this.invoiceData.telephoneRegistration = '';
                }

                // 让提示框消失
                if(this.invoiceReminder.reminder){
                    setTimeout(() => {
                        this.invoiceReminder.reminder = false;
                    }, 2600)
                }
            },
            // 设置vuex 发票信息
            setInvoice () {
                if (this.invoiceData.materialType === 0){
                    this.invoiceTypes = '纸质发票';
                }else if(this.invoiceData.materialType === 1){
                    this.invoiceTypes = '电子发票';
                }
                if(this.invoiceData.invoiceTitle == '个人'){
                    this.invoiceRises = '个人'
                }else if(this.invoiceData.invoiceTitle == '单位'){
                    this.invoiceRises = '单位';
                }

                this.setInvoiceInfoType(this.invoiceTypes);
                this.setInvoiceInfoRise(this.invoiceRises);
            }
        },
        // 计算属性
        computed: {},
        // 注册子组件
        components: {},
        // 实例化之前
        created() {},
        // 监听
        watch: {}
    }
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
    @import 'src/assets/scss/common';
    .invoice-container {
        @include size(100%, auto);
        margin: 0 auto -80px;
        @include box-sizing;

        .invoice-headline {
            @include size(100%, 78px);
            @include box-sizing;
            @include font(28px, 86px, normal, left, #333);
            padding: 0 30px;
        }

        .invoice-texture {
            @include size(100%, 180px);
            margin: 0 auto;
            background: #fff;
            @include box-sizing;
            padding: 0 30px;

            p {
                @include size(220px, 64px);
                border-radius: 40px;
                background: #fff;
                border: 2px solid #b7b7b7;
                @include font(24px, 64px, normal, center, #b7b7b7);
                float: left;
                margin: 30px 20px 0 0;
            }

            p.active {
                background: #8ec25a;
                border: 2px solid #8ec25a;
                @include font(24px, 64px, normal, center, #fff);
            }

            span {
                display: block;
                float: left;
                @include size(100%, 84px);
                @include font(24px, 84px, normal, left, #999);
            }
        }

        .invoice-type {
            @include size(100%, 124px);
            margin: 0 auto;
            background: #fff;
            @include box-sizing;
            padding: 0 30px;

            p {
                @include size(220px, 64px);
                border-radius: 40px;
                background: #fff;
                border: 2px solid #b7b7b7;
                @include font(24px, 64px, normal, center, #b7b7b7);
                float: left;
                margin: 30px 20px 0 0;
            }

            p.active {
                background: #8ec25a;
                border: 2px solid #8ec25a;
                @include font(24px, 64px, normal, center, #fff);
            }
        }

        .invoice-rise {
            @include size(100%, 100px);
            margin: 0 auto;
            background: #fff;
            @include box-sizing;
            padding: 0 30px;

            p {
                display: inline-block;
                @include size(50%, 100px);
                float: left;
                span {
                    display: inline-block;
                    height: 100px;
                    @include font(24px, 100px, normal, left, #666);
                }
                i.iconfont {
                    display: inline-block;
                    @include size(40px, 40px);
                    border: 2px solid #acacac;
                    border-radius: 50%;
                    margin: 30px 20px 0 0;
                    @include font(40px, 40px, normal, center, #fff);
                    float: left;
                    background: #fff;
                }
            }
            p.active {
                i.iconfont {
                    @include font(40px, 40px, normal, center, #fff);
                    background: #8ec25a;
                    border: 2px solid #8ec25a;
                }
            }
        }

        .collector-info {
            @include size(100%, 206px);
            background: #fff;
            @include box-sizing;
            padding: 0 30px;

            div.collector-info-list:nth-of-type(1) {
                @include size(100%, 104px);
                border-bottom: 1px solid #ddd;
            }
            div.collector-info-list:nth-of-type(2) {
                @include size(100%, 102px);
            }
            .collector-info-list {
                @include box-sizing;
            }
            label {
                display: inline-block;
                @include size(185px, 102px);
                float: left;
                @include font(24px, 102px, normal, left, #333);
                span {
                    color: #f0555a;
                }
            }
            input {
                padding: 0;
                margin: 0;
                display: block;
                @include size(504px, 102px);
                float: left;
                @include font(24px, 102px, normal, left, #333);
            }
        }

        .invoice-content {
            @include size(100%, 170px);
            @include box-sizing;
            padding: 0 30px;
            background: #fff;
            @include font(24px, 85px, normal, left, #666);
            p {
                @include size(50%, 85px);
                float: left;

                i.iconfont {
                    display: inline-block;
                    @include size(40px, 40px);
                    border-radius: 50%;
                    float: left;
                    margin: 22px 20px 0 0;
                    border: 2px solid #acacac;
                    @include font(40px, 40px, normal, center, #fff);
                    background: #fff;
                }
            }
            p.active {
                i.iconfont {
                    border: 2px solid #8ec25a;
                    @include font(40px, 40px, normal, center, #fff);
                    background: #8ec25a;
                }
            }
        }

        .invoice-confirm {
            @include size(690px, 80px);
            border-radius: 80px;
            margin: 40px auto 40px;
            background: #8ec25a;
            @include font(28px, 80px, normal, center, #fff);
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
            -webkit-box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
            -moz-box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
            box-shadow: 0px 0px 4px 4px rgba(255,225,255,.2);
            @include font(28px, 120px, normal, center, #fff);
            @include box-sizing;
            background: rgba(0, 0, 0, .6);
        }
        .invoice-reminder.active {
            top: 0;
        }
    }
</style>