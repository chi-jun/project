<template>
    <div class="refund-container clearfix">
        <!-- 申请退款 -->
        <section class="refund-head" v-for="item in  orderData.goodsList">
            <div class="refund-head-pic">
                <img :src="item.goodsImage" alt="退款商品">
            </div>
            <div class="refund-head-con">
                <h2 class="headline">{{item.goodsName}}</h2>
                <p class="info">{{item.desc}}</p>
                <div class="refund-head-price">
                    <p><span>￥</span>{{item.goodsPrice}}</p>
                    <p>x{{item.goodsNum}}</p>
                </div>
            </div>
        </section>
        <form action="" class="form-wrap clearfix">
            <!-- 货物状态 -->
            <section class="refund-state">
                <div class="refund-state-list">
                    <label for="cargo-state">货物状态</label>
                    <select name="" id="cargo-state" v-model.trim="resultData.returnReason">
                        <option selected="selected">请选择</option>
                        <option value="2">已签收</option>
                    </select>
                    <i class="iconfont icon-you"></i>
                </div>
                 <div class="refund-state-list">
                    <label for="cargo-state">退款原因</label>
                    <select name="" id="cargo-state" v-model.trim="resultData.questionDes">
                        <option selected="selected">请选择</option>
                        <option value="货不对版">货不对版</option>
                        <option value="质量问题">质量问题</option>
                        <option value="数量错误">数量错误</option>
                    </select>
                    <i class="iconfont icon-you"></i>
                </div>
                <!-- <div class="refund-state-list">
                    <label for="refund-reason">退款原因</label>
                    <input 
                    v-model.trim="resultData.questionDes"
                    type="text" 
                    id="refund-reason" 
                    class="refund-text" 
                    placeholder="请输入退款原因">
                </div> -->
            </section>

            <!-- 退款金额 -->
            <section class="refund-state">
                <div class="refund-state-list">
                    <label for="cargo-state">退款金额</label>
                    <p class="money">{{orderData.price}}</p>
                </div>
                <div class="refund-state-list">
                    <label for="refund-explain">退款说明</label>
                    <input type="text" id="refund-explain" class="refund-text" placeholder="选填"   v-model.trim="resultData.returnExplain">
                </div>
            </section>
            <!-- 退款凭证 -->
            <section class="refund-voucher">
                <p class="refund-voucher-title">上传凭证 <span>(最多上传3张)</span></p>
                <div class="voucher-box">
                    <div class="voucher-con clearfix">
                        <div class="refund-voucher-wrap" v-if="voucherData.length > 0" v-for="(item, index) in voucherData">
                            <i class="iconfont icon-chahao" @click="delVoucher(index)"></i>
                            <div class="refund-voucher-con">
                                <img :src="item">
                            </div>
                        </div>
                    </div>
                    <label for="voucher-file" class="refund-voucher-box">
                        <img src="../../assets/images/personal/voucher.png" alt="凭证">
                    </label>
                </div>
                <input type="file" id="voucher-file" accept="image/gif,image/jpeg,image/png,image/jpg" @change="voucher($event)">
            </section>
            <div class="submit-wrap">
                <p class="submit-btn" @click="addOrderReturn">提交</p>
            </div>
        </form>
    </div>
</template>

<script>
import {
  postData,
  getData,
  apiUrl,
  upLoad,
  baseUrl,
  toast
} from "@/constant/api";

