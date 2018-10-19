<template>
    <div class="search-container">
        <h2 class="search-history-info">搜索历史记录</h2>
        <ul class="search-history-wrap clearfix">
            <router-link
                v-for="item in lanternData"
                :to="'/searchResult/'+item"
                tag="li"
                class="search-history-list"
                :key="item.id"
            >
                {{ item }}
            </router-link>
        </ul>
    </div>
</template>

<script>
import { postData, getData, apiUrl } from "@/constant/api";

export default {
  name: "carrousel",
  components: {},
  data() {
    return {
      lanternData: []
    };
  },
  methods: {
    findSearchHistory() {
      postData("chooseBuy/findSearchHistory").then(res => {
        this.lanternData = res.result;
      });
    }
  },
  created() {
    this.findSearchHistory();
  },
  watch: {
    $route(n) {
      if (n.path == "/searchHistory") {
        this.findSearchHistory();
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/stylus" scoped>
@import "src/assets/scss/common";

.search-container {
  width: 100%;
  height: 180px;
  margin: 0 auto;
  background: #eee;
  position: relative;
}

.search-history-info {
  @include size(100%, 100px);
  margin: 0 auto;
  background: #eee;
  @include font(30px, 120px, normal, left, #000);
  text-indent: 30px;
}

.search-history-wrap {
  @include size(100%, auto);
  @include box-sizing;
  padding: 0 30px;
  background: #fff;

  li:last-child {
    border: 0;
  }
}

.search-history-list {
  @include size(100%, 96px);
  @include box-sizing;
  border-bottom: 1px solid #ddd;
  text-indent: 20px;
  @include font(24px, 96px, normal, left, #000);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
