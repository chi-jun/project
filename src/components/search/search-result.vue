<template>
    <div class="search-result-container">
        <h2 class="search-history-info">以下是关于"{{ searchVal }}"的搜索结果</h2>
        <product :result="resultData" v-if="resultData.length>0"></product>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";
import product from "@/base/product-list/product";
export default {
  name: "carrousel",
  components: {
    product
  },
  data() {
    return {
      resultData: {}, // 存储传递到子组件的容器
      searchVal:''
    };
  },
  methods: {
    /*获取筛选后的商品*/
    findProductInfoByCondition() {
        this.searchVal=this.$route.params.searchVal;
      let data0 = {
        pageNo: 1,
       pageSize: 9999,
        title: this.searchVal
      };
      postData("chooseBuy/findProductInfoByCondition", data0).then(res => {
        if (res.status == 200) {
          this.resultData = res.result.resultList;
        }
      });
    }
  },
  created() {
    this.findProductInfoByCondition();
  },
  watch: {
     $route(n, o) {
      if(n.path.indexOf('searchResult')==-1){
          return false;
      }
     console.log(n.params.searchVal,'111')
      this.findProductInfoByCondition();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";
.search-result-container {
  width: 100%;
  /*height: auto;*/
  height: 1120px;
  overflow-y: auto;
  margin: 0 auto;
}
.search-container {
  width: 100%;
  height: 180px;
  margin: 0 auto;
  background: #eee;
  position: relative;
}
.search-history-info {
  @include size(100%, auto);
  min-height: 100px;
  margin: 0 auto;
  background: #eee;
  @include font(30px, 48px, normal, left, #000);
  text-indent: 30px;
  padding: 40px 0 24px 0;
  @include box-sizing;
}
</style>
