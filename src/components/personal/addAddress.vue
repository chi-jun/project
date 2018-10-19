<template>
    <div class="editAddress-container clearfix">
        <form    @submit.prevent="submit()"
               action="" class="editAddress-wrap">
            <section class="editAddress-box">
                <div class="editAddress-list b-bottom">
                    <label for="consignee">收货人</label>
                    <input 
                     name="consignee"
                     id="consignee"
                     type="text" 
                     v-model.trim="dataVessel.trueName"
                     >
                     <span @click="trigger('consignee')" class="help is-danger">{{ validation.firstError('dataVessel.trueName') }}</span>
                </div>
                <div class="editAddress-list b-bottom">
                    <label for="mobPhone">联系电话</label>
                    <input  type="number" pattern="\d*"  id="mobPhone" v-model.trim="dataVessel.mobPhone" name="mobPhone">
                    <span @click="trigger('mobPhone')"  class="help is-danger">{{ validation.firstError('dataVessel.mobPhone') }}</span>
                </div>
                <div class="editAddress-list b-bottom">
                    <label for="zipCode">邮编</label>
                    <input 
                     type="number"
                     pattern="\d*"  
                     id="zipCode" 
                    v-model.trim="dataVessel.zipCode"
                    name="zipCode"  
  
                    >
                    <span @click="trigger('zipCode')"   class="help is-danger">{{ validation.firstError('dataVessel.zipCode') }}</span>
                </div>
               <div class="editAddress-list b-bottom">
                    <label for="emails">邮箱</label>
                      <input 
                       id="emails"  
                       type="text" 
                       v-model.trim="dataVessel.email" 
                        name="email"
                        >
                     <span @click="trigger('emails')"  class="help is-danger" >{{ validation.firstError('dataVessel.email') }}</span>
                </div>
                <div class="editAddress-list b-bottom">
                    <label for="provinceId">省</label>
                    <select v-model.trim="provinceInfo"  @change="alterProvince(provinceInfo)"  id="provinceId" data-vv-name="省" 

                     >
                       <option value="" disabled>请选择省</option>
                        <option v-for="(item,index ) in province" :value="item">{{item.province}}</option>
                    </select>
                      <span @click="trigger('provinceId',1)"  class="help is-danger">{{ validation.firstError('provinceInfo') }}</span>
                </div>
                <div class="editAddress-list b-bottom">
                    <label for="cityId">市</label>
                    <select v-model.trim="cityInfo" @change="alterCity(cityInfo)" id="cityId" data-vv-name="市" 

                      >
                       <option value="" disabled>请选择市</option>
                        <option value="" v-for="(item, index) in citys" :value="item">{{ item.city }}</option>
                    </select>
                    <span  @click="trigger('cityId',1)"  class="help is-danger">{{ validation.firstError('cityInfo') }}</span>
                </div>
                <div class="editAddress-list b-bottom">
                    <label for="areaId">区</label>
                    <select v-model.trim="areaInfos" id="areaId" 

                      @change="alterArea(areaInfos)">
                       <option value="" disabled>请选择区</option>
                        <option value="" v-for="(item, index) in area" :value="item">{{ item.area}}</option>
                    </select>
                    <span class="help is-danger">{{ validation.firstError('areaInfos') }}</span>
                </div>
                <div class="editAddress-list default">
                    <label class="adress" for="address">所在地区</label>
                    <textarea id="address"  v-model.trim="dataVessel.address"   name="address"
   
                     ></textarea>
                     <span @click="trigger('address')"  class="help is-danger">{{ validation.firstError('dataVessel.address') }}</span>
                </div>
            </section>
            <div class="set-default" :class="{'active': dataVessel.isDefault == 1}" @click="setDefault">
                <p>
                    <i class="iconfont icon-gou"></i>
                    <span>是否设为默认地址</span>
                </p>
            </div>

            <div class="save-wrap">
                <input  class="sub" type="submit" value="保存" >
            </div>
        </form>
    </div>
</template>

