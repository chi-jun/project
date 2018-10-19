<template>
    <div class="notescontact-container clearfix">
        <div class="code-img">
            <img :src="codeImg" alt="联系客服二维码">
        </div>
        <div class="notescontact-hint">
            <p>扫一扫，关注粮油微信公众号</p>
            <p>联系微信客服</p>
        </div>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
export default {
  // 数据
  data() {
    return {
      codeImg: ''
    };
  },
  // 方法
  methods: {
    findContactQrcode() {
      postData("/main/findContactQrcode").then(res => {
        if (res.status == 200) {
          this.codeImg=res.result.wxqrcode;
        }
      });
    }
  },
  // 实例化之前
  created() {
    this.findContactQrcode();
  },
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.notescontact-container {
  @include size(100%, 1119px);
  @include box-sizing;
  margin: 0 auto -100px;
  background: #6ace7f url("../../assets/images/personal/notescontact.png")
    no-repeat center / 750px 1120px;
  overflow: hidden;

  .code-img {
    @include size(300px, 300px);
    margin: 490px auto 36px;
    background: #fff;
    border-radius: 10px;
    @include box-sizing;
    padding: 8px;
    img {
      width: 100%;
    }
  }
  .notescontact-hint {
    @include size(100%, 116px);
    p {
      @include size(100%, 58px);
      @include font(28px, 58px, normal, center, #fff);
    }
  }
}
</style>