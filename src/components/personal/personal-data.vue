<template>

  <div class="personal-data-container clearfix">
    <form action="" name="" id="personal-data-from">
      <div class="head-portrait-wrap border-b">
        <span class="left">头像</span>
        <div class="head-box">
          <div>
            <img :src="datas.memberAvatar" alt="头像" id="head-img">
          </div>
        </div>
      </div>
      <div class="personal-data-list border-b">
        <label for="user-name">用户名</label>
        <p id="user-name" class="user-name" v-text="memberName"></p>
      </div>
      <div class="personal-data-list border-b">
        <label for="">用户等级</label>
        <p class="user-level">{{datas.grade == 0 ? "普通会员" : "vip会员"}}</p>
      </div>
      <div class="personal-data-list border-b">
        <label for="">性别</label>
        <select name="" id="" class="select-gender" v-model="datas.memberSex">
          <option :value="item.value" v-for="item in options" :selected="datas.memberSex==item.value">{{item.sexs}}
          </option>
        </select>
        <i class="iconfont icon-you select-gender-icon"></i>
      </div>
      <div class="personal-data-list border-b">
        <label for="province">省</label>
        <select name="" id="province" class="select-region"
                v-model="datas.memberProvinceid"
                @change="getCitiesByProvince(datas.memberProvinceid)">
          <option value="" disabled>请选择省</option>
          <option :value="item.id" v-for="item in provinces"
                  :selected="datas.memberProvinceid===item.id">{{item.province}}
          </option>
        </select>
        <i class="iconfont icon-you select-gender-icon"></i>
      </div>
      <div class="personal-data-list border-b">
        <label for="city">市</label>
        <select name="" id="city" class="select-region"
                v-model="datas.memberCityid"
                @change="getAreasByCity(datas.memberCityid)">
          <option value="" disabled>请选择市</option>
          <option :value="item.id" v-for="item in citys">{{item.city}}</option>
        </select>
        <i class="iconfont icon-you select-gender-icon"></i>
      </div>
      <div class="personal-data-list border-b">
        <label for="district">区</label>
        <select name="" id="district" class="select-region" v-model="datas.memberAreaid">
          <option value="" disabled>请选择区</option>
          <option :value="item.id" v-for="item in areas">{{item.area}}</option>
        </select>
        <i class="iconfont icon-you select-gender-icon"></i>
      </div>
      <div class="personal-data-list border-b">
        <label for="detailed-site">详细地址</label>
        <input type="text" id="detailed-site" class="detailed-site" v-model.trim="datas.address" maxlength="85">
      </div>
      <div class="personal-data-list">
        <label for="phone">绑定手机号</label>
        <input
          type="tel"
          onKeyUp="value=value.replace(/[^\d]/g,'')"
          @blur="checkPhone(datas.memberMobile)"
          maxlength="11"
          pattern="[0-9]*"
          id="phone"
          class="detailed-site"
          v-model.trim="datas.memberMobile">
      </div>
      <input type="button" value="保存" class="submit-btn" @click="updateMemberInfo">

    </form>
  </div>
</template>

<script>
import { postData, getData, ERR_OK, toast, apiUrl } from "@/constant/api";
import { mapMutations, mapGetters } from "vuex";