<script>
import { postData, getData, apiUrl, toast } from "@/constant/api";
let SimpleVueValidation = require("simple-vue-validator");
let Validator = SimpleVueValidation.Validator;
export default {
  // 数据
  data() {
    return {
      resultData: [], // 存储初始化页面请求回来的所有数据
      dataVessel: {
        isDefault: 0,
        trueName: "",
        mobPhone: "",
        zipCode: "",
        email: "",
        address: ""
      },
      province: {}, // 所有的省
      citys: {}, // 所有的市
      area: {}, // 所有的区
      provinceInfo: "",
      cityInfo: "",
      areaInfos: ""
    };
  },
  // 添加验证规则
  validators: {
    "dataVessel.trueName": function(value) {
      return Validator.value(value).required();
    },
    "dataVessel.mobPhone": function(value) {
      return Validator.value(value)
        .required().regex('^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$', '格式不正确');
        
    },
    "dataVessel.zipCode": function(value) {
      return Validator.value(value)
        .required()
        .integer()
        .length(6);
    },
    "dataVessel.email": function(value) {
      return Validator.value(value)
        .required()
        .email();
    },
    provinceInfo: function(value) {
      return Validator.value(value).required();
    },
    cityInfo: function(value) {
      return Validator.value(value).required();
    },
    areaInfos: function(value) {
      return Validator.value(value).required();
    },
    "dataVessel.address": function(value) {
      return Validator.value(value).required();
    }
  },
  // 方法
  methods: {
    trigger(id, select) {
      select = select || false;
      if (!select) {
        document.getElementById(id).focus();
      } else {
        document.getElementById(id).click();
      }
    },
    // 组织冒泡
    myfn(e) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
    },
    // 根据 上一个页面传递过来的id 请求数据
    loadData() {
      getData("src/data/province.json").then(response => {
        this.province = response.result; // 赋值给省集合
      });
    },
    // 设置是否默认
    setDefault() {
      this.dataVessel.isDefault = this.dataVessel.isDefault == 0 ? 1 : 0;
    },
    // 校验提交
    submit() {
      this.$validate().then(success => {
        if (success) {
          this.addMyAddress();
        }
      });
    },
    // 当省被触发的时候
    alterProvince(item) {
      this.dataVessel.provinceId = item.id;
      this.provinceName = item.province;
      this.getCitiesByProvince(this.dataVessel.provinceId);
      this.cityInfo = "";
      this.areaInfos = "";
      this.area = {};
    },
    // 当市被触发的时候
    alterCity(item) {
      this.dataVessel.cityId = item.id;
      this.cityName = item.city;
      this.getAreasByCity(this.dataVessel.cityId);
      this.areaInfos = "";
    },
    // 当区被触发的时候
    alterArea(item) {
      this.dataVessel.areaId = item.id;
      this.areaName = item.area;
    },
    /*获取省*/
    getAllProvinces() {
      getData("/area/getAllProvinces").then(res => {
        this.province = res.result;
        console.log(this.provinces, "省份");
      });
    },
    /*获取市*/
    getCitiesByProvince(provinceId) {
      console.log(provinceId, "省份id");
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
        this.area = res.result;
        console.log(res);
      });
    },
    // 增加地址
    addMyAddress() {
      this.dataVessel.areaInfo = this.provinceName + this.cityName + this.areaName;
      postData("/member/addMyAddress", this.dataVessel).then(res => {
        if (res.status == 200) {
          this.provinceInfo = "";
          this.cityInfo = "";
          this.areaInfos = "";
          this.dataVessel = {
            isDefault: 0,
            trueName: "",
            mobPhone: "",
            zipCode: "",
            email: "",
            address: ""
          };
           this.validation.reset();
          toast(this, "添加地址成功");
          setTimeout(() => {
            this.$router.back(-1);
          }, 500);
        } else {
          console.log(res.message);
        }
      });
    }
  },
  // 注册子组件
  components: {},
  // 实例化之前
  created() {
    this.getAllProvinces();
  },
  // 监听
  watch: {
    $route(n) {
       this.validation.reset();
      this.paramsId = this.$route.params.id;
    },
    deep: true
  }
};
</script>

<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.editAddress-container {
  @include size(100%, auto);
  @include box-sizing;
  margin: 0 auto;
}

.editAddress-wrap {
  display: block;
  @include size(100%, auto);
  margin: 0 auto;

  textarea,
  input,
  select,
  option {
    margin: 0;
    padding: 0;
    @include box-sizing;
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
}
.editAddress-box {
  @include size(100%, auto);
  margin: 0 auto;
  background: #fff;
  @include box-sizing;
  padding: 0 30px;
  margin-bottom: 30px;

  .editAddress-list {
    position: relative;
    @include size(100%, 106px);
    @include box-sizing;
    label {
      display: block;
      @include size(120px, 106px);
      float: left;
      @include font(26px, 106px, normal, left, #333);
      // background: red;
    }
    input {
      display: block;
      @include size(570px, 104px);
      float: right;
      @include font(26px, 106px, normal, right, #aaa);
    }
    select {
      display: block;
      @include size(570px, 104px);
      float: right;
      @include font(26px, 106px, normal, right, #aaa);
      appearance: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      background: white;
    }
    /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
    select::-ms-expand {
      display: none;
    }
    position: relative;
    .help {
      color: red;
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 130px;
      display: flex;
      align-items: center;
    }
    .adress {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .editAddress-list.default {
    @include size(100%, 178px);
    textarea {
      float: right;
      @include size(540px, 178px);
      @include font(26px, 40px, normal, right, #aaa);
      padding: 20px 0;
      border-style: none;
      text-align: left;
    }
  }
  .editAddress-list.b-bottom {
    border-bottom: 1px solid #e3e3e3;
  }
}
.set-default {
  @include size(100%, 100px);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;
  i.iconfont {
    display: block;
    @include size(40px, 40px);
    border-radius: 50%;
    float: left;
    margin: 30px 30px 0 0;
    @include font(40px, 40px, normal, center, #fff);
    border: 2px solid #acacac;
    background: #fff;
  }
  span {
    display: block;
    height: 100px;
    @include font(26px, 100px, normal, left, #666);
  }
}
.set-default.active {
  i.iconfont {
    border: 2px solid #8ec25a;
    background: #8ec25a;
  }
}
.save-wrap {
  @include size(100%, 80px);
  @include box-sizing;
  padding: 0 30px;
  margin: 80px 0 0 0;
  .sub {
    border: none;
    @include size(100%, 80px);
    border-radius: 80px;
    background: #8ec25a;
    @include font(26px, 80px, normal, center, #fff);
  }
}
// 提示框
.verify-hint {
  @include size(470px, 120px);
  background: #fff;
  position: $fixed;
  top: -200%;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 100;
  transition: all 0.2s ease;
  border-radius: 12px;
  -webkit-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  -moz-box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  box-shadow: 0px 0px 4px 4px rgba(255, 225, 255, 0.2);
  @include font(28px, 120px, normal, center, #fff);
  @include box-sizing;
  background: rgba(0, 0, 0, 0.6);
}
.verify-hint.active {
  top: 0;
}
</style>