export default {
  data() {
    return {
      goodIDArrea: [],
      fileData: [],
      resultData: {}, // 当前请求回来的数据
      orderData: {},
      orderId: 0, // 订单列表页传递过来的id
      voucherData: [], // 存储上传凭证图片数据
      imgpath: "" // 存储图片的单个路径
    };
  },
  methods: {
    // 选择
    check(state) {
      console.log("改变点击的选中:" + state);
    },
    // 输入上传的图片
    voucher(event) {
      let file = event.target.files;
      console.log(event.target.value);
      this.showImg("voucher-file");
    },
    // 上传图片
    showImg(inputId, imgId) {
      let docObj = document.getElementById(inputId); // 找到file 上传文件input
      if (docObj.files && docObj.files[0]) {
        this.imgpath = window.URL.createObjectURL(
          docObj.files[docObj.files.length - 1]
        );
        this.voucherData.push(this.imgpath);
        this.fileData.push(docObj.files[0]);
        docObj.value = "";
      }
      return true;
    },
    // 删除图片
    delVoucher(i) {
      console.log(i);
      this.voucherData.splice(i, 1);
      this.fileData.splice(i, 1);
    },
    // 订单详情信息
    findOrderById() {
      this.orderId = this.$route.params.refundId;
      this.goodIDArrea = JSON.parse(localStorage.getItem("refundgood"));
      let data = {
        goodsId: this.goodIDArrea
      };
      postData("/order/findOrderGoodsByIds", data).then(res => {
        if (res.status == 200) {
          this.orderData = res.result; // 存储订单信息
        }
      });
    },
    // 上传图片
    imageUpload(files, index) {
      let formdata = new FormData();
      formdata.append("file", files);
      console.log(files, formdata, "发过去的信息");
      upLoad("/base/imageUpload", formdata).then(res => {
        if (res.status == 200) {
          this.resultData["returnImg" + (index + 1)] = baseUrl + res.result;
          if (index == this.fileData.length - 1) {
            this.addOrderReturns();
          }
        }
      });
    },
    // 提交申请退款
    addOrderReturn() {
      if (!this.resultData.returnReason) {
        toast(this, "请选择货物状态");
        return;
      }
      if (!this.resultData.questionDes) {
        toast(this, "请选择退款原因");
        return;
      }
      this.resultData.goodsId = this.goodIDArrea;
      this.resultData.orderId = this.orderId;
      if (this.fileData.length > 0) {
        this.fileData.forEach((item, index) => {
          this.imageUpload(item, index);
        });
      } else {
        this.addOrderReturns();
      }
    },
    // 申请退款
    addOrderReturns() {
      postData("/order/addOrderReturn", this.resultData).then(res => {
        if (res.status == 200) {
          toast(this, "申请成功");
          this.voucherData = [];
          this.resultData = {};
          this.fileData = [];
          setTimeout(() => {
            this.$router.back(-2);
          }, 500);
        }
      });
    }
  },
  // 过滤器
  filters: {
    payFilter: function(value) {
      if (value == "wx_pay") {
        return "微信支付";
      } else if (value == "online") {
        return "余额支付";
      }
      console.log(value);
    }
  },
  created() {
    this.findOrderById();
  },
  // 动态监听
  watch: {
    $route(n) {
      // 判断是否undefined
      (this.orderData = {}), (this.voucherData = []);
      this.resultData = {};
      this.fileData = [];
      if (this.$route.params.refundId) {
        this.findOrderById();
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.refund-container {
  @include size(100%, 1120px);
  @include box-sizing;
  margin: 0 auto -100px;
}
.refund-head {
  @include size(100%, 240px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;
  margin: 0 auto 30px;

  .refund-head-pic {
    @include size(220px, 220px);
    float: left;
    margin: 10px 0 10px 0;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .refund-head-con {
    @include size(470px, 240px);
    float: left;
    @include box-sizing;
    padding: 18px 0 0 0;
    h2.headline {
      width: 100%;
      height: 70px;
      @include font(28px, 35px, normal, left, #333);
      @include txtover(2);
    }
    p.info {
      @include size(100%, 54px);
      @include font(24px, 54px, normal, left, #999);
      @include text-over;
      margin-bottom: 10px;
    }
  }
  .refund-head-price {
    @include size(100%, 74px);
    p:nth-of-type(1) {
      @include size(316px, 74px);
      @include font(26px, 74px, normal, left, #f0555a);
      float: left;
      span {
        font-size: 20px;
      }
    }
    p:nth-of-type(2) {
      float: right;
      @include size(154px, 74px);
      @include font(20px, 74px, normal, right, #999);
    }
  }
}
.form-wrap {
  display: block;
  @include size(100%, auto);
  margin: 0 auto;
}
// 货物状态
.refund-state {
  @include size(100%, 226px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;
  margin: 0 auto 30px;
  div.refund-state-list {
    @include size(100%, 113px);
    border-bottom: 1px solid #e3e3e3;
    @include box-sizing;
    position: $rela;
    label {
      display: block;
      @include size(160px, 112px);
      float: left;
      @include font(26px, 112px, normal, left, #333);
      // background: red;
    }

    textarea,
    input,
    select,
    option {
      @include box-sizing;
      margin: 0;
      padding: 0;
      border: 0;
      resize: none;
      outline: none;
    }

    select {
      direction: rtl;
    }
    select option {
      direction: ltr;
    }
    /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
    select::-ms-expand {
      display: none;
    }

    select#cargo-state {
      display: block;
      @include size(530px, 110px);
      @include font(26px, 110spx, normal, right, #aaa);
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      float: right;
      padding: 0 50px 0 0;
      background: #fff;
      // background: red;
    }
    i.iconfont {
      display: block;
      @include size(30px, 40px);
      @include font(32px, 40px, normal, right, #aaa);
      position: $abso;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto 0;
    }
    input.refund-text {
      display: block;
      @include size(530px, 40px);
      float: right;
      @include font(26px, 40px, normal, right, #999);
      margin: 36px 0 0 0;
    }
    .money {
      display: block;
      @include size(530px, 112px);
      @include font(26px, 112px, normal, right, #f0555a);
      float: right;
    }
  }
  div.refund-state-list:last-child {
    border: 0;
  }
}
// 退款凭证
.refund-voucher {
  @include size(100%, 272px);
  background: #fff;
  margin: 0 auto;
  @include box-sizing;
  padding: 0 30px;
  overflow: hidden;
  .refund-voucher-title {
    @include size(100%, 76px);
    @include box-sizing;
    padding: 8px 0 0 0;
    @include font(26px, 68px, normal, left, #333);

    span {
      color: #999;
      font-size: 20px;
    }
  }

  .voucher-box {
    @include size(540px,170px);
    overflow: hidden;
    position: $rela;
  }
  .voucher-con {
    height: 170px;
    float: left;
  }
  .refund-voucher-box {
    display: block;
    @include size(156px, 156px);
    border-radius: 16px;
    border: 2px dashed #ddd;
    // overflow: hidden;
    // background: red;
    position: $rela;
    float: left;
    margin: 10px 22px 0 0;
    transition: all 0.2s ease;
    img {
      display: block;
      width: 100%;
    }
  }
  input[type="file"] {
    position: $abso;
    top: -100%;
    left: -100%;
  }
  .refund-voucher-wrap {
    @include size(178px, 170px);
    float: left;
    position: $rela;
    i {
      display: block;
      @include size(40px, 40px);
      @include font(20px, 40px, normal, center, #fff);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      position: $abso;
      top: 0px;
      right: 10px;
      z-index: 1;
    }
    .refund-voucher-con {
      @include size(156px, 156px);
      margin: 10px 22px 0 0;
      position: $rela;
      border-radius: 16px;
      transition: all 0.2s ease;
      overflow: hidden;

      img {
        display: block;
        width: 100%;
        position: $abso;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
      }
    }
  }
}
.submit-wrap {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px;
  margin: 50px auto 30px;

  .submit-btn {
    @include size(100%, 80px);
    @include font(28px, 80px, normal, center, #fff);
    border-radius: 60px;
    background: #8ec25a;
  }
}
</style>