export default {
  // 数据
  data() {
    return {
      datas: {},
      /*省的数组*/
      provinces: [],
      citys: [],
      areas: [],
      options: [
        {
          sexs: "女",
          value: 0
        },
        {
          sexs: "男",
          value: 1
        }
      ],
      memberName: ""
    };
  },
  // 方法
  methods: {
    /*获取省*/
    getAllProvinces() {
      getData("/area/getAllProvinces").then(res => {
        this.provinces = res.result;
        console.log(this.provinces, "省份");
      });
    },
    /*获取市*/
    getCitiesByProvince(provinceId, clear) {
      clear = clear ? false : true;
      if (clear) {
        this.datas.memberAreaid = "";
        this.datas.memberCityid = "";
      }
      this.areas = [];
      getData("/area/getCitiesByProvince", {
        provinceId: provinceId
      }).then(res => {
        this.citys = res.result;
        console.log(this.citys, "市123");
      });
    },
    /*获取区*/
    getAreasByCity(cityId) {
      getData("/area/getAreasByCity", {
        cityId: cityId
      }).then(res => {
        this.areas = res.result;
        console.log(res);
      });
    },
    updateMemberInfo() {
      if (this.datas.memberProvinceid) {
        if (!this.datas.memberCityid) {
          toast(this, "请选择市");
          return;
        }
        if (!this.datas.memberAreaid) {
          toast(this, "请选择区");
          return;
        }
        this.provinceName = this.provinces.find(
          item => this.datas.memberProvinceid == item.id
        )["province"];
        this.cityName = this.citys.find(
          item => this.datas.memberCityid == item.id
        )["city"];
        this.areaName = this.areas.find(
          item => this.datas.memberAreaid == item.id
        )["area"];
        this.datas.memberAreainfo =
          this.provinceName + this.cityName + this.areaName;
      }
      postData("/member/updateMemberInfo", this.datas).then(res => {
        if (res.status == 200) {
          toast(this, "保存成功");
        }
      });
    },
    findMemberInfo() {
      postData("/member/findMemberInfo").then(res => {
        if (res.status == 200) {
          this.datas = res.result;
          this.memberName = res.result.memberName;
          delete this.datas.memberName;
          delete this.datas.memberTruename;
          this.oldMemberMobile = this.datas.memberMobile;
          this.getAllProvinces();
          this.getCitiesByProvince(this.datas.memberProvinceid, "NoClear");
          this.getAreasByCity(this.datas.memberCityid, "NoClear");
        } else if (res.status == 400) {
          toast(this, res.message);
        }
      });
    },
    checkPhone(value) {
      if (!value || value == this.oldMemberMobile) {
        return false;
      }
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(value)) {
        toast(this, "手机号格式不正确");
        this.datas.memberMobile = "";
        return false;
      }
      this.checkMobile(value);
    },
    // 验证手机号是否重复
    checkMobile(telVal) {
      let data = {
        mobile: telVal
      };
      postData("/member/checkMobile", data).then(res => {
        if (res.status == ERR_OK) {
          console.log(res, "手机号是否重复返回结果");
          if (!res.result) {
            toast(this, "手机号已被绑定");
            this.datas.memberMobile = "";
            return false;
          }
        }
      });
    }
  },
  // 计算属性
  computed: {},
  // 注册子组件
  components: {},
  // 实例化之前
  created() {
    this.findMemberInfo();
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.personal-data-container {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px 0;
  margin: 0 auto;
  background: #fff;
}

.personal-data-from {
  @include size(100%, auto);
  @include box-sizing;
}

.border-b {
  border-bottom: 1px solid #e3e3e3;
}

.head-portrait-wrap {
  @include size(100%, 110px);
  line-height: 110px;
  @include box-sizing;
  position: $rela;
  span {
    float: left;
    display: inline-block;
    @include font(26px, 110px, normal, left, #333);
  }
  .head-portrait-box {
    @include size(80px, 80px);
    border-radius: 50%;
    overflow: hidden;
    float: right;
    margin-top: 30px;

    img {
      display: block;
      width: 100%;
    }
  }
  #head-portrait {
    position: $abso;
    top: -200%;
  }
  .head-box {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    div {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.personal-data-list {
  @include size(100%, 110px);
  margin: 0 auto;
  position: $rela;

  input,
  select {
    outline: none;
  }

  select {
    direction: rtl;
  }
  select option {
    direction: ltr;
  }

  label {
    display: inline-block;
    @include size(182px, 110px);
    @include font(26px, 110px, normal, left, #333);
    float: left;
  }
  // 用户名
  .user-name {
    display: block;
    @include size(500px, 108px);
    @include font(26px, 110px, normal, right, #333);
    float: right;
  }
  // 会员等级
  .user-level {
    display: inline-block;
    height: 48px;
    padding: 0 40px;
    @include box-sizing;
    border-radius: 40px;
    border: 2px solid #eec934;
    @include font(20px, 46px, normal, center, #eec934);
    margin: 32px 0 0 0;
    float: right;
  }

  // 性别选择
  .select-gender {
    @include size(80px, 108px);
    border: 0;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: #fff;
    padding-right: 20px; // 留出一点位置，避免被文字覆盖
    @include box-sizing;
    @include font(26px, 110px, normal, right, #333);
    float: right;
    text-align: right;
  }
  /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
  select::-ms-expand {
    display: none;
  }
  .select-gender-icon {
    position: $abso;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto 0;
    @include size(20px, 40px);
    @include font(34px, 40px, normal, center, #333);
  }
  // 省市区
  .select-region {
    @include size(340px, 108px);
    border: 0;
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: #fff;
    padding-right: 24px; // 留出一点位置，避免被文字覆盖
    @include box-sizing;
    @include font(26px, 110px, normal, right, #333);
    float: right;
  }

  // 详细地址
  .detailed-site {
    display: block;
    @include size(500px, 108px);
    @include font(26px, 110px, normal, right, #333);
    float: right;
  }
}

// 提交按钮
.submit-btn {
  @include size(110px, 88px);
  position: $fixed;
  top: 0;
  right: 0;
  z-index: 51;
  @include font(26px, 88px, normal, center, #fff);
  background: transparent;
}
</style>
