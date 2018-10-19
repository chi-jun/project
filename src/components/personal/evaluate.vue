<template>
    <div class="evaluate-container clearfix">
        <form action="" class="form-wrap clearfix">
            <!-- 评价 -->
            <section class="evaluate-wrap" v-for="(item0,index0) in orderGoods">
              <div class=imgBox>
                <img :src="item0.goodsImage" alt="">
              </div>
                <textarea 
                 class="evaluate-txt" 
                 placeholder="说说该商品的优缺点" 
                 v-model.trim="item0.content"
                 >
                 </textarea>
                <article class="evaluate-picture-wrap">
                    <div class="evaluate-con clearfix">
                        <div class="evaluate-box clearfix" v-if="item0.voucherData.length > 0" v-for="(item, index1) in item0.voucherData" >
                            <i class="iconfont icon-chahao" @click="delVoucher(index1,item0)"></i>
                            <div class="refund-voucher-con">
                                <img :src="item">
                            </div>
                        </div>
                    </div>
                    <label :for="'evaluate'+index0" class="evaluate-label">
                        <img src="../../assets/images/personal/voucher.png" alt="凭证">
                    </label>
                    <input type="file" :id="'evaluate'+index0" accept="image/gif,image/jpeg,image/png,image/jpg" @change="voucher($event,item0)">
                </article>
                 <!-- 星级评价 -->
            <section class="star-evaluate">
                <div class="star-list">
                    <span class="info">商品</span>
                    <ul class="star-wrap">
                        <li v-for="(item, index2) in star" @click="starResult(item, 1,item0)" :class="{active: index2 + 1 <= item0.star}"></li>
                    </ul>
                    <p class="evaluate-content" v-text="item0.goodsEvaluateTxts"></p>
                </div>
            </section>
            </section>
                   <!-- 服务评价 -->
            <section class="star-evaluate">
                <div class="star-list">
                    <span class="info fu2">服务</span>
                    <ul class="star-wrap">
                        <li v-for="(item, index3) in star" @click="starResult(item, 2)" :class="{active: index3 + 1 <= serveEvaluate}" ></li>
                    </ul>
                    <p class="evaluate-content" v-html="serveEvaluateTxts"></p>
                </div>
            </section>

            <div class="submit-wrap">
                <p 
                 class="submit-btn" 
                 :disabled="isClick"
                 @click="addProductEvaluate"
                 >发布评价</p>
            </div>
        </form>
    </div>
</template>

<script>
import { postData, getData, upLoad, toast, baseUrl } from "@/constant/api";
export default {
  data() {
    return {
      isClick: false,
      orderGoods: "",
      resultData: {}, // 当前请求回来的数据
      star: [1, 2, 3, 4, 5], // 存放展示的星星
      serveEvaluate: 0, // 服务评价
      serveEvaluateTxts: "",
      fileSObj: [],
      goodsEvaluateTxt: {
        // 商品评价内容
        1: "非常差",
        2: "差",
        3: "一般",
        4: "好",
        5: "非常好"
      }
    };
  },
  methods: {
    // 输入上传的图片
    voucher(e, item0) {
      this.showImg(e, item0);
    },
    // 上传图片
    showImg(event, item0) {
      let docObj = event.target; // 找到file 上传文件input
      if (docObj.files && docObj.files[0]) {
        //火狐下，直接设img属性
        // imgObjPreview.src = docObj.files[0].getAsDataURL();
        this.imgpath = window.URL.createObjectURL(
          docObj.files[docObj.files.length - 1]
        );
        item0.voucherData.push(this.imgpath);
        this.imageUpload(docObj.files[0], item0);
        docObj.value = "";
        console.log(item0.fileData, "当前的图片数组");
      }
      return true;
    },
    // 删除图片
    delVoucher(indexs, item0) {
      item0.voucherData.splice(indexs, 1);
      item0.fileData.splice(indexs, 1);
    },
    // 星级评价
    starResult(item, num, item0) {
      if (num == 1) {
        item0.star = item;
        item0.goodsEvaluateTxts = this.goodsEvaluateTxt[item];
      } else if (num == 2) {
        this.serveEvaluate = item;
        this.serveEvaluateTxts = this.goodsEvaluateTxt[item];
      }
    },
    // 订单详情信息
    findOrderById() {
      this.orderId = this.$route.params.evaluateId;
      this.orderIdObj = {
        orderId: this.orderId
      };
      postData("/order/findOrderById", this.orderIdObj).then(res => {
        if (res.status == 200) {
          this.resultData.orderId = this.orderId; //存储订单id
          res.result.order.orderGoods.forEach((item, index) => {
            item.goodsEvaluateTxts = "";
            item.voucherData = [];
            item.fileData = [];
            item.content = "";
            item.star = "";
          });
          this.orderGoods = res.result.order.orderGoods;
        }
      });
    },
    // 上传图片
    imageUpload(files, item0) {
      let formdata = new FormData();
      formdata.append("file", files);
      upLoad("/base/imageUpload", formdata).then(res => {
        if (res.status == 200) {
          item0.fileData.push(baseUrl + res.result);
        }
      });
    },
    addProductEvaluateS() {
      postData("order/addProductEvaluates", this.resultData).then(res => {
        if (res.status == 200) {
          toast(this, "评价成功");
           this.isClick = false;
          // setTimeout(() => {
          //   this.$router.push({ path: `/order` });
          // }, 500);
          setTimeout(() => {
            this.$router.back();
          }, 500);
        }
      });
    },
    // 提交评价
    addProductEvaluate() {
      this.isClick = true;
      this.orderGoods.forEach(item => {
        if (!item.star) {
          toast(this, "请对订单内所有商品进行商品评分");
          this.isClick = false;
          return;
        }
      });
      if (!this.serveEvaluate) {
        toast(this, "请对订单进行服务评分");
        this.isClick = false;
        return;
      } else {
        this.orderGoods.forEach((item, index) => {
          if (item.content) {
            this.resultData[`productEvaluateList[${index}].content`] =
              item.content;
          }
          this.resultData[`productEvaluateList[${index}].star`] = item.star;
          this.resultData[
            `productEvaluateList[${index}].sellerStar`
          ] = this.serveEvaluate;
          if (item.sukId) {
            this.resultData[`productEvaluateList[${index}].sukId`] = item.sukId;
          }
          if (item.goodsId) {
            this.resultData[`productEvaluateList[${index}].pid`] = item.goodsId;
          }

          if (item.fileData.length) {
            item.fileData.forEach((item2, index2) => {
              // this.imageUpload(item2, index2, index);
              this.resultData[
                `productEvaluateList[${index}].imgList[${index2}].img`
              ] = item2;
              console.log(item2, "当前的图片数据111");
            });

            if (index == this.orderGoods.length - 1) {
              console.log(item.fileData.length, "当前的图片数据");
              this.addProductEvaluateS();
            }
          } else if (
            !item.fileData.length &&
            index == this.orderGoods.length - 1
          ) {
            this.addProductEvaluateS();
          }
        });
        // this.addProductEvaluateS();
        //         this.fileSObj.forEach((item, index) => {
        //   this.imageUpload(item, index);
        // });
      }
    }
  },
  // 计算属性
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
      if (this.$route.params.evaluateId) {
        this.resultData = {};
        this.fileSObj = [];
        this.voucherData = [];
        this.findOrderById();
        this.serveEvaluate=0;
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.fu2{
       margin-left: 30px;
}
.evaluate-container {
  @include size(100%, 1120px);
  @include box-sizing;
  margin: 0 auto -100px;
}
.evaluate-wrap {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px;
  margin: 0 auto 30px;
  background: #fff;
  overflow: hidden;
  .imgBox {
    width: 150px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .evaluate-txt {
    @include box-sizing;
    margin: 0 auto 30px;
    padding: 24px 0 0 0;
    border: 0;
    resize: none;
    outline: none;
    @include size(100%, 300px);
    @include font(28px, 60px, normal, left, #999);
  }
}
.evaluate-picture-wrap {
  @include size(710px, 174px);
  @include box-sizing;
  margin: 0 auto;
  overflow: hidden;
  position: $rela;
  // background: red;

  .evaluate-con {
    height: 170px;
    float: left;
  }

  .evaluate-box {
    @include size(140px, 146px);
    position: $rela;
    float: left;
    // background: pink;

    i {
      display: block;
      @include size(40px, 40px);
      @include font(20px, 40px, normal, center, #fff);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      position: $abso;
      top: 0px;
      right: 5px;
      z-index: 1;
    }
  }
  .refund-voucher-con,
  label.evaluate-label {
    display: block;
    @include size(126px, 126px);
    margin: 18px 14px 0 0;
    border-radius: 16px;
    border: 2px dashed #ddd;
    overflow: hidden;
    position: $rela;
    float: left;
    transition: all 0.2s ease;
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
  .refund-voucher-con {
    border: 0;
    // background: yellow;
  }

  input[type="file"] {
    position: $abso;
    top: -100%;
    left: -100%;
  }
}

// 星级
.star-evaluate {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px 0;
  margin: 0 auto;
  background: #fff;
  .star-list {
    @include size(100%, 60px);
    .info {
      display: block;
      @include size(92px, 60px);
      float: left;
      @include font(28px, 60px, normal, left, #666);
    }
  }
  .star-wrap {
    @include size(300px, 60px);
    float: left;
    margin: 0 40px 0 0;
    li {
      @include size(60px, 60px);
      background: url("../../assets/images/goods-details/star2.png") no-repeat
        center / 60px;
      float: left;
      transition: all 0.2s ease;
    }
    li.active {
      background: url("../../assets/images/goods-details/star1.png") no-repeat
        center / 60px;
    }
  }
  .evaluate-content {
    @include size(180px, 60px);
    float: left;
    @include font(24px, 60px, normal, left, #999);
    transition: all 0.2s ease;
  }
}
// 提交按钮
.submit-wrap {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px;
  margin: 80px auto 30px;

  .submit-btn {
    @include size(100%, 80px);
    @include font(28px, 80px, normal, center, #fff);
    border-radius: 60px;
    background: #8ec25a;
  }
}
</style>